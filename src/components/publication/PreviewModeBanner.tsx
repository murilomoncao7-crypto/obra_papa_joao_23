import styles from "./PreviewModeBanner.module.css";

export function PreviewModeBanner() {
  return (
    <aside className={styles.banner} aria-label="Modo de pré-visualização">
      <strong>Pré-visualização privada: rascunhos podem aparecer nesta página.</strong>
      <form action="/api/draft-mode/disable" method="post">
        <button type="submit">Sair da pré-visualização</button>
      </form>
    </aside>
  );
}
