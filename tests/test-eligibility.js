/**
 * Test Script: Eligibility API
 * Tests various edge cases for the check-eligibility endpoint
 *
 * Usage: node tests/test-eligibility.js
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ANSI color codes for pretty output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logTest(name) {
  console.log(
    `\n${colors.bright}${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`
  );
  console.log(`${colors.bright}🧪 TEST: ${name}${colors.reset}`);
  console.log(
    `${colors.bright}${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`
  );
}

function logResult(passed, message) {
  const icon = passed ? "✅" : "❌";
  const color = passed ? colors.green : colors.red;
  log(`${icon} ${message}`, color);
}

async function testEligibility(handle, expectedEligible, description) {
  logTest(description);

  try {
    const url = `${BASE_URL}/api/claim/check-eligibility?twitter_handle=${encodeURIComponent(
      handle
    )}`;
    log(`📤 Request: GET ${url}`, colors.cyan);

    const response = await fetch(url);
    const data = await response.json();

    log(`📥 Response Status: ${response.status}`, colors.cyan);
    log(`📥 Response Body: ${JSON.stringify(data, null, 2)}`, colors.cyan);

    // Check if eligibility matches expectation
    const eligibilityMatches = data.eligible === expectedEligible;

    logResult(
      eligibilityMatches,
      eligibilityMatches
        ? `Expected eligible=${expectedEligible}, got eligible=${data.eligible}`
        : `MISMATCH: Expected eligible=${expectedEligible}, got eligible=${data.eligible}`
    );

    // Check response structure
    const hasReason = data.reason !== undefined || data.message !== undefined;
    logResult(
      hasReason,
      hasReason
        ? "Response includes reason/message"
        : "Response missing reason/message"
    );

    return eligibilityMatches;
  } catch (error) {
    logResult(false, `Error: ${error.message}`);
    console.error(error);
    return false;
  }
}

async function runTests() {
  log(
    "\n╔═══════════════════════════════════════════════════════════════╗",
    colors.bright
  );
  log(
    "║           🧪 ELIGIBILITY API TEST SUITE 🧪                   ║",
    colors.bright
  );
  log(
    "╚═══════════════════════════════════════════════════════════════╝\n",
    colors.bright
  );

  const results = [];

  // TEST 1: Valid eligible handle
  results.push(
    await testEligibility(
      "validhandle123", // Replace with actual eligible handle from your DB
      true,
      "Valid Eligible Handle"
    )
  );

  // TEST 2: Invalid handle (not in eligible list)
  results.push(
    await testEligibility(
      "noteligibleuser999",
      false,
      "Invalid Handle (Not Eligible)"
    )
  );

  // TEST 3: Handle with @ symbol
  results.push(
    await testEligibility(
      "@validhandle123", // Replace with actual eligible handle
      true,
      "Handle with @ Symbol (should normalize)"
    )
  );

  // TEST 4: Empty handle
  results.push(
    await testEligibility("", false, "Empty Handle (should reject)")
  );

  // TEST 5: Invalid characters in handle
  results.push(
    await testEligibility(
      "invalid-handle!@#",
      false,
      "Invalid Characters (should reject)"
    )
  );

  // TEST 6: Handle too long (>15 chars)
  results.push(
    await testEligibility(
      "thishandleiswaytoolong",
      false,
      "Handle Too Long (>15 chars)"
    )
  );

  // TEST 7: Already claimed handle
  // Note: This test requires a handle that has already claimed (has token_id set)
  // Replace 'alreadyclaimedhandle' with actual claimed handle from your DB
  logTest("Already Claimed Handle");
  log(
    "⚠️  Manual Test Required: Update with actual claimed handle from database",
    colors.yellow
  );
  log(
    '   Example: Replace "alreadyclaimedhandle" with real handle that has token_id',
    colors.yellow
  );
  results.push(null); // Skip this test

  // TEST 8: Case insensitivity
  results.push(
    await testEligibility(
      "VaLiDHaNdLe123", // Replace with actual eligible handle
      true,
      "Case Insensitivity (should normalize)"
    )
  );

  // TEST 9: Rate limiting (make 25 requests rapidly)
  logTest("Rate Limiting (25 rapid requests)");
  log("📤 Sending 25 rapid requests...", colors.cyan);
  let rateLimited = false;

  for (let i = 0; i < 25; i++) {
    try {
      const response = await fetch(
        `${BASE_URL}/api/claim/check-eligibility?twitter_handle=testuser${i}`
      );
      if (response.status === 429) {
        rateLimited = true;
        log(`📥 Request ${i + 1}: Rate limited (429)`, colors.yellow);
        break;
      }
      log(`📥 Request ${i + 1}: ${response.status}`, colors.cyan);
    } catch (error) {
      log(`📥 Request ${i + 1}: Error - ${error.message}`, colors.red);
    }
  }

  logResult(
    rateLimited,
    rateLimited
      ? "Rate limiting triggered as expected"
      : "Rate limiting not triggered (may need more requests)"
  );
  results.push(rateLimited);

  // Summary
  log(
    "\n╔═══════════════════════════════════════════════════════════════╗",
    colors.bright
  );
  log(
    "║                       📊 TEST SUMMARY                         ║",
    colors.bright
  );
  log(
    "╚═══════════════════════════════════════════════════════════════╝\n",
    colors.bright
  );

  const passed = results.filter((r) => r === true).length;
  const failed = results.filter((r) => r === false).length;
  const skipped = results.filter((r) => r === null).length;
  const total = results.length;

  log(`✅ Passed:  ${passed}/${total}`, colors.green);
  log(`❌ Failed:  ${failed}/${total}`, colors.red);
  log(`⏭️  Skipped: ${skipped}/${total}`, colors.yellow);

  const allPassed = failed === 0 && passed > 0;
  log(
    `\n${allPassed ? "🎉 All tests passed!" : "⚠️  Some tests failed"}`,
    allPassed ? colors.green : colors.red
  );

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(console.error);
