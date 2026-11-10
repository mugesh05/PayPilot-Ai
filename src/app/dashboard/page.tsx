"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  CreditCard,
  Clock,
  AlertCircle,
  Percent,
  Plus,
  Bot,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useFintechStore } from "@/lib/store/useFintechStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PayPalModal } from "@/components/payments/PayPalModal";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  Paid: "#10b981",
  Pending: "#0ea5e9",
  Overdue: "#f43f5e",
};

export default function DashboardPage() {
  const { invoices, transactions, analytics, updateInvoiceStatus, resetToDemoDefaults } = useFintechStore();
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<any>(null);

  const overdueInvoices = invoices.filter((i) => i.status === "overdue");

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time cashflow metrics, PayPal order settlements, and AI recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDemoDefaults}
            title="Reset to fresh demo dataset"
            className="text-slate-600"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Demo
          </Button>

          <Link href="/assistant">
            <Button variant="secondary" size="sm" className="gap-1.5 bg-slate-900">
              <Bot className="w-4 h-4 text-blue-400" />
              <span>Ask AI Co-Pilot</span>
            </Button>
          </Link>

          <Link href="/invoices/new">
            <Button variant="primary" size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" />
              <span>New Invoice</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* AI Proactive Insight Alert */}
      {overdueInvoices.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-blue-800/40">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-white">AI Financial Insight</h3>
                <span className="text-[10px] bg-blue-400/20 text-blue-200 border border-blue-300/30 px-2 py-0.5 rounded-full font-mono uppercase">
                  Action Recommended
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                You have {overdueInvoices.length} overdue invoice ({formatCurrency(analytics.overdueAmount)}) from{" "}
                <span className="font-semibold text-white">{overdueInvoices[0]?.customerName}</span>. Generate an intelligent reminder notice to accelerate recovery.
              </p>
            </div>
          </div>
          <Link href="/reminders">
            <Button
              size="sm"
              className="bg-white text-slate-900 hover:bg-slate-100 whitespace-nowrap text-xs font-semibold"
            >
              Draft AI Reminder
            </Button>
          </Link>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Revenue */}
        <Card className="p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatCurrency(analytics.totalRevenue)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>100% Settled via PayPal</span>
          </div>
        </Card>

        {/* Paid Invoices */}
        <Card className="p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Paid Invoices</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{analytics.paidInvoicesCount}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <span>Avg {analytics.averagePaymentDays} days to pay</span>
          </div>
        </Card>

        {/* Pending Payments */}
        <Card className="p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatCurrency(analytics.pendingAmount)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-sky-600 font-medium">
            <span>{analytics.pendingCount} awaiting approval</span>
          </div>
        </Card>

        {/* Overdue Invoices */}
        <Card className="p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Overdue</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-600">
            {formatCurrency(analytics.overdueAmount)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-500 font-medium">
            <span>{analytics.overdueCount} require follow-up</span>
          </div>
        </Card>

        {/* Collection Rate */}
        <Card className="p-5">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Collection Rate</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{analytics.collectionRate}%</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <span>Healthy benchmark</span>
          </div>
        </Card>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue Flow & Invoicing</CardTitle>
              <span className="text-xs text-slate-500">Monthly billing trends and cash receipts</span>
            </div>
            <Badge variant="paypal">PayPal REST API</Badge>
          </CardHeader>
          <CardContent className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.revenueByMonth}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0070ba" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0070ba" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  formatter={(value: any) => [`$${value}`, "Revenue"]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "12px",
                    color: "#fff",
                    border: "none",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0070ba"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
            <span className="text-xs text-slate-500">Distribution of active accounts receivable</span>
          </CardHeader>
          <CardContent className="h-64 flex flex-col justify-between">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={analytics.statusDistribution}
                  dataKey="value"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={4}
                >
                  {analytics.statusDistribution.map((entry) => (
                    <Cell
                      key={`cell-${entry.status}`}
                      fill={STATUS_COLORS[entry.status] || "#94a3b8"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`$${val}`, "Amount"]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "8px",
                    color: "#fff",
                    border: "none",
                    fontSize: "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
              {analytics.statusDistribution.map((item) => (
                <div key={item.status}>
                  <div className="flex items-center justify-center gap-1 text-slate-500">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[item.status] }}
                    />
                    <span>{item.status}</span>
                  </div>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {formatCurrency(item.value)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Section: Recent Invoices & Settled Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoices List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Invoices</CardTitle>
              <span className="text-xs text-slate-500">Manage client billing and statuses</span>
            </div>
            <Link
              href="/invoices"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {invoices.slice(0, 4).map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 px-6 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">
                        {inv.invoiceNumber}
                      </span>
                      <Badge
                        variant={
                          inv.status === "paid"
                            ? "success"
                            : inv.status === "overdue"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {inv.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {inv.customerName} • Due {formatDate(inv.dueDate)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-semibold text-sm text-slate-900">
                        {formatCurrency(inv.totalAmount, inv.currency)}
                      </div>
                    </div>

                    {inv.status !== "paid" ? (
                      <Button
                        size="sm"
                        variant="paypal"
                        onClick={() => setSelectedInvoiceForPayment(inv)}
                        className="text-xs px-2.5 py-1 h-8"
                      >
                        Pay Sandbox
                      </Button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Paid
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Settled Transactions</CardTitle>
              <span className="text-xs text-slate-500">Captured payments and order references</span>
            </div>
            <Link
              href="/transactions"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No transactions recorded yet. Complete a sandbox checkout above.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {transactions.slice(0, 4).map((txn) => (
                  <div
                    key={txn.id}
                    className="p-4 px-6 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">
                          {txn.customerName}
                        </span>
                        <Badge variant="success">Completed</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 font-mono">
                        {txn.paypalOrderId} • {formatDate(txn.paidAt)}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold text-sm text-emerald-600">
                        +{formatCurrency(txn.amount, txn.currency)}
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                        {txn.paymentMethod}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Interactive PayPal Checkout Modal */}
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
