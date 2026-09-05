"use client";
import { ArrowUpRight, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { usePrivacy } from "./privacy-controls";

export function ContactMap() {
  const { external, openSettings } = usePrivacy();
  return (
    <div className="map-frame">
      {external ? (
        <iframe
          title="Map of Surat, Gujarat"
          src={siteConfig.mapEmbedUrl}
          width="760"
          height="440"
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <div className="map-consent">
          <MapPin size={30} />
          <h3>Find us in Surat.</h3>
          <p>Allow Google content to view the interactive map here.</p>
          <button className="button" onClick={openSettings}>
            Choose privacy settings
          </button>
        </div>
      )}
      <a href={siteConfig.mapUrl} target="_blank" rel="noreferrer">
        Open in Google Maps <ArrowUpRight size={15} />
      </a>
    </div>
  );
}
