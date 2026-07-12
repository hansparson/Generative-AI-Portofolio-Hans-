import React, { useState, useEffect } from 'react';

interface ProfileAvatarProps {
  className?: string;
  expression?: 'neutral' | 'happy' | 'excited' | 'thinking' | 'surprised' | 'explaining';
}

export default function ProfileAvatar({ 
  className = 'w-24 h-24',
  expression = 'neutral'
}: ProfileAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  if (!imgError) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        {/* Glow effect behind the image */}
        <div className="absolute inset-0 bg-indigo-500/15 rounded-full blur-md animate-pulse pointer-events-none" />
        <img 
          src="/images/profile_picture.jpg" 
          alt="Hans Parson Profile"
          className="w-full h-full rounded-full object-cover border border-slate-700/50 shadow-xl hover:scale-105 transition-transform duration-300 relative z-10"
          onError={() => {
            setImgError(true);
          }}
        />
      </div>
    );
  }
  
  // Determine shapes based on expression
  let leftEyebrowPath = "M 155 138 C 165 133, 175 133, 180 138";
  let rightEyebrowPath = "M 220 138 C 225 133, 235 133, 245 138";
  let defaultMouthPath = "M 178 198 Q 200 214 222 198"; // neutral smile
  let mouthFill = "none";

  if (expression === 'happy') {
    defaultMouthPath = "M 178 198 Q 200 226 222 198 Q 200 206 178 198"; // open smile
    mouthFill = "#7a4225";
    leftEyebrowPath = "M 155 134 C 165 129, 175 129, 180 134"; // raised
    rightEyebrowPath = "M 220 134 C 225 129, 235 129, 245 134"; // raised
  } else if (expression === 'excited') {
    defaultMouthPath = "M 175 198 Q 200 236 225 198 Q 200 206 175 198"; // wide open smile
    mouthFill = "#7a4225";
    leftEyebrowPath = "M 155 132 C 165 127, 175 127, 180 132"; // very raised
    rightEyebrowPath = "M 220 132 C 225 127, 235 127, 245 132"; // very raised
  } else if (expression === 'thinking') {
    defaultMouthPath = "M 183 204 Q 200 201 217 204"; // flat thinking mouth
    leftEyebrowPath = "M 155 140 C 165 138, 175 138, 180 140"; // lowered left eyebrow
    rightEyebrowPath = "M 220 132 C 225 127, 235 127, 245 132"; // raised right eyebrow
  } else if (expression === 'surprised') {
    defaultMouthPath = "M 193 210 A 7 7 0 1 0 207 210 A 7 7 0 1 0 193 210"; // small O mouth
    mouthFill = "#7a4225";
    leftEyebrowPath = "M 155 130 C 165 125, 175 125, 180 130"; // high eyebrows
    rightEyebrowPath = "M 220 130 C 225 125, 235 125, 245 130";
  } else if (expression === 'explaining') {
    defaultMouthPath = "M 178 198 Q 200 210 222 198"; // slightly open
    leftEyebrowPath = "M 155 136 C 165 131, 175 131, 180 136";
    rightEyebrowPath = "M 220 136 C 225 131, 235 131, 245 136";
  }

  const [mouthPath, setMouthPath] = useState(defaultMouthPath);

  // Sync mouthPath state when defaultMouthPath changes (due to expression updates)
  useEffect(() => {
    if (!isSpeaking) {
      setMouthPath(defaultMouthPath);
    }
  }, [expression, defaultMouthPath, isSpeaking]);

  // Listen to speech status
  useEffect(() => {
    const handleSpeechStatus = (e: any) => {
      setIsSpeaking(e.detail.isSpeaking);
    };
    window.addEventListener('speech-status', handleSpeechStatus);
    return () => window.removeEventListener('speech-status', handleSpeechStatus);
  }, []);

  // Blinking animation loop (eyes blink every 4-7 seconds for 150ms)
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Mouth-flapping animation loop during speech
  useEffect(() => {
    if (!isSpeaking) {
      setMouthPath(defaultMouthPath);
      return;
    }

    let frame = 0;
    const mouthInterval = setInterval(() => {
      frame++;
      const openAmount = Math.sin(frame * 0.85) * 0.5 + 0.5; // oscillation 0 to 1
      
      if (openAmount < 0.15) {
        setMouthPath(defaultMouthPath);
      } else {
        const controlY = 206 + (openAmount * 24); // ranges from 206 to 230
        setMouthPath(`M 178 198 Q 200 ${controlY} 222 198 Q 200 206 178 198`);
      }
    }, 75);

    return () => clearInterval(mouthInterval);
  }, [isSpeaking, defaultMouthPath]);

  // Support for custom cartoon images placed in public/images/ folder
  const useCustomAvatar = import.meta.env.VITE_USE_CUSTOM_AVATAR === 'true';

  if (useCustomAvatar) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        {/* Glow effect behind the image */}
        <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-md animate-pulse pointer-events-none" />
        <img 
          src={`/images/avatar_${expression}.png`} 
          alt={`AI Avatar - ${expression}`}
          className="w-full h-full rounded-full object-cover border border-slate-700/40 shadow-xl hover:scale-105 transition-transform duration-300 relative z-10"
          onError={(e) => {
            console.error(`Failed to load avatar image: /images/avatar_${expression}.png`);
          }}
        />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {/* 3D Glow */}
      <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-xl animate-pulse pointer-events-none" />
      
      <svg 
        viewBox="0 0 400 400" 
        className="w-full h-full rounded-full border-2 border-slate-700/50 shadow-2xl relative z-10 hover:scale-105 transition-transform duration-300" 
        referrerPolicy="no-referrer"
      >
        <defs>
          <linearGradient id="beigeBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eedfbf" />
            <stop offset="100%" stopColor="#d6c39d" />
          </linearGradient>
          <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b4d2f0" />
            <stop offset="50%" stopColor="#8cb4dc" />
            <stop offset="100%" stopColor="#678cb5" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde0c3" />
            <stop offset="100%" stopColor="#eeb68e" />
          </linearGradient>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2e2e36" />
            <stop offset="100%" stopColor="#121215" />
          </linearGradient>
          <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.2" />
          </filter>
        </defs>

        <circle cx="200" cy="200" r="190" fill="url(#beigeBg)" />
        <circle cx="200" cy="200" r="190" fill="none" stroke="#c0ad87" strokeWidth="2" opacity="0.5" />

        <g filter="url(#shadow)">
          <path 
            d="M 90 340 
               C 90 280, 130 255, 200 255 
               C 270 255, 310 280, 310 340 
               L 310 400 L 90 400 Z" 
            fill="url(#shirtGrad)" 
          />
          <path d="M 170 235 C 170 260, 230 260, 230 235 Z" fill="rgba(0,0,0,0.08)" />
          <path 
            d="M 170 220 
               L 170 250 
               C 170 265, 230 265, 230 250 
               L 230 220 Z" 
            fill="url(#skinGrad)" 
          />
          <path d="M 160 255 L 200 295 L 240 255 Z" fill="#7ba2cc" />
          <path d="M 160 255 L 180 285 L 200 255 Z" fill="#b4d2f0" stroke="#7ba2cc" strokeWidth="1" />
          <path d="M 240 255 L 220 285 L 200 255 Z" fill="#b4d2f0" stroke="#7ba2cc" strokeWidth="1" />
          
          <path 
            d="M 90 340 
               C 95 310, 140 310, 160 325 
               C 175 335, 175 355, 145 365 
               C 115 375, 95 370, 90 340 Z" 
            fill="#8bb4dc" 
            stroke="#678cb5" 
            strokeWidth="2" 
          />
          <path 
            d="M 310 340 
               C 305 310, 260 310, 240 325 
               C 225 335, 225 355, 255 365 
               C 285 375, 305 370, 310 340 Z" 
            fill="#8bb4dc" 
            stroke="#678cb5" 
            strokeWidth="2" 
          />
          <path 
            d="M 125 340 
               L 275 340 
               C 285 340, 285 370, 275 370 
               L 125 370 
               C 115 370, 115 340, 125 340 Z" 
            fill="url(#shirtGrad)" 
            stroke="#678cb5" 
            strokeWidth="2" 
          />
          <path d="M 145 340 L 145 370" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
          <path d="M 255 340 L 255 370" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />

          <circle cx="135" cy="170" r="14" fill="url(#skinGrad)" />
          <circle cx="265" cy="170" r="14" fill="url(#skinGrad)" />
          
          <path 
            d="M 140 160 
               C 140 110, 260 110, 260 160 
               C 260 215, 245 235, 200 235 
               C 155 235, 140 215, 140 160 Z" 
            fill="url(#skinGrad)" 
          />
          <ellipse cx="160" cy="185" rx="10" ry="6" fill="#f49c82" opacity="0.2" />
          <ellipse cx="240" cy="185" rx="10" ry="6" fill="#f49c82" opacity="0.2" />

          <path 
            d="M 135 155 
               C 130 140, 130 110, 145 95 
               C 160 80, 190 75, 210 80 
               C 230 75, 255 85, 260 100 
               C 268 115, 265 140, 265 155 
               C 272 150, 275 135, 272 120 
               C 270 100, 255 80, 235 70 
               C 215 62, 185 62, 165 72 
               C 145 82, 130 100, 128 120 
               C 125 135, 128 150, 135 155 Z" 
            fill="url(#hairGrad)" 
          />
          <path 
            d="M 136 120 
               C 145 105, 165 95, 200 100 
               C 225 98, 250 105, 264 120 
               C 255 110, 230 108, 205 112 
               C 180 115, 155 125, 136 120 Z" 
            fill="url(#hairGrad)" 
          />

          <path d={leftEyebrowPath} stroke="#121215" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d={rightEyebrowPath} stroke="#121215" strokeWidth="4" strokeLinecap="round" fill="none" />
          
          {!isBlinking ? (
            <>
              <ellipse cx="170" cy="155" rx="6" ry="4" fill="#121215" />
              <ellipse cx="230" cy="155" rx="6" ry="4" fill="#121215" />
              <circle cx="168" cy="153" r="1.5" fill="#ffffff" />
              <circle cx="228" cy="153" r="1.5" fill="#ffffff" />
            </>
          ) : (
            <>
              <path d="M 164 155 Q 170 159 176 155" stroke="#121215" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 224 155 Q 230 159 236 155" stroke="#121215" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          )}

          <g stroke="#1e1e24" strokeWidth="5.5" fill="none" strokeLinecap="round">
            <rect x="145" y="142" width="48" height="42" rx="18" ry="18" fill="rgba(255,255,255,0.05)" />
            <rect x="207" y="142" width="48" height="42" rx="18" ry="18" fill="rgba(255,255,255,0.05)" />
            <path d="M 193 158 Q 200 152 207 158" />
            <path d="M 145 156 L 132 153" />
            <path d="M 255 156 L 268 153" />
          </g>

          <path d="M 196 172 Q 200 180 204 172" stroke="#e0a37c" strokeWidth="3" strokeLinecap="round" fill="none" />
          
          <path d={mouthPath} stroke="#7a4225" strokeWidth={isSpeaking ? "3" : "4"} strokeLinecap="round" fill={isSpeaking ? "#5c2a11" : mouthFill} />
          <path d="M 175 196 Q 177 199 180 198" stroke="#7a4225" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 225 196 Q 223 199 220 198" stroke="#7a4225" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
      </svg>

      <div className="absolute inset-0 rounded-full border-2 border-slate-700/20 pointer-events-none z-20" />
    </div>
  );
}
