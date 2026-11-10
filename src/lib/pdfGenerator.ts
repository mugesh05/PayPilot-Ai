import jsPDF from "jspdf";
import { Invoice } from "./types";
import { formatCurrency, formatDate } from "./utils";

export function generateInvoicePDF(invoice: Invoice) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Top Accent Banner (PayPal Blue)
  doc.setFillColor(0, 112, 186);
  doc.rect(0, 0, 210, 8, "F");

  // Company / Brand Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("PayPilot AI", 16, 26);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("Financial Operations & PayPal Invoicing", 16, 32);
  doc.text("support@paypilot-ai.com", 16, 37);

  // Invoice Title and Metadata (Right aligned)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(0, 48, 135); // deep navy
  doc.text("INVOICE", 194, 26, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Invoice No: ${invoice.invoiceNumber}`, 194, 32, { align: "right" });
  doc.text(`Issue Date: ${formatDate(invoice.issueDate)}`, 194, 37, { align: "right" });
  doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 194, 42, { align: "right" });
  doc.text(`Status: ${invoice.status.toUpperCase()}`, 194, 47, { align: "right" });

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(16, 54, 194, 54);

  // Bill To Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("BILL TO:", 16, 62);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text(invoice.customerName, 16, 68);
  doc.setTextColor(100, 116, 139);
  doc.text(invoice.customerEmail, 16, 73);

  // Line Items Table Header
  const tableTop = 85;
  doc.setFillColor(248, 250, 252);
  doc.rect(16, tableTop, 178, 9, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("DESCRIPTION", 20, tableTop + 6);
  doc.text("QTY", 125, tableTop + 6, { align: "right" });
  doc.text("UNIT PRICE", 155, tableTop + 6, { align: "right" });
  doc.text("AMOUNT", 190, tableTop + 6, { align: "right" });

  // Line Items
  let curY = tableTop + 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);

  invoice.items.forEach((item) => {
    doc.text(item.description, 20, curY);
    doc.text(String(item.quantity), 125, curY, { align: "right" });
    doc.text(formatCurrency(item.unitPrice, invoice.currency), 155, curY, { align: "right" });
    doc.text(formatCurrency(item.amount, invoice.currency), 190, curY, { align: "right" });
    curY += 8;
  });

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(16, curY + 2, 194, curY + 2);

  // Totals Section (Right side)
  const totalsY = curY + 12;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Subtotal:", 145, totalsY, { align: "right" });
  doc.setTextColor(15, 23, 42);
  doc.text(formatCurrency(invoice.subtotal, invoice.currency), 190, totalsY, { align: "right" });

  if (invoice.taxAmount > 0) {
    doc.setTextColor(100, 116, 139);
    doc.text(`Tax (${invoice.taxRate}%):`, 145, totalsY + 7, { align: "right" });
    doc.setTextColor(15, 23, 42);
    doc.text(formatCurrency(invoice.taxAmount, invoice.currency), 190, totalsY + 7, { align: "right" });
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(0, 112, 186);
  doc.text("Total Due:", 145, totalsY + 16, { align: "right" });
  doc.text(formatCurrency(invoice.totalAmount, invoice.currency), 190, totalsY + 16, { align: "right" });

  // Notes & Payment Instructions (Bottom)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("Payment Instructions:", 16, totalsY + 30);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Pay securely using PayPal or major credit/debit cards.\nPayment Link: ${process.env.NEXT_PUBLIC_APP_URL || "https://paypilot-ai.vercel.app"}/pay/${invoice.id}\n${invoice.notes || "Thank you for your business!"}`,
    16,
    totalsY + 36
  );

  // Footer Note
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Generated securely by PayPilot AI — PayPal Developer Platform", 105, 285, {
    align: "center",
  });

  // Save PDF to browser
  doc.save(`${invoice.invoiceNumber}.pdf`);
}
