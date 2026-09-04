import { useMemo, useState } from "react";

import { evidenceSources } from "../data/evidence";
import { referenceContractFor } from "../data/reference-contracts";
import { targets } from "../data/targets";
import { evaluateContract } from "../domain/evaluate-contract";
import {
  loadWorkbench,
  saveWorkbench,
  type LoadWorkbenchResult,
} from "../domain/persistence";
import type {
  CoverageState,
  EvaluationContract,
  LayerId,
  PersistedWorkbench,
  TargetId,
} from "../domain/schemas";
import type { Locale } from "../i18n";

export type PersistenceNotice = "invalid" | "unsupported" | "saveFailed" | null;

type WorkbenchOptions = {
  storage?: Storage;
  now?: () => Date;
};

const currentTime = () => new Date();

function initialState(storage: Storage, locale: Locale): {
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
      loaded.status === "invalid" || loaded.status === "unsupported"
        ? loaded.status
        : null,
  };
}

export function useWorkbench(locale: Locale, options: WorkbenchOptions = {}) {
  const storage = options.storage ?? window.localStorage;
  const now = options.now ?? currentTime;
  const [initial] = useState(() => initialState(storage, locale));
  const [state, setState] = useState(initial.state);
  const [persistenceNotice, setPersistenceNotice] =
    useState<PersistenceNotice>(initial.notice);

  const persist = (next: PersistedWorkbench) => {
    setState(next);
    setPersistenceNotice(saveWorkbench(storage, next) ? null : "saveFailed");
  };

  const target = targets.find(({ id }) => id === state.selectedTargetId);
  if (!target) throw new Error(`Missing evaluation target: ${state.selectedTargetId}`);

  const result = useMemo(
    () =>
      evaluateContract(
        state.contract,
        target,
        evidenceSources,
        now().toISOString(),
      ),
    [now, state.contract, target],
  );

  function updateField<K extends keyof EvaluationContract>(
    field: K,
    value: EvaluationContract[K],
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
    persist({
      schemaVersion: 1,
      selectedTargetId: targetId,
      contract: referenceContractFor(targetId, locale),
    });
  }

  function reset(): void {
    persist({
      schemaVersion: 1,
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
    updateField,
    updateLayer,
    selectTarget,
    reset,
  };
}
