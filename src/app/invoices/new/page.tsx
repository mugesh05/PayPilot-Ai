"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, ShieldCheck, Check } from "lucide-react";
import { useFintechStore } from "@/lib/store/useFintechStore";
import { calculateInvoiceTotals, formatCurrency, generateInvoiceNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NewInvoicePage() {
  const router = useRouter();
  const { customers, invoices, createInvoice } = useFintechStore();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customers[0]?.id || ""
  );
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]
  );
  const [taxRate, setTaxRate] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [notes, setNotes] = useState("Net 14 days. Thank you for your partnership!");

  const [items, setItems] = useState([
    {
      id: "item_init_1",
      description: "AI Payment Automation Consulting",
      quantity: 1,
      unitPrice: 2500,
      amount: 2500,
    },
  ]);

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    item.amount = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
    updated[index] = item;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item_${Date.now()}`,
        description: "",
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totals = calculateInvoiceTotals(items, taxRate, discountRate);
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const invoiceNumber = generateInvoiceNumber(invoices.length);

    createInvoice({
      businessId: "biz_apex_01",
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerEmail: selectedCustomer.email,
      invoiceNumber,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate,
      status: "pending",
      currency: "USD",
      items,
      subtotal: totals.subtotal,
      taxRate,
      taxAmount: totals.taxAmount,
      discountRate,
      discountAmount: totals.discountAmount,
      totalAmount: totals.totalAmount,
      notes,
    });

    router.push("/invoices");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/invoices"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Invoices</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => router.push("/invoices")}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" className="gap-1.5">
            <Check className="w-4 h-4" />
            <span>Generate & Issue Invoice</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details & Items (2 columns) */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer & Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Client / Customer
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company || c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Due Date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Currency
                  </label>
                  <input
                    type="text"
                    disabled
                    value="USD — US Dollar"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Line Items</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={handleAddItem} className="gap-1 text-xs">
                <Plus className="w-3.5 h-3.5" /> Add Line
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/60 flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Item description..."
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                      required
                      className="w-full bg-white text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="w-16">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                      required
                      className="w-full bg-white text-xs px-2.5 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-center"
                    />
                  </div>

                  <div className="w-24">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Price"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, "unitPrice", Number(e.target.value))}
                      required
                      className="w-full bg-white text-xs px-2.5 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none text-right font-mono"
                    />
                  </div>

                  <div className="w-24 text-right font-mono text-xs font-semibold text-slate-800">
                    {formatCurrency(item.amount)}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={items.length <= 1}
                    className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-20 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="p-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Invoice Notes & Instructions
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
            />
          </Card>
        </div>

        {/* Totals & Summary Sidebar (1 column) */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              Invoice Calculation
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-slate-900">{formatCurrency(totals.subtotal)}</span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>Tax Rate (%)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-16 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-right text-xs"
                  />
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tax Amount</span>
                  <span className="font-mono">{formatCurrency(totals.taxAmount)}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>Discount (%)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(Number(e.target.value))}
                    className="w-16 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-right text-xs"
                  />
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Discount Amount</span>
                  <span className="font-mono">-{formatCurrency(totals.discountAmount)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex justify-between items-center text-sm font-bold text-slate-900">
                <span>Total Due</span>
                <span className="text-xl text-blue-700 font-mono">
                  {formatCurrency(totals.totalAmount)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0070ba] flex-shrink-0 mt-0.5" />
              <span>
                Calculated strictly server-side using decimal-safe arithmetic and ready for instant PayPal Sandbox capture.
              </span>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full shadow-md">
              Confirm & Create
            </Button>
          </Card>
        </div>
      </div>
    </form>
  );
}
