-- ==============================================================================
-- PayPilot AI — Seed Demo Data
-- ==============================================================================

-- 1. Demo Business
INSERT INTO public.businesses (id, name, email, business_type, currency, country)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Apex Cloud Labs Inc.',
  'billing@apexcloudlabs.io',
  'SaaS & Product Studio',
  'USD',
  'US'
) ON CONFLICT (id) DO NOTHING;

-- 2. Demo Customers
INSERT INTO public.customers (id, business_id, name, email, company, address)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Sophia Turner', 'sophia@lumina-ai.com', 'Lumina AI', '550 Montgomery St, San Francisco, CA'),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Marcus Vance', 'marcus@vancetech.io', 'Vance Robotics', '101 Broadway, New York, NY'),
  ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Elena Rostova', 'elena@novacrest.co', 'Novacrest Capital', '200 LaSalle St, Chicago, IL'),
  ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'David Kim', 'dkim@zenithflow.dev', 'Zenith Flow', '400 Pine St, Seattle, WA')
ON CONFLICT (id) DO NOTHING;

-- 3. Demo Invoices
INSERT INTO public.invoices (id, business_id, customer_id, invoice_number, issue_date, due_date, status, currency, subtotal, tax_rate, tax_amount, discount_rate, discount_amount, total_amount, paid_at)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'INV-2026-0001', '2026-10-01', '2026-10-15', 'paid', 'USD', 4500.00, 0, 0, 0, 0, 4500.00, '2026-10-12 14:20:00+00'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'INV-2026-0002', '2026-10-10', '2026-10-24', 'overdue', 'USD', 2800.00, 0, 0, 0, 0, 2800.00, NULL),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'INV-2026-0003', '2026-11-01', '2026-11-15', 'pending', 'USD', 6200.00, 5.0, 310.00, 0, 0, 6510.00, NULL),
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 'INV-2026-0004', '2026-11-05', '2026-11-20', 'pending', 'USD', 1750.00, 0, 0, 0, 0, 1750.00, NULL)
ON CONFLICT (id) DO NOTHING;

-- 4. Demo Invoice Items
INSERT INTO public.invoice_items (id, invoice_id, description, quantity, unit_price, amount)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Full-stack AI Payment Pipeline Development', 1, 4500.00, 4500.00),
  ('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Monthly Cloud & ML Infrastructure Retainer', 1, 2800.00, 2800.00),
  ('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Fintech Dashboard & PayPal Integration', 1, 6200.00, 6200.00),
  ('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 'UI/UX Design Tokens & Component Library', 1, 1750.00, 1750.00)
ON CONFLICT (id) DO NOTHING;

-- 5. Demo Completed Payment
INSERT INTO public.payments (id, business_id, invoice_id, amount, currency, payment_method, status, paypal_order_id, paypal_capture_id, payer_email, paid_at)
VALUES (
  'p0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  4500.00,
  'USD',
  'PAYPAL',
  'COMPLETED',
  'ORD-SANDBOX-782910',
  'CAP-SANDBOX-983214',
  'sophia.payer@lumina-ai.com',
  '2026-10-12 14:20:00+00'
) ON CONFLICT (id) DO NOTHING;
