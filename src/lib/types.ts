export type PaymentStatus = "draft" | "pending" | "paid" | "overdue" | "cancelled";

export type ReminderTone = "polite" | "professional" | "urgent";

export interface Business {
  id: string;
  name: string;
  email: string;
  currency: string;
  country: string;
  businessType: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  totalInvoiced?: number;
  outstandingBalance?: number;
}

export interface InvoiceItem {
  id: string;
  invoiceId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  businessId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: PaymentStatus;
  currency: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // e.g. 10 for 10%
  taxAmount: number;
  discountRate: number; // e.g. 5 for 5%
  discountAmount: number;
  totalAmount: number;
  notes?: string;
  paypalOrderId?: string;
  paidAt?: string;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  currency: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  paypalOrderId?: string;
  paypalCaptureId?: string;
  payerEmail?: string;
  paidAt: string;
  paymentMethod: "PAYPAL" | "CREDIT_CARD" | "DEMO_SIMULATED";
}

export interface Reminder {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  dueDate: string;
  amountDue: number;
  currency: string;
  tone: ReminderTone;
  messageContent: string;
  status: "draft" | "approved" | "sent";
  sentAt?: string;
  createdAt: string;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  toolCalls?: {
    toolName: string;
    args: Record<string, any>;
    result?: any;
    requiresConfirmation?: boolean;
    confirmed?: boolean;
  }[];
}

export interface AnalyticsSummary {
  totalRevenue: number;
  paidInvoicesCount: number;
  pendingAmount: number;
  pendingCount: number;
  overdueAmount: number;
  overdueCount: number;
  collectionRate: number;
  averagePaymentDays: number;
  revenueByMonth: { month: string; revenue: number; invoices: number }[];
  statusDistribution: { status: string; count: number; value: number }[];
}
