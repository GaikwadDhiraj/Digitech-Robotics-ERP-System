"use client";

import React from "react";

export default function AnimatedFlowLines({ className = "" }) {
  // Generate 18 smooth sweeping bezier curves matching the Digitech Robotics wireframe aesthetic
  const lineCount = 18;
  const lines = Array.from({ length: lineCount }, (_, i) => {
    const factor = i / (lineCount - 1); // 0 to 1
    // Upper start on left edge
    const startY = 120 + factor * 260; // 120 to 380
    // Mid control points sweeping across the center behind text
    const cp1X = 350 + factor * 80;
    const cp1Y = 220 + factor * 220;

    const cp2X = 850 + factor * 140;
    const cp2Y = 320 + factor * 260;

    // Sweeping down curve
    const cp3X = 1150 + factor * 80;
    const cp3Y = 550 + factor * 180;

    // Swooping down to the bottom
    const endX = 850 + factor * 280;
    const endY = 1050;

    const d = `M -80,${startY} C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${cp3X},${cp3Y} S ${endX},${endY} ${endX - 100},1150`;

    // Varying opacity and stroke widths for 3D depth ribbon effect
    const opacity = 0.18 + Math.sin(factor * Math.PI) * 0.28;
    const strokeWidth = 1.2 + factor * 0.8;
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

  // Secondary lower bundle of converging contour curves for high-tech aesthetic
  const secondaryLines = Array.from({ length: 12 }, (_, i) => {
    const factor = i / 11;
    const startY = 500 + factor * 300;
    const cp1X = 200 + factor * 60;
    const cp1Y = 600 + factor * 180;
    const cp2X = 550 + factor * 120;
    const cp2Y = 750 + factor * 160;
    const endX = 750 + factor * 200;
    const endY = 1100;

    const d = `M -60,${startY} C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${endX},${endY}`;
    const opacity = 0.12 + Math.sin(factor * Math.PI) * 0.2;
    const strokeWidth = 1.0 + factor * 0.6;
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
          {/* Subtle gradient for lines flowing from left to bottom */}
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
              stroke-dashoffset: 600;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
          @keyframes waveSway {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-8px) rotate(0.4deg);
            }
          }
          .animate-line-flow {
            stroke-dasharray: 200 40;
            animation: lineFlowDash linear infinite;
          }
          .animate-ribbon-sway {
            animation: waveSway 10s ease-in-out infinite;
            transform-origin: 200px 300px;
          }
        `}</style>

        {/* Ambient background soft glow circles */}
        <circle cx="200" cy="250" r="350" fill="#fecdd3" opacity="0.12" filter="blur(60px)" />
        <circle cx="750" cy="450" r="450" fill="#f1f5f9" opacity="0.4" filter="blur(80px)" />

        {/* Primary wireframe ribbon group */}
        <g className="animate-ribbon-sway">
          {lines.map((line, idx) => (
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
          {secondaryLines.map((line, idx) => (
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
