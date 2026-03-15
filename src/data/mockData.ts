export interface Story {
  id: string;
  title: string;
  author: string;
  synopsis: string;
  coverUrl: string;
  genre: string;
  tags: string[];
  rating: number;
  readTime: string;
  readers: number;
  seasons: Season[];
  dominantColor: string; // HSL for ambient mood
}

export interface Season {
  id: string;
  number: number;
  title: string;
  description: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  content: string;
  status: "draft" | "published";
  readTime: string;
}

const loremContent = `A noite caiu sobre a cidade como um véu de seda negra. As luzes dos postes piscavam em ritmo irregular, como se tentassem transmitir uma mensagem em código. Elena caminhava pelas ruas vazias, seus passos ecoando contra o asfalto molhado pela chuva recente.

Ela sabia que estava sendo seguida. Não era paranoia — era instinto, aguçado por anos de treinamento e por uma vida inteira de fugas. O som atrás dela era sutil demais para um transeunte casual: passos calculados, respiração controlada, a ausência deliberada de ruído.

"Você pode parar de se esconder," disse ela, sem se virar. Sua voz cortou o silêncio como uma lâmina. "Sei que está aí desde a estação."

Uma risada baixa emergiu das sombras. "Sempre tão perceptiva, Elena. É por isso que eles a querem de volta."

Ela finalmente se virou. O homem que emergiu da escuridão era alto, com olhos que refletiam a luz dos postes como dois fragmentos de âmbar. Vestia um sobretudo escuro que se confundia com a noite ao seu redor.

"Marcus," ela disse, o nome carregando o peso de mil memórias. "Pensei que estivesse morto."

"A morte é relativa," ele respondeu, dando um passo à frente. "Especialmente no nosso ramo de trabalho."

O vento soprou entre eles, carregando o cheiro de chuva e concreto. Elena sentiu o peso da arma escondida sob seu casaco, mas não fez menção de alcançá-la. Se Marcus quisesse matá-la, já teria feito.

"O que quer?" perguntou ela.

"O mesmo que você. A verdade sobre o Projeto Fênix."

As palavras pairaram no ar como fumaça. Elena sentiu um arrepio percorrer sua espinha — não de medo, mas de antecipação. Há cinco anos ela procurava respostas sobre aquela noite. A noite em que tudo mudou.

"E por que eu confiaria em você?" ela perguntou, cruzando os braços.

Marcus sorriu — um sorriso que não alcançava seus olhos. "Porque eu tenho algo que você precisa." Ele estendeu a mão, revelando um pequeno pen drive prateado. "Os arquivos originais. Tudo que eles tentaram apagar."

Elena olhou para o dispositivo, depois para Marcus. Na luz fraca dos postes, ela podia ver as cicatrizes que marcavam seu rosto — mapas de uma vida vivida nas fronteiras do perigo.

"Se isso for uma armadilha—"

"Não é. Mas temos pouco tempo. Eles sabem que estou vivo, e quando descobrirem que vim até você..." Ele deixou a frase no ar, o significado implícito pesando mais que qualquer conclusão.

Elena tomou sua decisão em um segundo. Pegou o pen drive e guardou no bolso interno do casaco. "Conheço um lugar seguro. Siga-me."

Juntos, eles desapareceram na noite, dois fantasmas caminhando entre as sombras de uma cidade que dormia, inconsciente dos segredos que se desenrolavam em suas artérias escuras.`;

