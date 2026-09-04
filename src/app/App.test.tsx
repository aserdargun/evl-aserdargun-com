import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { STORAGE_KEY } from "../domain/persistence";
import { App } from "./App";

const createObjectURL = vi.fn(() => "blob:evl");
const revokeObjectURL = vi.fn();
const anchorClick = vi
  .spyOn(HTMLAnchorElement.prototype, "click")
  .mockImplementation(() => undefined);

describe("EVL application", () => {
  beforeEach(() => {
    createObjectURL.mockClear();
    revokeObjectURL.mockClear();
    anchorClick.mockClear();
    Object.defineProperties(window.URL, {
      createObjectURL: { configurable: true, value: createObjectURL },
      revokeObjectURL: { configurable: true, value: revokeObjectURL },
    });
  });

  it("changes the gate when critical evidence is removed", async () => {
    const user = userEvent.setup();
    render(<App initialPath="/en" />);

    const gate = screen.getByRole("status", { name: "Release gate" });
    expect(gate).toHaveTextContent("READY");
    await user.click(screen.getByRole("checkbox", { name: "Safety evidence" }));

    expect(gate).toHaveTextContent("HOLD");
    expect(screen.getByText("Critical layer is not covered")).toBeVisible();
  });

  it("switches locale without resetting the edited claim", async () => {
    const user = userEvent.setup();
    render(<App initialPath="/en" />);
    const claim = screen.getByLabelText("Evaluation claim");
    await user.clear(claim);
    await user.type(claim, "Measure tool-use correctness");
    await user.click(screen.getByRole("link", { name: "Türkçe" }));

    expect(screen.getByLabelText("Değerlendirme iddiası")).toHaveValue(
      "Measure tool-use correctness",
    );
    expect(document.documentElement.lang).toBe("tr");
  });

  it("localizes a fresh Turkish reference contract and its controls", () => {
    render(<App initialPath="/tr" />);

    expect(screen.getByLabelText("Değerlendirme iddiası")).toHaveValue(
      "Ajan, güvenli ve incelenebilir izler üzerinden amaçlanan sonuca ulaşır.",
    );
    expect(screen.getByLabelText("Değerlendirme birimi")).toHaveDisplayValue(
      "İz",
    );
    expect(screen.getByLabelText("Kanıt düzeyi")).toHaveDisplayValue(
      "Resmî rehberlik",
    );
    expect(screen.getByLabelText("Değerlendirici bileşimi")).toHaveValue(
      "kural tabanlı + insan",
    );
    expect(
      screen.getByLabelText("Kanıtları katmana göre filtrele"),
    ).toBeInTheDocument();
    expect(document.title).toBe(
      "EVL - Yapay Zekâ Değerlendirme ve Güvenilirlik Laboratuvarı",
    );
  });

  it("renders Turkish decision details instead of engine-language text", async () => {
    const user = userEvent.setup();
    render(<App initialPath="/tr" />);

    await user.click(
      screen.getByRole("checkbox", { name: "Güvenlik kanıtı" }),
    );

    expect(screen.getByText("Kritik Güvenlik katmanı eksik.")).toBeVisible();
    expect(
      screen.queryByText("Critical layer safety is missing."),
    ).not.toBeInTheDocument();
  });

  it("renders CTX as an active portfolio link", () => {
    render(<App initialPath="/en" />);
    expect(screen.getByRole("link", { name: /HNS/i })).toHaveAttribute(
      "href",
      "https://hns.aserdargun.com",
    );
    const ctx = screen.getByTestId("portfolio-ctx");
    expect(ctx).not.toHaveTextContent("Planned");
    expect(within(ctx).getByRole("link")).toHaveAttribute(
      "href",
      "https://ctx.aserdargun.com",
    );
  });

  it("filters the evidence ledger without changing the contract", async () => {
    const user = userEvent.setup();
    render(<App initialPath="/en" />);
    await user.selectOptions(screen.getByLabelText("Filter evidence by layer"), "safety");

    expect(screen.getByText("AI Measurement and Evaluation")).toBeVisible();
    expect(screen.queryByText("Graders")).not.toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Release gate" })).toHaveTextContent("READY");
  });

  it("resets edits only after in-app confirmation", async () => {
    const user = userEvent.setup();
    render(<App initialPath="/en" />);
    const claim = screen.getByLabelText("Evaluation claim");
    await user.clear(claim);
    await user.type(claim, "Temporary claim");
    await user.click(screen.getByRole("button", { name: "Reset contract" }));

    expect(screen.getByRole("dialog", { name: "Reset this contract?" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("dialog", { name: "Reset this contract?" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset contract" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Reset contract" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(claim).toHaveValue("Temporary claim");
    await user.click(screen.getByRole("button", { name: "Reset contract" }));
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(claim).not.toHaveValue("Temporary claim");
  });

  it("surfaces invalid stored data and exports on explicit request", async () => {
    localStorage.setItem(STORAGE_KEY, "{");
    const user = userEvent.setup();
    render(<App initialPath="/en" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Stored workbench data was invalid");

    await user.click(screen.getByRole("button", { name: "Export JSON" }));
    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledOnce();
    expect(anchorClick).toHaveBeenCalledOnce();
  });

  it("renders one page heading and named anchored regions", () => {
    render(<App initialPath="/en" />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    for (const name of ["Workbench", "Evaluation patterns", "Evidence ledger", "Shared verification layer"]) {
      expect(screen.getByRole("region", { name })).toBeInTheDocument();
    }
  });
});
