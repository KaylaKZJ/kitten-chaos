import * as React from 'react';

export default function GlobalMotionStyles() {
  return (
    <style jsx global>{`
      @keyframes wiggle {
        0% {
          transform: rotate(0deg);
        }
        25% {
          transform: rotate(-3deg);
        }
        50% {
          transform: rotate(0deg);
        }
        75% {
          transform: rotate(3deg);
        }
        100% {
          transform: rotate(0deg);
        }
      }
      .wiggle {
        animation: wiggle 1.2s ease-in-out infinite;
      }
      @keyframes shake {
        0% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(-2px);
        }
        50% {
          transform: translateX(2px);
        }
        75% {
          transform: translateX(-2px);
        }
        100% {
          transform: translateX(0);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .wiggle {
          animation: none !important;
        }
      }
    `}</style>
  );
}
