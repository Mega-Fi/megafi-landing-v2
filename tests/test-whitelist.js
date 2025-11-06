/**
 * Test Script: Whitelist API
 * Tests various edge cases for the whitelist-wallet endpoint
 *
 * Prerequisites:
 * - Whitelist server running on port 3001
 * - Valid Supabase credentials in .env
 * - ethers.js for signature generation
 *
 * Usage: node tests/test-whitelist.js
 */

const { ethers } = require("ethers");

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const WHITELIST_SERVER_URL =
  process.env.WHITELIST_SERVER_URL || "http://localhost:3001";

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
 * Generate a valid signature for a wallet address
 */
async function generateSignature(wallet, message) {
  try {
    const signature = await wallet.signMessage(message);
    return signature;
  } catch (error) {
    console.error("Error generating signature:", error);
    return null;
  }
}

/**
 * Create a signature message with timestamp
 */
function createSignatureMessage(address) {
  const timestamp = Date.now();
  return `Sign this message to verify you own this wallet address:\n\nAddress: ${address}\nTimestamp: ${timestamp}\n\nThis signature will not trigger any blockchain transaction or cost any gas fees.`;
}

/**
 * Test whitelisting with various scenarios
 */
async function testWhitelist(description, testConfig) {
  logTest(description);

  const {
    walletAddress,
    signature,
    message,
    authToken,
    expectedSuccess,
    expectedStatus,
  } = testConfig;

  try {
    const url = `${BASE_URL}/api/claim/whitelist-wallet`;
    log(`📤 Request: POST ${url}`, colors.cyan);
    log(`   Wallet: ${walletAddress}`, colors.cyan);
    log(`   Has Signature: ${!!signature}`, colors.cyan);
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
        wallet_address: walletAddress,
        signature,
        message,
      }),
    });

    const data = await response.json();

    log(`📥 Response Status: ${response.status}`, colors.cyan);
    log(`📥 Response Body: ${JSON.stringify(data, null, 2)}`, colors.cyan);

    // Check if response matches expectation
    const successMatches = data.success === expectedSuccess;
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

/**
 * Check whitelist status directly from contract
 */
async function checkWhitelistStatus(address) {
  logTest(`Check Whitelist Status: ${address}`);

  try {
    const url = `${BASE_URL}/api/claim/whitelist-wallet?address=${address}`;
    log(`📤 Request: GET ${url}`, colors.cyan);

    const response = await fetch(url);
    const data = await response.json();

    log(`📥 Response Status: ${response.status}`, colors.cyan);
    log(`📥 Response Body: ${JSON.stringify(data, null, 2)}`, colors.cyan);

    const hasWhitelistedField = data.whitelisted !== undefined;
    logResult(
      hasWhitelistedField,
      hasWhitelistedField
        ? `Whitelisted: ${data.whitelisted}`
        : "Missing whitelisted field"
    );

    return data.whitelisted;
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
    "║            🧪 WHITELIST API TEST SUITE 🧪                    ║",
    colors.bright
  );
  log(
    "╚═══════════════════════════════════════════════════════════════╝\n",
    colors.bright
  );

  // Generate test wallets
  const wallet1 = ethers.Wallet.createRandom();
  const wallet2 = ethers.Wallet.createRandom();
  const wallet3 = ethers.Wallet.createRandom();

  log("🔑 Generated Test Wallets:", colors.bright);
  log(`   Wallet 1: ${wallet1.address}`, colors.cyan);
  log(`   Wallet 2: ${wallet2.address}`, colors.cyan);
  log(`   Wallet 3: ${wallet3.address}`, colors.cyan);

  const results = [];

  // TEST 1: Valid signature from eligible user
  log("\n⚠️  TEST 1 requires manual setup:", colors.yellow);
  log("   1. Create a test Twitter account and get auth token", colors.yellow);
  log(
    "   2. Add the Twitter handle to og_eligible_handles table",
    colors.yellow
  );
  log("   3. Get Supabase session token", colors.yellow);
  log("   Skipping automated test...", colors.yellow);
  results.push(null);

  // TEST 2: Missing signature (should fail)
  results.push(
    await testWhitelist("Missing Signature (should fail)", {
      walletAddress: wallet1.address,
      signature: null,
      message: null,
      authToken: "dummy-token-for-test",
      expectedSuccess: false,
      expectedStatus: 400,
    })
  );

  // TEST 3: Invalid Ethereum address
  results.push(
    await testWhitelist("Invalid Ethereum Address", {
      walletAddress: "not-an-address",
      signature: "dummy-signature",
      message: "dummy-message",
      authToken: "dummy-token-for-test",
      expectedSuccess: false,
      expectedStatus: 400,
    })
  );

  // TEST 4: Missing auth token (should fail)
  const message4 = createSignatureMessage(wallet1.address);
  const signature4 = await generateSignature(wallet1, message4);

  results.push(
    await testWhitelist("Missing Auth Token (should fail)", {
      walletAddress: wallet1.address,
      signature: signature4,
      message: message4,
      authToken: null,
      expectedSuccess: false,
      expectedStatus: 401,
    })
  );

  // TEST 5: Wrong signature for address
  const message5 = createSignatureMessage(wallet2.address);
  const signature5 = await generateSignature(wallet1, message5); // Sign with wallet1 but claim wallet2

  results.push(
    await testWhitelist("Wrong Signature for Address", {
      walletAddress: wallet2.address,
      signature: signature5,
      message: message5,
      authToken: "dummy-token-for-test",
      expectedSuccess: false,
      expectedStatus: 403,
    })
  );

  // TEST 6: Expired signature timestamp
  const expiredMessage = `Sign this message to verify you own this wallet address:\n\nAddress: ${
    wallet3.address
  }\nTimestamp: ${
    Date.now() - 11 * 60 * 1000
  }\n\nThis signature will not trigger any blockchain transaction or cost any gas fees.`;
  const expiredSignature = await generateSignature(wallet3, expiredMessage);

  results.push(
    await testWhitelist("Expired Signature (>10 mins old)", {
      walletAddress: wallet3.address,
      signature: expiredSignature,
      message: expiredMessage,
      authToken: "dummy-token-for-test",
      expectedSuccess: false,
      expectedStatus: 400,
    })
  );

  // TEST 7: Check whitelist status
  log("\n⚠️  Checking whitelist status for test wallets:", colors.yellow);
  await checkWhitelistStatus(wallet1.address);
  await checkWhitelistStatus(wallet2.address);

  // TEST 8: Rate limiting
  logTest("Rate Limiting (10 rapid requests)");
  log("📤 Sending 10 rapid requests...", colors.cyan);
  let rateLimited = false;

  for (let i = 0; i < 10; i++) {
    try {
      const testWallet = ethers.Wallet.createRandom();
      const testMessage = createSignatureMessage(testWallet.address);
      const testSignature = await generateSignature(testWallet, testMessage);

      const response = await fetch(`${BASE_URL}/api/claim/whitelist-wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer dummy-token",
        },
        body: JSON.stringify({
          wallet_address: testWallet.address,
          signature: testSignature,
          message: testMessage,
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
    "\n💡 Note: Some tests require manual setup with real auth tokens and eligible handles",
    colors.yellow
  );

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(console.error);
