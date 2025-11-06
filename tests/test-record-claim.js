/**
 * Test Script: Record Claim API
 * Tests the claim recording endpoint
 *
 * Prerequisites:
 * - Supabase credentials in .env
 * - Test data in database
 *
 * Usage: node tests/test-record-claim.js
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ANSI color codes
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

/**
 * Test recording a claim
 */
async function testRecordClaim(description, testConfig) {
  logTest(description);

  const {
    twitterHandle,
    twitterUserId,
    walletAddress,
    tokenId,
    transactionHash,
    authToken,
    expectedSuccess,
    expectedStatus,
  } = testConfig;

  try {
    const url = `${BASE_URL}/api/claim/record-claim`;
    log(`📤 Request: POST ${url}`, colors.cyan);
    log(`   Twitter Handle: ${twitterHandle}`, colors.cyan);
    log(`   Wallet: ${walletAddress}`, colors.cyan);
    log(`   Token ID: ${tokenId}`, colors.cyan);
    log(`   TX Hash: ${transactionHash}`, colors.cyan);
    log(`   Has Auth Token: ${!!authToken}`, colors.cyan);

    const headers = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        twitter_handle: twitterHandle,
        twitter_user_id: twitterUserId,
        wallet_address: walletAddress,
        token_id: tokenId,
        transaction_hash: transactionHash,
      }),
    });

    const data = await response.json();

    log(`📥 Response Status: ${response.status}`, colors.cyan);
    log(`📥 Response Body: ${JSON.stringify(data, null, 2)}`, colors.cyan);

    // Check if response matches expectation
    const successMatches =
      data.success === expectedSuccess ||
      (expectedSuccess && response.status === 200);
    const statusMatches = !expectedStatus || response.status === expectedStatus;

    logResult(
      successMatches && statusMatches,
      successMatches && statusMatches
        ? `Expected success=${expectedSuccess}, status=${
            expectedStatus || "any"
          }`
        : `MISMATCH: Got success=${data.success}, status=${response.status}`
    );

    return successMatches && statusMatches;
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
    "║         🧪 RECORD CLAIM API TEST SUITE 🧪                    ║",
    colors.bright
  );
  log(
    "╚═══════════════════════════════════════════════════════════════╝\n",
    colors.bright
  );

  const results = [];

  // TEST 1: Valid claim recording
  log("\n⚠️  TEST 1: Valid Claim Recording", colors.yellow);
  log("   This test requires:", colors.yellow);
  log("   1. A valid Twitter handle that is eligible", colors.yellow);
  log("   2. A valid Supabase auth token", colors.yellow);
  log("   3. A valid transaction hash from actual mint", colors.yellow);
  log("   Manual test required - skipping...", colors.yellow);
  results.push(null);

  // TEST 2: Missing required fields
  results.push(
    await testRecordClaim("Missing Required Fields (twitter_handle)", {
      twitterHandle: null,
      twitterUserId: "test-user-id",
      walletAddress: "0x1234567890123456789012345678901234567890",
      tokenId: "1",
      transactionHash: "0x" + "1".repeat(64),
      authToken: "dummy-token",
      expectedSuccess: false,
      expectedStatus: 400,
    })
  );

  // TEST 3: Missing transaction hash
  results.push(
    await testRecordClaim("Missing Transaction Hash", {
      twitterHandle: "testuser",
      twitterUserId: "test-user-id",
      walletAddress: "0x1234567890123456789012345678901234567890",
      tokenId: "1",
      transactionHash: null,
      authToken: "dummy-token",
      expectedSuccess: false,
      expectedStatus: 400,
    })
  );

  // TEST 4: Invalid wallet address
  results.push(
    await testRecordClaim("Invalid Wallet Address", {
      twitterHandle: "testuser",
      twitterUserId: "test-user-id",
      walletAddress: "not-an-address",
      tokenId: "1",
      transactionHash: "0x" + "1".repeat(64),
      authToken: "dummy-token",
      expectedSuccess: false,
      expectedStatus: 400,
    })
  );

  // TEST 5: Invalid transaction hash format
  results.push(
    await testRecordClaim("Invalid Transaction Hash Format", {
      twitterHandle: "testuser",
      twitterUserId: "test-user-id",
      walletAddress: "0x1234567890123456789012345678901234567890",
      tokenId: "1",
      transactionHash: "0xINVALID",
      authToken: "dummy-token",
      expectedSuccess: false,
      expectedStatus: 400,
    })
  );

  // TEST 6: Invalid Twitter handle format
  results.push(
    await testRecordClaim("Invalid Twitter Handle Format", {
      twitterHandle: "invalid-handle-!@#$",
      twitterUserId: "test-user-id",
      walletAddress: "0x1234567890123456789012345678901234567890",
      tokenId: "1",
      transactionHash: "0x" + "1".repeat(64),
      authToken: "dummy-token",
      expectedSuccess: false,
      expectedStatus: 400,
    })
  );

  // TEST 7: Missing auth token
  results.push(
    await testRecordClaim("Missing Auth Token", {
      twitterHandle: "testuser",
      twitterUserId: "test-user-id",
      walletAddress: "0x1234567890123456789012345678901234567890",
      tokenId: "1",
      transactionHash: "0x" + "1".repeat(64),
      authToken: null,
      expectedSuccess: false,
      expectedStatus: 401,
    })
  );

  // TEST 8: Non-eligible Twitter handle
  results.push(
    await testRecordClaim("Non-Eligible Twitter Handle", {
      twitterHandle: "noteligibleuser999",
      twitterUserId: "test-user-id",
      walletAddress: "0x1234567890123456789012345678901234567890",
      tokenId: "1",
      transactionHash: "0x" + "1".repeat(64),
      authToken: "dummy-token",
      expectedSuccess: false,
      expectedStatus: 403,
    })
  );

  // TEST 9: Duplicate claim (same transaction hash)
  log("\n⚠️  TEST 9: Duplicate Claim", colors.yellow);
  log(
    "   This test requires a transaction hash that was already recorded",
    colors.yellow
  );
  log("   Expected: Should return 409 or handle gracefully", colors.yellow);
  log("   Manual test required - skipping...", colors.yellow);
  results.push(null);

  // TEST 10: Rate limiting
  logTest("Rate Limiting (10 rapid requests)");
  log("📤 Sending 10 rapid requests...", colors.cyan);
  let rateLimited = false;

  for (let i = 0; i < 10; i++) {
    try {
      const response = await fetch(`${BASE_URL}/api/claim/record-claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer dummy-token",
        },
        body: JSON.stringify({
          twitter_handle: `testuser${i}`,
          twitter_user_id: `test-user-${i}`,
          wallet_address: "0x1234567890123456789012345678901234567890",
          token_id: i.toString(),
          transaction_hash: "0x" + i.toString().repeat(64).substring(0, 64),
        }),
      });

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

  log(
    "\n💡 Note: Some tests require manual setup with real data and auth tokens",
    colors.yellow
  );

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(console.error);
