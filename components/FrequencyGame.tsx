
import React, { useState, useEffect, useRef } from 'react';

interface FrequencyGameProps {
  onComplete: (traits: string[]) => void;
}

const TRAITS = ['温柔的笃定', '明亮的忧郁', '清晨的琥珀', '仲夏的飞鸟', '深秋的晚星'];

const FrequencyGame: React.FC<FrequencyGameProps> = ({ onComplete }) => {
  const [angle, setAngle] = useState(0);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const newAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    setAngle(newAngle);

    const normalizedAngle = (newAngle + 360) % 360;
    const targets = [45, 120, 210, 280, 330];
    
    targets.forEach((target, idx) => {
      const diff = Math.min(Math.abs(normalizedAngle - target), 360 - Math.abs(normalizedAngle - target));
      if (diff < 8 && !activeIndices.includes(idx)) {
        setActiveIndices(prev => {
          const next = [...prev, idx];
          if ('vibrate' in navigator) navigator.vibrate(15);
          if (next.length === 3) setTimeout(() => onComplete(next.map(i => TRAITS[i])), 1200);
          return next;
        });
      }
    });
  };

  return (
    <div 
      className="z-30 fixed inset-0 flex flex-col items-center justify-center touch-none select-none"
      onPointerMove={handlePointerMove}
      onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); setIsDragging(true); }}
      onPointerUp={() => setIsDragging(false)}
    >
      <div className="z-10 text-center mb-16 space-y-4">
        <h2 className="text-5xl font-calligraphy text-amber-100 chromatic-glow">灵魂共鸣</h2>
        <p className="text-[10px] tracking-[0.5em] text-amber-200/30 uppercase">Catch Yuhan's Frequency</p>
      </div>

      <div className="relative w-80 h-80 flex items-center justify-center">
        <div className="absolute inset-0 border border-amber-200/5 rounded-full scale-110"></div>
        <div className="absolute inset-0 border border-amber-200/10 rounded-full"></div>
        <div className="absolute inset-8 border border-amber-200/5 rounded-full"></div>
        
        <div 
          className="absolute w-1/2 h-[2px] bg-gradient-to-r from-transparent via-amber-200/40 to-amber-200 origin-left left-1/2 shadow-[0_0_20px_rgba(253,230,138,0.4)] transition-transform duration-75"
          style={{ transform: `rotate(${angle}deg)` }}
        />

        {[45, 120, 210, 280, 330].map((t, i) => (
          <div 
            key={i}
            className={`absolute w-1.5 h-1.5 rounded-full transition-all duration-1000 ${activeIndices.includes(i) ? 'bg-amber-200 shadow-[0_0_15px_#fde68a] scale-150' : 'bg-amber-200/10'}`}
            style={{ transform: `rotate(${t}deg) translateX(140px)` }}
          />
        ))}

        <div className="relative z-10 text-center">
          <div className="text-[10px] tracking-[0.4em] text-amber-200/20 mb-2 font-light">SYNC</div>
          <div className="text-4xl font-serif text-amber-100/90">{activeIndices.length}/3</div>
        </div>
      </div>

      <div className="mt-20 h-12 flex justify-center gap-3">
        {activeIndices.map(i => (
          <span key={i} className="px-5 py-2 bg-white/[0.03] border border-amber-200/20 text-[10px] text-amber-200/80 rounded-full animate-in zoom-in duration-500 tracking-widest">
            {TRAITS[i]}
          </span>
        ))}
      </div>

      <p className="mt-12 text-[10px] tracking-[0.4em] text-amber-200/20 uppercase animate-pulse">
        {isDragging ? '正在锁定频率...' : '旋转拨盘 找寻心跳轨迹'}
      </p>
    </div>
  );
};

export default FrequencyGame;
