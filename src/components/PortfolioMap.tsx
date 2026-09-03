import { portfolioApps } from "../data/portfolio";
import type { Locale, MessageKey } from "../i18n";
import { t } from "../i18n";
import { Icon } from "./icons";

export function PortfolioMap({ locale }: { locale: Locale }) {
  return (
    <section className="downstream-panel portfolio-map" id="system-map" aria-labelledby="portfolio-heading">
      <div className="section-heading">
        <span>{t(locale, "portfolio.kicker")}</span>
        <h2 id="portfolio-heading">{t(locale, "portfolio.heading")}</h2>
      </div>
      <ol className="system-line">
        {portfolioApps.map((app) => (
          <li key={app.code} className={app.status} data-testid={`portfolio-${app.code}`}>
            <span className="system-node"><Icon name={app.status === "active" ? "check" : "reset"} /></span>
            {app.url ? (
              <a href={app.url}><strong>{t(locale, app.labelKey as MessageKey)}</strong><span>{t(locale, app.roleKey as MessageKey)}</span></a>
            ) : (
              <div><strong>{t(locale, app.labelKey as MessageKey)}</strong><span>{t(locale, app.roleKey as MessageKey)}</span><em>{t(locale, "portfolio.planned")}</em></div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
