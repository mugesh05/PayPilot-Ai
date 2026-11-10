import { NextResponse } from "next/server";
import { runAllTests } from "@/lib/__tests__/unitTests";

export async function GET() {
  const testResults = await runAllTests();
  const allPassed = testResults.every((r) => r.passed);

  return NextResponse.json({
    status: allPassed ? "HEALTHY" : "DEGRADED",
    timestamp: new Date().toISOString(),
    system: "PayPilot AI",
    version: "2.4.0",
    features: {
      paypalRestApi: "READY",
      aiAssistantTools: "OPERATIONAL",
      supabaseDatabase: "CONFIGURED",
      offlineDemoStore: "ACTIVE",
    },
    tests: {
      total: testResults.length,
      passed: testResults.filter((r) => r.passed).length,
      results: testResults,
    },
  });
}
