import "./vendor.js";

const scripts = ["/js/lucide-icons.js", "/js/scene.js", "/js/interactions.js"];

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
