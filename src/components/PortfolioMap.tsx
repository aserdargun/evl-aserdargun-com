import { portfolioApps, portfolioGroups } from "../data/portfolio";
import type { Locale, MessageKey } from "../i18n";
import { t } from "../i18n";

export function PortfolioMap({ locale }: { locale: Locale }) {
  return (
    <section className="downstream-panel portfolio-map" id="system-map" aria-labelledby="portfolio-heading">
      <div className="section-heading">
        <span>{t(locale, "portfolio.kicker")}</span>
        <h2 id="portfolio-heading">{t(locale, "portfolio.heading")}</h2>
      </div>
      <p className="observer-note">{t(locale, "portfolio.boundary")}</p>
      <a className="portfolio-home" href={`https://aserdargun.com/${locale === "tr" ? "tr/" : ""}`} target="_blank" rel="noreferrer">{t(locale, "portfolio.home")} ↗</a>
      <div className="portfolio-groups">
        {portfolioGroups.map(({ targetId, codes }) => (
          <section key={targetId} aria-labelledby={`portfolio-group-${targetId}`}>
            <h3 id={`portfolio-group-${targetId}`}>{t(locale, `target.${targetId}`)}</h3>
            <ul className="portfolio-links">
              {codes.map((code) => {
                const app = portfolioApps.find((entry) => entry.code === code)!;
                return (
                  <li key={app.code} className={app.status} data-testid={`portfolio-${app.code}`}>
                    <a href={app.url} target="_blank" rel="noreferrer">
                      <strong>{t(locale, app.labelKey as MessageKey)}</strong>
                      <span>{t(locale, app.roleKey as MessageKey)}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      <p className="observer-note">{t(locale, "portfolio.context")}</p>
    </section>
  );
}
