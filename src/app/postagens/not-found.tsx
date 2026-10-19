import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";

export default function PostNotFound() {
  return (
    <Section>
      <Container>
        <div className="page-message">
          <h1>Postagem não encontrada</h1>
          <p>Ela pode não existir, ainda estar em rascunho ou ter sido arquivada.</p>
          <TextLink href="/postagens">Voltar para postagens</TextLink>
        </div>
      </Container>
    </Section>
  );
}
