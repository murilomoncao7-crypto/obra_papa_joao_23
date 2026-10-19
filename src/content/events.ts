import type { Event } from "./types";
import { validateEvents } from "./publication-validation";

export const localEvents = validateEvents([
  {
    id: "festa-da-picanha-2026",
    slug: "festa-da-picanha-2026",
    kind: "event",
    title: "9ª Festa da Picanha",
    summary:
      "Uma tradição de solidariedade que reúne a comunidade de Floresta em apoio ao trabalho da Obra.",
    content: [
      "A Festa da Picanha é um dos eventos tradicionais da Obra de Assistência Social Papa João XXIII e, ao longo dos anos, tornou-se um importante momento de encontro, confraternização e solidariedade para a comunidade de Floresta.",
      "Realizada anualmente, tradicionalmente entre o último domingo de agosto e o segundo domingo de setembro, a festa reúne famílias, amigos, colaboradores e toda a comunidade em torno de uma causa muito especial: contribuir para a continuidade do trabalho realizado pela Obra.",
      "Mais do que um evento de confraternização, a Festa da Picanha é uma importante iniciativa de arrecadação de recursos para a instituição. Os valores arrecadados são destinados ao funcionamento da Obra e ajudam a manter o trabalho desenvolvido com as crianças e adolescentes atendidos.",
    ],
    sections: [
      {
        id: "confraternizacao",
        title: "Um dia de confraternização e solidariedade",
        content: [
          "A programação da festa é preparada para proporcionar um dia especial à comunidade. Entre as atrações, está o tradicional almoço, que reúne os participantes em um momento de convivência e celebração.",
          "O evento também conta com um bingo com premiações, trazendo diversão e expectativa para os participantes, além do Leilão Solidário, realizado com o propósito de arrecadar fundos para a instituição.",
          "O bingo e o leilão fazem parte da mobilização da comunidade em favor da Obra. Dessa forma, cada participação contribui para transformar um momento de lazer e confraternização em uma oportunidade concreta de apoiar a instituição.",
        ],
      },
      {
        id: "comunidade",
        title: "Uma história construída pela comunidade",
        content: [
          "A Festa da Picanha também representa a força da participação da comunidade na história da Obra. A cada edição, pessoas se unem, colaboram e participam para ajudar a manter viva uma missão que há décadas faz parte da vida de Floresta.",
          "Em 7 de setembro de 2025, foi realizada a 8ª edição da Festa da Picanha. A 9ª edição está marcada para 30 de agosto de 2026, dando continuidade a essa tradição de união e solidariedade.",
          "Ao longo de suas edições, a festa demonstra que a contribuição de cada pessoa pode fazer diferença. Seja participando do almoço, do bingo, do leilão ou simplesmente apoiando a iniciativa, a comunidade ajuda a fortalecer o trabalho desenvolvido pela Obra.",
        ],
      },
      {
        id: "causa",
        title: "Muito mais do que uma festa",
        content: [
          "A Festa da Picanha representa a união de pessoas que acreditam na importância de cuidar, acolher e contribuir para o desenvolvimento de crianças e adolescentes.",
          "Cada edição é uma oportunidade de celebrar a comunidade e, ao mesmo tempo, colaborar para que a Obra de Assistência Social Papa João XXIII continue realizando sua missão.",
          "Uma festa feita pela comunidade, para a comunidade, em benefício de uma causa que transforma vidas.",
        ],
      },
    ],
    startsAt: "2026-08-30",
    time: "Almoço: 11h30 às 13h30 · Show de prêmios: a partir das 19h",
    location: "Salão Paroquial de Floresta",
    image: "/images/obra-2026/festa-da-picanha-2026.webp",
    imageAlt: "Cartaz da 9ª Festa da Picanha, em 30 de agosto de 2026",
    eventStatus: "scheduled",
    contacts: [
      {
        id: "festa-whatsapp",
        type: "whatsapp",
        label: "Convites e informações",
        value: "(44) 3236-1231",
        href: "https://wa.me/554432361231?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20a%209%C2%AA%20Festa%20da%20Picanha.",
        status: "published",
      },
    ],
    status: "published",
  },
] satisfies Event[]);
