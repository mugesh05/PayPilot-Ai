import { NextRequest, NextResponse } from "next/server";
import { verifyPayPalWebhookSignature } from "@/lib/paypal/client";

// In-memory set for duplicate event prevention (idempotency)
const processedEvents = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const event = JSON.parse(rawBody);
    const eventId = event.id;

    if (!eventId) {
      return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
    }

    // Idempotency check: Reject duplicate webhook deliveries
    if (processedEvents.has(eventId)) {
      return NextResponse.json({ message: "Event already processed", duplicate: true }, { status: 200 });
    }

    // Signature verification if webhook secret is configured
    if (process.env.PAYPAL_WEBHOOK_ID) {
      const headersRecord: Record<string, string> = {};
      req.headers.forEach((val, key) => {
        headersRecord[key.toLowerCase()] = val;
      });

      const verification = await verifyPayPalWebhookSignature(headersRecord, rawBody);
      if (!verification.verified) {
        console.warn("PayPal webhook signature verification failed:", verification);
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
      }
    }

    processedEvents.add(eventId);

    // Event Handling
    const eventType = event.event_type;
    console.log(`[PayPal Webhook] Processing event: ${eventType} (ID: ${eventId})`);

    switch (eventType) {
      case "PAYMENT.CAPTURE.COMPLETED": {
        const resource = event.resource;
        const customId = resource.custom_id; // Invoice number
        console.log(`[PayPal Webhook] Payment completed for invoice: ${customId}, Amount: ${resource.amount?.value}`);
        break;
      }
      case "PAYMENT.CAPTURE.DENIED": {
        console.warn(`[PayPal Webhook] Payment capture denied for event ${eventId}`);
        break;
      }
      case "CHECKOUT.ORDER.APPROVED": {
        console.log(`[PayPal Webhook] Checkout order approved: ${event.resource?.id}`);
        break;
      }
      default:
        console.log(`[PayPal Webhook] Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ status: "SUCCESS", received: true, eventId, eventType });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: err.message || "Webhook processing error" }, { status: 500 });
  }
}
