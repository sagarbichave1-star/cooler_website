import type { ProductTone } from "@/data/products";

type CoolerVisualProps = {
  visualId: string;
  tone?: ProductTone;
  compact?: boolean;
};

export function CoolerVisual({ visualId, tone = "ocean", compact = false }: CoolerVisualProps) {
  const bodyId = `cooler-body-${visualId}`;
  const fanId = `cooler-fan-${visualId}`;
  const shadowId = `cooler-shadow-${visualId}`;

  return (
    <div className={`cooler-visual tone-${tone}${compact ? " is-compact" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 520 580" focusable="false">
        <defs>
          <linearGradient id={bodyId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--cooler-highlight)" />
            <stop offset="1" stopColor="var(--cooler-body)" />
          </linearGradient>
          <radialGradient id={fanId}>
            <stop offset="0" stopColor="#f9feff" />
            <stop offset="1" stopColor="var(--cooler-fan)" />
          </radialGradient>
          <filter id={shadowId} x="-30%" y="-30%" width="160%" height="180%">
            <feDropShadow dx="0" dy="24" stdDeviation="20" floodColor="#073b4c" floodOpacity=".16" />
          </filter>
        </defs>
        <ellipse cx="260" cy="523" rx="164" ry="24" fill="var(--cooler-shadow)" opacity=".25" />
        <path d="M93 506c74-22 120 15 196-4 54-13 81-45 139-35" fill="none" stroke="var(--cooler-wave)" strokeWidth="3" strokeLinecap="round" opacity=".55" />
        <path d="M119 532c53-13 100 10 148-2 50-12 84-44 144-34" fill="none" stroke="var(--cooler-wave)" strokeWidth="2" strokeLinecap="round" opacity=".3" />
        <g filter={`url(#${shadowId})`}>
          <path d="M141 71c0-20 16-36 36-36h166c20 0 36 16 36 36l24 406c1 22-16 40-38 40H155c-22 0-39-18-38-40l24-406Z" fill={`url(#${bodyId})`} />
          <path d="M171 54h178c8 0 15 6 16 14l3 43H152l3-43c1-8 8-14 16-14Z" fill="var(--cooler-top)" opacity=".88" />
          <rect x="174" y="74" width="172" height="13" rx="6.5" fill="#073b4c" opacity=".22" />
          <rect x="213" y="93" width="94" height="9" rx="4.5" fill="#f7fdff" opacity=".7" />
          <circle cx="260" cy="270" r="121" fill="var(--cooler-frame)" opacity=".96" />
          <circle cx="260" cy="270" r="103" fill={`url(#${fanId})`} stroke="#ffffff" strokeOpacity=".6" strokeWidth="5" />
          <g fill="var(--cooler-blade)" opacity=".9">
            <path d="M262 259c9-57 49-77 71-67 19 9 5 48-22 68-19 15-37 15-49 10Z" />
            <path d="M271 273c57 9 77 49 67 71-9 19-48 5-68-22-15-19-15-37-10-49Z" />
            <path d="M258 281c-9 57-49 77-71 67-19-9-5-48 22-68 19-15 37-15 49-10Z" />
            <path d="M249 267c-57-9-77-49-67-71 9-19 48-5 68 22 15 19 15 37 10 49Z" />
          </g>
          <circle cx="260" cy="270" r="20" fill="var(--cooler-top)" />
          <circle cx="260" cy="270" r="8" fill="#eaf9fc" opacity=".78" />
          <g fill="none" stroke="#ffffff" strokeOpacity=".48" strokeWidth="2">
            <circle cx="260" cy="270" r="72" />
            <circle cx="260" cy="270" r="88" />
          </g>
          <rect x="167" y="422" width="186" height="54" rx="12" fill="#ffffff" opacity=".8" />
          <path d="M194 443h96" stroke="var(--cooler-body)" strokeWidth="7" strokeLinecap="round" opacity=".5" />
          <circle cx="326" cy="444" r="9" fill="var(--cooler-wave)" opacity=".8" />
          <path d="M142 386h236" stroke="#ffffff" strokeOpacity=".32" strokeWidth="2" />
          <rect x="143" y="501" width="42" height="19" rx="8" fill="var(--cooler-top)" />
          <rect x="335" y="501" width="42" height="19" rx="8" fill="var(--cooler-top)" />
        </g>
      </svg>
    </div>
  );
}
