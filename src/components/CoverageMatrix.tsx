import { COVERAGE_STATES, LAYER_IDS, type CoverageState, type ContractDraft, type EvaluationTarget, type LayerId } from "../domain/schemas";
import type { Locale, MessageKey } from "../i18n";
import { t } from "../i18n";
import { Icon, type IconName } from "./icons";

const layerIcons: Record<LayerId, IconName> = {
  output: "document",
  trajectory: "trajectory",
  outcome: "target",
  robustness: "shield",
  safety: "warning",
  operations: "gear",
};

type Props = {
  locale: Locale;
  contract: ContractDraft;
  target: EvaluationTarget;
  onChange: (layerId: LayerId, status: CoverageState) => void;
};

export function CoverageMatrix({ locale, contract, target, onChange }: Props) {
  return (
    <section className="coverage-section" aria-labelledby="coverage-heading">
      <div className="section-heading inline-heading">
        <span>{t(locale, "coverage.kicker")}</span>
        <h2 id="coverage-heading">{t(locale, "coverage.heading")}</h2>
      </div>
      <p className="example-notice coverage-help">{t(locale, "coverage.help")}</p>
      <div className="coverage-matrix">
        {LAYER_IDS.map((layerId) => {
          const layer = contract.layers[layerId];
          const label = t(locale, `layer.${layerId}` as MessageKey);
          const critical = target.criticalLayers.includes(layerId);
          return (
            <label className={`coverage-cell coverage-${layer.status}`} key={layerId}>
              <span className="coverage-name"><Icon name={layerIcons[layerId]} />{label}</span>
              <select aria-label={`${label} ${t(locale, "coverage.status")}`} value={layer.status} onChange={(event) => onChange(layerId, event.target.value as CoverageState)}>
                {COVERAGE_STATES.map((status) => <option value={status} key={status}>{t(locale, `coverage.${status}`)}</option>)}
              </select>
              <span className="coverage-critical">{critical ? t(locale, "coverage.critical") : t(locale, "coverage.supporting")}</span>
              <span className="coverage-scale" aria-hidden="true"><i /></span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
