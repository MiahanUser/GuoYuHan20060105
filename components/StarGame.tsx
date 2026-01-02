
import React, { useState, useEffect, useRef } from 'react';

interface StarNode {
  id: number;
  x: number;
  y: number;
  found: boolean;
}

interface StarGameProps {
  onComplete: () => void;
}

const StarGame: React.FC<StarGameProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [foundCount, setFoundCount] = useState(0);
  const starsRef = useRef<StarNode[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const totalStars = 5;

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const centerX = w / 2;
    const centerY = h * 0.45; // 稍微靠上，避开手部遮挡
    const size = Math.min(w, h) * 0.3;

    const heartCoords = [
      { x: centerX, y: centerY + size * 0.6 },
      { x: centerX - size, y: centerY - size * 0.3 },
      { x: centerX - size * 0.6, y: centerY - size * 1.0 },
      { x: centerX + size * 0.6, y: centerY - size * 1.0 },
      { x: centerX + size, y: centerY - size * 0.3 },
    ];

    starsRef.current = heartCoords.map((coord, i) => ({
      id: i,
      x: coord.x + (Math.random() - 0.5) * 30,
      y: coord.y + (Math.random() - 0.5) * 30,
      found: false,
    }));

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const foundStars = starsRef.current.filter(s => s.found);
      if (foundStars.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(253, 230, 138, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([8, 8]);
        ctx.moveTo(foundStars[0].x, foundStars[0].y);
        for(let i = 1; i < foundStars.length; i++) {
          ctx.lineTo(foundStars[i].x, foundStars[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      starsRef.current.forEach(star => {
        const dx = mouseRef.current.x - star.x;
        const dy = mouseRef.current.y - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / 250);
        
        if (star.found) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#fde68a';
          ctx.fillStyle = '#fde68a';
          ctx.beginPath();
          ctx.arc(star.x, star.y, 5, 0, Math.PI * 2);
          ctx.fill();
        } else if (proximity > 0) {
          ctx.fillStyle = `rgba(253, 230, 138, ${proximity * 0.5})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, 2 + proximity * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      requestAnimationFrame(render);
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      starsRef.current.forEach(star => {
        if (!star.found) {
          const dx = mouseRef.current.x - star.x;
          const dy = mouseRef.current.y - star.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 45) {
            star.found = true;
            if ('vibrate' in navigator) navigator.vibrate(5);
            setFoundCount(prev => {
              const next = prev + 1;
              if (next === totalStars) setTimeout(onComplete, 1000);
              return next;
            });
          }
        }
      });
    };

    window.addEventListener('pointermove', handlePointerMove);
    render();

    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [onComplete]);

  return (
    <div className="z-20 w-full h-full fixed inset-0 flex flex-col items-center justify-between py-24 safe-pb pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-auto touch-none" />
      
      <div className="relative text-center space-y-4 px-10">
        <h2 className="text-4xl font-calligraphy text-amber-100 chromatic-glow">寻星踪迹</h2>
        <p className="text-[10px] tracking-[0.4em] text-amber-200/40 uppercase">正在搜寻禹含的星迹碎片</p>
        <div className="h-[1px] w-48 bg-white/10 mx-auto relative overflow-hidden">
          <div 
            className="h-full bg-amber-200 transition-all duration-1000 shadow-[0_0_10px_#fde68a]"
            style={{ width: `${(foundCount / totalStars) * 100}%` }}
          />
        </div>
      </div>

      <p className="relative text-[10px] tracking-[0.4em] text-amber-200/20 italic animate-pulse">
        滑动指针搜寻虚空中的共振点
      </p>
    </div>
  );
};

export default StarGame;
