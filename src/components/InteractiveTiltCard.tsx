import React, { useState, useRef } from 'react';

interface InteractiveTiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // e.g. "rgba(99, 102, 241, 0.15)"
}

export default function InteractiveTiltCard({
  children,
  className = '',
  glowColor = 'rgba(99, 102, 241, 0.25)'
}: InteractiveTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Get mouse position relative to element
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates (-0.5 to 0.5)
    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = (y / rect.height) - 0.5;
    
    setCoords({
      x: normalizedX,
      y: normalizedY
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  // Max tilt angle (degrees)
  const maxTilt = 12;
  const rotateY = isHovered ? coords.x * maxTilt : 0;
  // Invert rotateX so hovering near top tilts it forward
  const rotateX = isHovered ? -coords.y * maxTilt : 0;

  // Reflection/Sheen effect position
  const sheenX = isHovered ? (coords.x + 0.5) * 100 : 50;
  const sheenY = isHovered ? (coords.y + 0.5) * 100 : 50;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
        transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        transformStyle: 'preserve-3d',
        boxShadow: isHovered 
          ? `0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px ${glowColor}`
          : '0 15px 30px -10px rgba(0, 0, 0, 0.5), 0 0 0px transparent'
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Gloss/Sheen gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-350"
        style={{
          opacity: isHovered ? 0.45 : 0,
          background: `radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`,
        }}
      />
      
      {/* Decorative inner border shadow to enhance 3D bezel feel */}
      <div className="absolute inset-0 border border-white/10 rounded-[inherit] pointer-events-none z-20" />

      {/* Main Content (Make sure it supports preserve-3d) */}
      <div className="h-full w-full select-none" style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  );
}
