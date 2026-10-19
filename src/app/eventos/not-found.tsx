import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
export default function EventNotFound() {
  return (
    <Section>
      <Container>
        <h1>Evento não encontrado</h1>
        <p>Ele pode não existir, estar em rascunho ou ter sido arquivado.</p>
        <TextLink href="/eventos">Voltar para eventos</TextLink>
      </Container>
    </Section>
  );
}
