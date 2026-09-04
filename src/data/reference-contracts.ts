import {
  evaluationContractSchema,
  LAYER_IDS,
  type EvaluationContract,
  type LayerId,
  type TargetId,
} from "../domain/schemas";
import type { Locale } from "../i18n";

type TargetConfig = {
  unit: EvaluationContract["unit"];
  metric: string;
  threshold: number;
  trials: number;
  sources: string[];
};

type TargetCopy = {
  subject: string;
  claim: string;
  taskSet: string;
  population: string;
  failures: string[];
};

const targetConfig: Record<TargetId, TargetConfig> = {
  model: {
    unit: "output",
    metric: "pass-rate",
    threshold: 0.9,
    trials: 120,
    sources: ["openai-graders", "nist-ai-measurement"],
  },
  inference: {
    unit: "mixed",
    metric: "conformance-rate",
    threshold: 0.99,
    trials: 200,
    sources: ["openai-graders", "nist-tevv-athlon"],
  },
  retrieval: {
    unit: "outcome",
    metric: "grounded-success-rate",
    threshold: 0.92,
    trials: 150,
    sources: ["nist-tevv-athlon", "openai-graders"],
  },
  agent: {
    unit: "trajectory",
    metric: "safe-success-rate",
    threshold: 0.88,
    trials: 100,
    sources: ["anthropic-agent-evals", "openai-graders"],
  },
  security: {
    unit: "outcome",
    metric: "defense-success-rate",
    threshold: 0.97,
    trials: 240,
    sources: ["nist-ai-measurement", "nist-tevv-athlon"],
  },
  "world-model": {
    unit: "outcome",
    metric: "valid-rollout-rate",
    threshold: 0.85,
    trials: 180,
    sources: ["nist-ai-measurement", "nist-tevv-athlon"],
  },
  "physical-ai": {
    unit: "outcome",
    metric: "safe-completion-rate",
    threshold: 0.9,
    trials: 120,
    sources: ["nist-ai-measurement", "nist-tevv-athlon"],
  },
};

const targetCopy: Record<Locale, Record<TargetId, TargetCopy>> = {
  en: {
    model: {
      subject: "Instruction-following model candidate",
      claim: "The candidate produces correct, robust answers on the defined task slice.",
      taskSet: "Versioned multilingual instruction set",
      population: "Representative English and Turkish prompts across difficulty strata",
      failures: ["Unsafe or fabricated answer on a critical prompt"],
    },
    inference: {
      subject: "Production inference runtime candidate",
      claim: "The runtime preserves answer quality while meeting the operating envelope.",
      taskSet: "Pinned serving conformance and load scenarios",
      population: "Cold, warm, and sustained-load requests",
      failures: ["Silent output corruption or an unbounded serving failure"],
    },
    retrieval: {
      subject: "Retrieval pipeline candidate",
      claim: "Retrieved context supports grounded answers for the intended corpus.",
      taskSet: "Versioned retrieval and grounded-answer cases",
      population: "Known-answer, ambiguous, stale, and no-answer queries",
      failures: ["Unsupported answer presented as grounded"],
    },
    agent: {
      subject: "Tool-using agent candidate",
      claim: "The agent reaches the intended outcome through safe, inspectable trajectories.",
      taskSet: "Versioned multi-step tool-use scenarios",
      population: "Nominal, ambiguous, recovery, and refusal tasks",
      failures: ["Irreversible action without authorization", "Critical tool misuse"],
    },
    security: {
      subject: "Adversarial defense candidate",
      claim: "The system resists defined attacks without breaking legitimate workflows.",
      taskSet: "Threat-modelled adversarial and benign controls",
      population: "Prompt injection, data exfiltration, abuse, and false-positive cases",
      failures: ["Protected data disclosure", "Unauthorized privileged action"],
    },
    "world-model": {
      subject: "Predictive world-model candidate",
      claim: "The model predicts task-relevant state transitions under distribution shifts.",
      taskSet: "Pinned simulation rollouts and counterfactual probes",
      population: "Nominal, sparse, perturbed, and held-out environments",
      failures: ["Physically invalid transition accepted as reliable"],
    },
    "physical-ai": {
      subject: "Embodied task policy candidate",
      claim: "The policy completes the task safely within the operating envelope.",
      taskSet: "Versioned simulation and supervised physical trials",
      population: "Nominal, occluded, perturbed, and safe-stop scenarios",
      failures: ["Safety-envelope breach", "Failure to enter a safe state"],
    },
  },
  tr: {
    model: {
      subject: "Talimat izleme modeli adayı",
      claim: "Aday, tanımlı görev kesitinde doğru ve sağlam yanıtlar üretir.",
      taskSet: "Sürümlenmiş çok dilli talimat kümesi",
      population: "Zorluk katmanlarına yayılmış temsili İngilizce ve Türkçe istemler",
      failures: ["Kritik bir istemde güvensiz veya uydurma yanıt"],
    },
    inference: {
      subject: "Üretim çıkarım çalışma zamanı adayı",
      claim: "Çalışma zamanı, işletim sınırlarını karşılarken yanıt kalitesini korur.",
      taskSet: "Sabitlenmiş servis uyumluluğu ve yük senaryoları",
      population: "Soğuk, sıcak ve sürekli yük altındaki istekler",
      failures: ["Sessiz çıktı bozulması veya sınırlandırılmamış servis hatası"],
    },
    retrieval: {
      subject: "Getirim hattı adayı",
      claim: "Getirilen bağlam, amaçlanan derlem için dayanaklı yanıtları destekler.",
      taskSet: "Sürümlenmiş getirim ve dayanaklı yanıt vakaları",
      population: "Yanıtı bilinen, belirsiz, eski ve yanıtsız sorgular",
      failures: ["Desteklenmeyen bir yanıtın dayanaklı olarak sunulması"],
    },
    agent: {
      subject: "Araç kullanan ajan adayı",
      claim: "Ajan, güvenli ve incelenebilir izler üzerinden amaçlanan sonuca ulaşır.",
      taskSet: "Sürümlenmiş çok adımlı araç kullanımı senaryoları",
      population: "Normal, belirsiz, kurtarma ve reddetme görevleri",
      failures: ["Yetkisiz geri döndürülemez eylem", "Kritik araç kötüye kullanımı"],
    },
    security: {
      subject: "Saldırılara karşı savunma adayı",
      claim: "Sistem, meşru iş akışlarını bozmadan tanımlı saldırılara dayanır.",
      taskSet: "Tehdit modeliyle tanımlı saldırı ve zararsız kontrol vakaları",
      population: "İstem enjeksiyonu, veri sızdırma, kötüye kullanım ve yanlış pozitif vakaları",
      failures: ["Korunan verinin açığa çıkması", "Yetkisiz ayrıcalıklı eylem"],
    },
    "world-model": {
      subject: "Öngörücü dünya modeli adayı",
      claim: "Model, dağılım kaymalarında görevle ilgili durum geçişlerini öngörür.",
      taskSet: "Sabitlenmiş simülasyon açılımları ve karşı-olgusal sondalar",
      population: "Normal, seyrek, bozulmuş ve ayrılmış ortamlar",
      failures: ["Fiziksel olarak geçersiz bir geçişin güvenilir kabul edilmesi"],
    },
    "physical-ai": {
      subject: "Fiziksel görev politikası adayı",
      claim: "Politika, işletim sınırları içinde görevi güvenle tamamlar.",
      taskSet: "Sürümlenmiş simülasyonlar ve gözetimli fiziksel denemeler",
      population: "Normal, örtülü, bozulmuş ve güvenli duruş senaryoları",
      failures: ["Güvenlik sınırının aşılması", "Güvenli duruma geçilememesi"],
    },
  },
};

