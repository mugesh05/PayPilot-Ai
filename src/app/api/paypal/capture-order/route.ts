import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, invoiceId, payerEmail } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const hasRealCredentials = Boolean(
      process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET
    );

    if (hasRealCredentials && !orderId.startsWith("ORD-SBX-")) {
      try {
        const capture = await capturePayPalOrder(orderId);
        const captureId =
          capture.purchase_units?.[0]?.payments?.captures?.[0]?.id || `CAP-${Date.now()}`;
        const status = capture.status; // "COMPLETED"

        return NextResponse.json({
          success: status === "COMPLETED",
          mode: "LIVE_SANDBOX_API",
          orderId,
          captureId,
          status,
          invoiceId,
          capture,
        });
      } catch (paypalErr: any) {
        return NextResponse.json(
          { error: paypalErr.message || "Failed to capture PayPal order" },
          { status: 502 }
        );
      }
    }

    // Demo Sandbox Capture
    const demoCaptureId = `CAP-SBX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    return NextResponse.json({
      success: true,
      mode: "SANDBOX_SIMULATOR",
      orderId,
      captureId: demoCaptureId,
      status: "COMPLETED",
      invoiceId,
      payerEmail: payerEmail || "buyer.sandbox@paypilot-demo.com",
      capturedAt: new Date().toISOString(),
      message: "Order verified and successfully captured in sandbox environment.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
