/**
 * PayPal REST API v2 Server-side Integration Helper
 * Securely communicates with PayPal Sandbox / Live API
 * Client credentials are NEVER exposed to the frontend.
 */

const PAYPAL_API_BASE =
  process.env.PAYPAL_ENVIRONMENT === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

interface PayPalTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET is missing. Please set them in your environment variables."
    );
  }

  // Check cached token
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60000) {
    return cachedToken.token;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to obtain PayPal OAuth token (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as PayPalTokenResponse;
  cachedToken = {
    token: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };

  return data.access_token;
}

export async function createPayPalOrder(params: {
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  description?: string;
  returnUrl?: string;
  cancelUrl?: string;
}) {
  const token = await getPayPalAccessToken();

  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: params.invoiceId,
        custom_id: params.invoiceNumber,
        description: params.description || `Payment for Invoice ${params.invoiceNumber}`,
        amount: {
          currency_code: params.currency || "USD",
          value: params.amount.toFixed(2),
        },
      },
    ],
    application_context: {
      brand_name: "PayPilot AI",
      landing_page: "BILLING",
      user_action: "PAY_NOW",
      return_url: params.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pay/${params.invoiceId}?success=true`,
      cancel_url: params.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pay/${params.invoiceId}?cancelled=true`,
    },
  };

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `order_${params.invoiceId}_${Date.now()}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `PayPal Order creation failed (${response.status})`);
  }

  return data;
}

export async function capturePayPalOrder(orderId: string) {
  const token = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `capture_${orderId}_${Date.now()}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `PayPal Order capture failed (${response.status})`);
  }

  return data;
}

export async function verifyPayPalWebhookSignature(headers: Record<string, string>, rawBody: string) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    return { verified: false, reason: "PAYPAL_WEBHOOK_ID not configured" };
  }

  try {
    const token = await getPayPalAccessToken();
    const verificationPayload = {
      transmission_id: headers["paypal-transmission-id"],
      transmission_time: headers["paypal-transmission-time"],
      cert_url: headers["paypal-cert-url"],
      auth_algo: headers["paypal-auth-algo"],
      transmission_sig: headers["paypal-transmission-sig"],
      webhook_id: webhookId,
      webhook_event: JSON.parse(rawBody),
    };

    const response = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verificationPayload),
    });

    const data = await response.json();
    return {
      verified: data.verification_status === "SUCCESS",
      status: data.verification_status,
    };
  } catch (error: any) {
    return { verified: false, error: error.message };
  }
}
