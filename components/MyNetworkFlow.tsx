"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export type FlowNode = {
  id: string;
  name: string;
  orders30d: number; // drives line weight + packet rate
  status: "live" | "syncing" | "issue";
  color: string;
  side: "left" | "right";
};

export default function MyNetworkFlow({
  buyers,
  logistics,
  storeName,
}: {
  buyers: FlowNode[];
  logistics: FlowNode[];
  storeName: string;
}) {
  // SVG canvas size in user units
  const W = 900;
  const H = 520;
  const cx = W / 2;
  const cy = H / 2;
  const left = buyers; // incoming
  const right = logistics; // outgoing
  const maxOrders = Math.max(
    1,
    ...left.map((n) => n.orders30d),
    ...right.map((n) => n.orders30d)
  );

  // Position each node along its side
  const sideX = { left: 110, right: W - 110 };
  const positions = (nodes: FlowNode[], side: "left" | "right") => {
    const step = (H - 100) / Math.max(1, nodes.length);
    return nodes.map((n, i) => ({
      ...n,
      x: sideX[side],
      y: 50 + step * (i + 0.5),
    }));
  };
  const L = positions(left, "left");
  const R = positions(right, "right");

  // 30d totals
  const totalIn = L.reduce((a, n) => a + n.orders30d, 0);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="flow-in" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="flow-out" x1="1" x2="0">
            <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Connection ribbons */}
        {L.map((n) => {
          const weight = Math.max(1.2, (n.orders30d / maxOrders) * 6);
          const opacity = Math.max(0.18, n.orders30d / maxOrders);
          return (
            <FlowLine
              key={`in-${n.id}`}
              from={{ x: n.x + 28, y: n.y }}
              to={{ x: cx - 64, y: cy }}
              weight={weight}
              color="var(--accent)"
              opacity={opacity}
              packetCount={Math.min(4, Math.ceil(n.orders30d / 80))}
              status={n.status}
              direction="in"
            />
          );
        })}
        {R.map((n) => {
          const weight = Math.max(1.2, (n.orders30d / maxOrders) * 6);
          const opacity = Math.max(0.18, n.orders30d / maxOrders);
          return (
            <FlowLine
              key={`out-${n.id}`}
              from={{ x: cx + 64, y: cy }}
              to={{ x: n.x - 28, y: n.y }}
              weight={weight}
              color="var(--secondary)"
              opacity={opacity}
              packetCount={Math.min(4, Math.ceil(n.orders30d / 80))}
              status={n.status}
              direction="out"
            />
          );
        })}

        {/* Center: your store */}
        <g>
          <circle cx={cx} cy={cy} r="44" fill="var(--accent)" opacity="0.12">
            <animate attributeName="r" values="44;64;44" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0;0.2" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx} cy={cy} r="52" fill="var(--bg-elevated)" stroke="var(--accent)" strokeWidth="1.5" />
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fontFamily="var(--font-space)"
            fontWeight="700"
            fontSize="13"
            fill="var(--fg)"
          >
            {storeName.length > 14 ? storeName.slice(0, 12) + "…" : storeName || "Your store"}
          </text>
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            fontFamily="var(--font-jetbrains)"
            fontSize="9"
            fill="var(--fg-muted)"
            letterSpacing="0.05em"
          >
            {totalIn.toLocaleString("en-IN")} orders / 30d
          </text>
        </g>

        {/* Section labels */}
        <text x={110} y={28} textAnchor="middle" fontSize="10" letterSpacing="0.15em" fill="var(--fg-muted)" fontFamily="var(--font-dm)">
          BUYER APPS
        </text>
        <text x={W - 110} y={28} textAnchor="middle" fontSize="10" letterSpacing="0.15em" fill="var(--fg-muted)" fontFamily="var(--font-dm)">
          LOGISTICS
        </text>

        {/* Side nodes */}
        {[...L, ...R].map((n) => (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r="26"
              fill="var(--bg-elevated)"
              stroke={n.status === "issue" ? "var(--danger)" : n.color}
              strokeWidth="1.5"
            />
            {n.status === "issue" && (
              <circle cx={n.x + 18} cy={n.y - 18} r="5" fill="var(--danger)" />
            )}
            <text
              x={n.x}
              y={n.y + 4}
              textAnchor="middle"
              fontFamily="var(--font-space)"
              fontWeight="700"
              fontSize="11"
              fill="var(--fg)"
            >
              {n.name.slice(0, 2).toUpperCase()}
            </text>
            <text
              x={n.x}
              y={n.y + 44}
              textAnchor="middle"
              fontSize="10"
              fontFamily="var(--font-dm)"
              fill="var(--fg-muted)"
            >
              {n.name}
            </text>
            <text
              x={n.x}
              y={n.y + 56}
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--font-jetbrains)"
              fill={n.color}
              letterSpacing="0.05em"
            >
              {n.orders30d.toLocaleString("en-IN")}/30d
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function FlowLine({
  from,
  to,
  weight,
  color,
  opacity,
  packetCount,
  status,
  direction,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  weight: number;
  color: string;
  opacity: number;
  packetCount: number;
  status: "live" | "syncing" | "issue";
  direction: "in" | "out";
}) {
  // Curved path with horizontal tangents for a "river" feel
  const dx = (to.x - from.x) * 0.55;
  const c1 = { x: from.x + dx, y: from.y };
  const c2 = { x: to.x - dx, y: to.y };
  const d = `M ${from.x} ${from.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${to.x} ${to.y}`;

  return (
    <g opacity={opacity}>
      <path
        d={d}
        fill="none"
        stroke={status === "issue" ? "var(--danger)" : color}
        strokeWidth={weight}
        strokeLinecap="round"
        strokeDasharray={status === "syncing" ? "6 6" : undefined}
      >
        {status === "syncing" && (
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-24"
            dur="0.8s"
            repeatCount="indefinite"
          />
        )}
      </path>
      {status === "live" &&
        Array.from({ length: packetCount }).map((_, i) => (
          <circle
            key={i}
            r="3"
            fill={color}
          >
            <animateMotion
              dur={`${2.5 - packetCount * 0.2}s`}
              repeatCount="indefinite"
              begin={`${(i * 2.5) / packetCount}s`}
              keyPoints={direction === "in" ? "0;1" : "0;1"}
              keyTimes="0;1"
              path={d}
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur={`${2.5 - packetCount * 0.2}s`}
              repeatCount="indefinite"
              begin={`${(i * 2.5) / packetCount}s`}
            />
          </circle>
        ))}
    </g>
  );
}
