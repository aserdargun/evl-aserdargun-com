import { useEffect, useState } from "react";

import { evidenceSources } from "../data/evidence";
import { buildExportEnvelope, downloadExport } from "../domain/export-contract";
import type { LayerId } from "../domain/schemas";
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
  const [resetOpen, setResetOpen] = useState(false);
  const [stickyGate, setStickyGate] = useState(false);
  const workbench = useWorkbench(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const onPopState = () => setLocale(localeFromPath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const updateStickyGate = () => {
      const contractHeading = document.getElementById("contract-heading");
      setStickyGate(window.innerWidth < 760 && Boolean(contractHeading && contractHeading.getBoundingClientRect().bottom < 0));
    };
    updateStickyGate();
    window.addEventListener("scroll", updateStickyGate, { passive: true });
    window.addEventListener("resize", updateStickyGate);
    return () => {
      window.removeEventListener("scroll", updateStickyGate);
      window.removeEventListener("resize", updateStickyGate);
    };
  }, []);

  const exportEvidence = () => {
    const envelope = buildExportEnvelope(workbench.contract, workbench.result, evidenceSources, new Date().toISOString());
    downloadExport(envelope, document);
  };

  return (
    <div className="app-shell">
      <Header locale={locale} onLocaleChange={setLocale} />
      {workbench.persistenceNotice && <p className="persistence-alert" role="alert">{t(locale, `persistence.${workbench.persistenceNotice}`)}</p>}
      <main>
        <section className="workbench-layout" id="workbench" aria-label={t(locale, "nav.workbench")}>
          <TargetRail locale={locale} selected={workbench.selectedTargetId} onSelect={workbench.selectTarget} />
          <div className="workspace-column">
            <ContractEditor locale={locale} contract={workbench.contract} onChange={workbench.updateField} />
            <CoverageMatrix locale={locale} contract={workbench.contract} target={workbench.target} onChange={workbench.updateLayer} />
          </div>
          <DecisionGate locale={locale} result={workbench.result} sticky={stickyGate} onExport={exportEvidence} onReset={() => setResetOpen(true)} />
        </section>
        <div className="downstream-layout">
          <PatternLibrary locale={locale} />
          <EvidenceLedger locale={locale} filter={evidenceFilter} onFilter={setEvidenceFilter} />
          <PortfolioMap locale={locale} />
        </div>
      </main>
      <PrivacyNote locale={locale} />
      {resetOpen && (
        <div className="modal-backdrop" role="presentation">
          <section className="reset-dialog" role="dialog" aria-modal="true" aria-labelledby="reset-title">
            <h2 id="reset-title">{t(locale, "reset.heading")}</h2>
            <p>{t(locale, "reset.description")}</p>
            <div><button type="button" onClick={() => setResetOpen(false)}>{t(locale, "actions.cancel")}</button><button className="primary-action" type="button" onClick={() => { workbench.reset(); setResetOpen(false); }}>{t(locale, "actions.confirm")}</button></div>
          </section>
        </div>
      )}
    </div>
  );
}
