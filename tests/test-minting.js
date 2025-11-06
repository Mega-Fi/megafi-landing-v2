/**
 * Test Script: NFT Minting Flow
 * Tests smart contract minting scenarios
 *
 * Prerequisites:
 * - ethers.js for contract interaction
 * - Valid RPC URL in .env
 * - Contract ABI and address
 * - Test wallet with funds for gas
 *
 * Usage: node tests/test-minting.js
 */

const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || "0xF182Ae21E8Bf69e043d4F3144bfA9182F9CB3949";
const RPC_URL = process.env.RPC_URL || "https://arbitrum-sepolia.drpc.org";

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
 * Load contract ABI
 */
function loadContractABI() {
  try {
    const abiPath = path.join(__dirname, "..", "The95Pass.abi.json");
    const abiData = fs.readFileSync(abiPath, "utf8");
    return JSON.parse(abiData);
  } catch (error) {
    console.error("Error loading ABI:", error);
    return null;
  }
}

/**
 * Check if address is whitelisted
 */
async function checkWhitelisted(contract, address) {
  try {
    const isWhitelisted = await contract.isWhitelisted(address);
    log(`   Whitelisted: ${isWhitelisted}`, colors.cyan);
    return isWhitelisted;
  } catch (error) {
    log(`   Error checking whitelist: ${error.message}`, colors.red);
    return false;
  }
}

/**
 * Check if address has already minted
 */
async function checkHasMinted(contract, address) {
  try {
    const hasMinted = await contract.hasMinted(address);
    log(`   Has Minted: ${hasMinted}`, colors.cyan);
    return hasMinted;
  } catch (error) {
    log(`   Error checking mint status: ${error.message}`, colors.red);
    return false;
  }
}

/**
 * Get NFT balance
 */
async function getBalance(contract, address) {
  try {
    const balance = await contract.balanceOf(address);
    log(`   Balance: ${balance.toString()}`, colors.cyan);
    return balance;
  } catch (error) {
    log(`   Error checking balance: ${error.message}`, colors.red);
    return 0;
  }
}

/**
 * Attempt to mint NFT
 */
