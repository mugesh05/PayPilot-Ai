import { Business, Customer, Invoice, PaymentTransaction, Reminder, AnalyticsSummary } from "../types";

export const INITIAL_BUSINESS: Business = {
  id: "biz_apex_01",
  name: "Apex Cloud Labs Inc.",
  email: "billing@apexcloudlabs.io",
  currency: "USD",
  country: "US",
  businessType: "SaaS & Product Studio",
  createdAt: "2026-09-01T08:00:00Z",
};

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "cust_01",
    businessId: "biz_apex_01",
    name: "Sophia Turner",
    email: "sophia@lumina-ai.com",
    company: "Lumina AI",
    phone: "+1 (415) 890-2134",
    address: "550 Montgomery St, San Francisco, CA 94111",
    notes: "Enterprise AI customer. Net 15 payment terms.",
    createdAt: "2026-09-10T10:00:00Z",
    totalInvoiced: 4500,
    outstandingBalance: 0,
  },
  {
    id: "cust_02",
    businessId: "biz_apex_01",
    name: "Marcus Vance",
    email: "marcus@vancetech.io",
    company: "Vance Robotics",
    phone: "+1 (212) 555-0199",
    address: "101 Broadway, Suite 400, New York, NY 10006",
    notes: "Series A robotics startup. Retainer account.",
    createdAt: "2026-09-15T14:30:00Z",
    totalInvoiced: 2800,
    outstandingBalance: 2800,
  },
  {
    id: "cust_03",
    businessId: "biz_apex_01",
    name: "Elena Rostova",
    email: "elena@novacrest.co",
    company: "Novacrest Capital",
    phone: "+1 (312) 431-8800",
    address: "200 S LaSalle St, Chicago, IL 60604",
    notes: "Fintech venture advisory.",
    createdAt: "2026-10-01T09:15:00Z",
    totalInvoiced: 6510,
    outstandingBalance: 6510,
  },
  {
    id: "cust_04",
    businessId: "biz_apex_01",
    name: "David Kim",
    email: "dkim@zenithflow.dev",
    company: "Zenith Flow",
    phone: "+1 (206) 555-9821",
    address: "400 Pine St, Seattle, WA 98101",
    notes: "Developer tooling agency.",
    createdAt: "2026-10-05T16:00:00Z",
    totalInvoiced: 1750,
    outstandingBalance: 1750,
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv_01",
    businessId: "biz_apex_01",
    customerId: "cust_01",
    customerName: "Sophia Turner",
    customerEmail: "sophia@lumina-ai.com",
    invoiceNumber: "INV-2026-0001",
    issueDate: "2026-10-01",
    dueDate: "2026-10-15",
    status: "paid",
    currency: "USD",
    items: [
      {
        id: "item_01",
        description: "Full-stack AI Payment Pipeline Development",
        quantity: 1,
        unitPrice: 4500,
        amount: 4500,
      },
    ],
    subtotal: 4500,
    taxRate: 0,
    taxAmount: 0,
    discountRate: 0,
    discountAmount: 0,
    totalAmount: 4500,
    notes: "Thank you for your partnership!",
    paypalOrderId: "ORD-SANDBOX-782910",
    paidAt: "2026-10-12T14:20:00Z",
    createdAt: "2026-10-01T08:00:00Z",
  },
  {
    id: "inv_02",
    businessId: "biz_apex_01",
    customerId: "cust_02",
    customerName: "Marcus Vance",
    customerEmail: "marcus@vancetech.io",
    invoiceNumber: "INV-2026-0002",
    issueDate: "2026-10-10",
    dueDate: "2026-10-24", // Past due relative to current date (Nov 2026)
    status: "overdue",
    currency: "USD",
    items: [
      {
        id: "item_02",
        description: "Monthly Cloud & ML Infrastructure Retainer",
        quantity: 1,
        unitPrice: 2800,
        amount: 2800,
      },
    ],
    subtotal: 2800,
    taxRate: 0,
    taxAmount: 0,
    discountRate: 0,
    discountAmount: 0,
    totalAmount: 2800,
    notes: "Payment due within 14 days of issue.",
    createdAt: "2026-10-10T11:00:00Z",
  },
  {
    id: "inv_03",
    businessId: "biz_apex_01",
    customerId: "cust_03",
    customerName: "Elena Rostova",
    customerEmail: "elena@novacrest.co",
    invoiceNumber: "INV-2026-0003",
    issueDate: "2026-11-01",
    dueDate: "2026-11-15",
    status: "pending",
    currency: "USD",
    items: [
      {
        id: "item_03",
        description: "Fintech Dashboard Architecture & PayPal Checkout Setup",
        quantity: 1,
        unitPrice: 6200,
        amount: 6200,
      },
    ],
    subtotal: 6200,
    taxRate: 5,
    taxAmount: 310,
    discountRate: 0,
    discountAmount: 0,
    totalAmount: 6510,
    notes: "Standard Net 14 invoice.",
    createdAt: "2026-11-01T09:30:00Z",
  },
  {
    id: "inv_04",
    businessId: "biz_apex_01",
    customerId: "cust_04",
    customerName: "David Kim",
    customerEmail: "dkim@zenithflow.dev",
    invoiceNumber: "INV-2026-0004",
    issueDate: "2026-11-05",
    dueDate: "2026-11-20",
    status: "pending",
    currency: "USD",
    items: [
      {
        id: "item_04",
        description: "UI/UX Design Tokens & Accessible Component Library",
        quantity: 1,
        unitPrice: 1750,
        amount: 1750,
      },
    ],
    subtotal: 1750,
    taxRate: 0,
    taxAmount: 0,
    discountRate: 0,
    discountAmount: 0,
    totalAmount: 1750,
    notes: "Payable via PayPal Sandbox or Bank Wire.",
    createdAt: "2026-11-05T14:15:00Z",
  },
];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: "txn_01",
    invoiceId: "inv_01",
    invoiceNumber: "INV-2026-0001",
    customerName: "Sophia Turner",
    amount: 4500,
    currency: "USD",
    status: "COMPLETED",
    paypalOrderId: "ORD-SANDBOX-782910",
    paypalCaptureId: "CAP-SANDBOX-983214",
    payerEmail: "sophia.payer@lumina-ai.com",
    paidAt: "2026-10-12T14:20:00Z",
    paymentMethod: "PAYPAL",
  },
];

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: "rem_01",
    invoiceId: "inv_02",
    invoiceNumber: "INV-2026-0002",
    customerName: "Marcus Vance",
    customerEmail: "marcus@vancetech.io",
    dueDate: "2026-10-24",
    amountDue: 2800,
    currency: "USD",
    tone: "urgent",
    messageContent:
      "Hi Marcus, this is an urgent reminder regarding invoice INV-2026-0002 ($2,800.00 USD) which was due on Oct 24, 2026. Please settle via the secure PayPal checkout link below or contact us if you need assistance.",
    status: "draft",
    createdAt: "2026-11-08T09:00:00Z",
  },
];

