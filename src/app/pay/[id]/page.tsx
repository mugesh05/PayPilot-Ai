"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  Zap,
} from "lucide-react";
import { INITIAL_INVOICES } from "@/lib/demo/demoStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function InvoicePaymentContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const invoiceId = params?.id as string;

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedInvoices = localStorage.getItem("paypilot_invoices");
      const list = savedInvoices ? JSON.parse(savedInvoices) : INITIAL_INVOICES;
      const found = list.find((i: any) => i.id === invoiceId || i.invoiceNumber === invoiceId);
      if (found) {
        setInvoice(found);
        if (found.status === "paid") setPaymentSuccess(true);
      }
    } catch {
      const found = INITIAL_INVOICES.find((i: any) => i.id === invoiceId);
      if (found) setInvoice(found);
    }
  }, [invoiceId]);

  const handlePayPalCheckout = async () => {
    if (!invoice) return;
    try {
      setLoading(true);
      setErrorMsg(null);

      const createRes = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          amount: invoice.totalAmount,
          currency: invoice.currency,
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok || !createData.success) {
        throw new Error(createData.error || "Failed to initiate PayPal order");
      }

      const orderId = createData.orderId;
      await new Promise((r) => setTimeout(r, 1000));

      const captureRes = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          invoiceId: invoice.id,
          payerEmail: invoice.customerEmail,
        }),
      });

      const captureData = await captureRes.json();
      if (!captureRes.ok || !captureData.success) {
        throw new Error(captureData.error || "PayPal payment capture failed");
      }

      setTransactionData(captureData);
      setPaymentSuccess(true);
      setInvoice((prev: any) => ({ ...prev, status: "paid" }));

      try {
        const saved = localStorage.getItem("paypilot_invoices");
        if (saved) {
          const parsed = JSON.parse(saved);
          const updated = parsed.map((item: any) =>
            item.id === invoice.id ? { ...item, status: "paid", paidAt: new Date().toISOString() } : item
          );
          localStorage.setItem("paypilot_invoices", JSON.stringify(updated));
        }
      } catch {}
    } catch (err: any) {
      setErrorMsg(err.message || "PayPal transaction could not be completed");
    } finally {
      setLoading(false);
    }
  };

  if (!invoice) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md w-full shadow-sm">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900">Invoice Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">
            The requested invoice link does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200/60 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#003087] to-[#0070ba] flex items-center justify-center text-white shadow-sm">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-base">PayPilot AI</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit Secure Checkout</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
          <div className="p-8 pb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Invoice From
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">Apex Cloud Labs Inc.</h2>
              <p className="text-xs text-slate-500">billing@apexcloudlabs.io</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Invoice Number
              </span>
              <div className="text-lg font-mono font-bold text-slate-900">
                {invoice.invoiceNumber}
              </div>
              <Badge
                variant={invoice.status === "paid" ? "success" : "warning"}
                className="mt-1 uppercase text-[10px]"
              >
                {invoice.status}
              </Badge>
            </div>
          </div>

          <div className="p-8 py-5 bg-slate-50/70 border-b border-slate-100 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">
                Billed To
              </span>
              <p className="font-semibold text-slate-900">{invoice.customerName}</p>
              <p className="text-slate-500">{invoice.customerEmail}</p>
            </div>
            <div className="text-right">
              <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">
                Due Date
              </span>
              <p className="font-semibold text-slate-900">{formatDate(invoice.dueDate)}</p>
              <p className="text-slate-500">Issued {formatDate(invoice.issueDate)}</p>
            </div>
          </div>

          <div className="p-8 py-6 space-y-4">
            <div className="divide-y divide-slate-100">
              {invoice.items.map((item: any, idx: number) => (
                <div key={idx} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium text-slate-900">{item.description}</span>
                    <span className="block text-xs text-slate-400">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-mono font-semibold text-slate-900">
                    {formatCurrency(item.amount, invoice.currency)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
              <div>
                <span className="text-base font-bold text-slate-900">Total Amount Due</span>
                <span className="block text-xs text-slate-400">PayPal REST API Sandbox verified</span>
              </div>
              <span className="text-2xl font-black text-[#003087] font-mono">
                {formatCurrency(invoice.totalAmount, invoice.currency)}
              </span>
            </div>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-4">
            {paymentSuccess ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-900">Payment Completed</h3>
                <p className="text-xs text-emerald-700">
                  This invoice has been settled in full. A receipt has been issued.
                </p>
                {transactionData?.captureId && (
                  <p className="text-[11px] font-mono text-emerald-800">
                    PayPal Capture ID: {transactionData.captureId}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0070ba] flex-shrink-0 mt-0.5" />
                  <span>
                    Pay securely using PayPal Sandbox test accounts or verified instant capture.
                  </span>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <Button
                  variant="paypal"
                  size="lg"
                  className="w-full text-base py-4 shadow-md flex items-center justify-center gap-2"
                  onClick={handlePayPalCheckout}
                  isLoading={loading}
                >
                  <span>Pay with</span>
                  <span className="font-black italic">PayPal</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-normal ml-1">Sandbox</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Powered by PayPilot AI & PayPal REST API v2 Developer Platform
        </p>
      </div>
    </div>
  );
}

export default function PublicInvoicePaymentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading invoice...</div>}>
      <InvoicePaymentContent />
    </Suspense>
  );
}
