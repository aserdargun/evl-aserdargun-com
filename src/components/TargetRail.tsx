import { targets } from "../data/targets";
import type { TargetId } from "../domain/schemas";
import type { Locale, MessageKey } from "../i18n";
import { t } from "../i18n";
import { Icon } from "./icons";

type Props = { locale: Locale; selected: TargetId; onSelect: (id: TargetId) => void };

export function TargetRail({ locale, selected, onSelect }: Props) {
  return (
    <aside className="target-rail" aria-labelledby="target-heading">
      <h2 id="target-heading">{t(locale, "target.heading")}</h2>
      <div className="target-select-wrap">
        <select aria-label={t(locale, "target.heading")} value={selected} onChange={(event) => onSelect(event.target.value as TargetId)}>
          {targets.map((target) => <option key={target.id} value={target.id}>{t(locale, target.labelKey as MessageKey)}</option>)}
        </select>
      </div>
      <div className="target-list">
        {targets.map((target) => (
          <button
            type="button"
            key={target.id}
            className={target.id === selected ? "selected" : ""}
            aria-pressed={target.id === selected}
            onClick={() => onSelect(target.id)}
          >
            <Icon name={target.icon} />
            <span>{t(locale, target.labelKey as MessageKey)}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
