import type { Locale } from "../i18n";
import { t } from "../i18n";
import { Icon } from "./icons";

type Props = { locale: Locale; onLocaleChange: (locale: Locale) => void };

export function Header({ locale, onLocaleChange }: Props) {
  const otherLocale: Locale = locale === "en" ? "tr" : "en";
  return (
    <header className="site-header">
      <div className="brand-lockup">
        <span className="brand-mark">EVL</span>
        <span className="brand-rule" aria-hidden="true" />
        <h1>{locale === "en" ? "AI Evaluation & Reliability Lab" : "AI Değerlendirme ve Güvenilirlik Laboratuvarı"}</h1>
      </div>
      <nav className="primary-nav" aria-label="Primary">
        <a className="active" href="#workbench">{t(locale, "nav.workbench")}</a>
        <a href="#patterns">{t(locale, "nav.patterns")}</a>
        <a href="#evidence">{t(locale, "nav.evidence")}</a>
        <a href="#system-map">{t(locale, "nav.systemMap")}</a>
      </nav>
      <div className="locale-control">
        <Icon name="globe" />
        <a
          href={`/${otherLocale}`}
          aria-label={otherLocale === "tr" ? "Türkçe" : "English"}
          onClick={(event) => {
            event.preventDefault();
            window.history.pushState({}, "", `/${otherLocale}`);
            onLocaleChange(otherLocale);
          }}
        >
          {t(locale, "language.short")}
          <Icon name="chevron" />
        </a>
      </div>
    </header>
  );
}
