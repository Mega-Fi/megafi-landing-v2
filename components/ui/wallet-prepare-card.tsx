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
          className="btn-continue-emerald"
          type="button"
          style={{ position: "relative", zIndex: 1000 }}
        >
          Continue
        </button>
      )}

      <style jsx>{`
        .btn-continue-emerald {
          width: 100%;
          padding: 12px 24px;
          background: linear-gradient(
            135deg,
            rgba(16, 185, 129, 0.9) 0%,
            rgba(5, 150, 105, 0.9) 100%
          );
          color: white;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.2s ease;
          cursor: pointer;
          margin-top: 16px;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.4),
            0 0 40px rgba(16, 185, 129, 0.2);
          border: 2px solid rgba(16, 185, 129, 0.5);
        }
        .btn-continue-emerald:hover {
          background: linear-gradient(
            135deg,
            rgba(5, 150, 105, 0.95) 0%,
            rgba(16, 185, 129, 0.95) 100%
          );
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.6),
            0 0 60px rgba(16, 185, 129, 0.3);
          border-color: rgba(16, 185, 129, 0.8);
          transform: translateY(-1px);
        }
        .btn-continue-emerald:active {
          transform: translateY(0);
        }
      `}</style>

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
