// ============================================
      // COMPONENTE BTN-ACTION
      // Maneja clicks en botones interactivos.
      // Funciona con cursor de PC, gaze VR y
      // controllers VR (Oculus/Quest).
      // ============================================
      AFRAME.registerComponent("btn-action", {
        schema: { type: "string" },
        init: function () {
          var self = this;
          var el = this.el;

          // El raycaster intersecta geometría (a-box hijo), así que
          // necesitamos escuchar click tanto en el parent como en hijos
          el.addEventListener("click", function () {
            self.handleClick();
          });

          // Configura el a-box hijo como clickable (hover + click)
          // Usa hasLoaded para cubrir entidades ya inicializadas al momento
          // en que se registra el componente (evita perder el evento loaded)
          function setupBox() {
            var box = el.querySelector("a-box");
            if (!box) return;
            box.classList.add("clickable");
            box.addEventListener("click", function (evt) {
              evt.stopPropagation();
              self.handleClick();
            });
            box.addEventListener("mouseenter", function () {
              box.setAttribute("scale", "1.15 1.15 1.15");
            });
            box.addEventListener("mouseleave", function () {
              box.setAttribute("scale", "1 1 1");
            });
          }
          if (el.hasLoaded) {
            setupBox();
          } else {
            el.addEventListener("loaded", setupBox);
          }
        },
        handleClick: function () {
          var action = this.data;
          console.log("Boton:", action);
          var mathMenu = document.getElementById("math-menu");
          var functionDisplay = document.getElementById("function-display");
          var algMenu = document.getElementById("alg-menu");
          var algDisplay = document.getElementById("algorithm-display");
          var mathMenuVisible =
            mathMenu && mathMenu.getAttribute("visible") !== false;
          var functionDisplayVisible =
            functionDisplay && functionDisplay.getAttribute("visible") !== false;
          var algMenuVisible = algMenu && algMenu.getAttribute("visible") !== false;
          var algDisplayVisible =
            algDisplay && algDisplay.getAttribute("visible") !== false;

          if (action.indexOf("func") === 0 && !mathMenuVisible) return;
          if (action === "back-math" && !functionDisplayVisible) return;
          if (action.indexOf("algo-") === 0 && !algMenuVisible) return;

          if (
            (action === "back-algo" ||
              action === "restart-algo" ||
              action === "pause-algo" ||
              action === "back-step-algo" ||
              action === "slow-algo") &&
            !algDisplayVisible
          ) {
            return;
          }

          switch (action) {
            case "func1":
              showFunction("func1");
              break;
            case "func2":
              showFunction("func2");
              break;
            case "func3":
              showFunction("func3");
              break;
            case "func4":
              showFunction("func4");
              break;
            case "func5":
              showFunction("func5");
              break;
            case "back-math":
              showMathMenu();
              break;
            case "algo-bubble":
              showAlgorithm("bubble");
              break;
            case "algo-insertion":
              showAlgorithm("insertion");
              break;
            case "algo-quick":
              showAlgorithm("quick");
              break;
            case "algo-baraja":
              showAlgorithm("baraja");
              break;
            case "algo-intercambio":
              showAlgorithm("intercambio");
              break;
            case "back-algo":
              stopAlgorithmAnimations({ resetDisplay: true });
              break;
            case "restart-algo":
              if (currentAlgorithm) showAlgorithm(currentAlgorithm);
              break;
            case "pause-algo":
              toggleAlgorithmPause();
              break;
            case "back-step-algo":
              stepAlgorithmBack();
              break;
            case "slow-algo":
              slowAlgorithm();
              break;
            case "show-mru":
              showMRUPlaceholder();
              break;
            case "show-mruv":
              showMRUVExercise();
              break;
            case "simulate-mruv":
              simulateMRUV();
              break;
            case "back-fisica":
              backToFisicaMenu();
              break;
            case "simulate-mru":
              simulateMRU();
              break;
            case "prob-prev":
            case "prob-next":
            case "prob-interval":
            case "prob-a-minus":
            case "prob-a-plus":
            case "prob-b-minus":
            case "prob-b-plus":
            case "prob-station-coin":
            case "prob-station-dice":
            case "prob-station-calls":
            case "prob-run-once":
            case "prob-run-ten":
            case "prob-run-hundred":
            case "prob-reset-observed":
              handleProbabilityAction(action);
              break;
            case "complexity-n-minus":
            case "complexity-n-plus":
            case "complexity-n-big-minus":
            case "complexity-n-big-plus":
            case "complexity-loops-minus":
            case "complexity-loops-plus":
            case "complexity-rec-no":
            case "complexity-rec-simple":
            case "complexity-rec-multiple":
            case "complexity-sort-toggle":
            case "complexity-halving-toggle":
            case "complexity-calcular":
            case "complexity-reset":
              handleComplexityAction(action);
              break;

            case "cpu-fcfs":
              selectCpuAlgorithm("fcfs");
              break;
            case "cpu-sjf":
              selectCpuAlgorithm("sjf");
              break;
            case "cpu-srtf":
              selectCpuAlgorithm("srtf");
              break;
            case "cpu-rr":
              selectCpuAlgorithm("rr");
              break;
            case "cpu-start":
              startCpuScheduler();
              break;
            case "cpu-pause":
              toggleCpuPause();
              break;
            case "cpu-reset":
              resetCpuScheduler();
              break;
            case "cpu-quantum-plus":
              changeCpuQuantum(1);
              break;
            case "cpu-quantum-minus":
              changeCpuQuantum(-1);
              break;
            default:
              if (action.indexOf("prob-param-") === 0) {
                handleProbabilityAction(action);
              } else if (action.indexOf("complexity-") === 0) {
                handleComplexityAction(action);
              }
              break;
          }
        },
      });

      // ============================================
      // GENERADOR DE AULAS
      // Construye aulas completas desde JavaScript
      // para evitar bloques HTML duplicados.
      // ============================================
      var AULA_CONFIG = {
        width: 9,
        depth: 7,
        height: 4.5,
        wallThickness: 0.3,
      };

      function vectorToString(value) {
        if (typeof value === "string") return value;
        if (!value) return "0 0 0";
        return (value.x || 0) + " " + (value.y || 0) + " " + (value.z || 0);
      }

      function getAulaSide(posicionXYZ) {
        var x =
          typeof posicionXYZ === "string"
            ? parseFloat(posicionXYZ.split(" ")[0])
            : posicionXYZ && typeof posicionXYZ.x === "number"
              ? posicionXYZ.x
              : 0;
        return x < 0 ? -1 : 1;
      }

      function createEl(tag, attrs, children) {
        var el = document.createElement(tag);
        attrs = attrs || {};
        Object.keys(attrs).forEach(function (name) {
          if (attrs[name] !== undefined && attrs[name] !== null) {
            el.setAttribute(name, attrs[name]);
          }
        });
        (children || []).forEach(function (child) {
          el.appendChild(child);
        });
        return el;
      }

      function appendEl(parent, tag, attrs, children) {
        var el = createEl(tag, attrs, children);
        parent.appendChild(el);
        return el;
      }

      function wallMaterial(colorParedes, repeat) {
        return (
          "src: #textura-pared; color: " +
          colorParedes +
          "; repeat: " +
          repeat +
          "; roughness: 0.85"
        );
      }

      function addWall(parent, attrs, colorParedes, repeat) {
        attrs = Object.assign(
          {
            src: "#textura-pared",
            class: "collidable",
            material: wallMaterial(colorParedes, repeat),
            shadow: "cast: true; receive: true",
          },
          attrs,
        );
        return appendEl(parent, "a-box", attrs);
      }

      function addText(parent, attrs) {
        return appendEl(parent, "a-text", attrs);
      }

      function addButton(parent, config) {
        var button = appendEl(parent, "a-entity", {
          id: config.id,
          position: config.position,
          rotation: config.rotation,
          class: "clickable",
          "btn-action": config.action,
        });

        appendEl(button, "a-box", {
          width: config.width || "0.9",
          height: config.height || "0.3",
          depth: config.depth || "0.05",
          color: config.color,
          opacity: "0.9",
          animation__mouseenter:
            "property: scale; to: 1.1 1.1 1.1; startEvents: mouseenter; dur: 200",
          animation__mouseleave:
            "property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200",
        });

        addText(button, {
          id: config.labelId,
          value: config.label,
          align: "center",
          color: config.textColor || "#fff",
          width: config.textWidth || "2.5",
          position: config.textPosition || "0 0 0.03",
        });

        return button;
      }

      function addBaseClassroom(parent, id, posicionXYZ, colorParedes) {
        var side = getAulaSide(posicionXYZ);
        var boardX = side * 4;
        var hallX = -side * 4;
        var facingRotation = "0 " + -side * 90 + " 0";
        var deskRotation = "0 " + side * 90 + " 0";

        appendEl(parent, "a-plane", {
          id: id + "-suelo",
          class: "navegable",
          width: AULA_CONFIG.width,
          height: AULA_CONFIG.depth,
          rotation: "-90 0 0",
          position: "0 0.01 0",
          material: "src: #textura-suelo; repeat: 4 3; roughness: 0.7",
          shadow: "receive: true",
        });

        appendEl(parent, "a-plane", {
          width: AULA_CONFIG.width,
          height: AULA_CONFIG.depth,
          rotation: "90 0 0",
          position: "0 3.5 0",
          material: "color: #f0ece4; roughness: 0.9",
        });

        addWall(
          parent,
          {
            width: "0.2",
            height: "3.5",
            depth: "6",
            position: boardX + " 1.75 0",
          },
          colorParedes,
          "3 1.75",
        );
        addWall(
          parent,
          {
            width: "8",
            height: "3.5",
            depth: "0.2",
            position: "0 1.75 -3",
          },
          colorParedes,
          "4 1.75",
        );
        addWall(
          parent,
          {
            width: "8",
            height: "3.5",
            depth: "0.2",
            position: "0 1.75 3",
          },
          colorParedes,
          "4 1.75",
        );
        addWall(
          parent,
          {
            width: "0.2",
            height: "1.2",
            depth: "6",
            position: hallX + " 2.9 0",
          },
          colorParedes,
          "3 0.6",
        );

        appendEl(parent, "a-entity", {
          "gltf-model": "#modelo-puerta",
          position: -side * 3.9 + " 0 0",
          rotation: "0 " + side * 90 + " 0",
          scale: "2 2 2",
          shadow: "cast: true; receive: true",
        });

        appendEl(parent, "a-entity", {
          "gltf-model": "#modelo-pizarra",
          position: side * 3.5 + " 1.3 0",
          rotation: facingRotation,
          scale: "0.5 0.5 0.5",
          shadow: "cast: true; receive: true",
        });

        [
          [side * 1.5, 0, -1.5],
          [side * 1.5, 0, 0],
          [side * 1.5, 0, 1.5],
          [-side * 1, 0, -1.5],
          [-side * 1, 0, 0],
          [-side * 1, 0, 1.5],
        ].forEach(function (position) {
          appendEl(parent, "a-entity", {
            class: "pupitre",
            "gltf-model": "#modelo-pupitre",
            position: position.join(" "),
            rotation: deskRotation,
            scale: "0.3 0.3 0.3",
            shadow: "cast: true; receive: true",
          });
        });

        appendEl(parent, "a-light", {
          type: "point",
          color: "#FFFFFF",
          intensity: "0.7",
          position: "0 3.2 0",
          distance: "10",
          decay: "2",
        });
        appendEl(parent, "a-light", {
          type: "point",
          color: "#FFFACD",
          intensity: "0.4",
          position: side * 3 + " 2.5 0",
          distance: "5",
          decay: "2",
        });
      }

      function getAulaDisplayName(id, tipo) {
        var names = {
          matematica: "Analisis Matematico",
          algoritmos: "Algoritmos",
          cpu: "Planificacion de CPU",
          fisica: "Fisica",
          probabilidad: "Probabilidad",
          complejidad: "Complejidad Computacional",
        };
        var match = String(id || "").match(/\d+/);
        var number = match ? match[0] : "?";
        return "Aula " + number + "\n" + (names[tipo] || "Laboratorio");
      }

      function addAulaSign(parent, id, tipo, posicionXYZ) {
        var side = getAulaSide(posicionXYZ);
        var hallX = -side * 4.08;
        var sign = appendEl(parent, "a-entity", {
          id: id + "-cartel",
          position: hallX + " 1.95 -1.9",
          rotation: "0 " + -side * 90 + " 0",
        });

        appendEl(sign, "a-box", {
          width: "1.62",
          height: "0.72",
          depth: "0.045",
          color: "#92400E",
          opacity: "0.95",
          shadow: "cast: true; receive: true",
        });
        appendEl(sign, "a-box", {
          width: "1.5",
          height: "0.6",
          depth: "0.055",
          position: "0 0 0.02",
          color: "#111827",
          opacity: "0.96",
        });
        addText(sign, {
          value: getAulaDisplayName(id, tipo),
          position: "0 0.01 0.075",
          align: "center",
          color: "#FDE68A",
          width: "2.65",
          wrapCount: "20",
          scale: "0.68 0.68 0.68",
        });
      }

      function buildMathContent(parent) {
        var menu = appendEl(parent, "a-entity", {
          id: "math-menu",
          position: "-3.2 2.2 0",
          rotation: "0 90 0",
        });
        addText(menu, {
          value: "Analisis Matematico I",
          position: "0 0.8 0",
          align: "center",
          color: "#4CAF50",
          width: "6",
        });
        addText(menu, {
          value: "Selecciona una funcion:",
          position: "0 0.5 0",
          align: "center",
          color: "#fff",
          width: "4",
        });

        [
          ["btn-func1", "-1.2 0 0", "func1", "#FF6B6B", "sin(x)*cos(y)", "#fff", "2.5"],
          ["btn-func2", "0 0 0", "func2", "#4ECDC4", "x² + y²", "#fff", "2.5"],
          [
            "btn-func3",
            "1.2 0 0",
            "func3",
            "#45B7D1",
            "sin(sqrt(x²+y²))",
            "#fff",
            "2.2",
          ],
          ["btn-func4", "-0.6 -0.5 0", "func4", "#96CEB4", "cos(x)*sin(y)", "#fff", "2.5"],
          ["btn-func5", "0.6 -0.5 0", "func5", "#FFEAA7", "e^(-(x²+y²))", "#333", "2.5"],
        ].forEach(function (btn) {
          addButton(menu, {
            id: btn[0],
            position: btn[1],
            action: btn[2],
            color: btn[3],
            label: btn[4],
            textColor: btn[5],
            textWidth: btn[6],
          });
        });

        var display = appendEl(parent, "a-entity", {
          id: "function-display",
          visible: false,
          position: "0 0 0",
        });
        addText(display, {
          id: "current-function-title",
          value: "",
          position: "-2 3 0",
          rotation: "0 90 0",
          align: "center",
          color: "#4CAF50",
          width: "6",
        });
        appendEl(display, "a-entity", {
          id: "math-surface",
          position: "0 1.5 0",
          scale: "0.65 0.65 0.65",
        });
        appendEl(display, "a-cylinder", {
          position: "0 1.5 0",
          rotation: "0 0 90",
          height: "2.6",
          radius: "0.011",
          color: "red",
        });
        addText(display, {
          value: "X",
          position: "1.5 1.5 0",
          color: "red",
          width: "2",
        });
        appendEl(display, "a-cylinder", {
          position: "0 1.5 0",
          height: "2.6",
          radius: "0.011",
          color: "green",
        });
        addText(display, {
          value: "Y",
          position: "0 2.95 0",
          color: "green",
          width: "2",
        });
        appendEl(display, "a-cylinder", {
          position: "0 1.5 0",
          rotation: "90 0 0",
          height: "2.6",
          radius: "0.011",
          color: "blue",
        });
        addText(display, {
          value: "Z",
          position: "0 1.5 1.5",
          color: "blue",
          width: "2",
        });
        addButton(display, {
          id: "btn-back-to-menu",
          position: "-3.2 1 0",
          rotation: "0 90 0",
          action: "back-math",
          color: "#9B59B6",
          label: "<- Menu Funciones",
          height: "0.25",
          depth: "0.06",
          textPosition: "0 0 0.04",
        });
      }

      function buildAlgorithmContent(parent) {
        var menu = appendEl(parent, "a-entity", {
          id: "alg-menu",
          position: "3.2 2.2 0",
          rotation: "0 -90 0",
        });
        addText(menu, {
          value: "Algoritmos de Ordenamiento",
          position: "0 0.8 0",
          align: "center",
          color: "#2196F3",
          width: "6",
        });
        addText(menu, {
          value: "Selecciona un algoritmo:",
          position: "0 0.5 0",
          align: "center",
          color: "#fff",
          width: "4",
        });

        [
          ["btn-algo1", "-1.1 0.05 0", "algo-bubble", "#FF6B6B", "Bubble Sort", "0.9", "2.5"],
          ["btn-algo2", "0 0.05 0", "algo-insertion", "#4ECDC4", "Insertion Sort", "0.9", "2.5"],
          ["btn-algo3", "1.1 0.05 0", "algo-quick", "#45B7D1", "Quick Sort", "0.9", "2.5"],
          ["btn-algo4", "-0.75 -0.4 0", "algo-baraja", "#8BC34A", "Baraja", "1.35", "2.5"],
          [
            "btn-algo5",
            "0.75 -0.4 0",
            "algo-intercambio",
            "#FF9800",
            "Intercambio Directo",
            "1.35",
            "2.4",
          ],
        ].forEach(function (btn) {
          addButton(menu, {
            id: btn[0],
            position: btn[1],
            action: btn[2],
            color: btn[3],
            label: btn[4],
            width: btn[5],
            textWidth: btn[6],
          });
        });

        var display = appendEl(parent, "a-entity", {
          id: "algorithm-display",
          visible: false,
          position: "0 0 0",
        });
        addText(display, {
          id: "current-algo-title",
          value: "",
          position: "3.2 2.8 0",
          rotation: "0 -90 0",
          align: "center",
          color: "#2196F3",
          width: "6",
        });
        appendEl(display, "a-entity", {
          id: "algo-surface",
          position: "3.2 1.65 0",
          rotation: "0 -90 0",
        });
        addButton(display, {
          id: "btn-back-to-alg-menu",
          position: "3.2 1.2 -0.8",
          rotation: "0 -90 0",
          action: "back-algo",
          color: "#9B59B6",
          label: "<- Menu Algoritmos",
          height: "0.25",
          depth: "0.06",
          textPosition: "0 0 0.04",
        });
        addButton(display, {
          id: "btn-restart-algo",
          position: "3.2 1.2 0.8",
          rotation: "0 -90 0",
          action: "restart-algo",
          color: "#FF9800",
          label: "Reiniciar",
          height: "0.25",
          depth: "0.06",
          textPosition: "0 0 0.04",
        });
        addButton(display, {
          id: "btn-pause-algo",
          position: "3.2 0.85 -0.95",
          rotation: "0 -90 0",
          action: "pause-algo",
          color: "#2196F3",
          label: "Pausar",
          labelId: "pause-algo-label",
          width: "0.85",
          height: "0.24",
          depth: "0.06",
          textWidth: "2.1",
          textPosition: "0 0 0.04",
        });
        addButton(display, {
          id: "btn-back-step-algo",
          position: "3.2 0.85 0",
          rotation: "0 -90 0",
          action: "back-step-algo",
          color: "#607D8B",
          label: "Atras",
          width: "0.85",
          height: "0.24",
          depth: "0.06",
          textWidth: "2.1",
          textPosition: "0 0 0.04",
        });
        addButton(display, {
          id: "btn-slow-algo",
          position: "3.2 0.85 0.95",
          rotation: "0 -90 0",
          action: "slow-algo",
          color: "#795548",
          label: "Vel 1x",
          labelId: "slow-algo-label",
          width: "0.85",
          height: "0.24",
          depth: "0.06",
          textWidth: "2.1",
          textPosition: "0 0 0.04",
        });
      }

      function buildPlaceholderContent(parent, id, tipo, posicionXYZ, colorParedes) {
        if (tipo === "fisica") {
          buildFisicaContent(parent, id, posicionXYZ);
        } else if (tipo === "cpu") {
          buildCpuSchedulerContent(parent, id, posicionXYZ);
        } else if (tipo === "probabilidad") {
          buildProbabilityContent(parent, id, posicionXYZ, colorParedes);
        } else if (tipo === "complejidad") {
          buildComplexityContent(parent, id, posicionXYZ);
        } else {
          var side = getAulaSide(posicionXYZ);
          var title = "Simulador de CPU";
          var root = appendEl(parent, "a-entity", {
            id: id + "-sim-root",
            position: side * 3.2 + " 2.2 0",
            rotation: "0 " + -side * 90 + " 0",
          });
          addText(root, {
            value: title,
            position: "0 0.45 0",
            align: "center",
            color: "#42A5F5",
            width: "5.5",
          });
        }
      }

      function buildCpuSchedulerContent(parent, id, posicionXYZ) {
        var side = getAulaSide(posicionXYZ);
        var frontX = side * 3.86;
        var frontRot = "0 " + -side * 90 + " 0";

        parent.querySelectorAll(".pupitre").forEach(function (desk, i) {
          var x = i < 3 ? -side * 3.05 : side * 3.05;
          var z = [-2.2, 0, 2.2][i % 3];
          desk.setAttribute("position", x + " 0 " + z);
          desk.setAttribute("scale", "0.22 0.22 0.22");
        });

        var root = appendEl(parent, "a-entity", {
          id: "cpu-lab",
          position: "0 0.03 0",
        });

        function addCpuPanel(config) {
          var panel = appendEl(root, "a-entity", {
            id: config.id,
            position: config.position,
            rotation: config.rotation,
          });
          appendEl(panel, "a-plane", {
            width: config.width,
            height: config.height,
            color: config.color || "#0F1720",
            opacity: config.opacity || "0.88",
            material: "side: double",
          });
          appendEl(panel, "a-plane", {
            width: config.width,
            height: "0.025",
            position: "0 " + (config.height / 2 - 0.04) + " 0.012",
            color: config.accent || "#42A5F5",
            opacity: "0.9",
          });
          return panel;
        }

        var frontPanel = addCpuPanel({
          id: "cpu-front-panel",
          position: frontX + " 2.0 -0.15",
          rotation: frontRot,
          width: 5.8,
          height: 2.2,
          accent: "#64B5F6",
        });
        addText(frontPanel, {
          value: "LABORATORIO DE PLANIFICACI\u00d3N DE CPU",
          position: "0 0.88 0.03",
          align: "center",
          color: "#90CAF9",
          width: "5.2",
        });
        addText(frontPanel, {
          value: "Visualiza como diferentes algoritmos asignan la CPU a los procesos.",
          position: "0 0.63 0.03",
          align: "center",
          color: "#E3F2FD",
          width: "4.8",
        });
        addText(frontPanel, {
          value: "DIAGRAMA DE GANTT",
          position: "0 0.34 0.03",
          align: "center",
          color: "#BBDEFB",
          width: "3.5",
        });
        appendEl(frontPanel, "a-plane", {
          width: "5.0",
          height: "0.55",
          position: "0 0.02 0.025",
          color: "#050B12",
          opacity: "0.82",
        });
        appendEl(frontPanel, "a-entity", {
          id: "cpu-gantt-scale",
          position: "-2.25 0.28 0.05",
        });
        appendEl(frontPanel, "a-entity", {
          id: "cpu-gantt-blocks",
          position: "-2.25 -0.03 0.06",
        });
        appendEl(frontPanel, "a-entity", {
          id: "cpu-gantt-legend",
          position: "-2.2 -0.42 0.05",
        });
        addText(frontPanel, {
          value:
            "\u00bfQue es el Diagrama de Gantt?\nMuestra en una linea de tiempo que proceso se ejecuta en la CPU. Cada bloque representa un intervalo continuo de ejecucion.",
          position: "0 -0.78 0.03",
          align: "center",
          color: "#CFD8DC",
          width: "4.8",
        });

        var leftPanel = addCpuPanel({
          id: "cpu-left-panel",
          position: "0 1.85 -2.88",
          rotation: "0 0 0",
          width: 3.2,
          height: 2.35,
          accent: "#29B6F6",
        });
        addText(leftPanel, {
          value: "ALGORITMOS DE PLANIFICACI\u00d3N",
          position: "0 0.94 0.03",
          align: "center",
          color: "#FFFFFF",
          width: "3.3",
        });
        [
          ["cpu-btn-fcfs", "0 0.58 0", "cpu-fcfs", "#1565C0", "FCFS"],
          ["cpu-btn-sjf", "0 0.24 0", "cpu-sjf", "#2E7D32", "SJF"],
          ["cpu-btn-srtf", "0 -0.1 0", "cpu-srtf", "#6A1B9A", "SRTF"],
          ["cpu-btn-rr", "0 -0.44 0", "cpu-rr", "#EF6C00", "ROUND ROBIN"],
        ].forEach(function (btn) {
          addButton(leftPanel, {
            id: btn[0],
            position: btn[1],
            action: btn[2],
            color: btn[3],
            label: btn[4],
            width: "2.55",
            height: "0.26",
            depth: "0.06",
            textWidth: "3.2",
            textPosition: "0 0 0.04",
          });
        });

        var controlPanel = addCpuPanel({
          id: "cpu-controls",
          position: "0 0.8 -2.88",
          rotation: "0 0 0",
          width: 3.2,
          height: 0.9,
          accent: "#81C784",
        });
        addText(controlPanel, {
          value: "CONTROLES",
          position: "0 0.33 0.03",
          align: "center",
          color: "#FFFFFF",
          width: "3",
        });
        [
          ["cpu-btn-start", "-0.92 0.02 0", "cpu-start", "#2E7D32", "INICIAR"],
          ["cpu-btn-pause", "0 0.02 0", "cpu-pause", "#B8860B", "PAUSAR"],
          ["cpu-btn-reset", "0.92 0.02 0", "cpu-reset", "#C62828", "REINICIAR"],
          ["cpu-btn-qminus", "-0.5 -0.28 0", "cpu-quantum-minus", "#1565C0", "QUANTUM -"],
          ["cpu-btn-qplus", "0.5 -0.28 0", "cpu-quantum-plus", "#1565C0", "QUANTUM +"],
        ].forEach(function (btn) {
          addButton(controlPanel, {
            id: btn[0],
            position: btn[1],
            action: btn[2],
            color: btn[3],
            label: btn[4],
            width: "0.82",
            height: "0.24",
            depth: "0.06",
            textWidth: "2.2",
            textPosition: "0 0 0.04",
          });
        });

        var metrics = addCpuPanel({
          id: "cpu-metrics-panel",
          position: "0 1.9 2.88",
          rotation: "0 180 0",
          width: 3.25,
          height: 2.05,
          accent: "#90CAF9",
        });
        addText(metrics, {
          value: "M\u00c9TRICAS",
          position: "0 0.82 0.03",
          align: "center",
          color: "#FFFFFF",
          width: "3",
        });
        addText(metrics, {
          id: "cpu-metrics-text",
          value: "",
          position: "-1.45 0.52 0.03",
          align: "left",
          color: "#E3F2FD",
          width: "3.1",
        });

        var table = addCpuPanel({
          id: "cpu-process-table-panel",
          position: "0 0.72 2.88",
          rotation: "0 180 0",
          width: 3.25,
          height: 1.05,
          accent: "#4FC3F7",
        });
        addText(table, {
          value: "TABLA DE PROCESOS",
          position: "0 0.39 0.03",
          align: "center",
          color: "#FFFFFF",
          width: "3",
        });
        addText(table, {
          id: "cpu-process-table-text",
          value: "",
          position: "-1.5 0.18 0.03",
          align: "left",
          color: "#E0F7FA",
          width: "3.15",
        });

        appendEl(root, "a-box", {
          id: "cpu-machine",
          position: "0 0.72 0",
          width: "1.05",
          height: "1.0",
          depth: "1.05",
          color: "#263238",
          metalness: "0.25",
          roughness: "0.45",
          shadow: "cast: true; receive: true",
        });
        appendEl(root, "a-box", {
          position: "0 1.25 0",
          width: "0.86",
          height: "0.08",
          depth: "0.86",
          color: "#80DEEA",
          opacity: "0.7",
        });
        addText(root, {
          value: "CPU",
          position: "0 1.36 0.58",
          align: "center",
          color: "#69F0AE",
          width: "3",
        });
        addText(root, {
          id: "cpu-current-label",
          value: "-",
          position: "0 0.82 0.56",
          align: "center",
          color: "#FFFFFF",
          width: "3",
        });
        addText(root, {
          value: "La CPU ejecuta un solo proceso a la vez.",
          position: "0 0.15 0.75",
          align: "center",
          color: "#E8F5E9",
          width: "3.2",
        });

        [
          ["Nuevo", "Procesos que acaban de llegar.", "-2.65 0.04 1.55", "#9E9E9E"],
          ["Cola de Listos", "Esperan disponibilidad de CPU.", "-2.25 0.04 -1.45", "#1E88E5"],
          ["Ejecutando / CPU", "Proceso activo en este instante.", "0 0.04 -1.35", "#43A047"],
          ["Espera / E/S", "Esperan Entrada/Salida.", "2.2 0.04 -1.45", "#FDD835"],
          ["Terminados", "Procesos finalizados.", "2.65 0.04 1.55", "#E53935"],
        ].forEach(function (zone) {
          var parts = zone[2].split(" ");
          appendEl(root, "a-plane", {
            position: zone[2],
            rotation: "-90 0 0",
            width: "1.85",
            height: "1.05",
            color: zone[3],
            opacity: "0.22",
          });
          addText(root, {
            value: zone[0],
            position: parts[0] + " 0.12 " + parts[2],
            rotation: "-90 0 0",
            align: "center",
            color: zone[3],
            width: "3.2",
          });
          addText(root, {
            value: zone[1],
            position: parts[0] + " 0.11 " + (parseFloat(parts[2]) + 0.34),
            rotation: "-90 0 0",
            align: "center",
            color: "#ECEFF1",
            width: "2.2",
          });
        });

        var flow = addCpuPanel({
          id: "cpu-flow-panel",
          position: "0 0.08 2.28",
          rotation: "-75 180 0",
          width: 5.4,
          height: 0.72,
          accent: "#78909C",
          opacity: "0.82",
        });
        addText(flow, {
          value: "\u00bfC\u00d3MO FUNCIONA?",
          position: "0 0.22 0.03",
          align: "center",
          color: "#B3E5FC",
          width: "4",
        });
        addText(flow, {
          value: "1. Llegada  ->  2. Listo  ->  3. Ejecucion  ->  4. E/S si aplica  ->  5. Termina",
          position: "0 -0.07 0.03",
          align: "center",
          color: "#FFFFFF",
          width: "5.2",
        });

        addText(root, {
          id: "cpu-status-text",
          value: "Elegi un algoritmo y pulsa Iniciar",
          position: "0 2.92 -2.25",
          align: "center",
          color: "#E3F2FD",
          width: "5.5",
        });

        appendEl(root, "a-entity", { id: "cpu-processes" });
        setTimeout(function () {
          resetCpuScheduler();
        }, 0);
      }




      function buildFisicaContent(parent, id, posicionXYZ) {
        var side = getAulaSide(posicionXYZ);
        var menu = appendEl(parent, "a-entity", {
          id: id + "-fisica-menu",
          position: side * 3.2 + " 2.2 0",
          rotation: "0 " + -side * 90 + " 0",
        });
        addText(menu, {
          value: "Simulador de Física",
          position: "0 0.8 0",
          align: "center",
          color: "#4CAF50",
          width: "6",
        });
        addText(menu, {
          value: "Selecciona un tipo de movimiento:",
          position: "0 0.5 0",
          align: "center",
          color: "#fff",
          width: "4",
        });

        // Botón MRU
        addButton(menu, {
          id: "btn-mru",
          position: "-0.7 0 0",
          action: "show-mru",
          color: "#2196F3",
          label: "MRU",
          textColor: "#fff",
          textWidth: "2.5",
        });

        // Botón MRUV
        addButton(menu, {
          id: "btn-mruv",
          position: "0.7 0 0",
          action: "show-mruv",
          color: "#FF9800",
          label: "MRUV",
          textColor: "#fff",
          textWidth: "2.5",
        });

        // Entidad para mostrar el ejercicio MRUV
        var mruvDisplay = appendEl(parent, "a-entity", {
          id: id + "-mruv-display",
          visible: false,
          position: side * 3.0 + " 2.6 0",
          rotation: "0 " + -side * 90 + " 0",
        });

        addText(mruvDisplay, {
          id: "mruv-title",
          value: "Ejercicio 2: MRUV",
          position: "0 0.5 0",
          align: "center",
          color: "#FF9800",
          width: "5.5",
          scale: "1.0 1.0 1.0",
        });

        addText(mruvDisplay, {
          id: "mruv-enunciado",
          value: "Un auto esta detenido frente a un semaforo en rojo.\nCuando la luz cambia a verde, el conductor acelera\nen linea recta por la avenida. El auto parte del\nreposo con una aceleracion constante de 2,5 m/s²\ndurante un tiempo de 4 segundos. Calcula:",
          position: "-1 -0.3 0",
          align: "left",
          color: "#fff",
          width: "3.4",
          wrapCount: "46",
          scale: "0.72 0.72 0.72",
        });

        addText(mruvDisplay, {
          id: "mruv-pregunta",
          value: "1. ¿Que velocidad alcanza?\n2. ¿Que distancia recorre?",
          position: "-1 -1.05 0",
          align: "left",
          color: "#FFEB3B",
          width: "3.4",
          wrapCount: "46",
          scale: "0.72 0.72 0.72",
        });

        addButton(mruvDisplay, {
          id: "btn-simular-mruv",
          position: "0 -1.4 0",
          action: "simulate-mruv",
          color: "#4CAF50",
          label: "▶ SIMULAR",
          textColor: "#fff",
          textWidth: "2.5",
          height: "0.3",
          width: "1.0",
        });

        addButton(mruvDisplay, {
          id: "btn-back-mruv",
          position: "0 -1.9 0",
          action: "back-fisica",
          color: "#9B59B6",
          label: "<- Volver",
          textColor: "#fff",
          textWidth: "2.5",
          height: "0.3",
          width: "1.0",
        });

        // Entidad para la simulación (auto animado)
        var simulationArea = appendEl(parent, "a-entity", {
          id: id + "-mruv-simulation",
          visible: false,
          position: side * 3.2 + " 1.3 0",
          rotation: "0 " + -side * 90 + " 0",
        });

        // Auto (representado como un cubo + cilindro)
        var car = appendEl(simulationArea, "a-entity", {
          id: "mruv-car",
          position: "-1.5 0 0",
        });

        appendEl(car, "a-box", {
          width: "0.4",
          height: "0.25",
          depth: "0.8",
          color: "#E53935",
        });

        appendEl(car, "a-cylinder", {
          radius: "0.1",
          height: "0.05",
          color: "#333",
          position: "-0.15 -0.15 -0.25",
          rotation: "90 0 0",
        });

        appendEl(car, "a-cylinder", {
          radius: "0.1",
          height: "0.05",
          color: "#333",
          position: "0.15 -0.15 -0.25",
          rotation: "90 0 0",
        });

        appendEl(car, "a-cylinder", {
          radius: "0.1",
          height: "0.05",
          color: "#333",
          position: "-0.15 -0.15 0.25",
          rotation: "90 0 0",
        });

        appendEl(car, "a-cylinder", {
          radius: "0.1",
          height: "0.05",
          color: "#333",
          position: "0.15 -0.15 0.25",
          rotation: "90 0 0",
        });

        // Línea de referencia en el suelo
        appendEl(simulationArea, "a-plane", {
          width: "5",
          height: "0.02",
          color: "#666",
          position: "0 -0.3 0",
          rotation: "-90 0 0",
        });

        // Marcas de distancia
        for (var i = 0; i <= 5; i++) {
          appendEl(simulationArea, "a-box", {
            width: "0.1",
            height: "0.2",
            depth: "0.02",
            color: "#666",
            position: (-2 + i) + " -0.25 0",
          });
          addText(simulationArea, {
            value: (i * 4) + "m",
            position: (-2 + i) + " 0.1 0",
            align: "center",
            color: "#888",
            width: "1.5",
            scale: "0.35 0.35 0.35",
          });
        }

        // Texto de información durante la simulación
        addText(simulationArea, {
          id: "mruv-sim-info",
          value: "Presionando...",
          position: "0 0.5 0",
          align: "center",
          color: "#FFEB3B",
          width: "4.5",
          scale: "0.75 0.75 0.75",
        });

        // Entidad para mostrar resultados
        var resultsDisplay = appendEl(parent, "a-entity", {
          id: id + "-mruv-results",
          visible: false,
          position: "0 0 0",
        });

        addText(resultsDisplay, {
          id: "results-title",
          value: "Resultados de la Simulación",
          position: side * 3.8+ " 3 0",
          rotation: "0 " + -side * 90 + " 0",
          align: "center",
          color: "#4CAF50",
          width: "6",
        });

        addText(resultsDisplay, {
          id: "results-content",
          value: "",
          position: side * 3.8 + " 2.2 0",
          rotation: "0 " + -side * 90 + " 0",
          align: "left",
          color: "#fff",
          width: "2.8",
          wrapCount: "40",
          scale: "0.75 0.75 0.75",
        });

        addButton(resultsDisplay, {
          id: "btn-back-results",
          position: side * 3.8 + " 0.4 0",
          rotation: "0 " + -side * 90 + " 0",
          action: "back-fisica",
          color: "#9B59B6",
          label: "<- Volver",
          textColor: "#fff",
          textWidth: "2.5",
          height: "0.3",
          width: "0.9",
        });

        // ===== ENTIDADES MRU =====

        var mruDisplay = appendEl(parent, "a-entity", {
          id: id + "-mru-display",
          visible: false,
          position: side * 3.0 + " 2.6 0",
          rotation: "0 " + -side * 90 + " 0",
        });

        addText(mruDisplay, {
          value: "Ejercicio 1: MRU",
          position: "0 0.5 0",
          align: "center",
          color: "#2196F3",
          width: "5.5",
        });

        addText(mruDisplay, {
          value: "Un auto circula a velocidad constante de\n20 m/s (72 km/h) por la autopista\nen linea recta. No acelera ni frena.\nCalcula:",
          position: "-1 -0.2 0",
          align: "left",
          color: "#fff",
          width: "3.4",
          wrapCount: "46",
          scale: "0.72 0.72 0.72",
        });

        addText(mruDisplay, {
          value: "1. ¿Que distancia recorre en 4 segundos?\n2. ¿En cuanto tiempo recorre 60 m?",
          position: "-1 -1.0 0",
          align: "left",
          color: "#FFEB3B",
          width: "3.4",
          wrapCount: "46",
          scale: "0.72 0.72 0.72",
        });

        addButton(mruDisplay, {
          id: "btn-simular-mru",
          position: "0 -1.4 0",
          action: "simulate-mru",
          color: "#2196F3",
          label: "▶ SIMULAR",
          textColor: "#fff",
          textWidth: "2.5",
          height: "0.3",
          width: "1.0",
        });

        addButton(mruDisplay, {
          id: "btn-back-mru",
          position: "0 -1.9 0",
          action: "back-fisica",
          color: "#9B59B6",
          label: "<- Volver",
          textColor: "#fff",
          textWidth: "2.5",
          height: "0.3",
          width: "1.0",
        });

        // Simulación MRU
        var mruSimulation = appendEl(parent, "a-entity", {
          id: id + "-mru-simulation",
          visible: false,
          position: side * 3.2 + " 1.3 0",
          rotation: "0 " + -side * 90 + " 0",
        });

        var mruCar = appendEl(mruSimulation, "a-entity", {
          id: "mru-car",
          position: "-2 0 0",
        });

        appendEl(mruCar, "a-box", {
          width: "0.4",
          height: "0.25",
          depth: "0.8",
          color: "#1565C0",
        });

        [[-0.15, -0.15, -0.25], [0.15, -0.15, -0.25],
         [-0.15, -0.15,  0.25], [0.15, -0.15,  0.25]].forEach(function (pos) {
          appendEl(mruCar, "a-cylinder", {
            radius: "0.1",
            height: "0.05",
            color: "#333",
            position: pos.join(" "),
            rotation: "90 0 0",
          });
        });

        // Flecha que indica velocidad constante
        appendEl(mruCar, "a-box", {
          width: "0.32",
          height: "0.04",
          depth: "0.04",
          color: "#42A5F5",
          position: "0 0.22 0",
        });
        appendEl(mruCar, "a-box", {
          width: "0.08",
          height: "0.08",
          depth: "0.04",
          color: "#42A5F5",
          position: "0.18 0.22 0",
          rotation: "0 0 45",
        });

        appendEl(mruSimulation, "a-plane", {
          width: "5",
          height: "0.02",
          color: "#666",
          position: "0 -0.3 0",
          rotation: "-90 0 0",
        });

        // Marcas cada 20 m (escala 0.05: 20 m = 1 unidad de escena)
        // La marca de 60 m (mi=3) se resalta en naranja — responde pregunta 2
        for (var mi = 0; mi <= 4; mi++) {
          var isSixtyM = (mi === 3);
          appendEl(mruSimulation, "a-box", {
            width: "0.1",
            height: isSixtyM ? "0.3" : "0.2",
            depth: "0.02",
            color: isSixtyM ? "#FF9800" : "#666",
            position: (-2 + mi) + " -0.25 0",
          });
          addText(mruSimulation, {
            value: (mi * 20) + "m",
            position: (-2 + mi) + " 0.1 0",
            align: "center",
            color: isSixtyM ? "#FF9800" : "#888",
            width: "1.5",
            scale: "0.35 0.35 0.35",
          });
        }

        addText(mruSimulation, {
          id: "mru-sim-info",
          value: "Listo...",
          position: "0 0.55 0",
          align: "center",
          color: "#42A5F5",
          width: "4.5",
          scale: "0.75 0.75 0.75",
        });

        // Resultados MRU
        var mruResultsDisplay = appendEl(parent, "a-entity", {
          id: id + "-mru-results",
          visible: false,
          position: "0 0 0",
        });

        addText(mruResultsDisplay, {
          value: "Resultados de la Simulacion",
          position: side * 3.8 + " 3 0",
          rotation: "0 " + -side * 90 + " 0",
          align: "center",
          color: "#2196F3",
          width: "6",
        });

        addText(mruResultsDisplay, {
          id: "mru-results-content",
          value: "",
          position: side * 3.8 + " 2.2 0",
          rotation: "0 " + -side * 90 + " 0",
          align: "left",
          color: "#fff",
          width: "3.4",
          wrapCount: "46",
          scale: "0.7 0.7 0.7",
        });

        addButton(mruResultsDisplay, {
          id: "btn-back-mru-results",
          position: side * 3.8 + " 0.4 0",
          rotation: "0 " + -side * 90 + " 0",
          action: "back-fisica",
          color: "#9B59B6",
          label: "<- Volver",
          textColor: "#fff",
          textWidth: "2.5",
          height: "0.3",
          width: "0.9",
        });
      }

      function buildProbabilityContent(parent, id, posicionXYZ, colorParedes) {
        var side = getAulaSide(posicionXYZ);
        var frontX = side * 3.82;
        var frontRot = "0 " + -side * 90 + " 0";
        var rightWallX = -side * 3.82;
        var rightMachineX = -side * 3.15;
        var rightWallRot = "0 " + side * 90 + " 0";

        parent.querySelectorAll(".pupitre").forEach(function (desk) {
          desk.parentNode.removeChild(desk);
        });

        var root = appendEl(parent, "a-entity", {
          id: "probability-lab",
          position: "0 0.03 0",
        });

        function addPanel(config) {
          var panel = appendEl(root, "a-entity", {
            id: config.id,
            position: config.position,
            rotation: config.rotation,
          });
          appendEl(panel, "a-plane", {
            width: config.width,
            height: config.height,
            color: config.color || "#101820",
            opacity: config.opacity || "0.9",
            material: "side: double",
          });
          appendEl(panel, "a-plane", {
            width: config.width,
            height: "0.03",
            position: "0 " + (config.height / 2 - 0.05) + " 0.012",
            color: config.accent || "#26A69A",
            opacity: "0.95",
          });
          return panel;
        }

        function expandProbabilityClassroom() {
          var floor = parent.querySelector("#" + id + "-suelo");
          if (floor) {
            floor.setAttribute("width", "9.6");
            floor.setAttribute("height", "10.8");
            floor.setAttribute("position", "0.8 0.01 -1.925");
            floor.setAttribute("material", "src: #textura-suelo; repeat: 4.8 5.4; roughness: 0.7");
          }

          parent.querySelectorAll(".collidable").forEach(function (wall) {
            var width = parseFloat(wall.getAttribute("width") || 0);
            var depth = parseFloat(wall.getAttribute("depth") || 0);
            var pos = wall.getAttribute("position");
            var p = typeof pos === "string" ? pos.split(" ").map(parseFloat) : [pos.x, pos.y, pos.z];
            if (Math.abs(depth - 0.2) < 0.02 && Math.abs(p[2] + 3) < 0.05) {
              wall.setAttribute("width", "9.6");
              wall.setAttribute("position", "0.8 1.75 -7.2");
              wall.setAttribute("material", wallMaterial(colorParedes, "4.8 1.75"));
            } else if (Math.abs(depth - 0.2) < 0.02 && Math.abs(p[2] - 3) < 0.05) {
              wall.setAttribute("width", "9.6");
              wall.setAttribute("position", "0.8 1.75 3.35");
              wall.setAttribute("material", wallMaterial(colorParedes, "4.8 1.75"));
            } else if (Math.abs(width - 0.2) < 0.02 && Math.abs(p[0] - side * 4) < 0.1) {
              wall.setAttribute("depth", "12");
              wall.setAttribute("position", side * 4 + " 1.75 -1.925");
              wall.setAttribute("material", wallMaterial(colorParedes, "5.25 1.75"));
            } else if (Math.abs(width - 0.2) < 0.02 && Math.abs(p[0] + side * 4) < 0.1) {
              wall.setAttribute("height", "1.2");
              wall.setAttribute("depth", "10.55");
              wall.setAttribute("position", -side * 5.6 + " 2.9 -1.925");
              wall.setAttribute("material", wallMaterial(colorParedes, "5.25 0.6"));
            }
          });

          parent.querySelectorAll("a-plane").forEach(function (plane) {
            var pos = plane.getAttribute("position");
            var p = typeof pos === "string" ? pos.split(" ").map(parseFloat) : pos ? [pos.x, pos.y, pos.z] : [0, 0, 0];
            if (Math.abs(p[1] - 3.5) < 0.05) {
              plane.setAttribute("width", "9.6");
              plane.setAttribute("height", "10.8");
              plane.setAttribute("position", "0.8 3.5 -1.925");
            }
          });

          var blackboard = parent.querySelector("[gltf-model='#modelo-pizarra']");
          if (blackboard) blackboard.setAttribute("position", side * 3.5 + " 1.3 0");
        }

        expandProbabilityClassroom();

        [
          [-1.45, 0, 1.25],
          [0, 0, 1.25],
          [1.45, 0, 1.25],
          [-1.45, 0, 0.25],
          [0, 0, 0.25],
          [1.45, 0, 0.25],
        ].forEach(function (pos) {
          appendEl(root, "a-entity", {
            class: "prob-audience-chair",
            "gltf-model": "#modelo-pupitre",
            position: pos.join(" "),
            rotation: "0 -90 0",
            scale: "0.24 0.24 0.24",
            shadow: "cast: true; receive: true",
          });
        });

        var centerTable = appendEl(root, "a-entity", {
          id: "prob-center-table-group",
          position: "0 0 2.25",
          rotation: "0 180 0",
        });

        appendEl(centerTable, "a-box", {
          id: "casino-center-table",
          position: "0 0.38 0",
          width: "2.45",
          height: "0.14",
          depth: "1.75",
          color: "#3B2414",
          visible: "false",
          material: "roughness: 0.45; metalness: 0.08",
          shadow: "cast: true; receive: true",
        });
        appendEl(centerTable, "a-box", {
          position: "0 0.47 0",
          width: "2.25",
          height: "0.035",
          depth: "1.55",
          color: "#0F766E",
          opacity: "0.92",
          visible: "false",
          shadow: "receive: true",
        });
        appendEl(centerTable, "a-box", {
          position: "0 0.515 -0.79",
          width: "2.35",
          height: "0.035",
          depth: "0.045",
          color: "#F59E0B",
          visible: "false",
        });
        appendEl(centerTable, "a-box", {
          position: "0 0.515 0.79",
          width: "2.35",
          height: "0.035",
          depth: "0.045",
          color: "#F59E0B",
          visible: "false",
        });
        appendEl(centerTable, "a-box", {
          position: "-1.18 0.515 0",
          width: "0.045",
          height: "0.035",
          depth: "1.6",
          color: "#F59E0B",
          visible: "false",
        });
        appendEl(centerTable, "a-box", {
          position: "1.18 0.515 0",
          width: "0.045",
          height: "0.035",
          depth: "1.6",
          color: "#F59E0B",
          visible: "false",
        });

        appendEl(centerTable, "a-box", {
          id: "prob-chart-panel",
          position: "0 1.48 -0.55",
          width: "4.05",
          height: "2.58",
          depth: "0.06",
          color: "#0B1115",
          opacity: "0.97",
          shadow: "cast: true; receive: true",
        });
        appendEl(centerTable, "a-box", {
          position: "0 2.78 -0.51",
          width: "4.18",
          height: "0.07",
          depth: "0.09",
          color: "#6B3F18",
          shadow: "cast: true; receive: true",
        });
        appendEl(centerTable, "a-box", {
          position: "0 0.16 -0.51",
          width: "4.18",
          height: "0.07",
          depth: "0.09",
          color: "#6B3F18",
          shadow: "cast: true; receive: true",
        });
        appendEl(centerTable, "a-box", {
          position: "-2.06 1.48 -0.51",
          width: "0.07",
          height: "2.61",
          depth: "0.09",
          color: "#6B3F18",
          shadow: "cast: true; receive: true",
        });
        appendEl(centerTable, "a-box", {
          position: "2.06 1.48 -0.51",
          width: "0.07",
          height: "2.61",
          depth: "0.09",
          color: "#6B3F18",
          shadow: "cast: true; receive: true",
        });
        appendEl(centerTable, "a-box", {
          position: "0 0.48 -0.55",
          width: "0.12",
          height: "0.9",
          depth: "0.08",
          color: "#3B2414",
          visible: "false",
          shadow: "cast: true; receive: true",
        });
        appendEl(centerTable, "a-entity", {
          id: "prob-chart",
          position: "-1.65 0.8 -0.49",
          rotation: "0 0 0",
          scale: "0.64 0.64 0.64",
        });
        addText(centerTable, {
          id: "prob-title",
          value: "Distribucion observada",
          position: "0 2.5 -0.48",
          rotation: "0 0 0",
          align: "center",
          color: "#E5E7EB",
          width: "4.6",
          scale: "0.74 0.74 0.74",
        });
        addText(centerTable, {
          id: "prob-theory-block",
          value: "",
          position: "0 1.93 -0.48",
          rotation: "0 0 0",
          align: "center",
          color: "#DBEAFE",
          width: "4.2",
          wrapCount: "62",
          scale: "0.42 0.42 0.42",
        });
        addText(centerTable, {
          id: "prob-chart-explanation",
          value: "",
          position: "0 2.23 -0.48",
          rotation: "0 0 0",
          align: "center",
          color: "#FDE68A",
          width: "4.1",
          wrapCount: "58",
          scale: "0.42 0.42 0.42",
        });
        addText(centerTable, {
          id: "prob-result",
          value: "",
          position: "1.12 1.22 -0.48",
          rotation: "0 0 0",
          align: "left",
          color: "#FFFFFF",
          width: "2.05",
          wrapCount: "28",
          scale: "0.48 0.48 0.48",
        });
        addText(centerTable, {
          id: "prob-last-outcome",
          value: "",
          position: "0 1.6 -0.48",
          rotation: "0 0 0",
          align: "center",
          color: "#FDE68A",
          width: "3.5",
          wrapCount: "44",
          scale: "0.4 0.4 0.4",
        });
        addButton(centerTable, {
          id: "prob-run-once-main",
          position: "-1.12 0.36 -0.47",
          rotation: "0 0 0",
          action: "prob-run-once",
          color: "#16A34A",
          label: "Jugar 1",
          width: "0.72",
          height: "0.2",
          textWidth: "1.8",
          textPosition: "0 0 0.04",
        });
        addButton(centerTable, {
          id: "prob-run-ten-main",
          position: "-0.35 0.36 -0.47",
          rotation: "0 0 0",
          action: "prob-run-ten",
          color: "#D97706",
          label: "Jugar 10",
          width: "0.76",
          height: "0.2",
          textWidth: "1.9",
          textPosition: "0 0 0.04",
        });
        addButton(centerTable, {
          id: "prob-run-hundred-main",
          position: "0.47 0.36 -0.47",
          rotation: "0 0 0",
          action: "prob-run-hundred",
          color: "#075985",
          label: "Jugar 100",
          width: "0.84",
          height: "0.2",
          textWidth: "2.05",
          textPosition: "0 0 0.04",
        });
        addButton(centerTable, {
          id: "prob-reset-main",
          position: "1.28 0.36 -0.47",
          rotation: "0 0 0",
          action: "prob-reset-observed",
          color: "#991B1B",
          label: "Reset",
          width: "0.66",
          height: "0.2",
          textWidth: "1.7",
          textPosition: "0 0 0.04",
        });

        var board = addPanel({
          id: "prob-board",
          position: frontX + " 2.05 0",
          rotation: frontRot,
          width: 4.6,
          height: 1.18,
          accent: "#F59E0B",
          color: "#16110A",
        });
        addText(board, {
          id: "prob-board-title",
          value: "Probabilidad teórica vs frecuencia observada",
          position: "0 0.4 0.03",
          align: "center",
          color: "#FDE68A",
          width: "4.3",
          scale: "0.78 0.78 0.78",
        });
        addText(board, {
          id: "prob-description",
          value: "",
          position: "0 0.08 0.03",
          align: "center",
          color: "#FFEDD5",
          width: "4.1",
          wrapCount: "50",
          scale: "0.58 0.58 0.58",
        });
        appendEl(board, "a-box", {
          width: "0.38",
          height: "0.1",
          depth: "0.015",
          position: "-1.2 -0.36 0.035",
          color: "#FDE047",
        });
        addText(board, {
          value: "Teoria esperada",
          position: "-0.78 -0.36 0.045",
          align: "left",
          color: "#F8FAFC",
          width: "4",
          scale: "0.46 0.46 0.46",
        });
        appendEl(board, "a-box", {
          width: "0.02",
          height: "0.32",
          depth: "0.01",
          position: "0.1 -0.36 0.04",
          color: "#64748B",
          opacity: "0.8",
        });
        appendEl(board, "a-box", {
          width: "0.38",
          height: "0.1",
          depth: "0.015",
          position: "0.62 -0.36 0.035",
          color: "#EF4444",
        });
        addText(board, {
          value: "Datos generados",
          position: "1.04 -0.36 0.045",
          align: "left",
          color: "#F8FAFC",
          width: "4",
          scale: "0.46 0.46 0.46",
        });

        function addMachineBase(config) {
          var backZ = parseFloat(config.backZ || "-0.52");
          var machine = appendEl(root, "a-entity", {
            id: config.id,
            position: config.position,
            rotation: config.rotation,
          });
          appendEl(machine, "a-box", {
            width: config.width || "1.35",
            height: "0.12",
            depth: config.depth || "1.05",
            position: "0 0.45 0",
            color: config.tableColor || "#2F1B11",
            shadow: "cast: true; receive: true",
          });
          appendEl(machine, "a-box", {
            width: config.width || "1.35",
            height: "0.75",
            depth: "0.12",
            position: "0 0.9 " + backZ,
            color: config.bodyColor || "#111827",
            opacity: "0.94",
            shadow: "cast: true; receive: true",
          });
          appendEl(machine, "a-plane", {
            width: (parseFloat(config.width || "1.35") - 0.18).toString(),
            height: "0.36",
            position: "0 0.98 " + (backZ + 0.064),
            color: "#020617",
            opacity: "0.92",
          });
          addText(machine, {
            id: config.displayId,
            value: "",
            position: "0 1.02 " + (backZ + 0.075),
            align: "center",
            color: config.accent || "#FDE68A",
            width: "2.35",
            wrapCount: "28",
            scale: "0.55 0.55 0.55",
          });
          addButton(machine, {
            id: config.buttonId,
            position: config.selectPosition || "-0.36 0.55 0.38",
            rotation: "-65 0 0",
            action: config.stationAction,
            color: config.accentDark || "#0F766E",
            label: config.selectLabel || "Elegir",
            width: config.selectWidth || "0.58",
            height: config.selectHeight || "0.22",
            depth: config.selectDepth || "0.05",
            textWidth: config.selectTextWidth || "1.7",
            textPosition: config.selectTextPosition || "0 0 0.04",
          });
          addButton(machine, {
            id: config.runButtonId,
            position: config.runPosition || "0.34 0.55 0.38",
            rotation: "-65 0 0",
            action: config.runAction || "prob-run-once",
            color: config.accent || "#F59E0B",
            label: config.runLabel || "Activar",
            width: config.runWidth || "0.66",
            height: config.runHeight || "0.22",
            depth: config.runDepth || "0.05",
            textWidth: config.runTextWidth || "1.8",
            textPosition: config.runTextPosition || "0 0 0.04",
          });
          appendEl(machine, "a-entity", {
            id: config.visualId,
            position: "0 0.63 0.03",
          });
          return machine;
        }

        function addStationBadge(parentEl, config) {
          var badge = appendEl(parentEl, "a-entity", {
            position: config.position,
            rotation: config.rotation || "0 0 0",
          });
          appendEl(badge, "a-plane", {
            width: config.width || "1.08",
            height: config.height || "0.32",
            color: config.color || "#020617",
            opacity: config.opacity || "0.94",
          });
          addText(badge, {
            value: config.title,
            position: "0 0.075 0.026",
            align: "center",
            color: config.titleColor || "#FFFFFF",
            width: config.titleWidth || "2.6",
            wrapCount: config.titleWrap || "26",
            scale: config.titleScale || "0.42 0.42 0.42",
          });
          addText(badge, {
            value: config.subtitle,
            position: "0 -0.08 0.026",
            align: "center",
            color: config.subtitleColor || "#CBD5E1",
            width: config.subtitleWidth || "2.8",
            wrapCount: config.subtitleWrap || "32",
            scale: config.subtitleScale || "0.31 0.31 0.31",
          });
          return badge;
        }

        function addMachineHeader(parentEl, config) {
          appendEl(parentEl, "a-box", {
            width: config.width || "1.08",
            height: config.height || "0.42",
            depth: "0.04",
            position: config.position,
            color: config.color || "#052E16",
            opacity: "0.98",
          });
          addText(parentEl, {
            value: config.title,
            position: config.titlePosition,
            align: "center",
            color: config.titleColor || "#FDE68A",
            width: config.titleWidth || "2.5",
            wrapCount: config.titleWrap || "22",
            scale: config.titleScale || "0.5 0.5 0.5",
          });
          addText(parentEl, {
            value: config.subtitle,
            position: config.subtitlePosition,
            align: "center",
            color: config.subtitleColor || "#E0F2FE",
            width: config.subtitleWidth || "2.8",
            wrapCount: config.subtitleWrap || "28",
            scale: config.subtitleScale || "0.36 0.36 0.36",
          });
        }

        var coinMachine = appendEl(root, "a-entity", {
          id: "prob-coin-machine",
          position: side * 3.15 + " 0 -2.05",
          rotation: frontRot,
          scale: "1.08 1.08 1.08",
        });
        appendEl(coinMachine, "a-box", {
          width: "1.34",
          height: "1.82",
          depth: "0.6",
          position: "0 1.04 -0.04",
          color: "#190D08",
          shadow: "cast: true; receive: true",
        });
        appendEl(coinMachine, "a-box", {
          width: "1.46",
          height: "0.18",
          depth: "0.72",
          position: "0 0.18 0",
          color: "#12362D",
          shadow: "cast: true; receive: true",
        });
        appendEl(coinMachine, "a-box", {
          width: "1.22",
          height: "1.62",
          depth: "0.035",
          position: "0 1.08 0.275",
          color: "#2A170B",
          opacity: "0.98",
        });
        addMachineHeader(coinMachine, {
          position: "0 1.78 0.31",
          width: "1.12",
          height: "0.32",
          color: "#06311F",
          title: "BINOMIAL",
          subtitle: "monedas: 10 lanzamientos",
          titlePosition: "0 1.84 0.34",
          subtitlePosition: "0 1.71 0.34",
          titleColor: "#FDE68A",
          subtitleColor: "#DCFCE7",
          titleScale: "0.54 0.54 0.54",
          subtitleScale: "0.3 0.3 0.3",
        });
        appendEl(coinMachine, "a-box", {
          width: "1.12",
          height: "0.56",
          depth: "0.045",
          position: "0 1.31 0.302",
          color: "#0F3B2D",
          opacity: "0.98",
        });
        appendEl(coinMachine, "a-plane", {
          width: "1.03",
          height: "0.47",
          position: "0 1.31 0.328",
          color: "#E7E0CE",
          opacity: "0.98",
        });
        for (var flip = 0; flip < 10; flip++) {
          var row = Math.floor(flip / 5);
          var col = flip % 5;
          var x = -0.4 + col * 0.2;
          var y = 1.39 - row * 0.19;
          appendEl(coinMachine, "a-cylinder", {
            id: "prob-coin-flip-body-" + flip,
            position: x + " " + y + " 0.36",
            rotation: "90 0 0",
            radius: "0.075",
            height: "0.018",
            color: "#C9BFA8",
            opacity: "0.98",
          });
          appendEl(coinMachine, "a-ring", {
            id: "prob-coin-flip-rim-" + flip,
            position: x + " " + y + " 0.374",
            "radius-inner": "0.061",
            "radius-outer": "0.073",
            color: "#A78A2D",
            opacity: "0.9",
          });
          appendEl(coinMachine, "a-circle", {
            id: "prob-coin-flip-face-head-" + flip,
            position: x + " " + (y + 0.017) + " 0.379",
            radius: "0.019",
            color: "#A98213",
            visible: "false",
          });
          appendEl(coinMachine, "a-circle", {
            id: "prob-coin-flip-face-body-" + flip,
            position: x + " " + (y - 0.024) + " 0.379",
            radius: "0.031",
            scale: "1.4 0.72 1",
            color: "#A98213",
            visible: "false",
          });
          appendEl(coinMachine, "a-box", {
            id: "prob-coin-flip-cross-a-" + flip,
            position: x + " " + y + " 0.379",
            rotation: "0 0 45",
            width: "0.09",
            height: "0.012",
            depth: "0.006",
            color: "#334155",
            visible: "false",
          });
          appendEl(coinMachine, "a-box", {
            id: "prob-coin-flip-cross-b-" + flip,
            position: x + " " + y + " 0.379",
            rotation: "0 0 -45",
            width: "0.09",
            height: "0.012",
            depth: "0.006",
            color: "#334155",
            visible: "false",
          });
          addText(coinMachine, {
            id: "prob-coin-flip-label-" + flip,
            value: "?",
            position: x + " " + (y - 0.012) + " 0.373",
            align: "center",
            color: "#3B2A16",
            width: "0.45",
            wrapCount: "4",
            scale: "0.28 0.28 0.28",
          });
        }
        addText(coinMachine, {
          value: "cara = rostro   cruz = X",
          position: "0 1.05 0.353",
          align: "center",
          color: "#D7F5E6",
          width: "2.2",
          wrapCount: "22",
          scale: "0.26 0.26 0.26",
        });
        appendEl(coinMachine, "a-box", {
          width: "1.03",
          height: "0.24",
          depth: "0.035",
          position: "0 0.9 0.326",
          color: "#07120C",
          opacity: "0.98",
        });
        addText(coinMachine, {
          id: "prob-coin-display",
          value: "",
          position: "0 0.9 0.353",
          align: "center",
          color: "#FDE68A",
          width: "2.2",
          wrapCount: "24",
          scale: "0.42 0.42 0.42",
        });
        appendEl(coinMachine, "a-box", {
          width: "1.02",
          height: "0.08",
          depth: "0.08",
          position: "0 0.72 0.315",
          color: "#111827",
        });
        appendEl(coinMachine, "a-box", {
          width: "1.04",
          height: "0.14",
          depth: "0.24",
          position: "0 0.43 0.2",
          color: "#0F172A",
          shadow: "cast: true; receive: true",
        });
        appendEl(coinMachine, "a-box", {
          width: "0.96",
          height: "0.025",
          depth: "0.2",
          position: "0 0.51 0.31",
          color: "#F59E0B",
        });
        addButton(coinMachine, {
          id: "prob-coin-select",
          position: "-0.3 0.62 0.35",
          rotation: "-12 0 0",
          action: "prob-station-coin",
          color: "#0F766E",
          label: "Elegir",
          width: "0.44",
          height: "0.16",
          depth: "0.045",
          textWidth: "1.2",
          textPosition: "0 0 0.035",
        });
        addButton(coinMachine, {
          id: "prob-coin-run",
          position: "0.31 0.62 0.35",
          rotation: "-12 0 0",
          action: "prob-run-once",
          color: "#B45309",
          label: "Simular",
          width: "0.44",
          height: "0.16",
          depth: "0.045",
          textWidth: "1.15",
          textPosition: "0 0 0.035",
        });
        appendEl(coinMachine, "a-entity", {
          id: "prob-coin-visuals",
          position: "0 0.39 0.32",
        });

        var diceMachine = addMachineBase({
          id: "prob-dice-machine",
          position: side * 3.15 + " 0 0",
          rotation: frontRot,
          displayId: "prob-dice-display",
          buttonId: "prob-dice-select",
          runButtonId: "prob-dice-run",
          visualId: "prob-dice-visuals",
          stationAction: "prob-station-dice",
          runAction: "prob-run-once",
          runLabel: "x1",
          selectPosition: "-0.54 0.54 0.43",
          selectWidth: "0.34",
          selectHeight: "0.17",
          selectDepth: "0.04",
          selectTextWidth: "0.95",
          selectTextPosition: "0 0 0.032",
          runPosition: "-0.18 0.54 0.43",
          runWidth: "0.3",
          runHeight: "0.17",
          runDepth: "0.04",
          runTextWidth: "0.9",
          runTextPosition: "0 0 0.032",
          accent: "#38BDF8",
          accentDark: "#0369A1",
          bodyColor: "#082F49",
          width: "1.55",
          depth: "1.12",
        });
        diceMachine.setAttribute("scale", "1.08 1.08 1.08");
        addMachineHeader(diceMachine, {
          position: "0 1.2 -0.455",
          width: "1.34",
          height: "0.36",
          color: "#031A2D",
          title: "UNIFORME\nDISCRETA",
          subtitle: "dado justo: caras 1 a 6",
          titlePosition: "0 1.28 -0.385",
          subtitlePosition: "0 1.13 -0.385",
          titleColor: "#7DD3FC",
          subtitleColor: "#E0F2FE",
          titleScale: "0.42 0.42 0.42",
          subtitleScale: "0.32 0.32 0.32",
        });
        addButton(diceMachine, {
          id: "prob-dice-run-ten",
          position: "0.16 0.54 0.43",
          rotation: "-65 0 0",
          action: "prob-run-ten",
          color: "#0284C7",
          label: "x10",
          width: "0.3",
          height: "0.17",
          depth: "0.04",
          textWidth: "0.9",
          textPosition: "0 0 0.032",
        });
        addButton(diceMachine, {
          id: "prob-dice-run-hundred",
          position: "0.52 0.54 0.43",
          rotation: "-65 0 0",
          action: "prob-run-hundred",
          color: "#075985",
          label: "x100",
          width: "0.34",
          height: "0.17",
          depth: "0.04",
          textWidth: "0.95",
          textPosition: "0 0 0.032",
        });
        function addDiePip(parentEl, position, rotation) {
          appendEl(parentEl, "a-circle", {
            position: position,
            rotation: rotation,
            radius: "0.026",
            color: "#111827",
            opacity: "0.98",
          });
        }

        function addDieFace(parentEl, face, value) {
          var side = 0.226;
          var offset = 0.088;
          var positions = {
            1: [[0, 0]],
            2: [[-offset, offset], [offset, -offset]],
            3: [[-offset, offset], [0, 0], [offset, -offset]],
            4: [[-offset, offset], [offset, offset], [-offset, -offset], [offset, -offset]],
            5: [[-offset, offset], [offset, offset], [0, 0], [-offset, -offset], [offset, -offset]],
            6: [[-offset, offset], [offset, offset], [-offset, 0], [offset, 0], [-offset, -offset], [offset, -offset]],
          }[value] || [];
          positions.forEach(function (pip) {
            var u = pip[0];
            var v = pip[1];
            if (face === "front") addDiePip(parentEl, u + " " + v + " " + side, "0 0 0");
            if (face === "back") addDiePip(parentEl, (-u) + " " + v + " " + (-side), "0 180 0");
            if (face === "right") addDiePip(parentEl, side + " " + v + " " + (-u), "0 90 0");
            if (face === "left") addDiePip(parentEl, (-side) + " " + v + " " + u, "0 -90 0");
            if (face === "top") addDiePip(parentEl, u + " " + side + " " + (-v), "-90 0 0");
            if (face === "bottom") addDiePip(parentEl, u + " " + (-side) + " " + v, "90 0 0");
          });
        }

        var diceCube = appendEl(diceMachine, "a-entity", {
          id: "prob-dice-cube",
          position: "0 0.78 0.08",
          rotation: "0 0 0",
        });
        appendEl(diceCube, "a-box", {
          width: "0.44",
          height: "0.44",
          depth: "0.44",
          color: "#F8FAFC",
          shadow: "cast: true; receive: true",
        });
        addDieFace(diceCube, "front", 5);
        addDieFace(diceCube, "right", 3);
        addDieFace(diceCube, "top", 1);
        addDieFace(diceCube, "back", 2);
        addDieFace(diceCube, "left", 4);
        addDieFace(diceCube, "bottom", 6);
        addText(diceMachine, {
          id: "prob-dice-result",
          value: "",
          position: "0 0.38 0.42",
          rotation: "-65 0 0",
          align: "center",
          color: "#E0F2FE",
          width: "1.9",
          scale: "0.36 0.36 0.36",
        });

        var callsMachine = appendEl(root, "a-entity", {
          id: "prob-calls-machine",
          position: side * 3.15 + " 0 2.05",
          rotation: frontRot,
          scale: "1.08 1.08 1.08",
        });
        appendEl(callsMachine, "a-box", {
          width: "1.46",
          height: "2.18",
          depth: "0.36",
          position: "0 1.25 -0.04",
          color: "#071D12",
          shadow: "cast: true; receive: true",
        });
        appendEl(callsMachine, "a-box", {
          width: "1.56",
          height: "0.16",
          depth: "0.5",
          position: "0 0.18 0",
          color: "#202A2E",
          shadow: "cast: true; receive: true",
        });
        addMachineHeader(callsMachine, {
          position: "0 1.98 0.155",
          width: "1.24",
          height: "0.38",
          color: "#030B07",
          title: "POISSON",
          subtitle: "autos que pasan por minuto",
          titlePosition: "0 2.06 0.18",
          subtitlePosition: "0 1.9 0.18",
          titleColor: "#D9F99D",
          subtitleColor: "#ECFCCB",
          titleScale: "0.58 0.58 0.58",
          subtitleScale: "0.31 0.31 0.31",
        });
        appendEl(callsMachine, "a-box", {
          width: "1.1",
          height: "0.3",
          depth: "0.028",
          position: "0 1.62 0.165",
          color: "#06130D",
          opacity: "0.98",
        });
        addText(callsMachine, {
          id: "prob-calls-display",
          value: "",
          position: "0 1.62 0.187",
          align: "center",
          color: "#F8FAFC",
          width: "2.15",
          wrapCount: "28",
          scale: "0.4 0.4 0.4",
        });
        addText(callsMachine, {
          value: "CALLE POR MINUTO",
          position: "0 1.37 0.18",
          align: "center",
          color: "#BAE6FD",
          width: "2.1",
          wrapCount: "24",
          scale: "0.31 0.31 0.31",
        });
        appendEl(callsMachine, "a-box", {
          width: "0.33",
          height: "0.01",
          depth: "0.01",
          position: "-0.47 1.37 0.18",
          color: "#38BDF8",
        });
        appendEl(callsMachine, "a-box", {
          width: "0.33",
          height: "0.01",
          depth: "0.01",
          position: "0.47 1.37 0.18",
          color: "#38BDF8",
        });
        appendEl(callsMachine, "a-entity", {
          id: "prob-traffic-scene",
          position: "0 0 0",
        });
        appendEl(callsMachine, "a-box", {
          position: "0 0.88 0.185",
          width: "1.08",
          height: "0.38",
          depth: "0.035",
          color: "#374151",
          opacity: "0.98",
        });
        for (var stripe = 0; stripe < 5; stripe++) {
          appendEl(callsMachine, "a-box", {
            position: (-0.42 + stripe * 0.21) + " 0.88 0.212",
            width: "0.09",
            height: "0.012",
            depth: "0.008",
            color: "#F8FAFC",
          });
        }
        appendEl(callsMachine, "a-box", {
          position: "-0.54 0.88 0.212",
          width: "0.018",
          height: "0.38",
          depth: "0.008",
          color: "#FACC15",
        });
        appendEl(callsMachine, "a-cylinder", {
          position: "0.52 1.12 0.2",
          radius: "0.025",
          height: "0.18",
          color: "#475569",
        });
        appendEl(callsMachine, "a-sphere", {
          id: "prob-traffic-light",
          position: "0.52 1.22 0.2",
          radius: "0.035",
          color: "#22C55E",
        });
        for (var car = 0; car < 10; car++) {
          var carEl = appendEl(callsMachine, "a-entity", {
            id: "prob-traffic-car-" + car,
            position: "0 0.88 0.23",
            visible: "false",
          });
          appendEl(carEl, "a-box", {
            width: "0.14",
            height: "0.055",
            depth: "0.045",
            position: "0 0 0",
            color: car % 3 === 0 ? "#F97316" : car % 3 === 1 ? "#38BDF8" : "#A3E635",
          });
          appendEl(carEl, "a-box", {
            width: "0.075",
            height: "0.04",
            depth: "0.04",
            position: "-0.012 0.04 0",
            color: "#E0F2FE",
          });
          [-0.045, 0.045].forEach(function (wheelX) {
            appendEl(carEl, "a-cylinder", {
              position: wheelX + " -0.035 0.026",
              rotation: "90 0 0",
              radius: "0.018",
              height: "0.012",
              color: "#111827",
            });
          });
        }
        addButton(callsMachine, {
          id: "prob-calls-select",
          position: "-0.31 0.42 0.31",
          rotation: "-10 0 0",
          action: "prob-station-calls",
          color: "#0369A1",
          label: "Elegir λ",
          width: "0.52",
          height: "0.17",
          depth: "0.045",
          textWidth: "1.35",
          textPosition: "0 0 0.035",
        });
        addButton(callsMachine, {
          id: "prob-calls-run",
          position: "0.31 0.42 0.31",
          rotation: "-10 0 0",
          action: "prob-run-once",
          color: "#38BDF8",
          label: "Avanzar minuto",
          width: "0.5",
          height: "0.17",
          depth: "0.045",
          textColor: "#082F49",
          textWidth: "1.7",
          textPosition: "0 0 0.035",
        });
        appendEl(callsMachine, "a-entity", {
          id: "prob-calls-visuals",
          position: "0 0.68 0.18",
        });

        var controls = addPanel({
          id: "prob-controls",
          position: "0 2.15 -5.03",
          rotation: "0 0 0",
          width: 2.6,
          height: 0.72,
          accent: "#22C55E",
          color: "#052E16",
          opacity: "0.86",
        });
        addText(controls, {
          id: "prob-dist-name",
          value: "",
          position: "0 0.18 0.03",
          align: "center",
          color: "#DCFCE7",
          width: "2.5",
          scale: "0.62 0.62 0.62",
        });
        addText(controls, {
          id: "prob-limits-text",
          value: "",
          position: "0 -0.12 0.03",
          align: "center",
          color: "#BBF7D0",
          width: "2.5",
          scale: "0.52 0.52 0.52",
        });
        var paramPanel = appendEl(root, "a-entity", {
          id: "prob-param-panel",
          position: "0 2.05 -2.62",
          rotation: "0 0 0",
        });
        appendEl(paramPanel, "a-plane", {
          position: "0 0 -0.018",
          width: "4.45",
          height: "2.62",
          color: "#0D1720",
          opacity: "0.88",
          material: "side: double; transparent: true; roughness: 0.7; metalness: 0.05",
        });
        appendEl(paramPanel, "a-plane", {
          position: "0 0 -0.015",
          width: "4.56",
          height: "2.73",
          color: "#60A5FA",
          opacity: "0.22",
          material: "side: double; transparent: true",
        });
        appendEl(paramPanel, "a-plane", {
          position: "0 0 0.002",
          width: "4.32",
          height: "2.46",
          color: "#111827",
          opacity: "0.78",
          material: "side: double; transparent: true",
        });
        addText(paramPanel, {
          value: "Parametros del modelo",
          position: "0 0.85 0.04",
          align: "center",
          color: "#E5F2FF",
          width: "4.2",
          scale: "0.9 0.9 0.9",
        });
        addText(paramPanel, {
          value: "Ajusta los parametros matematicos que definen la distribucion teorica",
          position: "0 0.61 0.04",
          align: "center",
          color: "#93C5FD",
          width: "4",
          scale: "0.44 0.44 0.44",
        });
        appendEl(paramPanel, "a-plane", {
          position: "0 0.41 0.025",
          width: "3.62",
          height: "0.012",
          color: "#60A5FA",
          opacity: "0.55",
          material: "side: double; transparent: true",
        });
        appendEl(paramPanel, "a-entity", {
          id: "prob-param-rows",
          position: "0 0.02 0.06",
          scale: "1 1 1",
        });

        setTimeout(function () {
          renderProbabilityLab();
        }, 0);
      }

      function buildComplexityContent(parent, id, posicionXYZ) {
        var side = getAulaSide(posicionXYZ);
        var frontX = side * 3.82;
        var frontRot = "0 " + -side * 90 + " 0";

        parent.querySelectorAll(".pupitre").forEach(function (desk, i) {
          var x = i < 3 ? -side * 3.0 : side * 3.0;
          var z = [-2.15, 0, 2.15][i % 3];
          desk.setAttribute("position", x + " 0 " + z);
          desk.setAttribute("scale", "0.22 0.22 0.22");
        });

        var root = appendEl(parent, "a-entity", {
          id: "complexity-lab",
          position: "0 0.03 0",
        });

        function addPanel(config) {
          var panel = appendEl(root, "a-entity", {
            id: config.id,
            position: config.position,
            rotation: config.rotation,
          });
          appendEl(panel, "a-plane", {
            width: config.width,
            height: config.height,
            color: config.color || "#17120B",
            opacity: config.opacity || "0.9",
            material: "side: double",
          });
          appendEl(panel, "a-plane", {
            width: config.width,
            height: "0.03",
            position: "0 " + (config.height / 2 - 0.05) + " 0.012",
            color: config.accent || "#F97316",
            opacity: "0.95",
          });
          return panel;
        }

        var board = addPanel({
          id: "complexity-board",
          position: frontX + " 2.05 0",
          rotation: frontRot,
          width: 5.95,
          height: 2.35,
          accent: "#F97316",
        });
        addText(board, {
          value: "Simulador de Complejidad Computacional",
          position: "0 0.93 0.03",
          align: "center",
          color: "#FDBA74",
          width: "5.6",
        });
        addText(board, {
          id: "complexity-code-title",
          value: "",
          position: "-2.55 0.72 0.03",
          align: "left",
          color: "#FFEDD5",
          width: "3.1",
          scale: "0.6 0.6 0.6",
        });
        addText(board, {
          id: "complexity-code",
          value: "",
          position: "-2.55 0.18 0.03",
          align: "left",
          color: "#E7E5E4",
          width: "3.0",
          wrapCount: "48",
          scale: "0.55 0.55 0.55",
        });
        appendEl(board, "a-plane", {
          width: "2.8",
          height: "1.05",
          position: "1.15 0.12 0.025",
          color: "#070707",
          opacity: "0.84",
        });
        appendEl(board, "a-entity", {
          id: "complexity-chart",
          position: "-0.15 -0.38 0.06",
        });
        addText(board, {
          id: "complexity-result",
          value: "",
          position: "0 -0.79 0.03",
          align: "center",
          color: "#FFFFFF",
          width: "5.4",
          wrapCount: "78",
          scale: "0.68 0.68 0.68",
        });

        var controls = addPanel({
          id: "complexity-controls",
          position: "0 1.72 -2.88",
          rotation: "0 0 0",
          width: 3.5,
          height: 3.3,
          accent: "#FB923C",
        });
        addText(controls, {
          value: "ANALIZA TU CODIGO",
          position: "0 1.5 0.03",
          align: "center",
          color: "#FFFFFF",
          width: "3.3",
        });
        addText(controls, {
          id: "complexity-case-name",
          value: "Sin calcular",
          position: "0 1.28 0.03",
          align: "center",
          color: "#FDBA74",
          width: "3.2",
          scale: "0.7 0.7 0.7",
        });

        // --- NUEVO PANEL IZQUIERDO: SELECCIÓN DIRECTA DE COMPLEJIDADES ---
        var advanced = appendEl(controls, "a-entity", {
          id: "complexity-advanced",
          position: "0 0 0",
        });

        addText(advanced, {
          value: "Selecciona una Complejidad:",
          position: "0 1.06 0.03",
          align: "center",
          color: "#FDBA74",
          width: "3.2",
          scale: "0.75 0.75 0.75",
        });

        [
          ["const", "Constante O(1)", "0.70", "#1D4ED8"],
          ["lineal", "Lineal O(n)", "0.40", "#1D4ED8"],
          ["binaria", "Binaria O(log n)", "0.10", "#1D4ED8"],
          ["ordena", "Ordena O(n log n)", "-0.20", "#1D4ED8"],
          ["doble", "Cuadratica O(n^2)", "-0.50", "#1D4ED8"],
          ["fibo", "Exponencial O(2^n)", "-0.80", "#1D4ED8"],
        ].forEach(function (btn) {
          addButton(advanced, {
            id: "complexity-code-" + btn[0],
            position: "0 " + btn[2] + " 0",
            action: "complexity-code-" + btn[0],
            color: btn[3],
            label: btn[1],
            width: "2.6",
            height: "0.24",
            textWidth: "2.8",
            textPosition: "0 0 0.04",
          });
        });

        addText(advanced, {
          value: "Toca cualquier caso para cargar graficas y metricas",
          position: "0 -1.15 0.03",
          align: "center",
          color: "#A8A29E",
          width: "3.2",
          scale: "0.55 0.55 0.55",
        });


        var metrics = addPanel({
          id: "complexity-metrics-panel",
          position: "0 1.75 2.88",
          rotation: "0 180 0",
          width: 3.65,
          height: 2.45,
          accent: "#A3E635",
        });
        addText(metrics, {
          value: "METRICAS AST",
          position: "0 1.06 0.03",
          align: "center",
          color: "#FFFFFF",
          width: "3.0",
          scale: "0.7 0.7 0.7",
        });
        addText(metrics, {
          id: "complexity-metrics",
          value: "",
          position: "-1.55 0.46 0.03",
          align: "left",
          color: "#ECFCCB",
          width: "3.15",
          wrapCount: "52",
          scale: "0.56 0.56 0.56",
        });
        addText(metrics, {
          id: "complexity-recommendation",
          value: "",
          position: "-1.55 -0.82 0.03",
          align: "left",
          color: "#FFFFFF",
          width: "3.15",
          wrapCount: "52",
          scale: "0.54 0.54 0.54",
        });

        setTimeout(function () {
          renderComplexityLab();
        }, 0);
      }

      function generarAula(id, posicionXYZ, colorParedes, tipo, targetEl) {
        var aula = targetEl || document.createElement("a-entity");
        var scene = document.querySelector("a-scene");
        id = id || "aula";
        tipo = tipo || "base";
        colorParedes = colorParedes || "#ffffff";

        while (aula.firstChild) aula.removeChild(aula.firstChild);
        aula.setAttribute("id", id);
        aula.setAttribute("position", vectorToString(posicionXYZ));
        aula.setAttribute("data-aula-tipo", tipo);

        addBaseClassroom(aula, id, posicionXYZ, colorParedes);
        addAulaSign(aula, id, tipo, posicionXYZ);

        if (tipo === "matematica") {
          buildMathContent(aula);
        } else if (tipo === "algoritmos") {
          buildAlgorithmContent(aula);
        } else if (tipo === "cpu" || tipo === "fisica" || tipo === "probabilidad" || tipo === "complejidad") {
          buildPlaceholderContent(aula, id, tipo, posicionXYZ, colorParedes);
        }

        if (!targetEl && scene) scene.appendChild(aula);
        return aula;
      }

      AFRAME.registerComponent("generar-aula", {
        schema: {
          posicionXYZ: { type: "vec3", default: { x: 0, y: 0, z: 0 } },
          colorParedes: { type: "color", default: "#ffffff" },
          tipo: { type: "string", default: "base" },
        },

        init: function () {
          generarAula(
            this.el.id,
            this.data.posicionXYZ,
            this.data.colorParedes,
            this.data.tipo,
            this.el,
          );
        },
      });

      // ============================================
      // COMPONENTE PLAYER-MOVEMENT
      // WASD + colisión + gravedad en un solo componente.
      // Calcula bounding boxes manualmente para evitar
      // errores de setFromObject con entidades anidadas.
      // Compatible con VR (teleport sigue funcionando).
      // ============================================
      AFRAME.registerComponent("player-movement", {
        schema: {
          speed: { type: "number", default: 4 },
          radius: { type: "number", default: 0.35 },
        },

        init: function () {
          this.keys = {};
          this.wallBoxes = [];
          this.forward = new THREE.Vector3();
          this.rightDir = new THREE.Vector3();
          this.tempBox = new THREE.Box3();
          this.ready = false;
          this.cameraEl = this.el.querySelector("[camera]");

          // Escuchar teclas
          this.onKeyDown = function (e) {
            this.keys[e.code] = true;
          }.bind(this);
          this.onKeyUp = function (e) {
            this.keys[e.code] = false;
          }.bind(this);
          this.onWindowBlur = function () {
            this.keys = {};
          }.bind(this);
          window.addEventListener("keydown", this.onKeyDown);
          window.addEventListener("keyup", this.onKeyUp);
          window.addEventListener("blur", this.onWindowBlur);

          // Esperar a que la escena renderice un frame para que
          // las matrices de mundo estén actualizadas. Como los scripts
          // se cargan desde Vite, la escena puede estar cargada antes de
          // que este componente se registre.
          var self = this;
          this.initializeMovement = function () {
            setTimeout(function () {
              self.buildCollisionBoxes();
              self.ready = true;
            }, 500);
          };

          if (this.el.sceneEl.hasLoaded) {
            this.initializeMovement();
          } else {
            this.el.sceneEl.addEventListener("loaded", this.initializeMovement, {
              once: true,
            });
          }
        },

        // Construir bounding boxes MANUALMENTE desde atributos
        // (no usa setFromObject que puede fallar con grupos anidados)
        buildCollisionBoxes: function () {
          this.wallBoxes = [];
          var walls = document.querySelectorAll(".collidable");
          var self = this;

          walls.forEach(function (wall) {
            // Leer dimensiones desde los atributos HTML
            var h = parseFloat(wall.getAttribute("height") || 1);

            // FILTRO: solo paredes estructurales (height >= 1m)
            // Esto ignora botones de menú (height 0.3-0.4m)
            if (h < 1.0) return;

            // Forzar actualización de la matriz de mundo
            wall.object3D.updateWorldMatrix(true, false);

            // Obtener posición en el MUNDO (no local)
            var worldPos = new THREE.Vector3();
            wall.object3D.getWorldPosition(worldPos);

            var w = parseFloat(wall.getAttribute("width") || 1) / 2;
            h = h / 2;
            var d = parseFloat(wall.getAttribute("depth") || 1) / 2;

            var box = new THREE.Box3(
              new THREE.Vector3(worldPos.x - w, worldPos.y - h, worldPos.z - d),
              new THREE.Vector3(worldPos.x + w, worldPos.y + h, worldPos.z + d),
            );

            self.wallBoxes.push(box);
          });

          console.log("Colision lista:", this.wallBoxes.length, "paredes");

          // Debug: mostrar las cajas que bloquean la zona del pasillo
          var debugCount = 0;
          for (var i = 0; i < this.wallBoxes.length; i++) {
            var b = this.wallBoxes[i];
            // Si la caja está cerca del centro del pasillo
            if (b.min.x < 1 && b.max.x > -1 && b.min.z < 7 && b.max.z > 5) {
              console.log(
                "Caja cerca del spawn:",
                i,
                "X[" + b.min.x.toFixed(1) + "," + b.max.x.toFixed(1) + "]",
                "Y[" + b.min.y.toFixed(1) + "," + b.max.y.toFixed(1) + "]",
                "Z[" + b.min.z.toFixed(1) + "," + b.max.z.toFixed(1) + "]",
              );
              debugCount++;
            }
          }
          if (debugCount === 0) {
            console.log("Ninguna caja bloquea la zona de spawn");
          }
        },

        // Verificar si posición (x, z) colisiona con alguna pared
        checkCollision: function (x, z) {
          var r = this.data.radius;
          // Solo verificar colisión en la franja de altura del jugador (0.2 a 1.5m)
          this.tempBox.min.set(x - r, 0.2, z - r);
          this.tempBox.max.set(x + r, 1.5, z + r);
          for (var i = 0; i < this.wallBoxes.length; i++) {
            if (this.wallBoxes[i].intersectsBox(this.tempBox)) {
              return true;
            }
          }
          return false;
        },

        tick: function (time, delta) {
          if (!this.ready || !delta || delta > 200) return;

          var pos = this.el.object3D.position;

          // GRAVEDAD: rig siempre a nivel del suelo
          pos.y = 0;

          // Solo procesar movimiento si hay teclas presionadas
          var anyKey =
            this.keys["KeyW"] ||
            this.keys["KeyS"] ||
            this.keys["KeyA"] ||
            this.keys["KeyD"] ||
            this.keys["ArrowUp"] ||
            this.keys["ArrowDown"] ||
            this.keys["ArrowLeft"] ||
            this.keys["ArrowRight"];
          if (!anyKey) return;

          var speed = this.data.speed;
          var dt = delta / 1000;

          // Obtener cámara para dirección de mirada
          var cam = this.cameraEl || this.el.querySelector("[camera]");
          if (!cam) return;
          this.cameraEl = cam;

          // Vector "adelante" (sin componente Y)
          this.forward.set(0, 0, -1);
          this.forward.applyQuaternion(cam.object3D.quaternion);
          this.forward.y = 0;
          if (this.forward.length() > 0.001) this.forward.normalize();

          // Vector "derecha" (sin componente Y)
          this.rightDir.set(1, 0, 0);
          this.rightDir.applyQuaternion(cam.object3D.quaternion);
          this.rightDir.y = 0;
          if (this.rightDir.length() > 0.001) this.rightDir.normalize();

          // Calcular dirección según teclas
          var moveX = 0,
            moveZ = 0;

          if (this.keys["KeyW"] || this.keys["ArrowUp"]) {
            moveX += this.forward.x;
            moveZ += this.forward.z;
          }
          if (this.keys["KeyS"] || this.keys["ArrowDown"]) {
            moveX -= this.forward.x;
            moveZ -= this.forward.z;
          }
          if (this.keys["KeyA"] || this.keys["ArrowLeft"]) {
            moveX -= this.rightDir.x;
            moveZ -= this.rightDir.z;
          }
          if (this.keys["KeyD"] || this.keys["ArrowRight"]) {
            moveX += this.rightDir.x;
            moveZ += this.rightDir.z;
          }

          // Normalizar diagonal
          var len = Math.sqrt(moveX * moveX + moveZ * moveZ);
          if (len < 0.01) return;
          moveX = (moveX / len) * speed * dt;
          moveZ = (moveZ / len) * speed * dt;

          var newX = pos.x + moveX;
          var newZ = pos.z + moveZ;

          // SLIDING: verificar cada eje por separado
          var xBlocked = this.checkCollision(newX, pos.z);
          var zBlocked = this.checkCollision(pos.x, newZ);

          if (!xBlocked) pos.x = newX;
          if (!zBlocked) pos.z = newZ;
        },

        remove: function () {
          window.removeEventListener("keydown", this.onKeyDown);
          window.removeEventListener("keyup", this.onKeyUp);
          window.removeEventListener("blur", this.onWindowBlur);
          this.el.sceneEl.removeEventListener("loaded", this.initializeMovement);
        },
      });

      // ============================================
      // COMPONENTE THUMBSTICK-LOCOMOTION
      // Locomoción suave con joystick del Quest.
      // Respeta la colisión del player-movement.
      // ============================================
      AFRAME.registerComponent("thumbstick-locomotion", {
        schema: {
          rig: { type: "selector" },
          camera: { type: "selector" },
          speed: { type: "number", default: 3 },
          deadzone: { type: "number", default: 0.15 },
        },

        init: function () {
          this.axis = { x: 0, y: 0 };
          this.forward = new THREE.Vector3();
          this.rightDir = new THREE.Vector3();

          var self = this;
          this.onAxisMove = function (evt) {
            var a = evt.detail.axis;
            // xr-standard: [0,1]=touchpad, [2,3]=thumbstick
            if (a && a.length >= 4) {
              self.axis.x = a[2];
              self.axis.y = a[3];
            } else if (a && a.length >= 2) {
              self.axis.x = a[0];
              self.axis.y = a[1];
            }
          };
          this.el.addEventListener("axismove", this.onAxisMove);
        },

        tick: function (time, delta) {
          if (!delta || delta > 200) return;
          var dz = this.data.deadzone;
          var ax = Math.abs(this.axis.x) < dz ? 0 : this.axis.x;
          var ay = Math.abs(this.axis.y) < dz ? 0 : this.axis.y;
          if (ax === 0 && ay === 0) return;

          var rig = this.data.rig;
          var cam = this.data.camera;
          if (!rig || !cam) return;

          // Dirección según la cámara (HMD)
          this.forward.set(0, 0, -1).applyQuaternion(cam.object3D.quaternion);
          this.forward.y = 0;
          if (this.forward.length() > 0.001) this.forward.normalize();
          this.rightDir.set(1, 0, 0).applyQuaternion(cam.object3D.quaternion);
          this.rightDir.y = 0;
          if (this.rightDir.length() > 0.001) this.rightDir.normalize();

          // ay es adelante/atrás (negativo = adelante), ax es lateral
          var moveX = this.rightDir.x * ax - this.forward.x * ay;
          var moveZ = this.rightDir.z * ax - this.forward.z * ay;

          var len = Math.sqrt(moveX * moveX + moveZ * moveZ);
          if (len < 0.01) return;
          var dt = delta / 1000;
          var mag = Math.min(Math.sqrt(ax * ax + ay * ay), 1);
          moveX = (moveX / len) * this.data.speed * dt * mag;
          moveZ = (moveZ / len) * this.data.speed * dt * mag;

          var pos = rig.object3D.position;
          var pm = rig.components["player-movement"];
          var newX = pos.x + moveX;
          var newZ = pos.z + moveZ;

          // Reutilizar colisión de player-movement si está lista
          if (pm && pm.ready) {
            if (!pm.checkCollision(newX, pos.z)) pos.x = newX;
            if (!pm.checkCollision(pos.x, newZ)) pos.z = newZ;
          } else {
            pos.x = newX;
            pos.z = newZ;
          }
        },

        remove: function () {
          this.el.removeEventListener("axismove", this.onAxisMove);
        },
      });
