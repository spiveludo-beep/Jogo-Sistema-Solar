export interface Planet {
  id: string;
  name: string;
  nickname: string;
  colorClass: string; // Tailwind gradient/color class
  bgGlow: string; // Tailwind glow class
  textColor: string;
  order: number;
  realOrder: number; // 1 to 8
  distanceFromSun: string;
  sizeDescription: string;
  yearDuration: string;
  temperatureDescription: string;
  moonsCount: number;
  funFact: string; // Quick splash fact
  curiosities: string[]; // 3 child-friendly detailed curiosities
  emoji: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  astronautReaction: {
    correct: string;
    incorrect: string;
  };
}

export type GameMode = 'home' | 'explore' | 'sort' | 'quiz' | 'diploma';

export interface GameScore {
  quizScore: number;
  quizCompleted: boolean;
  sortingCompleted: boolean;
  planetsExplored: string[]; // IDs of planets already clicked & explored
}
