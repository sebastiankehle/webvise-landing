"use client";

export default function GradientOrb() {
  return (
    <div
      className="relative h-[300px] w-full md:h-[400px]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Primary — brand color */}
        <div
          className="orb-layer absolute h-[280px] w-[280px] rounded-full opacity-40 blur-[100px]"
          style={{
            backgroundColor: "oklch(0.75 0.18 55)",
            animation: "orb-rotate 8s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        {/* Secondary — cool purple-blue */}
        <div
          className="orb-layer absolute h-[220px] w-[220px] rounded-full opacity-25 blur-[80px]"
          style={{
            backgroundColor: "oklch(0.65 0.15 280)",
            animation: "orb-rotate-reverse 10s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        {/* Tertiary — warm amber */}
        <div
          className="orb-layer absolute h-[240px] w-[240px] rounded-full opacity-20 blur-[90px]"
          style={{
            backgroundColor: "oklch(0.78 0.12 75)",
            animation: "orb-drift 12s ease-in-out infinite",
            willChange: "transform",
          }}
        />
      </div>
    </div>
  );
}
