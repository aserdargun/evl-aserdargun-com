# EVL Design Inventory

## Accepted concepts

- Desktop: `docs/design/evl-workbench-desktop.png` (1440 × 1100)
- Mobile: `docs/design/evl-workbench-mobile.png` (390 × 844)

The concepts are layout and design-system references. All application text,
controls, icons, tables, state, and interaction remain code-native.

## Allowed first-viewport copy

English:

- `EVL`
- `AI Evaluation & Reliability Lab`
- `Workbench`
- `Patterns`
- `Evidence`
- `System map`
- `TR`
- `Evaluation target`
- `Model & adaptation`
- `Inference & serving`
- `Retrieval & context`
- `Agent & tool use`
- `Security & authorization`
- `World model & planning`
- `Physical AI task`
- `Evaluation contract`
- `Evaluation claim`
- `Agent completes tasks correctly and safely`
- `Subject & version`
- `Evaluation unit`
- `Task set`
- `Success threshold`
- `Trials`
- `Grader mix`
- `Critical failures`
- `Evidence tier`
- `Review date`
- `Six-layer coverage`
- `Output`
- `Trajectory`
- `Outcome`
- `Robustness`
- `Safety`
- `Operations`
- `Covered`
- `Partial`
- `Missing`
- `Not applicable`
- `Release gate`
- `READY`
- `CONDITIONAL`
- `HOLD`
- `Why it is ready`
- `All release conditions met.`
- `Export JSON`
- `Reset reference`

Turkish equivalents:

- `AI Değerlendirme ve Güvenilirlik Laboratuvarı`
- `Çalışma alanı`
- `Desenler`
- `Kanıtlar`
- `Sistem haritası`
- `EN`
- `Değerlendirme hedefi`
- `Model ve uyarlama`
- `Çıkarım ve sunum`
- `Erişim ve bağlam`
- `Ajan ve araç kullanımı`
- `Güvenlik ve yetkilendirme`
- `Dünya modeli ve planlama`
- `Fiziksel AI görevi`
- `Değerlendirme sözleşmesi`
- `Değerlendirme iddiası`
- `Özne ve sürüm`
- `Değerlendirme birimi`
- `Görev kümesi`
- `Başarı eşiği`
- `Deneme sayısı`
- `Puanlayıcı karması`
- `Kritik hatalar`
- `Kanıt düzeyi`
- `Gözden geçirme tarihi`
- `Altı katmanlı kapsam`
- `Çıktı`
- `Yörünge`
- `Sonuç`
- `Sağlamlık`
- `Güvenlik`
- `Operasyonlar`
- `Kapsanıyor`
- `Kısmi`
- `Eksik`
- `Uygulanamaz`
- `Yayın kapısı`
- `HAZIR`
- `KOŞULLU`
- `BEKLET`
- `Neden hazır`
- `Tüm yayın koşulları karşılandı.`
- `JSON dışa aktar`
- `Referansı sıfırla`

## Tokens

| Role | Value |
| --- | --- |
| Page background | `#071116` |
| Raised background | `#0a171d` |
| Active row background | `#10232b` |
| Control background | `#09151b` |
| Primary text | `#f3f6f5` |
| Secondary text | `#b6c0c2` |
| Quiet text | `#7f9096` |
| Hairline border | `#30434b` |
| Strong border | `#52636a` |
| Active cyan | `#25d7e8` |
| Cyan dim | `#168b9a` |
| Conditional amber | `#f0aa00` |
| Blocker red | `#ff4d57` |
| Ready wash | `rgba(37, 215, 232, 0.06)` |
| Focus ring | `0 0 0 3px rgba(37, 215, 232, 0.28)` |
| Radius small | `2px` |
| Radius control | `4px` |
| Radius gate | `5px` |
| Hairline | `1px` |
| Space scale | `4, 8, 12, 16, 24, 32, 48, 64px` |
| Fast motion | `140ms` |
| Standard motion | `220ms` |

No gradient is permitted. Backgrounds are true cool graphite values, not cream,
warm gray, or blue-black glow treatments.

## Typography

- Primary family: `IBM Plex Sans Variable`, self-hosted; fallback
  `Inter, ui-sans-serif, system-ui, sans-serif`.
- Technical labels/data: `IBM Plex Mono Variable`, self-hosted; fallback
  `ui-monospace, SFMono-Regular, monospace`.