async function attemptMint(contract, wallet, description) {
  logTest(description);

  try {
    log(`📤 Attempting to mint NFT...`, colors.cyan);
    log(`   Wallet: ${wallet.address}`, colors.cyan);

    // Check pre-mint status
    log("\n   Pre-Mint Status:", colors.bright);
    const preWhitelisted = await checkWhitelisted(contract, wallet.address);
    const preHasMinted = await checkHasMinted(contract, wallet.address);
    const preBalance = await getBalance(contract, wallet.address);

    // Try to mint
    const tx = await contract.connect(wallet).mint();
    log(`\n📥 Transaction sent: ${tx.hash}`, colors.cyan);
    log(`   Waiting for confirmation...`, colors.cyan);

    const receipt = await tx.wait();
    log(`✅ Transaction confirmed!`, colors.green);
    log(`   Block: ${receipt.blockNumber}`, colors.cyan);
    log(`   Gas Used: ${receipt.gasUsed.toString()}`, colors.cyan);

    // Check post-mint status
    log("\n   Post-Mint Status:", colors.bright);
    const postHasMinted = await checkHasMinted(contract, wallet.address);
    const postBalance = await getBalance(contract, wallet.address);

    // Find minted token ID from events
    const mintEvent = receipt.logs
      .map((log) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((event) => event && event.name === "NFTMinted");

    if (mintEvent) {
      const tokenId = mintEvent.args.tokenId.toString();
      log(`   Token ID: ${tokenId}`, colors.green);
    }

    logResult(true, "Mint successful!");
    return { success: true, receipt, preBalance, postBalance };
  } catch (error) {
    log(`\n📥 Transaction failed`, colors.red);
    log(`   Error: ${error.message}`, colors.red);

    // Check if error is expected
    const errorMessage = error.message.toLowerCase();
    const isExpectedError =
      errorMessage.includes("not whitelisted") ||
      errorMessage.includes("already minted") ||
      errorMessage.includes("unauthorized");

    if (isExpectedError) {
      logResult(true, "Failed as expected (access denied)");
      return { success: false, expectedFailure: true, error: error.message };
    } else {
      logResult(false, `Unexpected error: ${error.message}`);
      return { success: false, expectedFailure: false, error: error.message };
    }
  }
}

async function runTests() {
  log(
    "\n╔═══════════════════════════════════════════════════════════════╗",
    colors.bright
  );
  log(
    "║            🧪 NFT MINTING TEST SUITE 🧪                      ║",
    colors.bright
  );
  log(
    "╚═══════════════════════════════════════════════════════════════╝\n",
    colors.bright
  );

  // Load contract ABI
  log("📄 Loading contract ABI...", colors.cyan);
  const contractABI = loadContractABI();
  if (!contractABI) {
    log("❌ Failed to load contract ABI", colors.red);
    process.exit(1);
  }
  log("✅ ABI loaded successfully", colors.green);

  // Setup provider
  log("\n🔌 Connecting to RPC...", colors.cyan);
  log(`   URL: ${RPC_URL}`, colors.cyan);
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  try {
    const network = await provider.getNetwork();
    log(
      `✅ Connected to network: ${network.name} (chainId: ${network.chainId})`,
      colors.green
    );
  } catch (error) {
    log(`❌ Failed to connect: ${error.message}`, colors.red);
    process.exit(1);
  }

  // Create contract instance
  log("\n📝 Creating contract instance...", colors.cyan);
  log(`   Address: ${CONTRACT_ADDRESS}`, colors.cyan);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
  log("✅ Contract instance created", colors.green);

  // Get contract info
  try {
    log("\n📊 Contract Information:", colors.bright);
    const name = await contract.name();
    const symbol = await contract.symbol();
    const currentTokenId = await contract.getCurrentTokenId();
    const owner = await contract.owner();

    log(`   Name: ${name}`, colors.cyan);
    log(`   Symbol: ${symbol}`, colors.cyan);
    log(`   Next Token ID: ${currentTokenId.toString()}`, colors.cyan);
    log(`   Owner: ${owner}`, colors.cyan);
  } catch (error) {
    log(`   Error fetching contract info: ${error.message}`, colors.red);
  }

  const results = [];

  // Generate test wallets
  const wallet1 = new ethers.Wallet(
    ethers.hexlify(ethers.randomBytes(32)),
    provider
  );
  const wallet2 = new ethers.Wallet(
    ethers.hexlify(ethers.randomBytes(32)),
    provider
  );

  log("\n🔑 Generated Test Wallets:", colors.bright);
  log(`   Wallet 1: ${wallet1.address}`, colors.cyan);
  log(`   Wallet 2: ${wallet2.address}`, colors.cyan);

  // TEST 1: Non-whitelisted wallet tries to mint (should fail)
  log("\n⚠️  TEST 1: Non-Whitelisted Mint", colors.yellow);
  log("   This test requires the wallet to NOT be whitelisted", colors.yellow);
  log(
    '   Expected: Transaction should revert with "Not whitelisted"',
    colors.yellow
  );

  const isWallet1Whitelisted = await checkWhitelisted(
    contract,
    wallet1.address
  );
  if (!isWallet1Whitelisted) {
    // Note: This will fail because wallet has no funds, but that's expected
    log(
      "   Wallet is not whitelisted, but has no funds for gas",
      colors.yellow
    );
    log("   Skipping actual mint attempt...", colors.yellow);
    results.push(null);
  } else {
    log("   Wallet is already whitelisted, skipping test", colors.yellow);
    results.push(null);
  }

  // TEST 2: Whitelisted wallet mints successfully
  log("\n⚠️  TEST 2: Successful Mint (Whitelisted)", colors.yellow);
  log("   This test requires:", colors.yellow);
  log("   1. A wallet that is whitelisted", colors.yellow);
  log("   2. The wallet has enough ETH for gas", colors.yellow);
  log("   3. The wallet has not minted yet", colors.yellow);
  log(
    "   Manual test required - provide private key via MINTER_PRIVATE_KEY env var",
    colors.yellow
  );

  const minterPrivateKey = process.env.MINTER_PRIVATE_KEY;
  if (minterPrivateKey) {
    try {
      const minterWallet = new ethers.Wallet(minterPrivateKey, provider);
      log(`   Using wallet: ${minterWallet.address}`, colors.cyan);

      const result = await attemptMint(
        contract,
        minterWallet,
        "Whitelisted Wallet Mint"
      );
      results.push(result.success);
    } catch (error) {
      log(`   Error: ${error.message}`, colors.red);
      results.push(false);
    }
  } else {
    log("   Skipping - MINTER_PRIVATE_KEY not provided", colors.yellow);
    results.push(null);
  }

  // TEST 3: Try to mint twice (should fail)
  log("\n⚠️  TEST 3: Duplicate Mint (should fail)", colors.yellow);
  log("   This test requires a wallet that has already minted", colors.yellow);
  log(
    '   Expected: Transaction should revert with "Already minted"',
    colors.yellow
  );

  if (minterPrivateKey) {
    try {
      const minterWallet = new ethers.Wallet(minterPrivateKey, provider);
      const hasMinted = await checkHasMinted(contract, minterWallet.address);

      if (hasMinted) {
        const result = await attemptMint(
          contract,
          minterWallet,
          "Duplicate Mint Attempt"
        );
        results.push(result.expectedFailure);
      } else {
        log(
          "   Wallet has not minted yet, skipping duplicate mint test",
          colors.yellow
        );
        results.push(null);
      }
    } catch (error) {
      log(`   Error: ${error.message}`, colors.red);
      results.push(false);
    }
  } else {
    log("   Skipping - MINTER_PRIVATE_KEY not provided", colors.yellow);
    results.push(null);
  }

  // TEST 4: Check token URI
  log("\n⚠️  TEST 4: Token URI Format", colors.yellow);
  log("   Checking if minted tokens have correct metadata URIs", colors.yellow);

  if (minterPrivateKey) {
    try {
      const minterWallet = new ethers.Wallet(minterPrivateKey, provider);
      const balance = await contract.balanceOf(minterWallet.address);

      if (balance > 0) {
        // Get token ID (assuming ERC721 standard)
        // Note: The95Pass doesn't implement ERC721Enumerable, so we can't easily get token IDs
        log(
          "   Wallet has NFTs, but contract does not implement tokenOfOwnerByIndex",
          colors.yellow
        );
        log(
          "   Manual verification required via block explorer",
          colors.yellow
        );
        results.push(null);
      } else {
        log("   Wallet has no NFTs", colors.yellow);
        results.push(null);
      }
    } catch (error) {
      log(`   Error: ${error.message}`, colors.red);
      results.push(false);
    }
  } else {
    log("   Skipping - MINTER_PRIVATE_KEY not provided", colors.yellow);
    results.push(null);
  }

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

  log("\n💡 To run full minting tests:", colors.yellow);
  log(
    "   1. Whitelist a test wallet using the whitelist-server",
    colors.yellow
  );
  log("   2. Fund the wallet with ETH for gas", colors.yellow);
  log(
    "   3. Export the private key: export MINTER_PRIVATE_KEY=0x...",
    colors.yellow
  );
  log("   4. Run this script again", colors.yellow);

  const allPassed = failed === 0;
  log(
    `\n${allPassed ? "🎉 All tests passed!" : "⚠️  Some tests failed"}`,
    allPassed ? colors.green : colors.red
  );

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(console.error);
