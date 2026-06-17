import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameMode, GameScore } from './types';
import { planetsData } from './data/planetsData';
import { PlanetExplorer } from './components/PlanetExplorer';
import { PlanetSorter } from './components/PlanetSorter';
import { SpaceQuiz } from './components/SpaceQuiz';
import { CosmoCompanion } from './components/CosmoCompanion';
import { 
  Rocket, 
  Sparkles, 
  Compass, 
  Orbit as OrbitIcon, 
  Award, 
  HelpCircle,
  Volume2,
  VolumeX,
  Volume1,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<GameMode>('home');
  const [exploredPlanets, setExploredPlanets] = useState<string[]>([]);
  const [sortingCompleted, setSortingCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Ambient synth player sound
  const [isSynthPlaying, setIsSynthPlaying] = useState(false);
  const [synthAudioNode, setSynthAudioNode] = useState<any>(null);

  // Handle ambient cosmic hum synth using Web Audio API
  const startCosmicHum = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const mainGain = audioCtx.createGain();
      mainGain.gain.setValueAtTime(0.04, audioCtx.currentTime); // keep overall master volume very gentle and safe
      mainGain.connect(audioCtx.destination);

      let step = 0;
      const melodyFreqs = [
        392.00, 440.00, 523.25, 392.00, 440.00, 523.25, 587.33, 659.25, 
        523.25, 440.00, 392.00, 329.63, 293.66, 329.63, 392.00, 523.25
      ];
      // Bass line (octave below)
      const bassFreqs = [
        130.81, 0, 130.81, 130.81, 146.83, 0, 164.81, 196.00, 
        130.81, 0, 130.81, 0, 196.00, 196.00, 164.81, 0
      ];

      // Play step function
      const playStep = () => {
        const now = audioCtx.currentTime;

        // 1. Play Melody Note (Sine wave, lovely short duration)
        const noteFreq = melodyFreqs[step % melodyFreqs.length];
        if (noteFreq > 0) {
          const oscMelody = audioCtx.createOscillator();
          const gainMelody = audioCtx.createGain();
          
          oscMelody.type = 'sine';
          oscMelody.frequency.setValueAtTime(noteFreq, now);
          
          gainMelody.gain.setValueAtTime(0, now);
          gainMelody.gain.linearRampToValueAtTime(0.35, now + 0.02); // attack
          gainMelody.gain.exponentialRampToValueAtTime(0.001, now + 0.22); // decay/release
          
          oscMelody.connect(gainMelody);
          gainMelody.connect(mainGain);
          
          oscMelody.start(now);
          oscMelody.stop(now + 0.25);
        }

        // 2. Play Bass note (Triangle wave, warm)
        const bassFreq = bassFreqs[step % bassFreqs.length];
        if (bassFreq > 0) {
          const oscBass = audioCtx.createOscillator();
          const gainBass = audioCtx.createGain();
          
          oscBass.type = 'triangle';
          oscBass.frequency.setValueAtTime(bassFreq, now);
          
          gainBass.gain.setValueAtTime(0, now);
          gainBass.gain.linearRampToValueAtTime(0.4, now + 0.04);
          gainBass.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          
          oscBass.connect(gainBass);
          gainBass.connect(mainGain);
          
          oscBass.start(now);
          oscBass.stop(now + 0.28);
        }

        // 3. Simple soft kick drum / electronic pulse on every 4th step (the downbeats)
        if (step % 4 === 0) {
          const oscKick = audioCtx.createOscillator();
          const gainKick = audioCtx.createGain();
          
          oscKick.type = 'sine';
          oscKick.frequency.setValueAtTime(150, now);
          oscKick.frequency.exponentialRampToValueAtTime(45, now + 0.08); // pitch bend kick
          
          gainKick.gain.setValueAtTime(0, now);
          gainKick.gain.linearRampToValueAtTime(0.5, now + 0.01);
          gainKick.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          
          oscKick.connect(gainKick);
          gainKick.connect(mainGain);
          
          oscKick.start(now);
          oscKick.stop(now + 0.14);
        }

        // 4. Little starry "sparkle" chime once in a while on step % 8 === 4 for high frequencies
        if (step % 8 === 4) {
          const oscSparkle = audioCtx.createOscillator();
          const gainSparkle = audioCtx.createGain();
          
          oscSparkle.type = 'sine';
          oscSparkle.frequency.setValueAtTime(1200, now);
          oscSparkle.frequency.exponentialRampToValueAtTime(1500, now + 0.15);
          
          gainSparkle.gain.setValueAtTime(0, now);
          gainSparkle.gain.linearRampToValueAtTime(0.12, now + 0.01);
          gainSparkle.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          
          oscSparkle.connect(gainSparkle);
          gainSparkle.connect(mainGain);
          
          oscSparkle.start(now);
          oscSparkle.stop(now + 0.2);
        }

        step++;
      };

      // Trigger the first step and start the loop
      playStep();
      const intervalId = setInterval(playStep, 230); // ~130 BPM beats on 8th notes

      setSynthAudioNode({
        ctx: audioCtx,
        intervalId,
        gain: mainGain
      });
      setIsSynthPlaying(true);
    } catch (e) {
      // Ignored if browser permissions block audio
    }
  };

  const stopCosmicHum = () => {
    if (synthAudioNode) {
      try {
        clearInterval(synthAudioNode.intervalId);
        synthAudioNode.ctx.close();
      } catch (e) {}
      setSynthAudioNode(null);
    }
    setIsSynthPlaying(false);
  };

  const toggleCelestialSound = () => {
    if (isSynthPlaying) {
      stopCosmicHum();
    } else {
      startCosmicHum();
    }
  };

  // Sound effect helper on button navigation
  const playNavChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(700, audioCtx.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch (e) {}
  };

  const handlePlanetExplored = (id: string) => {
    if (!exploredPlanets.includes(id)) {
      setExploredPlanets((prev) => [...prev, id]);
    }
  };

  const getPercentageExplored = () => {
    return Math.round((exploredPlanets.length / 8) * 100);
  };

  // Cleanup synthesizer on unmount
  useEffect(() => {
    return () => {
      if (synthAudioNode) {
        try {
          clearInterval(synthAudioNode.intervalId);
          synthAudioNode.ctx.close();
        } catch (e) {}
      }
    };
  }, [synthAudioNode]);

  return (
    <div className="min-h-screen bg-[#0d0a3d] text-slate-100 font-sans selection:bg-yellow-400 selection:text-black relative overflow-x-hidden">
      
      {/* Decorative Starry Space Elements - ENLARGED SPACE STARS */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_2.8px,transparent_2.8px)] [background-size:36px_36px] opacity-55 pointer-events-none" />
      <div className="absolute top-24 left-10 w-32 h-32 bg-cyan-400 rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-pulse pointer-events-none" />
      <div className="absolute bottom-24 right-10 w-44 h-44 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-yellow-400 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse pointer-events-none" />

      {/* Twinkling Beautiful Interactive Giant Stars */}
      <motion.div 
        animate={{ scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4], rotate: [0, 45, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-12 right-[18%] text-3xl sm:text-4xl select-none pointer-events-none filter drop-shadow-[0_0_12px_rgba(255,255,255,0.85)] z-0"
      >
        ⭐
      </motion.div>
      <motion.div 
        animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0.9, 0.4], rotate: [0, -45, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 left-[6%] text-4xl sm:text-5xl select-none pointer-events-none filter drop-shadow-[0_0_15px_rgba(253,224,71,0.9)] z-0"
      >
        ✨
      </motion.div>
      <motion.div 
        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.85, 0.3] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-1/3 left-[10%] text-2xl sm:text-3xl select-none pointer-events-none filter drop-shadow-[0_0_10px_rgba(255,255,255,0.75)] z-0"
      >
        ⭐
      </motion.div>
      <motion.div 
        animate={{ scale: [1, 1.7, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-12 right-[12%] text-3xl sm:text-4xl select-none pointer-events-none filter drop-shadow-[0_0_18px_rgba(253,224,71,0.95)] z-0"
      >
        ✨
      </motion.div>

      {/* Main Content Layout Container */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 relative z-10 space-y-8">
        
        {/* Navigation / Hub Brand Header */}
        <header className="bg-[#12104a]/95 backdrop-blur-md border-4 border-cyan-400 p-4 rounded-3xl shadow-[0_10px_25px_rgba(34,211,238,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Animated, highly colorful custom spaceship image */}
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 4, -4, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative p-1 bg-gradient-to-tr from-pink-500 via-yellow-400 to-cyan-400 rounded-3xl border-2 border-indigo-300 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.4)] md:scale-110"
            >
              <img 
                src="/src/assets/images/colorful_flat_spaceship_1781635778615.jpg" 
                alt="A Nave dos Planetas" 
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#12104a]"
              />
              <span className="absolute -top-1.5 -right-2 bg-yellow-400 text-black text-[9px] sm:text-xs font-black tracking-widest px-2.5 py-1 rounded-full animate-bounce border border-black font-display shadow whitespace-nowrap">
                VAMOS LÁ!
              </span>
            </motion.div>

            <div className="text-center sm:text-left space-y-2">
              <h1 className="text-2xl sm:text-4xl md:text-4.5xl font-black font-display uppercase tracking-tight flex flex-wrap items-center justify-center sm:justify-start whitespace-nowrap">
                <span className="flex flex-nowrap whitespace-nowrap gap-[0.01em] justify-center sm:justify-start">
                  {Array.from("A NAVE DOS PLANETAS").map((char, index) => {
                    const isYellow = index >= 7; // "DOS PLANETAS"
                    return (
                      <motion.span
                        key={index}
                        animate={{
                          y: [0, -12, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.08,
                        }}
                        style={{ display: char === " " ? "inline" : "inline-block" }}
                        className={isYellow 
                          ? "text-yellow-300 drop-shadow-[0_4px_12px_rgba(253,224,71,0.6)]" 
                          : "text-white drop-shadow-[0_2px_6px_rgba(255,255,255,0.2)]"
                        }
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    );
                  })}
                </span>
                <motion.span
                  className="inline-block text-4xl sm:text-6xl md:text-7xl ml-3 sm:ml-4 select-none filter drop-shadow-[0_6px_15px_rgba(59,130,246,0.85)] align-middle"
                  animate={{
                    y: [0, -8, 8, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    y: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    rotate: {
                      duration: 22,
                      repeat: Infinity,
                      ease: "linear"
                    }
                  }}
                >
                  🌍
                </motion.span>
                <motion.span
                  className="inline-block text-4xl sm:text-6xl md:text-7xl ml-3 sm:ml-4 select-none filter drop-shadow-[0_6px_15px_rgba(236,72,153,0.7)] align-middle"
                  animate={{
                    y: [0, 8, -8, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    y: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    rotate: {
                      duration: 18,
                      repeat: Infinity,
                      ease: "linear"
                    }
                  }}
                >
                  🪐
                </motion.span>
                <motion.span
                  className="inline-block text-4xl sm:text-6xl ml-8 sm:ml-14 cursor-pointer select-none filter drop-shadow-[0_8px_16px_rgba(234,179,8,0.5)]"
                  animate={{
                    x: [-40, 40, -40],
                    y: [0, -15, 10, 0],
                    rotate: [-15, 25, -25, -15],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  🚀
                </motion.span>
              </h1>
            </div>
          </div>

          {/* Sound Synthesizer control button */}
          <button
            onClick={toggleCelestialSound}
            className={`px-5 py-3 rounded-2xl border-b-6 font-display text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all active:translate-y-1.5 ${
              isSynthPlaying 
                ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-black border-cyan-600 hover:from-cyan-300 hover:to-teal-300 shadow-[0_4px_15px_rgba(34,211,238,0.4)]' 
                : 'bg-indigo-900/85 text-indigo-200 border-indigo-950 hover:bg-indigo-850 hover:text-white'
            }`}
            title="Ativar Música Espacial Animada 🎵"
          >
            {isSynthPlaying ? <Volume2 size={16} className="animate-pulse" /> : <VolumeX size={16} />}
            <span>Música {isSynthPlaying ? 'Animada ✨' : 'Desligada 🔇'}</span>
          </button>
         </header>

        {/* Screen Switching Logic */}
        <AnimatePresence mode="wait">
          {mode === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Cosmo Welcoming introduction presentation screen */}
              <CosmoCompanion 
                text="Olá! Eu sou o Cosmo e sinto-me super feliz por seres o meu astronauta de serviço hoje! Estamos na Astrolândia. Vamos aprender coisas incríveis sobre o nosso Sistema Solar? Escolhe uma das missões abaixo!"
                expression="wave"
              />

              {/* Central Bento Grid Games Launcher */}
              <section className="space-y-6">
                <div className="text-center sm:text-left ml-1">
                  <h2 className="text-2xl sm:text-4xl font-black font-display text-white mt-1.5 tracking-tight uppercase flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                    <span>Escolhe o teu Próximo Destino</span>
                    <motion.span
                      className="inline-block text-4xl sm:text-5xl md:text-6xl cursor-pointer select-none filter drop-shadow-[0_4px_8px_rgba(234,179,8,0.4)]"
                      animate={{
                        y: [0, -10, 5, 0],
                        x: [0, 8, -8, 0],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      🚀
                    </motion.span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Activity Card 1: EXPLORE SYSTEM */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#131952]/90 border-4 border-cyan-400 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-[0_8px_0_0_#06b6d4,0_15px_30px_rgba(6,180,212,0.15)] relative overflow-hidden group transition-all"
                  >
                    
                    <div className="space-y-4">
                      {/* Top badges marker */}
                      <div className="flex items-center justify-start">
                        <span className="text-sm sm:text-base md:text-lg font-black tracking-wider text-black bg-cyan-400 px-4 py-2 rounded-2xl uppercase font-display border-2 border-cyan-600 flex items-center gap-2 shadow-[0_4px_10px_rgba(34,211,238,0.4)]">
                          <span>Missão de Estudo</span>
                          <span className="text-2xl sm:text-3xl drop-shadow-[0_2px_8px_rgba(253,224,71,0.8)] filter">☀️</span>
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-xl sm:text-2xl font-black font-display text-white text-center">
                          Explora os Planetas
                        </h3>
                        <p className="text-sm text-slate-200 font-sans font-medium leading-relaxed text-center">
                          Visita todos os 8 planetas na órbita espacial. Lê as curiosidades incríveis e ouve as minhas lições.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          playNavChime();
                          setMode('explore');
                        }}
                        className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 font-display text-sm font-black text-black border-b-4 border-cyan-600 rounded-xl cursor-pointer shadow-md transition-all active:translate-y-1 text-center"
                      >
                        Iniciar Exploração 🔍
                      </button>
                    </div>
                  </motion.div>

                  {/* Activity Card 2: ORBIT SORTING TASK */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#28184d]/90 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-[0_8px_0_0_#f59e0b,0_15px_30px_rgba(245,158,11,0.15)] relative overflow-hidden group transition-all"
                  >
                    
                    <div className="space-y-4">
                      {/* Top badges marker */}
                      <div className="flex items-center justify-center">
                        <span className="text-sm sm:text-base md:text-lg font-black tracking-wider text-black bg-amber-400 px-4 py-2 rounded-2xl uppercase font-display border-2 border-amber-600 flex items-center gap-2 shadow-[0_4px_10px_rgba(245,158,11,0.4)]">
                          <span>Jogo de Desafio</span>
                          <span className="text-2xl sm:text-3xl drop-shadow-[0_2px_8px_rgba(245,158,11,0.8)] filter">🪐</span>
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl sm:text-2xl font-black font-display text-white text-center">
                          Missão Espacial
                        </h3>
                        <p className="text-sm text-slate-200 font-sans font-medium leading-relaxed text-center">
                          Os planetas <span className="whitespace-nowrap">desalinharam-se!</span> Ajuda o Cosmo a colocá-los por ordem sequencial de distância ao Sol e ouve os meus sons!
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          playNavChime();
                          setMode('sort');
                        }}
                        className="w-full py-3 bg-amber-400 hover:bg-amber-300 font-display text-sm font-black text-black border-b-4 border-amber-600 rounded-xl cursor-pointer shadow-md transition-all active:translate-y-1 text-center"
                      >
                        Iniciar Organização 🛸
                      </button>
                    </div>
                  </motion.div>

                  {/* Activity Card 3: QUIZ & GRADUATION */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#310c3f]/90 border-4 border-pink-500 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-[0_8px_0_0_#ec4899,0_15px_30px_rgba(236,72,153,0.15)] relative overflow-hidden group transition-all"
                  >

                    <div className="space-y-4">
                      {/* Top badges marker */}
                      <div className="flex items-center justify-center">
                        <span className="text-sm sm:text-base md:text-lg lg:text-xl font-black tracking-wider text-white bg-pink-500 px-4 py-2 rounded-2xl uppercase font-display border-2 border-pink-700 flex items-center gap-2 shadow-[0_4px_10px_rgba(236,72,153,0.4)]">
                          <span>Mistério da Astrolândia</span>
                          <span className="text-2xl sm:text-3xl md:text-4xl drop-shadow-[0_2px_8px_rgba(253,224,71,0.8)] filter">🎓</span>
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl sm:text-2xl font-black font-display text-white text-center">
                          Super Quiz Espacial
                        </h3>
                        <p className="text-sm text-slate-200 font-sans font-medium leading-relaxed text-center">
                          Será que ouviste bem as lições de astronomia? Responde a divertidas perguntas. Vamos começar!!
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          playNavChime();
                          setMode('quiz');
                        }}
                        className="w-full py-3 bg-pink-500 hover:bg-pink-400 font-display text-sm font-black text-white border-b-4 border-pink-700 rounded-xl cursor-pointer shadow-md transition-all active:translate-y-1 text-center"
                      >
                        Iniciar o Quiz ✏️
                      </button>
                    </div>
                  </motion.div>

                </div>
              </section>


            </motion.div>
          )}

          {mode === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
            >
              <PlanetExplorer
                exploredPlanets={exploredPlanets}
                onPlanetExplored={handlePlanetExplored}
                onBackToHome={() => {
                  playNavChime();
                  setMode('home');
                }}
                onGoToSorting={() => {
                  playNavChime();
                  setMode('sort');
                }}
              />
            </motion.div>
          )}

          {mode === 'sort' && (
            <motion.div
              key="sort"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <PlanetSorter
                onBackToHome={() => {
                  playNavChime();
                  setMode('home');
                }}
                onGoToQuiz={() => {
                  playNavChime();
                  setMode('quiz');
                }}
                onCompleteSorting={() => {
                  setSortingCompleted(true);
                }}
                isCompleted={sortingCompleted}
              />
            </motion.div>
          )}

          {mode === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
            >
              <SpaceQuiz
                onBackToHome={() => {
                  playNavChime();
                  setMode('home');
                }}
                onQuizCompleted={(scoreAcquired) => {
                  setQuizScore(scoreAcquired);
                  setQuizCompleted(true);
                }}
                score={quizScore}
                isCompleted={quizCompleted}
              />
            </motion.div>
          )}
        </AnimatePresence>



      </main>
    </div>
  );
}
