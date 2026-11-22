import { useId } from "react";
import type { Artwork } from "@/lib/types";

export function ProductArt({
  kind,
  tone = "#e6dfd2",
  className = "",
  label = "Ilustración de producto",
}: {
  kind: Artwork;
  tone?: string;
  className?: string;
  label?: string;
}) {
  const id = useId().replaceAll(":", "");
  return (
    <svg
      className={`product-art ${className}`}
      viewBox="0 0 320 280"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={`${id}ceramic`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fffdf4" />
          <stop offset=".55" stopColor="#e6dece" />
          <stop offset="1" stopColor="#c2b5a1" />
        </linearGradient>
        <linearGradient id={`${id}glass`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff" stopOpacity=".85" />
          <stop offset=".5" stopColor="#c9e0db" stopOpacity=".38" />
          <stop offset="1" stopColor="#78a5a1" stopOpacity=".7" />
        </linearGradient>
        <linearGradient id={`${id}wood`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#dab782" />
          <stop offset="1" stopColor="#a67846" />
        </linearGradient>
        <filter id={`${id}shadow`} x="-40%" y="-40%" width="180%" height="200%">
          <feDropShadow
            dx="4"
            dy="13"
            stdDeviation="8"
            floodColor="#332e25"
            floodOpacity=".18"
          />
        </filter>
      </defs>
      <rect width="320" height="280" fill={tone} />
      <ellipse cx="164" cy="224" rx="90" ry="14" fill="#37382c" opacity=".08" />
      <g filter={`url(#${id}shadow)`}>
        {kind === "plates" && (
          <g transform="rotate(-17 160 140)">
            <ellipse cx="160" cy="154" rx="108" ry="73" fill="#c5baa8" />
            <ellipse
              cx="160"
              cy="145"
              rx="108"
              ry="73"
              fill={`url(#${id}ceramic)`}
            />
            <ellipse
              cx="160"
              cy="140"
              rx="86"
              ry="56"
              fill="none"
              stroke="#b9ad96"
              strokeWidth="1.5"
            />
            <ellipse cx="160" cy="139" rx="72" ry="46" fill="#eee8db" />
            <path
              d="M79 114c32-29 114-39 157-9"
              fill="none"
              stroke="white"
              strokeWidth="4"
              opacity=".8"
            />
          </g>
        )}
        {kind === "bowl" && (
          <g>
            <path
              d="M63 122c2 72 39 103 99 103s92-37 96-103"
              fill={`url(#${id}ceramic)`}
            />
            <ellipse cx="160" cy="122" rx="98" ry="48" fill="#bfb59f" />
            <ellipse cx="160" cy="121" rx="88" ry="40" fill="#eae4d5" />
            <path d="M85 126c13 30 136 36 151-1" stroke="#c4b79f" fill="none" />
            <path
              d="M77 147c15 34 42 52 66 57"
              stroke="#fff"
              strokeWidth="5"
              fill="none"
              opacity=".7"
            />
          </g>
        )}
        {kind === "tray" && (
          <g transform="rotate(-15 160 140)">
            <rect
              x="47"
              y="75"
              width="228"
              height="137"
              rx="24"
              fill={`url(#${id}ceramic)`}
            />
            <rect
              x="62"
              y="87"
              width="198"
              height="109"
              rx="17"
              fill="none"
              stroke="#b5a88f"
              strokeWidth="2"
            />
            <rect
              x="72"
              y="98"
              width="178"
              height="89"
              rx="12"
              fill="#ece5d5"
            />
          </g>
        )}
        {kind === "board" && (
          <g transform="rotate(-22 160 140)">
            <rect
              x="67"
              y="83"
              width="186"
              height="139"
              rx="20"
              fill={`url(#${id}wood)`}
            />
            <rect
              x="135"
              y="41"
              width="49"
              height="68"
              rx="15"
              fill={`url(#${id}wood)`}
            />
            <circle cx="159" cy="59" r="6" fill={tone} />
            {[109, 131, 155, 179, 198].map((y) => (
              <path
                key={y}
                d={`M82 ${y}q66 -11 155 0`}
                stroke="#855b37"
                opacity=".28"
                fill="none"
              />
            ))}
          </g>
        )}
        {kind === "glass" && (
          <g>
            {[0, 1].map((n) => (
              <g key={n} transform={`translate(${n * 83 - 40} ${n ? -13 : 9})`}>
                <path
                  d="M121 72h80l-8 106q-32 18-64 0Z"
                  fill={`url(#${id}glass)`}
                  stroke="#91aca5"
                  strokeWidth="1.5"
                />
                <ellipse
                  cx="161"
                  cy="72"
                  rx="40"
                  ry="9"
                  fill="none"
                  stroke="#faffff"
                  strokeWidth="3"
                />
                <ellipse
                  cx="161"
                  cy="179"
                  rx="32"
                  ry="7"
                  fill="none"
                  stroke="#8cafaa"
                />
                <path
                  d="M135 88l5 77"
                  stroke="white"
                  strokeWidth="5"
                  opacity=".6"
                />
              </g>
            ))}
          </g>
        )}
        {kind === "jug" && (
          <g>
            <path
              d="M199 112c72-22 79 91 8 79"
              fill="none"
              stroke="#c4baa5"
              strokeWidth="17"
            />
            <path
              d="M199 112c72-22 79 91 8 79"
              fill="none"
              stroke="#f2e9d7"
              strokeWidth="9"
            />
            <path
              d="M100 72l108 6-4 126q-51 29-102-1l-4-102-18-19Z"
              fill={`url(#${id}ceramic)`}
            />
            <ellipse cx="153" cy="77" rx="54" ry="11" fill="#b3a58c" />
            <path
              d="M119 103v81"
              stroke="white"
              strokeWidth="5"
              opacity=".65"
            />
          </g>
        )}
        {kind === "bottle" && (
          <g>
            <path
              d="M142 66h39v34l22 28v83q-42 18-83 0v-83l22-28Z"
              fill={`url(#${id}glass)`}
              stroke="#97aaa0"
              strokeWidth="2"
            />
            <rect
              x="139"
              y="48"
              width="45"
              height="22"
              rx="6"
              fill={`url(#${id}wood)`}
            />
            <path d="M136 136v60" stroke="white" strokeWidth="7" opacity=".6" />
          </g>
        )}
        {kind === "cutlery" && (
          <g
            transform="rotate(20 160 140)"
            fill="#c8ab6d"
            stroke="#e9d8a9"
            strokeWidth="2"
          >
            <path d="M105 65v42q0 14 12 18v92h10v-92q12-4 12-18V65h-6v38h-8V65h-6v38h-8V65Z" />
            <path d="M166 65q-31 2-20 47l14 15v90h12v-90l14-15q11-45-20-47Z" />
            <path d="M211 65q-17 31-10 81h9v71h11V65Z" />
          </g>
        )}
        {kind === "textile" && (
          <g transform="rotate(-14 160 140)">
            <rect
              x="63"
              y="70"
              width="194"
              height="143"
              rx="3"
              fill="#a89e80"
            />
            <path
              d="M65 74h188v129H65Z"
              fill={tone === "#d2dcd0" ? "#375e4c" : "#c3ae91"}
            />
            {Array.from({ length: 10 }, (_, i) => (
              <path
                key={i}
                d={`M${74 + i * 18} 73v134M65 ${82 + i * 12}h188`}
                stroke="#fff"
                strokeWidth=".6"
                opacity=".22"
              />
            ))}
            <path
              d="M63 214h194"
              stroke="#ede0c8"
              strokeWidth="7"
              strokeDasharray="2 4"
            />
            <path
              d="M185 74v128"
              stroke="#f0e5ce"
              opacity=".6"
              strokeWidth="4"
            />
          </g>
        )}
        {kind === "jar" && (
          <g>
            <rect
              x="102"
              y="86"
              width="121"
              height="136"
              rx="18"
              fill={`url(#${id}glass)`}
              stroke="#a3b4a4"
              strokeWidth="2"
            />
            <ellipse cx="163" cy="86" rx="60" ry="13" fill="#b98e5c" />
            <rect
              x="103"
              y="68"
              width="119"
              height="20"
              rx="6"
              fill={`url(#${id}wood)`}
            />
            <ellipse cx="163" cy="68" rx="59" ry="10" fill="#d7b681" />
            <path
              d="M119 105v87"
              stroke="white"
              strokeWidth="6"
              opacity=".65"
            />
            <rect
              x="140"
              y="131"
              width="45"
              height="39"
              rx="3"
              fill="#f8f2e5"
              opacity=".8"
            />
          </g>
        )}
      </g>
    </svg>
  );
}
