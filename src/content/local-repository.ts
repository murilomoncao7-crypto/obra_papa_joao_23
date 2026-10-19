import type {
  Activity,
  GalleryImage,
  HomePageContent,
  InstitutionalPage,
  SiteSettings,
} from "./types";
import type { ContentRepository, EventQuery, NewsQuery } from "./repository";
import { localEvents } from "./events";
import { localNews } from "./news";

const legacyImage = (
  id: string,
  src: string,
  width: number,
  height: number,
  alt: string,
  caption: string,
  variants?: GalleryImage["variants"],
): GalleryImage => ({
  id,
  src,
  width,
  height,
  alt,
  caption,
  status: "published",
  variants,
});

const newPhoto = (
  id: string,
  width: number,
  height: number,
  alt: string,
  caption: string,
): GalleryImage => legacyImage(id, `/images/obra-2026/${id}.webp`, width, height, alt, caption);

const newPhotos = {
  roses: newPhoto(
    "atividade-rosas",
    1200,
    1600,
    "Crianças segurando rosas feitas durante uma atividade educativa",
    "Criatividade e expressão em atividade coletiva.",
  ),
  yellowSeptember: newPhoto(
    "atividade-setembro-amarelo",
    1600,
    1200,
    "Grupo de crianças reunido no pátio durante uma atividade do Setembro Amarelo",
    "Atividade de convivência no pátio da instituição.",
  ),
  fluteBanner: newPhoto(
    "banner-flauta-doce",
    1440,
    1440,
    "Cartaz da apresentação musical de flauta doce da Obra Papa João XXIII",
    "Apresentação musical de flauta doce.",
  ),
  playOne: newPhoto(
    "brincadeiras-1",
    1600,
    1200,
    "Crianças e educadores sentados em roda durante uma atividade recreativa",
    "Brincadeiras, escuta e convivência.",
  ),
  playTwo: newPhoto(
    "brincadeiras-2",
    1200,
    1600,
    "Crianças participando de uma atividade em grupo dentro da instituição",
    "Aprendizado em grupo.",
  ),
  karateOne: newPhoto(
    "karate-1",
    1600,
    1066,
    "Professor orientando crianças durante uma aula de karatê",
    "Karatê: concentração, equilíbrio e autocontrole.",
  ),
  groupWide: newPhoto(
    "criancas-e-equipe",
    1600,
    719,
    "Crianças, educadores e equipe reunidos na instituição",
    "Crianças e equipe da Obra Papa João XXIII.",
  ),
  groupSquare: newPhoto(
    "equipe-e-criancas",
    1600,
    1600,
    "Equipe e crianças reunidas no parque da instituição",
    "Um trabalho construído em comunidade.",
  ),
  facade: newPhoto(
    "fachada",
    1600,
    533,
    "Fachada da Obra de Assistência Social Papa João XXIII em Floresta",
    "A sede da instituição em Floresta, Paraná.",
  ),
  theaterTwo: newPhoto(
    "teatro-ilustrativa-2",
    1200,
    1600,
    "Grupo de crianças caracterizadas para uma apresentação teatral",
    "Expressão artística e protagonismo.",
  ),
  theaterPortrait: newPhoto(
    "teatro-ilustrativa",
    1200,
    1600,
    "Jovem caracterizada durante uma apresentação teatral",
    "Apresentação teatral.",
  ),
  musicRehearsal: newPhoto(
    "musica-ensaio-flauta",
    1600,
    1066,
    "Crianças ensaiando flauta doce com educadores",
    "Ensaio de flauta doce.",
  ),
  musicStage: newPhoto(
    "musica-flauta-doce",
    1600,
    900,
    "Apresentação de flauta doce no palco",
    "Música que reúne e transforma.",
  ),
  musicAudience: newPhoto(
    "musica-publico-flauta",
    1600,
    1068,
    "Público acompanhando a apresentação musical de flauta doce",
    "A comunidade presente na apresentação musical.",
  ),
  history: newPhoto(
    "papa-joao-xxiii",
    1536,
    1024,
    "Composição histórica sobre Padre Antonio Luigi Martinelli e a Obra Papa João XXIII",
    "Memória e missão da Obra Papa João XXIII.",
  ),
  magazineOne: newPhoto(
    "revista-1",
    1256,
    1600,
    "Primeira página de reportagem sobre a missão da Obra Papa João XXIII",
    "Registro da trajetória institucional.",
  ),
  magazineTwo: newPhoto(
    "revista-2",
    1256,
    1600,
    "Segunda página de reportagem sobre a Obra Papa João XXIII",
    "Histórias e pessoas que constroem a instituição.",
  ),
  theaterOne: newPhoto(
    "teatro-1",
    1200,
    1600,
    "Jovem caracterizada em cena durante uma apresentação teatral",
    "Teatro e expressão.",
  ),
  unionOne: newPhoto(
    "uniao-1",
    1600,
    1200,
    "Crianças e educadores reunidos em uma dinâmica no pátio",
    "União e convivência no cotidiano.",
  ),
  unionTwo: newPhoto(
    "uniao-2",
    1600,
    1204,
    "Árvore plantada no pátio interno da instituição",
    "Cuidado que cria raízes.",
  ),
} as const;

