import { readFileSync, writeFileSync, appendFileSync } from "node:fs";

const summary = JSON.parse(readFileSync("coverage/coverage-summary.json", "utf8"));
const metrics = ["lines", "statements", "functions", "branches"];
const table = [
  "## Cobertura de tests",
  "",
  "| Métrica | Cobertura | Cubierto / total |",
  "| --- | ---: | ---: |",
  ...metrics.map(key => {
    const m = summary.total[key];
    return `| ${key} | ${m.pct}% | ${m.covered} / ${m.total} |`;
  }),
  "",
  "Alcance: todos los archivos de js/. Reportes HTML, LCOV y JSON en el artifact coverage-report.",
  "",
];
const markdown = table.join("\n");
writeFileSync("coverage/summary.md", markdown);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
const pct = summary.total.lines.pct;
if (typeof pct !== "number" || !Number.isFinite(pct)) throw new Error("Cobertura inválida");
const color = pct >= 90 ? "#4c1" : pct >= 75 ? "#dfb317" : "#e05d44";
writeFileSync("coverage/badge.svg", `<svg xmlns="http://www.w3.org/2000/svg" width="174" height="20" role="img" aria-label="coverage: ${pct}%">
<title>coverage: ${pct}%</title>
<rect width="174" height="20" rx="3" fill="#555"/>
<path d="M90 0h81q3 0 3 3v14q0 3-3 3H90z" fill="${color}"/>
<g fill="#fff" font-family="Verdana,DejaVu Sans,sans-serif" font-size="11" text-anchor="middle">
<text x="45" y="14">coverage</text><text x="132" y="14">${pct}%</text>
</g></svg>\n`);
console.log(markdown);
