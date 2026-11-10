"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  Check,
  Copy,
  Receipt,
  AlertTriangle,
  RotateCcw,
  User,
  ArrowRight,
} from "lucide-react";
import { useFintechStore } from "@/lib/store/useFintechStore";
import { AIMessage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

const SAMPLE_PROMPTS = [
  "Show me all overdue invoices",
  "How much revenue did I earn?",
  "Generate an urgent reminder for Marcus Vance",
  "Which customers have pending payments?",
  "Summarize recent PayPal transactions",
  "Show my payment collection rate",
];

export default function AssistantPage() {
  const { invoices, customers, transactions, createInvoice, addReminder } = useFintechStore();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmedActions, setConfirmedActions] = useState<Record<string, boolean>>({});

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "msg_init",
      role: "assistant",
      content:
        "Hello! I am **PayPilot AI**, your financial operations assistant. I monitor your PayPal transactions, detect overdue invoices, and draft smart payment communications. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: AIMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          contextData: { invoices, customers, transactions },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI service error");

      const assistantMsg: AIMessage = {
        id: `ast_${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        toolCalls: data.toolCalls,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: "assistant",
          content: `Sorry, I encountered an issue processing that query: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = (toolName: string, callIndex: number, toolResult: any) => {
    const actionKey = `${toolName}_${callIndex}`;
    if (toolName === "create_invoice") {
      // Create actual draft invoice in store
      createInvoice({
        businessId: "biz_apex_01",
        customerId: "cust_03",
        customerName: toolResult.customerName || "Elena Rostova",
        customerEmail: toolResult.customerEmail || "elena@novacrest.co",
        invoiceNumber: `INV-2026-000${invoices.length + 1}`,
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
        status: "pending",
        currency: "USD",
        items: [
          {
            id: `item_${Date.now()}`,
            description: toolResult.itemDescription || "Consulting Services",
            quantity: toolResult.quantity || 1,
            unitPrice: toolResult.unitPrice || 3500,
            amount: (toolResult.quantity || 1) * (toolResult.unitPrice || 3500),
          },
        ],
        subtotal: toolResult.totalAmount || 3500,
        taxRate: 0,
        taxAmount: 0,
        discountRate: 0,
        discountAmount: 0,
        totalAmount: toolResult.totalAmount || 3500,
        notes: "Created via PayPilot AI conversational co-pilot",
      });
    } else if (toolName === "generate_payment_reminder") {
      // Save reminder to reminder history
      addReminder({
        invoiceId: toolResult.invoiceId,
        invoiceNumber: toolResult.invoiceNumber,
        customerName: toolResult.customerName,
        customerEmail: toolResult.customerEmail,
        dueDate: new Date().toISOString().split("T")[0],
        amountDue: 2800,
        currency: "USD",
        tone: toolResult.tone || "urgent",
        messageContent: toolResult.draftMessage,
        status: "approved",
        sentAt: new Date().toISOString(),
      });
    }

    setConfirmedActions((prev) => ({ ...prev, [actionKey]: true }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Assistant Header */}
      <div className="p-4 px-6 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              PayPilot AI Financial Assistant
              <Badge variant="default" className="text-[10px]">
                Tool Calling Active
              </Badge>
            </h2>
            <p className="text-xs text-slate-500">
              Grounded in real database invoices, customer records, and PayPal transactions.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setMessages([
              {
                id: "msg_init",
                role: "assistant",
                content: "Chat cleared. What financial operations would you like to review?",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ])
          }
          className="text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" /> Clear
        </Button>
      </div>

      {/* Suggested Prompts Banner */}
      <div className="p-3 px-6 bg-blue-50/40 border-b border-blue-100 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
        <span className="font-semibold text-blue-900 flex items-center gap-1 flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Suggested:
        </span>
        {SAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSendMessage(prompt)}
            className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer text-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 max-w-3xl ${
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold ${
                msg.role === "user"
                  ? "bg-slate-900 text-white"
                  : "bg-blue-600 text-white shadow-xs"
              }`}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className="space-y-2.5 flex-1 min-w-0">
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-xs"
                    : "bg-slate-100 text-slate-800 rounded-tl-xs"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[10px] mt-2 font-mono ${
                    msg.role === "user" ? "text-blue-200 text-right" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {/* Render Structured Tool Results / Cards if any */}
              {msg.toolCalls &&
                msg.toolCalls.map((tc, idx) => {
                  const actionKey = `${tc.toolName}_${idx}`;
                  const isConfirmed = confirmedActions[actionKey];

                  if (tc.toolName === "get_overdue_invoices" && Array.isArray(tc.result)) {
                    return (
                      <div
                        key={idx}
                        className="bg-white border border-rose-200 rounded-xl p-3 shadow-xs space-y-2 text-xs"
                      >
                        <div className="flex items-center gap-1.5 font-bold text-rose-700">
                          <AlertTriangle className="w-4 h-4" /> Overdue Invoices Verified in Database
                        </div>
                        <div className="divide-y divide-slate-100">
                          {tc.result.map((inv: any) => (
                            <div key={inv.id} className="py-2 flex justify-between items-center">
                              <div>
                                <span className="font-semibold text-slate-900">{inv.invoiceNumber}</span>{" "}
                                — {inv.customerName}
                                <span className="block text-[11px] text-slate-500">
                                  Due: {inv.dueDate} ({inv.daysOverdue} days past due)
                                </span>
                              </div>
                              <span className="font-bold text-rose-600">{inv.amountDue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (tc.toolName === "generate_payment_reminder" && tc.result?.draftMessage) {
                    return (
                      <div
                        key={idx}
                        className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 shadow-xs space-y-3 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sky-900 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-blue-600" /> Drafted Payment Notice
                          </span>
                          <Badge variant="paypal" className="uppercase text-[10px]">
                            Tone: {tc.result.tone}
                          </Badge>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-sky-100 text-slate-800 italic leading-relaxed font-sans">
                          "{tc.result.draftMessage}"
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <Button
                            size="sm"
                            variant={isConfirmed ? "outline" : "primary"}
                            onClick={() => handleConfirmAction(tc.toolName, idx, tc.result)}
                            disabled={isConfirmed}
                            className="text-xs"
                          >
                            {isConfirmed ? (
                              <>
                                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Saved &
                                Recorded
                              </>
                            ) : (
                              "Approve & Record Reminder"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(tc.result.draftMessage, `rem_${idx}`)}
                            className="text-xs"
                          >
                            {copiedId === `rem_${idx}` ? (
                              <>
                                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 mr-1" /> Copy Text
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  }

                  if (tc.toolName === "create_invoice") {
                    return (
                      <div
                        key={idx}
                        className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 shadow-xs space-y-3 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900 flex items-center gap-1.5">
                            <Receipt className="w-4 h-4 text-amber-700" /> User Confirmation Required
                          </span>
                          <span className="text-[10px] bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded font-mono">
                            PROPOSAL
                          </span>
                        </div>
                        <p className="text-slate-700">
                          Create invoice for{" "}
                          <span className="font-semibold text-slate-900">{tc.result.customerName}</span> for{" "}
                          <span className="font-bold text-slate-900">
                            {formatCurrency(tc.result.totalAmount)}
                          </span>{" "}
                          ({tc.result.itemDescription}).
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleConfirmAction(tc.toolName, idx, tc.result)}
                            disabled={isConfirmed}
                            className="text-xs bg-amber-600 hover:bg-amber-700"
                          >
                            {isConfirmed ? (
                              <>
                                <Check className="w-3.5 h-3.5 mr-1" /> Invoice Created!
                              </>
                            ) : (
                              "Confirm & Create Invoice"
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-slate-400 text-xs py-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <span>PayPilot AI is querying database and analyzing records...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-4 border-t border-slate-200/80 bg-white flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask PayPilot AI (e.g. 'Show overdue invoices', 'How much revenue earned?')..."
          className="flex-1 bg-slate-50 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none transition-all"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!input.trim() || loading}
          className="gap-2 px-5 py-3"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
