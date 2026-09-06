"use client";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export function ContactMap() {
  return (
    <div className="map-frame">
      <iframe
        title="Map of Surat, Gujarat"
        src={siteConfig.mapEmbedUrl}
        width="760"
        height="440"
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <a href={siteConfig.mapUrl} target="_blank" rel="noreferrer">
        Open in Google Maps <ArrowUpRight size={15} />
      </a>
    </div>
  );
}
