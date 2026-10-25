(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const grid = $("#grid");
  const chipsEl = $("#chips");
  const searchEl = $("#search");
  const countEl = $("#count");

  const state = { filter: "all", q: "" };

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

  function render() {
    const items = TOOLS.filter(matches).sort((a, b) => (a.added < b.added ? 1 : -1));
    grid.innerHTML = items.map(cardHtml).join("");
    countEl.textContent = `${TOOLS.length} tool${TOOLS.length === 1 ? "" : "s"} in the atlas`;
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

  renderChips();
  render();
})();
