"use client";

import mixpanel, { Config } from "mixpanel-browser";

// Mixpanel event names
export const MIXPANEL_EVENTS = {
  // Landing page events
  PAGE_VIEW_LANDING: "Page View - Landing",
  NFT_BANNER_CLICK: "NFT Banner Click",

  // NFT Claim page events
  PAGE_VIEW_NFT_CLAIM: "Page View - NFT Claim",
  NFT_CLAIM_STARTED: "NFT Claim Started",

  // Twitter/X connection
  TWITTER_AUTH_INITIATED: "Twitter Auth Initiated",
  TWITTER_AUTH_SUCCESS: "Twitter Auth Success",
  TWITTER_AUTH_FAILED: "Twitter Auth Failed",

  // Eligibility check
  ELIGIBILITY_CHECK_STARTED: "Eligibility Check Started",
  ELIGIBILITY_CHECK_ELIGIBLE: "Eligibility Check - Eligible",
  ELIGIBILITY_CHECK_NOT_ELIGIBLE: "Eligibility Check - Not Eligible",
  ELIGIBILITY_CHECK_FAILED: "Eligibility Check Failed",

  // Wallet connection
  WALLET_CONNECT_INITIATED: "Wallet Connect Initiated",
  WALLET_CONNECT_SUCCESS: "Wallet Connect Success",
  WALLET_CONNECT_FAILED: "Wallet Connect Failed",

  // Minting
  NFT_MINT_INITIATED: "NFT Mint Initiated",
  NFT_MINT_SUCCESS: "NFT Mint Success",
  NFT_MINT_FAILED: "NFT Mint Failed",
  NFT_MINT_CANCELLED: "NFT Mint Cancelled",

  // Claim recording
  CLAIM_RECORD_SUCCESS: "Claim Record Success",
  CLAIM_RECORD_FAILED: "Claim Record Failed",
} as const;

class MixpanelService {
  private initialized = false;

  /**
   * Initialize Mixpanel with project token
   */
  init() {
    if (this.initialized) return;

    const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

    if (!token) {
      console.warn("Mixpanel token not found. Analytics will not be tracked.");
      return;
    }

    try {
      const config: Partial<Config> = {
        debug: process.env.NODE_ENV === "development",
        track_pageview: false, // We'll handle page views manually
        persistence: "localStorage",
        ignore_dnt: false, // Respect Do Not Track
      };

      mixpanel.init(token, config);
      this.initialized = true;

      if (process.env.NODE_ENV === "development") {
        console.log("✅ Mixpanel initialized");
      }
    } catch (error) {
      // Silently fail - analytics blocking is common and shouldn't break the app
      // Only log in development
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "Mixpanel initialization failed (may be blocked by ad blocker):",
          error
        );
      }
    }
  }

  /**
   * Track an event with optional properties
   */
  track(eventName: string, properties?: Record<string, any>) {
    if (!this.initialized) {
      if (process.env.NODE_ENV === "development") {
        console.log("🔍 [Mixpanel Mock]", eventName, properties);
      }
      return;
    }

    try {
      mixpanel.track(eventName, {
        ...properties,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      });
    } catch (error) {
      // Silently fail - analytics blocking is common and shouldn't break the app
      // Only log in development
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "Mixpanel tracking blocked or failed (this is normal with ad blockers):",
          error
        );
      }
    }
  }

  /**
   * Track a page view
   */
  trackPageView(pageName: string, properties?: Record<string, any>) {
    this.track(`Page View - ${pageName}`, {
      ...properties,
      url: typeof window !== "undefined" ? window.location.href : "",
      path: typeof window !== "undefined" ? window.location.pathname : "",
    });
  }

  /**
   * Identify a user (when they connect Twitter or wallet)
   */
  identify(userId: string, properties?: Record<string, any>) {
    if (!this.initialized) return;

    try {
      mixpanel.identify(userId);

      if (properties) {
        mixpanel.people.set(properties);
      }
    } catch (error) {
      console.error("Failed to identify user:", error);
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: Record<string, any>) {
    if (!this.initialized) return;

    try {
      mixpanel.people.set(properties);
    } catch (error) {
      console.error("Failed to set user properties:", error);
    }
  }

  /**
   * Reset user identity (on logout/disconnect)
   */
  reset() {
    if (!this.initialized) return;

    try {
      mixpanel.reset();
    } catch (error) {
      console.error("Failed to reset Mixpanel:", error);
    }
  }

  /**
   * Time an event (useful for measuring duration)
   */
  timeEvent(eventName: string) {
    if (!this.initialized) return;

    try {
      mixpanel.time_event(eventName);
    } catch (error) {
      console.error("Failed to time event:", error);
    }
  }
}

// Export singleton instance
export const analytics = new MixpanelService();

// Initialize on import (client-side only)
if (typeof window !== "undefined") {
  analytics.init();
}
