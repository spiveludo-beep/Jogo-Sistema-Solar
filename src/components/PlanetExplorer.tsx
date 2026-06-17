import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Planet } from '../types';
import { planetsData } from '../data/planetsData';
import { CosmoCompanion } from './CosmoCompanion';
import { 
  Orbit, 
  Sparkles, 
  ArrowLeft, 
  Gauge, 
  MapPin, 
  Sun, 
  Info, 
  Tv, 
  Moon, 
  Thermometer, 
  Compass,
  CheckCircle2,
  BookmarkCheck
} from 'lucide-react';

interface PlanetExplorerProps {
  exploredPlanets: string[];
  onPlanetExplored: (id: string) => void;
  onBackToHome: () => void;
  onGoToSorting: () => void;
}

export const PlanetExplorer: React.FC<PlanetExplorerProps> = ({
  exploredPlanets,
  onPlanetExplored,
  onBackToHome,
  onGoToSorting,
}) => {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'curiosidades'>('info');

  const handleSelectPlanet = (planet: Planet) => {
    setSelectedPlanet(planet);
    onPlanetExplored(planet.id);
    setActiveTab('info');
  };

  // Sound effect generator for planet clicks (Web Audio API)
  const playClickSound = (freqNode: number = 440) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freqNode, audioCtx.currentTime); // Pitch changes per planet
      oscillator.frequency.exponentialRampToValueAtTime(freqNode * 1.5, audioCtx.currentTime + 0.15);
      
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // Ignored if browser limits audio
    }
  };

  // Simple orbital system visualization scale mapping
  const orbitsMap = [
    { id: 'mercurio', l: 'left-[16%]', size: 'w-6 h-6', speed: 'animate-[orbit_5s_linear_infinite]' },
    { id: 'venus', l: 'left-[26%]', size: 'w-9 h-9', speed: 'animate-[orbit_8s_linear_infinite]' },
    { id: 'terra', l: 'left-[37%]', size: 'w-10 h-10', speed: 'animate-[orbit_12s_linear_infinite]' },
    { id: 'marte', l: 'left-[48%]', size: 'w-8 h-8', speed: 'animate-[orbit_16s_linear_infinite]' },
    { id: 'jupiter', l: 'left-[62%]', size: 'w-20 h-20', speed: 'animate-[orbit_22s_linear_infinite]' },
    { id: 'saturno', l: 'left-[76%]', size: 'w-16 h-16', speed: 'animate-[orbit_28s_linear_infinite]' },
    { id: 'urano', l: 'left-[87%]', size: 'w-12 h-12', speed: 'animate-[orbit_34s_linear_infinite]' },
    { id: 'neptuno', l: 'left-[95%]', size: 'w-11 h-11', speed: 'animate-[orbit_40s_linear_infinite]' },
  ];

  const totalPlanets = planetsData.length;
  const exploredCount = exploredPlanets.length;
  const isAllExplored = exploredCount === totalPlanets;

  // Dynamic advice from Cosmo based on exploration progress
  const getCosmoAdvice = () => {
    if (selectedPlanet) {
      return `Estás a explorar ${selectedPlanet.name}, também conhecido como "${selectedPlanet.nickname}". Clica nos botões ou carrega no altifalante para me ouvires!`;
    }
    if (exploredCount === 0) {
      return "Olá, pequeno explorador da Astrolândia! Clica em qualquer planeta para iniciares a tua viagem espacial de exploração! Vamos desvendar o Universo juntos!";
    }
    if (isAllExplored) {
      return "Espetacular! Exploraste os 8 planetas do Sistema Solar! Agora já és um autêntico perito espacial. Que tal testares o teu conhecimento na Missão de Ordenação?";
    }
    return `Belo trabalho de explorador científico! Já visitaste ${exploredCount} dos ${totalPlanets} planetas. Faltam apenas ${totalPlanets - exploredCount} para completares o mapa!`;
  };

  const getCosmoExpression = () => {
    if (isAllExplored) return 'proud';
    if (selectedPlanet) return 'excited';
    if (exploredCount > 0) return 'happy';
    return 'wave';
  };

  return (
    <div id="planet-explorer-stage" className="space-y-8 pb-12">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-indigo-950 pb-4">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-display text-sm font-black border-b-4 border-indigo-900 shadow-md transition-all active:translate-y-0.5 cursor-pointer"
        >
          <ArrowLeft size={16} /> Voltar ao Menu
        </button>

        <div className="flex items-center gap-3 bg-[#0c122e] border-4 border-cyan-400 rounded-3xl px-5 py-2.5 shadow-md">
          <div className="text-right">
            <span className="text-[11px] font-bold text-indigo-400 font-display tracking-wider uppercase">Exploração Cósmica</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-mono text-cyan-300 font-bold">{exploredCount}/{totalPlanets}</span>
              <span className="text-xs text-slate-300 font-medium">Planetas Visitados</span>
            </div>
          </div>
          {/* Progress gauge circles */}
          <div className="flex gap-1">
            {planetsData.map((p) => {
              const checked = exploredPlanets.includes(p.id);
              return (
                <div
                  key={p.id}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-500 shadow-sm ${
                    checked ? 'bg-cyan-400 scale-110 shadow-cyan-500/50' : 'bg-slate-800 border border-slate-700'
                  }`}
                  title={p.name}
                />
              );
            })}
          </div>
        </div>

        {isAllExplored ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGoToSorting}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-display text-sm font-black rounded-2xl shadow-md border-b-4 border-emerald-700 cursor-pointer transition-all active:translate-y-0.5 animate-pulse"
          >
            <BookmarkCheck size={16} /> Próxima Missão!
          </motion.button>
        ) : (
          <div className="text-xs text-indigo-400 font-display max-w-[200px] text-center sm:text-right">
            Visita todos os planetas para desbloqueares o teu diploma espacial!
          </div>
        )}
      </div>

      {/* Cosmo guiding advice */}
      <CosmoCompanion text={getCosmoAdvice()} expression={getCosmoExpression()} />

      {/* Orbital Interactive Map (Stylized & Kid-Friendly) */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#181254] to-[#0c082e] border-4 border-cyan-400 rounded-3xl p-6 shadow-[0_0_20px_rgba(34,211,238,0.25),0_8px_0_0_#0891b2] h-[290px] sm:h-[350px] flex items-center justify-center">
        {/* Starfields background effect */}
        <div className="absolute inset-0 bg-[radial-gradient(#4338ca_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-60" />
        <div className="absolute top-4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping duration-1000" />
        <div className="absolute bottom-16 right-1/3 w-3.5 h-3.5 bg-yellow-300 rounded-full animate-pulse filter blur-xs" />
        <div className="absolute top-12 right-12 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse filter blur-xs" />

        {/* Orbit Ellipses Lines Layout */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-full flex items-center justify-start overflow-x-auto select-none no-scrollbar py-6 scroll-smooth">
          <div className="relative min-w-[900px] sm:min-w-[1100px] h-full flex items-center">
            
            {/* The Sun at the focus */}
            <motion.div
              animate={{ scale: [1, 1.05, 1], filter: ["drop-shadow(0 0 25px #eab308)", "drop-shadow(0 0 45px #f97316)", "drop-shadow(0 0 25px #eab308)"] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute left-4 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 z-10 flex flex-col items-center justify-center text-amber-950 border-4 border-yellow-300 shadow-2xl cursor-default"
            >
              <div className="text-2xl sm:text-3.5xl animate-spin duration-10000">☀️</div>
              <span className="text-xs font-black font-display uppercase tracking-wider mt-0.5">Sol 😃</span>
              <span className="text-[9px] font-mono font-bold bg-amber-300 text-amber-900 px-1.5 py-0.5 rounded-full mt-0.5">ESTRELA VIVA</span>
            </motion.div>

            {/* Orbit lines drawing & planet handles */}
            {planetsData.map((planet) => {
              const orbitDetail = orbitsMap.find((item) => item.id === planet.id);
              const isSelected = selectedPlanet?.id === planet.id;
              const hasExplored = exploredPlanets.includes(planet.id);

              return (
                <div key={planet.id} className="relative h-full flex items-center">
                  {/* Vertical-like path spacer (approx orbits curves in flat mode for easier clicking) */}
                  <div className={`absolute ${orbitDetail?.l} top-1/2 -translate-y-1/2 flex flex-col items-center z-20`}>
                    
                    {/* Ring for orbit visualization */}
                    <div className="absolute w-[1px] h-[160px] sm:h-[220px] bg-gradient-to-b from-indigo-500/0 via-indigo-500/10 to-indigo-500/0" />
                    
                    {/* Interactive Planet Orb Ball */}
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        playClickSound(260 + planet.realOrder * 60);
                        handleSelectPlanet(planet);
                      }}
                      className={`relative rounded-full cursor-pointer flex items-center justify-center font-display transition-all ${orbitDetail?.size} ${
                        isSelected 
                          ? 'ring-4 ring-cyan-400 ring-offset-4 ring-offset-slate-950 z-30' 
                          : 'hover:ring-2 hover:ring-indigo-400'
                      }`}
                    >
                      {/* Saturn Custom visual ring in miniature flat view */}
                      {planet.id === 'saturno' && (
                        <div className="absolute w-[230%] h-[25%] border-2 border-amber-300/40 bg-zinc-800/10 rounded-full rotate-[18deg] pointer-events-none z-10" />
                      )}

                      {/* Planet body circle gradient */}
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${planet.colorClass} ${planet.bgGlow} overflow-hidden`}>
                        {/* Shading/textures */}
                        <div className="absolute inset-0 bg-black/15 mix-blend-overlay rounded-full" />
                        {/* Clouds or spots textures */}
                        {planet.id === 'terra' && <div className="absolute -top-1 left-2 w-5 h-3 bg-emerald-300/40 rounded-full blur-xs" />}
                        {planet.id === 'marte' && <div className="absolute top-2 left-1 w-3 h-3 bg-red-400/30 rounded-full" />}
                        {planet.id === 'jupiter' && <div className="absolute bottom-2 right-2 w-2.5 h-1.5 bg-orange-700/60 rounded-full" />}
                      </div>

                      {/* Checkmark indicator if visited */}
                      {hasExplored && (
                        <div className="absolute -top-2 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm border border-slate-900 scale-90">
                          <CheckCircle2 size={10} strokeWidth={3} />
                        </div>
                      )}

                      {/* Small planet designation tag popup on hover/selection */}
                      <div className={`absolute -bottom-8 whitespace-nowrap px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                        isSelected ? 'bg-cyan-400 text-slate-950 shadow-md scale-105' : 'bg-slate-900/90 text-slate-300'
                      }`}>
                        {planet.name}
                      </div>
                    </motion.button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Swipe instructions helper for small screens */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-indigo-400 font-bold bg-indigo-950/90 py-1 px-3 border border-indigo-900 rounded-full flex items-center gap-1.5 pointer-events-none animate-pulse">
          <span>Arrasa para os lados ⇄ para ver todos os planetas</span>
        </div>
      </div>

      {/* Detail Showcase Block with Slide transitions */}
      <AnimatePresence mode="wait">
        {selectedPlanet ? (
          <motion.div
            key={selectedPlanet.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#1a1362]/95 border-4 border-indigo-400 rounded-3xl p-6 sm:p-8 shadow-[0_8px_0_0_#4f46e5,0_20px_40px_rgba(79,70,229,0.25)] relative"
          >
            {/* Sparkle decorator */}
            <div className="absolute top-4 right-4 text-cyan-400/20">
              <Orbit size={180} />
            </div>

            {/* Column 1: Big Planet Visual Rotation Panel */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 border-b lg:border-b-0 lg:border-r border-indigo-900/60 space-y-6">
              <div className="relative flex items-center justify-center p-8">
                {/* Orbital glow halo background */}
                <div className={`absolute w-44 h-44 rounded-full blur-2xl opacity-25 ${
                  selectedPlanet.id === 'terra' ? 'bg-cyan-500' :
                  selectedPlanet.id === 'venus' ? 'bg-orange-500' :
                  selectedPlanet.id === 'marte' ? 'bg-red-500' :
                  selectedPlanet.id === 'jupiter' ? 'bg-amber-500' :
                  selectedPlanet.id === 'saturno' ? 'bg-yellow-500' :
                  selectedPlanet.id === 'urano' ? 'bg-teal-500' :
                  selectedPlanet.id === 'neptuno' ? 'bg-blue-500' : 'bg-gray-500'
                }`} />

                {/* Animated Rotating Planet Body (Huge) */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
                  className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr ${selectedPlanet.colorClass} ${selectedPlanet.bgGlow} relative border border-white/20 select-none`}
                >
                  {/* Saturn Giant aesthetic detailed tilted rings */}
                  {selectedPlanet.id === 'saturno' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[20%] border-[12px] border-amber-300/30 bg-yellow-950/10 rounded-full rotate-[15deg] pointer-events-none z-10" />
                  )}
                  {selectedPlanet.id === 'saturno' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[15%] border-[4px] border-amber-100/50 rounded-full rotate-[15deg] pointer-events-none z-25" />
                  )}

                  {/* Urano side-spinning tilt rings */}
                  {selectedPlanet.id === 'urano' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[145%] h-[145%] border border-cyan-300/30 rounded-full rotate-[85deg] pointer-events-none z-10" />
                  )}

                  {/* Texture details inside planet boundary */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_top,transparent_30%,rgba(0,0,0,0.45)_90%)] rounded-full mix-blend-overlay" />
                  
                  {/* Planet atmospheric swirls */}
                  <div className="absolute top-1/3 left-1/4 w-3/4 h-2 bg-white/10 rounded-full blur-xs" />
                  <div className="absolute bottom-1/3 left-1/6 w-1/2 h-3 bg-white/5 rounded-full blur-xs" />
                  
                  {/* Earth-specific aesthetic land segments */}
                  {selectedPlanet.id === 'terra' && (
                    <>
                      <div className="absolute top-8 left-6 w-9 h-12 bg-emerald-400/30 rounded-full blur-sm" />
                      <div className="absolute bottom-6 right-8 w-12 h-10 bg-emerald-500/25 rounded-full blur-xs" />
                      <div className="absolute top-12 right-6 w-5 h-5 bg-teal-400/30 rounded-full blur-sm" />
                      {/* Interactive orbiting Moon */}
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                        className="absolute inset--4 rounded-full pointer-events-none"
                      >
                        <div className="absolute top-0 left-0 w-3 h-3 bg-zinc-300 rounded-full shadow-md stroke-zinc-400" />
                      </motion.div>
                    </>
                  )}

                  {/* Jupiter famous Big Red Spot storm */}
                  {selectedPlanet.id === 'jupiter' && (
                    <div className="absolute bottom-10 right-6 w-6 h-4 bg-red-600/70 border border-amber-400/20 rounded-full flex items-center justify-center shadow-inner">
                      <div className="w-3 h-1 bg-amber-400/40 rounded-full" />
                    </div>
                  )}

                  {/* Mars polar caps */}
                  {selectedPlanet.id === 'marte' && (
                    <div className="absolute top-1 right-12 w-4 h-1.5 bg-white/70 rounded-full blur-xs" />
                  )}
                </motion.div>
              </div>

              {/* Title & Badge */}
              <div className="text-center space-y-1.5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 bg-[#090532] border border-indigo-500/40 rounded-full text-xs font-bold leading-none ${selectedPlanet.textColor} tracking-wider font-display`}>
                  <Compass size={12} className="animate-pulse" />
                  Posição: {selectedPlanet.realOrder}.º do Sol
                </span>
                <h3 className="text-3xl font-black font-display text-white tracking-tight">
                  {selectedPlanet.name}
                </h3>
                <p className="text-sm font-sans font-semibold text-cyan-300">
                  "{selectedPlanet.nickname}"
                </p>
              </div>
            </div>

            {/* Column 2: Specific Cards or Tab Controls */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              {/* Tab Selector buttons */}
              <div className="flex border-2 border-indigo-900 p-1 bg-[#09062e] rounded-2xl max-w-sm shadow-md">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-display text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'info' 
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-550 text-white border-b-4 border-indigo-800 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#120f45]'
                  }`}
                >
                  <Gauge size={13} /> Estatísticas
                </button>
                <button
                  onClick={() => setActiveTab('curiosidades')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-display text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'curiosidades' 
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-black border-b-4 border-yellow-650 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#120f45]'
                  }`}
                >
                  <Sparkles size={13} className="text-amber-800" /> Curiosidades
                </button>
              </div>

              {/* Tab contents show/hide */}
              <div className="flex-1">
                {activeTab === 'info' ? (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {/* Stat Card 1: Distância */}
                    <div className="bg-[#0e0a35]/90 p-4 border-2 border-cyan-400 rounded-2xl flex gap-3.5 items-start shadow-md">
                      <div className="p-2.5 bg-cyan-950 rounded-xl text-cyan-400">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-cyan-300 font-display tracking-wider uppercase">Distância ao Sol</h4>
                        <p className="mt-0.5 text-[15px] font-sans font-bold text-white">{selectedPlanet.distanceFromSun}</p>
                      </div>
                    </div>

                    {/* Stat Card 2: Tamanho */}
                    <div className="bg-[#190a35]/90 p-4 border-2 border-amber-300 rounded-2xl flex gap-3.5 items-start shadow-md">
                      <div className="p-2.5 bg-amber-950 rounded-xl text-amber-400">
                        <Compass size={20} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-amber-300 font-display tracking-wider uppercase">Tamanho (Diâmetro)</h4>
                        <p className="mt-0.5 text-[15px] font-sans font-bold text-white">{selectedPlanet.sizeDescription}</p>
                      </div>
                    </div>

                    {/* Stat Card 3: Duração do Ano */}
                    <div className="bg-[#150a30]/90 p-4 border-2 border-purple-400 rounded-2xl flex gap-3.5 items-start shadow-md">
                      <div className="p-2.5 bg-purple-950 rounded-xl text-purple-400">
                        <Orbit size={20} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-purple-300 font-display tracking-wider uppercase">Duração do Ano</h4>
                        <p className="mt-0.5 text-[15px] font-sans font-bold text-white">{selectedPlanet.yearDuration}</p>
                      </div>
                    </div>

                    {/* Stat Card 4: Temperatura */}
                    <div className="bg-[#220722]/90 p-4 border-2 border-rose-450 rounded-2xl flex gap-3.5 items-start shadow-md">
                      <div className="p-2.5 bg-rose-950 rounded-xl text-rose-400">
                        <Thermometer size={20} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-rose-300 font-display tracking-wider uppercase">Temperatura típica</h4>
                        <p className="mt-0.5 text-[15px] font-sans font-bold text-white">{selectedPlanet.temperatureDescription}</p>
                      </div>
                    </div>

                    {/* Stat Card 5: Luas Categoria */}
                    <div className="bg-[#06152a]/90 p-4 border-2 border-emerald-400 rounded-2xl flex gap-3.5 items-start sm:col-span-2 shadow-md">
                      <div className="p-2.5 bg-emerald-950 rounded-xl text-emerald-400">
                        <Moon size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[11px] font-black text-emerald-300 font-display tracking-wider uppercase">Luas do Planeta</h4>
                        <p className="mt-0.5 text-[15px] font-sans font-bold text-white">
                          {selectedPlanet.moonsCount === 0 
                            ? "Não tem nenhuma lua espacial!" 
                            : selectedPlanet.moonsCount === 1 
                              ? "Apenas 1 lua (a nossa famosa Lua!)" 
                              : `Tem ${selectedPlanet.moonsCount} luas fantásticas a orbitar à sua volta!`
                          }
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-indigo-950/40 border border-indigo-900/60 p-4 rounded-2xl">
                      <span className="text-xs font-bold text-cyan-300 font-display flex items-center gap-1.5 uppercase">
                        <Info size={14} /> Sabias que?
                      </span>
                      <p className="mt-1 text-slate-200 font-medium font-sans">
                        {selectedPlanet.funFact}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-indigo-400 font-display tracking-wider uppercase">As 3 Descobertas Científicas:</h4>
                      {selectedPlanet.curiosities.map((item, idx) => (
                        <div key={idx} className="flex gap-3.5 p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl hover:border-indigo-900 transition-colors">
                          <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center font-display font-medium text-xs rounded-full bg-indigo-600 text-white shadow-sm mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-sm font-sans text-slate-300 font-medium leading-relaxed">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Back to Grid prompt */}
              <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                <button
                  onClick={() => setSelectedPlanet(null)}
                  className="px-4 py-2.5 bg-red-500 hover:bg-red-400 text-white rounded-xl font-display text-xs font-black border-b-4 border-red-700 cursor-pointer shadow-md transition-all active:translate-y-0.5"
                >
                  Fechar Janela do Planeta
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Grid of clickable cards if no planet is selected */
          <div className="space-y-4">
            <h4 className="text-xl sm:text-2xl md:text-3xl font-black font-display text-white tracking-tight flex items-center gap-2.5 uppercase">
              <Sparkles size={22} className="text-yellow-400 animate-pulse" />
              Explora o Nosso Mapa do Sistema Solar
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {planetsData.map((planet) => {
                const isExplored = exploredPlanets.includes(planet.id);
                return (
                  <motion.button
                    key={planet.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      playClickSound(300 + planet.realOrder * 50);
                      handleSelectPlanet(planet);
                    }}
                    className={`p-5 rounded-2xl bg-slate-900 border-4 text-left relative overflow-hidden flex flex-col items-start gap-4 transition-all cursor-pointer ${
                      isExplored 
                        ? 'border-cyan-400 vibrant-shadow-cyan' 
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Background faint glow */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/2 rounded-full pointer-events-none" />

                    {/* Planet representation */}
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${planet.colorClass} ${planet.bgGlow} relative`}>
                        {planet.id === 'saturno' && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[30%] border border-amber-300/40 rounded-full rotate-[15deg] pointer-events-none" />
                        )}
                      </div>
                      
                      {/* Checkmark or New indicator */}
                      {isExplored ? (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold font-display text-cyan-400 bg-cyan-950/60 border border-cyan-900 px-2.5 py-0.5 rounded-full">
                          Visitado ✓
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold font-display text-amber-400 bg-amber-950/60 border border-amber-900 px-2.5 py-0.5 rounded-full animate-pulse">
                          Explorar 🚀
                        </span>
                      )}
                    </div>

                    {/* Meta info */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 font-display tracking-wider uppercase">Planeta {planet.realOrder}</span>
                      <h4 className="text-lg font-bold font-display text-white mt-0.5 leading-none">{planet.name}</h4>
                      <p className="text-xs text-slate-400 font-sans mt-1.5 font-medium line-clamp-2">{planet.nickname}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
