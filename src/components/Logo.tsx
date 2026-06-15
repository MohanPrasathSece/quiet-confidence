import React from "react";

export function Logo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Geometric A-ledger glyph */}
      <path d="M12 3L4 19h16L12 3z" />
      <path d="M12 3v16" strokeWidth="1.5" strokeDasharray="2 2" />
      <circle cx="12" cy="11" r="2" fill="currentColor" />
    </svg>
  );
}
