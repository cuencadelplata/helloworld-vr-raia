      // ============================================
      // SISTEMA INTERACTIVO DE LA FACULTAD VR
      // AM1 (Aula 1) + Algoritmos (Aula 2)
      // ============================================

      // Variables globales
      var algorithmTimeouts = [];
      var currentFunction = null;
      var currentAlgorithm = null;
      var isSorting = false;
      var algorithmState = null;
      var algorithmSpeedOptions = [
        { label: "Vel 1x", factor: 1 },
        { label: "Lento", factor: 1.6 },
        { label: "Muy lento", factor: 2.4 },
      ];
      var lastRenderTime = 0;
      var isRenderingFunction = false;

      // Definición de funciones matemáticas
      var mathFunctions = {
        func1: {
          name: "f(x,y) = sin(x) * cos(y)",
          description: "Funcion trigonometrica que crea ondas entrecruzadas",
          domain: "Dominio: x e [-pi, pi], y e [-pi, pi]",
          formula: function (x, z) {
            return Math.sin(x) * Math.cos(z);
          },
        },
        func2: {
          name: "f(x,y) = x² + y²",
          description: "Paraboloide circular - forma de cuenco",
          domain: "Dominio: x e [-2, 2], y e [-2, 2]",
          formula: function (x, z) {
            return (x * x + z * z) * 0.3;
          },
        },
        func3: {
          name: "f(x,y) = sin(sqrt(x²+y²))",
          description: "Ondas circulares concentricas",
          domain: "Dominio: x e [-3pi, 3pi], y e [-3pi, 3pi]",
          formula: function (x, z) {
            return Math.sin(Math.sqrt(x * x + z * z));
          },
        },
        func4: {
          name: "f(x,y) = cos(x) * sin(y)",
          description: "Ondas trigonometricas perpendiculares",
          domain: "Dominio: x e [-pi, pi], y e [-pi, pi]",
          formula: function (x, z) {
            return Math.cos(x) * Math.sin(z);
          },
        },
        func5: {
          name: "f(x,y) = e^(-(x²+y²))",
          description: "Distribucion gaussiana - campana 3D",
          domain: "Dominio: x e [-2, 2], y e [-2, 2]",
          formula: function (x, z) {
            return Math.exp(-(x * x + z * z));
          },
        },
      };

      // ===== FUNCIONES MATEMÁTICAS (AULA 1) =====

      function showMathMenu() {
        document.getElementById("math-menu").setAttribute("visible", true);
        document
          .getElementById("function-display")
          .setAttribute("visible", false);
        document.getElementById("mathHUD").style.display = "none";
      }

      function showFunction(functionKey) {
        var now = Date.now();
        if (now - lastRenderTime < 1000 || isRenderingFunction) return;
        isRenderingFunction = true;
        lastRenderTime = now;
        currentFunction = functionKey;

        document.getElementById("math-menu").setAttribute("visible", false);
        document
          .getElementById("function-display")
          .setAttribute("visible", true);

        var hud = document.getElementById("mathHUD");
        hud.style.display = "block";
        document.getElementById("functionTitle").textContent = "Cargando...";

        setTimeout(function () {
          generateMathSurface(functionKey);
          isRenderingFunction = false;
        }, 100);
      }

      function generateMathSurface(functionKey) {
        var surface = document.getElementById("math-surface");
        while (surface.firstChild) {
          surface.removeChild(surface.firstChild);
        }
        if (!mathFunctions[functionKey]) return;
        var func = mathFunctions[functionKey];
        var step = 0.25;
        var range = 2.5;

        try {
          var positions = [];
          var colors = [];
          var triangleCount = 0;

          for (var x = -range; x < range; x += step) {
            for (var z = -range; z < range; z += step) {
              var x1 = x,
                x2 = x + step,
                z1 = z,
                z2 = z + step;
              var y1 = func.formula(x1, z1);
              var y2 = func.formula(x2, z1);
              var y3 = func.formula(x1, z2);
              var y4 = func.formula(x2, z2);
              if (
                !isFinite(y1) ||
                !isFinite(y2) ||
                !isFinite(y3) ||
                !isFinite(y4)
              )
                continue;

              positions.push(x1, y1, z1, x2, y2, z1, x1, y3, z2);
              var avg1 = (y1 + y2 + y3) / 3;
              var n1 = Math.max(0, Math.min(1, (avg1 + 1) / 2));
              var c1 = hslToRgb(240 + n1 * 120, 0.7, 0.6);
              colors.push(c1.r, c1.g, c1.b, c1.r, c1.g, c1.b, c1.r, c1.g, c1.b);

              positions.push(x2, y2, z1, x2, y4, z2, x1, y3, z2);
              var avg2 = (y2 + y4 + y3) / 3;
              var n2 = Math.max(0, Math.min(1, (avg2 + 1) / 2));
              var c2 = hslToRgb(240 + n2 * 120, 0.7, 0.6);
              colors.push(c2.r, c2.g, c2.b, c2.r, c2.g, c2.b, c2.r, c2.g, c2.b);
              triangleCount += 2;
              if (triangleCount > 8000) break;
            }
            if (triangleCount > 8000) break;
          }

          var geometry = new THREE.BufferGeometry();
          geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(new Float32Array(positions), 3),
          );
          geometry.setAttribute(
            "color",
            new THREE.BufferAttribute(new Float32Array(colors), 3),
          );
          geometry.computeVertexNormals();
          var material = new THREE.MeshBasicMaterial({
            vertexColors: true,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.88,
          });
          var mesh = new THREE.Mesh(geometry, material);
          var meshEl = document.createElement("a-entity");
          meshEl.object3D.add(mesh);
          surface.appendChild(meshEl);
        } catch (error) {
          console.error("Error generando superficie:", error);
        }

        document.getElementById("functionTitle").textContent = func.name;
        document.getElementById("functionDescription").textContent =
          func.description;
        document.getElementById("functionDomain").textContent = func.domain;
        document
          .getElementById("current-function-title")
          .setAttribute("value", func.name);
      }

      function hslToRgb(h, s, l) {
        h = h / 360;
        var r, g, b;
        if (s === 0) {
          r = g = b = l;
        } else {
          var hue2rgb = function (p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
          };
          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;
          r = hue2rgb(p, q, h + 1 / 3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1 / 3);
        }
        return { r: r, g: g, b: b };
      }

      // ===== ALGORITMOS DE ORDENAMIENTO (AULA 2) =====

      function stopAlgorithmAnimations(opts) {
        opts = opts || {};
        algorithmTimeouts.forEach(clearTimeout);
        algorithmTimeouts = [];
        isSorting = false;
        algorithmState = null;
        var pi = document.getElementById("progress-indicator");
        if (pi && pi.parentNode) pi.parentNode.removeChild(pi);
        var ad = document.getElementById("array-display");
        if (ad && ad.parentNode) ad.parentNode.removeChild(ad);
        if (opts.resetDisplay) {
          var algDisp = document.getElementById("algorithm-display");
          var algMenu = document.getElementById("alg-menu");
          if (algDisp) algDisp.setAttribute("visible", false);
          if (algMenu) algMenu.setAttribute("visible", true);
          currentAlgorithm = null;
          document.getElementById("mathHUD").style.display = "none";
        }
      }

      function scheduleAlgorithmTimeout(cb, delay) {
        var id = setTimeout(function () {
          algorithmTimeouts = algorithmTimeouts.filter(function (t) {
            return t !== id;
          });
          cb();
        }, delay);
        algorithmTimeouts.push(id);
        return id;
      }

      function updateAlgorithmControlLabels() {
        var pauseLabel = document.getElementById("pause-algo-label");
        var slowLabel = document.getElementById("slow-algo-label");
        if (pauseLabel) {
          pauseLabel.setAttribute(
            "value",
            algorithmState && algorithmState.paused ? "Reanudar" : "Pausar",
          );
        }
        if (slowLabel) {
          var speedIndex = algorithmState ? algorithmState.speedIndex : 0;
          slowLabel.setAttribute(
            "value",
            algorithmSpeedOptions[speedIndex].label,
          );
        }
      }

      function resetAlgorithmCubeColors(parent) {
        if (!parent) return;
        var all = parent.querySelectorAll(".algo-cube");
        all.forEach(function (c) {
          var b = c.querySelector(".cube-body");
          if (b) b.setAttribute("color", "#8BC34A");
        });
      }

      function showAlgorithm(algoKey) {
        stopAlgorithmAnimations();
        currentAlgorithm = algoKey;
        document.getElementById("alg-menu").setAttribute("visible", false);
        document
          .getElementById("algorithm-display")
          .setAttribute("visible", true);
        var title =
          {
            bubble: "Bubble Sort",
            insertion: "Insertion Sort",
            quick: "Quick Sort",
            baraja: "Baraja",
            intercambio: "Intercambio Directo",
          }[algoKey] || "Algoritmo";
        document
          .getElementById("current-algo-title")
          .setAttribute("value", title);
        var hud = document.getElementById("mathHUD");
        hud.style.display = "block";
        document.getElementById("functionTitle").textContent = title;
        var descs = {
          bubble:
            "Compara elementos adyacentes e intercambia si estan en orden incorrecto.",
          insertion: "Toma elementos e inserta en la posicion correcta.",
          quick: "Selecciona un pivote y reorganiza los elementos.",
          baraja: "Ordena como una baraja: toma cada elemento y lo inserta donde corresponde.",
          intercambio:
            "Compara pares vecinos e intercambia directamente cuando estan invertidos.",
        };
        document.getElementById("functionDescription").textContent =
          descs[algoKey] || "";
        document.getElementById("functionDomain").textContent =
          "Observa las comparaciones y movimientos";

        var arr = generateRandomArray();
        generateAlgorithmBars(arr);
        var steps = getSortingSteps(algoKey, arr.slice());
        animateAlgorithmSteps(steps, 800, algoKey);
      }

      function generateRandomArray() {
        var numbers = [1, 2, 3, 4, 5, 6, 7];
        for (var i = numbers.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = numbers[i];
          numbers[i] = numbers[j];
          numbers[j] = temp;
        }
        return numbers;
      }

      function generateAlgorithmBars(array) {
        var parent = document.getElementById("algo-surface");
        while (parent.firstChild) parent.removeChild(parent.firstChild);
        var spacing = 0.55;
        var totalWidth = (array.length - 1) * spacing;
        var cubeSize = 0.45;

        for (var i = 0; i < array.length; i++) {
          var val = array[i];
          var x = -totalWidth / 2 + i * spacing;
          var cc = document.createElement("a-entity");
          cc.setAttribute("position", x + " " + cubeSize / 2 + " 0");
          cc.setAttribute("class", "algo-cube");
          cc.setAttribute("data-index", i);
          cc.setAttribute("data-value", val);

          var cube = document.createElement("a-box");
          cube.setAttribute("width", cubeSize);
          cube.setAttribute("height", cubeSize);
          cube.setAttribute("depth", cubeSize);
          cube.setAttribute("color", "#4CAF50");
          cube.setAttribute("class", "cube-body");
          cc.appendChild(cube);

          var text = document.createElement("a-text");
          text.setAttribute("value", val.toString());
          text.setAttribute("align", "center");
          text.setAttribute("color", "#ffffff");
          text.setAttribute("width", 2.5);
          text.setAttribute("position", "0 0 " + (cubeSize / 2 + 0.01));
          cc.appendChild(text);

          parent.appendChild(cc);
        }
      }

      function getSortingSteps(algo, arr) {
        var steps = [];
        if (algo === "bubble" || algo === "intercambio") {
          for (var i = 0; i < arr.length - 1; i++) {
            for (var j = 0; j < arr.length - 1 - i; j++) {
              steps.push({ type: "compare", i: j, j: j + 1 });
              if (arr[j] > arr[j + 1]) {
                var t = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = t;
                steps.push({ type: "swap", i: j, j: j + 1 });
              }
            }
          }
        } else if (algo === "insertion" || algo === "baraja") {
          for (var i2 = 1; i2 < arr.length; i2++) {
            var j2 = i2;
            while (j2 > 0) {
              steps.push({ type: "compare", i: j2 - 1, j: j2 });
              if (arr[j2 - 1] > arr[j2]) {
                var t2 = arr[j2 - 1];
                arr[j2 - 1] = arr[j2];
                arr[j2] = t2;
                steps.push({ type: "swap", i: j2 - 1, j: j2 });
              } else break;
              j2--;
            }
          }
        } else if (algo === "quick") {
          (function qsort(a, lo, hi) {
            if (lo >= hi) return;
            var pivot = a[hi],
              p = lo;
            steps.push({ type: "pivot", index: hi });
            for (var k = lo; k < hi; k++) {
              steps.push({ type: "compare", i: k, j: hi });
              if (a[k] < pivot) {
                var tmp = a[k];
                a[k] = a[p];
                a[p] = tmp;
                steps.push({ type: "swap", i: k, j: p });
                p++;
              }
            }
            var tmp2 = a[p];
            a[p] = a[hi];
            a[hi] = tmp2;
            steps.push({ type: "swap", i: p, j: hi });
            qsort(a, lo, p - 1);
            qsort(a, p + 1, hi);
          })(arr, 0, arr.length - 1);
        }
        return steps;
      }

      function animateAlgorithmSteps(steps, delayMs, algorithmType) {
        isSorting = true;
        algorithmState = {
          steps: steps,
          stepIndex: 0,
          baseDelay: delayMs,
          speedIndex: 0,
          paused: false,
          locked: false,
          finished: false,
          parent: document.getElementById("algo-surface"),
          algorithmType: algorithmType,
        };
        updateAlgorithmControlLabels();
        scheduleNextAlgorithmStep(300);
      }

      function getAlgorithmDelay() {
        if (!algorithmState) return 800;
        return (
          algorithmState.baseDelay *
          algorithmSpeedOptions[algorithmState.speedIndex].factor
        );
      }

      function findAlgorithmCube(idx) {
        if (!algorithmState || !algorithmState.parent) return null;
        return algorithmState.parent.querySelector(
          '.algo-cube[data-index="' + idx + '"]',
        );
      }

      function readAlgorithmCubePos(el) {
        if (!el) return [0, 0, 0];
        var p = el.getAttribute("position");
        if (!p) return [0, 0, 0];
        if (typeof p === "string") {
          var pp = p.split(" ").map(parseFloat);
          return [pp[0] || 0, pp[1] || 0, pp[2] || 0];
        }
        return [p.x || 0, p.y || 0, p.z || 0];
      }

      function performAlgorithmSwap(i, j, dur, cb) {
        var aEl = findAlgorithmCube(i);
        var bEl = findAlgorithmCube(j);
        if (!aEl || !bEl) {
          if (cb) cb();
          return;
        }

        var posA = readAlgorithmCubePos(aEl);
        var posB = readAlgorithmCubePos(bEl);

        aEl.setAttribute("animation__swap", {
          property: "position",
          to: posB[0] + " " + posA[1] + " " + posA[2],
          dur: dur,
          easing: "easeInOutQuad",
        });
        bEl.setAttribute("animation__swap", {
          property: "position",
          to: posA[0] + " " + posB[1] + " " + posB[2],
          dur: dur,
          easing: "easeInOutQuad",
        });

        var bodyA = aEl.querySelector(".cube-body");
        var bodyB = bEl.querySelector(".cube-body");
        if (bodyA) bodyA.setAttribute("color", "#FF9800");
        if (bodyB) bodyB.setAttribute("color", "#FF9800");

        scheduleAlgorithmTimeout(function () {
          var idxA = aEl.getAttribute("data-index");
          var idxB = bEl.getAttribute("data-index");
          aEl.setAttribute("data-index", idxB);
          bEl.setAttribute("data-index", idxA);
          aEl.setAttribute(
            "position",
            posB[0] + " " + posA[1] + " " + posA[2],
          );
          bEl.setAttribute(
            "position",
            posA[0] + " " + posB[1] + " " + posB[2],
          );
          if (bodyA) bodyA.setAttribute("color", "#8BC34A");
          if (bodyB) bodyB.setAttribute("color", "#8BC34A");
          aEl.removeAttribute("animation__swap");
          bEl.removeAttribute("animation__swap");
          if (cb) cb();
        }, dur);
      }

      function applyAlgorithmStep(step, cb) {
        if (!algorithmState) {
          if (cb) cb();
          return;
        }
        var parent = algorithmState.parent;
        var factor = algorithmSpeedOptions[algorithmState.speedIndex].factor;
        resetAlgorithmCubeColors(parent);

        if (step.type === "compare") {
          var cA = findAlgorithmCube(step.i);
          var cB = findAlgorithmCube(step.j);
          if (cA) {
            var b = cA.querySelector(".cube-body");
            if (b) b.setAttribute("color", "#FFEB3B");
          }
          if (cB) {
            var b2 = cB.querySelector(".cube-body");
            if (b2) b2.setAttribute("color", "#FFEB3B");
          }
          scheduleAlgorithmTimeout(function () {
            if (cb) cb();
          }, 280 * factor);
        } else if (step.type === "swap") {
          performAlgorithmSwap(step.i, step.j, 600 * factor, cb);
        } else if (step.type === "pivot") {
          var pv = findAlgorithmCube(step.index);
          if (pv) {
            var pb = pv.querySelector(".cube-body");
            if (pb) pb.setAttribute("color", "#9C27B0");
          }
          scheduleAlgorithmTimeout(function () {
            if (cb) cb();
          }, 350 * factor);
        } else if (cb) {
          cb();
        }
      }

      function scheduleNextAlgorithmStep(delayOverride) {
        if (
          !algorithmState ||
          algorithmState.paused ||
          algorithmState.locked ||
          algorithmState.finished
        ) {
          return;
        }
        var delay =
          typeof delayOverride === "number" ? delayOverride : getAlgorithmDelay();
        scheduleAlgorithmTimeout(function () {
          runNextAlgorithmStep();
        }, delay);
      }

      function runNextAlgorithmStep() {
        if (
          !algorithmState ||
          algorithmState.paused ||
          algorithmState.locked ||
          algorithmState.finished
        ) {
          return;
        }
        if (algorithmState.stepIndex >= algorithmState.steps.length) {
          finishAlgorithmAnimation();
          return;
        }

        var step = algorithmState.steps[algorithmState.stepIndex];
        algorithmState.locked = true;
        applyAlgorithmStep(step, function () {
          if (!algorithmState) return;
          algorithmState.stepIndex++;
          algorithmState.locked = false;
          if (algorithmState.stepIndex >= algorithmState.steps.length) {
            finishAlgorithmAnimation();
          } else {
            scheduleNextAlgorithmStep();
          }
        });
      }

      function finishAlgorithmAnimation() {
        if (!algorithmState) return;
        resetAlgorithmCubeColors(algorithmState.parent);
        algorithmState.finished = true;
        algorithmState.paused = false;
        isSorting = false;
        updateAlgorithmControlLabels();
        document.getElementById("functionDomain").textContent =
          "Ordenamiento completado!";
      }

      function toggleAlgorithmPause() {
        if (!algorithmState || algorithmState.finished) return;
        algorithmState.paused = !algorithmState.paused;
        if (algorithmState.paused) {
          if (!algorithmState.locked) {
            algorithmTimeouts.forEach(clearTimeout);
            algorithmTimeouts = [];
          }
          document.getElementById("functionDomain").textContent =
            "Animacion pausada";
        } else {
          isSorting = true;
          document.getElementById("functionDomain").textContent =
            "Animacion reanudada";
          scheduleNextAlgorithmStep(250);
        }
        updateAlgorithmControlLabels();
      }

      function stepAlgorithmBack() {
        if (!algorithmState || algorithmState.locked) return;
        algorithmTimeouts.forEach(clearTimeout);
        algorithmTimeouts = [];
        algorithmState.paused = true;
        algorithmState.finished = false;
        isSorting = true;
        updateAlgorithmControlLabels();

        var previousSwap = null;
        while (algorithmState.stepIndex > 0) {
          algorithmState.stepIndex--;
          var step = algorithmState.steps[algorithmState.stepIndex];
          if (step.type === "swap") {
            previousSwap = step;
            break;
          }
        }

        if (!previousSwap) {
          resetAlgorithmCubeColors(algorithmState.parent);
          document.getElementById("functionDomain").textContent =
            "Ya estas al inicio del ordenamiento";
          return;
        }

        algorithmState.locked = true;
        document.getElementById("functionDomain").textContent =
          "Retrocediendo un intercambio";
        applyAlgorithmStep(previousSwap, function () {
          if (!algorithmState) return;
          algorithmState.locked = false;
          resetAlgorithmCubeColors(algorithmState.parent);
        });
      }

      function slowAlgorithm() {
        if (!algorithmState) return;
        algorithmState.speedIndex =
          (algorithmState.speedIndex + 1) % algorithmSpeedOptions.length;
        updateAlgorithmControlLabels();
        document.getElementById("functionDomain").textContent =
          "Velocidad: " + algorithmSpeedOptions[algorithmState.speedIndex].label;
        if (
          !algorithmState.paused &&
          !algorithmState.locked &&
          !algorithmState.finished
        ) {
          algorithmTimeouts.forEach(clearTimeout);
          algorithmTimeouts = [];
          scheduleNextAlgorithmStep(250);
        }
      }

      // ===== CPU SCHEDULER VR LAB (AULA 3) =====

      var cpuTimeouts = [];
      var cpuSchedulerState = null;
      var cpuColors = {
        new: "#9E9E9E",
        ready: "#1E88E5",
        running: "#43A047",
        waiting: "#FDD835",
        terminated: "#E53935",
      };
      var cpuAlgorithmNames = {
        fcfs: "FCFS",
        sjf: "SJF no preemptivo",
        srtf: "SRTF preemptivo",
        rr: "Round Robin",
      };

      var cpuProcessTemplate = [
        { id: "P1", arrivalTime: 0, burstTime: 8, ioStart: 3, ioDuration: 2 },
        { id: "P2", arrivalTime: 1, burstTime: 4, ioStart: null, ioDuration: 0 },
        { id: "P3", arrivalTime: 2, burstTime: 9, ioStart: 4, ioDuration: 3 },
        { id: "P4", arrivalTime: 3, burstTime: 5, ioStart: null, ioDuration: 0 },
      ];

      function cloneCpuProcesses() {
        return cpuProcessTemplate.map(function (p) {
          return {
            id: p.id,
            arrivalTime: p.arrivalTime,
            burstTime: p.burstTime,
            ioStart: p.ioStart,
            ioDuration: p.ioDuration,
            remainingTime: p.burstTime,
            executedTime: 0,
            ioRemaining: 0,
            ioDone: false,
            state: "new",
            startTime: null,
            completionTime: null,
            waitingTime: 0,
            responseTime: null,
            entity: null,
          };
        });
      }

      function ensureCpuState() {
        if (cpuSchedulerState) return cpuSchedulerState;
        cpuSchedulerState = {
          algorithm: "fcfs",
          quantum: 2,
          time: 0,
          readyQueue: [],
          waitingList: [],
          current: null,
          currentQuantum: 0,
          processes: cloneCpuProcesses(),
          gantt: [],
          running: false,
          paused: false,
          finished: false,
          busyTicks: 0,
        };
        return cpuSchedulerState;
      }

      function clearCpuTimeouts() {
        cpuTimeouts.forEach(clearTimeout);
        cpuTimeouts = [];
      }

      function scheduleCpuTimeout(cb, delay) {
        var id = setTimeout(function () {
          cpuTimeouts = cpuTimeouts.filter(function (t) {
            return t !== id;
          });
          cb();
        }, delay);
        cpuTimeouts.push(id);
      }

      function cpuZonePosition(state, index) {
        var map = {
          new: [-3.0 + index * 0.35, 0.34, 1.55],
          ready: [-2.75 + index * 0.35, 0.34, -1.45],
          running: [0, 1.18, 0.03],
          waiting: [1.85 + index * 0.35, 0.34, -1.45],
          terminated: [2.3 + index * 0.35, 0.34, 1.55],
        };
        return map[state] || [0, 0.36, 0];
      }

      function createCpuProcessEntity(proc, index) {
        var parent = document.getElementById("cpu-processes");
        if (!parent) return null;
        var pos = cpuZonePosition("new", index);
        var el = document.createElement("a-entity");
        el.setAttribute("id", "cpu-proc-" + proc.id);
        el.setAttribute("position", pos.join(" "));
        el.setAttribute("class", "cpu-process");

        var body = document.createElement("a-box");
        body.setAttribute("class", "cpu-process-body");
        body.setAttribute("width", "0.42");
        body.setAttribute("height", "0.42");
        body.setAttribute("depth", "0.42");
        body.setAttribute("color", cpuColors.new);
        body.setAttribute("shadow", "cast: true; receive: true");
        el.appendChild(body);

        var text = document.createElement("a-text");
        text.setAttribute("value", proc.id);
        text.setAttribute("align", "center");
        text.setAttribute("color", "#ffffff");
        text.setAttribute("width", "2");
        text.setAttribute("position", "0 0 0.23");
        el.appendChild(text);

        parent.appendChild(el);
        return el;
      }

      function moveCpuProcess(proc, state, index, preempted) {
        if (!proc || !proc.entity) return;
        proc.state = state;
        var pos = cpuZonePosition(state, index || 0);
        var body = proc.entity.querySelector(".cpu-process-body");
        if (body) body.setAttribute("color", cpuColors[state]);
        var scalePulse = preempted ? 1.28 : 1;
        proc.entity.setAttribute("scale", scalePulse + " " + scalePulse + " " + scalePulse);
        if (window.gsap) {
          gsap.to(proc.entity.object3D.position, {
            x: pos[0],
            y: pos[1],
            z: pos[2],
            duration: preempted ? 1.7 : 1.35,
            ease: "power2.inOut",
            onComplete: function () {
              proc.entity.setAttribute("position", pos.join(" "));
              proc.entity.setAttribute("scale", "1 1 1");
            },
          });
        } else {
          proc.entity.setAttribute("position", pos.join(" "));
          proc.entity.setAttribute("scale", "1 1 1");
        }
      }

      function layoutCpuQueues() {
        var s = ensureCpuState();
        s.processes.forEach(function (p, i) {
          if (p.state === "new") moveCpuProcess(p, "new", i);
        });
        s.readyQueue.forEach(function (p, i) {
          moveCpuProcess(p, "ready", i);
        });
        s.waitingList.forEach(function (p, i) {
          moveCpuProcess(p, "waiting", i);
        });
        s.processes
          .filter(function (p) {
            return p.state === "terminated";
          })
          .forEach(function (p, i) {
            moveCpuProcess(p, "terminated", i);
          });
        if (s.current) moveCpuProcess(s.current, "running", 0);
      }

      function updateCpuButtons() {
        var s = ensureCpuState();
        var pauseLabel = document.querySelector("#cpu-btn-pause a-text");
        if (pauseLabel) pauseLabel.setAttribute("value", s.paused ? "Reanudar" : "Pausar");
        ["fcfs", "sjf", "srtf", "rr"].forEach(function (alg) {
          var box = document.querySelector("#cpu-btn-" + alg + " a-box");
          if (box) {
            box.setAttribute("opacity", s.algorithm === alg ? "1" : "0.72");
          }
        });
      }

      function updateCpuMetrics() {
        var s = ensureCpuState();
        var completed = s.processes.filter(function (p) {
          return p.state === "terminated";
        });
        var avg = function (field) {
          if (!completed.length) return "0.0";
          var sum = completed.reduce(function (acc, p) {
            return acc + (p[field] || 0);
          }, 0);
          return (sum / completed.length).toFixed(1);
        };
        var throughput = s.time > 0 ? (completed.length / s.time).toFixed(2) : "0.00";
        var utilization = s.time > 0 ? ((s.busyTicks / s.time) * 100).toFixed(0) : "0";
        var text =
          "Tiempo actual: " + s.time +
          "\nAlgoritmo: " + cpuAlgorithmNames[s.algorithm] +
          "\nQuantum: " + (s.algorithm === "rr" ? s.quantum : "-") +
          "\nTiempo de espera prom. (WT): " + avg("waitingTime") +
          "\nTiempo de retorno prom. (TAT): " + avg("turnaroundTime") +
          "\nTiempo de respuesta prom.: " + avg("responseTime") +
          "\nProcesos por segundo: " + throughput +
          "\nUtilizacion de CPU: " + utilization + "%";
        var metrics = document.getElementById("cpu-metrics-text");
        if (metrics) metrics.setAttribute("value", text);
        var status = document.getElementById("cpu-status-text");
        if (status) {
          var current = s.current ? "Ejecutando " + s.current.id : "CPU libre";
          if (s.finished) current = "Simulacion finalizada";
          status.setAttribute("value", current);
        }
        var cpuCurrent = document.getElementById("cpu-current-label");
        if (cpuCurrent) {
          cpuCurrent.setAttribute("value", s.current ? s.current.id : "-");
        }
        var table = document.getElementById("cpu-process-table-text");
        if (table) table.setAttribute("value", buildCpuProcessTableText());
        updateCpuButtons();
      }

      function getCpuStateLabel(state) {
        return {
          new: "Nuevo",
          ready: "Listo",
          running: "Ejecutando",
          waiting: "Espera/E/S",
          terminated: "Terminado",
        }[state] || "-";
      }

      function buildCpuProcessTableText() {
        var s = ensureCpuState();
        var lines = ["Proceso | Llegada | Rafaga | E/S ini | E/S dur | Estado"];
        s.processes.forEach(function (p) {
          lines.push(
            p.id +
              " | " +
              p.arrivalTime +
              " | " +
              p.burstTime +
              " | " +
              (p.ioStart === null ? "-" : p.ioStart) +
              " | " +
              (p.ioDuration || "-") +
              " | " +
              getCpuStateLabel(p.state),
          );
        });
        return lines.join("\n");
      }

      function resetCpuGantt() {
        var parent = document.getElementById("cpu-gantt-blocks");
        if (!parent) return;
        while (parent.firstChild) parent.removeChild(parent.firstChild);
        renderCpuGanttScale();
        renderCpuGanttLegend();
      }

      function renderCpuGanttScale() {
        var parent = document.getElementById("cpu-gantt-scale");
        if (!parent) return;
        while (parent.firstChild) parent.removeChild(parent.firstChild);
        for (var t = 0; t <= 30; t += 5) {
          var x = t * 0.15;
          appendEl(parent, "a-box", {
            width: "0.012",
            height: "0.12",
            depth: "0.02",
            position: x + " -0.07 0",
            color: "#B0BEC5",
          });
          addText(parent, {
            value: String(t),
            position: x + " 0.03 0.02",
            align: "center",
            color: "#ECEFF1",
            width: "1.2",
          });
        }
        addText(parent, {
          value: "Tiempo ->",
          position: "4.8 0.03 0.02",
          align: "center",
          color: "#ECEFF1",
          width: "1.4",
        });
      }

      function renderCpuGanttLegend() {
        var parent = document.getElementById("cpu-gantt-legend");
        if (!parent) return;
        while (parent.firstChild) parent.removeChild(parent.firstChild);
        var colors = getCpuProcessColors();
        ["P1", "P2", "P3", "P4"].forEach(function (pid, i) {
          var x = i * 0.5;
          appendEl(parent, "a-box", {
            width: "0.12",
            height: "0.12",
            depth: "0.03",
            position: x + " 0 0",
            color: colors[pid],
          });
          addText(parent, {
            value: pid,
            position: x + 0.16 + " 0 0.02",
            align: "left",
            color: "#E3F2FD",
            width: "1.4",
          });
        });
      }

      function getCpuProcessColors() {
        return { P1: "#42A5F5", P2: "#66BB6A", P3: "#AB47BC", P4: "#FFA726" };
      }

      function addCpuGanttBlock(pid, start, duration) {
        var parent = document.getElementById("cpu-gantt-blocks");
        if (!parent) return;
        var colors = getCpuProcessColors();
        var scale = 0.15;
        var width = Math.max(0.11, duration * scale);
        var x = start * scale + width / 2;
        var block = document.createElement("a-entity");
        block.setAttribute("position", x + " 0 0");
        var box = document.createElement("a-box");
        box.setAttribute("width", width);
        box.setAttribute("height", "0.26");
        box.setAttribute("depth", "0.05");
        box.setAttribute("color", colors[pid] || "#B0BEC5");
        block.appendChild(box);
        var label = document.createElement("a-text");
        label.setAttribute("value", pid);
        label.setAttribute("align", "center");
        label.setAttribute("color", "#ffffff");
        label.setAttribute("width", "1.6");
        label.setAttribute("position", "0 0 0.04");
        block.appendChild(label);
        parent.appendChild(block);
      }

      function recordCpuExecution(pid) {
        var s = ensureCpuState();
        var last = s.gantt[s.gantt.length - 1];
        if (last && last.pid === pid && last.start + last.duration === s.time) {
          last.duration++;
          resetCpuGantt();
          s.gantt.forEach(function (b) {
            addCpuGanttBlock(b.pid, b.start, b.duration);
          });
        } else {
          var block = { pid: pid, start: s.time, duration: 1 };
          s.gantt.push(block);
          addCpuGanttBlock(block.pid, block.start, block.duration);
        }
      }

      function resetCpuScheduler() {
        clearCpuTimeouts();
        cpuSchedulerState = {
          algorithm: cpuSchedulerState ? cpuSchedulerState.algorithm : "fcfs",
          quantum: cpuSchedulerState ? cpuSchedulerState.quantum : 2,
          time: 0,
          readyQueue: [],
          waitingList: [],
          current: null,
          currentQuantum: 0,
          processes: cloneCpuProcesses(),
          gantt: [],
          running: false,
          paused: false,
          finished: false,
          busyTicks: 0,
        };
        resetCpuGantt();
        var parent = document.getElementById("cpu-processes");
        if (parent) {
          while (parent.firstChild) parent.removeChild(parent.firstChild);
          cpuSchedulerState.processes.forEach(function (p, i) {
            p.entity = createCpuProcessEntity(p, i);
          });
        }
        layoutCpuQueues();
        updateCpuMetrics();
      }

      function selectCpuAlgorithm(algorithm) {
        var s = ensureCpuState();
        s.algorithm = algorithm;
        resetCpuScheduler();
      }

      function changeCpuQuantum(delta) {
        var s = ensureCpuState();
        s.quantum = Math.max(1, Math.min(8, s.quantum + delta));
        updateCpuMetrics();
      }

      function startCpuScheduler() {
        var s = ensureCpuState();
        if (s.finished) resetCpuScheduler();
        s = ensureCpuState();
        if (s.running && !s.paused) return;
        s.running = true;
        s.paused = false;
        updateCpuMetrics();
        scheduleCpuTimeout(runCpuTick, 500);
      }

      function toggleCpuPause() {
        var s = ensureCpuState();
        if (!s.running || s.finished) return;
        s.paused = !s.paused;
        clearCpuTimeouts();
        updateCpuMetrics();
        if (!s.paused) scheduleCpuTimeout(runCpuTick, 500);
      }

      function enqueueCpuReady(proc, preempted) {
        var s = ensureCpuState();
        if (s.readyQueue.indexOf(proc) === -1) s.readyQueue.push(proc);
        moveCpuProcess(proc, "ready", s.readyQueue.indexOf(proc), preempted);
      }

      function chooseNextCpuProcess() {
        var s = ensureCpuState();
        if (!s.readyQueue.length) return null;

        // FCFS y Round Robin toman el primer proceso de la cola visible.
        if (s.algorithm === "fcfs" || s.algorithm === "rr") {
          return s.readyQueue.shift();
        }

        // SJF no preemptivo: al liberarse la CPU elige la menor rafaga restante.
        // No desaloja al proceso que ya esta ejecutando.
        var bestIndex = 0;
        for (var i = 1; i < s.readyQueue.length; i++) {
          if (s.readyQueue[i].remainingTime < s.readyQueue[bestIndex].remainingTime) {
            bestIndex = i;
          }
        }
        return s.readyQueue.splice(bestIndex, 1)[0];
      }

      function applySrtfPreemption() {
        var s = ensureCpuState();
        if (s.algorithm !== "srtf" || !s.current || !s.readyQueue.length) return;
        var shortest = s.readyQueue.reduce(function (best, p) {
          return p.remainingTime < best.remainingTime ? p : best;
        }, s.readyQueue[0]);
        // SRTF preemptivo: si un listo tiene menor tiempo restante, expulsa
        // visualmente al proceso actual y lo devuelve a la cola de listos.
        if (shortest.remainingTime < s.current.remainingTime) {
          s.readyQueue = s.readyQueue.filter(function (p) {
            return p !== shortest;
          });
          enqueueCpuReady(s.current, true);
          s.current = shortest;
          s.currentQuantum = 0;
        }
      }

      function finishCpuProcess(proc) {
        var s = ensureCpuState();
        proc.completionTime = s.time + 1;
        proc.turnaroundTime = proc.completionTime - proc.arrivalTime;
        moveCpuProcess(proc, "terminated", 0);
        s.current = null;
        s.currentQuantum = 0;
      }

      function sendCpuProcessToIo(proc) {
        var s = ensureCpuState();
        proc.ioDone = true;
        // La E/S se descuenta al inicio de cada tick; se suma una unidad para
        // que una duracion de 2 ocupe dos intervalos completos fuera de la CPU.
        proc.ioRemaining = proc.ioDuration + 1;
        s.waitingList.push(proc);
        moveCpuProcess(proc, "waiting", s.waitingList.length - 1);
        s.current = null;
        s.currentQuantum = 0;
      }

      function runCpuTick() {
        var s = ensureCpuState();
        if (!s.running || s.paused || s.finished) return;

        s.processes.forEach(function (p) {
          if (p.state === "new" && p.arrivalTime <= s.time) {
            enqueueCpuReady(p, false);
          }
        });

        s.waitingList.slice().forEach(function (p) {
          p.ioRemaining--;
          if (p.ioRemaining <= 0) {
            s.waitingList = s.waitingList.filter(function (wp) {
              return wp !== p;
            });
            enqueueCpuReady(p, false);
          }
        });

        applySrtfPreemption();

        if (!s.current) {
          s.current = chooseNextCpuProcess();
          s.currentQuantum = 0;
        }

        if (s.current) {
          if (s.current.startTime === null) {
            s.current.startTime = s.time;
            s.current.responseTime = s.current.startTime - s.current.arrivalTime;
          }
          moveCpuProcess(s.current, "running", 0);
        }

        s.readyQueue.forEach(function (p) {
          p.waitingTime++;
        });

        if (s.current) {
          s.busyTicks++;
          s.current.executedTime++;
          s.current.remainingTime--;
          s.currentQuantum++;
          recordCpuExecution(s.current.id);

          if (s.current.remainingTime <= 0) {
            finishCpuProcess(s.current);
          } else if (
            s.current.ioStart !== null &&
            !s.current.ioDone &&
            s.current.executedTime === s.current.ioStart
          ) {
            sendCpuProcessToIo(s.current);
          } else if (s.algorithm === "rr" && s.currentQuantum >= s.quantum) {
            var preempted = s.current;
            s.current = null;
            s.currentQuantum = 0;
            // Round Robin: al consumir quantum sin terminar, vuelve al final
            // de la cola de listos con una animacion de expulsion.
            enqueueCpuReady(preempted, true);
          }
        }

        s.time++;
        layoutCpuQueues();
        updateCpuMetrics();

        if (
          s.processes.every(function (p) {
            return p.state === "terminated";
          })
        ) {
          s.finished = true;
          s.running = false;
          updateCpuMetrics();
          return;
        }

        scheduleCpuTimeout(runCpuTick, 1600);
      }

      // ===== LABORATORIO DE COMPLEJIDAD COMPUTACIONAL =====
      // Adaptado de C:\Programacion\complexity_simulator:
      // el proyecto original analiza AST de Python y estima Big O con
      // reglas heuristicas sobre bucles, recursividad, sort y estructuras.

      var COMPLEXITY_QUALITATIVE = {
        "O(1)": "Excelente: tiempo constante.",
        "O(log n)": "Excelente: crecimiento muy lento.",
        "O(n)": "Buena: crecimiento lineal.",
        "O(n log n)": "Buena: tipica de ordenamientos eficientes.",
        "O(n^2)": "Aceptable solo para entradas pequenas o medianas.",
        "O(n^3)": "Costosa para entradas medianas o grandes.",
        "O(2^n)": "Muy costosa: viable solo con n pequeno.",
        "O(n!)": "Extrema: evitar para entradas grandes.",
      };

      var COMPLEXITY_FEEDBACK = {
        "O(1)": { ok: true, msg: "Tiempo constante: el costo no depende del tamano de la entrada. Es el mejor caso posible." },
        "O(log n)": { ok: true, msg: "Crecimiento logaritmico: aunque la entrada crezca mucho, el costo sube muy poco. Patron de busqueda binaria." },
        "O(n)": { ok: true, msg: "Crecimiento lineal: el costo acompana al tamano de la entrada de forma proporcional. Eficiente y escalable." },
        "O(n log n)": { ok: true, msg: "Tipico de ordenamientos eficientes. Escala muy bien incluso con entradas grandes." },
        "O(n^2)": { ok: false, msg: "Bucles anidados: el costo crece al cuadrado. Sirve para entradas chicas. Tip: un set o diccionario auxiliar suele bajarlo a O(n)." },
        "O(n^3)": { ok: false, msg: "Tres bucles anidados: crecimiento cubico. Para datos medianos o grandes revisa algoritmos optimizados o librerias numericas." },
        "O(2^n)": { ok: false, msg: "Recursividad multiple: el trabajo se duplica en cada paso. Solo viable con n chico. Tip: memoizacion o programacion dinamica." },
        "O(n!)": { ok: false, msg: "Crecimiento factorial: evitar para entradas grandes. Busca podas o heuristicas." },
      };

      var COMPLEXITY_RANK = {
        "O(1)": 0, "O(log n)": 1, "O(n)": 2, "O(n log n)": 3,
        "O(n^2)": 4, "O(n^3)": 5, "O(2^n)": 6, "O(n!)": 7,
      };

      var COMPLEXITY_CODE_LIBRARY = [
        {
          id: "const",
          name: "Constante",
          code:
            "def first_item(items):\n" +
            "    return items[0]\n",
          traits: { loops: 0, recursion: "no", sort: false, halving: false },
          metrics: {
            functions: 1,
            loops: 0,
            recursion: "no",
            conditionals: 0,
            calls: 0,
            assigns: 0,
            depth: 1,
          },
          explain: "Acceso directo a un elemento. No depende de n.",
          recommend: "Ideal cuando solo necesitas el primer elemento o un indice fijo.",
        },
        {
          id: "lineal",
          name: "Lineal",
          code:
            "def linear_search(items, target):\n" +
            "    for i in range(len(items)):\n" +
            "        if items[i] == target:\n" +
            "            return i\n" +
            "    return -1\n",
          traits: { loops: 1, recursion: "no", sort: false, halving: false },
          metrics: {
            functions: 1,
            loops: 1,
            recursion: "no",
            conditionals: 1,
            calls: 1,
            assigns: 0,
            depth: 2,
          },
          explain: "Recorre la lista completa en el peor caso.",
          recommend: "Si la lista esta ordenada, usa busqueda binaria para bajar a O(log n).",
        },
        {
          id: "binaria",
          name: "Binaria",
          code:
            "def binary_search(items, target):\n" +
            "    low, high = 0, len(items) - 1\n" +
            "    while low <= high:\n" +
            "        mid = (low + high) // 2\n" +
            "        if items[mid] == target:\n" +
            "            return mid\n" +
            "        if items[mid] < target:\n" +
            "            low = mid + 1\n" +
            "        else:\n" +
            "            high = mid - 1\n" +
            "    return -1\n",
          traits: { loops: 0, recursion: "no", sort: false, halving: true },
          metrics: {
            functions: 1,
            loops: 1,
            recursion: "no",
            conditionals: 2,
            calls: 1,
            assigns: 3,
            depth: 3,
          },
          explain: "Parte el problema a la mitad en cada paso.",
          recommend: "Requiere datos ordenados; si no, ordena primero.",
        },
        {
          id: "ordena",
          name: "Ordena",
          code:
            "def sort_values(values):\n" +
            "    return sorted(values)\n",
          traits: { loops: 0, recursion: "no", sort: true, halving: false },
          metrics: {
            functions: 1,
            loops: 0,
            recursion: "no",
            conditionals: 0,
            calls: 1,
            assigns: 0,
            depth: 1,
          },
          explain: "Usa un algoritmo de ordenamiento eficiente (n log n).",
          recommend: "Si no necesitas orden total, usa seleccion parcial (n).",
        },
        {
          id: "doble",
          name: "Doble bucle",
          code:
            "total = 0\n" +
            "for i in range(n):\n" +
            "    for j in range(n):\n" +
            "        total += matrix[i][j]\n",
          traits: { loops: 2, recursion: "no", sort: false, halving: false },
          metrics: {
            functions: 0,
            loops: 2,
            recursion: "no",
            conditionals: 0,
            calls: 1,
            assigns: 2,
            depth: 3,
          },
          explain: "Dos bucles anidados: n * n operaciones.",
          recommend: "Busca reducir una dimension o usar estructuras precomputadas.",
        },
        {
          id: "fibo",
          name: "Fibonacci",
          code:
            "def fib(n):\n" +
            "    if n <= 1:\n" +
            "        return n\n" +
            "    return fib(n - 1) + fib(n - 2)\n",
          traits: { loops: 0, recursion: "multiple", sort: false, halving: false },
          metrics: {
            functions: 1,
            loops: 0,
            recursion: "multiple",
            conditionals: 1,
            calls: 2,
            assigns: 0,
            depth: 2,
          },
          explain: "Cada llamada se divide en dos ramas recursivas.",
          recommend: "Usa memoizacion o version iterativa para bajar a O(n).",
        },
      ];

      function formatAstMetrics(sample) {
        if (!sample || !sample.metrics) return "";
        var m = sample.metrics;
        return (
          "Funciones: " + m.functions + "\n" +
          "Bucles: " + m.loops + "\n" +
          "Recursividad: " + m.recursion + "\n" +
          "Condicionales: " + m.conditionals + "\n" +
          "Llamadas: " + m.calls + "\n" +
          "Asignaciones: " + m.assigns + "\n" +
          "Profundidad: " + m.depth
        );
      }

      function getComplexitySample(sampleId) {
        return COMPLEXITY_CODE_LIBRARY.find(function (sample) {
          return sample.id === sampleId;
        });
      }

      function deriveBigO(state) {
        if (state.recursion === "multiple") {
          return state.loops >= 1 ? "O(n!)" : "O(2^n)";
        }
        var candidates = [];
        if (state.loops >= 3) candidates.push("O(n^3)");
        else if (state.loops === 2) candidates.push("O(n^2)");
        else if (state.loops === 1) candidates.push("O(n)");
        else candidates.push(state.halving ? "O(log n)" : "O(1)");
        if (state.sort) candidates.push("O(n log n)");
        if (state.recursion === "simple") candidates.push("O(n)");
        var best = candidates[0];
        candidates.forEach(function (c) {
          if (COMPLEXITY_RANK[c] > COMPLEXITY_RANK[best]) best = c;
        });
        return best;
      }

      function deriveReason(state, bigO) {
        var traits =
          "Bucles anidados sobre n: " + state.loops + "\n" +
          "Recursividad: " + state.recursion + "\n" +
          "Ordena (sort): " + (state.sort ? "si" : "no") + "\n" +
          "Divide a la mitad: " + (state.halving ? "si" : "no");
        var why;
        if (state.recursion === "multiple") why = "La recursividad multiple domina el costo.";
        else if (state.loops >= 2) why = state.loops + " bucles anidados elevan n a la potencia " + state.loops + ".";
        else if (state.sort && COMPLEXITY_RANK[bigO] === COMPLEXITY_RANK["O(n log n)"]) why = "La operacion de ordenamiento domina con crecimiento n log n.";
        else if (state.loops === 1) why = "Un unico recorrido de la entrada da crecimiento lineal.";
        else if (state.halving) why = "Descartar la mitad en cada paso da crecimiento logaritmico.";
        else why = "No hay bucles ni recursividad que dependan de n.";
        return { traits: traits, why: why };
      }

      var complexityState = {
        n: 1000,
        loops: 1,
        recursion: "no",
        sort: false,
        halving: false,
        sampleId: null,
        easyMode: true,
        calculated: false,
        result: null,
      };

      function complexityValue(label, n) {
        if (label === "O(1)") return 1;
        if (label === "O(log n)") return Math.log2(Math.max(2, n));
        if (label === "O(n)") return n;
        if (label === "O(n log n)") return n * Math.log2(Math.max(2, n));
        if (label === "O(n^2)") return n * n;
        if (label === "O(n^3)") return n * n * n;
        if (label === "O(2^n)") return Math.pow(2, Math.min(n, 30));
        if (label === "O(n!)") {
          var total = 1;
          for (var i = 2; i <= Math.min(n, 12); i++) total *= i;
          return total;
        }
        return n;
      }

      function formatComplexityOps(value) {
        if (!Number.isFinite(value)) return "muy grande";
        if (value >= 1000000) return value.toExponential(2);
        return Math.round(value).toString();
      }

      function complexityColor(label) {
        if (label === "O(1)") return "#22C55E";
        if (label === "O(log n)") return "#14B8A6";
        if (label === "O(n)") return "#3B82F6";
        if (label === "O(n log n)") return "#8B5CF6";
        if (label === "O(n^2)") return "#F59E0B";
        if (label === "O(n^3)") return "#F97316";
        return "#EF4444";
      }

      function handleComplexityAction(action) {
        var s = complexityState;
        if (action.indexOf("complexity-code-") === 0) {
          var sampleId = action.slice("complexity-code-".length);
          var sample = getComplexitySample(sampleId);
          if (sample) {
            s.sampleId = sample.id;
            s.loops = sample.traits.loops;
            s.recursion = sample.traits.recursion;
            s.sort = sample.traits.sort;
            s.halving = sample.traits.halving;
            s.result = deriveBigO(s);
            s.calculated = true;
          }
          renderComplexityLab();
          return;
        }
        if (action === "complexity-mode-toggle") {
          s.easyMode = !s.easyMode;
          renderComplexityLab();
          return;
        }
        if (action === "complexity-n-minus") s.n = Math.max(10, s.n - 10);
        else if (action === "complexity-n-plus") s.n = Math.min(2000, s.n + 10);
        else if (action === "complexity-n-big-minus") s.n = Math.max(10, s.n - 100);
        else if (action === "complexity-n-big-plus") s.n = Math.min(2000, s.n + 100);
        else if (action === "complexity-loops-minus") { s.loops = Math.max(0, s.loops - 1); s.calculated = false; s.sampleId = null; }
        else if (action === "complexity-loops-plus") { s.loops = Math.min(3, s.loops + 1); s.calculated = false; s.sampleId = null; }
        else if (action === "complexity-rec-no") { s.recursion = "no"; s.calculated = false; s.sampleId = null; }
        else if (action === "complexity-rec-simple") { s.recursion = "simple"; s.calculated = false; s.sampleId = null; }
        else if (action === "complexity-rec-multiple") { s.recursion = "multiple"; s.calculated = false; s.sampleId = null; }
        else if (action === "complexity-sort-toggle") { s.sort = !s.sort; s.calculated = false; s.sampleId = null; }
        else if (action === "complexity-halving-toggle") { s.halving = !s.halving; s.calculated = false; s.sampleId = null; }
        else if (action === "complexity-calcular") { s.result = deriveBigO(s); s.calculated = true; }
        else if (action === "complexity-reset") {
          s.loops = 1; s.recursion = "no"; s.sort = false; s.halving = false;
          s.n = 1000; s.calculated = false; s.result = null; s.sampleId = null;
        }
        renderComplexityLab();
      }

      function renderComplexityChart(root, selectedBigO) {
        clearEntityChildren(root);
        if (!root) return;

        selectedBigO = selectedBigO || "O(n^2)";
        var hardCap = selectedBigO === "O(2^n)" || selectedBigO === "O(n!)" ? 30 : 2000;
        var maxN = Math.max(10, Math.min(hardCap, complexityState.n));
        var width = 2.45;
        var height = 0.82;
        var originX = 0.12;
        var originY = 0.08;
        var points = [];
        var samples = 42;
        var maxLog = 1;

        for (var i = 0; i < samples; i++) {
          var n = 1 + Math.round(((maxN - 1) * i) / (samples - 1));
          var value = complexityValue(selectedBigO, n);
          var logValue = Math.log10(value + 1);
          maxLog = Math.max(maxLog, logValue);
          points.push({ n: n, value: value, logValue: logValue });
        }

        points.forEach(function (point) {
          point.x = originX + ((point.n - 1) / (maxN - 1)) * width;
          point.y = originY + (point.logValue / maxLog) * height;
        });

        function addLine(x1, y1, x2, y2, color, thickness) {
          var dx = x2 - x1;
          var dy = y2 - y1;
          var length = Math.sqrt(dx * dx + dy * dy);
          var angle = Math.atan2(dy, dx) * 180 / Math.PI;
          appendEl(root, "a-plane", {
            width: length,
            height: thickness || "0.018",
            position: ((x1 + x2) / 2) + " " + ((y1 + y2) / 2) + " 0.02",
            rotation: "0 0 " + angle,
            color: color,
            opacity: "0.95",
            material: "side: double",
          });
        }

        appendEl(root, "a-plane", {
          width: "2.8",
          height: "1.05",
          position: "1.35 0.46 -0.01",
          color: "#050505",
          opacity: "0.35",
          material: "side: double",
        });
        appendEl(root, "a-plane", {
          width: width,
          height: "0.025",
          position: (originX + width / 2) + " " + originY + " 0.01",
          color: "#78716C",
          material: "side: double",
        });
        appendEl(root, "a-plane", {
          width: "0.025",
          height: height,
          position: originX + " " + (originY + height / 2) + " 0.01",
          color: "#78716C",
          material: "side: double",
        });

        for (var s = 0; s < points.length - 1; s++) {
          addLine(points[s].x, points[s].y, points[s + 1].x, points[s + 1].y, complexityColor(selectedBigO), "0.022");
        }

        points.forEach(function (point, index) {
          if (index % 8 !== 0 && index !== points.length - 1) return;
          appendEl(root, "a-circle", {
            radius: "0.035",
            position: point.x + " " + point.y + " 0.04",
            color: complexityColor(selectedBigO),
            material: "side: double",
          });
          addText(root, {
            value: String(point.n),
            position: point.x + " " + (originY - 0.11) + " 0.04",
            align: "center",
            color: "#D6D3D1",
            width: "0.7",
            scale: "0.24 0.24 0.24",
          });
        });

        var markerN = Math.max(1, Math.min(maxN, complexityState.n));
        var markerValue = complexityValue(selectedBigO, markerN);
        var markerLog = Math.log10(markerValue + 1);
        var markerX = originX + ((markerN - 1) / (maxN - 1)) * width;
        var markerY = originY + (markerLog / maxLog) * height;
        addLine(markerX, originY, markerX, markerY, "#FDE68A", "0.014");
        appendEl(root, "a-circle", {
          radius: "0.055",
          position: markerX + " " + markerY + " 0.06",
          color: "#FDE68A",
          material: "side: double",
        });
        addText(root, {
          value: selectedBigO,
          position: "1.38 1.02 0.05",
          align: "center",
          color: complexityColor(selectedBigO),
          width: "2.6",
          scale: "0.42 0.42 0.42",
        });
        addText(root, {
          value: "n",
          position: (originX + width + 0.17) + " " + (originY - 0.01) + " 0.04",
          align: "center",
          color: "#E7E5E4",
          width: "0.5",
          scale: "0.32 0.32 0.32",
        });
        addText(root, {
          value: "ops",
          position: (originX - 0.08) + " " + (originY + height + 0.12) + " 0.04",
          align: "center",
          color: "#E7E5E4",
          width: "0.7",
          scale: "0.28 0.28 0.28",
        });
        addText(root, {
          value:
            "n=" + complexityState.n +
            "  ops~" + formatComplexityOps(complexityValue(selectedBigO, Math.min(complexityState.n, maxN))),
          position: "1.38 -0.17 0.04",
          align: "center",
          color: "#FFFFFF",
          width: "2.7",
          scale: "0.31 0.31 0.31",
        });
      }

      function renderComplexityLab() {
        var lab = document.getElementById("complexity-lab");
        if (!lab) return;
        var s = complexityState;

        var caseName = lab.querySelector("#complexity-case-name");
        var sortLabel = lab.querySelector("#complexity-sort-label");
        var halvingLabel = lab.querySelector("#complexity-halving-label");
        var codeTitle = lab.querySelector("#complexity-code-title");
        var code = lab.querySelector("#complexity-code");
        var result = lab.querySelector("#complexity-result");
        var metrics = lab.querySelector("#complexity-metrics");
        var recommendation = lab.querySelector("#complexity-recommendation");
        var chart = lab.querySelector("#complexity-chart");
        var selectedSample = s.sampleId ? getComplexitySample(s.sampleId) : null;
        if (sortLabel) sortLabel.setAttribute("value", "");
        if (halvingLabel) halvingLabel.setAttribute("value", "");

        var preview = s.result || deriveBigO(s);
        var info = deriveReason(s, preview);
        if (selectedSample) {
          if (codeTitle) codeTitle.setAttribute("value", "CODIGO: " + selectedSample.name);
          if (code) code.setAttribute("value", selectedSample.code);
        } else {
          if (codeTitle) codeTitle.setAttribute("value", "TU SELECCION");
          if (code) code.setAttribute("value", info.traits);
        }

        if (!s.calculated) {
          if (caseName) caseName.setAttribute("value", "Esperando seleccion");
          if (result) result.setAttribute("value", "Selecciona una complejidad en el panel izquierdo");
          if (metrics) metrics.setAttribute("value", "Metricas de ejecucion de codigo.");
          if (recommendation) recommendation.setAttribute("value", "");
          clearEntityChildren(chart);
          return;
        }

        var bigO = s.result;
        var ops = complexityValue(bigO, s.n);

        if (caseName) caseName.setAttribute("value", "Complejidad: " + bigO);
        if (result) {
          result.setAttribute(
            "value",
            "Funcion del comportamiento: " + bigO +
              " | ops aprox. (n=" + s.n + "): " + formatComplexityOps(ops) +
              "\n" + (COMPLEXITY_QUALITATIVE[bigO] || ""),
          );
        }

        if (selectedSample) {
          if (codeTitle) codeTitle.setAttribute("value", "ESTRUCTURA: " + selectedSample.name);
          if (code) code.setAttribute("value", selectedSample.code);

          if (metrics) {
            metrics.setAttribute(
              "value",
              "RESUMEN METRICAS ESTRUCTURALES:\n" +
                formatAstMetrics(selectedSample) +
                "\n\nEXPLICACION:\n" + selectedSample.explain,
            );
          }
          if (recommendation) {
            recommendation.setAttribute(
              "value",
              "RECOMENDACIONES DE OPTIMIZACION:\n" + selectedSample.recommend,
            );
          }
        }

        renderComplexityChart(chart, bigO);
      }

      // ===== LABORATORIO DE DISTRIBUCIONES DE PROBABILIDAD =====

      var PROB_DISTRIBUTIONS = [
        {
          id: "normal",
          name: "Normal",
          kind: "continuous",
          parameters: [
            { key: "mu", label: "mu", step: 0.1 },
            { key: "sigma", label: "sigma", min: 0.0001, step: 0.1 },
          ],
          defaults: { mu: 0, sigma: 1 },
          description: "Modelo continuo simetrico usado para errores, mediciones y fenomenos agregados.",
        },
        {
          id: "student",
          name: "t de Student",
          kind: "continuous",
          parameters: [{ key: "df", label: "nu", min: 0.0001, step: 1 }],
          defaults: { df: 8 },
          description: "Distribucion simetrica con colas pesadas, frecuente en muestras pequenas.",
        },
        {
          id: "chiSquared",
          name: "Chi-cuadrado",
          kind: "continuous",
          parameters: [{ key: "df", label: "nu", min: 0.0001, step: 1 }],
          defaults: { df: 4 },
          description: "Distribucion positiva asociada a sumas de cuadrados de normales estandar.",
        },
        {
          id: "fDistribution",
          name: "Distribucion F",
          kind: "continuous",
          parameters: [
            { key: "df1", label: "nu1", min: 0.0001, step: 1 },
            { key: "df2", label: "nu2", min: 0.0001, step: 1 },
          ],
          defaults: { df1: 5, df2: 12 },
          description: "Distribucion positiva para razones de varianzas independientes.",
        },
        {
          id: "exponential",
          name: "Exponencial",
          kind: "continuous",
          parameters: [{ key: "lambda", label: "lambda", min: 0.0001, step: 0.1 }],
          defaults: { lambda: 1 },
          description: "Modelo de tiempos de espera con tasa constante.",
        },
        {
          id: "cauchy",
          name: "Cauchy",
          kind: "continuous",
          parameters: [
            { key: "x0", label: "x0", step: 0.1 },
            { key: "gamma", label: "gamma", min: 0.0001, step: 0.1 },
          ],
          defaults: { x0: 0, gamma: 1 },
          description: "Distribucion simetrica de colas muy pesadas, sin media ni varianza definidas.",
        },
        {
          id: "weibull",
          name: "Weibull",
          kind: "continuous",
          parameters: [
            { key: "k", label: "k", min: 0.0001, step: 0.1 },
            { key: "lambda", label: "lambda", min: 0.0001, step: 0.1 },
          ],
          defaults: { k: 1.5, lambda: 1 },
          description: "Modelo flexible para tiempos de vida y confiabilidad.",
        },
        {
          id: "gamma",
          name: "Gamma",
          kind: "continuous",
          parameters: [
            { key: "alpha", label: "alpha", min: 0.0001, step: 0.1 },
            { key: "theta", label: "theta", min: 0.0001, step: 0.1 },
          ],
          defaults: { alpha: 2, theta: 1 },
          description: "Distribucion positiva para tiempos acumulados y variables sesgadas.",
        },
        {
          id: "beta",
          name: "Beta",
          kind: "continuous",
          parameters: [
            { key: "alpha", label: "alpha", min: 0.0001, step: 0.1 },
            { key: "beta", label: "beta", min: 0.0001, step: 0.1 },
          ],
          defaults: { alpha: 2, beta: 5 },
          description: "Distribucion sobre [0, 1], ideal para proporciones.",
        },
        {
          id: "logNormal",
          name: "Log-normal",
          kind: "continuous",
          parameters: [
            { key: "mu", label: "mu", step: 0.1 },
            { key: "sigma", label: "sigma", min: 0.0001, step: 0.1 },
          ],
          defaults: { mu: 0, sigma: 0.5 },
          description: "Modelo positivo para variables cuyo logaritmo es normal.",
        },
        {
          id: "logistic",
          name: "Logistica",
          kind: "continuous",
          parameters: [
            { key: "mu", label: "mu", step: 0.1 },
            { key: "s", label: "s", min: 0.0001, step: 0.1 },
          ],
          defaults: { mu: 0, s: 1 },
          description: "Distribucion simetrica similar a la normal, con acumulada sigmoide.",
        },
        {
          id: "uniformDiscrete",
          name: "Uniforme discreta",
          kind: "discrete",
          parameters: [{ key: "m", label: "caras", min: 2, max: 12, step: 1, integer: true }],
          defaults: { m: 6 },
          description: "Todos los resultados enteros de 1 a m tienen la misma probabilidad.",
        },
        {
          id: "binomial",
          name: "Binomial",
          kind: "discrete",
          parameters: [
            { key: "n", label: "n", min: 1, step: 1, integer: true },
            { key: "p", label: "p", min: 0, max: 1, step: 0.05 },
          ],
          defaults: { n: 10, p: 0.4 },
          description: "Cuenta exitos en un numero fijo de ensayos independientes.",
        },
        {
          id: "negativeBinomial",
          name: "Pascal / binomial negativa",
          kind: "discrete",
          parameters: [
            { key: "r", label: "r", min: 1, step: 1, integer: true },
            { key: "p", label: "p", min: 0, max: 1, step: 0.05 },
          ],
          defaults: { r: 4, p: 0.45 },
          description: "Cuenta fallos antes de alcanzar una cantidad fija de exitos.",
        },
        {
          id: "poisson",
          name: "Poisson",
          kind: "discrete",
          parameters: [{ key: "lambda", label: "lambda", min: 0.0001, step: 0.5 }],
          defaults: { lambda: 4 },
          description: "Cuenta eventos raros en un intervalo cuando la tasa media es conocida.",
        },
        {
          id: "hypergeometric",
          name: "Hipergeometrica",
          kind: "discrete",
          parameters: [
            { key: "N", label: "N", min: 1, step: 1, integer: true },
            { key: "K", label: "K", min: 1, step: 1, integer: true },
            { key: "n", label: "n", min: 1, step: 1, integer: true },
          ],
          defaults: { N: 40, K: 12, n: 8 },
          description: "Cuenta exitos al muestrear sin reemplazo desde una poblacion finita.",
        },
      ];

      var PROB_INTERVALS = ["between", "left", "right", "outside"];
      var PROB_CASINO_STATIONS = [
        {
          id: "coin",
          label: "Binomial",
          distributionId: "binomial",
          params: { n: 10, p: 0.5 },
          intervalType: "between",
          a: 4,
          b: 6,
          description: "Binomial: cuenta caras en n lanzamientos con probabilidad p.",
          pending: false,
        },
        {
          id: "dice",
          label: "Uniforme discreta",
          distributionId: "uniformDiscrete",
          params: { m: 6 },
          intervalType: "between",
          a: 1,
          b: 6,
          description: "Uniforme discreta: resultado de 1 a m con igual probabilidad.",
          pending: false,
        },
        {
          id: "calls",
          label: "Poisson",
          distributionId: "poisson",
          params: { lambda: 3 },
          intervalType: "between",
          a: 2,
          b: 6,
          description: "Poisson: cuenta autos por minuto con tasa media lambda.",
          pending: false,
        },
      ];
      var probabilityState = {
        distributionIndex: 0,
        parameters: { n: 10, p: 0.5 },
        intervalType: "between",
        a: 4,
        b: 6,
        activeStation: "coin",
        observedSamples: [],
        lastCoinFlips: [],
        trialCount: 0,
        lastOutcome: "Elegi una maquina y activa el experimento.",
        machineRunning: false,
      };

      var lanczosCoefficients = [
        676.5203681218851, -1259.1392167224028, 771.3234287776531,
        -176.6150291621406, 12.507343278686905, -0.13857109526572012,
        9.984369578019572e-6, 1.5056327351493116e-7,
      ];

      function clampProbability(value) {
        if (!Number.isFinite(value)) return Number.NaN;
        return Math.min(1, Math.max(0, value));
      }

      function erf(x) {
        var sign = x < 0 ? -1 : 1;
        var z = Math.abs(x);
        var t = 1 / (1 + 0.3275911 * z);
        var y =
          1 -
          (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t -
            0.284496736) *
            t +
            0.254829592) *
            t *
            Math.exp(-z * z));
        return sign * y;
      }

      function logGamma(z) {
        if (z < 0.5) {
          return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
        }
        var x = 0.99999999999980993;
        var shifted = z - 1;
        for (var i = 0; i < lanczosCoefficients.length; i++) {
          x += lanczosCoefficients[i] / (shifted + i + 1);
        }
        var t = shifted + lanczosCoefficients.length - 0.5;
        return 0.5 * Math.log(2 * Math.PI) + (shifted + 0.5) * Math.log(t) - t + Math.log(x);
      }

      function betaFunction(a, b) {
        return Math.exp(logGamma(a) + logGamma(b) - logGamma(a + b));
      }

      function betaContinuedFraction(a, b, x) {
        var maxIterations = 200;
        var epsilon = 3e-12;
        var fpMin = 1e-30;
        var qab = a + b;
        var qap = a + 1;
        var qam = a - 1;
        var c = 1;
        var d = 1 - (qab * x) / qap;
        if (Math.abs(d) < fpMin) d = fpMin;
        d = 1 / d;
        var h = d;
        for (var m = 1; m <= maxIterations; m++) {
          var m2 = 2 * m;
          var aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
          d = 1 + aa * d;
          if (Math.abs(d) < fpMin) d = fpMin;
          c = 1 + aa / c;
          if (Math.abs(c) < fpMin) c = fpMin;
          d = 1 / d;
          h *= d * c;
          aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
          d = 1 + aa * d;
          if (Math.abs(d) < fpMin) d = fpMin;
          c = 1 + aa / c;
          if (Math.abs(c) < fpMin) c = fpMin;
          d = 1 / d;
          var delta = d * c;
          h *= delta;
          if (Math.abs(delta - 1) < epsilon) break;
        }
        return h;
      }

      function regularizedBeta(x, a, b) {
        if (x <= 0) return 0;
        if (x >= 1) return 1;
        var bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log1p(-x));
        if (x < (a + 1) / (a + b + 2)) {
          return clampProbability((bt * betaContinuedFraction(a, b, x)) / a);
        }
        return clampProbability(1 - (bt * betaContinuedFraction(b, a, 1 - x)) / b);
      }

      function regularizedGammaP(a, x) {
        if (x <= 0) return 0;
        if (x < a + 1) {
          var sum = 1 / a;
          var del = sum;
          var ap = a;
          for (var n = 1; n <= 200; n++) {
            ap += 1;
            del *= x / ap;
            sum += del;
            if (Math.abs(del) < Math.abs(sum) * 1e-12) break;
          }
          return clampProbability(sum * Math.exp(-x + a * Math.log(x) - logGamma(a)));
        }
        var b = x + 1 - a;
        var c = 1 / 1e-30;
        var d = 1 / b;
        var h = d;
        for (var i = 1; i <= 200; i++) {
          var an = -i * (i - a);
          b += 2;
          d = an * d + b;
          if (Math.abs(d) < 1e-30) d = 1e-30;
          c = b + an / c;
          if (Math.abs(c) < 1e-30) c = 1e-30;
          d = 1 / d;
          var delta = d * c;
          h *= delta;
          if (Math.abs(delta - 1) < 1e-12) break;
        }
        return clampProbability(1 - Math.exp(-x + a * Math.log(x) - logGamma(a)) * h);
      }

      function logCombination(n, k) {
        if (k < 0 || k > n) return Number.NEGATIVE_INFINITY;
        return logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1);
      }

      function probValue(params, key, fallback) {
        return params[key] !== undefined ? params[key] : fallback;
      }

      function createContinuousMath(distribution, params) {
        switch (distribution.id) {
          case "normal": {
            var mu = probValue(params, "mu", 0);
            var sigma = probValue(params, "sigma", 1);
            return {
              pdf: function (x) { return Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2)) / (sigma * Math.sqrt(2 * Math.PI)); },
              cdf: function (x) { return 0.5 * (1 + erf((x - mu) / (sigma * Math.SQRT2))); },
              domain: [mu - 6 * sigma, mu + 6 * sigma],
            };
          }
          case "student": {
            var df = probValue(params, "df", 8);
            var constant = Math.exp(logGamma((df + 1) / 2) - logGamma(df / 2)) / Math.sqrt(df * Math.PI);
            return {
              pdf: function (x) { return constant * Math.pow(1 + (x * x) / df, -(df + 1) / 2); },
              cdf: function (x) {
                var z = df / (df + x * x);
                var ib = regularizedBeta(z, df / 2, 0.5);
                return x >= 0 ? clampProbability(1 - 0.5 * ib) : clampProbability(0.5 * ib);
              },
              domain: [-Math.max(7, Math.sqrt(df) * 4.2), Math.max(7, Math.sqrt(df) * 4.2)],
            };
          }
          case "chiSquared": {
            var dfChi = probValue(params, "df", 4);
            return {
              pdf: function (x) {
                return x <= 0 ? 0 : Math.exp((dfChi / 2 - 1) * Math.log(x) - x / 2 - (dfChi / 2) * Math.log(2) - logGamma(dfChi / 2));
              },
              cdf: function (x) { return regularizedGammaP(dfChi / 2, x / 2); },
              domain: [0, Math.max(8, dfChi + 8 * Math.sqrt(2 * dfChi))],
            };
          }
          case "fDistribution": {
            var df1 = probValue(params, "df1", 5);
            var df2 = probValue(params, "df2", 12);
            return {
              pdf: function (x) {
                if (x <= 0) return 0;
                var numerator = Math.sqrt((Math.pow(df1 * x, df1) * Math.pow(df2, df2)) / Math.pow(df1 * x + df2, df1 + df2));
                return numerator / (x * betaFunction(df1 / 2, df2 / 2));
              },
              cdf: function (x) {
                if (x <= 0) return 0;
                return regularizedBeta((df1 * x) / (df1 * x + df2), df1 / 2, df2 / 2);
              },
              domain: [0, Math.max(7, (df2 / Math.max(1, df2 - 2)) * 7)],
            };
          }
          case "exponential": {
            var lambda = probValue(params, "lambda", 1);
            return {
              pdf: function (x) { return x < 0 ? 0 : lambda * Math.exp(-lambda * x); },
              cdf: function (x) { return x < 0 ? 0 : clampProbability(1 - Math.exp(-lambda * x)); },
              domain: [0, 9 / lambda],
            };
          }
          case "cauchy": {
            var x0 = probValue(params, "x0", 0);
            var gamma = probValue(params, "gamma", 1);
            return {
              pdf: function (x) { return 1 / (Math.PI * gamma * (1 + Math.pow((x - x0) / gamma, 2))); },
              cdf: function (x) { return 0.5 + Math.atan((x - x0) / gamma) / Math.PI; },
              domain: [x0 - 16 * gamma, x0 + 16 * gamma],
            };
          }
          case "weibull": {
            var wk = probValue(params, "k", 1.5);
            var wl = probValue(params, "lambda", 1);
            return {
              pdf: function (x) { return x < 0 ? 0 : (wk / wl) * Math.pow(x / wl, wk - 1) * Math.exp(-Math.pow(x / wl, wk)); },
              cdf: function (x) { return x < 0 ? 0 : clampProbability(1 - Math.exp(-Math.pow(x / wl, wk))); },
              domain: [0, wl * Math.max(5.5, Math.pow(-Math.log(0.0002), 1 / wk))],
            };
          }
          case "gamma": {
            var alpha = probValue(params, "alpha", 2);
            var theta = probValue(params, "theta", 1);
            return {
              pdf: function (x) {
                return x <= 0 ? 0 : Math.exp((alpha - 1) * Math.log(x) - x / theta - logGamma(alpha) - alpha * Math.log(theta));
              },
              cdf: function (x) { return x <= 0 ? 0 : regularizedGammaP(alpha, x / theta); },
              domain: [0, Math.max(8 * theta, alpha * theta + 8 * Math.sqrt(alpha) * theta)],
            };
          }
          case "beta": {
            var ba = probValue(params, "alpha", 2);
            var bb = probValue(params, "beta", 5);
            var betaNorm = betaFunction(ba, bb);
            return {
              pdf: function (x) { return x <= 0 || x >= 1 ? 0 : (Math.pow(x, ba - 1) * Math.pow(1 - x, bb - 1)) / betaNorm; },
              cdf: function (x) { return regularizedBeta(x, ba, bb); },
              domain: [-0.08, 1.08],
            };
          }
          case "logNormal": {
            var lmu = probValue(params, "mu", 0);
            var lsigma = probValue(params, "sigma", 0.5);
            return {
              pdf: function (x) {
                return x <= 0 ? 0 : Math.exp(-Math.pow(Math.log(x) - lmu, 2) / (2 * lsigma * lsigma)) / (x * lsigma * Math.sqrt(2 * Math.PI));
              },
              cdf: function (x) { return x <= 0 ? 0 : 0.5 * (1 + erf((Math.log(x) - lmu) / (lsigma * Math.SQRT2))); },
              domain: [0, Math.exp(lmu + 5 * lsigma)],
            };
          }
          case "logistic": {
            var smu = probValue(params, "mu", 0);
            var ss = probValue(params, "s", 1);
            return {
              pdf: function (x) {
                var z = Math.exp(-(x - smu) / ss);
                return z / (ss * Math.pow(1 + z, 2));
              },
              cdf: function (x) { return 1 / (1 + Math.exp(-(x - smu) / ss)); },
              domain: [smu - 10 * ss, smu + 10 * ss],
            };
          }
        }
        throw new Error(distribution.name + " no es continua.");
      }

      function makeRange(start, end) {
        var values = [];
        for (var k = start; k <= end; k++) values.push(k);
        return values;
      }

      function cumulativeFromPmf(pmf, min, k) {
        var total = 0;
        for (var i = min; i <= k; i++) total += pmf(i);
        return clampProbability(total);
      }

      function createDiscreteMath(distribution, params) {
        switch (distribution.id) {
          case "uniformDiscrete": {
            var m = Math.round(probValue(params, "m", 6));
            var uniPmf = function (k) {
              return Number.isInteger(k) && k >= 1 && k <= m ? 1 / m : 0;
            };
            return {
              pmf: uniPmf,
              cdf: function (k) { return clampProbability(Math.floor(k) / m); },
              support: makeRange(1, m),
            };
          }
          case "binomial": {
            var n = Math.round(probValue(params, "n", 10));
            var p = probValue(params, "p", 0.4);
            var binPmf = function (k) {
              if (!Number.isInteger(k) || k < 0 || k > n) return 0;
              if (p === 0) return k === 0 ? 1 : 0;
              if (p === 1) return k === n ? 1 : 0;
              return Math.exp(logCombination(n, k) + k * Math.log(p) + (n - k) * Math.log1p(-p));
            };
            return { pmf: binPmf, cdf: function (k) { return cumulativeFromPmf(binPmf, 0, Math.floor(k)); }, support: makeRange(0, n) };
          }
          case "negativeBinomial": {
            var r = Math.round(probValue(params, "r", 4));
            var np = probValue(params, "p", 0.45);
            var negPmf = function (k) {
              if (!Number.isInteger(k) || k < 0) return 0;
              if (np === 1) return k === 0 ? 1 : 0;
              if (np === 0) return 0;
              return Math.exp(logCombination(k + r - 1, k) + r * Math.log(np) + k * Math.log1p(-np));
            };
            var support = [];
            var cumulative = 0;
            var maxK = Math.max(80, Math.ceil((r * (1 - np)) / np + 10 * Math.sqrt((r * (1 - np)) / (np * np))));
            for (var k2 = 0; k2 <= Math.min(500, maxK); k2++) {
              support.push(k2);
              cumulative += negPmf(k2);
              if (k2 > r && cumulative > 0.99995) break;
            }
            return { pmf: negPmf, cdf: function (k) { return cumulativeFromPmf(negPmf, 0, Math.floor(k)); }, support: support };
          }
          case "poisson": {
            var pl = probValue(params, "lambda", 4);
            var poiPmf = function (k) {
              if (!Number.isInteger(k) || k < 0) return 0;
              if (pl === 0) return k === 0 ? 1 : 0;
              return Math.exp(k * Math.log(pl) - pl - logGamma(k + 1));
            };
            var poiSupport = [];
            var poiCum = 0;
            var poiMax = Math.max(25, Math.ceil(pl + 10 * Math.sqrt(pl)));
            for (var pk = 0; pk <= Math.min(500, poiMax); pk++) {
              poiSupport.push(pk);
              poiCum += poiPmf(pk);
              if (pk > pl && poiCum > 0.99995) break;
            }
            return { pmf: poiPmf, cdf: function (k) { return cumulativeFromPmf(poiPmf, 0, Math.floor(k)); }, support: poiSupport };
          }
          case "hypergeometric": {
            var N = Math.round(probValue(params, "N", 40));
            var K = Math.round(probValue(params, "K", 12));
            var sample = Math.round(probValue(params, "n", 8));
            var min = Math.max(0, sample - (N - K));
            var max = Math.min(sample, K);
            var denominator = logCombination(N, sample);
            var hypPmf = function (k) {
              if (!Number.isInteger(k) || k < min || k > max) return 0;
              return Math.exp(logCombination(K, k) + logCombination(N - K, sample - k) - denominator);
            };
            return { pmf: hypPmf, cdf: function (k) { return cumulativeFromPmf(hypPmf, min, Math.floor(k)); }, support: makeRange(min, max) };
          }
        }
        throw new Error(distribution.name + " no es discreta.");
      }

      function formatProbNumber(value, digits) {
        if (!Number.isFinite(value)) return "no definido";
        var fixed = value.toFixed(digits === undefined ? 3 : digits);
        return fixed.replace(/\.?0+$/, "");
      }

      function formatProbValue(value) {
        if (!Number.isFinite(value)) return "no definido";
        return value.toFixed(value < 0.0001 && value > 0 ? 6 : 4);
      }

      function formatProbExpression(type, a, b) {
        var left = formatProbNumber(a, 3);
        var right = formatProbNumber(b, 3);
        if (type === "left") return "P(X <= " + left + ")";
        if (type === "right") return "P(X >= " + left + ")";
        if (type === "outside") return "P(X <= " + left + ") + P(X >= " + right + ")";
        return "P(" + left + " <= X <= " + right + ")";
      }

      function probabilityIncludedValues(support, type, a, b) {
        return support.filter(function (k) {
          if (type === "left") return k <= Math.floor(a);
          if (type === "right") return k >= Math.ceil(a);
          if (type === "outside") return k <= Math.floor(a) || k >= Math.ceil(b);
          return k >= Math.ceil(a) && k <= Math.floor(b);
        });
      }

      function calculateProbabilityVR(distribution, params, intervalType, a, b) {
        var expression = formatProbExpression(intervalType, a, b);
        if (distribution.kind === "continuous") {
          var cmath = createContinuousMath(distribution, params);
          var cvalue =
            intervalType === "left"
              ? cmath.cdf(a)
              : intervalType === "right"
                ? 1 - cmath.cdf(a)
                : intervalType === "outside"
                  ? cmath.cdf(a) + 1 - cmath.cdf(b)
                  : cmath.cdf(b) - cmath.cdf(a);
          return { expression: expression, value: clampProbability(cvalue), math: cmath, includedValues: [] };
        }
        var dmath = createDiscreteMath(distribution, params);
        var included = probabilityIncludedValues(dmath.support, intervalType, a, b);
        var dvalue = included.reduce(function (total, k) { return total + dmath.pmf(k); }, 0);
        return { expression: expression, value: clampProbability(dvalue), math: dmath, includedValues: included };
      }

      function validateProbabilityInputs(distribution, params, intervalType, a, b) {
        var errors = [];
        distribution.parameters.forEach(function (parameter) {
          var current = params[parameter.key];
          if (!Number.isFinite(current)) errors.push(parameter.label + " debe ser numerico.");
          if (parameter.integer && !Number.isInteger(current)) errors.push(parameter.label + " debe ser entero.");
          if (parameter.min !== undefined && current < parameter.min) errors.push(parameter.label + " debe ser >= " + parameter.min + ".");
          if (parameter.max !== undefined && current > parameter.max) errors.push(parameter.label + " debe ser <= " + parameter.max + ".");
        });
        if ((intervalType === "between" || intervalType === "outside") && a > b) {
          errors.push("Debe cumplirse a <= b.");
        }
        if (distribution.id === "hypergeometric") {
          if (params.K > params.N) errors.push("K debe ser menor o igual que N.");
          if (params.n > params.N) errors.push("n debe ser menor o igual que N.");
        }
        return errors;
      }

      function getCurrentProbabilityDistribution() {
        return PROB_DISTRIBUTIONS[probabilityState.distributionIndex];
      }

      function getProbabilityStation(id) {
        var stationId = id || probabilityState.activeStation;
        return PROB_CASINO_STATIONS.find(function (station) {
          return station.id === stationId;
        }) || PROB_CASINO_STATIONS[0];
      }

      function setProbabilityDistributionById(id) {
        var index = PROB_DISTRIBUTIONS.findIndex(function (item) {
          return item.id === id;
        });
        probabilityState.distributionIndex = index >= 0 ? index : 0;
      }

      function resetProbabilityObserved(message) {
        probabilityState.observedSamples = [];
        probabilityState.lastCoinFlips = [];
        probabilityState.trialCount = 0;
        probabilityState.machineRunning = false;
        probabilityState.lastOutcome = message || "Datos observados reiniciados.";
      }

      function applyProbabilityStation(stationId) {
        var station = getProbabilityStation(stationId);
        probabilityState.activeStation = station.id;
        setProbabilityDistributionById(station.distributionId);
        probabilityState.parameters = Object.assign({}, station.params);
        probabilityState.intervalType = station.intervalType;
        probabilityState.a = station.a;
        probabilityState.b = station.b;
        resetProbabilityObserved(station.pending ? station.description : "Estacion activa: " + station.label);
      }

      function resetProbabilityForDistribution() {
        var distribution = getCurrentProbabilityDistribution();
        probabilityState.parameters = Object.assign({}, distribution.defaults);
        probabilityState.a = distribution.kind === "continuous" ? -1 : 2;
        probabilityState.b = distribution.kind === "continuous" ? 1 : 6;
        resetProbabilityObserved();
      }

      function randomNormal(mu, sigma) {
        var u1 = Math.max(Math.random(), 1e-12);
        var u2 = Math.random();
        return mu + sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      }

      function sampleProbabilityValue(station) {
        var params = probabilityState.parameters;
        if (station.id === "coin") {
          var flips = Math.round(params.n || 10);
          var p = params.p || 0.5;
          var successes = 0;
          var coinFlips = [];
          for (var i = 0; i < flips; i++) {
            var isSuccess = Math.random() < p;
            coinFlips.push(isSuccess);
            if (isSuccess) successes++;
          }
          probabilityState.lastCoinFlips = coinFlips;
          return successes;
        }
        if (station.id === "dice") {
          var faces = Math.round(params.m || 6);
          return 1 + Math.floor(Math.random() * faces);
        }
        if (station.id === "calls") {
          var lambda = params.lambda || 4;
          var threshold = Math.exp(-lambda);
          var product = 1;
          var count = 0;
          do {
            count++;
            product *= Math.random();
          } while (product > threshold);
          return count - 1;
        }
        if (station.id === "wait") {
          return -Math.log(Math.max(Math.random(), 1e-12)) / (params.lambda || 1);
        }
        if (station.id === "normal") {
          return randomNormal(params.mu || 0, params.sigma || 1);
        }
        if (station.id === "student") {
          var df = Math.max(1, Math.round(params.df || 8));
          var z = randomNormal(0, 1);
          var chi = 0;
          for (var c = 0; c < df; c++) {
            var n = randomNormal(0, 1);
            chi += n * n;
          }
          return z / Math.sqrt(chi / df);
        }
        if (station.id === "variance") {
          var vdf = Math.max(1, Math.round(params.df || 4));
          var sum = 0;
          for (var j = 0; j < vdf; j++) {
            var g = randomNormal(0, 1);
            sum += g * g;
          }
          return sum;
        }
        return 0;
      }

      function runProbabilityExperiment(times) {
        var station = getProbabilityStation();
        if (station.pending) {
          probabilityState.lastOutcome = station.description;
          return;
        }
        probabilityState.machineRunning = true;
        var values = [];
        for (var i = 0; i < times; i++) {
          var value = sampleProbabilityValue(station);
          probabilityState.observedSamples.push(value);
          values.push(value);
        }
        probabilityState.trialCount = probabilityState.observedSamples.length;
        var last = values[values.length - 1];
        probabilityState.lastOutcome =
          "Ultimo: " + formatProbNumber(last, 2) +
          "\nGenerados: +" + times +
          "\nTotal: " + probabilityState.trialCount;
      }

      function handleProbabilityAction(action) {
        var distribution = getCurrentProbabilityDistribution();
        if (action.indexOf("prob-station-") === 0) {
          applyProbabilityStation(action.replace("prob-station-", ""));
        } else if (action === "prob-run-once") {
          runProbabilityExperiment(1);
        } else if (action === "prob-run-ten") {
          runProbabilityExperiment(10);
        } else if (action === "prob-run-hundred") {
          runProbabilityExperiment(100);
        } else if (action === "prob-reset-observed") {
          resetProbabilityObserved("Datos observados reiniciados.");
        } else if (action === "prob-prev" || action === "prob-next") {
          var delta = action === "prob-prev" ? -1 : 1;
          probabilityState.distributionIndex =
            (probabilityState.distributionIndex + delta + PROB_DISTRIBUTIONS.length) % PROB_DISTRIBUTIONS.length;
          resetProbabilityForDistribution();
        } else if (action === "prob-interval") {
          var currentInterval = PROB_INTERVALS.indexOf(probabilityState.intervalType);
          probabilityState.intervalType = PROB_INTERVALS[(currentInterval + 1) % PROB_INTERVALS.length];
        } else if (action === "prob-a-minus") {
          probabilityState.a -= distribution.kind === "continuous" ? 0.25 : 1;
        } else if (action === "prob-a-plus") {
          probabilityState.a += distribution.kind === "continuous" ? 0.25 : 1;
        } else if (action === "prob-b-minus") {
          probabilityState.b -= distribution.kind === "continuous" ? 0.25 : 1;
        } else if (action === "prob-b-plus") {
          probabilityState.b += distribution.kind === "continuous" ? 0.25 : 1;
        } else if (action.indexOf("prob-param-") === 0) {
          var minus = action.lastIndexOf("-minus") === action.length - 6;
          var plus = action.lastIndexOf("-plus") === action.length - 5;
          var key = action.replace("prob-param-", "").replace("-minus", "").replace("-plus", "");
          var parameter = distribution.parameters.find(function (item) { return item.key === key; });
          if (parameter && (minus || plus)) {
            var nextValue = (probabilityState.parameters[key] || 0) + (plus ? parameter.step : -parameter.step);
            if (parameter.integer) nextValue = Math.round(nextValue);
            if (parameter.min !== undefined) nextValue = Math.max(parameter.min, nextValue);
            if (parameter.max !== undefined) nextValue = Math.min(parameter.max, nextValue);
            probabilityState.parameters[key] = Number(nextValue.toFixed(4));
            resetProbabilityObserved("Parametro actualizado. Genera nuevos datos.");
          }
        }
        renderProbabilityLab();
      }

      function clearEntityChildren(el) {
        if (!el) return;
        while (el.firstChild) el.removeChild(el.firstChild);
      }

      function intervalLabel(type) {
        if (type === "left") return "Cola izquierda: X <= a";
        if (type === "right") return "Cola derecha: X >= a";
        if (type === "outside") return "Exterior: X <= a o X >= b";
        return "Entre limites: a <= X <= b";
      }

      function isValueIncluded(type, x, a, b) {
        if (type === "left") return x <= a;
        if (type === "right") return x >= a;
        if (type === "outside") return x <= a || x >= b;
        return x >= a && x <= b;
      }

      function renderProbabilityChart(root, distribution, result) {
        clearEntityChildren(root);
        if (!root || !result.math) return;
        appendEl(root, "a-plane", {
          width: "4.9",
          height: "0.025",
          position: "2.45 -0.18 0",
          color: "#607D8B",
        });

        if (distribution.kind === "continuous") {
          var math = result.math;
          var samples = 48;
          var start = math.domain[0];
          var end = math.domain[1];
          var values = [];
          var maxPdf = 0;
          for (var i = 0; i < samples; i++) {
            var x = start + ((end - start) * i) / (samples - 1);
            var y = math.pdf(x);
            values.push({ x: x, y: y });
            if (Number.isFinite(y)) maxPdf = Math.max(maxPdf, y);
          }
          values.forEach(function (point, index) {
            var h = maxPdf > 0 ? Math.max(0.045, (point.y / maxPdf) * 1.75) : 0.045;
            appendEl(root, "a-box", {
              width: "0.065",
              height: h,
              depth: "0.035",
              position: index * 0.102 + " " + (-0.18 + h / 2) + " 0",
              color: "#FFB74D",
              opacity: "0.95",
            });
            if (index % 8 === 0 || index === samples - 1) {
              addText(root, {
                value: formatProbNumber(point.x, 1),
                position: index * 0.102 + " -0.33 0.04",
                align: "center",
                color: "#CBD5E1",
                width: "1.2",
                scale: "0.18 0.18 0.18",
              });
            }
          });
        } else {
          var support = result.math.support.slice(0, 34);
          var included = {};
          result.includedValues.forEach(function (k) { included[k] = true; });
          var maxP = support.reduce(function (max, k) { return Math.max(max, result.math.pmf(k)); }, 0);
          support.forEach(function (k, index) {
            var p = result.math.pmf(k);
            var h = maxP > 0 ? Math.max(0.045, (p / maxP) * 1.7) : 0.045;
            appendEl(root, "a-box", {
              width: "0.095",
              height: h,
              depth: "0.05",
              position: index * 0.14 + " " + (-0.18 + h / 2) + " 0",
              color: "#FFB74D",
              opacity: "0.95",
            });
            if (support.length <= 16 || index % 2 === 0 || index === support.length - 1) {
              addText(root, {
                value: String(k),
                position: index * 0.14 + " -0.34 0.04",
                align: "center",
                color: "#CBD5E1",
                width: "0.8",
                scale: "0.22 0.22 0.22",
              });
            }
          });
        }

        if (probabilityState.observedSamples.length > 0) {
          var counts = {};
          probabilityState.observedSamples.forEach(function (value) {
            var key = distribution.kind === "discrete" ? Math.round(value) : Number(value).toFixed(1);
            counts[key] = (counts[key] || 0) + 1;
          });
          var maxCount = Object.keys(counts).reduce(function (max, key) {
            return Math.max(max, counts[key]);
          }, 1);

          if (distribution.kind === "discrete") {
            var obsSupport = result.math.support.slice(0, 34);
            Object.keys(counts).forEach(function (key) {
              var k = parseInt(key, 10);
              var obsIndex = obsSupport.indexOf(k);
              if (obsIndex < 0) return;
              var oh = Math.max(0.045, (counts[key] / maxCount) * 1.45);
              appendEl(root, "a-box", {
                width: "0.052",
                height: oh,
                depth: "0.08",
                position: obsIndex * 0.14 + 0.045 + " " + (-0.18 + oh / 2) + " 0.08",
                color: "#EF4444",
                opacity: "0.95",
              });
            });
          } else {
            var domain = result.math.domain || [-4, 4];
            Object.keys(counts).forEach(function (key) {
              var value = parseFloat(key);
              if (!Number.isFinite(value) || value < domain[0] || value > domain[1]) return;
              var ratio = (value - domain[0]) / (domain[1] - domain[0]);
              var ch = Math.max(0.045, (counts[key] / maxCount) * 1.2);
              appendEl(root, "a-box", {
                width: "0.055",
                height: ch,
                depth: "0.08",
                position: Math.max(0, Math.min(4.85, ratio * 4.85)) + " " + (-0.18 + ch / 2) + " 0.08",
                color: "#EF4444",
                opacity: "0.9",
              });
            });
          }
        }
      }

      function renderProbabilityParameters(root, distribution) {
        clearEntityChildren(root);
        if (!root) return;
        var station = getProbabilityStation();

        function getParameter(key) {
          return distribution.parameters.find(function (item) {
            return item.key === key;
          });
        }

        function addParamButton(parameter, plus, x, y) {
          if (!parameter) return;
          addButton(root, {
            id: "prob-param-" + parameter.key + (plus ? "-plus" : "-minus"),
            position: x + " " + y + " 0.04",
            action: "prob-param-" + parameter.key + (plus ? "-plus" : "-minus"),
            color: plus ? "#2E7D32" : "#3B302B",
            label: plus ? "+" : "-",
            width: "0.34",
            height: "0.26",
            depth: "0.045",
            textWidth: "0.9",
            textPosition: "0 0 0.035",
          });
        }

        function addParamCard(config) {
          var y = Number(config.y);
          appendEl(root, "a-plane", {
            position: "0 " + y + " -0.005",
            width: config.width || "3.65",
            height: config.height || "0.37",
            color: config.color || "#0B1622",
            opacity: "0.82",
            material: "side: double; transparent: true",
          });
        }

        function addParameterRow(config) {
          var parameter = getParameter(config.key);
          var y = Number(config.y);
          addParamCard({ y: y, width: config.width || "3.65", height: config.height || "0.39" });
          addText(root, {
            value: config.symbol,
            position: "-1.58 " + (y + 0.005) + " 0.04",
            align: "center",
            color: config.symbolColor || "#FFFFFF",
            width: "1.15",
            scale: config.symbolScale || "0.92 0.92 0.92",
          });
          addText(root, {
            value: config.title,
            position: "-1.25 " + (y + (config.subtitle ? 0.055 : 0.005)) + " 0.04",
            align: "left",
            color: "#F8FAFC",
            width: "2.55",
            wrapCount: "34",
            scale: "0.39 0.39 0.39",
          });
          if (config.subtitle) {
            addText(root, {
              value: config.subtitle,
              position: "-1.25 " + (y - 0.095) + " 0.04",
              align: "left",
              color: "#93C5FD",
              width: "2.35",
              wrapCount: "34",
              scale: "0.29 0.29 0.29",
            });
          }
          addText(root, {
            value: formatProbNumber(probabilityState.parameters[config.key], config.digits || 3),
            position: (config.valueX || "0.78") + " " + (y + 0.005) + " 0.04",
            align: "center",
            color: "#FFFFFF",
            width: "1.25",
            scale: "1.75 1.75 1.75",
          });
          addParamButton(parameter, false, "1.34", y);
          addParamButton(parameter, true, "1.75", y);
        }

        function addModelFooter(config) {
          var y = Number(config.y);
          appendEl(root, "a-plane", {
            position: "0 " + y + " 0",
            width: config.width || "3.3",
            height: config.height || "0.42",
            color: "#0B1622",
            opacity: "0.72",
            material: "side: double; transparent: true",
          });
          addText(root, {
            value: config.icon || "i",
            position: "-1.45 " + (y + 0.02) + " 0.04",
            align: "center",
            color: "#60A5FA",
            width: "0.5",
            scale: "0.42 0.42 0.42",
          });
          addText(root, {
            value: config.title,
            position: "-1.22 " + (y + 0.085) + " 0.04",
            align: "left",
            color: "#60A5FA",
            width: "2.75",
            wrapCount: "42",
            scale: "0.38 0.38 0.38",
          });
          addText(root, {
            value: config.subtitle,
            position: "-1.22 " + (y - 0.095) + " 0.04",
            align: "left",
            color: "#BFDBFE",
            width: "2.9",
            wrapCount: "50",
            scale: "0.31 0.31 0.31",
          });
        }

        function addCenteredModelText(config) {
          addText(root, {
            value: config.title,
            position: "0 " + config.titleY + " 0.04",
            align: "center",
            color: "#60A5FA",
            width: "3.4",
            scale: "0.42 0.42 0.42",
          });
          addText(root, {
            value: config.subtitle || "Estos valores cambian la distribucion teorica.",
            position: "0 " + config.subtitleY + " 0.04",
            align: "center",
            color: "#BFDBFE",
            width: "3.6",
            scale: "0.32 0.32 0.32",
          });
        }

        if (station.id === "coin") {
          addParameterRow({
            key: "n",
            symbol: "n",
            title: "Numero de ensayos",
            y: "0.14",
            digits: 0,
            symbolScale: "1.35 1.35 1.35",
          });
          addParameterRow({
            key: "p",
            symbol: "p",
            title: "Probabilidad de exito",
            y: "-0.33",
            digits: 2,
            symbolScale: "1.35 1.35 1.35",
          });
          appendEl(root, "a-plane", {
            position: "0 -0.64 0.02",
            width: "3.55",
            height: "0.008",
            color: "#94A3B8",
            opacity: "0.35",
            material: "side: double; transparent: true",
          });
          addCenteredModelText({
            title: "Modelo binomial: X ~ Bin(n, p)",
            titleY: "-0.82",
            subtitleY: "-1.03",
          });
        } else if (station.id === "dice") {
          addParameterRow({
            key: "m",
            symbol: "m",
            title: "Numero de posibles resultados (caras)",
            subtitle: "caras",
            y: "0.06",
            digits: 0,
            width: "3.75",
            height: "0.45",
            symbolColor: "#60A5FA",
            symbolScale: "0.62 0.62 0.62",
          });
          appendEl(root, "a-plane", {
            position: "0 -0.57 0.02",
            width: "3.55",
            height: "0.008",
            color: "#94A3B8",
            opacity: "0.35",
            material: "side: double; transparent: true",
          });
          addCenteredModelText({
            title: "Modelo uniforme-discreto: X ~ U{1, ..., m}",
            titleY: "-0.76",
            subtitleY: "-0.97",
          });
        } else if (station.id === "calls") {
          appendEl(root, "a-plane", {
            position: "0 0.18 0",
            width: "3.75",
            height: "0.25",
            color: "#1E3A5F",
            opacity: "0.76",
            material: "side: double; transparent: true",
          });
          addText(root, {
            value: "Parametro",
            position: "-1.65 0.18 0.04",
            align: "left",
            color: "#FFFFFF",
            width: "1.75",
            scale: "0.88 0.88 0.88",
          });
          addText(root, {
            value: "Valor actual",
            position: "0.45 0.18 0.04",
            align: "center",
            color: "#FFFFFF",
            width: "1.75",
            scale: "0.88 0.88 0.88",
          });
          addText(root, {
            value: "Ajustar",
            position: "1.48 0.18 0.04",
            align: "center",
            color: "#FFFFFF",
            width: "1.55",
            scale: "0.88 0.88 0.88",
          });
          addParameterRow({
            key: "lambda",
            symbol: "lambda",
            title: "lambda",
            subtitle: "Parametro de Poisson (lambda)",
            y: "-0.12",
            digits: 1,
            valueX: "0.45",
            width: "3.75",
            height: "0.45",
            symbolColor: "#60A5FA",
            symbolScale: "1.05 1.05 1.05",
          });
          appendEl(root, "a-plane", {
            position: "0 -0.57 0.02",
            width: "3.75",
            height: "0.008",
            color: "#94A3B8",
            opacity: "0.28",
            material: "side: double; transparent: true",
          });
          addCenteredModelText({
            title: "Modelo de Poisson: X ~ Poisson(lambda)",
            titleY: "-0.85",
            subtitleY: "-1.06",
          });
        }
      }

      function setTextIfPresent(root, selector, value) {
        var el = root.querySelector(selector);
        if (el) el.setAttribute("value", value);
      }

      function highlightActiveProbabilityMachine(lab) {
        [
          ["#prob-coin-machine", "coin", "#422006"],
          ["#prob-dice-machine", "dice", "#082F49"],
          ["#prob-calls-machine", "calls", "#1A2E05"],
        ].forEach(function (item) {
          var machine = lab.querySelector(item[0]);
          if (!machine) return;
          machine.setAttribute("scale", item[1] === probabilityState.activeStation ? "1.08 1.08 1.08" : "1 1 1");
        });
      }

      function addDigitalDigit(parent, digit, size, color) {
        var maps = {
          "0": ["a", "b", "c", "d", "e", "f"],
          "1": ["b", "c"],
          "2": ["a", "b", "g", "e", "d"],
          "3": ["a", "b", "g", "c", "d"],
          "4": ["f", "g", "b", "c"],
          "5": ["a", "f", "g", "c", "d"],
          "6": ["a", "f", "g", "e", "c", "d"],
          "7": ["a", "b", "c"],
          "8": ["a", "b", "c", "d", "e", "f", "g"],
          "9": ["a", "b", "c", "d", "f", "g"],
        };
        var active = maps[String(digit)] || [];
        if (!active.length) {
          addText(parent, {
            value: "?",
            position: "0 -0.01 0.01",
            align: "center",
            color: color,
            width: (size * 3).toString(),
            scale: size + " " + size + " " + size,
          });
          return;
        }
        var horizontal = {
          a: [0, 0.5, size * 0.48, size * 0.065],
          g: [0, 0, size * 0.48, size * 0.065],
          d: [0, -0.5, size * 0.48, size * 0.065],
        };
        var vertical = {
          f: [-0.24, 0.25, size * 0.065, size * 0.3],
          b: [0.24, 0.25, size * 0.065, size * 0.3],
          e: [-0.24, -0.25, size * 0.065, size * 0.3],
          c: [0.24, -0.25, size * 0.065, size * 0.3],
        };
        active.forEach(function (segment) {
          var spec = horizontal[segment] || vertical[segment];
          appendEl(parent, "a-box", {
            position: (spec[0] * size) + " " + (spec[1] * size) + " 0",
            width: spec[2].toString(),
            height: spec[3].toString(),
            depth: "0.012",
            color: color,
            opacity: "0.98",
          });
        });
      }

      function setDigitalNumber(parent, value, places, size, color, gap) {
        clearEntityChildren(parent);
        if (!parent) return;
        var text = value == null ? "" : String(value);
        if (places && text !== "?") text = text.padStart(places, "0");
        if (!text) text = "?";
        gap = gap || size * 0.34;
        var start = -((text.length - 1) * gap) / 2;
        for (var i = 0; i < text.length; i++) {
          var digit = appendEl(parent, "a-entity", {
            position: (start + i * gap) + " 0 0",
          });
          addDigitalDigit(digit, text.charAt(i), size, color);
        }
      }

      function renderCoinVisuals(lab) {
        var root = lab.querySelector("#prob-coin-visuals");
        clearEntityChildren(root);
        if (!root) return;
        var flips = probabilityState.activeStation === "coin" ? probabilityState.lastCoinFlips : [];
        for (var flip = 0; flip < 10; flip++) {
          var body = lab.querySelector("#prob-coin-flip-body-" + flip);
          var rim = lab.querySelector("#prob-coin-flip-rim-" + flip);
          var faceHead = lab.querySelector("#prob-coin-flip-face-head-" + flip);
          var faceBody = lab.querySelector("#prob-coin-flip-face-body-" + flip);
          var crossA = lab.querySelector("#prob-coin-flip-cross-a-" + flip);
          var crossB = lab.querySelector("#prob-coin-flip-cross-b-" + flip);
          var label = lab.querySelector("#prob-coin-flip-label-" + flip);
          var hasResult = flip < flips.length;
          var isFace = !!flips[flip];
          if (body) {
            body.setAttribute("color", !hasResult ? "#C9BFA8" : isFace ? "#FACC15" : "#9CA3AF");
            body.setAttribute("opacity", hasResult ? "1" : "0.72");
            if (probabilityState.machineRunning && probabilityState.activeStation === "coin" && hasResult) {
              body.removeAttribute("animation__flip");
              body.setAttribute("rotation", "90 0 0");
              (function (coinBody, delay) {
                setTimeout(function () {
                  coinBody.setAttribute("animation__flip", "property: rotation; from: 90 0 0; to: 450 0 0; dur: 560; delay: " + delay + "; easing: easeOutCubic");
                }, 0);
              })(body, flip * 42);
            }
          }
          if (rim) {
            rim.setAttribute("color", !hasResult ? "#A78A2D" : isFace ? "#B8860B" : "#64748B");
            rim.setAttribute("opacity", hasResult ? "0.95" : "0.55");
          }
          [faceHead, faceBody].forEach(function (part) {
            if (!part) return;
            part.setAttribute("visible", hasResult && isFace ? "true" : "false");
            part.setAttribute("color", "#B8860B");
          });
          [crossA, crossB].forEach(function (part) {
            if (!part) return;
            part.setAttribute("visible", hasResult && !isFace ? "true" : "false");
          });
          if (label) {
            label.setAttribute("value", hasResult ? "" : "?");
            label.setAttribute("color", "#5B5144");
          }
        }
      }

      function renderDiceVisuals(lab) {
        var last = probabilityState.activeStation === "dice" && probabilityState.observedSamples.length
          ? Math.round(probabilityState.observedSamples[probabilityState.observedSamples.length - 1])
          : "?";
        setTextIfPresent(lab, "#prob-dice-result", last === "?" ? "Tira el dado" : "Salio: " + last);
        var cube = lab.querySelector("#prob-dice-cube");
        if (cube && probabilityState.machineRunning && probabilityState.activeStation === "dice") {
          var finalRotations = {
            1: "0 0 0",
            2: "90 0 0",
            3: "0 0 90",
            4: "0 0 -90",
            5: "-90 0 0",
            6: "180 0 0",
          };
          var target = finalRotations[last] || "0 0 0";
          cube.setAttribute("animation__roll", "property: rotation; startEvents: casino-run; from: -360 -720 -360; to: " + target + "; dur: 720; easing: easeOutCubic");
          cube.emit("casino-run");
        } else if (cube && last !== "?") {
          var stableRotations = {
            1: "0 0 0",
            2: "90 0 0",
            3: "0 0 90",
            4: "0 0 -90",
            5: "-90 0 0",
            6: "180 0 0",
          };
          cube.setAttribute("rotation", stableRotations[last] || "0 0 0");
        }
      }

      function renderCallsVisuals(lab) {
        var last = probabilityState.activeStation === "calls" && probabilityState.observedSamples.length
          ? Math.round(probabilityState.observedSamples[probabilityState.observedSamples.length - 1])
          : 0;
        var visibleCars = Math.min(last, 10);
        for (var i = 0; i < 10; i++) {
          var car = lab.querySelector("#prob-traffic-car-" + i);
          if (!car) continue;
          var isVisible = i < visibleCars;
          var laneY = i % 2 === 0 ? 0.94 : 0.82;
          var x = -0.44 + ((i * 19 + probabilityState.trialCount * 11) % 86) / 100;
          car.setAttribute("visible", isVisible ? "true" : "false");
          if (!isVisible) continue;
          car.setAttribute("position", x + " " + laneY + " 0.23");
          if (probabilityState.machineRunning && probabilityState.activeStation === "calls") {
            car.setAttribute("animation__drive", "property: position; from: -0.58 " + laneY + " 0.23; to: " + x + " " + laneY + " 0.23; dur: 620; delay: " + (i * 65) + "; easing: easeOutCubic");
          }
        }
        var trafficLight = lab.querySelector("#prob-traffic-light");
        if (trafficLight) {
          trafficLight.setAttribute("color", visibleCars > 0 ? "#22C55E" : "#365314");
        }
      }

      function renderProbabilityMachines(lab, distribution, result) {
        var station = getProbabilityStation();
        var last = probabilityState.observedSamples.length
          ? probabilityState.observedSamples[probabilityState.observedSamples.length - 1]
          : null;
        var coinLast = station.id === "coin" && last !== null ? Math.round(last) : null;
        setTextIfPresent(lab, "#prob-coin-display", coinLast === null ? "Simula 10 monedas\nCara = exito" : "Caras: " + coinLast + " de 10\nCruces: " + (10 - coinLast));
        setTextIfPresent(lab, "#prob-dice-display", "Dado justo: caras 1 a 6\nTiradas: " + probabilityState.trialCount);
        setTextIfPresent(lab, "#prob-calls-display", "λ = " + formatProbNumber(probabilityState.parameters.lambda || 3, 1) + " autos/min\nMinuto actual: " + probabilityState.trialCount + "\nAutos que pasaron: " + (station.id === "calls" && last !== null ? Math.round(last) : "-"));
        renderCoinVisuals(lab);
        renderDiceVisuals(lab);
        renderCallsVisuals(lab);
        highlightActiveProbabilityMachine(lab);
      }

      function renderProbabilityLab() {
        var lab = document.getElementById("probability-lab");
        if (!lab) return;
        var station = getProbabilityStation();
        if (getCurrentProbabilityDistribution().id !== station.distributionId) {
          setProbabilityDistributionById(station.distributionId);
        }
        var distribution = getCurrentProbabilityDistribution();
        var errors = validateProbabilityInputs(
          distribution,
          probabilityState.parameters,
          probabilityState.intervalType,
          probabilityState.a,
          probabilityState.b,
        );
        var result = null;
        if (!errors.length) {
          result = calculateProbabilityVR(
            distribution,
            probabilityState.parameters,
            probabilityState.intervalType,
            probabilityState.a,
            probabilityState.b,
          );
        }

        var title = lab.querySelector("#prob-title");
        var desc = lab.querySelector("#prob-description");
        var theoryBlock = lab.querySelector("#prob-theory-block");
        var chartExplanation = lab.querySelector("#prob-chart-explanation");
        var distName = lab.querySelector("#prob-dist-name");
        var limits = lab.querySelector("#prob-limits-text");
        var resultText = lab.querySelector("#prob-result");
        var outcomeText = lab.querySelector("#prob-last-outcome");
        if (title) {
          var boardTitle = "Distribucion observada";
          if (station.id === "coin") boardTitle = "Distribucion binomial";
          if (station.id === "dice") boardTitle = "Distribucion uniforme discreta";
          if (station.id === "calls") boardTitle = "Distribucion de Poisson";
          title.setAttribute(
            "value",
            boardTitle,
          );
        }
        if (theoryBlock) {
          var theoryText = "";
          if (station.id === "coin") {
            theoryText =
              "Experimento: lanzar 10 monedas\n" +
              "X = cantidad de caras obtenidas\n" +
              "Modelo: X ~ Binomial(n = 10, p = 0.5)";
          } else if (station.id === "dice") {
            var faces = Math.round(probabilityState.parameters.m || 6);
            theoryText =
              "Experimento: lanzar un dado justo de " + faces + " caras\n" +
              "X = resultado obtenido\n" +
              "Modelo: X ~ Uniforme{1, ..., " + faces + "}";
          } else if (station.id === "calls") {
            var lambda = formatProbNumber(probabilityState.parameters.lambda || 3, 1);
            theoryText =
              "Experimento: contar autos durante 1 minuto\n" +
              "X = cantidad de autos que pasan\n" +
              "Modelo: X ~ Poisson(lambda = " + lambda + ")";
          }
          theoryBlock.setAttribute(
            "value",
            theoryText,
          );
        }
        if (chartExplanation) {
          var chartText = "";
          if (station.id === "coin") {
            chartText = "La grafica muestra la probabilidad teorica de obtener 0 a 10 caras.";
          } else if (station.id === "dice") {
            chartText = "La grafica muestra que cada cara tiene la misma probabilidad.";
          } else if (station.id === "calls") {
            chartText = "La grafica muestra la probabilidad de contar distintas cantidades de autos por minuto.";
          }
          chartExplanation.setAttribute(
            "value",
            chartText,
          );
        }
        if (desc) {
          var baseDesc = station.label + " | " + station.description;
          if (station.id === "coin") {
            baseDesc =
              "Binomial: caras en 10 lanzamientos" +
              "\np = probabilidad de cara en cada lanzamiento";
          } else if (station.id === "dice") {
            baseDesc =
              "Uniforme discreta: resultado de un dado justo" +
              "\nCada cara tiene la misma probabilidad";
          } else if (station.id === "calls") {
            baseDesc =
              "Poisson: autos que pasan por minuto" +
              "\nλ = promedio esperado de autos por minuto";
          }
          desc.setAttribute("value", baseDesc);
        }
        if (distName) distName.setAttribute("value", station.label + " -> " + distribution.name);
        if (limits) {
          limits.setAttribute(
            "value",
            "Intentos: " + probabilityState.trialCount +
              " | Intervalo: " + intervalLabel(probabilityState.intervalType),
          );
        }
        if (resultText) {
          var observedLegend = probabilityState.observedSamples.length > 0
            ? "\nBarra roja: resultado simulado"
            : "\nResultado simulado: aparecera al ejecutar";
          resultText.setAttribute(
            "value",
            errors.length
              ? "Corrige datos: " + errors.join(" ")
              : "Barras doradas: probabilidad teorica" + observedLegend,
          );
        }
        if (outcomeText) {
          var initialMessage = "Activa una maquina para generar datos.";
          if (station.id === "coin") {
            initialMessage = "Lanza 10 monedas y compara el resultado con la distribucion teorica.";
          } else if (station.id === "dice") {
            initialMessage = "Lanza el dado y compara el resultado con la distribucion teorica.";
          } else if (station.id === "calls") {
            initialMessage = "Avanza un minuto y compara la cantidad de autos con la distribucion teorica.";
          }
          outcomeText.setAttribute(
            "value",
            probabilityState.observedSamples.length === 0
              ? initialMessage
              : probabilityState.lastOutcome || initialMessage,
          );
        }
        renderProbabilityParameters(lab.querySelector("#prob-param-rows"), distribution);
        renderProbabilityChart(lab.querySelector("#prob-chart"), distribution, result || {});
        renderProbabilityMachines(lab, distribution, result || {});
        probabilityState.machineRunning = false;
      }


      // ===== FUNCIONES DE FÍSICA/MRUV =====

      var FISICA_SELECTORS = [
        "#aula4-fisica-menu",
        "#aula4-mruv-display", "#aula4-mruv-simulation", "#aula4-mruv-results",
        "#aula4-mru-display",  "#aula4-mru-simulation",  "#aula4-mru-results",
      ];

      // Timeouts pendientes de mostrar resultados (pueden cancelarse al navegar)
      var mruvResultsTimeout = null;
      var mruResultsTimeout = null;

      function hideFisicaAll() {
        // Cancelar timeouts de resultados pendientes
        if (mruvResultsTimeout) { clearTimeout(mruvResultsTimeout); mruvResultsTimeout = null; }
        if (mruResultsTimeout)  { clearTimeout(mruResultsTimeout);  mruResultsTimeout  = null; }
        // Detener animaciones activas
        if (typeof mruvSimulationRunning !== "undefined" && mruvSimulationRunning) {
          mruvSimulationRunning = false;
          if (mruvAnimationId) { cancelAnimationFrame(mruvAnimationId); mruvAnimationId = null; }
        }
        if (typeof mruSimulationRunning !== "undefined" && mruSimulationRunning) {
          mruSimulationRunning = false;
          if (mruAnimationId) { cancelAnimationFrame(mruAnimationId); mruAnimationId = null; }
        }
        var aula4 = document.getElementById("aula4");
        if (!aula4) return;
        FISICA_SELECTORS.forEach(function (sel) {
          var el = aula4.querySelector(sel);
          if (el) el.setAttribute("visible", false);
        });
      }

      function backToFisicaMenu() {
        hideFisicaAll();
        var aula4 = document.getElementById("aula4");
        if (!aula4) return;
        var menu = aula4.querySelector("#aula4-fisica-menu");
        if (menu) menu.setAttribute("visible", true);
      }

      function showMRUPlaceholder() {
        showMRUExercise();
      }

      function showMRUExercise() {
        hideFisicaAll();
        var aula4 = document.getElementById("aula4");
        if (!aula4) return;
        var el = aula4.querySelector("#aula4-mru-display");
        if (el) el.setAttribute("visible", true);
      }

      function showMRUVExercise() {
        hideFisicaAll();
        var aula4 = document.getElementById("aula4");
        if (!aula4) return;
        var el = aula4.querySelector("#aula4-mruv-display");
        if (el) el.setAttribute("visible", true);
      }

      var mruvSimulationRunning = false;
      var mruvSimulationStartTime = 0;
      var mruvAnimationId = null;

      function simulateMRUV() {
        if (mruvSimulationRunning) return;

        var aula4 = document.getElementById("aula4");
        if (!aula4) return;

        var simulation = aula4.querySelector("#aula4-mruv-simulation");
        var car = aula4.querySelector("#mruv-car");
        var simInfo = aula4.querySelector("#mruv-sim-info");

        if (!simulation || !car) return;

        // Usar hideFisicaAll() en vez de ocultar las cosas a mano
        hideFisicaAll();
        simulation.setAttribute("visible", true);

        // Parámetros de la simulación (según el ejercicio)
        var v0 = 0; // velocidad inicial en m/s
        var a = 2.5; // aceleración en m/s²
        var t_total = 4; // tiempo total en segundos
        var scale = 0.20; // escala de posición en la escena (1 metro = 0.20 unidades)

        // Posición inicial del auto
        var initialX = -2;

        // Función de movimiento: x(t) = x0 + v0*t + 0.5*a*t²
        function getMRUVPosition(t) {
          return initialX + v0 * t + 0.5 * a * t * t * scale;
        }

        // Función para actualizar la información
        function updateMRUVInfo(t) {
          var v = v0 + a * t; // velocidad actual
          var x = v0 * t + 0.5 * a * t * t; // distancia recorrida
          var info =
            "Tiempo: " +
            t.toFixed(2) +
            "s | Velocidad: " +
            v.toFixed(2) +
            "m/s | Distancia: " +
            x.toFixed(2) +
            "m";
          if (simInfo) simInfo.setAttribute("value", info);
        }

        // Función de animación
        function animateMRUV(currentTime) {
          if (!mruvSimulationRunning) return;

          if (mruvSimulationStartTime === 0) {
            mruvSimulationStartTime = currentTime;
          }

          var elapsed = (currentTime - mruvSimulationStartTime) / 1000; // convertir a segundos

          if (elapsed <= t_total) {
            var newX = getMRUVPosition(elapsed);
            car.setAttribute("position", newX + " 0 0");
            updateMRUVInfo(elapsed);
            mruvAnimationId = requestAnimationFrame(animateMRUV);
          } else {
            // Simulación completada
            mruvSimulationRunning = false;
            car.setAttribute("position", getMRUVPosition(t_total) + " 0 0");
            updateMRUVInfo(t_total);

            mruvResultsTimeout = setTimeout(showMRUVResults, 1000);
          }
        }

        mruvSimulationRunning = true;
        mruvSimulationStartTime = 0;
        car.setAttribute("position", initialX + " 0 0");
        updateMRUVInfo(0);

        // Iniciar animación
        if (mruvAnimationId) cancelAnimationFrame(mruvAnimationId);
        mruvAnimationId = requestAnimationFrame(animateMRUV);
      }

      function showMRUVResults() {
        var aula4 = document.getElementById("aula4");
        if (!aula4) return;

        // Limpiamos pantalla
        hideFisicaAll();

        var results = aula4.querySelector("#aula4-mruv-results");
        var resultsContent = aula4.querySelector("#results-content");

        if (results) results.setAttribute("visible", true);

        // Parámetros del ejercicio
        var v0 = 0;
        var a = 2.5;
        var t = 4;

        // Cálculos
        var vf = v0 + a * t; // velocidad final
        var x = v0 * t + 0.5 * a * t * t; // distancia recorrida
        var vfKmh = vf * 3.6; // convertir a km/h

        // Formular respuestas
        var resultsText =
          "RESPUESTAS:\n\n" +
          "1. Velocidad final:\n" +
          "   vf = v0 + a·t\n" +
          "   vf = 0 + 2,5 × 4\n" +
          "   vf = " +
          vf.toFixed(2) +
          " m/s (" +
          vfKmh.toFixed(2) +
          " km/h)\n\n" +
          "2. Distancia recorrida:\n" +
          "   x = v0·t + ½·a·t²\n" +
          "   x = 0 + ½ × 2,5 × 4²\n" +
          "   x = ½ × 2,5 × 16\n" +
          "   x = " +
          x.toFixed(2) +
          " metros";

        if (resultsContent) resultsContent.setAttribute("value", resultsText);
      }

      // ===== FUNCIONES DE FÍSICA/MRU =====

      var mruSimulationRunning = false;
      var mruSimulationStartTime = 0;
      var mruAnimationId = null;

      function simulateMRU() {
        if (mruSimulationRunning) return;

        var aula4 = document.getElementById("aula4");
        if (!aula4) return;

        var simulation = aula4.querySelector("#aula4-mru-simulation");
        var car = aula4.querySelector("#mru-car");
        var simInfo = aula4.querySelector("#mru-sim-info");

        if (!simulation || !car) return;

        // Ocultar todo y mostrar solo la simulación
        hideFisicaAll();
        simulation.setAttribute("visible", true);

        // Parámetros: v=20 m/s constante, t_total=4s
        // Escala: 1 m = 0.05 unidades de escena → 80 m = 4 unidades (de -2 a +2)
        var v = 20;
        var t_total = 4;
        var scale = 0.05;
        var initialX = -2;

        function getMRUPosition(t) {
          return initialX + v * t * scale;
        }

        function updateMRUInfo(t) {
          var x = v * t;
          var info =
            "Tiempo: " + t.toFixed(2) + "s" +
            " | Velocidad: " + v + " m/s (cte.)" +
            " | Distancia: " + x.toFixed(1) + " m";
          if (simInfo) simInfo.setAttribute("value", info);
        }

        function animateMRU(currentTime) {
          if (!mruSimulationRunning) return;
          if (mruSimulationStartTime === 0) mruSimulationStartTime = currentTime;
          var elapsed = (currentTime - mruSimulationStartTime) / 1000;

          if (elapsed <= t_total) {
            car.setAttribute("position", getMRUPosition(elapsed) + " 0 0");
            updateMRUInfo(elapsed);
            mruAnimationId = requestAnimationFrame(animateMRU);
          } else {
            mruSimulationRunning = false;
            car.setAttribute("position", getMRUPosition(t_total) + " 0 0");
            updateMRUInfo(t_total);
            mruResultsTimeout = setTimeout(showMRUResults, 1000);
          }
        }

        mruSimulationRunning = true;
        mruSimulationStartTime = 0;
        car.setAttribute("position", initialX + " 0 0");
        updateMRUInfo(0);
        if (mruAnimationId) cancelAnimationFrame(mruAnimationId);
        mruAnimationId = requestAnimationFrame(animateMRU);
      }

     function showMRUResults() {
        var aula4 = document.getElementById("aula4");
        if (!aula4) return;

        // ¡ESTO ES CLAVE! Limpiamos toda la pantalla antes de mostrar el resultado
        hideFisicaAll();

        var results = aula4.querySelector("#aula4-mru-results");
        var content = aula4.querySelector("#mru-results-content");

        if (results) results.setAttribute("visible", true);

        var v = 20;
        var t1 = 4;
        var x1 = v * t1;       // 80 m
        var x2 = 60;
        var t2 = x2 / v;       // 3 s

        var text =
          "RESPUESTAS:\n\n" +
          "1. Distancia en " + t1 + " segundos:\n" +
          "   x = v x t\n" +
          "   x = " + v + " x " + t1 + "\n" +
          "   x = " + x1 + " metros\n\n" +
          "2. Tiempo para " + x2 + " metros:\n" +
          "   t = x / v\n" +
          "   t = " + x2 + " / " + v + "\n" +
          "   t = " + t2.toFixed(1) + " segundos";

        if (content) content.setAttribute("value", text);
      }

      // ===== EVENT LISTENERS =====
      // Los botones se manejan via componente btn-action (registrado arriba)
      // Solo queda el manejo de VR enter/exit

      document.addEventListener("DOMContentLoaded", function () {
        var scene = document.querySelector("a-scene");

        scene.addEventListener("loaded", function () {
          console.log("Facultad Virtual VR cargada correctamente");
          console.log("Aula 1: Análisis Matemático | Aula 2: Algoritmos");
          console.log("Aula 4: Física (MRUV)");
        });

        scene.addEventListener("enter-vr", function () {
          document.querySelector(".info-panel").style.display = "none";
          var hud = document.getElementById("mathHUD");
          if (hud) hud.style.display = "none";
          // Ocultar cursor gaze en VR (se usan laser-controls de los controladores)
          var cursor = document.querySelector("a-cursor");
          if (cursor) cursor.setAttribute("visible", false);
        });
        scene.addEventListener("exit-vr", function () {
          document.querySelector(".info-panel").style.display = "block";
          // Restaurar cursor gaze para modo escritorio
          var cursor = document.querySelector("a-cursor");
          if (cursor) cursor.setAttribute("visible", true);
        });
      });