- Brand `EVL`: 36/40 desktop, 28/32 mobile, weight 600, tracking `0.015em`.
- Product title: 20/28 desktop, 14/18 mobile, weight 450.
- Page heading: 24/32 desktop, 24/30 mobile, weight 500.
- Section heading: 18/24, weight 500.
- Body/control value: 15/22 desktop, 14/20 mobile, weight 400.
- Field label/table heading: 12/16, weight 500, tracking `0.01em`.
- Status word: 40/44 desktop, 28/34 mobile, weight 500, tracking `0.03em`.
- Navigation/control chrome: 14/20, weight 450.

Control typography is assigned explicitly; no form element relies on browser
font defaults.

## Containers and component families

- Header: 68px desktop and 72px mobile; one bottom hairline, no floating wrapper.
- Desktop primary grid: `264px minmax(0, 1fr) 328px` with hairline dividers.
- Target rail: open full-height list; 64px rows; active row uses cyan left rule,
  cyan icon/text, and a quiet cyan wash.
- Contract workspace: open field grid, no containing card. The claim and task-set
  fields occupy two columns; compact fields occupy one.
- Form controls: 40px desktop / 48px mobile minimum height, square technical
  outline, dark fill, cyan focus ring.
- Coverage: six equal desktop columns inside one shared matrix border; on mobile,
  six 56px labeled rows inside one shared border.
- Gate: one strong cyan outline for `Ready`; amber and red variants retain the
  same anatomy. Findings are open rows separated by hairlines.
- Downstream desktop band: three unequal regions—patterns, evidence, system map.
  These are divided by shared full-height hairlines, not individual cards.
- Pattern entries: table-like open rows with one leading icon and one disclosure
  arrow; read-only in the first release.
- Evidence ledger: compact semantic table with source status and verified date.
- System map: one horizontal connection line and seven nodes on desktop; a
  vertical ordered relationship list on mobile.
- Privacy note: low-emphasis full-width footer row after the system map.

## Icon inventory

All icons use custom code-native SVG with `viewBox="0 0 24 24"`, `fill="none"`,
`stroke="currentColor"`, 1.65px stroke, round caps/joins, and optical centering.

| Icon | Meaning | Size | Treatment |
| --- | --- | --- | --- |
| Cube | Model & adaptation | 24 | outline |
| Server | Inference & serving | 24 | outline |
| Search orbit | Retrieval & context | 24 | outline |
| Agent head | Agent & tool use | 24 | outline |
| Shield | Security, safety | 24 | outline |
| Globe | World model | 24 | outline |
| Robot arm | Physical AI | 24 | outline |
| Document | Output | 24 | outline |
| Trajectory path | Trajectory | 24 | outline |
| Target | Outcome | 24 | outline |
| Calibration shield | Robustness | 24 | outline |
| Warning triangle | Partial/blocker | 24 | outline |
| Gear | Operations | 24 | outline |
| Check ring | Ready/covered | 24 or 48 | cyan outline |
| Download | Export | 20 | outline |
| Reset | Reset reference | 20 | outline |
| Chevron | Select/disclosure | 16 | outline, no text glyph |
| Language globe | Locale control | 20 | outline |

Icons inside labeled buttons are hidden from assistive technology. Standalone
status icons receive an accessible label or adjacent visible status text.

## Media treatment

There is no hero image, raster illustration, color overlay, or generated asset in
the shipped interface. Calibration ticks and system connections are structural
CSS or SVG. The accepted concept images remain design evidence only.

## Responsive contract

- `>= 1120px`: three-region primary grid and three-region downstream band.
- `760–1119px`: target rail collapses into a horizontal selector; contract and
  gate become a two-region grid; downstream regions stack.
- `< 760px`: one-column flow in the exact order target, contract, coverage, gate,
  patterns, evidence, system map, privacy.
- Mobile form pairs use two columns only at `>= 360px`; claim, target, task set,
  review date, and validation messages always span both columns.
- Desktop coverage matrix becomes a linear six-row list below 760px.
- The compact gate becomes sticky at the bottom on mobile only after the user has
  scrolled past the contract heading. It reserves safe-area padding and never
  obscures the focused control.
- Navigation anchors are not hidden behind a menu; on narrow screens the four
  links become a horizontally scrollable, keyboard-accessible rail below the
  compact brand row.
- No viewport may have document-level horizontal overflow at 320px or wider.
- Motion is limited to color/border/opacity changes. Under
  `prefers-reduced-motion: reduce`, durations become `0.01ms` and smooth scrolling
  is disabled.

## Core interaction lock

1. Select a target and load its reference contract.
2. Edit contract fields without losing state when locale changes.
3. Toggle layer evidence and observe the deterministic gate change.
4. Inspect the ordered reason trail.
5. Filter evidence without mutating the contract.
6. Export a versioned local JSON snapshot.
7. Reset only after in-app confirmation.
