import { test } from "node:test";
import assert from "node:assert/strict";
import { app } from "./helpers/app.js";

test("las seis aulas contienen sus controles, paneles y superficies", t => {
  const { w, doc } = app(t, { classrooms: true });
  for (let i = 1; i <= 6; i++) {
    assert.ok(doc.getElementById("aula" + i).children.length > 10);
  }
  for (const id of ["math-menu", "algorithm-display", "cpu-processes", "mru-car", "probability-lab"]) {
    assert.ok(doc.getElementById(id), id);
  }
  assert.equal(w.vectorToString(null), "0 0 0");
  assert.equal(w.vectorToString({ x: 2, y: 1 }), "2 1 0");
  assert.equal(w.getAulaSide("-1 0 0"), -1);
  assert.equal(w.getAulaSide({ x: 1 }), 1);
  assert.equal(w.getAulaSide(null), 1);
  const base = w.generarAula();
  assert.equal(base.id, "aula");
  w.buildPlaceholderContent(base, "extra", "unknown", "-6 0 0");
  assert.ok(base.querySelector("#extra-sim-root"));
});

for (const loaded of [false, true]) {
  test("movimiento: inicialización con escena cargada=" + loaded, t => {
    const { w, doc, component, advance, THREE } = app(t);
    const scene = doc.querySelector("a-scene");
    scene.hasLoaded = loaded;
    const rig = doc.getElementById("rig");
    const camera = doc.getElementById("camera");
    camera.setAttribute("camera", "");
    const movement = component("player-movement", rig, { speed: 4, radius: 0.4 });
    t.after(() => movement.remove());
    if (!loaded) {
      assert.equal(movement.ready, false);
      movement.tick(0, 16);
      scene.dispatchEvent(new w.Event("loaded"));
    }
    advance(500);
    assert.equal(movement.ready, true);
    // Colisiones se prueban por separado: aquí comprobamos dirección y velocidad.
    movement.wallBoxes = [];
    for (const [code, x, z] of [
      ["KeyW", 0, -0.4], ["KeyS", 0, 0.4], ["KeyA", -0.4, 0], ["KeyD", 0.4, 0],
      ["ArrowUp", 0, -0.4], ["ArrowDown", 0, 0.4], ["ArrowLeft", -0.4, 0], ["ArrowRight", 0.4, 0],
    ]) {
      rig.object3D.position.set(0, 0, 0);
      w.dispatchEvent(new w.KeyboardEvent("keydown", { code }));
      movement.tick(0, 100);
      w.dispatchEvent(new w.KeyboardEvent("keyup", { code }));
      assert.equal(rig.object3D.position.x, x);
      assert.equal(rig.object3D.position.z, z);
    }
    rig.object3D.position.set(0, 0, 0);
    movement.keys = { KeyW: true, KeyD: true };
    movement.tick(0, 100);
    assert.ok(Math.abs(rig.object3D.position.length() - 0.4) < 1e-10);
    w.dispatchEvent(new w.Event("blur"));
    assert.equal(Object.keys(movement.keys).length, 0);
    movement.tick(0, 0);
    movement.tick(0, 300);
    movement.wallBoxes = [new THREE.Box3(new THREE.Vector3(0.5, 0, -2), new THREE.Vector3(1, 3, 2))];
    assert.equal(movement.checkCollision(0.4, 0), true);
    assert.equal(movement.checkCollision(-1, 0), false);
    rig.object3D.position.set(0, 0, 0);
    movement.keys = { KeyD: true };
    movement.tick(0, 100);
    assert.equal(rig.object3D.position.x, 0);
  });
}

test("botones: hover, clic, propagación y menús ocultos", t => {
  const { w, doc, component } = app(t, { classrooms: true });
  for (const loaded of [false, true]) {
    const el = doc.createElement("a-entity");
    el.innerHTML = "<a-box></a-box>";
    el.hasLoaded = loaded;
    let calls = 0;
    const button = component("btn-action", el, "func1");
    button.handleClick = () => calls++;
    if (!loaded) el.dispatchEvent(new w.Event("loaded"));
    const box = el.firstChild;
    box.dispatchEvent(new w.Event("mouseenter"));
    assert.equal(box.getAttribute("scale"), "1.15 1.15 1.15");
    box.dispatchEvent(new w.Event("mouseleave"));
    assert.equal(box.getAttribute("scale"), "1 1 1");
    box.dispatchEvent(new w.Event("click", { bubbles: true }));
    assert.equal(calls, 1);
    el.dispatchEvent(new w.Event("click"));
    assert.equal(calls, 2);
  }
  doc.getElementById("math-menu").setAttribute("visible", false);
  const button = component("btn-action", doc.createElement("a-entity"), "func1");
  button.handleClick();
  assert.equal(w.currentFunction, null);
});

