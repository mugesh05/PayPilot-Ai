"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, ShieldCheck, ExternalLink, AlertTriangle } from "lucide-react";

interface PayPalModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    id: string;
    invoiceNumber: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    currency: string;
  };
  onPaymentSuccess: (transaction: any) => void;
}

export function PayPalModal({ isOpen, onClose, invoice, onPaymentSuccess }: PayPalModalProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"checkout" | "processing" | "success">("checkout");
  const [transactionData, setTransactionData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSandboxCheckout = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      setStep("processing");

      // 1. Create PayPal Order on backend
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
        throw new Error(createData.error || "Failed to create PayPal order");
      }

      const orderId = createData.orderId;

      // Small simulation delay representing secure PayPal server capture handshake
      await new Promise((r) => setTimeout(r, 1200));

      // 2. Capture PayPal Order on backend
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
        throw new Error(captureData.error || "Payment capture verification failed");
      }

      setTransactionData(captureData);
      setStep("success");
      onPaymentSuccess(captureData);
    } catch (err: any) {
      setErrorMsg(err.message || "PayPal transaction could not be processed");
      setStep("checkout");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("checkout");
    setErrorMsg(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="PayPal Sandbox Checkout"
      description={`Settling Invoice ${invoice.invoiceNumber}`}
    >
      {step === "checkout" && (
        <div className="space-y-5">
          {/* Order Summary Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <div className="flex justify-between items-center text-sm text-slate-500 mb-1">
              <span>Customer</span>
              <span className="font-medium text-slate-800">{invoice.customerName}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-500 mb-1">
              <span>Recipient Email</span>
              <span className="font-mono text-xs text-slate-700">{invoice.customerEmail}</span>
            </div>
            <div className="flex justify-between items-center text-base font-semibold text-slate-900 pt-2 border-t border-slate-200/60 mt-2">
              <span>Total Due</span>
              <span className="text-xl text-[#003087]">
                {formatCurrency(invoice.totalAmount, invoice.currency)}
              </span>
            </div>
          </div>

          {/* Sandbox Notice Banner */}
          <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-800 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#0070ba] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">PayPal REST API v2 Sandbox Mode</p>
              <p className="text-slate-600 mt-0.5">
                Orders are generated and captured securely on the server with full capture ID verification and idempotency protection.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2.5">
            <Button
              variant="paypal"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleSandboxCheckout}
              isLoading={loading}
            >
              <span>Pay with</span>
              <span className="font-black italic tracking-tight">PayPal</span>
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded font-normal ml-1">Sandbox</span>
            </Button>
            <Button variant="outline" size="md" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {step === "processing" && (
        <div className="py-8 flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#0070ba]/20 border-t-[#0070ba] animate-spin" />
          <div>
            <h4 className="text-base font-semibold text-slate-900">Verifying PayPal Capture</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Communicating with PayPal Sandbox endpoints and confirming server-side payment capture receipt...
            </p>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="py-4 space-y-4 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-900">Payment Captured Successfully!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Invoice <span className="font-semibold text-slate-800">{invoice.invoiceNumber}</span> is now marked as Paid.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Order ID:</span>
              <span className="font-mono text-slate-800">{transactionData?.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Capture ID:</span>
              <span className="font-mono text-slate-800">{transactionData?.captureId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount Settled:</span>
              <span className="font-semibold text-emerald-700">
                {formatCurrency(invoice.totalAmount, invoice.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Verification:</span>
              <span className="text-emerald-700 font-semibold">VERIFIED SERVER-SIDE</span>
            </div>
          </div>

          <Button variant="primary" size="md" className="w-full mt-2" onClick={handleReset}>
            Done & View Updated Invoices
          </Button>
        </div>
      )}
    </Modal>
  );
}
