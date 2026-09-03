# EVL Fidelity Ledger

## Evidence set

| Role | File | Native size | Capture method |
| --- | --- | --- | --- |
| Accepted desktop concept | `docs/design/evl-workbench-desktop.png` | 1440 × 1100 | Approved concept image |
| Rendered desktop | `docs/design/evl-rendered-desktop.png` | 1440 × 1100 | Playwright Chromium, `/en` |
| Accepted mobile concept | `docs/design/evl-workbench-mobile.png` | 390 × 844 | Approved concept image |
| Rendered mobile | `docs/design/evl-rendered-mobile.png` | 390 × 844 | Playwright Chromium, `/en` |

Both pairs were inspected at original resolution with `view_image` in the same
QA pass. The local site was also exercised in the Codex in-app browser at both
native viewports. That pass confirmed the English-to-Turkish route change,
preservation of an edited claim, the `READY` to `HOLD` transition, and an empty
browser warning/error log.

## Comparison

| Point | Concept evidence | Rendered evidence | Result or fix |
| --- | --- | --- | --- |
| Copy and order | Target, contract, coverage, gate, then the three lower regions | Same semantic order in both layouts | Matched. Reference values use explicit planning examples instead of implying measured benchmark results. |
| First-viewport balance | Desktop splits 264px target rail, open work area, and 328px gate rail | Exact desktop rail widths and a shared lower-band divider | Matched after compacting the contract into four rows. |
| Typography | IBM Plex Sans with monospaced technical labels | Self-hosted IBM Plex Sans Variable and IBM Plex Mono | Matched; browser-native date and select glyphs remain platform controls. |
| Palette | Cool graphite, cyan active state, amber conditional, red blocker; no gradient | Token values match the inventory and no gradients ship | Matched. |
| Container model | Open rails and one shared coverage matrix; no card grid | Full-height hairlines, one matrix border, one gate outline | Matched. |
| Spacing | Dense metrology-console rhythm | 4–24px working rhythm with 40px desktop controls | Matched after reducing excess vertical form rows. |
| Icon treatment | Consistent 24-unit outline set | Code-native SVG, `currentColor`, 1.65px round strokes | Matched; no raster UI icons ship. |
| Gate states | Cyan ready, amber conditional, red hold | All three use identical anatomy and deterministic engine output | Matched. The shipped ready example marks all six layers covered so the visible state never contradicts the gate. |
| Mobile transformation | Linear target, contract, coverage, gate flow | One-column flow, two-column field pairs, six linear coverage rows | Matched structurally. The header navigation remains a keyboard-accessible horizontal rail as required by the responsive contract. |
| Mobile reachability | Compact concept shows coverage and gate within 844px | Controls remain at least 44px; coverage follows below the initial fold and the gate becomes sticky when reached | Intentional deviation: minimum target size and readable planning data take precedence over compressing controls to the concept's smaller geometry. |
| Motion | Only restrained state changes | Color and border transitions only; reduced-motion removes duration and smooth scrolling | Matched. |
| Core interaction | Choose target, change evidence, inspect gate, export, reset | Covered by component and browser tests in both locales | Matched. Reset requires an in-app confirmation. |
| Overflow and focus | No document-level horizontal scroll; visible control focus | 1440×1100 and 390×844 both report equal client and scroll widths; focused claim remains in-view | Matched. The mobile nav owns its horizontal scrolling and hides its scrollbar. |

## Above-the-fold copy diff

The structural labels match the accepted inventory: brand, navigation, seven
targets, contract field labels, six layer names, gate labels, export, and reset.
The values differ intentionally: the concept's illustrative product/version,
task count, date, and grader weights were replaced by a clearly labelled agent
planning example. The rendered gate explanation is engine-derived and therefore
does not claim that a benchmark threshold was actually met.

## Agency sign-off

The implementation preserves the accepted metrology-lab identity and its
information hierarchy. Remaining visual differences are deliberate product
integrity or accessibility choices, not unresolved layout defects. No fixable
desktop/mobile mismatch remains in the approved scope.
