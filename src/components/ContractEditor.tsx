import type { EvaluationContract } from "../domain/schemas";
import type { Locale, MessageKey } from "../i18n";
import { t } from "../i18n";

type Props = {
  locale: Locale;
  contract: EvaluationContract;
  onChange: <K extends keyof EvaluationContract>(field: K, value: EvaluationContract[K]) => void;
};

export function ContractEditor({ locale, contract, onChange }: Props) {
  const graderMix = contract.graders
    .map(({ family }) => t(locale, `grader.${family}` as MessageKey))
    .join(" + ");
  return (
    <section className="contract-editor" aria-labelledby="contract-heading">
      <div className="section-heading">
        <span>{t(locale, "contract.kicker")}</span>
        <h2 id="contract-heading">{t(locale, "contract.heading")}</h2>
      </div>
      <div className="contract-grid">
        <label className="field field-claim">
          <span>{t(locale, "contract.claim")}</span>
          <textarea rows={2} value={contract.claim} onChange={(event) => onChange("claim", event.target.value)} required />
        </label>
        <label className="field field-subject">
          <span>{t(locale, "contract.subject")}</span>
          <input value={contract.subject} onChange={(event) => onChange("subject", event.target.value)} required />
        </label>
        <label className="field field-version">
          <span>{t(locale, "contract.subjectVersion")}</span>
          <input value={contract.subjectVersion} onChange={(event) => onChange("subjectVersion", event.target.value)} required />
        </label>
        <label className="field">
          <span>{t(locale, "contract.unit")}</span>
          <select value={contract.unit} onChange={(event) => onChange("unit", event.target.value as EvaluationContract["unit"])}>
            <option value="output">{t(locale, "unit.output")}</option>
            <option value="trajectory">{t(locale, "unit.trajectory")}</option>
            <option value="outcome">{t(locale, "unit.outcome")}</option>
            <option value="mixed">{t(locale, "unit.mixed")}</option>
          </select>
        </label>
        <label className="field field-taskset">
          <span>{t(locale, "contract.taskSet")}</span>
          <input value={contract.taskSet} onChange={(event) => onChange("taskSet", event.target.value)} required />
        </label>
        <label className="field">
          <span>{t(locale, "contract.threshold")}</span>
          <div className="threshold-control">
            <b>{contract.threshold.operator}</b>
            <input
              aria-label={t(locale, "contract.threshold")}
              type="number"
              step="0.01"
              value={contract.threshold.value}
              onChange={(event) => onChange("threshold", { ...contract.threshold, value: Number(event.target.value) })}
            />
          </div>
        </label>
        <label className="field">
          <span>{t(locale, "contract.trials")}</span>
          <input type="number" min="3" value={contract.trials} onChange={(event) => onChange("trials", Number(event.target.value))} />
        </label>
        <label className="field">
          <span>{t(locale, "contract.graderMix")}</span>
          <input value={graderMix} readOnly aria-readonly="true" />
        </label>
        <label className="field field-critical">
          <span>{t(locale, "contract.criticalFailures")}</span>
          <textarea
            rows={2}
            value={contract.criticalFailures.join("; ")}
            onChange={(event) => onChange("criticalFailures", event.target.value.split(";").map((item) => item.trim()).filter(Boolean))}
            aria-describedby="critical-failures-help"
            required
          />
          <small id="critical-failures-help">{t(locale, "contract.criticalFailuresHelp")}</small>
        </label>
        <label className="field">
          <span>{t(locale, "contract.evidenceTier")}</span>
          <select value={contract.evidenceTier} onChange={(event) => onChange("evidenceTier", event.target.value as EvaluationContract["evidenceTier"])}>
            <option value="standard">{t(locale, "tier.standard")}</option>
            <option value="official_guidance">{t(locale, "tier.official_guidance")}</option>
            <option value="research">{t(locale, "tier.research")}</option>
            <option value="case_study">{t(locale, "tier.case_study")}</option>
          </select>
        </label>
        <label className="field field-review">
          <span>{t(locale, "contract.reviewDate")}</span>
          <input type="date" value={contract.reviewDate} onChange={(event) => onChange("reviewDate", event.target.value)} required />
        </label>
      </div>
      <p className="example-notice">{t(locale, "contract.exampleNotice")}</p>
    </section>
  );
}
