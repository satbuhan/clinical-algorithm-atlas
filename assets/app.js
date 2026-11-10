(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const grid = $("#grid");
  const chipsEl = $("#chips");
  const searchEl = $("#search");
  const countEl = $("#count");
  const contentHitsEl = $("#contentHits");

  const state = { filter: "all", q: "" };

  // The card search above only matches a tool's own title/subtitle/summary
  // — it can't find a term that's only mentioned inside a node's text deep
  // in one tool's diagram. search_index.json (built by
  // tools/gen_search_index.py from every tool's own content.js) covers
  // that: one entry per node, across every tool, searched here regardless
  // of the active category chip — the point of this box is "find this term
  // anywhere in the atlas," not just within the currently-filtered
  // category. Loaded once, best-effort: the rest of the page works
  // identically if this never resolves (slow network, offline, the file
  // unreachable) — content hits just stay empty.
  let SEARCH_INDEX = null;
  fetch("assets/search_index.json")
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      SEARCH_INDEX = (data && data.entries) || [];
      renderContentHits();
    })
    .catch(() => {
      SEARCH_INDEX = [];
    });

  // Groups default to CLOSED on a first visit — with 8 categories across a
  // growing tool count, defaulting to open meant scrolling past every
  // other category's full card grid just to reach the last one. A viewer
  // opens the category they want via its arrow; which categories they've
  // opened is remembered (key = "opened", not "collapsed") so a return
  // visit keeps their open panels open rather than re-collapsing them.
  function loadOpened() {
    try {
      const raw = localStorage.getItem("atlas_opened_groups");
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveOpened(map) {
    try {
      localStorage.setItem("atlas_opened_groups", JSON.stringify(map));
    } catch (e) {
      /* private browsing / storage disabled — ignore */
    }
  }

  const RECENT_KEY = "atlas_recent_views";
  const RECENT_MAX = 5;

  function loadRecent() {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function recordView(id) {
    try {
      const next = [id, ...loadRecent().filter((x) => x !== id)].slice(0, RECENT_MAX);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch (e) {
      /* private browsing / storage disabled — ignore */
    }
  }

  function fmtDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function renderChips() {
    const specs = Object.keys(SPECIALTIES);
    const opts = [["all", "All"]].concat(specs.map((k) => [k, SPECIALTIES[k].short]));
    chipsEl.innerHTML = opts
      .map(
        ([k, label]) =>
          `<button class="chip" type="button" data-filter="${k}" aria-pressed="${state.filter === k}">${label}</button>`
      )
      .join("");
  }

  function matches(tool) {
    if (state.filter !== "all" && tool.specialty !== state.filter) return false;
    if (!state.q) return true;
    const hay = (tool.title + " " + tool.subtitle + " " + tool.summary).toLowerCase();
    return hay.includes(state.q.toLowerCase());
  }

  function cardHtml(tool) {
    const spec = SPECIALTIES[tool.specialty];
    return `
      <a class="card" data-id="${tool.id}" href="${tool.url}" target="_blank" rel="noopener">
        <img class="card__thumb" src="${tool.thumb}" alt="" loading="lazy">
        <div class="card__body">
          <span class="card__tag ${spec.tagClass}">${spec.short}</span>
          <h2>${tool.title}<br>${tool.subtitle}</h2>
          <p class="card__summary">${tool.summary}</p>
          <div class="card__meta">
            <span>added ${fmtDate(tool.added)}</span>
            <span>↗ open tool</span>
          </div>
        </div>
      </a>`;
  }

  function recentHtml() {
    const items = loadRecent()
      .map((id) => TOOLS.find((t) => t.id === id))
      .filter(Boolean);
    if (!items.length) return "";
    return `
      <section class="recent">
        <h2 class="recent__title">Recently viewed</h2>
        <div class="recent__grid">${items.map(cardHtml).join("")}</div>
      </section>`;
  }

  function groupHtml(group, isOpen) {
    return `
      <details class="group" data-key="${group.key}"${isOpen ? " open" : ""}>
        <summary class="group__summary">
          <span class="group__title">${group.label}</span>
          <span class="group__count">${group.items.length} tool${group.items.length === 1 ? "" : "s"}</span>
        </summary>
        <div class="group__grid">${group.items.map(cardHtml).join("")}</div>
      </details>`;
  }

  // Grouped-by-category view (collapsible sections) is used when browsing
  // everything with no active search — this is what keeps the atlas legible
  // as more tools and categories are added. A search or a single-category
  // chip narrows things down enough that a flat result list reads better.
  function render() {
    const grouped = state.filter === "all" && !state.q;

    if (grouped) {
      const opened = loadOpened();
      const groups = Object.keys(SPECIALTIES)
        .map((k) => ({
          key: k,
          label: SPECIALTIES[k].label,
          items: TOOLS.filter((t) => t.specialty === k).sort((a, b) => (a.added < b.added ? 1 : -1))
        }))
        .filter((g) => g.items.length);

      grid.classList.add("grid--grouped");
      grid.innerHTML = recentHtml() + groups.map((g) => groupHtml(g, opened[g.key] === true)).join("");
      countEl.textContent = `${TOOLS.length} tool${TOOLS.length === 1 ? "" : "s"} in the atlas, across ${groups.length} categor${groups.length === 1 ? "y" : "ies"}`;
      return;
    }

    grid.classList.remove("grid--grouped");
    const items = TOOLS.filter(matches).sort((a, b) => (a.added < b.added ? 1 : -1));
    grid.innerHTML = items.map(cardHtml).join("");

    if (state.q) {
      countEl.textContent = `${items.length} match${items.length === 1 ? "" : "es"} for "${state.q}"`;
    } else {
      const label = SPECIALTIES[state.filter] ? SPECIALTIES[state.filter].short : "atlas";
      countEl.textContent = `${items.length} tool${items.length === 1 ? "" : "s"} in ${label}`;
    }

    if (!items.length) {
      grid.insertAdjacentHTML(
        "beforeend",
        `<p class="empty">No tool matches "${state.q}".</p>`
      );
    }
  }

  // A short run of plain text around the match, so a hit shows *why* it
  // matched instead of just a tool name. No HTML escaping here — same as
  // every other string in this file (card titles, summaries); the source
  // text is our own authored content.js prose, never user input.
  function snippet(text, q) {
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return text.slice(0, 160) + (text.length > 160 ? "…" : "");
    const start = Math.max(0, idx - 50);
    const end = Math.min(text.length, idx + q.length + 110);
    return (start > 0 ? "…" : "") + text.slice(start, end).trim() + (end < text.length ? "…" : "");
  }

  function contentHitHtml(entry, q) {
    return `
      <a class="content-hit" href="${entry.url}#node-${entry.nodeId}" target="_blank" rel="noopener">
        <span class="content-hit__tool">${entry.title} → ${entry.nodeLabel}</span>
        <span class="content-hit__snippet">${snippet(entry.text, q)}</span>
      </a>`;
  }

  // Independent of the card grid above and of the category chip — this
  // searches node text across every tool in the atlas, no matter what's
  // currently filtered, because "find this term anywhere" is the whole
  // point. Content written in English (house convention), so a query only
  // matches text spelled the same way.
  function renderContentHits() {
    if (!state.q || !SEARCH_INDEX || !SEARCH_INDEX.length) {
      contentHitsEl.hidden = true;
      contentHitsEl.innerHTML = "";
      return;
    }
    const q = state.q.toLowerCase();
    const hits = SEARCH_INDEX.filter(
      (e) => e.type === "node" && (e.text.toLowerCase().includes(q) || (e.nodeLabel || "").toLowerCase().includes(q))
    );
    if (!hits.length) {
      contentHitsEl.hidden = true;
      contentHitsEl.innerHTML = "";
      return;
    }
    contentHitsEl.hidden = false;
    const shown = hits.slice(0, 40);
    contentHitsEl.innerHTML =
      `<h2 class="content-hits__title">Found inside ${hits.length} box${hits.length === 1 ? "" : "es"}${hits.length > shown.length ? " (showing first " + shown.length + ")" : ""}</h2>` +
      `<div class="content-hits__list">${shown.map((e) => contentHitHtml(e, q)).join("")}</div>`;
  }

  chipsEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-filter]");
    if (!b) return;
    state.filter = b.dataset.filter;
    renderChips();
    render();
  });
  searchEl.addEventListener("input", (e) => {
    state.q = e.target.value.trim();
    render();
    renderContentHits();
  });
  // "toggle" does not bubble, so this only sees it via the capture phase —
  // the listener stays on #grid itself, so it survives every re-render.
  grid.addEventListener(
    "toggle",
    (e) => {
      const d = e.target.closest(".group");
      if (!d) return;
      const opened = loadOpened();
      opened[d.dataset.key] = d.open;
      saveOpened(opened);
    },
    true
  );
  // Event delegation: works for cards in the recent strip, the grouped
  // sections, and flat search/filter results alike, across every re-render.
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card[data-id]");
    if (!card) return;
    recordView(card.dataset.id);
  });

  renderChips();
  render();
  renderContentHits();
})();
