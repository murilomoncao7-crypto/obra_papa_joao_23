import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container page-message">
      <h1>Página não encontrada</h1>
      <p>O endereço informado não corresponde a uma página disponível.</p>
      <Link href="/">Voltar ao início</Link>
    </div>
  );
}
