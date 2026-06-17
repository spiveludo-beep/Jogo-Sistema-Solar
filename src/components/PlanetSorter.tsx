import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Planet } from '../types';
import { planetsData } from '../data/planetsData';
import { CosmoCompanion } from './CosmoCompanion';
import { 
  ArrowLeft, 
  RotateCcw, 
  Play, 
  HelpCircle, 
  Sun, 
  Check, 
  X, 
  Award,
  Sparkles,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';

interface PlanetSorterProps {
  onBackToHome: () => void;
  onGoToQuiz: () => void;
  onCompleteSorting: () => void;
  isCompleted: boolean;
}

export const PlanetSorter: React.FC<PlanetSorterProps> = ({
  onBackToHome,
  onGoToQuiz,
  onCompleteSorting,
  isCompleted,
}) => {
  // Scramble the planets list for the pool
  const shuffleArray = (array: Planet[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const [shuffledPool, setShuffledPool] = useState<Planet[]>([]);
  const [orbitsSlots, setOrbitsSlots] = useState<(Planet | null)[]>(Array(8).fill(null));
  const [hasChecked, setHasChecked] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [draggedPlanet, setDraggedPlanet] = useState<Planet | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [isDragOverPool, setIsDragOverPool] = useState(false);
  const [selectedPoolPlanet, setSelectedPoolPlanet] = useState<Planet | null>(null);
  const [selectedSourceSlot, setSelectedSourceSlot] = useState<number | null>(null);
  const [selectedEmptySlotIndex, setSelectedEmptySlotIndex] = useState<number | null>(null);

  // Initialize the game
  useEffect(() => {
    setShuffledPool(shuffleArray(planetsData));
    setOrbitsSlots(Array(8).fill(null));
    setHasChecked(false);
    setSuccess(false);
    setErrorCount(0);
    setDraggedPlanet(null);
    setDragOverSlot(null);
    setIsDragOverPool(false);
    setSelectedPoolPlanet(null);
    setSelectedSourceSlot(null);
    setSelectedEmptySlotIndex(null);
  }, []);

  const playSound = (type: 'place' | 'remove' | 'success' | 'fail') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (type === 'place') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(350, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(500, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.16);
      } else if (type === 'remove') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(450, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.16);
      } else if (type === 'success') {
        // High cheery major chord arpeggio
        const playTone = (freq: number, start: number, duration: number) => {
          const oscNode = audioCtx.createOscillator();
          const gainVal = audioCtx.createGain();
          oscNode.type = 'sine';
          oscNode.frequency.setValueAtTime(freq, start);
          gainVal.gain.setValueAtTime(0.1, start);
          gainVal.gain.exponentialRampToValueAtTime(0.001, start + duration);
          oscNode.connect(gainVal);
          gainVal.connect(audioCtx.destination);
          oscNode.start(start);
          oscNode.stop(start + duration);
        };
        const now = audioCtx.currentTime;
        playTone(392, now, 0.15);       // G
        playTone(523.25, now + 0.15, 0.15); // C
        playTone(659.25, now + 0.3, 0.15); // E
        playTone(784, now + 0.45, 0.4);    // G high
      } else if (type === 'fail') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(220, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(160, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.4);
      }
    } catch (e) {
      // Audio fallback
    }
  };

  const handleRestart = () => {
    playSound('remove');
    setShuffledPool(shuffleArray(planetsData));
    setOrbitsSlots(Array(8).fill(null));
    setHasChecked(false);
    setSuccess(false);
    setSelectedPoolPlanet(null);
    setSelectedSourceSlot(null);
    setSelectedEmptySlotIndex(null);
  };

  const handlePlacePlanet = (planet: Planet) => {
    // Find the first empty slot in orbitsSlots
    const emptyIndex = orbitsSlots.findIndex((s) => s === null);
    if (emptyIndex === -1) {
      // All slots full
      return;
    }

    playSound('place');
    
    // Copy slot state and assign
    const newSlots = [...orbitsSlots];
    newSlots[emptyIndex] = planet;
    setOrbitsSlots(newSlots);

    // Remove from pool
    setShuffledPool(shuffledPool.filter((p) => p.id !== planet.id));
    setSelectedPoolPlanet(null);
    setSelectedSourceSlot(null);
    setHasChecked(false);
  };

  const handleRemovePlanet = (index: number) => {
    const planet = orbitsSlots[index];
    if (!planet) return;

    playSound('remove');

    // Remove from slots
    const newSlots = [...orbitsSlots];
    newSlots[index] = null;
    setOrbitsSlots(newSlots);

    // Add back to pool
    if (!shuffledPool.some(p => p.id === planet.id)) {
      setShuffledPool([...shuffledPool, planet]);
    }

    // Reset selection states to keep simple and clean
    setSelectedPoolPlanet(null);
    setSelectedSourceSlot(null);
    setHasChecked(false);
  };

  const orbitHints = [
    "O mais pequenino e perto do Sol!",
    "Muito quente e brilha intensamente!",
    "O planeta azul de água: a nossa casa!",
    "Vermelho e rochoso, com robôs exploradores!",
    "O gigante protetor, o maior de todos!",
    "Lindo e famoso pelos seus anéis brilhantes!",
    "O gigante gelado que gira deitado!",
    "O último planeta, super distante e frio!"
  ];

  const handlePoolPlanetClick = (planet: Planet) => {
    // If we have an empty slot selected, place this planet in that slot!
    if (selectedEmptySlotIndex !== null) {
      playSound('place');
      const newSlots = [...orbitsSlots];
      newSlots[selectedEmptySlotIndex] = planet;
      setOrbitsSlots(newSlots);

      setShuffledPool(shuffledPool.filter((p) => p.id !== planet.id));
      setSelectedEmptySlotIndex(null);
      setSelectedPoolPlanet(null);
      setSelectedSourceSlot(null);
      setHasChecked(false);
      return;
    }

    // Toggle selected pool planet
    if (selectedPoolPlanet?.id === planet.id && selectedSourceSlot === null) {
      setSelectedPoolPlanet(null);
      setSelectedSourceSlot(null);
    } else {
      setSelectedPoolPlanet(planet);
      setSelectedSourceSlot(null);
      setSelectedEmptySlotIndex(null);
    }
  };

  const handleSlotClick = (index: number) => {
    const existingPlanet = orbitsSlots[index];
    
    if (existingPlanet) {
      // If we already have a selected planet, let's replace or swap!
      if (selectedPoolPlanet) {
        // If clicking on itself, just deselect
        if (selectedPoolPlanet.id === existingPlanet.id) {
          setSelectedPoolPlanet(null);
          setSelectedSourceSlot(null);
          return;
        }

        playSound('place');
        const newSlots = [...orbitsSlots];
        
        if (selectedSourceSlot !== null) {
          // Swap positions of two placed planets!
          newSlots[selectedSourceSlot] = existingPlanet;
          newSlots[index] = selectedPoolPlanet;
        } else {
          // Came from pool. Swap placed planet back to pool!
          newSlots[index] = selectedPoolPlanet;
          let newPool = shuffledPool.filter(p => p.id !== selectedPoolPlanet.id);
          newPool.push(existingPlanet);
          setShuffledPool(newPool);
        }

        setOrbitsSlots(newSlots);
        setSelectedPoolPlanet(null);
        setSelectedSourceSlot(null);
        setHasChecked(false);
      } else {
        // No planet selected. Select this placed planet so the user can click on another slot to move/swap it!
        setSelectedPoolPlanet(existingPlanet);
        setSelectedSourceSlot(index);
        setSelectedEmptySlotIndex(null);
      }
      return;
    }

    // Empty slot clicked:
    if (selectedPoolPlanet) {
      playSound('place');
      const newSlots = [...orbitsSlots];
      
      if (selectedSourceSlot !== null) {
        // Move from old slot to this empty slot!
        newSlots[selectedSourceSlot] = null;
        newSlots[index] = selectedPoolPlanet;
      } else {
        // Place from pool!
        newSlots[index] = selectedPoolPlanet;
        setShuffledPool(shuffledPool.filter((p) => p.id !== selectedPoolPlanet.id));
      }

      setOrbitsSlots(newSlots);
      setSelectedPoolPlanet(null);
      setSelectedSourceSlot(null);
      setHasChecked(false);
    } else {
      // Toggle empty slot selection so they can click on a planet second
      if (selectedEmptySlotIndex === index) {
        setSelectedEmptySlotIndex(null);
      } else {
        setSelectedEmptySlotIndex(index);
        setSelectedPoolPlanet(null);
        setSelectedSourceSlot(null);
      }
    }
  };

  const handleCheckAlignment = () => {
    // Let's check correctness
    let allCorrect = true;
    let errors = 0;

    orbitsSlots.forEach((planet, index) => {
      if (!planet || planet.realOrder !== index + 1) {
        allCorrect = false;
        errors += 1;
      }
    });

    // Check if any slot is empty
    const hasEmpty = orbitsSlots.some((s) => s === null);
    if (hasEmpty) {
      // Do nothing, encourage filling first inside Cosmo advice
      return;
    }

    setHasChecked(true);
    if (allCorrect) {
      setSuccess(true);
      playSound('success');
      onCompleteSorting();
    } else {
      setSuccess(false);
      playSound('fail');
      setErrorCount(errors);
    }
  };

  // Quick auto-solve cheat button so children/inspectors don't get stuck if they need help
  const handleAutoSolve = () => {
    playSound('success');
    const correctSlots = [...planetsData].sort((a, b) => a.realOrder - b.realOrder);
    setOrbitsSlots(correctSlots);
    setShuffledPool([]);
    setHasChecked(true);
    setSuccess(true);
    onCompleteSorting();
  };

  // Guidance advice from Cosmo depending on game state
  const getCosmoAdvice = () => {
    if (success) {
      return "Absolutamente espetacular! Alinhaste na perfeição todos os planetas em órbita à volta do Sol! Agora que terminaste esta missão, desafia-te no Super Quiz de Astronomia!";
    }

    if (selectedPoolPlanet) {
      if (selectedSourceSlot !== null) {
        return `Estás a mover o planeta ${selectedPoolPlanet.name}! Clica noutra órbita (vazia ou ocupada) para o colocares lá, ou clica no pequeno '✕' vermelho para o retirares!`;
      } else {
        return `Selecionaste o planeta ${selectedPoolPlanet.name}! Agora clica numa das órbitas acima (do 1.º ao 8.º) onde achas que ele deve ficar!`;
      }
    }

    if (selectedEmptySlotIndex !== null) {
      return `Selecionaste a Órbita ${selectedEmptySlotIndex + 1}! Agora clica num planeta em baixo na caixa para o colocares diretamente nesta órbita!`;
    }
    
    const countFilled = orbitsSlots.filter((s) => s !== null).length;
    if (countFilled === 0) {
      return "Astronauta, temos uma missão! Os planetas perderam-se no espaço. Primeiro clica num planeta em baixo na caixa, e depois clica na órbita onde achas que ele gira!";
    }

    if (countFilled < 8) {
      return `Belo começo! Já alinhaste ${countFilled} planetas. Seleciona outro planeta e clica na órbita de destino para continuares a tua missão!`;
    }

    if (hasChecked && !success) {
      return `Oh, não! Há pelo menos ${errorCount} planetas fora do sítio correto. Clica nos botões vermelhos '✕' para os retirares e tenta colocá-los na ordem certa de novo! Tu consegues!`;
    }

    return "Todas as órbitas estão preenchidas! Carrega no botão verde 'Verificar Alinhamento 🚀' para vermos se a tua tripulação seguiu o curso com sucesso!";
  };

  const getCosmoExpression = () => {
    if (success) return 'proud';
    if (hasChecked && !success) return 'thinking';
    return 'happy';
  };

  return (
    <div id="planet-sorter-mission" className="space-y-8 pb-12">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-indigo-950 pb-4">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-2xl font-display text-sm font-black border-b-4 border-slate-950 shadow-md transition-all active:translate-y-0.5 cursor-pointer"
        >
          <ArrowLeft size={16} /> Voltar ao Menu
        </button>

        <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2 text-center text-indigo-400">
          <SlidersHorizontal size={20} className="text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          Missão: Alinhamento das Órbitas
        </h3>

        <div className="flex gap-2">
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-black font-display border-b-4 border-slate-950 cursor-pointer shadow transition-all active:translate-y-0.5"
            title="Recomeçar o Alinhamento"
          >
            <RotateCcw size={13} /> Reiniciar
          </button>
          
          <button
            onClick={handleAutoSolve}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-indigo-900/60 hover:bg-indigo-900 text-indigo-400 hover:text-indigo-300 rounded-xl text-xs font-black font-display border-b-4 border-indigo-950 cursor-pointer shadow transition-all active:translate-y-0.5"
            title="Aprender com ajuda"
          >
            A ajuda do Cosmo
          </button>
        </div>
      </div>

      {/* Cosmo advice frame */}
      <CosmoCompanion text={getCosmoAdvice()} expression={getCosmoExpression()} />

      {/* Main Gameboard block */}
      <div className="bg-[#211145] border-4 border-amber-400 rounded-3xl p-6 shadow-[0_8px_0_0_#f59e0b,0_15px_30px_rgba(245,158,11,0.15)] relative overflow-hidden">
        {/* Sky effect */}
        <div className="absolute inset-0 bg-[radial-gradient(#4338ca_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-55" />
        
        {/* 3rd-grade child-friendly tutor help banner */}
        <div className="relative mb-6 p-4 rounded-2xl bg-[#0e072c] border-2 border-indigo-500/30 flex items-start gap-3.5 shadow-lg">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl text-yellow-400 font-bold shrink-0 animate-bounce text-lg">
            💡
          </div>
          <div className="space-y-1 text-left">
            <h4 className="font-display font-black text-xs text-amber-300 uppercase tracking-wide">
              Como jogar? (Super fácil de clicar!)
            </h4>
            <p className="font-sans text-xs text-indigo-200 leading-relaxed">
              👉 <strong className="text-white font-black underline decoration-yellow-400">1. SELECIONA:</strong> Clica em qualquer planeta (cá em baixo na caixa ou já em órbita) para ele ficar brilhante.<br />
              👉 <strong className="text-cyan-300 font-bold">2. COLOCA:</strong> Clica na órbita onde o queres colocar! Podes colocá-lo numa órbita vazia ou em cima de outro planeta para trocar as posições.<br />
              👉 <strong className="text-rose-300 font-bold">REMOVER:</strong> Queres retirar um planeta? Basta clicares no pequeno <strong className="text-rose-450 font-bold font-display">✕ vermelho</strong> no canto do planeta em órbita!
            </p>
          </div>
        </div>

        {/* Selected element action instruction panels */}
        {selectedPoolPlanet && (
          <div className="relative mb-6 p-3 rounded-2xl bg-indigo-900 border-2 border-amber-400 text-center animate-pulse flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg z-20">
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full bg-gradient-to-tr ${selectedPoolPlanet.colorClass} relative shrink-0`}>
                {selectedPoolPlanet.id === 'saturno' && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[30%] border border-amber-300/40 rounded-full rotate-[15deg]" />
                )}
              </div>
              <p className="text-xs font-display font-black text-amber-300 uppercase tracking-wider">
                {selectedPoolPlanet.name} Selecionado!
              </p>
            </div>
            <p className="text-[11px] text-indigo-200 font-sans">
              Clica agora numa das Órbitas vazias ou ocupadas (1 a 8) acima para colocá-lo lá!
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (selectedPoolPlanet) {
                    handlePlacePlanet(selectedPoolPlanet);
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all active:translate-y-0.5"
              >
                Mandar para a 1ª órbita livre 🚀
              </button>
              <button
                onClick={() => {
                  setSelectedPoolPlanet(null);
                  setSelectedSourceSlot(null);
                }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer active:translate-y-0.5 transition-all"
              >
                Cancelar ❌
              </button>
            </div>
          </div>
        )}

        {selectedEmptySlotIndex !== null && (
          <div className="relative mb-6 p-3 rounded-2xl bg-indigo-900 border-2 border-cyan-400 text-center animate-pulse flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg z-20" id="selected-empty-slot-bar">
            <p className="text-xs font-display font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1">
              <span>🛰️</span> Órbita {selectedEmptySlotIndex + 1} Selecionada! 
            </p>
            <p className="text-[11px] text-indigo-200 font-sans">
              Clica agora num planeta da Caixa em baixo de modo a colocá-lo diretamente nesta órbita!
            </p>
            <button
              onClick={() => setSelectedEmptySlotIndex(null)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Cancelar ❌
            </button>
          </div>
        )}

        {/* Orbit Targets Line Container (Slots 1 to 8) */}
        <div className="relative flex flex-col lg:flex-row items-center justify-start gap-6 pb-6 pt-2 z-10 w-full overflow-hidden" id="solar-system-grid-container">
          
          {/* Main glowing sun decoration in the left container */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-2xl w-24 h-24 lg:w-28 lg:h-28 border-3 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] border-amber-300/60" id="decor-sun">
            <Sun size={28} className="text-amber-950 animate-pulse" />
            <span className="text-[10px] font-bold font-display uppercase tracking-widest text-amber-950 mt-1">Sol</span>
          </div>

          {/* Render Slots (Now playing nice on narrow layout grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 w-full" id="orbits-row-grid">
            {orbitsSlots.map((planet, index) => {
              const slotNumber = index + 1;
              const isOccupied = planet !== null;
              
              // Correctness indicator checks
              const isCorrectInSlot = planet ? planet.realOrder === slotNumber : false;
              const showResultStatus = hasChecked && isOccupied;

              return (
                <div key={index} className="flex-1 flex md:flex-col items-center gap-3 w-full md:w-auto" id={`orbit-box-${slotNumber}`}>
                  {/* Slot Orbit number on Left or Top */}
                  <div className="font-display font-bold text-[11px] sm:text-xs text-indigo-400 uppercase bg-slate-900 border border-slate-800 h-9 w-9 rounded-full flex items-center justify-center shadow-lg">
                    {slotNumber}.º
                  </div>

                  {/* Planet placement Circle */}
                  <div className="flex-1 md:flex-none w-full">
                    {planet ? (
                      /* Filled Orbit Slot */
                      <motion.button
                        id={`filled-slot-btn-${slotNumber}`}
                        layoutId={`planet-sort-${planet.id}`}
                        onClick={() => handleSlotClick(index)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full md:w-24 h-28 rounded-2xl p-2 flex flex-col items-center justify-center gap-1.5 select-none cursor-pointer transition-all relative ${
                          showResultStatus 
                            ? isCorrectInSlot 
                              ? 'bg-[#062419] border-4 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                              : 'bg-[#2d0f17] border-4 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-bounce'
                            : (selectedPoolPlanet?.id === planet.id && selectedSourceSlot === index)
                              ? 'bg-indigo-900 border-4 border-yellow-400 shadow-[0_0_18px_rgba(234,179,8,0.7)] animate-pulse scale-105 z-10'
                              : 'bg-indigo-950/60 border-2 border-indigo-400/80 hover:border-indigo-300 shadow-md'
                        }`}
                      >
                        {/* Shimmer mini planet */}
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${planet.colorClass} shadow-md overflow-hidden relative flex-shrink-0`}>
                          {planet.id === 'saturno' && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[30%] border border-amber-300/40 rounded-full rotate-[15deg]" />
                          )}
                        </div>
                        
                        <div className="text-center">
                          <span className="block font-display font-black text-[11px] text-white truncate max-w-[80px]">{planet.name}</span>
                          <span className={`block text-[8px] mt-0.5 leading-none font-sans font-bold ${
                            (selectedPoolPlanet?.id === planet.id && selectedSourceSlot === index)
                              ? 'text-yellow-300'
                              : 'text-indigo-300'
                          }`}>
                            {(selectedPoolPlanet?.id === planet.id && selectedSourceSlot === index) ? 'A MOVER' : 'Mudar 🪙'}
                          </span>
                        </div>

                        {/* Miniature status check icon overlay */}
                        {showResultStatus && (
                          <div className={`absolute -top-1.5 -right-1.5 rounded-full p-1 text-white border border-slate-950 shadow z-20 ${
                            isCorrectInSlot ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}>
                            {isCorrectInSlot ? <Check size={8} strokeWidth={4} /> : <X size={8} strokeWidth={4} />}
                          </div>
                        )}

                        {/* Absolute positioned cross button for immediate removal */}
                        {!success && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemovePlanet(index);
                            }}
                            className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-600 hover:bg-rose-500 text-white rounded-full flex items-center justify-center font-bold text-[10px] shadow-lg border-2 border-rose-400 cursor-pointer active:scale-95 select-none z-30"
                            title="Retirar planeta"
                          >
                            ✕
                          </button>
                        )}
                      </motion.button>
                    ) : (
                      /* Empty Orbit Slot - Clickable configuration */
                      <motion.button
                        id={`empty-slot-btn-${slotNumber}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSlotClick(index)}
                        className={`w-full md:w-24 h-28 border-2 border-dashed rounded-2xl flex flex-col items-center justify-between p-2 select-none transition-all cursor-pointer ${
                          selectedEmptySlotIndex === index
                            ? 'border-yellow-400 bg-yellow-950/30 shadow-[0_0_15px_rgba(234,179,8,0.4)] animate-pulse text-yellow-400 font-bold scale-105'
                            : 'border-slate-800 bg-slate-950/50 hover:border-indigo-500/60 text-slate-500 hover:text-slate-400'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center text-center h-full gap-1">
                          <HelpCircle size={16} className={`${
                            selectedEmptySlotIndex === index 
                              ? 'text-yellow-400 animate-pulse'
                              : 'text-slate-600'
                          }`} />
                          <span className={`block font-display font-bold text-[9px] tracking-wider uppercase leading-none ${
                            selectedEmptySlotIndex === index
                              ? 'text-yellow-400 font-black'
                              : 'text-slate-500'
                          }`}>
                            {selectedEmptySlotIndex === index ? 'Colocar aqui!' : `Órbita ${slotNumber}`}
                          </span>
                          <span className="block text-[7px] text-slate-400 leading-tight font-sans max-h-[44px] overflow-hidden mt-0.5">
                            {orbitHints[index]}
                          </span>
                        </div>
                      </motion.button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shuffled Available Planets Pool (BOX) */}
        {!success && (
          <div 
            className="border-t border-indigo-950/50 pt-6 mt-4 space-y-4 p-4 rounded-2xl transition-all"
            id="available-planets-pool-wrapper"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 font-display flex items-center gap-1.5 uppercase">
                <Sparkles size={14} className="text-yellow-400" />
                Caixa de Planetas Disponíveis
              </span>
              <span className="text-[10px] text-indigo-300 font-sans font-medium">Toque/Clica num planeta para o alinhar!</span>
            </div>

            {shuffledPool.length === 0 ? (
              <div className="p-4 bg-indigo-950/20 border border-dashed border-indigo-900 rounded-2xl text-center text-sm font-sans text-slate-400">
                Colocaste todos os 8 planetas! Clica no botão abaixo para verificar se ficaste com a ordem perfeita!
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 py-1" id="pool-buttons-grid">
                <AnimatePresence>
                  {shuffledPool.map((planet) => (
                    <motion.button
                      key={planet.id}
                      id={`pool-planet-btn-${planet.id}`}
                      layoutId={`planet-sort-${planet.id}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePoolPlanetClick(planet)}
                      className={`px-4 py-2.5 bg-slate-900 rounded-xl flex items-center gap-2.5 select-none transition-all shadow-md active:translate-y-0.5 border-2 cursor-pointer ${
                        selectedPoolPlanet?.id === planet.id
                          ? 'border-yellow-400 bg-yellow-950/20 shadow-[0_0_15px_rgba(234,179,8,0.5)] scale-105 ring-2 ring-yellow-400/50'
                          : 'border-slate-700 hover:border-amber-400 hover:bg-slate-800'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-tr ${planet.colorClass} relative shrink-0`}>
                        {planet.id === 'saturno' && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[30%] border border-amber-300/40 rounded-full rotate-[15deg]" />
                        )}
                      </div>
                      <div className="text-left">
                        <span className="block font-display font-bold text-xs text-slate-200">{planet.name}</span>
                        <span className="block font-sans text-[8px] text-indigo-300 leading-none mt-0.5">{planet.nickname}</span>
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {/* Action Bottom Section (Check Result / Success celebration) */}
        <div className="border-t border-indigo-950/50 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-center gap-4" id="action-sorting-footer">
          {!success ? (
            <button
              id="btn-check-alignment-action"
              onClick={handleCheckAlignment}
              disabled={orbitsSlots.some((s) => s === null)}
              className={`w-full sm:w-auto px-8 py-4 font-display text-sm font-black rounded-2xl flex items-center justify-center gap-2.5 cursor-pointer shadow-lg transition-all ${
                orbitsSlots.some((s) => s === null)
                  ? 'bg-slate-800 text-slate-500 border-b-4 border-slate-950 cursor-not-allowed opacity-55'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-black border-b-4 border-emerald-700 active:translate-y-1'
              }`}
            >
              <Play size={16} /> Verificar Alinhamento 🚀
            </button>
          ) : (
            <div className="text-center w-full space-y-4" id="align-win-box">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#062419] border-2 border-emerald-400 rounded-2xl text-emerald-300 font-display text-xs font-black uppercase tracking-wider animate-bounce shadow-md">
                <Award size={14} className="text-yellow-400" />
                Missão de Alinhamento Cumprida!
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onGoToQuiz}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-display text-sm font-black rounded-2xl shadow-md border-b-4 border-indigo-800 cursor-pointer active:translate-y-1 transition-all"
                >
                  Ir para o Super Quiz ✏️
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
