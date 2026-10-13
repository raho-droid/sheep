import React from 'react';

interface AnimatedSheepSvgProps {
  number?: number;
  accessory?: 'nightcap' | 'flower' | 'crown' | 'stars' | 'ribbon';
  isJumping?: boolean;
  className?: string;
}

export const AnimatedSheepSvg: React.FC<AnimatedSheepSvgProps> = ({
  number,
  accessory = 'nightcap',
  isJumping = false,
  className = 'w-24 h-24',
}) => {
  return (
    <div className={`relative inline-block select-none ${className}`}>
      {/* Number Badge floating over sheep */}
      {number !== undefined && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded-full bg-indigo-950/80 backdrop-blur-xs border border-indigo-400/30 text-[11px] font-medium tracking-wide text-indigo-100 shadow-sm whitespace-nowrap">
          #{number}
        </div>
      )}

      <svg
        viewBox="0 0 160 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="woolGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="cloudShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Back legs (sleepy kicking motion when jumping) */}
        <g className={isJumping ? 'origin-center transition-transform' : ''}>
          <rect x="52" y="96" width="9" height="26" rx="4.5" fill="#475569" transform={isJumping ? "rotate(-25 56 96)" : ""} />
          <rect x="52" y="117" width="9" height="7" rx="3.5" fill="#1E293B" transform={isJumping ? "rotate(-25 56 96)" : ""} />

          <rect x="99" y="96" width="9" height="26" rx="4.5" fill="#475569" transform={isJumping ? "rotate(20 103 96)" : ""} />
          <rect x="99" y="117" width="9" height="7" rx="3.5" fill="#1E293B" transform={isJumping ? "rotate(20 103 96)" : ""} />
        </g>

        {/* Front legs */}
        <rect x="68" y="100" width="9" height="24" rx="4.5" fill="#64748B" transform={isJumping ? "rotate(-10 72 100)" : ""} />
        <rect x="68" y="119" width="9" height="7" rx="3.5" fill="#334155" transform={isJumping ? "rotate(-10 72 100)" : ""} />

        <rect x="85" y="100" width="9" height="24" rx="4.5" fill="#64748B" transform={isJumping ? "rotate(15 89 100)" : ""} />
        <rect x="85" y="119" width="9" height="7" rx="3.5" fill="#334155" transform={isJumping ? "rotate(15 89 100)" : ""} />

        {/* Fluffy Wool Body (Overlapping soft cloud circles) */}
        <g>
          {/* Main wool cloud */}
          <circle cx="50" cy="72" r="22" fill="url(#woolGrad)" />
          <circle cx="70" cy="60" r="25" fill="url(#woolGrad)" />
          <circle cx="92" cy="62" r="24" fill="url(#woolGrad)" />
          <circle cx="108" cy="74" r="20" fill="url(#woolGrad)" />
          <circle cx="95" cy="88" r="22" fill="url(#woolGrad)" />
          <circle cx="65" cy="90" r="22" fill="url(#woolGrad)" />
          <circle cx="46" cy="86" r="16" fill="url(#woolGrad)" />
          {/* Fluffy Little Tail */}
          <circle cx="34" cy="74" r="11" fill="url(#woolGrad)" />
          <circle cx="32" cy="76" r="8" fill="#F1F5F9" />
        </g>

        {/* Sheep Head */}
        <g>
          {/* Head base */}
          <ellipse cx="118" cy="66" rx="19" ry="17" fill="#FDE2E4" />
          <ellipse cx="118" cy="66" rx="18" ry="16" fill="#FCD5D9" />

          {/* Ears */}
          <ellipse cx="104" cy="56" rx="10" ry="5" fill="#FBB6CE" transform="rotate(-30 104 56)" />
          <ellipse cx="132" cy="58" rx="10" ry="5" fill="#FBB6CE" transform="rotate(30 132 58)" />

          {/* Forehead wool puffs */}
          <circle cx="112" cy="51" r="9" fill="url(#woolGrad)" />
          <circle cx="122" cy="50" r="9" fill="url(#woolGrad)" />
          <circle cx="117" cy="46" r="8" fill="url(#woolGrad)" />

          {/* Sleepy Smiling Closed Eyes */}
          <path d="M 111 67 Q 115 72 119 67" stroke="#475569" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <path d="M 125 67 Q 129 72 133 67" stroke="#475569" strokeWidth="2.4" strokeLinecap="round" fill="none" />

          {/* Rosy Blushing Cheeks */}
          <ellipse cx="109" cy="73" rx="4" ry="2.5" fill="#F472B6" opacity="0.6" />
          <ellipse cx="135" cy="73" rx="4" ry="2.5" fill="#F472B6" opacity="0.6" />

          {/* Tiny Cute Nose & Smile */}
          <ellipse cx="122" cy="74" rx="2.2" ry="1.6" fill="#FB7185" />
          <path d="M 122 75 Q 122 79 125 79" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </g>

        {/* Accessories */}
        {accessory === 'nightcap' && (
          <g>
            {/* Lavender nightcap drooping to the side */}
            <path
              d="M 108 47 Q 120 30 136 28 Q 146 36 142 48 Q 130 52 110 50 Z"
              fill="#818CF8"
            />
            {/* Cap trim */}
            <ellipse cx="118" cy="48" rx="11" ry="4" fill="#C7D2FE" />
            {/* Little nightcap pom-pom */}
            <circle cx="144" cy="48" r="5" fill="#FEF08A" />
            {/* Tiny stars on hat */}
            <path d="M 124 38 L 125 40 L 127 40 L 125.5 41.2 L 126 43 L 124 41.8 L 122 43 L 122.5 41.2 L 121 40 L 123 40 Z" fill="#FEF08A" opacity="0.9" />
          </g>
        )}

        {accessory === 'flower' && (
          <g>
            {/* Cute daisy/chamomile flower on ear */}
            <circle cx="104" cy="48" r="4.5" fill="#FDE047" />
            <circle cx="98" cy="47" r="3.5" fill="#FFFFFF" />
            <circle cx="102" cy="42" r="3.5" fill="#FFFFFF" />
            <circle cx="108" cy="44" r="3.5" fill="#FFFFFF" />
            <circle cx="108" cy="51" r="3.5" fill="#FFFFFF" />
            <circle cx="101" cy="53" r="3.5" fill="#FFFFFF" />
          </g>
        )}

        {accessory === 'crown' && (
          <g>
            {/* Little golden star princess/prince crown */}
            <polygon points="112,46 114,35 119,42 125,33 129,42 134,36 134,46" fill="#FBBF24" />
            <circle cx="114" cy="34" r="2" fill="#FDE68A" />
            <circle cx="125" cy="32" r="2" fill="#FDE68A" />
            <circle cx="134" cy="35" r="2" fill="#FDE68A" />
          </g>
        )}

        {accessory === 'stars' && (
          <g>
            {/* Floating constellation stars around head */}
            <circle cx="138" cy="42" r="2.5" fill="#FDE047" className="animate-pulse" />
            <circle cx="102" cy="38" r="2" fill="#FDE047" className="animate-pulse" />
            <circle cx="120" cy="32" r="3" fill="#FACC15" />
          </g>
        )}

        {accessory === 'ribbon' && (
          <g>
            {/* Soft pink bow tie / ribbon */}
            <path d="M 120 84 Q 112 80 113 88 Q 119 86 120 84 Z" fill="#F472B6" />
            <path d="M 120 84 Q 128 80 127 88 Q 121 86 120 84 Z" fill="#F472B6" />
            <circle cx="120" cy="84" r="2.5" fill="#FDA4AF" />
          </g>
        )}
      </svg>
    </div>
  );
};
