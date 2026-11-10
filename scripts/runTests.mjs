import { runAllTests } from "../src/lib/__tests__/unitTests.ts";

async function main() {
  console.log("==================================================");
  console.log("PAYPILOT AI — AUTOMATED TEST SUITE VERIFICATION");
  console.log("==================================================");
  
  const results = await runAllTests();
  let passedCount = 0;
  
  for (const r of results) {
    if (r.passed) {
      console.log(`[PASS] ${r.test}`);
      passedCount++;
    } else {
      console.error(`[FAIL] ${r.test} — ${r.error}`);
    }
  }

  console.log("--------------------------------------------------");
  console.log(`Summary: ${passedCount} / ${results.length} tests passed.`);
  console.log("==================================================");

  if (passedCount !== results.length) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test execution fatal error:", err);
  process.exit(1);
});
