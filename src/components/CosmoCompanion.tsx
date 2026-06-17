import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Volume2 } from 'lucide-react';

interface CosmoCompanionProps {
  text: string;
  expression?: 'happy' | 'excited' | 'thinking' | 'wink' | 'wave' | 'proud';
  onSpeakPress?: () => void; // Optional text-to-speech or synth check
  position?: 'top' | 'bottom' | 'inline';
}

export const CosmoCompanion: React.FC<CosmoCompanionProps> = ({
  text,
  expression = 'happy',
  onSpeakPress,
  position = 'inline'
}) => {
  const originalSrc = "/src/assets/images/astronaut_on_rocket_1781636828536.jpg";
  const [processedSrc, setProcessedSrc] = useState<string>(originalSrc);

  // Dynamic canvas-based flood fill to make the white background perfectly transparent
  useEffect(() => {
    const img = new Image();
    img.src = originalSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;

      // 1D visited array to keep track of checked pixels
      const visited = new Uint8Array(width * height);
      const queue: number[] = [];

      const isNearWhite = (idx: number) => {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        return r > 225 && g > 225 && b > 225; // Safe threshold for white compression background
      };

      const addPixel = (x: number, y: number) => {
        if (x < 0 || x >= width || y < 0 || y >= height) return;
        const flatIdx = y * width + x;
        if (visited[flatIdx]) return;
        visited[flatIdx] = 1;

        const pxIdx = flatIdx * 4;
        if (isNearWhite(pxIdx)) {
          queue.push(flatIdx);
        }
      };

      // Add all boundary pixels to initiate flood fill from the outer edges
      for (let x = 0; x < width; x++) {
        addPixel(x, 0);
        addPixel(x, height - 1);
      }
      for (let y = 0; y < height; y++) {
        addPixel(0, y);
        addPixel(width - 1, y);
      }

      // Run Breadth-First Search (BFS) to flood fill transparent pixels
      let head = 0;
      while (head < queue.length) {
        const flatIdx = queue[head++];
        const x = flatIdx % width;
        const y = Math.floor(flatIdx / width);

        // Turn this background pixel transparent
        const pxIdx = flatIdx * 4;
        data[pxIdx + 3] = 0;

        // Check 4-connected neighbors
        addPixel(x + 1, y);
        addPixel(x - 1, y);
        addPixel(x, y + 1);
        addPixel(x, y - 1);
      }

      ctx.putImageData(imageData, 0, 0);
      try {
        setProcessedSrc(canvas.toDataURL());
      } catch (e) {
        setProcessedSrc(originalSrc); // fallback to original if blocked by browser settings
      }
    };
  }, [originalSrc]);

  // Simple helper to synthesized pt-PT read aloud for accessibility if supported
  const speakText = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-PT';
      utterance.rate = 1.2;
      utterance.pitch = 1.6;
      window.speechSynthesis.speak(utterance);
    }
    if (onSpeakPress) onSpeakPress();
  };

  return (
    <div className={`flex items-center gap-6 ${position === 'top' ? 'flex-col-reverse' : 'flex-col md:flex-row'} max-w-3xl mx-auto p-4`}>
      {/* Cosmo Character Drawing / Animated Colorful Complete Astronaut Image */}
      <motion.div
        animate={{
          y: [-8, 8, -8],
          rotate: [-2, 2, -2]
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut"
        }}
        className="relative flex-shrink-0 cursor-pointer select-none group"
        onClick={speakText}
      >
        {/* Floating shadow matching the rocket's outline under the character */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-36 h-3 bg-indigo-950/80 rounded-full blur-md animate-pulse" />

        <div className="relative">
          <img 
            src={processedSrc} 
            alt="Cosmo" 
            referrerPolicy="no-referrer"
            className="w-48 h-48 sm:w-64 sm:h-64 object-contain transition-transform duration-300 hover:scale-110 drop-shadow-[0_14px_28px_rgba(251,191,36,0.35)]"
          />
        </div>
      </motion.div>

      {/* Speech bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        key={text}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="relative flex-1 bg-white text-black border-4 border-blue-400 p-6 rounded-3xl shadow-2xl transition-all"
      >
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-blue-400 to-pink-500 rounded-t-[20px]" />
        
        {/* Speech tail arrow pointing to the left toward the astronaut */}
        <div className="hidden md:block absolute top-1/2 -left-3 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-[12px] border-r-blue-400" />
        <div className="hidden md:block absolute top-1/2 -left-2.5 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-[10px] border-r-white" />

        {/* Speak button and Text */}
        <div className="flex items-start gap-3">
          <button
            onClick={speakText}
            className="mt-1 flex-shrink-0 p-2.5 bg-blue-500 hover:bg-blue-600 border-b-4 border-blue-700 text-white rounded-xl shadow-md cursor-pointer transition-all active:translate-y-0.5 group"
            title="Ouvir Cosmo a falar"
          >
            <Volume2 size={18} className="group-hover:animate-bounce" />
          </button>
          
          <div className="flex-1">
            <p className="mt-1 text-slate-800 text-[15px] sm:text-base leading-relaxed font-sans font-medium">
              {text}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