const siteSettings: SiteSettings = {
  id: "site-settings",
  name: "Obra de Assistência Social Papa João XXIII",
  shortName: "Obra Papa João XXIII",
  description:
    "Associação civil filantrópica, sem fins lucrativos, que presta serviços à comunidade na área da Assistência Social.",
  navigation: [],
  contacts: [
    {
      id: "phone",
      type: "phone",
      label: "Telefone",
      value: "(44) 3236-1231",
      href: "tel:+554432361231",
      status: "published",
    },
    {
      id: "email",
      type: "email",
      label: "E-mail",
      value: "oaspfloresta@gmail.com",
      href: "mailto:oaspfloresta@gmail.com",
      status: "published",
    },
    {
      id: "address",
      type: "address",
      label: "Localização",
      value: "Rua Cidade de Bréscia — Centro — Floresta — Paraná, CEP 87.120-023",
      status: "published",
    },
    {
      id: "map",
      type: "map",
      label: "Mapa",
      value: "Abrir localização no mapa",
      href: "https://www.google.com/maps/place/Obra+de+Assist%C3%AAncia+Social+Papa+Jo%C3%A3o+XXIII/@-23.6175335,-52.0862525,17z/data=!3m1!4b1!4m6!3m5!1s0x94f3d37240000001:0xd6f4b62ec32df7bf!8m2!3d-23.6175335!4d-52.0836776!16s%2Fg%2F1wf39sbb?entry=ttu",
      status: "published",
    },
  ],
  socialLinks: [
    {
      id: "facebook",
      network: "facebook",
      label: "Facebook",
      href: "https://www.facebook.com/obraoaspjxxiii",
      status: "published",
    },
    {
      id: "instagram",
      network: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/obraassistencial/",
      status: "published",
    },
  ],
};

