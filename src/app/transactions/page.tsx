"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Search,
  CheckCircle2,
  ShieldCheck,
  Download,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { useFintechStore } from "@/lib/store/useFintechStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  const { transactions, analytics } = useFintechStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = transactions.filter(
    (t) =>
      t.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.paypalOrderId && t.paypalOrderId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.payerEmail && t.payerEmail.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payment Transactions</h1>
          <p className="text-sm text-slate-500 mt-1">
            Auditable records of settled PayPal orders, captures, and authorization receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="paypal" className="px-3 py-1">
            PayPal Orders API v2
          </Badge>
        </div>
      </div>

      {/* Top summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Captured
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(analytics.totalRevenue)}
          </div>
          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% verified settlement
          </p>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Processed Orders
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{transactions.length}</div>
          <p className="text-xs text-slate-500 mt-1">Via PayPal Sandbox Checkout</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Duplicate Protection
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">Active</div>
          <p className="text-xs text-blue-600 mt-1 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Idempotent webhook processing
          </p>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID, invoice, or customer..."
            className="w-full bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
          />
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            No transactions matched your search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-6">Invoice #</th>
                  <th className="py-3 px-6">Customer / Payer</th>
                  <th className="py-3 px-6">PayPal Order & Capture ID</th>
                  <th className="py-3 px-6">Settlement Date</th>
                  <th className="py-3 px-6">Method</th>
                  <th className="py-3 px-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-mono font-semibold text-slate-900">
                      {t.invoiceNumber}
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-900">{t.customerName}</div>
                      <div className="text-xs text-slate-400 font-mono">
                        {t.payerEmail || "buyer.sandbox@paypal.com"}
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-xs text-slate-600">
                      <div>Order: {t.paypalOrderId || "ORD-SBX-LIVE"}</div>
                      <div className="text-slate-400">
                        Capture: {t.paypalCaptureId || "CAP-SBX-LIVE"}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-600">
                      {formatDate(t.paidAt)}
                    </td>

                    <td className="py-4 px-6">
                      <Badge variant="paypal" className="text-[10px]">
                        {t.paymentMethod}
                      </Badge>
                    </td>

                    <td className="py-4 px-6 text-right font-bold text-emerald-600 font-mono text-base">
                      +{formatCurrency(t.amount, t.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
