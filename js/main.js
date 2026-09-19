import "./vendor.js";
import iconsUrl from "./lucide-icons.js?url";
import sceneUrl from "./scene.js?url";
import interactionsUrl from "./interactions.js?url";

const scripts = [iconsUrl, sceneUrl, interactionsUrl];

function loadClassicScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    document.head.appendChild(script);
  });
}

for (const src of scripts) {
  await loadClassicScript(src);
}

// Instanciar las entidades solamente después de registrar sus componentes.
const template = document.getElementById("scene-template");
template.replaceWith(template.content.cloneNode(true));
window.initializeSceneEvents();
