export const CONSENT_KEY = "cookie-consent-preferences";
export const BANNER_SHOWN_KEY = "cookie-banner-shown";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const defaultPreferences: CookiePreferences = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
};

// Helper function to get all cookie preferences
export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === "undefined") return null;

  try {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) return null;

    return JSON.parse(consent);
  } catch {
    return null;
  }
}

// Helper function to re-show the cookie banner
export function showCookiePreferences(): void {
  if (typeof window === "undefined") return;

  // Remove the banner shown flag to trigger the banner to show again
  localStorage.removeItem(BANNER_SHOWN_KEY);

  // Dispatch event to trigger banner re-render
  window.dispatchEvent(new CustomEvent("showCookieBanner"));
}

// Make the function available globally for easy access
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).showCookiePreferences = showCookiePreferences;
}