const layerNames: Record<Locale, Record<LayerId, string>> = {
  en: {
    output: "output",
    trajectory: "trajectory",
    outcome: "outcome",
    robustness: "robustness",
    safety: "safety",
    operations: "operations",
  },
  tr: {
    output: "çıktı",
    trajectory: "iz",
    outcome: "sonuç",
    robustness: "sağlamlık",
    safety: "güvenlik",
    operations: "operasyon",
  },
};

function makeContract(targetId: TargetId, locale: Locale): EvaluationContract {
  const config = targetConfig[targetId];
  const copy = targetCopy[locale][targetId];
  const layers = Object.fromEntries(
    LAYER_IDS.map((layerId) => [
      layerId,
      {
        applicable: true,
        status: "covered",
        rationale:
          locale === "en"
            ? `Planning example: ${layerNames.en[layerId]} evidence is required and reviewed for this target.`
            : `Planlama örneği: Bu hedef için ${layerNames.tr[layerId]} kanıtı gerekli ve gözden geçirilmiş olmalıdır.`,
        evidenceSourceIds: config.sources,
      },
    ]),
  );

  return evaluationContractSchema.parse({
    schemaVersion: 1,
    id: `${targetId}-reference-contract`,
    targetId,
    subject: copy.subject,
    subjectVersion: "planning-example-1",
    claim: copy.claim,
    unit: config.unit,
    taskSet: copy.taskSet,
    population: copy.population,
    successCriteria:
      locale === "en"
        ? `Meet the ${config.metric} threshold with no critical failures; planning example only, not a benchmark result.`
        : `${config.metric} eşiğini kritik hata olmadan karşıla; bu yalnızca bir planlama örneğidir, kıyaslama sonucu değildir.`,
    threshold: {
      metric: config.metric,
      operator: ">=",
      value: config.threshold,
      unit: "ratio",
    },
    trials: config.trials,
    samplingRationale:
      locale === "en"
        ? "Stratified cases cover normal operation, difficult edges, and explicitly defined failures."
        : "Katmanlı vakalar normal işleyişi, zor sınır durumlarını ve açıkça tanımlı hataları kapsar.",
    graders: [
      {
        id: `${targetId}-rule-grader`,
        family: "rule",
        label: locale === "en" ? "Deterministic release checks" : "Deterministik yayın denetimleri",
        critical: true,
      },
      {
        id: `${targetId}-human-grader`,
        family: "human",
        label: locale === "en" ? "Blind expert review" : "Kör uzman incelemesi",
        critical: true,
      },
    ],
    arbitrationRule:
      locale === "en"
        ? "Any critical grader failure blocks release; disagreements receive blind expert adjudication."
        : "Her kritik değerlendirici hatası yayını engeller; anlaşmazlıkları kör bir uzman karara bağlar.",
    criticalFailures: copy.failures,
    environmentAssumptions: [
      locale === "en"
        ? "Pinned task, data, runtime, grader, and dependency versions"
        : "Sabitlenmiş görev, veri, çalışma zamanı, değerlendirici ve bağımlılık sürümleri",
    ],
    evidenceTier: "official_guidance",
    evidenceSourceIds: config.sources,
    reviewDate: "2026-12-01",
    uncertaintyAcknowledged: true,
    layers,
  });
}

export function referenceContractFor(
  targetId: TargetId,
  locale: Locale,
): EvaluationContract {
  return makeContract(targetId, locale);
}

export const referenceContracts = (Object.keys(targetConfig) as TargetId[]).map(
  (targetId) => makeContract(targetId, "en"),
);

export const turkishReferenceContracts = (
  Object.keys(targetConfig) as TargetId[]
).map((targetId) => makeContract(targetId, "tr"));
