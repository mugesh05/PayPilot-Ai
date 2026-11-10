import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoiceId, invoiceNumber, amount, currency = "USD" } = body;

    if (!invoiceId || !amount) {
      return NextResponse.json({ error: "Missing invoiceId or amount" }, { status: 400 });
    }

    const hasRealCredentials = Boolean(
      process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET
    );

    if (hasRealCredentials) {
      try {
        const order = await createPayPalOrder({
          invoiceId,
          invoiceNumber: invoiceNumber || "INV-GEN",
          amount: Number(amount),
          currency,
        });
        return NextResponse.json({
          success: true,
          mode: "LIVE_SANDBOX_API",
          orderId: order.id,
          order,
        });
      } catch (paypalErr: any) {
        console.error("PayPal API Error:", paypalErr);
        return NextResponse.json(
          { error: paypalErr.message || "Failed to create order on PayPal API" },
          { status: 502 }
        );
      }
    }

    // Demo / Sandbox fallback: Provide authentic sandbox order structure
    const demoOrderId = `ORD-SBX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    return NextResponse.json({
      success: true,
      mode: "SANDBOX_SIMULATOR",
      orderId: demoOrderId,
      status: "CREATED",
      invoiceId,
      amount: Number(amount).toFixed(2),
      currency,
      note: "PayPal Sandbox credentials not detected; using secure simulated sandbox checkout flow.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
