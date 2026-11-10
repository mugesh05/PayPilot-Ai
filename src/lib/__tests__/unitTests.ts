import { calculateInvoiceTotals, generateInvoiceNumber, formatCurrency } from "../utils";
import { executeTool } from "../ai/tools";
import { computeAnalytics, INITIAL_INVOICES, INITIAL_CUSTOMERS } from "../demo/demoStore";

export async function runAllTests() {
  const results: { test: string; passed: boolean; error?: string }[] = [];

  function assert(condition: boolean, testName: string, errorMsg?: string) {
    if (condition) {
      results.push({ test: testName, passed: true });
    } else {
      results.push({ test: testName, passed: false, error: errorMsg || "Assertion failed" });
    }
  }

  // 1. Invoice Calculations Test
  try {
    const items = [
      { quantity: 2, unitPrice: 100 },
      { quantity: 1, unitPrice: 50 },
    ];
    // subtotal = 250, discount 10% = 25, taxable = 225, tax 10% = 22.50, total = 247.50
    const totals = calculateInvoiceTotals(items, 10, 10);
    assert(totals.subtotal === 250, "Invoice Subtotal Calculation", `Expected 250, got ${totals.subtotal}`);
    assert(totals.discountAmount === 25, "Discount Calculation", `Expected 25, got ${totals.discountAmount}`);
    assert(totals.taxAmount === 22.5, "Tax Calculation", `Expected 22.5, got ${totals.taxAmount}`);
    assert(totals.totalAmount === 247.5, "Total Amount Calculation", `Expected 247.5, got ${totals.totalAmount}`);
  } catch (e: any) {
    assert(false, "Invoice Calculations Test", e.message);
  }

  // 2. Invoice Number Generation Test
  try {
    const invNum = generateInvoiceNumber(4);
    assert(invNum.startsWith("INV-") && invNum.endsWith("-0005"), "Invoice Number Sequence", `Got ${invNum}`);
  } catch (e: any) {
    assert(false, "Invoice Number Sequence", e.message);
  }

  // 3. Analytics Calculation Test
  try {
    const analytics = computeAnalytics(INITIAL_INVOICES);
    assert(analytics.totalRevenue === 4500, "Analytics Settled Revenue", `Expected 4500, got ${analytics.totalRevenue}`);
    assert(analytics.overdueAmount === 2800, "Analytics Overdue Amount", `Expected 2800, got ${analytics.overdueAmount}`);
    assert(analytics.collectionRate > 0 && analytics.collectionRate <= 100, "Analytics Collection Rate Range");
  } catch (e: any) {
    assert(false, "Analytics Calculation Test", e.message);
  }

  // 4. AI Tool Execution: get_revenue_summary
  try {
    const summary = await executeTool("get_revenue_summary", {});
    assert(summary.totalRevenue === 4500, "AI Tool: get_revenue_summary matches DB");
    assert(summary.overdueAmount === 2800, "AI Tool: get_revenue_summary overdue verified");
  } catch (e: any) {
    assert(false, "AI Tool: get_revenue_summary", e.message);
  }

  // 5. AI Tool Execution: get_overdue_invoices
  try {
    const overdue = await executeTool("get_overdue_invoices", {});
    assert(Array.isArray(overdue) && overdue.length === 1, "AI Tool: get_overdue_invoices detection");
    assert(overdue[0].customerName === "Marcus Vance", "AI Tool: overdue customer identified");
  } catch (e: any) {
    assert(false, "AI Tool: get_overdue_invoices", e.message);
  }

  // 6. AI Tool Execution: generate_payment_reminder
  try {
    const reminder = await executeTool("generate_payment_reminder", {
      invoiceIdOrNumber: "INV-2026-0002",
      tone: "urgent",
    });
    assert(reminder.customerName === "Marcus Vance", "AI Tool: Reminder Customer");
    assert(reminder.draftMessage.includes("URGENT") || reminder.draftMessage.includes("Urgent"), "AI Tool: Urgent Tone Applied");
    assert(reminder.requiresConfirmation === true, "AI Tool: Safety Human Confirmation Required");
  } catch (e: any) {
    assert(false, "AI Tool: generate_payment_reminder", e.message);
  }

  // 7. AI Tool Execution: get_customer_details
  try {
    const cust = await executeTool("get_customer_details", { customerNameOrEmail: "Marcus" });
    assert(cust.name === "Marcus Vance", "AI Tool: get_customer_details lookup");
    assert(cust.outstandingBalance === "$2,800.00", "AI Tool: accurate customer balance");
  } catch (e: any) {
    assert(false, "AI Tool: get_customer_details", e.message);
  }

  return results;
}
