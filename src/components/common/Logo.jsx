import React from 'react';

const Logo = ({ className = "w-10 h-10", showText = false, textSize = "text-xl" }) => {
    // Generate unique ID for gradient to avoid conflicts
    const gradId = `brainGrad-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="flex items-center gap-2 select-none">
            <svg
                viewBox="0 0 100 100"
                className={className}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Defs for Gradients */}
                <defs>
                    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#818CF8" /> {/* Indigo */}
                        <stop offset="50%" stopColor="#F472B6" /> {/* Pink */}
                        <stop offset="100%" stopColor="#34D399" /> {/* Emerald */}
                    </linearGradient>
                </defs>

                {/* Stars/Sparkles (Background) */}
                <path d="M15 25 L17 20 L19 25 L24 27 L19 29 L17 34 L15 29 L10 27 Z" fill="#FBBF24" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
                </path>
                <path d="M85 80 L87 75 L89 80 L94 82 L89 84 L87 89 L85 84 L80 82 Z" fill="#F472B6" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2.5s" repeatCount="indefinite" />
                </path>

                {/* Brain Shape */}
                <path
                    d="M25 55 
                       C 20 25, 80 25, 75 55
                       C 85 60, 85 80, 70 85
                       C 60 100, 40 100, 30 85
                       C 15 80, 15 60, 25 55 Z"
                    fill={`url(#${gradId})`}
                    stroke="white"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />

                {/* Face */}
                {/* Eyes */}
                <circle cx="40" cy="65" r="4.5" fill="#1F2937" />
                <circle cx="40" cy="63" r="1.5" fill="white" />

                <circle cx="60" cy="65" r="4.5" fill="#1F2937" />
                <circle cx="60" cy="63" r="1.5" fill="white" />

                {/* Cheeks */}
                <ellipse cx="34" cy="72" rx="4" ry="2" fill="#F9A8D4" opacity="0.8" />
                <ellipse cx="66" cy="72" rx="4" ry="2" fill="#F9A8D4" opacity="0.8" />

                {/* Smile */}
                <path d="M45 72 Q50 78 55 72" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            </svg>

            {showText && (
                <span className={`font-extrabold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent ${textSize}`}>
                    LearnNeur
                </span>
            )}
        </div>
    );
};

export default Logo;
