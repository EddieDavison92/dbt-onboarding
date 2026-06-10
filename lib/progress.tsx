"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const KEY = "dbt-onboarding-progress-v1";

type ProgressState = {
  /** completed page ids, e.g. "learn/why-dbt" */
  done: string[];
  /** ticked checklist item ids */
  checks: string[];
};

type ProgressContextValue = ProgressState & {
  ready: boolean;
  toggleDone: (id: string) => void;
  isDone: (id: string) => boolean;
  toggleCheck: (id: string) => void;
  isChecked: (id: string) => boolean;
  reset: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        done: Array.isArray(parsed.done) ? parsed.done : [],
        checks: Array.isArray(parsed.checks) ? parsed.checks : [],
      };
    }
  } catch {
    /* corrupted storage — start fresh */
  }
  return { done: [], checks: [] };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>({ done: [], checks: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  const toggleDone = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      done: s.done.includes(id) ? s.done.filter((d) => d !== id) : [...s.done, id],
    }));
  }, []);

  const toggleCheck = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      checks: s.checks.includes(id)
        ? s.checks.filter((c) => c !== id)
        : [...s.checks, id],
    }));
  }, []);

  const isDone = useCallback((id: string) => state.done.includes(id), [state.done]);
  const isChecked = useCallback(
    (id: string) => state.checks.includes(id),
    [state.checks],
  );
  const reset = useCallback(() => setState({ done: [], checks: [] }), []);

  return (
    <ProgressContext.Provider
      value={{ ...state, ready, toggleDone, isDone, toggleCheck, isChecked, reset }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
