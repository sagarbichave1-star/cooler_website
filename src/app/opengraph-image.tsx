import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Tirupati Coolers, Surat";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        color: "#ffffff",
        background: "#071f3d",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 650,
          height: 650,
          right: -120,
          top: -160,
          border: "2px solid rgba(40,194,223,.35)",
          borderRadius: "50%",
        }}
      />
      <div style={{ display: "flex", width: 1000, flexDirection: "column" }}>
        <div style={{ display: "flex", marginBottom: 48, color: "#62d4e7", fontSize: 24, letterSpacing: 5 }}>
          SURAT, GUJARAT
        </div>
        <div style={{ display: "flex", fontSize: 94, fontWeight: 700, letterSpacing: -5, lineHeight: 1 }}>
          Tirupati Coolers
        </div>
        <div style={{ display: "flex", marginTop: 28, color: "#c8dce6", fontSize: 34 }}>
          Find the right cooler for your space.
        </div>
      </div>
    </div>,
    size,
  );
}
