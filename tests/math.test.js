import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "./helpers/app.js";

test("ordenamientos: resultado, conservación de elementos y pasos reproducibles", t => {
  const { w } = app(t);
  for (const algorithm of ["bubble", "intercambio", "insertion", "baraja", "quick"]) {
    for (const input of [[], [1], [3, 1, 2], [2, 2, -1, 0], [1, 2, 3], [5, 4, 3, 2, 1]]) {
      const values = [...input], replay = [...input];
      const steps = w.getSortingSteps(algorithm, values);
      for (const step of steps) {
        if (step.type === "swap") [replay[step.i], replay[step.j]] = [replay[step.j], replay[step.i]];
      }
      assert.deepEqual(values, [...input].sort((a, b) => a - b));
      assert.deepEqual(replay, values);
    }
  }
  assert.equal(w.getSortingSteps("unknown", []).length, 0);
});

test("complejidad: clasificación de estructuras y crecimiento conocido", t => {
  const { w } = app(t);
  const cases = [
    [{ loops: 0 }, "O(1)", 1], [{ loops: 0, halving: true }, "O(log n)", 3],
    [{ loops: 1 }, "O(n)", 8], [{ loops: 2 }, "O(n^2)", 64],
    [{ loops: 3 }, "O(n^3)", 512], [{ sort: true }, "O(n log n)", 24],
    [{ recursion: "simple" }, "O(n)", 8],
    [{ recursion: "multiple", loops: 0 }, "O(2^n)", 256],
    [{ recursion: "multiple", loops: 1 }, "O(n!)", 40320],
  ];
  for (const [traits, expected, value] of cases) {
    const state = { loops: 0, recursion: "no", sort: false, halving: false, ...traits };
    assert.equal(w.deriveBigO(state), expected);
    assert.equal(w.complexityValue(expected, 8), value);
    assert.ok(w.deriveReason(state, expected).why.length > 10);
    assert.match(w.complexityColor(expected), /^#[A-Fa-f0-9]{6}$/);
  }
  assert.equal(w.complexityValue("unknown", 7), 7);
  assert.equal(w.formatComplexityOps(Infinity), "muy grande");
  assert.equal(w.formatComplexityOps(1e7), "1.00e+7");
  assert.equal(w.formatComplexityOps(12.6), "13");
});

test("distribuciones: normalización, monotonicidad, dominios y complementos", t => {
  const { w } = app(t);
  for (const d of w.PROB_DISTRIBUTIONS) {
    assert.equal(w.validateProbabilityInputs(d, d.defaults, "between", 0, 1).length, 0, d.id);
    const math = d.kind === "continuous" ? w.createContinuousMath(d, d.defaults) : w.createDiscreteMath(d, d.defaults);
    const xs = d.kind === "continuous" ? [-100, -1, 0, 0.5, 1, 3, 10, 100] : [-1, 0, 1, 2, 5, 10, 100];
    let previous = 0;
    for (const x of xs) {
      const cdf = math.cdf(x);
      assert.ok(cdf >= -1e-8 && cdf <= 1 + 1e-8 && cdf >= previous - 1e-8, d.id);
      previous = cdf;
      assert.ok((math.pdf || math.pmf)(x) >= 0, d.id);
    }
    if (math.pmf) {
      const total = math.support.reduce((s, k) => s + math.pmf(k), 0);
      assert.ok(Math.abs(total - 1) < 0.0001, d.id);
      assert.equal(math.pmf(-1), 0);
      assert.equal(math.pmf(0.5), 0);
    }
    for (const mode of ["between", "outside", "left", "right"]) {
      const result = w.calculateProbabilityVR(d, d.defaults, mode, 1, 3);
      assert.ok(result.value >= 0 && result.value <= 1);
      assert.match(result.expression, /P\(/);
    }
  }
  const normal = w.createContinuousMath({ id: "normal" }, {});
  assert.ok(Math.abs(normal.cdf(0) - 0.5) < 1e-7);
  assert.ok(Math.abs(normal.pdf(0) - 1 / Math.sqrt(2 * Math.PI)) < 1e-10);
  assert.ok(Math.abs(w.logGamma(0.5) - Math.log(Math.sqrt(Math.PI))) < 1e-10);
  assert.equal(w.logCombination(4, -1), -Infinity);
  assert.ok(Number.isNaN(w.clampProbability(NaN)));
  assert.throws(() => w.createContinuousMath({ id: "invalid" }, {}));
  assert.throws(() => w.createDiscreteMath({ id: "invalid" }, {}));
});

test("probabilidades degeneradas y validación de parámetros inválidos", t => {
  const { w } = app(t);
  for (const p of [0, 1]) {
    const m = w.createDiscreteMath({ id: "binomial" }, { n: 4, p });
    assert.equal(m.pmf(p === 0 ? 0 : 4), 1);
    assert.equal(m.pmf(2), 0);
    const negative = w.createDiscreteMath({ id: "negativeBinomial" }, { r: 2, p });
    assert.equal(negative.pmf(0), p);
    assert.equal(negative.pmf(1), 0);
  }
  const poisson = w.createDiscreteMath({ id: "poisson" }, { lambda: 0 });
  assert.equal(poisson.pmf(0), 1);
  assert.equal(poisson.pmf(1), 0);
  for (const d of w.PROB_DISTRIBUTIONS) {
    for (const parameter of d.parameters) {
      for (const bad of [NaN, -100, 1e9, 0.123]) {
        const errors = w.validateProbabilityInputs(d, { ...d.defaults, [parameter.key]: bad }, "between", 5, 1);
        assert.ok(errors.length > 0);
      }
    }
  }
  const hyper = w.PROB_DISTRIBUTIONS.find(d => d.id === "hypergeometric");
  assert.ok(w.validateProbabilityInputs(hyper, { N: 2, K: 4, n: 3 }, "left", 0, 1).length >= 2);
});
