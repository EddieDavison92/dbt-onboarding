import type { Metadata } from "next";
import { CommandReference } from "@/components/CommandReference";

export const metadata: Metadata = { title: "Command reference" };

export default function Page() {
  return (
    <article className="lesson mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="rise mb-8 border-b-2 border-ink pb-6">
        <p className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-flame">
          Keep handy
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink">
          Command reference
        </h1>
        <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-ink-soft">
          The commands and naming rules you will actually use, searchable and
          copy-paste ready.
        </p>
      </header>
      <div className="rise rise-2">
        <CommandReference />

        <h2>Naming cheat sheet</h2>
        <table>
          <thead>
            <tr>
              <th>Prefix</th>
              <th>Layer</th>
              <th>Means</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>raw_</code></td>
              <td>Raw</td>
              <td>Auto-generated 1:1 source view — never edit</td>
            </tr>
            <tr>
              <td><code>stg_</code></td>
              <td>Staging</td>
              <td>Cleaned single-source model, no joins</td>
            </tr>
            <tr>
              <td><code>int_</code></td>
              <td>Modelling</td>
              <td>Intermediate building block</td>
            </tr>
            <tr>
              <td><code>dim_</code> / <code>fct_</code></td>
              <td>Reporting</td>
              <td>Dimension / fact, analyst-facing</td>
            </tr>
            <tr>
              <td><code>pit_</code> / <code>obt_</code> / <code>dq_</code></td>
              <td>Reporting</td>
              <td>Point-in-time / one-big-table / data-quality</td>
            </tr>
            <tr>
              <td><code>sem_</code></td>
              <td>Semantic</td>
              <td>Snowflake semantic view (semantic layer)</td>
            </tr>
          </tbody>
        </table>

        <h2>Branch & commit conventions</h2>
        <table>
          <thead>
            <tr>
              <th>Thing</th>
              <th>Format</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Branch</td>
              <td><code>type/short-description</code></td>
              <td><code>feat/opening-hours-staging</code></td>
            </tr>
            <tr>
              <td>Commit</td>
              <td><code>type: imperative description</code></td>
              <td><code>feat: add opening hours staging model</code></td>
            </tr>
            <tr>
              <td>Types</td>
              <td colSpan={2}>
                <code>feat</code> <code>fix</code> <code>docs</code>{" "}
                <code>refactor</code> <code>test</code> <code>chore</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  );
}
