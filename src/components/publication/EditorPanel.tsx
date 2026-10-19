"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { PublicationGuide } from "./PublicationGuide";
import styles from "./EditorPanel.module.css";

type Post = { _id: string; _rev: string; title: string; slug: string; editorialStatus: string };
type Photo = { file: File; url: string };

async function preparePhoto(file: File): Promise<File> {
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > 10 * 1024 * 1024
  )
    throw new Error("Use JPG, PNG ou WebP, com até 10 MB por foto.");
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    if (bitmap.width < 320 || bitmap.height < 320)
      throw new Error("Cada foto precisa ter pelo menos 320 × 320 pixels.");
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Não foi possível preparar as fotos neste navegador.");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.85, 0.7, 0.55]) {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/webp", quality),
      );
      if (blob && blob.type === "image/webp" && blob.size <= 1_000_000)
        return new File([blob], "fotografia.webp", { type: "image/webp" });
    }
    throw new Error("Esta foto ainda está muito grande. Exporte uma versão menor.");
  } finally {
    bitmap.close();
  }
}

export function EditorPanel({
  authenticated,
  configured,
}: {
  authenticated: boolean;
  configured: boolean;
}) {
  const [logged, setLogged] = useState(authenticated);
  const [tab, setTab] = useState("create");
  const [busy, setBusy] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [message, setMessage] = useState("");
  const [published, setPublished] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const photoRef = useRef<Photo[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => () => photoRef.current.forEach((photo) => URL.revokeObjectURL(photo.url)), []);

  async function api(url: string, init?: RequestInit) {
    const response = await fetch(url, init);
    const result = await response.json();
    if (response.status === 401) setLogged(false);
    if (!response.ok) throw new Error(result.message || "Não foi possível concluir.");
    return result;
  }
  async function run(action: () => Promise<void>) {
    setBusy(true);
    setMessage("");
    try {
      await action();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Não foi possível concluir. Confira a conexão.",
      );
    } finally {
      setBusy(false);
    }
  }
  function clearPhotos() {
    photoRef.current.forEach((photo) => URL.revokeObjectURL(photo.url));
    photoRef.current = [];
    setPhotos([]);
  }
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await run(async () => {
      await api("/api/editor/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.get("username"), password: data.get("password") }),
      });
      setLogged(true);
    });
  }
  async function loadPosts() {
    const result = await api("/api/editor/posts", { cache: "no-store" });
    setPosts(result.posts);
  }
  async function selectPhotos(files: FileList | null) {
    if (!files) return;
    if (files.length > 3) {
      setMessage("Selecione no máximo 3 fotos.");
      return;
    }
    setPreparing(true);
    setMessage("");
    const next: Photo[] = [];
    try {
      for (const file of Array.from(files)) {
        const prepared = await preparePhoto(file);
        next.push({ file: prepared, url: URL.createObjectURL(prepared) });
      }
      clearPhotos();
      photoRef.current = next;
      setPhotos(next);
    } catch (error) {
      next.forEach((photo) => URL.revokeObjectURL(photo.url));
      setMessage(error instanceof Error ? error.message : "Não foi possível preparar as fotos.");
    } finally {
      setPreparing(false);
    }
  }
  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.delete("originals");
    for (const photo of photos) data.append("photos", photo.file);
    await run(async () => {
      setPublished("");
      const result = await api("/api/editor/posts", { method: "POST", body: data });
      setMessage(result.message);
      setPublished(result.url ?? "/postagens");
      formRef.current?.reset();
      setTitle("");
      setText("");
      clearPhotos();
    });
  }
  async function archive(post: Post) {
    if (!window.confirm(`Retirar “${post.title}” do feed público? O registro será preservado.`))
      return;
    await run(async () => {
      const result = await api(`/api/editor/posts/${post._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revision: post._rev }),
      });
      await loadPosts();
      setMessage(result.message);
    });
  }
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Obra Papa João XXIII</p>
          <h1>Publicações da instituição</h1>
          <p>Compartilhe as histórias e os momentos da Obra.</p>
        </div>
        <div className={styles.links}>
          <Link href="/postagens">Ver feed público</Link>
          {logged ? (
            <button
              disabled={busy || preparing}
              onClick={() =>
                void run(async () => {
                  await api("/api/editor/session", { method: "DELETE" });
                  setLogged(false);
                  clearPhotos();
                })
              }
            >
              Sair
            </button>
          ) : null}
        </div>
      </header>
      {message ? (
        <p className={styles.message} role="status">
          {message} {published ? <Link href={published}>Abrir postagem</Link> : null}
        </p>
      ) : null}
      {!configured ? (
        <section className={styles.box}>
          <h2>Configuração editorial pendente</h2>
          <p>
            O administrador precisa conectar o CMS e configurar o acesso antes de liberar a
            publicação.
          </p>
        </section>
      ) : !logged ? (
        <form onSubmit={login} className={`${styles.box} ${styles.login}`}>
          <h2>Acesso dos responsáveis</h2>
          <p>Entre com o usuário e a senha fornecidos pela instituição.</p>
          <label>
            Usuário
            <input name="username" autoComplete="username" maxLength={80} required />
          </label>
          <label>
            Senha
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              maxLength={256}
              required
            />
          </label>
          <button type="submit" disabled={busy}>
            {busy ? "Entrando…" : "Entrar"}
          </button>
        </form>
      ) : (
        <>
          <nav className={styles.tabs} aria-label="Área editorial">
            <button
              aria-pressed={tab === "create"}
              disabled={busy || preparing}
              onClick={() => setTab("create")}
            >
              Criar postagem
            </button>
            <button
              aria-pressed={tab === "posts"}
              disabled={busy || preparing}
              onClick={() => {
                setTab("posts");
                void run(loadPosts);
              }}
            >
              Publicações
            </button>
            <button
              aria-pressed={tab === "guide"}
              disabled={busy || preparing}
              onClick={() => setTab("guide")}
            >
              Orientações
            </button>
          </nav>
          <section hidden={tab !== "create"} className={styles.editor}>
            <form ref={formRef} className={styles.box} onSubmit={publish}>
              <h2>Nova postagem</h2>
              <label>
                Título
                <input
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  minLength={5}
                  maxLength={120}
                  required
                />
              </label>
              <label>
                Texto da postagem
                <textarea
                  name="text"
                  rows={7}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  minLength={30}
                  maxLength={10000}
                  required
                />
              </label>
              <div className={styles.row}>
                <label>
                  Responsável
                  <input name="author" maxLength={100} placeholder="Equipe da Obra" required />
                </label>
                <label>
                  Categoria
                  <input name="category" maxLength={60} placeholder="Atividades" required />
                </label>
              </div>
              <label>
                Fotos (1 a 3)
                <input
                  name="originals"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  disabled={busy || preparing}
                  onChange={(e) => void selectPhotos(e.target.files)}
                />
              </label>
              <p className={styles.hint}>
                {preparing
                  ? "Preparando as fotos…"
                  : "JPG, PNG ou WebP, até 10 MB por original. Recomendado: 1080 × 1350 ou 1080 × 1080 pixels."}
              </p>
              <label>
                Descrição das fotos
                <textarea
                  name="alt"
                  rows={2}
                  minLength={5}
                  maxLength={180}
                  placeholder="Ex.: Crianças participando de uma roda de capoeira na quadra."
                  required
                />
              </label>
              <label>
                Crédito das fotos
                <input name="credit" maxLength={160} placeholder="Acervo da instituição" required />
              </label>
              <label className={styles.check}>
                <input name="rights" type="checkbox" value="true" required />
                Confirmo a autorização de uso das fotos e publicação na internet, incluindo as
                autorizações dos responsáveis pelos menores retratados.
              </label>
              <button type="submit" disabled={busy || preparing || photos.length === 0}>
                {busy ? "Publicando…" : "Publicar no site"}
              </button>
            </form>
            <aside className={styles.box}>
              <h2>Prévia da postagem</h2>
              <p className={styles.hint}>Confira fotos e texto. A primeira imagem será a capa.</p>
              {photos.length ? (
                <div className={styles.previewPhotos}>
                  {photos.map((photo, index) => (
                    <figure key={photo.url}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url} alt={`Prévia da foto ${index + 1}`} />
                      <figcaption>{index === 0 ? "Capa" : `Foto ${index + 1}`}</figcaption>
                    </figure>
                  ))}
                </div>
              ) : (
                <div className={styles.placeholder}>Suas fotos aparecem aqui</div>
              )}
              <h3>{title || "Título da postagem"}</h3>
              <p className={styles.previewText}>
                {text || "O texto será exibido aqui para revisão."}
              </p>
            </aside>
          </section>
          {tab === "posts" ? (
            <section className={styles.box}>
              <h2>Publicações recentes</h2>
              <p>Até 100 registros recentes. Retirar do feed preserva o histórico no CMS.</p>
              {posts.length === 0 && !busy ? <p>Nenhuma postagem cadastrada.</p> : null}
              <ul className={styles.postList}>
                {posts.map((post) => (
                  <li key={post._id}>
                    <div>
                      <strong>{post.title}</strong>
                      <p>{post.editorialStatus === "published" ? "Publicada" : "Fora do feed"}</p>
                      {post.editorialStatus === "published" ? (
                        <Link href={`/postagens/${post.slug}`}>Ver postagem</Link>
                      ) : null}
                    </div>
                    {post.editorialStatus === "published" ? (
                      <button disabled={busy} onClick={() => void archive(post)}>
                        Retirar do feed
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {tab === "guide" ? (
            <div className={`${styles.box} ${styles.guide}`}>
              <PublicationGuide />
            </div>
          ) : null}
        </>
      )}
    </main>
  );
}
