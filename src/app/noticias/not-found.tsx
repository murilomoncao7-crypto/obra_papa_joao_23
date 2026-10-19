import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
export default function NewsNotFound() {
  return (
    <Section>
      <Container>
        <h1>Publicação não encontrada</h1>
        <p>Ela pode não existir, estar em rascunho ou ter sido arquivada.</p>
        <TextLink href="/noticias">Voltar para notícias</TextLink>
      </Container>
    </Section>
  );
}
