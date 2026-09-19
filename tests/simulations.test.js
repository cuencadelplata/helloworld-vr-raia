import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "./helpers/app.js";

test("superficies matemáticas: geometría finita y títulos", t => {
  const { w, doc, advance } = app(t, { classrooms: true });
  for (const key of Object.keys(w.mathFunctions)) {
    w.showFunction(key);
    advance(1100);
    const mesh = doc.getElementById("math-surface").firstChild.object3D.children[0];
    assert.ok(mesh.geometry.attributes.position.count > 0);
    assert.ok([...mesh.geometry.attributes.position.array].every(Number.isFinite));
    assert.equal(doc.getElementById("functionTitle").textContent, w.mathFunctions[key].name);
    w.showMathMenu();
    assert.equal(doc.getElementById("math-menu").getAttribute("visible"), true);
  }
  w.generateMathSurface("invalid");
  assert.equal(doc.getElementById("math-surface").children.length, 0);
  assert.equal(w.hslToRgb(0, 0, 0.5).r, 0.5);
});

for (const algorithm of ["bubble", "insertion", "quick", "baraja", "intercambio"]) {
  test("animación de ordenamiento completa: " + algorithm, t => {
    const { w, doc, advance } = app(t, { classrooms: true });
    w.showAlgorithm(algorithm);
    advance(300000);
    assert.equal(w.algorithmState.finished, true);
    assert.equal(w.isSorting, false);
    assert.match(doc.getElementById("functionDomain").textContent, /completado/);
    w.stepAlgorithmBack();
    advance(5000);
    assert.equal(w.algorithmState.paused, true);
    w.slowAlgorithm();
    assert.equal(w.algorithmState.speedIndex, 1);
    w.toggleAlgorithmPause();
    advance(300000);
    assert.equal(w.algorithmState.finished, true);
    w.stopAlgorithmAnimations({ resetDisplay: true });
    assert.equal(doc.getElementById("alg-menu").getAttribute("visible"), true);
  });
}

for (const algorithm of ["fcfs", "sjf", "srtf", "rr"]) {
  test("CPU: termina procesos, conserva ráfagas y registra métricas en " + algorithm, t => {
    const { w, advance } = app(t, { classrooms: true });
    w.selectCpuAlgorithm(algorithm);
    w.changeCpuQuantum(100);
    assert.equal(w.cpuSchedulerState.quantum, 8);
    w.changeCpuQuantum(-100);
    assert.equal(w.cpuSchedulerState.quantum, 1);
    w.startCpuScheduler();
    w.toggleCpuPause();
    const time = w.cpuSchedulerState.time;
    advance(5000);
    assert.equal(w.cpuSchedulerState.time, time);
    w.toggleCpuPause();
    advance(200000);
    const state = w.cpuSchedulerState;
    assert.equal(state.finished, true);
    assert.ok(state.processes.every(p => p.state === "terminated" && p.remainingTime === 0));
    assert.ok(state.processes.every(p => p.turnaroundTime === p.completionTime - p.arrivalTime));
    assert.equal(state.busyTicks, state.processes.reduce((n, p) => n + p.executedTime, 0));
    assert.ok(state.gantt.length > 0);
    w.startCpuScheduler();
    assert.equal(w.cpuSchedulerState.finished, false);
  });
}

for (const kind of ["MRU", "MRUV"]) {
  test("física: " + kind + " finaliza con los resultados del ejercicio", t => {
    const { w, doc, advance } = app(t, { classrooms: true });
    w["show" + kind + "Exercise"]();
    w["simulate" + kind]();
    advance(5500);
    const id = kind === "MRU" ? "mru-results-content" : "results-content";
    const value = doc.getElementById(id).getAttribute("value");
    assert.match(value, kind === "MRU" ? /80 metros/ : /20.00 metros/);
    w.backToFisicaMenu();
    assert.equal(w.mruSimulationRunning, false);
    assert.equal(w.mruvSimulationRunning, false);
  });
}

test("laboratorio de complejidad: ejemplos, parámetros y gráficos", t => {
  const { w } = app(t, { classrooms: true });
  for (const sample of w.COMPLEXITY_CODE_LIBRARY) {
    w.handleComplexityAction("complexity-code-" + sample.id);
    assert.equal(w.complexityState.result, w.deriveBigO(sample.traits));
    assert.equal(w.complexityState.calculated, true);
  }
  for (const action of ["mode-toggle", "n-minus", "n-plus", "n-big-minus", "n-big-plus", "loops-minus", "loops-plus",
    "rec-no", "rec-simple", "rec-multiple", "sort-toggle", "halving-toggle", "calcular", "reset"]) {
    w.handleComplexityAction("complexity-" + action);
    assert.ok(w.complexityState.n >= 10 && w.complexityState.n <= 2000);
  }
  assert.equal(w.complexityState.result, null);
});

test("laboratorio de probabilidad: distribuciones, parámetros y experimentos", t => {
  const { w, doc } = app(t, { classrooms: true });
  for (const station of ["coin", "dice", "calls"]) {
    w.handleProbabilityAction("prob-station-" + station);
    for (const action of ["prob-run-once", "prob-run-ten", "prob-run-hundred"]) w.handleProbabilityAction(action);
    assert.equal(w.probabilityState.trialCount, 111);
    assert.ok(w.probabilityState.observedSamples.every(Number.isFinite));
    w.handleProbabilityAction("prob-reset-observed");
    assert.equal(w.probabilityState.trialCount, 0);
  }
  for (const distribution of w.PROB_DISTRIBUTIONS) {
    w.setProbabilityDistributionById(distribution.id);
    w.resetProbabilityForDistribution();
    for (const mode of w.PROB_INTERVALS) {
      w.probabilityState.intervalType = mode;
      w.renderProbabilityLab();
    }
    for (const p of distribution.parameters) {
      w.handleProbabilityAction("prob-param-" + p.key + "-plus");
      w.handleProbabilityAction("prob-param-" + p.key + "-minus");
    }
  }
  for (const action of ["prev", "next", "interval", "a-minus", "a-plus", "b-minus", "b-plus"]) {
    w.handleProbabilityAction("prob-" + action);
  }
  assert.ok(doc.getElementById("probability-lab").children.length > 0);
});
