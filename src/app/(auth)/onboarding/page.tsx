"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OnboardingPage() {
  const router = useRouter();
  const [bizName, setBizName] = useState("Vanguard Creative Labs");
  const [bizType, setBizType] = useState("SaaS & Product Studio");
  const [email, setEmail] = useState("billing@vanguardlabs.io");
  const [currency, setCurrency] = useState("USD");
  const [country, setCountry] = useState("US");
  const [paymentMethod, setPaymentMethod] = useState("PAYPAL");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-blue-600 selection:text-white">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#003087] via-[#0070ba] to-[#00cfde] flex items-center justify-center text-white shadow-md shadow-blue-900/20">
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              PayPilot <span className="text-blue-600">AI</span>
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Business Setup</h2>
          <p className="text-xs text-slate-500">Configure your invoicing and PayPal payment parameters</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Business Name"
              value={bizName}
              onChange={(e) => setBizName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Business Type
                </label>
                <select
                  value={bizType}
                  onChange={(e) => setBizType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  <option value="SaaS & Product Studio">SaaS & Product Studio</option>
                  <option value="Freelancer / Consultant">Freelancer / Consultant</option>
                  <option value="Digital Agency">Digital Agency</option>
                  <option value="Small Business">Small Business</option>
                </select>
              </div>

              <Input
                label="Billing Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Default Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  <option value="USD">USD — US Dollar ($)</option>
                  <option value="EUR">EUR — Euro (€)</option>
                  <option value="GBP">GBP — British Pound (£)</option>
                  <option value="CAD">CAD — Canadian Dollar (C$)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="DE">Germany</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Preferred Payment Rail
              </label>
              <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#0070ba]" />
                  <span className="font-semibold text-xs text-slate-900">
                    PayPal REST Platform (Sandbox Enabled)
                  </span>
                </div>
                <span className="text-[10px] bg-white border border-sky-200 text-[#0070ba] px-2 py-0.5 rounded-full font-bold">
                  Recommended
                </span>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full shadow-md mt-4">
              Complete Setup & Open Dashboard
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
