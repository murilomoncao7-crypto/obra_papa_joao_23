import { randomUUID } from "node:crypto";

export function publicationText(value: FormDataEntryValue | null, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max + 1) : "";
}

export function publicationSlug(title: string) {
  const base = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70)
    .replace(/-$/, "");
  return `${base || "postagem"}-${randomUUID().slice(0, 8)}`;
}

export function publicationBlocks(text: string) {
  return text
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((paragraph) => ({
      _type: "block",
      _key: randomUUID(),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: randomUUID(), text: paragraph, marks: [] }],
    }));
}
