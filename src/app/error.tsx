"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container page-message" role="alert">
      <h1>Não foi possível carregar esta página</h1>
      <p>Tente novamente. Se o problema continuar, retorne mais tarde.</p>
      <button type="button" onClick={reset}>
        Tentar novamente
      </button>
    </div>
  );
}
