(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const grid = $("#grid");
  const chipsEl = $("#chips");
  const searchEl = $("#search");
  const countEl = $("#count");

  const state = { filter: "all", q: "" };

  function loadCollapsed() {
    try {
      const raw = localStorage.getItem("atlas_collapsed_groups");
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveCollapsed(map) {
    try {
      localStorage.setItem("atlas_collapsed_groups", JSON.stringify(map));
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
      <a class="card" href="${tool.url}" target="_blank" rel="noopener">
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

  function groupHtml(group, isCollapsed) {
    return `
      <details class="group" data-key="${group.key}"${isCollapsed ? "" : " open"}>
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
      const collapsed = loadCollapsed();
      const groups = Object.keys(SPECIALTIES)
        .map((k) => ({
          key: k,
          label: SPECIALTIES[k].label,
          items: TOOLS.filter((t) => t.specialty === k).sort((a, b) => (a.added < b.added ? 1 : -1))
        }))
        .filter((g) => g.items.length);

      grid.classList.add("grid--grouped");
      grid.innerHTML = groups.map((g) => groupHtml(g, collapsed[g.key] === true)).join("");
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
  });
  // "toggle" does not bubble, so this only sees it via the capture phase —
  // the listener stays on #grid itself, so it survives every re-render.
  grid.addEventListener(
    "toggle",
    (e) => {
      const d = e.target.closest(".group");
      if (!d) return;
      const collapsed = loadCollapsed();
      collapsed[d.dataset.key] = !d.open;
      saveCollapsed(collapsed);
    },
    true
  );

  renderChips();
  render();
})();
