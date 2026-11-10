"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Download,
  Link as LinkIcon,
  CreditCard,
  Trash2,
  Check,
  Filter,
  FileText,
} from "lucide-react";
import { useFintechStore } from "@/lib/store/useFintechStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PayPalModal } from "@/components/payments/PayPalModal";
import { generateInvoicePDF } from "@/lib/pdfGenerator";
import { PaymentStatus } from "@/lib/types";

export default function InvoicesPage() {
  const { invoices, updateInvoiceStatus, deleteInvoice } = useFintechStore();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<any>(null);
  const [copiedInvoiceId, setCopiedInvoiceId] = useState<string | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCopyLink = (invoiceId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const paymentUrl = `${origin}/pay/${invoiceId}`;
    navigator.clipboard.writeText(paymentUrl);
    setCopiedInvoiceId(invoiceId);
    setTimeout(() => setCopiedInvoiceId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invoice Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, track, export printable PDFs, and collect payments via PayPal.
          </p>
        </div>

        <Link href="/invoices/new">
          <Button variant="primary" size="md" className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          {["all", "pending", "paid", "overdue", "draft"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice # or customer..."
            className="w-full bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
          />
        </div>
      </Card>

      {/* Invoices Table Card */}
      <Card className="overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No invoices found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No records match your selected filter or search query. Click 'Create Invoice' to generate a new invoice.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-6">Invoice #</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Issue / Due Date</th>
                  <th className="py-3 px-6">Amount</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Invoice # */}
                    <td className="py-4 px-6 font-mono font-semibold text-slate-900">
                      {inv.invoiceNumber}
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-900">{inv.customerName}</div>
                      <div className="text-xs text-slate-500">{inv.customerEmail}</div>
                    </td>

                    {/* Dates */}
                    <td className="py-4 px-6 text-xs text-slate-600">
                      <div>Issued: {formatDate(inv.issueDate)}</div>
                      <div className="text-slate-500 mt-0.5">Due: {formatDate(inv.dueDate)}</div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">
                        {formatCurrency(inv.totalAmount, inv.currency)}
                      </div>
                      {inv.taxAmount > 0 && (
                        <div className="text-[11px] text-slate-400">
                          Incl. {formatCurrency(inv.taxAmount, inv.currency)} tax
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          inv.status === "paid"
                            ? "success"
                            : inv.status === "overdue"
                            ? "danger"
                            : inv.status === "draft"
                            ? "neutral"
                            : "warning"
                        }
                        className="capitalize"
                      >
                        {inv.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Download Printable PDF */}
                        <button
                          onClick={() => generateInvoicePDF(inv)}
                          title="Download Printable PDF"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* Copy Checkout Link */}
                        <button
                          onClick={() => handleCopyLink(inv.id)}
                          title="Copy Public Payment Link"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          {copiedInvoiceId === inv.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <LinkIcon className="w-4 h-4" />
                          )}
                        </button>

                        {/* Pay with PayPal Sandbox */}
                        {inv.status !== "paid" ? (
                          <Button
                            size="sm"
                            variant="paypal"
                            className="text-xs px-2.5 py-1 h-8"
                            onClick={() => setSelectedInvoiceForPayment(inv)}
                          >
                            Pay PayPal
                          </Button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-semibold px-2">
                            Settled
                          </span>
                        )}

                        {/* Delete Draft */}
                        {inv.status === "draft" && (
                          <button
                            onClick={() => deleteInvoice(inv.id)}
                            title="Delete Draft"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* PayPal Sandbox Checkout Modal */}
      {selectedInvoiceForPayment && (
        <PayPalModal
          isOpen={Boolean(selectedInvoiceForPayment)}
          onClose={() => setSelectedInvoiceForPayment(null)}
          invoice={selectedInvoiceForPayment}
          onPaymentSuccess={(captureData) => {
            updateInvoiceStatus(selectedInvoiceForPayment.id, "paid", captureData);
          }}
        />
      )}
    </div>
  );
}
