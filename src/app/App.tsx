import { useEffect, useRef, useState } from "react";

import { evaluateContract } from "../domain/evaluate-contract";
import { evidenceSources } from "../data/evidence";
import { buildExportEnvelope, downloadExport } from "../domain/export-contract";
import { parseContract, type LayerId } from "../domain/schemas";
import { localeFromPath, t, type Locale } from "../i18n";
import { ContractEditor } from "../components/ContractEditor";
import { CoverageMatrix } from "../components/CoverageMatrix";
import { DecisionGate } from "../components/DecisionGate";
import { EvidenceLedger } from "../components/EvidenceLedger";
import { Header } from "../components/Header";
import { PatternLibrary } from "../components/PatternLibrary";
import { PortfolioMap } from "../components/PortfolioMap";
import { PrivacyNote } from "../components/PrivacyNote";
import { TargetRail } from "../components/TargetRail";
import { useWorkbench } from "./use-workbench";

export function App({ initialPath }: { initialPath?: string }) {
  const [locale, setLocale] = useState<Locale>(() => localeFromPath(initialPath ?? window.location.pathname));
  const [evidenceFilter, setEvidenceFilter] = useState<"all" | LayerId>("all");
  const [exportError, setExportError] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const cancelResetRef = useRef<HTMLButtonElement>(null);
  const resetReturnFocusRef = useRef<HTMLElement | null>(null);
  const workbench = useWorkbench(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t(locale, "app.metaTitle");
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", t(locale, "app.metaDescription"));
  }, [locale]);

  useEffect(() => {
    if (resetOpen) {
      cancelResetRef.current?.focus();
    } else {
      resetReturnFocusRef.current?.focus();
    }
  }, [resetOpen]);

  useEffect(() => {
    const onPopState = () => setLocale(localeFromPath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const exportEvidence = () => {
    if (!workbench.canExport) return;
    try {
      const timestamp = new Date().toISOString();
      const result = evaluateContract(workbench.contract, workbench.target, evidenceSources, timestamp);
      const envelope = buildExportEnvelope(parseContract(workbench.contract), result, evidenceSources, timestamp);
      downloadExport(envelope, document);
      setExportError(false);
    } catch { setExportError(true); }
  };

  const openReset = () => {
    resetReturnFocusRef.current = document.activeElement as HTMLElement | null;
    setResetOpen(true);
  };

  const closeReset = () => setResetOpen(false);

  return (
    <div className="app-shell">
      <div inert={resetOpen}>
      <a className="skip-link" href="#workbench">{t(locale, "nav.skip")}</a>
      <Header locale={locale} onLocaleChange={setLocale} />
      {workbench.persistenceNotice && <p className="persistence-alert" role="alert">{t(locale, `persistence.${workbench.persistenceNotice}`)}</p>}
      <main>
        <section className="workbench-layout" id="workbench" tabIndex={-1} aria-label={t(locale, "nav.workbench")}>
          <TargetRail locale={locale} selected={workbench.selectedTargetId} onSelect={workbench.selectTarget} />
          <div className="workspace-column">
            <ContractEditor key={workbench.contract.targetId} locale={locale} contract={workbench.contract} onChange={workbench.updateField} />
            <CoverageMatrix locale={locale} contract={workbench.contract} target={workbench.target} onChange={workbench.updateLayer} />
          </div>
          <DecisionGate locale={locale} result={workbench.result} canExport={workbench.canExport} exportError={exportError} onExport={exportEvidence} onReset={openReset} />
        </section>
        <div className="downstream-layout">
          <PatternLibrary locale={locale} />
          <EvidenceLedger locale={locale} filter={evidenceFilter} onFilter={setEvidenceFilter} />
          <PortfolioMap locale={locale} />
        </div>
      </main>
      <PrivacyNote locale={locale} />
      </div>
      {resetOpen && (
        <div className="modal-backdrop" role="presentation">
          <section
            className="reset-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-title"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closeReset();
                return;
              }
              if (event.key !== "Tab") return;
              const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("button")];
              const first = buttons.at(0);
              const last = buttons.at(-1);
              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
              }
            }}
          >
            <h2 id="reset-title">{t(locale, "reset.heading")}</h2>
            <p>{t(locale, "reset.description")}</p>
            <div><button ref={cancelResetRef} type="button" onClick={closeReset}>{t(locale, "actions.cancel")}</button><button className="primary-action" type="button" onClick={() => { workbench.reset(); closeReset(); }}>{t(locale, "actions.confirm")}</button></div>
          </section>
        </div>
      )}
    </div>
  );
}
