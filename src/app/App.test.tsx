import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { STORAGE_KEY } from "../domain/persistence";
import { App } from "./App";

const createObjectURL = vi.fn(() => "blob:evl");
const revokeObjectURL = vi.fn();

describe("EVL application", () => {
  beforeEach(() => {
    createObjectURL.mockClear();
    revokeObjectURL.mockClear();
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

  it("renders active links and a non-link planned CTX entry", () => {
    render(<App initialPath="/en" />);
    expect(screen.getByRole("link", { name: /HNS/i })).toHaveAttribute(
      "href",
      "https://hns.aserdargun.com",
    );
    const ctx = screen.getByTestId("portfolio-ctx");
    expect(ctx).toHaveTextContent("Planned");
    expect(within(ctx).queryByRole("link")).not.toBeInTheDocument();
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
  });

  it("renders one page heading and named anchored regions", () => {
    render(<App initialPath="/en" />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    for (const name of ["Workbench", "Evaluation patterns", "Evidence ledger", "Shared verification layer"]) {
      expect(screen.getByRole("region", { name })).toBeInTheDocument();
    }
  });
});
