import { randomBytes, scryptSync } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";

// Run locally. The password is hidden and never written to disk or printed.
let muted = false;
const output = new Writable({
  write(chunk, encoding, callback) {
    if (!muted) process.stdout.write(chunk, encoding);
    callback();
  },
});
const prompt = createInterface({
  input: process.stdin,
  output,
  terminal: Boolean(process.stdin.isTTY),
});
try {
  const username = (await prompt.question("Usuário editorial [root]: ")).trim() || "root";
  process.stdout.write("Senha editorial (entrada oculta): ");
  muted = true;
  const password = await prompt.question("");
  muted = false;
  process.stdout.write("\n");
  if (!password || password.length > 256 || username.length > 80)
    throw new Error("Usuário ou senha inválidos.");
  const salt = randomBytes(16).toString("hex");
  const values = {
    EDITOR_USERNAME: username,
    EDITOR_PASSWORD_HASH: `${salt}:${scryptSync(password, salt, 64).toString("hex")}`,
    EDITOR_SESSION_SECRET: randomBytes(48).toString("hex"),
  };
  const file = ".env.local";
  let text = existsSync(file) ? readFileSync(file, "utf8") : "";
  for (const [key, value] of Object.entries(values)) {
    const pattern = new RegExp(`^${key}=.*$`, "m");
    text = pattern.test(text)
      ? text.replace(pattern, `${key}=${value}`)
      : `${text.trimEnd()}\n${key}=${value}\n`;
  }
  writeFileSync(file, text, { mode: 0o600 });
  console.log(
    "Acesso configurado em .env.local. Não versione esse arquivo. Cadastre as três variáveis EDITOR_ na Vercel como sensíveis e faça um novo deploy.",
  );
} catch (error) {
  muted = false;
  console.error(error instanceof Error ? error.message : "Falha ao configurar.");
  process.exitCode = 1;
} finally {
  prompt.close();
}
