import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QuizQuestion } from '../types';
import { quizQuestions } from '../data/quizQuestions';
import { CosmoCompanion } from './CosmoCompanion';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Award, 
  RotateCcw, 
  ChevronRight, 
  Sparkles, 
  Flame, 
  BookOpen,
  Orbit
} from 'lucide-react';

interface SpaceQuizProps {
  onBackToHome: () => void;
  onQuizCompleted: (score: number) => void;
  score: number;
  isCompleted: boolean;
}

export const SpaceQuiz: React.FC<SpaceQuizProps> = ({
  onBackToHome,
  onQuizCompleted,
  score,
  isCompleted,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answeredNum, setAnsweredNum] = useState<number>(0); // total correct
  const [quizFinished, setQuizFinished] = useState(false);
  const [userName, setUserName] = useState('');
  const [showGraduation, setShowGraduation] = useState(false);

  const activeQuestion: QuizQuestion = quizQuestions[currentIdx];

  const playSound = (isCorrect: boolean) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (isCorrect) {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(554.37, audioCtx.currentTime + 0.1); // C#
        oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.2); // E
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.4);
      } else {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(220, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(140, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.4);
      }
    } catch (e) {
      // Audio fallback
    }
  };

  const handleSelectOption = (optIdx: number) => {
    if (selectedOpt !== null) return; // already answered
    
    setSelectedOpt(optIdx);
    const isCorrect = optIdx === activeQuestion.correctIndex;
    playSound(isCorrect);

    if (isCorrect) {
      setAnsweredNum((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      onQuizCompleted(answeredNum);
    }
  };

  const handleResetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setAnsweredNum(0);
    setQuizFinished(false);
    setShowGraduation(false);
  };

  const currentDay = new Date().toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Dynamic Cosmo chat
  const getCosmoAdvice = () => {
    if (quizFinished) {
      if (answeredNum >= Math.ceil(quizQuestions.length * 0.7)) {
        return `Uau! Espetacular! Acertaste ${answeredNum} de ${quizQuestions.length} perguntas! És um verdadeiro mestre cientista do Sistema Solar. Escreve aqui abaixo o teu nome para imprimires o teu Diploma Oficial! 🎓🎖️`;
      }
      return `Muitos parabéns! Acertaste ${answeredNum} de ${quizQuestions.length} perguntas. Praticaste imenso e aprendeste coisas geniais! Que tal tentares mais uma vez para conseguires pontuação máxima?`;
    }

    if (selectedOpt !== null) {
      const isCorrect = selectedOpt === activeQuestion.correctIndex;
      return isCorrect 
        ? activeQuestion.astronautReaction.correct 
        : activeQuestion.astronautReaction.incorrect;
    }

    return `Pergunta ${currentIdx + 1} de ${quizQuestions.length}! Lê a pergunta com muita atenção. Vais sair-te lindamente, astronauta!`;
  };

  const getCosmoExpression = () => {
    if (quizFinished) return 'proud';
    if (selectedOpt !== null) {
      return selectedOpt === activeQuestion.correctIndex ? 'excited' : 'thinking';
    }
    return 'happy';
  };

  const getScoreStars = () => {
    const stars = [];
    for (let i = 0; i < quizQuestions.length; i++) {
      if (i < answeredNum) {
        stars.push('⭐');
      } else {
        stars.push('⚫');
      }
    }
    return stars.join(' ');
  };

  return (
    <div id="space-quiz-module" className="space-y-8 pb-12">
      {/* Quiz Top Action Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-indigo-950 pb-4">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-display text-sm font-black border-b-4 border-indigo-900 shadow-md transition-all active:translate-y-0.5 cursor-pointer"
        >
          <ArrowLeft size={16} /> Voltar ao Menu
        </button>

        <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2 text-center text-pink-300">
          <BookOpen size={20} className="text-pink-400 animate-pulse" />
          Super Quiz Espacial
        </h3>

        <button
          onClick={handleResetQuiz}
          className="flex items-center gap-1.5 px-3.5 py-2.5 bg-pink-650 hover:bg-pink-550 text-white rounded-xl text-xs font-black font-display border-b-4 border-pink-900 cursor-pointer shadow transition-all active:translate-y-0.5"
          title="Recomeçar o Questionário"
        >
          <RotateCcw size={13} /> Reiniciar
        </button>
      </div>

      {/* Cosmo advice balloon */}
      <CosmoCompanion text={getCosmoAdvice()} expression={getCosmoExpression()} />

      <AnimatePresence mode="wait">
        {!quizFinished ? (
          /* Active Question Frame */
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-[#310c3f]/95 border-4 border-pink-500 rounded-3xl p-6 sm:p-8 relative shadow-[0_8px_0_0_#ec4899,0_15px_30px_rgba(236,72,153,0.15)]"
          >
            {/* Top Index Marker */}
            <div className="flex items-center justify-between border-b border-purple-950 pb-4 mb-6">
              <span className="text-xs font-bold text-pink-350 font-display tracking-widest uppercase">
                Estação de Exame Espacial
              </span>
              <div className="text-xs font-mono bg-[#170520] px-3 py-1 rounded-full border border-pink-500/40 font-bold text-cyan-300">
                PERGUNTA {currentIdx + 1}/{quizQuestions.length}
              </div>
            </div>

            {/* Progress indicators dot chain */}
            <div className="flex gap-2.5 mb-6">
              {quizQuestions.map((q, idx) => {
                const isPassed = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <div
                    key={q.id}
                    className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                      isPassed 
                        ? 'bg-emerald-500 shadow-sm' 
                        : isCurrent 
                          ? 'bg-cyan-400 animate-pulse' 
                          : 'bg-[#1a0624]'
                    }`}
                  />
                );
              })}
            </div>

            {/* Question title */}
            <h4 className="text-xl sm:text-2xl font-black font-display text-white mb-6 leading-tight">
              {activeQuestion.question}
            </h4>

            {/* Options grid selectors list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeQuestion.options.map((opt, oIdx) => {
                const isSelected = selectedOpt === oIdx;
                const isCorrect = oIdx === activeQuestion.correctIndex;
                const showSuccessStyle = selectedOpt !== null && isCorrect;
                const showFailureStyle = selectedOpt !== null && isSelected && !isCorrect;

                return (
                  <motion.button
                    disabled={selectedOpt !== null}
                    key={oIdx}
                    whileHover={{ scale: selectedOpt === null ? 1.02 : 1 }}
                    whileTap={{ scale: selectedOpt === null ? 0.98 : 1 }}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`p-4 rounded-2xl text-left font-display text-sm font-black border-2 select-none flex items-center justify-between gap-4 transition-all ${
                      selectedOpt === null
                        ? 'bg-[#170520] hover:bg-[#20072b]/80 border-pink-500/40 hover:border-pink-500 cursor-pointer text-slate-100'
                        : showSuccessStyle
                          ? 'bg-[#062419] border-emerald-400 text-emerald-300 shadow-md'
                          : showFailureStyle
                            ? 'bg-[#2d0f17] border-rose-500 text-rose-300 shadow-md'
                            : 'bg-[#170520]/40 border-slate-900 text-slate-500 opacity-40 cursor-default'
                    }`}
                  >
                    <span>{opt}</span>
                    
                    {/* Visual icons verification checkboxes */}
                    {selectedOpt !== null && isCorrect && (
                      <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
                    )}
                    {selectedOpt !== null && isSelected && !isCorrect && (
                      <XCircle size={18} className="text-rose-400 flex-shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Detailed Correct Answer Explanation Banner */}
            {selectedOpt !== null && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-slate-950/80 rounded-2xl border border-indigo-950 flex gap-3.5 items-start"
              >
                <div className="p-2 bg-indigo-950 text-indigo-400 rounded-xl mt-0.5">
                  <Award size={18} className="text-yellow-400 animate-spin duration-10000" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-cyan-300 font-display uppercase tracking-wider">Explicação Científica:</h5>
                  <p className="mt-1 text-sm text-slate-300 font-medium font-sans leading-relaxed">
                    {activeQuestion.explanation}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Forward button footer */}
            {selectedOpt !== null && (
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-display text-sm font-black rounded-xl flex items-center gap-1.5 border-b-4 border-indigo-800 shadow-md cursor-pointer active:translate-y-0.5 transition-all"
                >
                  {currentIdx === quizQuestions.length - 1 ? "Ver Resultados" : "Seguinte"} 
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          /* Quiz Results / Diploma Generation Board */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#310c3f] border-4 border-pink-500 rounded-3xl p-6 sm:p-10 text-center space-y-8 shadow-[0_8px_0_0_#ec4899,0_15px_30px_rgba(236,72,153,0.15)]"
          >
            <div className="space-y-3">
              <Award size={64} className="text-yellow-400 mx-auto animate-bounce" />
              <h4 className="text-3xl font-bold font-display text-white tracking-tight">
                Questionário Completo!
              </h4>
              <p className="text-slate-200 text-lg font-sans font-medium">
                Concluíste com sucesso todas as perguntas de astronomia!
              </p>
            </div>

            {/* Score Ring Display */}
            <div className="max-w-xs mx-auto p-6 bg-[#1f0628] rounded-2xl border-2 border-pink-500/30 shadow-inner flex flex-col items-center">
              <span className="text-xs font-bold font-display text-pink-300 uppercase tracking-widest">A tua Pontuação</span>
              <div className="text-5xl font-mono font-bold text-white mt-2 mb-1.5 flex items-baseline justify-center">
                <span className={answeredNum >= Math.ceil(quizQuestions.length * 0.7) ? 'text-emerald-400 animate-pulse' : 'text-slate-100'}>{answeredNum}</span>
                <span className="text-2xl text-purple-400 font-normal">/{quizQuestions.length}</span>
              </div>
              <div className="text-[11px] font-mono tracking-wider">{getScoreStars()}</div>
              
              <p className="text-xs text-slate-350 font-sans font-bold mt-3 text-center">
                {answeredNum === quizQuestions.length 
                  ? "Incrível! Pontuação Espetacular Máxima! 🌟" 
                  : answeredNum >= Math.ceil(quizQuestions.length * 0.6) 
                    ? "Belo trabalho de explorador! Quase perfeito!"
                    : "Tens uma grande caminhada pela frente! Clica para recomeçar."
                }
              </p>
            </div>

            {/* Diploma Generation Panel */}
            <div className="max-w-xl mx-auto space-y-4 pt-4 border-t border-purple-900 bg-[#170520] p-6 rounded-2xl border border-purple-800">
              <h5 className="font-display font-bold text-sm text-yellow-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Sparkles size={14} className="text-yellow-400 animate-spin duration-3000" />
                Desbloqueia o teu Diploma Oficial de Comandante
              </h5>
              <p className="text-xs text-purple-250 leading-relaxed font-sans font-medium">
                Insere o teu primeiro e último nome para redigir o teu diploma personalizado. Podes descarregá-lo ou mostrá-lo ao teu professor/pais!
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Ex: Ana Silva ou Pedro Santos"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  maxLength={30}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#260a31] border-2 border-purple-700 text-white placeholder-purple-400/85 font-sans text-sm focus:outline-none focus:border-pink-500 font-bold shadow-inner"
                />
                <button
                  disabled={!userName.trim()}
                  onClick={() => {
                    playSound(true);
                    setShowGraduation(true);
                  }}
                  className={`px-6 py-3 font-display text-sm font-black rounded-xl transition-all ${
                    userName.trim() 
                      ? 'bg-yellow-400 hover:bg-yellow-300 text-black border-b-4 border-yellow-600 cursor-pointer shadow active:translate-y-0.5' 
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  Gerar Diploma 📜
                </button>
              </div>
            </div>

            {/* Render Graduation Certificate Screen */}
            {showGraduation && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-left bg-stone-50 border-double border-[12px] border-amber-800 p-6 sm:p-10 rounded-2xl shadow-3xl text-stone-900 max-w-2xl mx-auto space-y-6 relative overflow-hidden"
              >
                {/* Vintage watermarks decoration inside diploma */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none text-stone-900">
                  <Orbit size={480} />
                </div>
                
                {/* Fancy top border pattern */}
                <div className="h-2 bg-gradient-to-r from-amber-800 via-amber-600 to-amber-800 rounded-t-sm" />

                <div className="text-center space-y-2">
                  <span className="font-display font-extrabold text-[11px] sm:text-xs text-amber-900 uppercase tracking-widest">Escola Oficial Dos Astro-Exploradores</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-amber-950 tracking-tight">Diploma Espacial</h2>
                  <div className="w-24 h-0.5 bg-amber-800 mx-auto my-1" />
                </div>

                <div className="text-center space-y-4 font-serif">
                  <p className="text-xs sm:text-sm text-stone-600 uppercase tracking-wider italic">Este certificado de excelência é atribuído solenemente a:</p>
                  
                  <h3 className="text-3xl sm:text-4xl font-bold font-display underline text-indigo-950 uppercase tracking-wide">
                    {userName}
                  </h3>

                  <p className="text-sm text-stone-800 leading-relaxed max-w-lg mx-auto italic font-medium">
                    Por ter completado com grande entusiasmo científico todas as missões e demonstrado saber identificar perfeitamente os planetas e estrelas na viagem através do nosso maravilhoso <span className="font-bold">Sistema Solar</span>.
                  </p>
                </div>

                {/* Score and signature blocks */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-stone-300">
                  <div className="text-center space-y-1">
                    <span className="block text-[10px] text-stone-500 uppercase font-sans font-bold">Classificação Final</span>
                    <span className="block font-mono text-xl font-bold text-emerald-950">{answeredNum}/{quizQuestions.length} no Super Quiz</span>
                    <span className="block text-[9px] text-stone-400">Excelente Aproveitamento</span>
                  </div>

                  <div className="text-center space-y-1">
                    <span className="block text-[10px] text-stone-500 uppercase font-sans font-bold">Assinatura Certificada</span>
                    <span className="block font-serif italic text-base font-bold text-amber-900 leading-none">Cosmo o Astro-Guia</span>
                    <div className="w-20 h-0.5 bg-stone-300 mx-auto" />
                    <span className="block text-[9px] text-stone-400 font-sans">Enviado com sucesso em {currentDay}</span>
                  </div>
                </div>

                {/* Print layout recommendation helper */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="text-xs font-sans font-black bg-amber-800 hover:bg-amber-900 text-white px-5 py-2.5 border-b-4 border-amber-955 rounded-xl transition-all cursor-pointer shadow active:translate-y-0.5"
                  >
                    Imprimir Diploma ✉️
                  </button>
                  <span className="block text-[9px] text-stone-500 mt-1 italic">Dica: Configura para 'Guardar como PDF' para guardares o ficheiro!</span>
                </div>
              </motion.div>
            )}

            {/* Back choices block */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                onClick={handleResetQuiz}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-black font-display border-b-4 border-slate-950 cursor-pointer shadow transition-all active:translate-y-0.5 shadow-md"
              >
                Tentar de Novo ✏️
              </button>
              <button
                onClick={onBackToHome}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-black font-display border-b-4 border-indigo-800 cursor-pointer shadow transition-all active:translate-y-0.5 shadow-md"
              >
                Ir para o Menu Principal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
