import type { EvaluationContract } from "../domain/schemas";
import type { Locale } from "../i18n";
import { t } from "../i18n";

type Props = {
  locale: Locale;
  contract: EvaluationContract;
  onChange: <K extends keyof EvaluationContract>(field: K, value: EvaluationContract[K]) => void;
};

export function ContractEditor({ locale, contract, onChange }: Props) {
  const graderMix = contract.graders.map(({ family }) => family).join(" + ");
  return (
    <section className="contract-editor" aria-labelledby="contract-heading">
      <div className="section-heading">
        <span>{t(locale, "contract.kicker")}</span>
        <h2 id="contract-heading">{t(locale, "contract.heading")}</h2>
      </div>
      <div className="contract-grid">
        <label className="field field-claim">
          <span>{t(locale, "contract.claim")}</span>
          <input value={contract.claim} onChange={(event) => onChange("claim", event.target.value)} required />
        </label>
        <label className="field field-version">
          <span>{t(locale, "contract.subjectVersion")}</span>
          <input value={contract.subjectVersion} onChange={(event) => onChange("subjectVersion", event.target.value)} required />
        </label>
        <label className="field">
          <span>{t(locale, "contract.unit")}</span>
          <select value={contract.unit} onChange={(event) => onChange("unit", event.target.value as EvaluationContract["unit"])}>
            <option value="output">Output</option>
            <option value="trajectory">Trajectory</option>
            <option value="outcome">Outcome</option>
            <option value="mixed">Mixed</option>
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
        <label className="field">
          <span>{t(locale, "contract.criticalFailures")}</span>
          <input
            value={contract.criticalFailures.join("; ")}
            onChange={(event) => onChange("criticalFailures", event.target.value.split(";").map((item) => item.trim()).filter(Boolean))}
            required
          />
        </label>
        <label className="field">
          <span>{t(locale, "contract.evidenceTier")}</span>
          <select value={contract.evidenceTier} onChange={(event) => onChange("evidenceTier", event.target.value as EvaluationContract["evidenceTier"])}>
            <option value="standard">Standard</option>
            <option value="official_guidance">Official guidance</option>
            <option value="research">Research</option>
            <option value="case_study">Case study</option>
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
