import type { ReactNode } from "react";

export type Checkpoint = {
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
  /** short concept-grounding phrase shown when revisiting an answered checkpoint */
  affirm?: string;
};

export type Step = {
  id: string;
  /** optional small heading shown above the step body */
  title?: string;
  body: ReactNode;
  /** a question the learner must answer before continuing */
  check?: Checkpoint;
  /** the step's widget must signal completion (useInteractionDone) before continuing */
  interact?: boolean;
};

export type Lesson = {
  slug: string;
  title: string;
  blurb: string;
  minutes: number;
  steps: Step[];
};

export type CourseMeta = {
  slug: string;
  title: string;
  tagline: string;
  /** who it's for / prerequisite note shown on the card */
  audience: string;
  hours: string;
  accent: string; // css color var
};

export type Course = CourseMeta & {
  lessons: Lesson[];
};
