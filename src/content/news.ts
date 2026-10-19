import type { NewsPost } from "./types";
import { validateNews } from "./publication-validation";

// Não há notícias confirmadas no acervo legado. Novos itens devem passar por validação institucional.
export const localNews = validateNews([] satisfies NewsPost[]);