const homePage: HomePageContent = {
  hero: {
    title: "Obra Papa João XXIII",
    summary: "Acolhemos crianças e adolescentes com educação, formação e",
    summaryAccent: "convivência para que construam um futuro com mais possibilidades.",
    image: newPhotos.yellowSeptember,
    primaryAction: {
      id: "learn-more",
      label: "Conheça a Obra",
      href: "/instituicao",
    },
    secondaryAction: {
      id: "help",
      label: "Como ajudar",
      href: "/como-ajudar",
    },
  },
  quickInformation: [
    {
      id: "location",
      label: "Localização",
      value: "Floresta — Paraná",
      href: "/contato",
    },
    {
      id: "contact",
      label: "Contato",
      value: "(44) 3236-1231",
      href: "tel:+554432361231",
    },
    {
      id: "participation",
      label: "Como participar",
      value: "Doações, eventos e divulgação",
      href: "/como-ajudar",
    },
  ],
  institution: {
    title: "Uma história que acolhe e transforma",
    summary:
      "A instituição atua na Assistência Social e atende crianças e adolescentes de 6 a 16 anos, com prioridade para situações de vulnerabilidade social.",
    history:
      "Em 3 de junho de 1963, Padre Antonio Luigi Martinelli criou em Floresta o Orfanato dedicado ao Papa João XXIII. A missão se transformou ao longo das décadas e permanece viva no Serviço de Convivência e Fortalecimento de Vínculos.",
    foundationYear: "1963",
    foundationNote: "o início de uma missão de cuidado em Floresta",
  },
  activityIntroduction:
    "Experiências que unem cultura, movimento, criatividade e convivência para cada criança descobrir novas possibilidades.",
  participation: {
    title: "Sua participação coloca mais sonhos em movimento",
    summary:
      "Doações, presença nos eventos e divulgação das ações ajudam a manter vivas as oportunidades oferecidas pela Obra.",
    options: ["Doações", "Participação em eventos", "Divulgação das ações"],
  },
  galleryIntroduction:
    "Um retrato vivo dos encontros, aprendizados e talentos que fazem parte do cotidiano da instituição.",
  locationTitle: "Estamos em Floresta, Paraná",
  gallery: [
    newPhotos.musicRehearsal,
    newPhotos.karateOne,
    newPhotos.theaterTwo,
    newPhotos.roses,
    newPhotos.groupWide,
    newPhotos.unionOne,
    newPhotos.musicStage,
    newPhotos.groupSquare,
    newPhotos.facade,
    newPhotos.playOne,
    newPhotos.magazineOne,
    newPhotos.history,
  ],
};

