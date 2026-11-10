import { computeAnalytics, INITIAL_INVOICES, INITIAL_CUSTOMERS, INITIAL_TRANSACTIONS, INITIAL_REMINDERS } from "../demo/demoStore";
import { formatCurrency, formatDate } from "../utils";

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  };
}

export const AI_TOOLS: ToolDefinition[] = [
  {
    name: "get_revenue_summary",
    description: "Get the current business revenue summary, collection rate, paid, pending, and overdue totals.",
    parameters: {
      type: "object",
      properties: {
        timeframe: {
          type: "string",
          enum: ["all_time", "this_month", "last_month"],
          description: "Timeframe for revenue calculations",
        },
      },
    },
  },
  {
    name: "get_invoices",
    description: "Retrieve invoices with optional status filter (paid, pending, overdue, draft).",
    parameters: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["all", "paid", "pending", "overdue", "draft"],
          description: "Filter invoices by payment status",
        },
        limit: {
          type: "number",
          description: "Maximum number of invoices to return",
        },
      },
    },
  },
  {
    name: "get_overdue_invoices",
    description: "Get all overdue invoices that have passed their due dates without payment.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_customer_details",
    description: "Look up customer profile, contact information, and outstanding payment balance.",
    parameters: {
      type: "object",
      properties: {
        customerNameOrEmail: {
          type: "string",
          description: "Name or email of the customer",
        },
      },
      required: ["customerNameOrEmail"],
    },
  },
  {
    name: "get_transaction_history",
    description: "Get recent settled payments and PayPal transaction records.",
    parameters: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of transactions to fetch",
        },
      },
    },
  },
  {
    name: "generate_payment_reminder",
    description: "Generate a drafted payment reminder message for a customer with an overdue or pending invoice.",
    parameters: {
      type: "object",
      properties: {
        invoiceIdOrNumber: {
          type: "string",
          description: "The invoice ID or invoice number (e.g. INV-2026-0002)",
        },
        tone: {
          type: "string",
          enum: ["polite", "professional", "urgent"],
          description: "Tone of the reminder notice",
        },
      },
      required: ["invoiceIdOrNumber"],
    },
  },
  {
    name: "create_invoice",
    description: "Propose creating a new draft invoice. Requires user confirmation before saving to database.",
    parameters: {
      type: "object",
      properties: {
        customerName: { type: "string" },
        customerEmail: { type: "string" },
        itemDescription: { type: "string" },
        unitPrice: { type: "number" },
        quantity: { type: "number" },
        dueDays: { type: "number", description: "Number of days from now when payment is due" },
      },
      required: ["customerName", "itemDescription", "unitPrice"],
    },
  },
  {
    name: "get_payment_analytics",
    description: "Retrieve comprehensive collection rate metrics and monthly revenue distribution.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
];

/**
 * Executes a verified backend tool using real data
 */
