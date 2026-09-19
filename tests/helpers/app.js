import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Script } from "node:vm";
import { JSDOM } from "jsdom";
import * as THREE from "three";

// Adaptador mínimo de entidades A-Frame: DOM real y matemáticas Three reales.
// No renderiza WebGL ni simula el ciclo de vida del motor.
export function app(t, { classrooms = false } = {}) {
  const dom = new JSDOM(readFileSync(new URL("../../index.html", import.meta.url), "utf8"), {
    runScripts: "outside-only", url: "http://localhost/",
  });
  t.after(() => dom.window.close());
  const w = dom.window;
  const doc = w.document;
  const template = doc.getElementById("scene-template");
  template.replaceWith(template.content.cloneNode(true));
  const components = {};
  w.THREE = THREE;
  w.AFRAME = { registerComponent: (name, definition) => { components[name] = definition; } };
  w.console = { log() {}, warn() {}, error: console.error };
  const objects = new WeakMap();
  const attributes = new WeakMap();
  const proto = w.HTMLElement.prototype;
  const nativeSet = proto.setAttribute;
  const nativeGet = proto.getAttribute;
  Object.defineProperty(proto, "object3D", { get() {
    if (!objects.has(this)) objects.set(this, new THREE.Object3D());
    return objects.get(this);
  } });
  Object.defineProperty(proto, "sceneEl", { get() { return this.closest("a-scene"); } });
  proto.setAttribute = function (name, value, subvalue) {
    if (!this.tagName.startsWith("A-")) return nativeSet.call(this, name, value);
    if (!attributes.has(this)) attributes.set(this, {});
    const data = attributes.get(this);
    data[name] = arguments.length === 3 ? { ...data[name], [value]: subvalue } : value;
    nativeSet.call(this, name, typeof data[name] === "object" ? JSON.stringify(data[name]) : data[name]);
    if (name === "position") {
      const p = typeof value === "string" ? value.split(" ").map(Number) : [value.x, value.y, value.z];
      this.object3D.position.set(...p);
    }
  };
  proto.getAttribute = function (name) {
    return attributes.get(this)?.[name] ?? nativeGet.call(this, name);
  };
  proto.setObject3D = function (name, object) { object.name = name; this.object3D.add(object); };
  proto.getObject3D = function (name) { return this.object3D.getObjectByName(name); };
  proto.emit = function (type, detail) { this.dispatchEvent(new w.CustomEvent(type, { detail })); };

  let now = 10000, id = 0;
  const pending = new Map();
  w.setTimeout = (callback, delay = 0) => {
    pending.set(++id, { callback, at: now + delay });
    return id;
  };
  w.clearTimeout = (key) => pending.delete(key);
  w.requestAnimationFrame = (callback) => w.setTimeout(() => callback(now), 16);
  w.cancelAnimationFrame = w.clearTimeout;
  w.Date.now = () => now;
  let seed = 123456789;
  w.Math.random = () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  function advance(ms) {
    const end = now + ms;
    let iterations = 0;
    while (true) {
      const next = [...pending].sort((a, b) => a[1].at - b[1].at)[0];
      if (!next || next[1].at > end) break;
      if (++iterations > 20000) throw new Error("Posible ciclo infinito de timers");
      now = next[1].at;
      pending.delete(next[0]);
      next[1].callback();
    }
    now = end;
  }
  function load(file) {
    const filename = fileURLToPath(new URL("../../js/" + file, import.meta.url));
    new Script(readFileSync(filename, "utf8"), { filename }).runInContext(dom.getInternalVMContext());
  }
  load("scene.js");
  load("interactions.js");
  load("lucide-icons.js");
  if (classrooms) {
    for (const el of doc.querySelectorAll("[generar-aula]")) {
      const data = Object.fromEntries(el.getAttribute("generar-aula").split(";").map(p => p.trim().split(/:\s*/)));
      w.generarAula(el.id, data.posicionXYZ, data.colorParedes, data.tipo, el);
    }
    advance(1000);
  }
  function component(name, el, data) {
    const instance = Object.assign(Object.create(components[name]), { el, data });
    instance.init();
    return instance;
  }
  return { w, doc, components, component, advance, pending, THREE };
}
