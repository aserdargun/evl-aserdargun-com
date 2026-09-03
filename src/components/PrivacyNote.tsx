import type { Locale } from "../i18n";
import { t } from "../i18n";
import { Icon } from "./icons";

export function PrivacyNote({ locale }: { locale: Locale }) {
  return <footer className="privacy-note"><Icon name="shield" /><p>{t(locale, "privacy.localOnly")} <span>{t(locale, "footer.methodology")}</span></p></footer>;
}
