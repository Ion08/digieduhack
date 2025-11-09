
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = 'h-8 w-8' }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="EduMentor AI Logo"
  >
    <defs>
      <mask id="c-shape-mask-logo">
        <rect width="100" height="100" fill="white" />
        <rect x="50" y="25" width="50" height="50" fill="black" />
      </mask>
    </defs>
    <g mask="url(#c-shape-mask-logo)">
      {/* Concentric circles with varying opacities to create the layered effect */}
      <circle cx="50" cy="50" r="50" fill="currentColor" opacity="0.2" />
      <circle cx="50" cy="50" r="42" fill="currentColor" opacity="0.4" />
      <circle cx="50" cy="50" r="34" fill="currentColor" opacity="0.6" />
      <circle cx="50" cy="50" r="26" fill="currentColor" opacity="0.8" />
      {/* The innermost, solid part */}
      <circle cx="50" cy="50" r="18" fill="currentColor" />
      {/* This circle punches out the center by drawing with the background color */}
      <circle cx="50" cy="50" r="10" fill="var(--base-100)" />
    </g>
  </svg>
);
