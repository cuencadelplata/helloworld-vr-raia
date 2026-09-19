var LUCIDE_ICONS = {
        landmark: [
          ["line", { x1: "3", x2: "21", y1: "22", y2: "22" }],
          ["line", { x1: "6", x2: "6", y1: "18", y2: "11" }],
          ["line", { x1: "10", x2: "10", y1: "18", y2: "11" }],
          ["line", { x1: "14", x2: "14", y1: "18", y2: "11" }],
          ["line", { x1: "18", x2: "18", y1: "18", y2: "11" }],
          ["polygon", { points: "12 2 20 7 4 7" }],
        ],
        "map-pin": [
          ["path", { d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" }],
          ["circle", { cx: "12", cy: "10", r: "3" }],
        ],
        "door-open": [
          ["path", { d: "M13 4h3a2 2 0 0 1 2 2v14" }],
          ["path", { d: "M2 20h3" }],
          ["path", { d: "M13 20h9" }],
          ["path", { d: "M10 12v.01" }],
          ["path", { d: "M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.562Z" }],
        ],
      };

      function createLucideSvg(iconNode) {
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "18");
        svg.setAttribute("height", "18");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.setAttribute("aria-hidden", "true");

        iconNode.forEach(function (node) {
          var child = document.createElementNS("http://www.w3.org/2000/svg", node[0]);
          Object.keys(node[1] || {}).forEach(function (attr) {
            child.setAttribute(attr, node[1][attr]);
          });
          svg.appendChild(child);
        });
        return svg;
      }

      function renderLucideIcons() {
        document.querySelectorAll("[data-lucide-icon]").forEach(function (slot) {
          var icon = LUCIDE_ICONS[slot.getAttribute("data-lucide-icon")];
          if (!icon) return;
          slot.textContent = "";
          slot.appendChild(createLucideSvg(icon));
        });
      }

      if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", renderLucideIcons);
      } else {
        renderLucideIcons();
      }
