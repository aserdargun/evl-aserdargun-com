import { LAYER_IDS, type CoverageState, type EvaluationContract, type EvaluationTarget, type LayerId } from "../domain/schemas";
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
  contract: EvaluationContract;
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
      <div className="coverage-matrix">
        {LAYER_IDS.map((layerId) => {
          const layer = contract.layers[layerId];
          const label = t(locale, `layer.${layerId}` as MessageKey);
          const critical = target.criticalLayers.includes(layerId);
          return (
            <label className={`coverage-cell coverage-${layer.status}`} key={layerId}>
              <input
                type="checkbox"
                checked={layer.status === "covered"}
                aria-label={`${label} ${locale === "en" ? "evidence" : "kanıtı"}`}
                onChange={(event) => onChange(layerId, event.target.checked ? "covered" : "missing")}
              />
              <span className="coverage-name"><Icon name={layerIcons[layerId]} />{label}</span>
              <span className="coverage-state">{t(locale, `coverage.${layer.status}` as MessageKey)}</span>
              <span className="coverage-critical">{critical ? t(locale, "coverage.critical") : t(locale, "coverage.supporting")}</span>
              <span className="coverage-scale" aria-hidden="true"><i /></span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
