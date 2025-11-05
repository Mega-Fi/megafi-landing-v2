import React from 'react';
import { Check } from 'lucide-react';

interface EligibilityCardProps {
  twitterHandle: string;
}

export function EligibilityCard({ twitterHandle }: EligibilityCardProps) {
  return (
    <div className="eligibility-card-outer">
      <div className="eligibility-dot"></div>
      <div className="eligibility-card">
        <div className="eligibility-ray"></div>
        
        {/* Icon */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Check className="text-emerald-400" size={24} />
          <h3 className="eligibility-title">Eligibility Verified</h3>
        </div>
        
        {/* Message */}
        <p className="eligibility-message">
          Your X account <span className="text-emerald-400 font-semibold">@{twitterHandle}</span> is eligible to claim this NFT
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

