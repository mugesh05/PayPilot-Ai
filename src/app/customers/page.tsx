"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Building,
  MapPin,
  Trash2,
  Receipt,
  Check,
} from "lucide-react";
import { useFintechStore } from "@/lib/store/useFintechStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

export default function CustomersPage() {
  const { customers, invoices, addCustomer, deleteCustomer } = useFintechStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomerForDetails, setSelectedCustomerForDetails] = useState<any>(null);

  // New customer form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addCustomer({
      businessId: "biz_apex_01",
      name,
      email,
      company: company || undefined,
      phone: phone || undefined,
      address: address || undefined,
      notes: notes || undefined,
    });

    setName("");
    setEmail("");
    setCompany("");
    setPhone("");
    setAddress("");
    setNotes("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Maintain client profiles, billing contacts, and monitor outstanding receivables.
          </p>
        </div>

        <Button variant="primary" size="md" className="gap-2" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or company..."
            className="w-full bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          Total Clients: {customers.length}
        </div>
      </Card>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredCustomers.map((cust) => {
          const custInvoices = invoices.filter((i) => i.customerId === cust.id);
          const outstanding = custInvoices
            .filter((i) => i.status === "pending" || i.status === "overdue")
            .reduce((sum, i) => sum + i.totalAmount, 0);

          return (
            <Card key={cust.id} className="p-6 space-y-4 hover:border-slate-300 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 font-bold text-base flex items-center justify-center border border-blue-100">
                    {cust.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{cust.name}</h3>
                    {cust.company && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {cust.company}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteCustomer(cust.id)}
                  title="Remove customer"
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Contact Details */}
              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{cust.email}</span>
                </div>
                {cust.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cust.phone}</span>
                  </div>
                )}
                {cust.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{cust.address}</span>
                  </div>
                )}
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Invoices Issued</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                    {custInvoices.length} invoice(s)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block font-medium">Outstanding Due</span>
                  <span
                    className={`font-bold text-sm mt-0.5 block ${
                      outstanding > 0 ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {formatCurrency(outstanding)}
                  </span>
                </div>
              </div>

              {cust.notes && (
                <p className="text-[11px] text-slate-400 italic border-t border-slate-100 pt-2">
                  Note: {cust.notes}
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Customer"
        description="Register a new client contact for invoice billing"
      >
        <form onSubmit={handleAddCustomerSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Rachel Green"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="rachel@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Company Name (Optional)"
            placeholder="Acme Corp"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <Input
            label="Phone (Optional)"
            placeholder="+1 (555) 012-3456"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Billing Address (Optional)"
            placeholder="123 Market St, San Francisco, CA"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Customer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
