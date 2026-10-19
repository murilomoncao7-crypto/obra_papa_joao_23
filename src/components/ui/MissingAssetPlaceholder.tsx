import styles from "./MissingAssetPlaceholder.module.css";

type MissingAssetPlaceholderProps = {
  legacyPath: string;
  description: string;
};

export function MissingAssetPlaceholder({ legacyPath, description }: MissingAssetPlaceholderProps) {
  return (
    <div
      className={styles.placeholder}
      role="img"
      aria-label={`Imagem não disponível: ${description}. Arquivo legado ${legacyPath} aguarda validação.`}
    >
      <span>Imagem não disponível</span>
      <strong>{description}</strong>
      <small>{legacyPath} — [VALIDAR COM A INSTITUIÇÃO]</small>
    </div>
  );
}
