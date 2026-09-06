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
const STORAGE_KEY = "trimurti-privacy-v1";
const EVENT = "trimurti-privacy-change";
const PreferenceContext = createContext<{
  external: boolean;
  openSettings: () => void;
}>({ external: false, openSettings: () => {} });
let memoryPreference: Preference = null;

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
            <h2>Your privacy choices.</h2>
            <p>
              We remember your preferences and use an essential cookie for admin
              sign-in. Google Maps and review images load only if you allow
              external content. Optional Google Analytics loads only after
              you allow Google content and only when the site owner enables it.
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
                Allow Google content
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
