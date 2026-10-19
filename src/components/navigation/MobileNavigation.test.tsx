import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MobileNavigation } from "./MobileNavigation";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("MobileNavigation", () => {
  it("abre, fecha com Escape e restaura o foco", async () => {
    render(<MobileNavigation />);
    const button = screen.getByRole("button", { name: "Abrir menu", hidden: true });
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button);
    expect(screen.getByRole("button", { name: "Fechar menu", hidden: true })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(
      screen.getByRole("navigation", { name: /dispositivos móveis/i, hidden: true }),
    ).not.toHaveAttribute("hidden");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("button", { name: "Abrir menu", hidden: true })).toHaveFocus();
  });

  it("fecha ao selecionar um link", async () => {
    render(<MobileNavigation />);
    fireEvent.click(screen.getByRole("button", { name: "Abrir menu", hidden: true }));
    const link = screen.getByRole("link", { name: "Instituição", hidden: true });
    link.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(link);
    expect(screen.getByRole("button", { name: "Abrir menu", hidden: true })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
