import { SVGProps } from "react";

interface JobOrbitLogoProps extends SVGProps<SVGSVGElement> {
  size?: number;
  showText?: boolean;
}

export default function JobOrbitLogo({
  size = 40,
  showText = false,
  ...props
}: JobOrbitLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Outer orbit ring */}
      <ellipse
        cx="50"
        cy="50"
        rx="44"
        ry="18"
        stroke="url(#orbitGrad)"
        strokeWidth="3"
        fill="none"
        transform="rotate(-30 50 50)"
        opacity="0.8"
      />
      {/* Inner circle */}
      <circle cx="50" cy="50" r="28" fill="url(#circleGrad)" />
      {/* Letter J */}
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fill="white"
        fontSize="34"
        fontWeight="700"
        fontFamily="Inter, Arial, sans-serif"
      >
        j
      </text>
      {/* Orbiting dot (orange) */}
      <circle cx="82" cy="24" r="5" fill="#F97316" />
      {/* Dot on J (cyan) */}
      <circle cx="50" cy="26" r="4" fill="#06B6D4" />
      {/* Gradient defs */}
      <defs>
        <linearGradient id="circleGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id="orbitGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
    </svg>
  );
}
