"use client";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ShieldCheck } from "lucide-react";

type Preference = "essential" | "external" | null;
// Version the key whenever consent meanings change; old choices must not be
// silently repurposed for a new data-processing purpose.
const STORAGE_KEY = "trimurti-privacy-v2";
const EVENT = "trimurti-privacy-change";
const PreferenceContext = createContext<{
  external: boolean;
  openSettings: () => void;
}>({ external: false, openSettings: () => {} });
let memoryPreference: Preference = null;

type GoogleConsent = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function updateGoogleConsent(analytics: GoogleConsent) {
  // Keep advertising consent denied: this site uses Google only for maps,
  // reviews and optional aggregate analytics, never ad targeting.
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args) => window.dataLayer?.push(args));
  window.gtag("consent", "update", {
    analytics_storage: analytics,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function getPreference(): Preference {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return memoryPreference;
    const data = JSON.parse(raw);
    return data.expires > Date.now() &&
      ["essential", "external"].includes(data.choice)
      ? data.choice
      : null;
  } catch {
    return memoryPreference;
  }
}
function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
const serverPreference = () => null;

export function usePrivacy() {
  return useContext(PreferenceContext);
}

export function PrivacyProvider({ children }: { children: ReactNode }) {
  const choice = useSyncExternalStore(
    subscribe,
    getPreference,
    serverPreference,
  );
  const [settingsOpen, setSettingsOpen] = useState(false);

  function choose(preference: Exclude<Preference, null>) {
    memoryPreference = preference;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          choice: preference,
          expires: Date.now() + 180 * 86400000,
        }),
      );
    } catch {
      /* Preferences still work for this visit when storage is blocked. */
    }
    // Update Consent Mode before notifying mounted integrations, so a newly
    // rendered analytics tag observes the visitor's latest choice immediately.
    updateGoogleConsent(preference === "external" ? "granted" : "denied");
    window.dispatchEvent(new Event(EVENT));
    setSettingsOpen(false);
  }

  return (
    <PreferenceContext.Provider
      value={{
        external: choice === "external",
        openSettings: () => setSettingsOpen(true),
      }}
    >
      {children}
      {(choice === null || settingsOpen) && (
        <aside
          className="cookie-banner"
          aria-label="Cookie and privacy preferences"
        >
          <span className="cookie-mark">
            <ShieldCheck size={21} />
          </span>
          <div>
            <h2>Cookie &amp; Google consent</h2>
            <p>
              Essential storage keeps this choice and supports admin sign-in.
              The map is shown to help you find the showroom. If you allow
              Google features, optional Google review content and Google
              Analytics may use your device, browser and site interaction data.
            </p>
            <p>
              <strong>DPDP Act, 2023 notice:</strong> Trimurti Coolers uses
              optional Google processing to display Google feedback and
              understand aggregate site use. Your choice is sent through Google
              Consent Mode; analytics storage is granted only when you opt in,
              while advertising storage, ad user data and ad personalisation
              remain denied. You can refuse or withdraw consent at any time
              using Cookie settings.
            </p>
            <div className="cookie-actions">
              <button
                className="button button-secondary button-small"
                onClick={() => choose("essential")}
              >
                Essential only
              </button>
              <button
                className="button button-small"
                onClick={() => choose("external")}
              >
                Allow reviews & analytics
              </button>
            </div>
          </div>
        </aside>
      )}
    </PreferenceContext.Provider>
  );
}

export function PrivacySettingsButton() {
  const { openSettings } = usePrivacy();
  return (
    <button className="privacy-settings" type="button" onClick={openSettings}>
      Cookie settings
    </button>
  );
}
