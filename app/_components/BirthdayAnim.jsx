'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Cake = dynamic(() => import('lucide-react').then(mod => mod.Cake), { ssr: false });
const Gift = dynamic(() => import('lucide-react').then(mod => mod.Gift), { ssr: false });
const Party = dynamic(() => import('lucide-react').then(mod => mod.Party), { ssr: false });

const BirthdayAnimations = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute w-full h-full">
        <defs>
          <path id="floatPath" d="M0,100 Q50,-30 100,100 T200,100" />
        </defs>
        
        {/* Floating cakes */}
        {[...Array(5)].map((_, i) => (
          <g key={`cake-${i}`}>
            <animateMotion
              dur={`${10 + i * 2}s`}
              repeatCount="indefinite"
              path="M0,100 Q50,-30 100,100 T200,100"
            >
              <g transform={`translate(${i * 20}%, ${i * 15}%)`}>
                <Cake size={24 + i * 8} className="text-pink-400" />
              </g>
            </animateMotion>
          </g>
        ))}

        {/* Bouncing gifts */}
        {[...Array(3)].map((_, i) => (
          <g key={`gift-${i}`}>
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`${i * 30}% 100%; ${i * 30}% 80%; ${i * 30}% 100%`}
              dur={`${3 + i}s`}
              repeatCount="indefinite"
            >
              <Gift size={32 + i * 8} className="text-purple-500" />
            </animateTransform>
          </g>
        ))}

        {/* Rotating party icons */}
        {[...Array(4)].map((_, i) => (
          <g key={`party-${i}`} transform={`translate(${75 + i * 15}%, ${50 + (i % 2) * 20}%)`}>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 0 0"
              to="360 0 0"
              dur={`${10 - i}s`}
              repeatCount="indefinite"
            >
              <Party size={28 + i * 4} className="text-yellow-400" />
            </animateTransform>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default BirthdayAnimations;