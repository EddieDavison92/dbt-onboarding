"use client";

import { createContext, useContext } from "react";

/** provided by LessonPlayer so widgets can unlock interaction-gated steps */
export const InteractionContext = createContext<(() => void) | null>(null);

const NOOP = () => {};

/** widgets call the returned function once the learner has completed the core interaction */
export function useInteractionDone(): () => void {
  return useContext(InteractionContext) ?? NOOP;
}
