export default function PenIcon({ size = 26 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      style={{ transform: "rotate(45deg) translate(-2px, -18px)" }}
    >
      <defs>
        <linearGradient id="penBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4A84F" />
          <stop offset="100%" stopColor="#6E1737" />
        </linearGradient>
      </defs>
      <rect x="17" y="2" width="6" height="24" rx="3" fill="url(#penBody)" />
      <path d="M17 26 L23 26 L20 36 Z" fill="#3B241C" />
      <circle cx="20" cy="8" r="2" fill="#F6D98A" />
    </svg>
  );
}
