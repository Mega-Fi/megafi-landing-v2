import React from "react";
import { Wallet, Loader2 } from "lucide-react";

interface WalletPrepareCardProps {
  walletAddress: string;
  onContinue: () => void;
  isPreparing?: boolean;
}

export function WalletPrepareCard({
  walletAddress,
  onContinue,
  isPreparing = false,
}: WalletPrepareCardProps) {
  const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(
    -4
  )}`;

  return (
    <div className="eligibility-card-outer" style={{ position: "relative" }}>
      {/* <div className="eligibility-dot"></div> */}
      <div className="eligibility-card">
        {/* Decorative background elements */}
        <div className="eligibility-ray"></div>
        <div className="eligibility-line eligibility-topl"></div>
        <div className="eligibility-line eligibility-leftl"></div>
        <div className="eligibility-line eligibility-bottoml"></div>
        <div className="eligibility-line eligibility-rightl"></div>

        {/* Content layer */}
        <div className="relative" style={{ position: "relative", zIndex: 10 }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            {isPreparing ? (
              <Loader2 className="text-emerald-400 animate-spin" size={24} />
            ) : (
              <Wallet className="text-emerald-400" size={24} />
            )}
            <h3 className="eligibility-title">
              {isPreparing ? "Preparing Wallet..." : "Wallet Connected"}
            </h3>
          </div>

          <p className="eligibility-message mb-4">
            {isPreparing ? (
              <>
                Preparing your wallet{" "}
                <span className="text-emerald-400 font-semibold font-mono">
                  {shortAddress}
                </span>{" "}
                for minting...
              </>
            ) : (
              <>
                Your wallet{" "}
                <span className="text-emerald-400 font-semibold font-mono">
                  {shortAddress}
                </span>{" "}
                needs to be prepared before minting
              </>
            )}
          </p>
        </div>
      </div>

      {/* Button positioned outside card to avoid stacking context issues */}
      {!isPreparing && (
        <button
          onClick={onContinue}
          className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer mt-4"
          type="button"
          style={{ position: "relative", zIndex: 1000 }}
        >
          Continue
        </button>
      )}

      {isPreparing && (
        <div
          className="w-full px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold rounded-lg text-center mt-4"
          style={{ position: "relative", zIndex: 1000 }}
        >
          Please sign the message in your wallet
        </div>
      )}
    </div>
  );
}