const institutionalPages: InstitutionalPage[] = [
  {
    id: "institution",
    slug: "instituicao",
    title: "Instituição",
    summary:
      "Uma associação civil filantrópica que acolhe, protege e promove o bem-estar de crianças e adolescentes em Floresta.",
    content: [
      "A Obra de Assistência Social Papa João XXIII é uma associação civil filantrópica, sem fins lucrativos, que atua na área da Assistência Social, desenvolvendo ações voltadas ao atendimento, acolhimento, proteção e promoção do bem-estar de crianças e adolescentes, além de proporcionar um ambiente de convivência, cuidado e desenvolvimento no contraturno de suas atividades escolares.",
      "A instituição atende crianças e adolescentes de 6 a 16 anos no município de Floresta, com prioridade para situações de vulnerabilidade social.",
    ],
    image: newPhotos.groupWide,
    gallery: [newPhotos.groupWide, newPhotos.groupSquare, newPhotos.facade],
    sections: [
      {
        id: "mission",
        title: "Missão",
        content:
          "Promover a formação integral de crianças e adolescentes, contribuindo para o desenvolvimento de valores, conhecimentos e habilidades que favoreçam a convivência respeitosa e solidária, incentivando-os a participar da construção de uma sociedade mais justa, fraterna e humana.",
      },
      {
        id: "vision",
        title: "Visão",
        content:
          "Ser uma instituição de referência na área da Assistência Social, reconhecida local e regionalmente pela qualidade de seu trabalho, pelo compromisso com o desenvolvimento integral de crianças e adolescentes e pela atuação pautada em valores éticos, morais e espirituais.",
      },
      {
        id: "values",
        title: "Valores",
        items: [
          "Solidariedade e cooperação — incentivo à união, à colaboração e ao cuidado com o próximo.",
          "Desenvolvimento sustentável — compromisso com práticas responsáveis que contribuam para o desenvolvimento social e para a preservação do meio ambiente.",
          "Cidadania — promoção do respeito, da responsabilidade, dos direitos e dos deveres, fortalecendo a participação na sociedade.",
          "Valores cristãos — vivência de princípios fundamentados no amor ao próximo, na fraternidade, na compaixão, no respeito e na solidariedade.",
        ],
      },
    ],
    status: "published",
  },
  {
    id: "history",
    slug: "historia",
    title: "História",
    summary:
      "Uma missão iniciada por Padre Antonio Luigi Martinelli em 1963 e inspirada na bondade, na paz e na solidariedade de Papa João XXIII.",
    content: [
      "Papa João XXIII, nascido Angelo Giuseppe Roncalli em 25 de novembro de 1881, em uma simples família de agricultores na Itália, tornou-se um dos líderes mais amados da história da Igreja Católica.",
      'Sua vida foi marcada pela humildade, pela proximidade com as pessoas e pelo desejo de construir um mundo mais fraterno. Com um sorriso acolhedor e um coração generoso, conquistou a admiração de fiéis em todo o mundo, recebendo o carinhoso título de "Papa Bom".',
      "Ele acreditava que a Igreja deveria estar próxima das pessoas, especialmente dos mais simples, dos pobres, das crianças e daqueles que mais precisavam de amor e atenção. Seu pontificado ficou marcado pela promoção da paz, do diálogo e da solidariedade entre os povos.",
      "Foi justamente por admirar essas virtudes que o Padre Antonio Luigi Martinelli dedicou ao Papa João XXIII o Orfanato fundado em Floresta no ano de 1963. Inspirado por seu exemplo de bondade e serviço ao próximo, desejava que a instituição fosse um lugar de acolhimento, esperança e transformação para crianças e adolescentes.",
      "Mais de seis décadas depois, os ensinamentos e valores de Papa João XXIII continuam vivos na missão da Obra, inspirando o cuidado com cada criança, cada família e cada história que passa por esta casa.",
    ],
    image: newPhotos.history,
    gallery: [newPhotos.history, newPhotos.magazineOne, newPhotos.magazineTwo],
    sections: [
      {
        id: "founder",
        title: "Padre Antonio Luigi Martinelli e a história da Obra",
        content: [
          "Padre Antonio Luigi Martinelli nasceu em 23 de maio de 1925, em Verola Nuova, na região de Brescia, Itália. Era um dos cinco irmãos e dedicou sua vida à fé e ao serviço ao próximo. Tinha especial carinho pelas famílias e, principalmente, pelas crianças.",
          "Antes de deixar sua terra natal para seguir sua missão no Brasil, Padre Antonio foi aconselhar-se com Padre Pio de Pietrelcina, que lhe disse: “Vai, pois é no Brasil que você vai realizar sua missão.” Assim, deixou a Itália e veio para o Paraná, inicialmente para a Diocese de Jacarezinho. Com a criação da Diocese de Maringá, estabeleceu-se em Floresta, Paraná, onde começou a desenvolver sua missão junto à comunidade.",
          "Como pároco, percebendo as necessidades das famílias e das crianças do município, Padre Antonio criou, em 3 de junho de 1963, o Orfanato de Floresta, dedicado ao Papa João XXIII, por quem nutria grande admiração e veneração.",
          "Durante anos, o Orfanato acolheu crianças e adolescentes, oferecendo-lhes cuidado e acompanhamento. Padre Antonio contou com a dedicação de Antonietta De Marchi, uma de suas principais colaboradoras, que se entregou ao trabalho junto às crianças e teve papel importante nessa missão.",
        ],
      },
      {
        id: "continuity",
        title: "Uma nova etapa da missão",
        content: [
          "Com o passar dos anos, a saúde do Padre Antonio foi se fragilizando. Após permanecer por cerca de três anos em uma cadeira de rodas, tornou-se necessário buscar alternativas para garantir a continuidade do trabalho. Dom Jaime Luiz Coelho, Arcebispo de Maringá, recorreu então ao Instituto das Apóstolas do Sagrado Coração de Jesus, para que as Irmãs pudessem assumir a missão junto às crianças e adolescentes.",
          "Com o falecimento do Padre Antonio, em 14 de fevereiro de 1997, as Irmãs Apóstolas assumiram a missão em Floresta, iniciando uma nova etapa na história da instituição. O trabalho deixou de funcionar como orfanato e passou a ser desenvolvido como contraturno escolar. As crianças e adolescentes retornaram para suas famílias, enquanto alguns permaneceram aos cuidados de Antonietta De Marchi.",
          "Essa mudança marcou uma importante transformação na trajetória da Obra: de um espaço de acolhimento residencial, passou a desenvolver um trabalho voltado ao acompanhamento de crianças e adolescentes, mantendo-os junto às suas famílias e fortalecendo sua formação e convivência.",
          "Ao longo dos anos, o trabalho continuou se transformando e acompanhando as necessidades da comunidade, contando com a condução das Irmãs Apóstolas do Sagrado Coração de Jesus e com a colaboração de uma equipe que compõe a Diretoria. Assim, a missão iniciada pelo Padre Antonio permaneceu viva e foi se fortalecendo ao longo das décadas.",
          "Hoje, a Obra de Assistência Social Papa João XXIII atende crianças e adolescentes de 6 a 16 anos por meio do Serviço de Convivência e Fortalecimento de Vínculos, mantendo vivo o propósito de acolher, cuidar e contribuir para o desenvolvimento daqueles que fazem parte dessa história.",
          "A trajetória da Obra permanece profundamente ligada ao legado do Padre Antonio Luigi Martinelli: um homem que enxergou as necessidades de sua comunidade, dedicou-se às crianças e iniciou, em Floresta, uma missão que continuaria crescendo e se transformando ao longo das décadas.",
        ],
      },
    ],
    status: "published",
  },
];

