import { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Qual é o planeta mais quente do nosso Sistema Solar?",
    options: ["Mercúrio", "Vénus", "Marte", "Sol"],
    correctIndex: 1,
    explanation: "Vénus é o planeta mais quente! Ele está coberto por nuvens super espessas que retêm o calor do Sol, funcionando como uma estufa gigante que derrete até chumbo!",
    astronautReaction: {
      correct: "Incrível! Descobriste o segredo da estufa de Vénus! 🌡️🔥",
      incorrect: "Quase! Mercúrio está mais perto do Sol, mas Vénus é o mais quente por causa das suas nuvens espessas que guardam o calor!"
    }
  },
  {
    id: 2,
    question: "Qual é o planeta conhecido como o Planeta Vermelho?",
    options: ["Terra", "Saturno", "Marte", "Neptuno"],
    correctIndex: 2,
    explanation: "Marte é o Planeta Vermelho! Ele tem essa cor avermelhada porque o seu solo é composto por ferro que enferrujou ao longo do tempo.",
    astronautReaction: {
      correct: "Espetacular! Sabias que temos robôs rovers a passear por lá agora mesmo? 🤖🔴",
      incorrect: "Ups! Lembra-te de que a cor vermelha de Marte parece ferrugem a flutuar no espaço!"
    }
  },
  {
    id: 3,
    question: "Qual é o planeta gigante famoso pelos seus espetaculares anéis brilhantes?",
    options: ["Saturno", "Júpiter", "Urano", "Mercúrio"],
    correctIndex: 0,
    explanation: "Saturno é o Rei dos Anéis! Embora outros planetas gigantes tenham anéis finos, os de Saturno são gigantes e brilhantes, feitos de gelo e pedrinhas refletoras.",
    astronautReaction: {
      correct: "Fantástico! Os anéis de Saturno parecem uma pista de gelo cósmica em órbita! 💍✨",
      incorrect: "Não foi bem esse. Outros também têm anéis, mas Saturno é quem tem os maiores e mais brilhantes do Sistema Solar!"
    }
  },
  {
    id: 4,
    question: "O que é o Sol, que fica mesmo no centro do nosso Sistema Solar?",
    options: ["Um planeta gigante", "Um asteroide", "Uma estrela", "Uma nave espacial"],
    correctIndex: 2,
    explanation: "O Sol é uma estrela! É uma bola gigante de gás a arder que brilha e envia luz e calor para todos os planetas do nosso sistema.",
    astronautReaction: {
      correct: "Exato! Sem o Sol, a nossa Terra seria uma pedra gelada e escura no espaço profundo! ☀️💛",
      incorrect: "Hum! O Sol parece planetário pelo seu formato redondo, mas na verdade é uma estrela brilhante como as que vês à noite!"
    }
  },
  {
    id: 5,
    question: "Qual é o planeta mais pequenino e que dá a volta ao Sol mais rapidamente?",
    options: ["Neptuno", "Terra", "Mercúrio", "Júpiter"],
    correctIndex: 2,
    explanation: "Mercúrio é o mais pequenino e rápido! Ele está tão perto do Sol que a sua órbita dura apenas 88 dias terrestres.",
    astronautReaction: {
      correct: "Boa! Mercúrio voa em torno do Sol como um autêntico foguetão! 🚀💨",
      incorrect: "Estiveste perto! Júpiter é o maior de todos e Neptuno demora 165 anos a dar uma única volta!"
    }
  },
  {
    id: 6,
    question: "A Lua é...",
    options: ["Um pequeno planeta vizinho", "O satélite natural da Terra", "Uma estrela bebé", "Uma lâmpada espacial gigante"],
    correctIndex: 1,
    explanation: "A Lua é o satélite natural do nosso planeta Terra! Ela não tem luz própria, mas brilha no céu iluminada pela luz do Sol à medida que gira à nossa volta.",
    astronautReaction: {
      correct: "Fabuloso! A Lua acompanha e protege a Terra, para além de controlar as marés dos oceanos! 🌕🏽",
      incorrect: "Não é bem um planeta. A Lua gira à volta da Terra e ajuda a iluminar as nossas noites. É o nosso satélite natural!"
    }
  },
  {
    id: 7,
    question: "O movimento de rotação (quando a Terra gira sobre si mesma) dá origem a quê?",
    options: ["Às quatro estações do ano", "Aos blocos de gelo do pólo", "Ao dia e à noite", "Aos eclipses solares"],
    correctIndex: 2,
    explanation: "O movimento de rotação cria o dia e a noite! Enquanto a Terra roda, a metade virada para o Sol fica iluminada (dia), enquanto a outra metade fica na sombra (noite).",
    astronautReaction: {
      correct: "Excelente! Sabias que a Terra demora exatamente 24 horas a dar uma volta sobre si mesma? 🌍🎠",
      incorrect: "Ups! Lembra-te do pião a dar voltas: a parte virada para a luz da sala fica de dia e o lado oposto fica de noite."
    }
  },
  {
    id: 8,
    question: "A Terra viaja à volta do Sol numa grande órbita que demora 365 dias (um ano inteiro). Como se chama este movimento?",
    options: ["Movimento de Rotação", "Movimento de Translação", "Super Voo Cósmico", "Gravidade Zero"],
    correctIndex: 1,
    explanation: "Chama-se movimento de translação! É a longa viagem orbital da Terra à volta do Sol que, juntamente com a inclinação da Terra, define as quatro estações do ano.",
    astronautReaction: {
      correct: "Incrível! Compreendeste tudo sobre a translação! É uma longa jornada com as estações (Primavera, Verão, Outono, Inverno) pelo caminho! ☀️❄️",
      incorrect: "Hum! Divertido, mas o movimento de rotação faz a Terra girar sobre si mesma, enquanto a Translação é a viagem à volta do Sol!"
    }
  }
];