export function computeAnalytics(invoices: Invoice[]): AnalyticsSummary {
  const paidInvoices = invoices.filter((i) => i.status === "paid");
  const pendingInvoices = invoices.filter((i) => i.status === "pending");
  const overdueInvoices = invoices.filter((i) => i.status === "overdue");

  const totalRevenue = paidInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const pendingAmount = pendingInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const overdueAmount = overdueInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalBilled = totalRevenue + pendingAmount + overdueAmount;
  const collectionRate = totalBilled > 0 ? Math.round((totalRevenue / totalBilled) * 100) : 100;

  return {
    totalRevenue,
    paidInvoicesCount: paidInvoices.length,
    pendingAmount,
    pendingCount: pendingInvoices.length,
    overdueAmount,
    overdueCount: overdueInvoices.length,
    collectionRate,
    averagePaymentDays: 11,
    revenueByMonth: [
      { month: "Aug", revenue: 3200, invoices: 1 },
      { month: "Sep", revenue: 5800, invoices: 2 },
      { month: "Oct", revenue: 4500, invoices: 1 },
      { month: "Nov (Proj)", revenue: 8260, invoices: 2 },
    ],
    statusDistribution: [
      { status: "Paid", count: paidInvoices.length, value: totalRevenue },
      { status: "Pending", count: pendingInvoices.length, value: pendingAmount },
      { status: "Overdue", count: overdueInvoices.length, value: overdueAmount },
    ],
  };
}
