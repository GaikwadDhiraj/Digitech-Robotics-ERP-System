"use client";

import React, { useState, useEffect } from "react";

// Pre-computed deterministic lines with rounded decimal coordinates to prevent SSR/client hydration differences
const lineCount = 18;
const staticLines = Array.from({ length: lineCount }, (_, i) => {
  const factor = i / (lineCount - 1);
  const startY = Math.round(120 + factor * 260);
  const cp1X = Math.round(350 + factor * 80);
  const cp1Y = Math.round(220 + factor * 220);
  const cp2X = Math.round(850 + factor * 140);
  const cp2Y = Math.round(320 + factor * 260);
  const cp3X = Math.round(1150 + factor * 80);
  const cp3Y = Math.round(550 + factor * 180);
  const endX = Math.round(850 + factor * 280);
  const endY = 1050;

  const d = `M -80,${startY} C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${cp3X},${cp3Y} S ${endX},${endY} ${endX - 100},1150`;
  const opacity = Number((0.18 + Math.sin(factor * Math.PI) * 0.28).toFixed(3));
  const strokeWidth = Number((1.2 + factor * 0.8).toFixed(2));
  const animDelay = (i * 0.25).toFixed(2);
  const animDuration = (12 + (i % 5) * 2).toFixed(1);

  return {
    id: i,
    d,
    opacity,
    strokeWidth,
    animDelay,
    animDuration,
  };
});

const secondaryLineCount = 12;
const staticSecondaryLines = Array.from({ length: secondaryLineCount }, (_, i) => {
  const factor = i / (secondaryLineCount - 1);
  const startY = Math.round(500 + factor * 300);
  const cp1X = Math.round(200 + factor * 60);
  const cp1Y = Math.round(600 + factor * 180);
  const cp2X = Math.round(550 + factor * 120);
  const cp2Y = Math.round(750 + factor * 160);
  const endX = Math.round(750 + factor * 200);
  const endY = 1100;

  const d = `M -60,${startY} C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${endX},${endY}`;
  const opacity = Number((0.12 + Math.sin(factor * Math.PI) * 0.2).toFixed(3));
  const strokeWidth = Number((1.0 + factor * 0.6).toFixed(2));
  const animDelay = (i * 0.35 + 1).toFixed(2);
  const animDuration = (14 + (i % 4) * 2).toFixed(1);

  return {
    id: `sec-${i}`,
    d,
    opacity,
    strokeWidth,
    animDelay,
    animDuration,
  };
});

export default function AnimatedFlowLines({ className = "" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by rendering identical placeholder until mounted
  if (!mounted) {
    return (
      <div
        className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full min-w-[1000px] min-h-[600px] object-cover"
        viewBox="0 0 1600 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="digitechLineGrad" x1="0%" y1="20%" x2="70%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#cbd5e1" stopOpacity="0.6" />
            <stop offset="75%" stopColor="#7a1228" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="crimsonAccentGrad" x1="10%" y1="0%" x2="60%" y2="100%">
            <stop offset="0%" stopColor="#7a1228" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#991b1b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <style>{`
          @keyframes lineFlowDash {
            0% {
              stroke-dashoffset: 2400;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }

          @keyframes ribbonSway {
            0%, 100% {
              transform: translateY(0px) skewY(0deg);
            }
            50% {
              transform: translateY(-8px) skewY(-0.3deg);
            }
          }

          .animate-line-flow {
            stroke-dasharray: 600 300 900;
            animation: lineFlowDash 18s linear infinite;
          }

          .animate-ribbon-sway {
            animation: ribbonSway 9s ease-in-out infinite;
            transform-origin: 50% 50%;
          }
        `}</style>

        {/* Ambient glow circles */}
        <circle cx="200" cy="300" r="180" fill="#7a1228" fillOpacity="0.04" filter="blur(60px)" />
        <circle cx="950" cy="650" r="260" fill="#f43f5e" fillOpacity="0.03" filter="blur(80px)" />

        {/* Primary wireframe ribbon group */}
        <g className="animate-ribbon-sway">
          {staticLines.map((line, idx) => (
            <path
              key={line.id}
              d={line.d}
              stroke={idx % 4 === 0 ? "url(#crimsonAccentGrad)" : "url(#digitechLineGrad)"}
              strokeWidth={line.strokeWidth}
              strokeOpacity={line.opacity}
              strokeLinecap="round"
              className="animate-line-flow"
              style={{
                animationDuration: `${line.animDuration}s`,
                animationDelay: `-${line.animDelay}s`,
              }}
            />
          ))}
        </g>

        {/* Secondary lower sweeping group */}
        <g>
          {staticSecondaryLines.map((line, idx) => (
            <path
              key={line.id}
              d={line.d}
              stroke={idx % 3 === 0 ? "url(#crimsonAccentGrad)" : "url(#digitechLineGrad)"}
              strokeWidth={line.strokeWidth}
              strokeOpacity={line.opacity}
              strokeLinecap="round"
              className="animate-line-flow"
              style={{
                animationDuration: `${line.animDuration}s`,
                animationDelay: `-${line.animDelay}s`,
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
