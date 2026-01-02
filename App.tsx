
import React, { useState, useCallback } from 'react';
import CosmicBackground from './components/CosmicBackground';
import NameTracer from './components/NameTracer';
import StarGame from './components/StarGame';
import FrequencyGame from './components/FrequencyGame';
import MemoryWeaver from './components/MemoryWeaver';
import MemoryAlchemy from './components/MemoryAlchemy';
import DeploymentGuide from './components/DeploymentGuide';
import { processLocalVision, VisionResult } from './services/visionService';

enum GameState {
  LOCKED,
  START,
  STARS,
  RESONANCE,
  UPLOAD,
  WEAVE,
  ALCHEMY,
  RESULT
}

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.LOCKED);
  const [image, setImage] = useState<string | null>(null);
  const [finalResult, setFinalResult] = useState<VisionResult | null>(null);
  const [alchemyStatus, setAlchemyStatus] = useState("正在解析光影信号...");
  const [imageLoaded, setImageLoaded] = useState(false);

  const startAnalysis = useCallback(async (base64: string) => {
    setAlchemyStatus("正在编织永恒维度...");
    const result = await processLocalVision(base64);
    setFinalResult(result);
    setAlchemyStatus("记忆结晶已就绪");
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImage(base64);
      setGameState(GameState.WEAVE);
      startAnalysis(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-[#020617] text-slate-200 overflow-hidden select-none safe-pt safe-pb">
      <CosmicBackground />
      <div className="cinematic-vignette" />
      
      {gameState === GameState.LOCKED && (
        <NameTracer onUnlock={() => setGameState(GameState.START)} />
      )}

      {gameState === GameState.START && (
        <div className="z-20 text-center space-y-32 animate-in fade-in zoom-in duration-1000 px-10">
          <div className="space-y-6">
            <h1 className="text-[120px] font-calligraphy text-amber-100 chromatic-glow">禹含</h1>
            <p className="font-cinzel text-amber-200/40 tracking-[1.5em] text-[10px] uppercase">Ethereal Fragments</p>
          </div>
          <button 
            onClick={() => setGameState(GameState.STARS)}
            className="group relative px-20 py-6 overflow-hidden rounded-full border border-amber-200/10 transition-all active:scale-95 shadow-xl"
          >
            <div className="absolute inset-0 bg-amber-200/[0.05] group-hover:bg-amber-200/[0.1] transition-colors" />
            <span className="relative z-10 text-amber-100/60 tracking-[1.2em] text-[10px] uppercase transition-all shimmer-text">开启寻光之旅</span>
          </button>
        </div>
      )}

      {gameState === GameState.STARS && <StarGame onComplete={() => setGameState(GameState.RESONANCE)} />}
      {gameState === GameState.RESONANCE && <FrequencyGame onComplete={() => setGameState(GameState.UPLOAD)} />}

      {gameState === GameState.UPLOAD && (
        <div className="z-20 text-center animate-in fade-in slide-in-from-bottom-20 duration-1000 px-6">
          <div className="mb-20 space-y-6">
            <h2 className="text-5xl font-calligraphy text-amber-100/90 chromatic-glow">上传光影</h2>
            <p className="font-cinzel text-[10px] tracking-[0.5em] text-amber-200/20 uppercase">A window to her soul</p>
          </div>
          <label className="block w-64 h-64 mx-auto relative group cursor-pointer active:scale-90 transition-all">
            <div className="absolute inset-[-20px] border border-amber-200/5 rounded-full animate-[spin_30s_linear_infinite]" />
            <div className="absolute inset-0 border border-dashed border-amber-200/20 rounded-full group-hover:border-amber-200/60 transition-all" />
            <div className="absolute inset-4 rounded-full flex items-center justify-center bg-white/[0.02] backdrop-blur-sm shadow-inner">
              <span className="text-5xl text-amber-200/10 group-hover:text-amber-200/40 transition-all">✦</span>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
          </label>
        </div>
      )}

      {gameState === GameState.WEAVE && image && (
        <MemoryWeaver 
          image={image} 
          caption="正在捕捉影子里的光..."
          onComplete={() => setGameState(GameState.ALCHEMY)} 
        />
      )}

      {gameState === GameState.ALCHEMY && image && (
        <MemoryAlchemy 
          image={image} 
          status={alchemyStatus}
          isReady={!!finalResult}
          onComplete={() => setGameState(GameState.RESULT)}
        />
      )}

      {gameState === GameState.RESULT && finalResult && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center bg-black overflow-y-auto animate-in fade-in duration-[3000ms]">
          {/* 背景流光效果 */}
          <div className="fixed inset-0 z-0 opacity-40 blur-[120px] scale-150 animate-pulse-slow">
            <img src={finalResult.imageUrl} className="w-full h-full object-cover" alt="" />
          </div>

          <div className="relative z-10 w-full max-w-lg px-8 py-24 flex flex-col items-center">
            {/* 核心照片展示区 */}
            <div className={`w-full group perspective-1000 transition-all duration-[2500ms] ${imageLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-90'}`}>
              <div className="relative bg-white/5 p-5 rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(253,230,138,0.1)] backdrop-blur-xl">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden relative border border-white/5">
                  <img 
                    src={finalResult.imageUrl} 
                    onLoad={() => setImageLoaded(true)}
                    className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000" 
                    alt="Memory of Yuhan" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                </div>
                <div className="mt-8 flex justify-between items-end px-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-cinzel text-amber-200/40 tracking-[0.5em] uppercase">Fragment ID: GYH-1102</p>
                    <p className="text-[9px] text-white/10 italic">Captured in Eternity</p>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-100/30 text-xs font-serif italic">∞</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 情诗渲染 */}
            <div className={`mt-20 text-center space-y-16 transition-all duration-[3500ms] delay-[800ms] ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent mx-auto" />
              
              <div className="text-2xl md:text-3xl font-serif text-amber-50/90 leading-[2.2] italic tracking-[0.2em] px-4 whitespace-pre-line drop-shadow-lg">
                {finalResult.poem}
              </div>

              <div className="pt-16 space-y-10 pb-32">
                <div className="space-y-2">
                  <p className="font-calligraphy text-amber-200/60 text-5xl tracking-[0.3em] mb-4">郭禹含</p>
                  <p className="text-[10px] tracking-[0.8em] text-white/20 uppercase">My Eternal Resonance</p>
                </div>

                <button 
                  onClick={() => window.location.reload()}
                  className="px-16 py-4 rounded-full border border-white/5 text-[9px] tracking-[1em] text-white/20 hover:text-amber-200 hover:border-amber-200/20 transition-all uppercase bg-white/[0.02] backdrop-blur-sm"
                >
                  回溯初见
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1.3) rotate(0deg); opacity: 0.3; }
          50% { transform: scale(1.4) rotate(2deg); opacity: 0.5; }
        }
        .animate-pulse-slow { animation: pulse-slow 20s ease-in-out infinite; }
        .perspective-1000 { perspective: 1000px; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default App;
