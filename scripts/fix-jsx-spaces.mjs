// Fix JSX inter-line whitespace removal around inline elements.
// JSX drops whitespace-with-newline between a tag and adjacent text, so
//   <strong>VS Code</strong>
//   if you don't have it
// renders as "VS Codeif". This inserts {" "} where a space was clearly intended.
import { readFileSync, writeFileSync } from "node:fs";

const files = process.argv.slice(2);
const INLINE = "(?:strong|em|code|a)";

// A: inline tag closes at end of line, prose continues on the next line
const reA = new RegExp(
  `(</${INLINE}>)(\\r?\\n)(\\s*)([A-Za-z0-9‘“'(])`,
  "g",
);
// B: prose ends a line, inline tag opens the next line
// (exclude ", ), }, > and back-tick endings to stay clear of attributes/expressions/templates)
const reB = new RegExp(
  `([A-Za-z0-9,;:.!?’”])(\\r?\\n)(\\s*)(<${INLINE}[ >])`,
  "g",
);
// C: inline tag closes, another inline tag opens on the next line
const reC = new RegExp(
  `(</${INLINE}>)(\\r?\\n)(\\s*)(<${INLINE}[ >])`,
  "g",
);
// D: an inline tag is followed by prose on the same source line. This is
// usually preserved, but JSX can trim it when the line begins with an element
// or sits beside an explicit whitespace expression on the previous line.
const reD = new RegExp(
  `(</${INLINE}>) +([A-Za-z0-9‘“'(])`,
  "g",
);

let total = 0;
for (const file of files) {
  const src = readFileSync(file, "utf8");
  let count = 0;
  const out = src
    .replace(reA, (_, a, nl, ind, c) => (count++, `${a}{" "}${nl}${ind}${c}`))
    .replace(reB, (_, c, nl, ind, t) => (count++, `${c}{" "}${nl}${ind}${t}`))
    .replace(reC, (_, a, nl, ind, t) => (count++, `${a}{" "}${nl}${ind}${t}`))
    .replace(reD, (_, a, c) => (count++, `${a}{" "}${c}`));
  if (count > 0) {
    writeFileSync(file, out, "utf8");
    console.log(`${file}: ${count} fixes`);
    total += count;
  }
}
console.log(`total: ${total}`);