test("iconos SVG y eventos enter-vr/exit-vr", t => {
  const { w, doc } = app(t);
  w.renderLucideIcons();
  assert.equal(doc.querySelectorAll("[data-lucide-icon] svg").length, doc.querySelectorAll("[data-lucide-icon]").length);
  w.renderLucideIcons();
  assert.equal(doc.querySelector("[data-lucide-icon]").children.length, 1);
  w.initializeSceneEvents();
  const scene = doc.querySelector("a-scene");
  scene.dispatchEvent(new w.Event("loaded"));
  scene.dispatchEvent(new w.Event("enter-vr"));
  assert.equal(doc.querySelector(".info-panel").style.display, "none");
  assert.equal(doc.querySelector("a-cursor").getAttribute("visible"), false);
  scene.dispatchEvent(new w.Event("exit-vr"));
  assert.equal(doc.querySelector(".info-panel").style.display, "block");
  assert.equal(doc.querySelector("a-cursor").getAttribute("visible"), true);
});

test("enrutamiento de acciones: cada botón llama al controlador correspondiente", t => {
  const { w, doc, components } = app(t);
  for (const id of ["math-menu", "function-display", "alg-menu", "algorithm-display"]) {
    const el = doc.createElement("a-entity");
    el.id = id;
    el.setAttribute("visible", true);
    doc.body.appendChild(el);
  }
  const routes = [
    ...[1, 2, 3, 4, 5].map(n => ["func" + n, "showFunction", "func" + n]),
    ...["bubble", "insertion", "quick", "baraja", "intercambio"].map(a => ["algo-" + a, "showAlgorithm", a]),
    ["back-math", "showMathMenu"], ["back-algo", "stopAlgorithmAnimations"],
    ["restart-algo", "showAlgorithm", "quick"], ["pause-algo", "toggleAlgorithmPause"],
    ["back-step-algo", "stepAlgorithmBack"], ["slow-algo", "slowAlgorithm"],
    ["show-mru", "showMRUPlaceholder"], ["show-mruv", "showMRUVExercise"],
    ["simulate-mruv", "simulateMRUV"], ["back-fisica", "backToFisicaMenu"], ["simulate-mru", "simulateMRU"],
    ...["prev", "next", "interval", "a-minus", "a-plus", "b-minus", "b-plus", "station-coin", "station-dice",
      "station-calls", "run-once", "run-ten", "run-hundred", "reset-observed", "param-p-plus"]
      .map(a => ["prob-" + a, "handleProbabilityAction", "prob-" + a]),
    ...["n-minus", "n-plus", "n-big-minus", "n-big-plus", "loops-minus", "loops-plus", "rec-no",
      "rec-simple", "rec-multiple", "sort-toggle", "halving-toggle", "calcular", "reset", "code-linear"]
      .map(a => ["complexity-" + a, "handleComplexityAction", "complexity-" + a]),
    ...["fcfs", "sjf", "srtf", "rr"].map(a => ["cpu-" + a, "selectCpuAlgorithm", a]),
    ["cpu-start", "startCpuScheduler"], ["cpu-pause", "toggleCpuPause"], ["cpu-reset", "resetCpuScheduler"],
    ["cpu-quantum-plus", "changeCpuQuantum", 1], ["cpu-quantum-minus", "changeCpuQuantum", -1],
  ];
  w.currentAlgorithm = "quick";
  for (const [action, handler, arg] of routes) {
    const calls = [];
    const original = w[handler];
    w[handler] = (...args) => calls.push(args);
    components["btn-action"].handleClick.call({ data: action });
    assert.equal(calls.length, 1, action);
    if (arg !== undefined) assert.equal(calls[0][0], arg, action);
    w[handler] = original;
  }
  for (const id of ["math-menu", "function-display", "alg-menu", "algorithm-display"]) {
    doc.getElementById(id).setAttribute("visible", false);
  }
  for (const action of ["func1", "back-math", "algo-bubble", "back-algo", "unknown"]) {
    components["btn-action"].handleClick.call({ data: action });
  }
  assert.equal(w.currentFunction, null);
});

test("joystick: zona muerta, velocidad, colisiones y limpieza", t => {
  const { w, doc, component } = app(t);
  const rig = doc.getElementById("rig"), camera = doc.getElementById("camera");
  rig.components = {};
  const hand = doc.getElementById("leftHand");
  const c = component("thumbstick-locomotion", hand, { rig, camera, speed: 3, deadzone: 0.15 });
  const move = axis => hand.dispatchEvent(new w.CustomEvent("axismove", { detail: { axis } }));
  move([0.01, 0.01]);
  c.tick(0, 100);
  assert.equal(rig.object3D.position.length(), 0);
  move([0, 0, 0, -1]);
  c.tick(0, 100);
  assert.ok(rig.object3D.position.z < 0);
  rig.components["player-movement"] = { ready: true, checkCollision: () => true };
  const before = rig.object3D.position.clone();
  move([1, 0]);
  c.tick(0, 100);
  assert.ok(before.equals(rig.object3D.position));
  rig.components["player-movement"].checkCollision = () => false;
  c.tick(0, 100);
  assert.ok(rig.object3D.position.x > before.x);
  c.remove();
  const axis = { ...c.axis };
  move([0, 1]);
  assert.deepEqual({ ...c.axis }, axis);
});
