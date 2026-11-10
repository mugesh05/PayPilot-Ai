import { NextRequest, NextResponse } from "next/server";
import { processAIChat } from "@/lib/ai/service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, contextData } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages payload" }, { status: 400 });
    }

    const response = await processAIChat(messages, contextData);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("AI Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process AI chat query" },
      { status: 500 }
    );
  }
}
