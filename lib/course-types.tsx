import type { ReactNode } from "react";

export type Checkpoint = {
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
};

export type Step = {
  id: string;
  /** optional small heading shown above the step body */
  title?: string;
  body: ReactNode;
  /** a question the learner must answer before continuing */
  check?: Checkpoint;
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
