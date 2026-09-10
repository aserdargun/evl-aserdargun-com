import { evaluationContractSchema, type ContractDraft } from "../domain/schemas";
import type { Locale, MessageKey } from "../i18n";
import { t } from "../i18n";

type Props = {
  locale: Locale;
  contract: ContractDraft;
  onChange: <K extends keyof ContractDraft>(field: K, value: ContractDraft[K]) => void;
};

export function ContractEditor({ locale, contract, onChange }: Props) {
  const validation = evaluationContractSchema.safeParse(contract);
  const invalidFields = new Set(validation.success ? [] : validation.error.issues.map((issue) => String(issue.path[0])));
  const invalid = (field: string) => invalidFields.has(field);
  const error = (field: string) => invalid(field) ? <small className="field-error" id={`${field}-error`}>{t(locale, "contract.invalid")}</small> : null;
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
          <textarea rows={2} aria-invalid={invalid("claim")} aria-describedby={invalid("claim") ? "claim-error" : undefined} value={contract.claim} onChange={(event) => onChange("claim", event.target.value)} required />
          {error("claim")}
        </label>
        <label className="field field-subject">
          <span>{t(locale, "contract.subject")}</span>
          <input aria-invalid={invalid("subject")} aria-describedby={invalid("subject") ? "subject-error" : undefined} value={contract.subject} onChange={(event) => onChange("subject", event.target.value)} required />
          {error("subject")}
        </label>
        <label className="field field-version">
          <span>{t(locale, "contract.subjectVersion")}</span>
          <input aria-invalid={invalid("subjectVersion")} aria-describedby={invalid("subjectVersion") ? "subjectVersion-error" : undefined} value={contract.subjectVersion} onChange={(event) => onChange("subjectVersion", event.target.value)} required />
          {error("subjectVersion")}
        </label>
        <label className="field">
          <span>{t(locale, "contract.unit")}</span>
          <select value={contract.unit} onChange={(event) => onChange("unit", event.target.value as ContractDraft["unit"])}>
            <option value="output">{t(locale, "unit.output")}</option>
            <option value="trajectory">{t(locale, "unit.trajectory")}</option>
            <option value="outcome">{t(locale, "unit.outcome")}</option>
            <option value="mixed">{t(locale, "unit.mixed")}</option>
          </select>
        </label>
        <label className="field field-taskset">
          <span>{t(locale, "contract.taskSet")}</span>
          <input aria-invalid={invalid("taskSet")} aria-describedby={invalid("taskSet") ? "taskSet-error" : undefined} value={contract.taskSet} onChange={(event) => onChange("taskSet", event.target.value)} required />
          {error("taskSet")}
        </label>
        <label className="field">
          <span>{t(locale, "contract.threshold")}</span>
          <div className="threshold-control">
            <b>{contract.threshold.operator}</b>
            <input
              aria-label={t(locale, "contract.threshold")}
              type="number"
              step="any"
              min={contract.threshold.unit === "ratio" ? 0 : undefined}
              max={contract.threshold.unit === "ratio" ? 1 : undefined}
              aria-invalid={invalid("threshold")}
              aria-describedby="threshold-help threshold-error"
              value={contract.threshold.value ?? ""}
              onChange={(event) => onChange("threshold", { ...contract.threshold, value: event.target.value === "" ? null : event.target.valueAsNumber })}
            />
          </div>
          <small id="threshold-help">{contract.threshold.unit === "ratio" ? t(locale, "contract.thresholdHelp") : contract.threshold.unit}</small>
          {error("threshold")}
        </label>
        <label className="field">
          <span>{t(locale, "contract.trials")}</span>
          <input aria-label={t(locale, "contract.trials")} aria-invalid={invalid("trials")} aria-describedby="trials-help trials-error" type="number" min="3" step="1" value={contract.trials ?? ""} onChange={(event) => onChange("trials", event.target.value === "" ? null : event.target.valueAsNumber)} />
          <small id="trials-help">{t(locale, "contract.trialsHelp")}</small>
          {error("trials")}
        </label>
        <label className="field">
          <span>{t(locale, "contract.graderMix")}</span>
          <input value={graderMix} readOnly aria-readonly="true" />
        </label>
        <label className="field field-critical">
          <span>{t(locale, "contract.criticalFailures")}</span>
          <textarea
            rows={2}
            aria-label={t(locale, "contract.criticalFailures")}
            value={contract.criticalFailures.join(";")}
            onChange={(event) => onChange("criticalFailures", event.target.value.split(";"))}
            aria-invalid={invalid("criticalFailures")}
            aria-describedby="critical-failures-help criticalFailures-error"
            required
          />
          {error("criticalFailures")}
          <small id="critical-failures-help">{t(locale, "contract.criticalFailuresHelp")}</small>
        </label>
        <label className="field">
          <span>{t(locale, "contract.evidenceTier")}</span>
          <select value={contract.evidenceTier} onChange={(event) => onChange("evidenceTier", event.target.value as ContractDraft["evidenceTier"])}>
            <option value="standard">{t(locale, "tier.standard")}</option>
            <option value="official_guidance">{t(locale, "tier.official_guidance")}</option>
            <option value="research">{t(locale, "tier.research")}</option>
            <option value="case_study">{t(locale, "tier.case_study")}</option>
          </select>
        </label>
        <label className="field field-review">
          <span>{t(locale, "contract.reviewDate")}</span>
          <input type="date" aria-invalid={invalid("reviewDate")} aria-describedby={invalid("reviewDate") ? "reviewDate-error" : undefined} value={contract.reviewDate} onChange={(event) => onChange("reviewDate", event.target.value)} required />
          {error("reviewDate")}
        </label>
      </div>
      <details className="advanced-contract">
        <summary>{t(locale, "contract.advanced")}</summary>
        <div className="contract-grid">
          {(["population", "successCriteria", "samplingRationale", "arbitrationRule"] as const).map((field) => (
            <label className="field field-claim" key={field}>
              <span>{t(locale, `contract.${field}`)}</span>
              <textarea rows={2} required value={contract[field]} aria-invalid={invalid(field)} aria-describedby={invalid(field) ? `${field}-error` : undefined} onChange={(event) => onChange(field, event.target.value)} />
              {error(field)}
            </label>
          ))}
          <label className="field field-claim">
            <span>{t(locale, "contract.environmentAssumptions")}</span>
            <textarea rows={2} required value={contract.environmentAssumptions.join("\n")} aria-invalid={invalid("environmentAssumptions")} onChange={(event) => onChange("environmentAssumptions", event.target.value.split("\n"))} />
            {error("environmentAssumptions")}
          </label>
        </div>
      </details>
      <label className="uncertainty-control"><input type="checkbox" checked={contract.uncertaintyAcknowledged} onChange={(event) => onChange("uncertaintyAcknowledged", event.target.checked)} />{t(locale, "contract.uncertainty")}</label>
      <p className="example-notice">{t(locale, "contract.exampleNotice")}</p>
    </section>
  );
}
