import "aframe";
import "aframe-environment-component";
import { gsap } from "gsap";

// GSAP se usa desde los scripts clásicos de la aplicación existente.
window.gsap = gsap;

// aframe-teleport-controls 0.3.1 utiliza APIs antiguas de Three.js.
// A-Frame 1.8 incluye super-three, donde varias APIs fueron renombradas.
const three = window.THREE;
if (three) {
  three.PlaneBufferGeometry ??= three.PlaneGeometry;
  three.BoxBufferGeometry ??= three.BoxGeometry;
  three.Math ??= three.MathUtils;

  if (three.BufferGeometry && !three.BufferGeometry.prototype.addAttribute) {
    three.BufferGeometry.prototype.addAttribute = three.BufferGeometry.prototype.setAttribute;
  }
  if (three.BufferAttribute && !three.BufferAttribute.prototype.setDynamic) {
    three.BufferAttribute.prototype.setDynamic = function (enabled) {
      return this.setUsage(enabled ? three.DynamicDrawUsage : three.StaticDrawUsage);
    };
  }
  if (three.Matrix4 && !three.Matrix4.prototype.applyMatrix) {
    three.Matrix4.prototype.applyMatrix = three.Matrix4.prototype.applyMatrix4;
  }
}

// Se importa después de aplicar los alias para evitar el error de constructor.
await import("aframe-teleport-controls");
