/* =========================================================================
   Calculator widget — shared infrastructure, loaded cross-origin by every
   tool repo (same pattern as chat-widget.js). Before this file existed,
   each tool that wanted a calculator had to copy ~150 lines of rendering
   logic into its own app.js by hand (anticoagulant-reversal-protocol was
   the only one that had). This file is that logic, written once: a tool
   needs nothing beyond (1) these two <link>/<script> tags and (2) its own
   linkify() tagging each glossary term's .term-def span with
   data-term="<the exact GLOSSARY match string>". Everything else —
   fetching the shared calculators.json registry, deciding which terms
   have a matching calculator, injecting the trigger button + 🧮 badge,
   and rendering/opening/closing the calculator itself — happens here,
   automatically, for every current and future tool.

   Content is rendered lazily (a node's .term-def spans don't exist until
   that node is opened), so this can't just scan the DOM once on load — it
   watches #readoutContent for new term-def panels via MutationObserver
   and enhances each as it appears. Best-effort throughout: if
   calculators.json hasn't loaded yet, or is unreachable, or a page has no
   #readoutContent at all, the page works exactly as it did before this
   file existed — nothing here is load-bearing for the rest of the tool.
   ========================================================================= */
(function () {
  "use strict";

  var REGISTRY_URL = "https://satbuhan.github.io/clinical-algorithm-atlas/assets/calculators.json";

  var CALCULATORS = null; // null = not loaded yet, {} = loaded, empty/unreachable

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function findCalculatorForTerm(matchText) {
    if (!CALCULATORS || !matchText) return null;
    var norm = matchText.toLowerCase().trim();
    for (var key in CALCULATORS) {
      var calc = CALCULATORS[key];
      if ((calc.aliases || []).some(function (a) { return a.toLowerCase().trim() === norm; })) {
        return calc;
      }
    }
    return null;
  }

  function calculatorTriggerHtml(calc) {
    return (
      '<button type="button" class="calc-trigger" data-calc="' + calc.id + '">🧮 Open/close ' +
      escapeHtml(calc.title) + ' calculator</button>' +
      '<div class="calc-mount" id="calc-mount-' + calc.id + '" hidden></div>'
    );
  }

  /* ---- calculator rendering ----
     Generic, data-driven — add a new calc.type branch here as future
     calculator kinds are added (e.g. a weight-based dose formula); never
     write bespoke per-calculator markup/logic in any tool repo. No
     calculator here ever persists a value anywhere (no localStorage, no
     module-level cache of entered values) — deliberate, to rule out a
     value carrying over from one patient to the next. Closing a
     calculator discards it; reopening always starts blank. */
  function renderCalculatorInto(mountEl, calc) {
    var isOpen = !mountEl.hidden;
    if (isOpen) {
      mountEl.hidden = true;
      mountEl.innerHTML = "";
      return;
    }
    mountEl.hidden = false;
    if (calc.type === "additive-score") {
      renderAdditiveScoreCalculator(mountEl, calc);
    } else {
      mountEl.textContent = "This calculator type isn't supported here yet.";
    }
  }

  function renderAdditiveScoreCalculator(mountEl, calc) {
    var box = document.createElement("div");
    box.className = "calc-box";

    // Most items are independent checkboxes (one point value each, any
    // combination may be checked). An item with kind: "radio" is instead
    // a mutually-exclusive set of options with its own point values (e.g.
    // CHA₂DS₂-VASc's age bands: <65 / 65-74 / ≥75 are alternatives, never
    // cumulative) — rendered as a labelled radio group sharing one unique
    // name. Plain items with no kind default to checkbox behaviour.
    var list = document.createElement("div");
    list.className = "calc-items";
    var idx = 0;
    calc.items.forEach(function (item) {
      if (item.kind === "radio") {
        var fs = document.createElement("fieldset");
        fs.className = "calc-radio-group";
        var legend = document.createElement("legend");
        legend.textContent = item.label + (item.needsAuthor ? " *" : "");
        fs.appendChild(legend);
        var groupName = "calc-" + calc.id + "-group-" + idx++;
        item.options.forEach(function (opt) {
          var row = document.createElement("label");
          row.className = "calc-item calc-item--radio";
          var rb = document.createElement("input");
          rb.type = "radio";
          rb.name = groupName;
          rb.dataset.points = String(opt.points);
          row.appendChild(rb);
          var span = document.createElement("span");
          span.textContent = opt.label;
          row.appendChild(span);
          fs.appendChild(row);
        });
        list.appendChild(fs);
      } else {
        var row2 = document.createElement("label");
        row2.className = "calc-item";
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.dataset.points = String(item.points);
        cb.id = "calc-" + calc.id + "-" + idx++;
        row2.appendChild(cb);
        var span2 = document.createElement("span");
        span2.textContent = item.label + (item.needsAuthor ? " *" : "");
        row2.appendChild(span2);
        list.appendChild(row2);
      }
    });
    box.appendChild(list);

    var total = document.createElement("p");
    total.className = "calc-total";

    // Optional live "what does this number mean" readout. calc.tiers is an
    // array of { min, max, label, level? } — level: "high" gets the same
    // reserved alarm styling a flowchart node uses for its single most
    // critical state (see node--alarm); anything else (including omitted)
    // renders as a neutral/default tier. This is deliberately a two-level
    // visual system, not a three-colour traffic light — the project's CSS
    // only defines one semantic warning colour, and the label text itself
    // (e.g. "Stage II — intermediate risk") carries any finer distinction.
    // Boundaries and wording must come from the calculator's own cited
    // source/sourceReport, never invented here.
    var tierBadge = null;
    if (Array.isArray(calc.tiers) && calc.tiers.length) {
      tierBadge = document.createElement("p");
      tierBadge.className = "calc-tier";
    }

    function updateTotal() {
      var sum = 0;
      list.querySelectorAll("input[type=checkbox]:checked, input[type=radio]:checked").forEach(function (el) {
        sum += Number(el.dataset.points) || 0;
      });
      total.textContent = "Total: " + sum + (calc.maxScore ? " / " + calc.maxScore : "");
      if (tierBadge) {
        var tier = calc.tiers.find(function (t) {
          return sum >= t.min && sum <= t.max;
        });
        if (tier) {
          tierBadge.textContent = tier.label;
          tierBadge.className = "calc-tier" + (tier.level === "high" ? " calc-tier--high" : "");
        } else {
          tierBadge.textContent = "";
        }
      }
    }
    list.addEventListener("change", updateTotal);
    updateTotal();
    box.appendChild(total);
    if (tierBadge) box.appendChild(tierBadge);

    if (calc.interpretation) {
      var note = document.createElement("p");
      note.className = "calc-note";
      note.textContent = calc.interpretation;
      box.appendChild(note);
    }
    if (calc.items.some(function (item) { return item.needsAuthor; })) {
      var flag = document.createElement("p");
      flag.className = "calc-flag";
      flag.textContent =
        "* Exact threshold wording is ambiguous across sources for this item; flagged for author confirmation.";
      box.appendChild(flag);
    }
    if (calc.source && calc.source.text) {
      var src = document.createElement("p");
      src.className = "calc-source";
      src.innerHTML =
        escapeHtml(calc.source.text) +
        (calc.source.url
          ? ' <a href="' + calc.source.url + '" target="_blank" rel="noopener">' + calc.source.url + "</a>"
          : "");
      box.appendChild(src);
    }

    mountEl.innerHTML = "";
    mountEl.appendChild(box);
  }

  // One delegated click listener handles every calc-trigger this or any
  // future tool ever mounts — nothing to wire up per calculator.
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".calc-trigger");
    if (!btn) return;
    var mount = document.getElementById("calc-mount-" + btn.dataset.calc);
    var calc = CALCULATORS && CALCULATORS[btn.dataset.calc];
    if (!mount || !calc) return;
    renderCalculatorInto(mount, calc);
  });

  // Enhance one .term-def panel: if the shared registry has a calculator
  // aliased to its data-term, inject the trigger + mount, and drop a 🧮
  // badge on the .term button immediately before it (adjacent sibling —
  // every tool's linkify() emits the button and span back-to-back with no
  // text node between them). Idempotent: marks every panel it has already
  // looked at (calcDone), whether or not a calculator matched, so repeat
  // mutation events never double-check or double-inject.
  function enhanceTermDef(el) {
    if (!CALCULATORS) return; // registry not loaded yet — scan() retries once it is
    if (el.dataset.calcDone) return;
    el.dataset.calcDone = "1";
    var term = el.getAttribute("data-term");
    if (!term) return;
    var calc = findCalculatorForTerm(term);
    if (!calc) return;
    el.insertAdjacentHTML("beforeend", calculatorTriggerHtml(calc));
    var btn = el.previousElementSibling;
    if (btn && btn.classList.contains("term") && !btn.querySelector(".term-calc-badge")) {
      btn.insertAdjacentHTML("beforeend", ' <span class="term-calc-badge" aria-hidden="true">🧮</span>');
    }
  }

  function scan(root) {
    (root || document).querySelectorAll(".term-def[data-term]").forEach(enhanceTermDef);
  }

  // A node's term-def panels don't exist in the DOM until that node is
  // opened, so a single on-load scan isn't enough — watch the readout
  // panel for content being added and enhance it as it appears. If a tool
  // doesn't have a #readoutContent element at all, there's simply nothing
  // to observe and this is a silent no-op.
  var readoutContent = document.getElementById("readoutContent");
  if (readoutContent) {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          if (n.nodeType !== 1) return;
          if (n.matches && n.matches(".term-def[data-term]")) enhanceTermDef(n);
          if (n.querySelectorAll) scan(n);
        });
      });
    });
    observer.observe(readoutContent, { childList: true, subtree: true });
  }

  fetch(REGISTRY_URL)
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      CALCULATORS = (data && data.calculators) || {};
      scan(document); // catch any term-def panels already open before this loaded
    })
    .catch(function () {
      CALCULATORS = {};
    });
})();
