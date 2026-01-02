
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface MemoryAlchemyProps {
  image: string;
  onComplete: () => void;
  status: string;
  isReady: boolean;
}

type Grid = (number | null)[][];
const SIZE = 4;
const TARGET = 64; 

const MemoryAlchemy: React.FC<MemoryAlchemyProps> = ({ image, onComplete, status }) => {
  const [grid, setGrid] = useState<Grid>(Array(SIZE).fill(null).map(() => Array(SIZE).fill(null)));
  const [maxTile, setMaxTile] = useState(0);
  const startPos = useRef<{ x: number, y: number } | null>(null);
  const isMoving = useRef(false);

  // 基础生成逻辑
  const spawnTile = useCallback((currentGrid: Grid): Grid => {
    const emptyCells: { r: number, c: number }[] = [];
    currentGrid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === null) emptyCells.push({ r, c });
      });
    });
    if (emptyCells.length === 0) return currentGrid;
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = currentGrid.map(row => [...row]);
    newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  }, []);

  // 初始化棋盘
  useEffect(() => {
    setGrid(prev => spawnTile(spawnTile(prev)));
  }, [spawnTile]);

  // 核心移动与合并逻辑
  const moveGrid = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    let moved = false;
    
    setGrid(prevGrid => {
      let workGrid = prevGrid.map(row => [...row]);

      // 旋转矩阵以统一处理“向左移动”
      const rotateClockwise = (m: Grid): Grid => {
        const n = m.length;
        const res = Array(n).fill(null).map(() => Array(n).fill(null));
        for (let r = 0; r < n; r++) {
          for (let c = 0; c < n; c++) {
            res[c][n - 1 - r] = m[r][c];
          }
        }
        return res;
      };

      let rotations = 0;
      if (direction === 'UP') rotations = 3;
      else if (direction === 'RIGHT') rotations = 2;
      else if (direction === 'DOWN') rotations = 1;

      for (let i = 0; i < rotations; i++) workGrid = rotateClockwise(workGrid);

      // 处理每一行：滑行 -> 合并 -> 滑行
      for (let r = 0; r < SIZE; r++) {
        let row = workGrid[r].filter(val => val !== null) as number[];
        const originalRow = [...workGrid[r]];
        
        // 合并
        for (let i = 0; i < row.length - 1; i++) {
          if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row.splice(i + 1, 1);
          }
        }
        
        // 补齐 null
        while (row.length < SIZE) row.push(null as any);
        
        if (JSON.stringify(originalRow) !== JSON.stringify(row)) {
          moved = true;
        }
        workGrid[r] = row;
      }

      // 旋转回原始方向
      for (let i = 0; i < (4 - rotations) % 4; i++) workGrid = rotateClockwise(workGrid);

      if (moved) {
        const nextGrid = spawnTile(workGrid);
        // 更新最高分
        let currentMax = 0;
        nextGrid.forEach(row => row.forEach(cell => {
          if (cell && cell > currentMax) currentMax = cell;
        }));
        setMaxTile(currentMax);
        if ('vibrate' in navigator) navigator.vibrate(8);
        return nextGrid;
      }
      return prevGrid;
    });
  }, [spawnTile]);

  // 事件处理
  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startPos.current = { x: e.clientX, y: e.clientY };
    isMoving.current = true;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isMoving.current || !startPos.current) return;
    
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    const threshold = 25; // 触发移动的阈值

    if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
      isMoving.current = false; // 一次滑动只触发一次
      if (Math.abs(dx) > Math.abs(dy)) {
        moveGrid(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        moveGrid(dy > 0 ? 'DOWN' : 'UP');
      }
    }
  };

  const onPointerUp = () => {
    isMoving.current = false;
    startPos.current = null;
  };

  // 键盘支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) moveGrid('UP');
      else if (['ArrowDown', 's', 'S'].includes(e.key)) moveGrid('DOWN');
      else if (['ArrowLeft', 'a', 'A'].includes(e.key)) moveGrid('LEFT');
      else if (['ArrowRight', 'd', 'D'].includes(e.key)) moveGrid('RIGHT');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveGrid]);

  // 胜利检测
  useEffect(() => {
    if (maxTile >= TARGET) {
      setTimeout(onComplete, 1200);
    }
  }, [maxTile, onComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#020617] select-none touch-none">
      {/* 动态氛围背景 */}
      <div className="absolute inset-0 opacity-20 blur-[100px] pointer-events-none transition-opacity duration-1000">
        <img src={image} className="w-full h-full object-cover scale-150" alt="" />
      </div>

      <div className="z-10 text-center mb-8 space-y-2 px-10 animate-in fade-in duration-1000">
        <h3 className="font-calligraphy text-6xl text-amber-100 chromatic-glow">记忆炼金</h3>
        <p className="font-cinzel text-[10px] tracking-[0.5em] text-amber-200/40 uppercase">Fusing Fragments of Yuhan</p>
      </div>

      {/* 棋盘主体 */}
      <div 
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="z-10 relative p-4 bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl active:scale-[0.99] transition-transform cursor-grab active:cursor-grabbing touch-none"
      >
        {/* 背景图：随着数字增加而逐渐清晰 */}
        <div 
          className="absolute inset-4 rounded-2xl overflow-hidden pointer-events-none transition-opacity duration-1000"
          style={{ opacity: 0.1 + (maxTile / TARGET) * 0.4 }}
        >
          <img src={image} className="w-full h-full object-cover brightness-50 contrast-125" alt="" />
        </div>

        <div className="grid grid-cols-4 gap-3 w-[88vw] h-[88vw] max-w-[420px] max-h-[420px] relative">
          {grid.map((row, r) => row.map((cell, c) => (
            <div 
              key={`${r}-${c}`}
              className={`flex items-center justify-center rounded-2xl transition-all duration-300 text-3xl font-cinzel border relative overflow-hidden ${
                cell 
                  ? 'bg-amber-100/90 text-[#020617] font-bold border-transparent shadow-[0_0_20px_rgba(253,230,138,0.3)] animate-in zoom-in-50 duration-200' 
                  : 'bg-white/[0.05] border-white/5 opacity-30'
              }`}
            >
              {cell}
              {cell && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
              )}
            </div>
          )))}
        </div>
      </div>

      {/* 状态指示器 */}
      <div className="z-10 mt-12 w-full max-w-[340px] space-y-8 px-6 text-center">
        <div className="flex justify-between items-end">
          <div className="text-left space-y-1">
            <span className="block text-[8px] text-amber-200/20 tracking-widest uppercase">Memory Synced</span>
            <span className="text-3xl font-cinzel text-amber-100 tracking-tighter">
              {maxTile} <span className="text-xs text-amber-200/20">/ {TARGET}</span>
            </span>
          </div>
          <div className="text-right space-y-1">
            <span className="block text-[8px] text-amber-200/20 tracking-widest uppercase">Signal Status</span>
            <span className="text-[11px] font-serif text-amber-200/60 italic animate-pulse">{status}</span>
          </div>
        </div>
        
        <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-amber-200 shadow-[0_0_20px_#fde68a] transition-all duration-700 ease-out"
            style={{ width: `${Math.min((maxTile / TARGET) * 100, 100)}%` }}
          />
        </div>

        <p className="text-[10px] tracking-[0.6em] text-amber-200/20 uppercase italic mt-4 animate-bounce">
          滑动屏幕 · 合拢属于她的碎片
        </p>
      </div>

      <style>{`
        .chromatic-glow {
          text-shadow: 2px 0 rgba(255,0,0,0.2), -2px 0 rgba(0,255,255,0.2), 0 0 20px rgba(253,230,138,0.3);
        }
      `}</style>
    </div>
  );
};

export default MemoryAlchemy;