const activities: Activity[] = [
  {
    id: "conversation-circles",
    slug: "rodas-de-conversa",
    title: "Rodas de conversa",
    summary: "Encontros para conversar, brincar, criar vínculos e aprender a ouvir o outro.",
    content:
      "As rodas de conversa são momentos de diálogo, escuta e convivência, que proporcionam às crianças e aos adolescentes um espaço para compartilhar ideias, experiências e sentimentos, fortalecendo o respeito, a comunicação e a convivência em grupo.",
    image: newPhotos.playOne,
    gallery: [newPhotos.playOne, newPhotos.playTwo, newPhotos.roses, newPhotos.unionOne],
    status: "published",
  },
  {
    id: "music",
    slug: "musica",
    title: "Música",
    summary: "Ensaios e apresentações que desenvolvem sensibilidade, concentração e expressão.",
    content: [
      "A atividade de música proporciona às crianças e aos adolescentes oportunidades de expressão, criatividade e desenvolvimento de habilidades, contribuindo para a convivência, a socialização e o contato com diferentes formas de manifestação artística.",
      "Além das atividades realizadas no dia a dia, as crianças e os adolescentes também participam de apresentações em eventos sociais, compartilhando com a comunidade os conhecimentos e habilidades desenvolvidos ao longo das atividades, como nas apresentações de flauta doce.",
    ],
    image: newPhotos.musicRehearsal,
    gallery: [
      newPhotos.musicRehearsal,
      newPhotos.musicStage,
      newPhotos.musicAudience,
      newPhotos.fluteBanner,
    ],
    status: "published",
  },
  {
    id: "dance-theater",
    slug: "danca-e-teatro",
    title: "Dança e teatro",
    summary: "Palco para a imaginação, a presença e o protagonismo de crianças e adolescentes.",
    content: [
      "As atividades de dança e teatro proporcionam às crianças e aos adolescentes momentos de expressão, criatividade e desenvolvimento de habilidades artísticas, contribuindo para a autoestima, a comunicação, a socialização e a convivência em grupo.",
      "Além das atividades realizadas na instituição, as crianças e os adolescentes também têm a oportunidade de participar de eventos e apresentações teatrais da comunidade, compartilhando seus talentos e conhecimentos e fortalecendo sua integração com a comunidade.",
    ],
    image: newPhotos.theaterTwo,
    gallery: [newPhotos.theaterTwo, newPhotos.theaterPortrait, newPhotos.theaterOne],
    status: "published",
  },
  {
    id: "visual-arts",
    slug: "artes-visuais",
    title: "Artes visuais",
    summary: "Cores, materiais e ideias que convidam a experimentar e criar em conjunto.",
    content: [
      "As atividades de artes visuais proporcionam às crianças e aos adolescentes oportunidades de desenvolver a criatividade, a imaginação e a expressão artística, por meio da exploração de diferentes técnicas e materiais.",
      "As propostas podem envolver atividades como pintura, desenho e outras formas de criação artística, proporcionando momentos de aprendizado, expressão e desenvolvimento de habilidades manuais.",
    ],
    image: newPhotos.roses,
    gallery: [newPhotos.roses, newPhotos.yellowSeptember],
    status: "published",
  },
  {
    id: "sport-leisure",
    slug: "esporte-e-lazer",
    title: "Esporte e lazer",
    summary: "Movimento, cooperação e diversão para fortalecer corpo, vínculos e confiança.",
    content: [
      "As atividades de esporte e lazer proporcionam às crianças e aos adolescentes momentos de diversão, convivência e desenvolvimento, contribuindo para a socialização, o trabalho em equipe e a adoção de hábitos saudáveis.",
      "Entre as atividades desenvolvidas estão práticas como capoeira e futebol, além de brincadeiras e outras atividades recreativas, que estimulam o movimento, a cooperação, o respeito ao próximo e a integração entre as crianças e os adolescentes.",
    ],
    image: newPhotos.unionOne,
    gallery: [newPhotos.unionOne, newPhotos.groupSquare],
    status: "published",
  },
  {
    id: "capoeira",
    slug: "capoeira",
    title: "Capoeira",
    summary: "Cultura, ritmo, disciplina e movimento em uma experiência coletiva.",
    content: [
      "A capoeira proporciona às crianças e aos adolescentes uma atividade que une movimento, cultura, expressão corporal e convivência. Por meio da prática, são estimulados a disciplina, a coordenação motora, o respeito, a cooperação e o desenvolvimento da confiança.",
      "Além dos benefícios físicos, a atividade contribui para o contato com uma importante manifestação da cultura brasileira, promovendo aprendizado e integração entre os participantes.",
    ],
    status: "published",
  },
  {
    id: "karate",
    slug: "karate",
    title: "Karatê",
    summary: "Artes marciais para desenvolver concentração, equilíbrio, autocontrole e autonomia.",
    content: [
      "A oficina de Karatê oferece às crianças e aos adolescentes um espaço de aprendizado e desenvolvimento por meio das artes marciais. A prática favorece o condicionamento físico, a concentração, o equilíbrio e o domínio dos movimentos, além de estimular o autocontrole e a perseverança.",
      "Ao longo das atividades, os participantes aprendem a estabelecer metas, lidar com desafios e reconhecer seus próprios limites, fortalecendo a autonomia, a responsabilidade e a segurança para enfrentar diferentes situações do cotidiano.",
    ],
    image: newPhotos.karateOne,
    status: "published",
  },
  {
    id: "kickboxing",
    slug: "kickboxing",
    title: "Kickboxing",
    summary: "Força, agilidade e domínio corporal com disciplina, determinação e autocontrole.",
    content: [
      "A oficina de Kickboxing apresenta às crianças e aos adolescentes os fundamentos de uma modalidade que combina técnicas de golpes com os membros superiores e inferiores, movimentação e condicionamento físico. A prática desenvolve força, agilidade, resistência, coordenação e reflexos, além de exigir atenção e controle durante os exercícios.",
      "Por meio dos treinos, os participantes aprendem a executar movimentos de forma segura e orientada, aprimorando o domínio corporal e a capacidade de enfrentar desafios. A modalidade também favorece a disciplina, a determinação e o autocontrole, contribuindo para uma formação mais ativa e confiante.",
    ],
    status: "published",
  },
  {
    id: "assessment-planning",
    slug: "avaliacao-e-planejamento",
    title: "Avaliação e planejamento",
    summary: "Acompanhamento atento para planejar ações cada vez mais significativas.",
    content: [
      "A avaliação e o planejamento são importantes para acompanhar o desenvolvimento das atividades realizadas pela instituição e identificar necessidades e oportunidades de melhoria.",
      "Esses momentos contribuem para a organização das ações, o acompanhamento dos resultados e o planejamento de novas atividades, buscando aprimorar continuamente o trabalho desenvolvido com as crianças e os adolescentes.",
    ],
    image: newPhotos.magazineOne,
    gallery: [newPhotos.magazineOne, newPhotos.magazineTwo],
    status: "published",
  },
  {
    id: "family-meetings",
    slug: "reunioes-com-familias",
    title: "Reuniões com famílias",
    summary: "Diálogo próximo entre famílias e equipe para cuidar de cada trajetória.",
    content: [
      "As reuniões com as famílias são momentos de diálogo, escuta e aproximação entre a instituição e os responsáveis pelas crianças e adolescentes atendidos.",
      "Além de compartilhar informações e acompanhar o desenvolvimento dos atendidos, esses encontros também podem proporcionar orientações, dicas e momentos de capacitação para as famílias, de acordo com as necessidades identificadas e as possibilidades da instituição.",
      "Essas ações fortalecem a parceria entre a instituição e as famílias, contribuindo para um acompanhamento mais próximo e integrado.",
    ],
    image: newPhotos.groupWide,
    gallery: [newPhotos.groupWide, newPhotos.groupSquare, newPhotos.facade],
    status: "published",
  },
];

