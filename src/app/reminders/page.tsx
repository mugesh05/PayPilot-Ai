"use client";

import React, { useState } from "react";
import {
  BellRing,
  Sparkles,
  Check,
  Copy,
  Clock,
  Send,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { useFintechStore } from "@/lib/store/useFintechStore";
import { ReminderTone, Reminder } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RemindersPage() {
  const { invoices, reminders, addReminder, approveReminder } = useFintechStore();

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
    invoices.find((i) => i.status === "overdue")?.id || invoices[0]?.id || ""
  );
  const [selectedTone, setSelectedTone] = useState<ReminderTone>("urgent");
  const [draftContent, setDraftContent] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const overdueInvoices = invoices.filter((i) => i.status === "overdue");
  const targetInvoice = invoices.find((i) => i.id === selectedInvoiceId) || invoices[0];

  // Generate Tone-Aware Template
  const handleGenerateTemplate = (tone: ReminderTone, inv: any) => {
    setSelectedTone(tone);
    if (!inv) return;

    const paymentLink = `${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/pay/${inv.id}`;

    if (tone === "urgent") {
      setDraftContent(
        `URGENT NOTICE: Invoice ${inv.invoiceNumber} for ${formatCurrency(
          inv.totalAmount,
          inv.currency
        )} was due on ${formatDate(
          inv.dueDate
        )}. Please remit payment immediately via our secure PayPal portal: ${paymentLink} or contact our finance team.`
      );
    } else if (tone === "polite") {
      setDraftContent(
        `Hi ${inv.customerName},\n\nHope you're having a productive week! Just a friendly reminder that invoice ${
          inv.invoiceNumber
        } (${formatCurrency(inv.totalAmount, inv.currency)}) was due on ${formatDate(
          inv.dueDate
        )}.\n\nYou can complete payment directly here: ${paymentLink}\n\nThank you for your business!`
      );
    } else {
      setDraftContent(
        `Dear ${inv.customerName},\n\nThis is a standard follow-up regarding outstanding invoice ${
          inv.invoiceNumber
        } for the amount of ${formatCurrency(inv.totalAmount, inv.currency)}, due on ${formatDate(
          inv.dueDate
        )}.\n\nPlease process this at your earliest convenience using our verified PayPal link:\n${paymentLink}\n\nSincerely,\nApex Cloud Labs Finance`
      );
    }
  };

  // Sync draft message when invoice or tone changes
  React.useEffect(() => {
    if (targetInvoice && !draftContent) {
      handleGenerateTemplate(selectedTone, targetInvoice);
    }
  }, [targetInvoice]);

  const handleSaveReminder = () => {
    if (!targetInvoice || !draftContent) return;

    addReminder({
      invoiceId: targetInvoice.id,
      invoiceNumber: targetInvoice.invoiceNumber,
      customerName: targetInvoice.customerName,
      customerEmail: targetInvoice.customerEmail,
      dueDate: targetInvoice.dueDate,
      amountDue: targetInvoice.totalAmount,
      currency: targetInvoice.currency,
      tone: selectedTone,
      messageContent: draftContent,
      status: "draft",
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Smart Payment Reminders</h1>
        <p className="text-sm text-slate-500 mt-1">
          Detect overdue accounts, craft AI-personalized reminder notices, and accelerate accounts receivable.
        </p>
      </div>

      {/* Overdue Accounts Banner */}
      {overdueInvoices.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between text-xs text-rose-900">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Attention Required:</span> {overdueInvoices.length} invoice(s) have passed their due date without payment.
            </div>
          </div>
          <span className="font-bold text-rose-700">
            {formatCurrency(overdueInvoices.reduce((s, i) => s + i.totalAmount, 0))} Total Overdue
          </span>
        </div>
      )}

      {/* Two Column Layout: Generator & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reminder Generator Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">AI Reminder Generator</h3>
            </div>
            <Badge variant="default" className="text-[10px]">
              Human-in-the-Loop Approval
            </Badge>
          </div>

          {/* Select Invoice */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Target Invoice
            </label>
            <select
              value={selectedInvoiceId}
              onChange={(e) => {
                setSelectedInvoiceId(e.target.value);
                const inv = invoices.find((i) => i.id === e.target.value);
                handleGenerateTemplate(selectedTone, inv);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
            >
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} — {inv.customerName} ({formatCurrency(inv.totalAmount)}) [
                  {inv.status.toUpperCase()}]
                </option>
              ))}
            </select>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Communication Tone
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["polite", "professional", "urgent"] as ReminderTone[]).map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => handleGenerateTemplate(tone, targetInvoice)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                    selectedTone === tone
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Personalized Message (Editable)
            </label>
            <textarea
              rows={6}
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 focus:border-blue-600 focus:outline-none leading-relaxed font-sans"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(draftContent, "draft_copy")}
              className="gap-1.5 text-xs"
            >
              {copiedId === "draft_copy" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied Draft
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Notice
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSaveReminder}
              className="gap-1.5 text-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Queue Reminder</span>
            </Button>
          </div>
        </Card>

        {/* Reminder History Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Reminder History & Audit Log</h3>
            <span className="text-xs text-slate-400">{reminders.length} logged</span>
          </div>

          {reminders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No reminders dispatched yet. Generate and approve a reminder on the left.
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{rem.customerName}</span>
                      <span className="text-slate-400 ml-1.5 font-mono">({rem.invoiceNumber})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant={
                          rem.tone === "urgent"
                            ? "danger"
                            : rem.tone === "polite"
                            ? "default"
                            : "neutral"
                        }
                        className="text-[10px] uppercase"
                      >
                        {rem.tone}
                      </Badge>
                      <Badge
                        variant={rem.status === "approved" ? "success" : "warning"}
                        className="text-[10px] uppercase"
                      >
                        {rem.status}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-100 line-clamp-3">
                    "{rem.messageContent}"
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>Amount: {formatCurrency(rem.amountDue, rem.currency)}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(rem.messageContent, rem.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === rem.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>

                      {rem.status === "draft" && (
                        <button
                          onClick={() => approveReminder(rem.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
