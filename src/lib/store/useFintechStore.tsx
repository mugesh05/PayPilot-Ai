"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  INITIAL_BUSINESS,
  INITIAL_CUSTOMERS,
  INITIAL_INVOICES,
  INITIAL_TRANSACTIONS,
  INITIAL_REMINDERS,
  computeAnalytics,
} from "../demo/demoStore";
import { Business, Customer, Invoice, PaymentTransaction, Reminder, AnalyticsSummary, PaymentStatus } from "../types";

interface FintechStoreContextType {
  business: Business;
  customers: Customer[];
  invoices: Invoice[];
  transactions: PaymentTransaction[];
  reminders: Reminder[];
  analytics: AnalyticsSummary;
  createInvoice: (inv: Omit<Invoice, "id" | "createdAt">) => Invoice;
  updateInvoiceStatus: (id: string, status: PaymentStatus, paymentDetails?: any) => void;
  deleteInvoice: (id: string) => void;
  addCustomer: (cust: Omit<Customer, "id" | "createdAt">) => Customer;
  deleteCustomer: (id: string) => void;
  addReminder: (rem: Omit<Reminder, "id" | "createdAt">) => Reminder;
  approveReminder: (id: string) => void;
  resetToDemoDefaults: () => void;
}

const FintechStoreContext = createContext<FintechStoreContextType | null>(null);

export function FintechStoreProvider({ children }: { children: React.ReactNode }) {
  const [business, setBusiness] = useState<Business>(INITIAL_BUSINESS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);

  // Initialize from LocalStorage if available
  useEffect(() => {
    try {
      const savedInvoices = localStorage.getItem("paypilot_invoices");
      const savedCustomers = localStorage.getItem("paypilot_customers");
      const savedTransactions = localStorage.getItem("paypilot_transactions");
      const savedReminders = localStorage.getItem("paypilot_reminders");

      if (savedInvoices) setInvoices(JSON.parse(savedInvoices));
      if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      if (savedReminders) setReminders(JSON.parse(savedReminders));
    } catch {
      // Fallback to initial seed
    }
  }, []);

  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {}
  };

  const createInvoice = (invData: Omit<Invoice, "id" | "createdAt">) => {
    const newInvoice: Invoice = {
      ...invData,
      id: `inv_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newInvoice, ...invoices];
    setInvoices(updated);
    saveToStorage("paypilot_invoices", updated);

    // Update customer outstanding balance
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === newInvoice.customerId
          ? {
              ...c,
              totalInvoiced: (c.totalInvoiced || 0) + newInvoice.totalAmount,
              outstandingBalance: (c.outstandingBalance || 0) + newInvoice.totalAmount,
            }
          : c
      )
    );
    return newInvoice;
  };

  const updateInvoiceStatus = (id: string, status: PaymentStatus, paymentDetails?: any) => {
    let capturedInvoice: Invoice | undefined;

    const updatedInvoices = invoices.map((inv) => {
      if (inv.id === id) {
        capturedInvoice = {
          ...inv,
          status,
          paidAt: status === "paid" ? new Date().toISOString() : inv.paidAt,
          paypalOrderId: paymentDetails?.orderId || inv.paypalOrderId,
        };
        return capturedInvoice;
      }
      return inv;
    });

    setInvoices(updatedInvoices);
    saveToStorage("paypilot_invoices", updatedInvoices);

    if (status === "paid" && capturedInvoice) {
      // Record payment transaction
      const newTxn: PaymentTransaction = {
        id: `txn_${Date.now()}`,
        invoiceId: capturedInvoice.id,
        invoiceNumber: capturedInvoice.invoiceNumber,
        customerName: capturedInvoice.customerName,
        amount: capturedInvoice.totalAmount,
        currency: capturedInvoice.currency,
        status: "COMPLETED",
        paypalOrderId: paymentDetails?.orderId || "ORD-SANDBOX-LIVE",
        paypalCaptureId: paymentDetails?.captureId || "CAP-SANDBOX-LIVE",
        payerEmail: paymentDetails?.payerEmail || capturedInvoice.customerEmail,
        paidAt: new Date().toISOString(),
        paymentMethod: "PAYPAL",
      };

      const updatedTxns = [newTxn, ...transactions];
      setTransactions(updatedTxns);
      saveToStorage("paypilot_transactions", updatedTxns);

      // Deduct outstanding balance
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === capturedInvoice?.customerId
            ? {
                ...c,
                outstandingBalance: Math.max(0, (c.outstandingBalance || 0) - capturedInvoice.totalAmount),
              }
            : c
        )
      );
    }
  };

  const deleteInvoice = (id: string) => {
    const updated = invoices.filter((i) => i.id !== id);
    setInvoices(updated);
    saveToStorage("paypilot_invoices", updated);
  };

  const addCustomer = (custData: Omit<Customer, "id" | "createdAt">) => {
    const newCust: Customer = {
      ...custData,
      id: `cust_${Date.now()}`,
      createdAt: new Date().toISOString(),
      totalInvoiced: 0,
      outstandingBalance: 0,
    };
    const updated = [newCust, ...customers];
    setCustomers(updated);
    saveToStorage("paypilot_customers", updated);
    return newCust;
  };

  const deleteCustomer = (id: string) => {
    const updated = customers.filter((c) => c.id !== id);
    setCustomers(updated);
    saveToStorage("paypilot_customers", updated);
  };

  const addReminder = (remData: Omit<Reminder, "id" | "createdAt">) => {
    const newRem: Reminder = {
      ...remData,
      id: `rem_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newRem, ...reminders];
    setReminders(updated);
    saveToStorage("paypilot_reminders", updated);
    return newRem;
  };

  const approveReminder = (id: string) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, status: "approved" as const, sentAt: new Date().toISOString() } : r
    );
    setReminders(updated);
    saveToStorage("paypilot_reminders", updated);
  };

  const resetToDemoDefaults = () => {
    setInvoices(INITIAL_INVOICES);
    setCustomers(INITIAL_CUSTOMERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setReminders(INITIAL_REMINDERS);
    localStorage.removeItem("paypilot_invoices");
    localStorage.removeItem("paypilot_customers");
    localStorage.removeItem("paypilot_transactions");
    localStorage.removeItem("paypilot_reminders");
  };

  const analytics = computeAnalytics(invoices);

  return (
    <FintechStoreContext.Provider
      value={{
        business,
        customers,
        invoices,
        transactions,
        reminders,
        analytics,
        createInvoice,
        updateInvoiceStatus,
        deleteInvoice,
        addCustomer,
        deleteCustomer,
        addReminder,
        approveReminder,
        resetToDemoDefaults,
      }}
    >
      {children}
    </FintechStoreContext.Provider>
  );
}

export function useFintechStore() {
  const ctx = useContext(FintechStoreContext);
  if (!ctx) throw new Error("useFintechStore must be used within FintechStoreProvider");
  return ctx;
}
