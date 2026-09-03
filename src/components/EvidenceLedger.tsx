import { evidenceSources } from "../data/evidence";
import { patterns } from "../data/patterns";
import { LAYER_IDS, type LayerId } from "../domain/schemas";
import type { Locale, MessageKey } from "../i18n";
import { t } from "../i18n";

type Props = { locale: Locale; filter: "all" | LayerId; onFilter: (filter: "all" | LayerId) => void };

export function EvidenceLedger({ locale, filter, onFilter }: Props) {
  const visibleSources = evidenceSources.filter((source) => {
    if (filter === "all") return true;
    const sourcePatterns = patterns.filter((pattern) => source.supportedPatternIds.includes(pattern.id));
    return sourcePatterns.some(({ layerIds }) => layerIds.includes(filter));
  });
  return (
    <section className="downstream-panel evidence-ledger" id="evidence" aria-labelledby="evidence-heading">
      <div className="section-heading ledger-heading">
        <div><span>{t(locale, "evidence.kicker")}</span><h2 id="evidence-heading">{t(locale, "evidence.heading")}</h2></div>
        <label className="filter-label">
          <span className="visually-hidden">Filter evidence by layer</span>
          <select aria-label="Filter evidence by layer" value={filter} onChange={(event) => onFilter(event.target.value as "all" | LayerId)}>
            <option value="all">{t(locale, "evidence.all")}</option>
            {LAYER_IDS.map((layerId) => <option value={layerId} key={layerId}>{t(locale, `layer.${layerId}` as MessageKey)}</option>)}
          </select>
        </label>
      </div>
      <div className="evidence-table-wrap">
        <table>
          <thead><tr><th>{t(locale, "evidence.source")}</th><th>{t(locale, "evidence.tier")}</th><th>{t(locale, "evidence.limitation")}</th></tr></thead>
          <tbody>
            {visibleSources.map((source) => (
              <tr key={source.id}>
                <td><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a><small>{source.organization} · {source.verifiedAt}</small></td>
                <td><code>{source.tier.replace("_", " ")}</code></td>
                <td>{t(locale, source.limitationKey as MessageKey)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
