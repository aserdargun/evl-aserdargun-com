import { patterns } from "../data/patterns";
import type { Locale, MessageKey } from "../i18n";
import { t } from "../i18n";
import { Icon } from "./icons";

const icons = ["document", "trajectory", "target", "reset", "shield", "warning", "gear"] as const;

export function PatternLibrary({ locale }: { locale: Locale }) {
  return (
    <section className="downstream-panel pattern-library" id="patterns" aria-labelledby="patterns-heading">
      <div className="section-heading">
        <span>{t(locale, "pattern.kicker")}</span>
        <h2 id="patterns-heading">{t(locale, "pattern.heading")}</h2>
      </div>
      <div className="pattern-rows">
        {patterns.map((pattern, index) => (
          <article className="pattern-row" key={pattern.id}>
            <Icon name={icons[index] ?? "document"} />
            <div><h3>{t(locale, pattern.titleKey as MessageKey)}</h3><p>{t(locale, pattern.descriptionKey as MessageKey)}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
