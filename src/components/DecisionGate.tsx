import type { EvaluationResult } from "../domain/schemas";
import type { Locale, MessageKey } from "../i18n";
import { t } from "../i18n";
import { Icon } from "./icons";

type Props = { locale: Locale; result: EvaluationResult; onExport: () => void; onReset: () => void };

export function DecisionGate({ locale, result, onExport, onReset }: Props) {
  return (
    <aside className={`decision-rail gate-${result.gate}`} aria-labelledby="gate-heading">
      <h2 id="gate-heading">{t(locale, "gate.heading")}</h2>
      <div className="gate-box" role="status" aria-label={t(locale, "gate.heading")} aria-live="polite" aria-atomic="true">
        <div className="gate-value"><Icon name={result.gate === "hold" ? "warning" : "check"} /><strong>{t(locale, `gate.${result.gate}` as MessageKey)}</strong></div>
        <p>{t(locale, `gate.${result.gate}.description` as MessageKey)}</p>
      </div>
      <div className="finding-list">
        <h3>{result.gate === "ready" ? (locale === "en" ? "Why it is ready" : "Neden hazır") : (locale === "en" ? "Decision trail" : "Karar izi")}</h3>
        {result.findings.length === 0 ? (
          <p className="finding"><Icon name="check" />{t(locale, "gate.noFindings")}</p>
        ) : result.findings.map((finding, index) => (
          <p className={`finding finding-${finding.severity}`} key={`${finding.code}-${finding.layerId ?? index}`}>
            <Icon name={finding.severity === "blocker" ? "warning" : "check"} />
            <span><b>{t(locale, finding.messageKey as MessageKey)}</b><small>{finding.details}</small></span>
          </p>
        ))}
      </div>
      <div className="gate-actions">
        <button className="primary-action" type="button" onClick={onExport}><Icon name="download" />{t(locale, "actions.export")}</button>
        <button type="button" onClick={onReset}><Icon name="reset" />{t(locale, "actions.reset")}</button>
      </div>
    </aside>
  );
}
