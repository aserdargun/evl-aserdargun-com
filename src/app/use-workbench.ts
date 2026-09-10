import { useEffect, useState } from "react";

import { evidenceSources } from "../data/evidence";
import { referenceContractFor } from "../data/reference-contracts";
import { targets } from "../data/targets";
import { evaluateContract } from "../domain/evaluate-contract";
import {
  loadWorkbench,
  saveWorkbench,
  type LoadWorkbenchResult,
} from "../domain/persistence";
import { evaluationContractSchema } from "../domain/schemas";
import type {
  CoverageState,
  ContractDraft,
  LayerId,
  PersistedWorkbench,
  TargetId,
} from "../domain/schemas";
import type { Locale } from "../i18n";

export type PersistenceNotice = "invalid" | "unsupported" | "unavailable" | "saveFailed" | null;

type WorkbenchOptions = {
  storage?: Storage;
  now?: () => Date;
};

const currentTime = () => new Date();

function initialState(storage: Storage | undefined, locale: Locale): {
  state: PersistedWorkbench;
  notice: PersistenceNotice;
} {
  const loaded: LoadWorkbenchResult = loadWorkbench(storage);
  if (loaded.status === "loaded") return { state: loaded.state, notice: null };
  return {
    state: {
      schemaVersion: 1,
      selectedTargetId: "agent",
      contract: referenceContractFor("agent", locale),
    },
    notice:
      loaded.status === "invalid" || loaded.status === "unsupported" || loaded.status === "unavailable"
        ? loaded.status
        : null,
  };
}

export function useWorkbench(locale: Locale, options: WorkbenchOptions = {}) {
  const [storage] = useState(() => {
    try { return options.storage ?? window.localStorage; } catch { return undefined; }
  });
  const now = options.now ?? currentTime;
  const [, setClockTick] = useState(0);
  useEffect(() => {
    const refresh = () => setClockTick((tick) => tick + 1);
    const timer = window.setInterval(refresh, 60_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  const [initial] = useState(() => initialState(storage, locale));
  const [state, setState] = useState(initial.state);
  const [persistenceNotice, setPersistenceNotice] =
    useState<PersistenceNotice>(initial.notice);

  const persist = (next: PersistedWorkbench) => {
    next = { ...next, drafts: { ...next.drafts, [next.selectedTargetId]: next.contract } };
    setState(next);
    setPersistenceNotice(saveWorkbench(storage, next) ? null : "saveFailed");
  };

  const target = targets.find(({ id }) => id === state.selectedTargetId);
  if (!target) throw new Error(`Missing evaluation target: ${state.selectedTargetId}`);

  const result = evaluateContract(state.contract, target, evidenceSources, now().toISOString());

  function updateField<K extends keyof ContractDraft>(
    field: K,
    value: ContractDraft[K],
  ): void {
    persist({ ...state, contract: { ...state.contract, [field]: value } });
  }

  function updateLayer(layerId: LayerId, status: CoverageState): void {
    persist({
      ...state,
      contract: {
        ...state.contract,
        layers: {
          ...state.contract.layers,
          [layerId]: {
            ...state.contract.layers[layerId],
            applicable: status !== "not_applicable",
            status,
          },
        },
      },
    });
  }

  function selectTarget(targetId: TargetId): void {
    if (targetId === state.selectedTargetId) return;
    persist({
      ...state,
      selectedTargetId: targetId,
      drafts: { ...state.drafts, [state.selectedTargetId]: state.contract },
      contract: state.drafts?.[targetId] ?? referenceContractFor(targetId, locale),
    });
  }

  function reset(): void {
    persist({
      ...state,
      selectedTargetId: state.selectedTargetId,
      contract: referenceContractFor(state.selectedTargetId, locale),
    });
  }

  return {
    locale,
    selectedTargetId: state.selectedTargetId,
    target,
    contract: state.contract,
    result,
    persistenceNotice,
    canExport: evaluationContractSchema.safeParse(state.contract).success,
    updateField,
    updateLayer,
    selectTarget,
    reset,
  };
}