export const stories: Story[] = [
  {
    id: "1",
    title: "Sombras de Fênix",
    author: "Marina Alves",
    synopsis: "Uma ex-agente descobre que o programa secreto que destruiu sua vida nunca foi encerrado. Agora, com antigos aliados e novos inimigos, ela precisa desenterrar a verdade antes que a verdade a destrua.",
    coverUrl: "",
    genre: "Thriller",
    tags: ["espionagem", "suspense", "ação"],
    rating: 4.8,
    readTime: "12 min",
    readers: 14200,
    dominantColor: "0 60% 20%",
    seasons: [
      {
        id: "s1",
        number: 1,
        title: "A Revelação",
        description: "Elena descobre que o passado nunca ficou para trás.",
        episodes: [
          { id: "e1", number: 1, title: "Cinzas", content: loremContent, status: "published", readTime: "12 min" },
          { id: "e2", number: 2, title: "O Retorno", content: loremContent, status: "published", readTime: "15 min" },
          { id: "e3", number: 3, title: "Fantasmas", content: loremContent, status: "published", readTime: "10 min" },
          { id: "e4", number: 4, title: "Código Vermelho", content: loremContent, status: "published", readTime: "14 min" },
        ],
      },
      {
        id: "s2",
        number: 2,
        title: "A Caçada",
        description: "Com os arquivos em mãos, Elena se torna a caçada.",
        episodes: [
          { id: "e5", number: 1, title: "Fuga", content: loremContent, status: "published", readTime: "13 min" },
          { id: "e6", number: 2, title: "Alianças", content: loremContent, status: "draft", readTime: "11 min" },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Crônicas do Último Reino",
    author: "Rafael Mendes",
    synopsis: "Em um mundo onde a magia está desaparecendo, uma jovem guerreira descobre que carrega o último fragmento de poder capaz de salvar — ou destruir — tudo o que resta.",
    coverUrl: "",
    genre: "Fantasia",
    tags: ["magia", "aventura", "épico"],
    rating: 4.6,
    readTime: "18 min",
    readers: 23400,
    dominantColor: "260 50% 20%",
    seasons: [
      {
        id: "s3",
        number: 1,
        title: "O Despertar",
        description: "Lyra descobre seus poderes em meio ao caos.",
        episodes: [
          { id: "e7", number: 1, title: "A Marca", content: loremContent, status: "published", readTime: "18 min" },
          { id: "e8", number: 2, title: "O Exílio", content: loremContent, status: "published", readTime: "16 min" },
          { id: "e9", number: 3, title: "Sangue e Cristal", content: loremContent, status: "published", readTime: "20 min" },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Frequência Zero",
    author: "Camila Duarte",
    synopsis: "Um engenheiro de som descobre que certas frequências podem abrir portais para dimensões paralelas. Mas cada travessia tem um preço que ninguém está preparado para pagar.",
    coverUrl: "",
    genre: "Ficção Científica",
    tags: ["sci-fi", "dimensões", "mistério"],
    rating: 4.9,
    readTime: "14 min",
    readers: 8900,
    dominantColor: "200 60% 15%",
    seasons: [
      {
        id: "s4",
        number: 1,
        title: "O Sinal",
        description: "Daniel encontra algo que não deveria existir.",
        episodes: [
          { id: "e10", number: 1, title: "Ruído Branco", content: loremContent, status: "published", readTime: "14 min" },
          { id: "e11", number: 2, title: "A Fenda", content: loremContent, status: "published", readTime: "16 min" },
        ],
      },
    ],
  },
  {
    id: "4",
    title: "Jardim de Vidro",
    author: "Beatriz Santos",
    synopsis: "Em uma São Paulo distópica, uma botânica clandestina cultiva as últimas plantas reais em um mundo dominado por vegetação sintética. Quando o governo descobre seu jardim secreto, ela precisa escolher entre fugir ou lutar.",
    coverUrl: "",
    genre: "Distopia",
    tags: ["distopia", "resistência", "natureza"],
    rating: 4.7,
    readTime: "11 min",
    readers: 11600,
    dominantColor: "140 40% 15%",
    seasons: [
      {
        id: "s5",
        number: 1,
        title: "Raízes",
        description: "Flora descobre o custo de manter a natureza viva.",
        episodes: [
          { id: "e12", number: 1, title: "Sementes", content: loremContent, status: "published", readTime: "11 min" },
          { id: "e13", number: 2, title: "Luz Artificial", content: loremContent, status: "published", readTime: "13 min" },
          { id: "e14", number: 3, title: "A Colheita", content: loremContent, status: "published", readTime: "12 min" },
        ],
      },
    ],
  },
  {
    id: "5",
    title: "O Protocolo Lázaro",
    author: "Thiago Ferreira",
    synopsis: "Um detetive investiga uma série de assassinatos onde todas as vítimas foram declaradas mortas anos antes. A linha entre vida e morte nunca foi tão tênue.",
    coverUrl: "",
    genre: "Mistério",
    tags: ["detetive", "sobrenatural", "noir"],
    rating: 4.5,
    readTime: "15 min",
    readers: 19800,
    dominantColor: "270 40% 15%",
    seasons: [
      {
        id: "s6",
        number: 1,
        title: "Os Mortos-Vivos",
        description: "Cada corpo conta uma história impossível.",
        episodes: [
          { id: "e15", number: 1, title: "Obituário", content: loremContent, status: "published", readTime: "15 min" },
          { id: "e16", number: 2, title: "Ressurreição", content: loremContent, status: "published", readTime: "13 min" },
        ],
      },
    ],
  },
  {
    id: "6",
    title: "Cartas para Ninguém",
    author: "Juliana Costa",
    synopsis: "Uma jovem encontra uma caixa de cartas de amor escritas por sua avó — cartas que revelam uma vida dupla, um amor proibido e um segredo que pode destruir sua família.",
    coverUrl: "",
    genre: "Drama",
    tags: ["romance", "família", "segredos"],
    rating: 4.4,
    readTime: "9 min",
    readers: 7300,
    dominantColor: "30 50% 20%",
    seasons: [
      {
        id: "s7",
        number: 1,
        title: "As Cartas",
        description: "Cada carta revela uma camada do passado.",
        episodes: [
          { id: "e17", number: 1, title: "A Caixa", content: loremContent, status: "published", readTime: "9 min" },
          { id: "e18", number: 2, title: "Primavera de 1962", content: loremContent, status: "published", readTime: "10 min" },
        ],
      },
    ],
  },
];

export const featuredStories = stories.slice(0, 3);
export const trendingStories = [...stories].sort((a, b) => b.readers - a.readers);
export const newStories = [...stories].reverse();

export function getStoryById(id: string): Story | undefined {
  return stories.find(s => s.id === id);
}
