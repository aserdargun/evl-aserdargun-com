import {
  persistedWorkbenchSchema,
  type PersistedWorkbench,
} from "./schemas";

export const STORAGE_KEY = "evl.workbench.v1";

export type LoadWorkbenchResult =
  | { status: "loaded"; state: PersistedWorkbench }
  | { status: "empty" }
  | { status: "unsupported" }
  | { status: "unavailable" }
  | { status: "invalid" };

export function loadWorkbench(storage: Storage | undefined): LoadWorkbenchResult {
  let raw: string | null;
  try {
    if (!storage) return { status: "unavailable" };
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return { status: "unavailable" };
  }
  try {
    if (raw === null) return { status: "empty" };
    const candidate: unknown = JSON.parse(raw);
    if (
      typeof candidate === "object" &&
      candidate !== null &&
      "schemaVersion" in candidate &&
      candidate.schemaVersion !== 1
    ) {
      return { status: "unsupported" };
    }
    const parsed = persistedWorkbenchSchema.safeParse(candidate);
    return parsed.success
      ? { status: "loaded", state: parsed.data }
      : { status: "invalid" };
  } catch {
    return { status: "invalid" };
  }
}

export function saveWorkbench(
  storage: Storage | undefined,
  state: PersistedWorkbench,
): boolean {
  try {
    if (!storage || loadWorkbench(storage).status === "unsupported") return false;
    storage.setItem(STORAGE_KEY, JSON.stringify(persistedWorkbenchSchema.parse(state)));
    return true;
  } catch {
    return false;
  }
}

export function clearWorkbench(storage: Storage): boolean {
  try {
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