const positiveInteger = (value: number | undefined, fallback: number) =>
  Number.isInteger(value) && value && value > 0 ? value : fallback;

export class LocalContentRepository implements ContentRepository {
  async getSiteSettings() {
    return siteSettings;
  }

  async getHomePage() {
    return homePage;
  }

  async getInstitutionalPages() {
    return institutionalPages.filter((page) => page.status === "published");
  }

  async getInstitutionalPageBySlug(slug: string) {
    return institutionalPages.find((page) => page.slug === slug) ?? null;
  }

  async getActivities() {
    return activities;
  }

  async getActivityBySlug(slug: string) {
    return activities.find((activity) => activity.slug === slug) ?? null;
  }

  async getNews(options: NewsQuery = {}) {
    const page = positiveInteger(options.page, 1);
    const pageSize = positiveInteger(options.pageSize, 10);
    const published = localNews
      .filter((post) => post.status === "published")
      .filter((post) => !options.category || post.category === options.category)
      .toSorted((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
    const total = published.length;
    const start = (page - 1) * pageSize;
    return {
      items: published.slice(start, start + pageSize),
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getNewsBySlug(slug: string) {
    return localNews.find((post) => post.slug === slug && post.status === "published") ?? null;
  }

  async getNewsCategories() {
    return [
      ...new Set(
        localNews.filter((post) => post.status === "published").map((post) => post.category),
      ),
    ]
      .filter(Boolean)
      .toSorted((a, b) => a.localeCompare(b, "pt-BR"));
  }

  async getEvents(options: EventQuery = {}) {
    const today = new Date().toISOString().slice(0, 10);
    return localEvents
      .filter((event) => event.status === "published")
      .filter((event) => options.includePast !== false || (event.endsAt ?? event.startsAt) >= today)
      .filter((event) => !options.from || (event.endsAt ?? event.startsAt) >= options.from)
      .filter((event) => !options.to || event.startsAt <= options.to)
      .filter((event) => !options.kind || event.kind === options.kind)
      .toSorted((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  }

  async getEventBySlug(slug: string) {
    return localEvents.find((event) => event.slug === slug && event.status === "published") ?? null;
  }
}
