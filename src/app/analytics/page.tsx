"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Percent,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useFintechStore } from "@/lib/store/useFintechStore";
import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

export default function AnalyticsPage() {
  const { invoices, customers, analytics } = useFintechStore();
  const [timeRange, setTimeRange] = useState("this_year");

  const exportCSV = () => {
    const headers = ["Invoice Number", "Customer", "Due Date", "Status", "Amount", "Currency"];
    const rows = invoices.map((i) => [
      i.invoiceNumber,
      `"${i.customerName}"`,
      i.dueDate,
      i.status,
      i.totalAmount.toFixed(2),
      i.currency,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `paypilot_financial_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Analytics & Reports</h1>
          <p className="text-sm text-slate-500 mt-1">
            Evaluate collection velocity, cashflow projections, and customer payment discipline.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200/80 w-fit">
        {[
          { label: "Last 7 Days", value: "7d" },
          { label: "Last 30 Days", value: "30d" },
          { label: "Last 90 Days", value: "90d" },
          { label: "This Year", value: "this_year" },
        ].map((range) => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              timeRange === range.value
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Settled Revenue
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(analytics.totalRevenue)}
          </div>
          <span className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +24% vs previous quarter
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Collection Efficiency
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{analytics.collectionRate}%</div>
          <span className="text-xs text-blue-600 font-medium mt-1 flex items-center gap-1">
            <Percent className="w-3.5 h-3.5" /> Target: &gt;85%
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Avg Days to Pay (DSO)
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {analytics.averagePaymentDays} days
          </div>
          <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Fast settlement cycle
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Overdue Balance
          </span>
          <div className="text-2xl font-bold text-rose-600 mt-1">
            {formatCurrency(analytics.overdueAmount)}
          </div>
          <span className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {analytics.overdueCount} account(s)
          </span>
        </Card>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Invoicing Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Invoice Revenue</CardTitle>
            <span className="text-xs text-slate-500">Actual billing volume settled</span>
          </CardHeader>
          <CardContent className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  formatter={(v: any) => [`$${v}`, "Revenue"]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="revenue" fill="#0070ba" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Accounts Receivable Aging</CardTitle>
            <span className="text-xs text-slate-500">Current capital allocation by invoice state</span>
          </CardHeader>
          <CardContent className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={analytics.statusDistribution}
                margin={{ left: 10, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(v) => `$${v}`}
                />
                <YAxis dataKey="status" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(v: any) => [`$${v}`, "Total Volume"]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Customer Payment Performance Ledger */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Payment Reliability</CardTitle>
          <span className="text-xs text-slate-500">Total invoiced and outstanding balances per client</span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Company</th>
                  <th className="py-3 px-6">Total Invoiced</th>
                  <th className="py-3 px-6">Outstanding</th>
                  <th className="py-3 px-6">Risk Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => {
                  const custInvoices = invoices.filter((i) => i.customerId === c.id);
                  const overdue = custInvoices.some((i) => i.status === "overdue");

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/60">
                      <td className="py-4 px-6 font-medium text-slate-900">{c.name}</td>
                      <td className="py-4 px-6 text-slate-500 text-xs">{c.company || "—"}</td>
                      <td className="py-4 px-6 font-mono text-slate-900">
                        {formatCurrency(c.totalInvoiced || 0)}
                      </td>
                      <td className="py-4 px-6 font-mono font-semibold">
                        <span
                          className={
                            (c.outstandingBalance || 0) > 0 ? "text-rose-600" : "text-emerald-600"
                          }
                        >
                          {formatCurrency(c.outstandingBalance || 0)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={overdue ? "danger" : "success"} className="text-[10px]">
                          {overdue ? "Overdue Notice Sent" : "Prime Account"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