export async function executeTool(toolName: string, args: Record<string, any>, contextData?: any) {
  const invoices = contextData?.invoices || INITIAL_INVOICES;
  const customers = contextData?.customers || INITIAL_CUSTOMERS;
  const transactions = contextData?.transactions || INITIAL_TRANSACTIONS;

  switch (toolName) {
    case "get_revenue_summary": {
      const analytics = computeAnalytics(invoices);
      return {
        totalRevenue: analytics.totalRevenue,
        formattedTotalRevenue: formatCurrency(analytics.totalRevenue),
        pendingAmount: analytics.pendingAmount,
        formattedPendingAmount: formatCurrency(analytics.pendingAmount),
        overdueAmount: analytics.overdueAmount,
        formattedOverdueAmount: formatCurrency(analytics.overdueAmount),
        collectionRate: `${analytics.collectionRate}%`,
        paidInvoicesCount: analytics.paidInvoicesCount,
      };
    }

    case "get_invoices": {
      const status = args.status || "all";
      const limit = args.limit || 10;
      const filtered = status === "all" ? invoices : invoices.filter((i: any) => i.status === status);
      return filtered.slice(0, limit).map((i: any) => ({
        id: i.id,
        invoiceNumber: i.invoiceNumber,
        customerName: i.customerName,
        totalAmount: formatCurrency(i.totalAmount, i.currency),
        status: i.status,
        dueDate: formatDate(i.dueDate),
      }));
    }

    case "get_overdue_invoices": {
      const overdue = invoices.filter((i: any) => i.status === "overdue");
      return overdue.map((i: any) => ({
        id: i.id,
        invoiceNumber: i.invoiceNumber,
        customerName: i.customerName,
        customerEmail: i.customerEmail,
        amountDue: formatCurrency(i.totalAmount, i.currency),
        dueDate: formatDate(i.dueDate),
        daysOverdue: Math.max(1, Math.floor((Date.now() - new Date(i.dueDate).getTime()) / (1000 * 60 * 60 * 24))),
      }));
    }

    case "get_customer_details": {
      const query = (args.customerNameOrEmail || "").toLowerCase();
      const match = customers.find(
        (c: any) => c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query)
      );
      if (!match) {
        return { error: `Customer matching "${args.customerNameOrEmail}" was not found.` };
      }
      const customerInvoices = invoices.filter((i: any) => i.customerId === match.id);
      return {
        id: match.id,
        name: match.name,
        email: match.email,
        company: match.company,
        outstandingBalance: formatCurrency(match.outstandingBalance || 0),
        invoicesCount: customerInvoices.length,
      };
    }

    case "get_transaction_history": {
      const limit = args.limit || 10;
      return transactions.slice(0, limit).map((t: any) => ({
        id: t.id,
        invoiceNumber: t.invoiceNumber,
        customerName: t.customerName,
        amount: formatCurrency(t.amount, t.currency),
        paymentMethod: t.paymentMethod,
        paypalOrderId: t.paypalOrderId,
        status: t.status,
        paidAt: formatDate(t.paidAt),
      }));
    }

    case "generate_payment_reminder": {
      const query = (args.invoiceIdOrNumber || "").toLowerCase();
      const inv = invoices.find(
        (i: any) => i.id.toLowerCase() === query || i.invoiceNumber.toLowerCase() === query
      );
      if (!inv) {
        return { error: `Invoice "${args.invoiceIdOrNumber}" not found.` };
      }
      const tone = args.tone || (inv.status === "overdue" ? "urgent" : "professional");
      let message = "";
      if (tone === "urgent") {
        message = `Urgent Notice: Invoice ${inv.invoiceNumber} for ${formatCurrency(inv.totalAmount, inv.currency)} was due on ${formatDate(inv.dueDate)}. Please submit payment via PayPal to keep your account in good standing.`;
      } else if (tone === "polite") {
        message = `Hi ${inv.customerName}, just a gentle reminder that invoice ${inv.invoiceNumber} (${formatCurrency(inv.totalAmount, inv.currency)}) is due on ${formatDate(inv.dueDate)}. Thank you for your business!`;
      } else {
        message = `Dear ${inv.customerName}, this is a reminder regarding invoice ${inv.invoiceNumber} for ${formatCurrency(inv.totalAmount, inv.currency)}, due on ${formatDate(inv.dueDate)}. Secure checkout link: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pay/${inv.id}`;
      }

      return {
        invoiceId: inv.id,
        invoiceNumber: inv.invoiceNumber,
        customerName: inv.customerName,
        customerEmail: inv.customerEmail,
        tone,
        draftMessage: message,
        requiresConfirmation: true,
      };
    }

    case "create_invoice": {
      return {
        customerName: args.customerName,
        customerEmail: args.customerEmail,
        itemDescription: args.itemDescription,
        quantity: args.quantity || 1,
        unitPrice: args.unitPrice,
        totalAmount: (args.quantity || 1) * args.unitPrice,
        dueDays: args.dueDays || 14,
        requiresConfirmation: true,
        action: "CREATE_INVOICE_PROPOSAL",
      };
    }

    case "get_payment_analytics": {
      return computeAnalytics(invoices);
    }

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
