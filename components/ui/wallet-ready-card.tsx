import React from 'react';
import { Check, Wallet } from 'lucide-react';

interface WalletReadyCardProps {
  walletAddress: string;
}

export function WalletReadyCard({ walletAddress }: WalletReadyCardProps) {
  const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  
  return (
    <div className="eligibility-card-outer">
      <div className="eligibility-dot"></div>
      <div className="eligibility-card">
        <div className="eligibility-ray"></div>
        
        {/* Icon */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Check className="text-emerald-400" size={24} />
          <h3 className="eligibility-title">Wallet Ready</h3>
        </div>
        
        {/* Message */}
        <p className="eligibility-message">
          Your wallet <span className="text-emerald-400 font-semibold font-mono">{shortAddress}</span> is ready to mint
        </p>
        
        {/* Animated borders */}
        <div className="eligibility-line eligibility-topl"></div>
        <div className="eligibility-line eligibility-leftl"></div>
        <div className="eligibility-line eligibility-bottoml"></div>
        <div className="eligibility-line eligibility-rightl"></div>
      </div>
    </div>
  );
}

