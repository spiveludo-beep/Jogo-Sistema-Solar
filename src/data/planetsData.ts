import { Planet } from '../types';

export const planetsData: Planet[] = [
  {
    id: "mercurio",
    name: "Mercúrio",
    nickname: "O Mensageiro Veloz",
    colorClass: "from-gray-400 to-amber-800",
    bgGlow: "shadow-[0_0_35px_rgba(156,163,175,0.6)]",
    textColor: "text-amber-300",
    order: 1,
    realOrder: 1,
    distanceFromSun: "58 milhões de km",
    sizeDescription: "4.879 km (O mais pequenino!)",
    yearDuration: "88 dias (Dá a volta super rápido!)",
    temperatureDescription: "Extremo! Queima de dia (430°C) e gela de noite (-180°C)",
    moonsCount: 0,
    funFact: "É o planeta mais próximo do Sol, mas não é o mais quente!",
    curiosities: [
      "Se vivesses em Mercúrio, terias um aniversário a cada 3 meses terrestres!",
      "Tem o nome do mensageiro dos deuses romanos devido à rapidez com que se move no céu.",
      "Praticamente não tem atmosfera, por isso o céu lá é sempre preto, mesmo durante o dia!"
    ],
    emoji: "🪐" // Custom vector-like styles will be used in React
  },
  {
    id: "venus",
    name: "Vénus",
    nickname: "O Farol do Céu",
    colorClass: "from-amber-300 via-orange-400 to-yellow-600",
    bgGlow: "shadow-[0_0_35px_rgba(251,146,60,0.8)]",
    textColor: "text-orange-300",
    order: 2,
    realOrder: 2,
    distanceFromSun: "108 milhões de km",
    sizeDescription: "12.104 km (Quase do tamanho da Terra!)",
    yearDuration: "225 dias terrestres",
    temperatureDescription: "Derrete chumbo! É o mais quente (465°C constantes!)",
    moonsCount: 0,
    funFact: "É o planeta mais quente do Sistema Solar por causa da sua estufa de gases!",
    curiosities: [
      "Brilha tanto que às vezes parece uma estrela brilhante e chamamos-lhe 'Estrela d'Alva'!",
      "Roda ao contrário de quase todos os outros planetas. Lá, o Sol nasce no Oeste!",
      "Um dia em Vénus dura mais do que um ano inteiro no próprio planeta!"
    ],
    emoji: "🟡"
  },
  {
    id: "terra",
    name: "Terra",
    nickname: "O Nosso Planeta Azul",
    colorClass: "from-blue-400 via-emerald-400 to-sky-700",
    bgGlow: "shadow-[0_0_35px_rgba(56,189,248,0.7)]",
    textColor: "text-emerald-300",
    order: 3,
    realOrder: 3,
    distanceFromSun: "150 milhões de km (A distância ideal!)",
    sizeDescription: "12.742 km",
    yearDuration: "365 dias (E 6 horas!)",
    temperatureDescription: "Agradável! Média de 15°C (Perfeito para a vida!)",
    moonsCount: 1,
    funFact: "É o único planeta conhecido até hoje que abriga seres vivos e água líquida!",
    curiosities: [
      "Mais de 70% da superfície do nosso planeta está coberta por água azul dos oceanos.",
      "A nossa atmosfera protege-nos de raios perigosos e de pequenos asteroides que colidem connosco.",
      "A Terra viaja a mais de 100.000 quilómetros por hora pelo espaço sem tu sentires nada!"
    ],
    emoji: "🌍"
  },
  {
    id: "marte",
    name: "Marte",
    nickname: "O Planeta Vermelho",
    colorClass: "from-red-500 via-orange-600 to-red-800",
    bgGlow: "shadow-[0_0_35px_rgba(239,68,68,0.7)]",
    textColor: "text-red-300",
    order: 4,
    realOrder: 4,
    distanceFromSun: "228 milhões de km",
    sizeDescription: "6.779 km (Metade do tamanho da Terra)",
    yearDuration: "687 dias terrestres (Quase o dobro da Terra!)",
    temperatureDescription: "Frio! Média de -62°C (Leva um casaco bem quente!)",
    moonsCount: 2,
    funFact: "É muito vermelho por causa da ferrugem de ferro que cobre todo o seu solo!",
    curiosities: [
      "Tem o maior vulcão do Sistema Solar, o 'Monte Olimpo', que é 3 vezes mais alto que o Monte Everest!",
      "Neste momento, temos pequenos robôs (rovers como o Curiosity) a passear lá e a tirar fotografias!",
      "A gravidade lá é menor: se dessses um salto lá, conseguirias saltar 3 vezes mais alto do que na Terra!"
    ],
    emoji: "🔴"
  },
  {
    id: "jupiter",
    name: "Júpiter",
    nickname: "O Gigante Protetor",
    colorClass: "from-amber-200 via-orange-300 to-amber-900",
    bgGlow: "shadow-[0_0_40px_rgba(253,186,116,0.6)]",
    textColor: "text-amber-200",
    order: 5,
    realOrder: 5,
    distanceFromSun: "778 milhões de km",
    sizeDescription: "139.820 km (Cabem lá dentro mais de 1300 Terras!)",
    yearDuration: "12 anos terrestres (Demora a dar a sua órbita!)",
    temperatureDescription: "Muito frio exterior, cerca de -108°C",
    moonsCount: 95, // Updated standard count
    funFact: "É o maior planeta de todos e funciona como um escudo contra asteroides!",
    curiosities: [
      "Tem uma famosa 'Grande Mancha Vermelha' que é, na verdade, uma tempestade gigante maior que a Terra, a soprar há mais de 300 anos!",
      "Roda tão rápido sobre si mesmo que um dia lá dura apenas 10 horas!",
      "Tem tantas luas que parece um mini-sistema solar autónomo! Quatro delas são gigantes e foram vistas por Galileu."
    ],
    emoji: "🪐"
  },
  {
    id: "saturno",
    name: "Saturno",
    nickname: "O Rei dos Anéis",
    colorClass: "from-yellow-200 via-amber-400 to-yellow-800",
    bgGlow: "shadow-[0_0_40px_rgba(253,224,71,0.5)]",
    textColor: "text-yellow-200",
    order: 6,
    realOrder: 6,
    distanceFromSun: "1.400 milhões de km",
    sizeDescription: "116.460 km (O segundo maior!)",
    yearDuration: "29 anos terrestres",
    temperatureDescription: "Extremamente frio, cerca de -139°C",
    moonsCount: 146, // Updated count
    funFact: "É famoso pelos seus anéis espetaculares feitos de gelo e rocha brilhante!",
    curiosities: [
      "É tão leve e feito de gás que, se encontrássemos uma banheira gigante o suficiente, ele conseguiria flutuar na água!",
      "Os seus magníficos anéis têm quilómetros de largura, mas são super fininhos, com apenas alguns metros de espessura!",
      "Tem chuvas de diamantes no seu interior profundo devido à enorme pressão atmosférica!"
    ],
    emoji: "🪐"
  },
  {
    id: "urano",
    name: "Urano",
    nickname: "O Gigante Gelado",
    colorClass: "from-cyan-300 via-teal-400 to-sky-700",
    bgGlow: "shadow-[0_0_35px_rgba(34,211,238,0.6)]",
    textColor: "text-cyan-300",
    order: 7,
    realOrder: 7,
    distanceFromSun: "2.870 milhões de km",
    sizeDescription: "50.724 km",
    yearDuration: "84 anos terrestres (Uma vida inteira!)",
    temperatureDescription: "Gélido! É o planeta mais frio de todos, até -224°C",
    moonsCount: 28,
    funFact: "Roda totalmente de lado, parecendo uma bola a rolar à volta do Sol!",
    curiosities: [
      "É de cor azul-turquesa brilhante por causa de um gás chamado metano.",
      "Devido à sua inclinação louca, tem verões e invernos que duram 42 anos contínuos sob a luz direta ou a escuridão!",
      "Tem também anéis finos e escuros, e cheira mal no topo das nuvens (cheira a ovos podres devido ao sulfureto de hidrogénio)!"
    ],
    emoji: "🪐"
  },
  {
    id: "neptuno",
    name: "Neptuno",
    nickname: "O Planeta dos Ventos",
    colorClass: "from-blue-600 via-indigo-500 to-blue-900",
    bgGlow: "shadow-[0_0_35px_rgba(37,99,235,0.7)]",
    textColor: "text-sky-300",
    order: 8,
    realOrder: 8,
    distanceFromSun: "4.500 milhões de km (Super distante!)",
    sizeDescription: "49.244 km",
    yearDuration: "165 anos terrestres (Demora imenso tempo!)",
    temperatureDescription: "Congelante! Cerca de -200°C constantes",
    moonsCount: 16,
    funFact: "Tem os ventos mais rápidos e violentos de todo o Sistema Solar!",
    curiosities: [
      "Os ventos em Neptuno sopram a mais de 2.100 km/h – mais rápidos que a velocidade de um avião a jato!",
      "Como está tão longe de nós, foi o primeiro planeta a ser descoberto usando contas de matemática antes de ser visto por telescópio!",
      "É de um azul profundo encantador e tem uma tempestade gigantesca chamada 'Grande Mancha Escura'."
    ],
    emoji: "🔵"
  }
];
