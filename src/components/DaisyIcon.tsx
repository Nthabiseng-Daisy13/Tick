// src/components/DaisyIcon.tsx

export function DaisyIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <ellipse
          key={angle}
          cx="20"
          cy="11"
          rx="5.5"
          ry="9"
          fill="white"
          transform={`rotate(${angle} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="6.5" fill="#F3C94D" />
    </svg>
  );
}