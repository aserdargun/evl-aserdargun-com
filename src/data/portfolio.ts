import { portfolioAppSchema } from "../domain/schemas";

export const portfolioApps = [
  { code: "usl", labelKey: "portfolio.usl", roleKey: "portfolio.usl.role", status: "active", url: "https://usl.aserdargun.com" },
  { code: "llm", labelKey: "portfolio.llm", roleKey: "portfolio.llm.role", status: "active", url: "https://llm.aserdargun.com" },
  { code: "ctx", labelKey: "portfolio.ctx", roleKey: "portfolio.ctx.role", status: "active", url: "https://ctx.aserdargun.com" },
  { code: "hns", labelKey: "portfolio.hns", roleKey: "portfolio.hns.role", status: "active", url: "https://hns.aserdargun.com" },
  { code: "sec", labelKey: "portfolio.sec", roleKey: "portfolio.sec.role", status: "active", url: "https://sec.aserdargun.com" },
  { code: "wfm", labelKey: "portfolio.wfm", roleKey: "portfolio.wfm.role", status: "active", url: "https://wfm.aserdargun.com" },
  { code: "eng", labelKey: "portfolio.eng", roleKey: "portfolio.eng.role", status: "active", url: "https://eng.aserdargun.com" },
].map((app) => portfolioAppSchema.parse(app));
