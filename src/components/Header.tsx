import { useEffect, useState } from "react";
import type { Locale } from "../i18n";
import { t } from "../i18n";
import { Icon } from "./icons";

type Props = { locale: Locale; onLocaleChange: (locale: Locale) => void };

export function Header({ locale, onLocaleChange }: Props) {
  const [activeSection, setActiveSection] = useState(() => window.location.hash || "#workbench");
  useEffect(() => {
    const update = () => setActiveSection(window.location.hash || "#workbench");
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    return () => { window.removeEventListener("hashchange", update); window.removeEventListener("popstate", update); };
  }, []);
  const otherLocale: Locale = locale === "en" ? "tr" : "en";
  return (
    <header className="site-header">
      <div className="brand-lockup">
        <span className="brand-mark">EVL</span>
        <span className="brand-rule" aria-hidden="true" />
        <h1>{t(locale, "app.name")}</h1>
      </div>
      <nav className="primary-nav" aria-label={t(locale, "nav.primary")}>
        <a className={activeSection === "#workbench" ? "active" : undefined} aria-current={activeSection === "#workbench" ? "location" : undefined} href="#workbench">{t(locale, "nav.workbench")}</a>
        <a className={activeSection === "#patterns" ? "active" : undefined} aria-current={activeSection === "#patterns" ? "location" : undefined} href="#patterns">{t(locale, "nav.patterns")}</a>
        <a className={activeSection === "#evidence" ? "active" : undefined} aria-current={activeSection === "#evidence" ? "location" : undefined} href="#evidence">{t(locale, "nav.evidence")}</a>
        <a className={activeSection === "#system-map" ? "active" : undefined} aria-current={activeSection === "#system-map" ? "location" : undefined} href="#system-map">{t(locale, "nav.systemMap")}</a>
      </nav>
      <div className="locale-control">
        <Icon name="globe" />
        <a
          href={`/${otherLocale}`}
          aria-label={otherLocale === "tr" ? "Türkçe" : "English"}
          onClick={(event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
            event.preventDefault();
            window.history.pushState({}, "", `/${otherLocale}${window.location.hash}`);
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
