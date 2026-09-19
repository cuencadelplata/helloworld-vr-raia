import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { SourceTextModule, SyntheticModule, Script } from "node:vm";
import { JSDOM } from "jsdom";
import * as THREE from "three";

// Ejecuta los módulos originales; solamente sustituye librerías externas y red.
async function bootstrap(t, failure = false) {
  const dom = new JSDOM(readFileSync(new URL("../index.html", import.meta.url), "utf8"), {
    runScripts: "outside-only", url: "http://localhost/",
  });
  t.after(() => dom.window.close());
  const context = dom.getInternalVMContext();
  const w = dom.window, doc = w.document;
  const components = {};
  w.THREE = { ...THREE };
  w.AFRAME = { registerComponent: (name, value) => { components[name] = value; } };
  function stub(exports = {}) {
    return new SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
    }, { context });
  }
  async function teleport() {
    assert.equal(w.THREE.PlaneBufferGeometry, THREE.PlaneGeometry);
    assert.equal(w.THREE.BoxBufferGeometry, THREE.BoxGeometry);
    const attribute = new THREE.BufferAttribute(new Float32Array(3), 3);
    attribute.setDynamic(true);
    assert.equal(attribute.usage, THREE.DynamicDrawUsage);
    attribute.setDynamic(false);
    assert.equal(attribute.usage, THREE.StaticDrawUsage);
    const module = stub();
    await module.link(() => {});
    await module.evaluate();
    return module;
  }
  function source(file) {
    const path = fileURLToPath(new URL("../js/" + file, import.meta.url));
    return new SourceTextModule(readFileSync(path, "utf8"), {
      context, identifier: path, importModuleDynamically: teleport,
    });
  }
  const vendor = source("vendor.js");
  await vendor.link(name => stub(name === "gsap" ? { gsap: {} } : {}));
  const main = source("main.js");
  await main.link(name => name === "./vendor.js" ? vendor : stub({ default: name.replace("?url", "") }));
  const append = doc.head.appendChild.bind(doc.head);
  const requested = [];
  doc.head.appendChild = element => {
    requested.push(element.getAttribute("src"));
    assert.equal(doc.querySelector("a-scene"), null, "No instanciar escena antes de los componentes");
    append(element);
    if (failure) { element.onerror(); return element; }
    const path = fileURLToPath(new URL("../js/" + element.getAttribute("src").slice(2), import.meta.url));
    new Script(readFileSync(path, "utf8"), { filename: path }).runInContext(context);
    element.onload();
    return element;
  };
  return { w, doc, main, requested, components };
}

test("arranque: registra scripts en orden antes de insertar la escena", async t => {
  const { w, doc, main, requested, components } = await bootstrap(t);
  await main.evaluate();
  assert.deepEqual(requested, ["./lucide-icons.js", "./scene.js", "./interactions.js"]);
  assert.ok(components["player-movement"]);
  assert.ok(components["generar-aula"]);
  assert.equal(doc.getElementById("scene-template"), null);
  assert.ok(doc.querySelector("a-scene"));
  doc.querySelector("a-scene").dispatchEvent(new w.Event("enter-vr"));
  assert.equal(doc.querySelector(".info-panel").style.display, "none");
});

test("arranque: propaga un error de descarga y no crea una escena incompleta", async t => {
  const { main, doc } = await bootstrap(t, true);
  await assert.rejects(main.evaluate(), /No se pudo cargar/);
  assert.equal(doc.querySelector("a-scene"), null);
});
