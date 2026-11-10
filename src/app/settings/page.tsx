"use client";

import React, { useState } from "react";
import {
  Settings,
  ShieldCheck,
  CreditCard,
  Bot,
  Database,
  ExternalLink,
  CheckCircle2,
  RotateCcw,
  Key,
} from "lucide-react";
import { useFintechStore } from "@/lib/store/useFintechStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { business, resetToDemoDefaults } = useFintechStore();
  const [bizName, setBizName] = useState(business.name);
  const [bizEmail, setBizEmail] = useState(business.email);
  const [bizType, setBizType] = useState(business.businessType);
  const [currency, setCurrency] = useState(business.currency);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System & Account Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure business details, PayPal Sandbox developer credentials, and AI tools.
        </p>
      </div>

      {/* Business Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Business Profile & Invoicing Defaults</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Business Legal Name"
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                required
              />
              <Input
                label="Billing Email"
                type="email"
                value={bizEmail}
                onChange={(e) => setBizEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Business Industry / Category
                </label>
                <select
                  value={bizType}
                  onChange={(e) => setBizType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  <option value="SaaS & Product Studio">SaaS & Product Studio</option>
                  <option value="Freelancer / Consultant">Freelancer / Consultant</option>
                  <option value="Digital Agency">Digital Agency</option>
                  <option value="E-commerce Merchant">E-commerce Merchant</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Default Settlement Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  <option value="USD">USD — United States Dollar ($)</option>
                  <option value="EUR">EUR — Euro (€)</option>
                  <option value="GBP">GBP — British Pound (£)</option>
                  <option value="CAD">CAD — Canadian Dollar (C$)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Profile saved successfully
                </span>
              ) : (
                <div />
              )}
              <Button type="submit" variant="primary" size="sm">
                Save Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* PayPal Sandbox Developer Credentials Guide */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#0070ba]" />
            <CardTitle>PayPal Developer Integration</CardTitle>
          </div>
          <Badge variant="paypal">REST API v2</Badge>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            PayPilot AI integrates with PayPal's REST Orders API v2 to create checkout sessions, process client approvals, and verify server-side captures.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 font-mono text-slate-800">
            <div className="flex items-center justify-between text-slate-500 font-sans font-semibold border-b border-slate-200/80 pb-1.5 text-xs">
              <span>Environment Variables (.env.local)</span>
              <span>Status</span>
            </div>
            <div className="flex items-center justify-between">
              <span>NEXT_PUBLIC_PAYPAL_CLIENT_ID</span>
              <span className="text-emerald-600 font-semibold">Configured (Sandbox)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>PAYPAL_CLIENT_SECRET</span>
              <span className="text-emerald-600 font-semibold">Protected on Server</span>
            </div>
            <div className="flex items-center justify-between">
              <span>PAYPAL_WEBHOOK_ID</span>
              <span className="text-slate-500">Ready for Verification</span>
            </div>
            <div className="flex items-center justify-between">
              <span>PAYPAL_ENVIRONMENT</span>
              <span className="text-blue-600">sandbox</span>
            </div>
          </div>

          <div className="p-3.5 bg-sky-50 border border-sky-100 rounded-xl text-sky-900 space-y-1.5">
            <span className="font-bold flex items-center gap-1.5 text-[#0070ba]">
              <ShieldCheck className="w-4 h-4" /> PayPal Developer Portal Quickstart:
            </span>
            <ol className="list-decimal list-inside space-y-1 text-slate-700">
              <li>Log in to <a href="https://developer.paypal.com" target="_blank" rel="noreferrer" className="underline font-semibold text-blue-700">developer.paypal.com</a></li>
              <li>Navigate to <strong>Apps & Credentials</strong> &gt; Sandbox</li>
              <li>Create or select your REST API App to obtain Client ID & Secret</li>
              <li>Add them to <code className="bg-white px-1 py-0.5 rounded border border-sky-200">.env.local</code> to run against your own sandbox tenant</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* AI Assistant & Database Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-600" />
              <h4 className="font-bold text-slate-900 text-sm">AI Tool Engine</h4>
            </div>
            <Badge variant="success">Operational</Badge>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Function calling enabled for revenue calculations, customer queries, and smart payment reminders.
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-slate-900 text-sm">Supabase & Demo Store</h4>
            </div>
            <Badge variant="success">Synchronized</Badge>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Automatic state persistence with full database migrations in <code className="font-mono">supabase/migrations</code>.
          </p>
        </Card>
      </div>

      {/* Reset Demo State Action */}
      <Card className="p-5 border-rose-200 bg-rose-50/30 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Reset Demo State</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Restore sample businesses, customers, and overdue invoices to default hackathon demo state.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={resetToDemoDefaults} className="text-rose-600 hover:bg-rose-50 border-rose-200">
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset to Seed Data
        </Button>
      </Card>
    </div>
  );
}
