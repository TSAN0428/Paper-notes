// 首頁：讀取 data/papers.json，產生論文卡片、標籤篩選、搜尋與排序。
// 規則見 CLAUDE.md 第 2 節：首頁卡片不手寫，全部由這支程式產生。

(function () {
  "use strict";

  const grid = document.getElementById("paper-grid");
  const tagBox = document.getElementById("tag-filter");
  const search = document.getElementById("search");
  const sort = document.getElementById("sort");
  const stats = document.getElementById("stats");

  let papers = [];
  let activeTag = null;

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));

  function renderStats() {
    const tags = new Set(papers.flatMap((p) => p.tags));
    const venues = new Set(papers.map((p) => p.venueShort));
    stats.innerHTML =
      `<div><strong>${papers.length}</strong>篇論文</div>` +
      `<div><strong>${tags.size}</strong>個標籤</div>` +
      `<div><strong>${venues.size}</strong>個發表處</div>`;
  }

  function renderTags() {
    const counts = {};
    papers.forEach((p) => p.tags.forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));
    const names = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b, "zh-Hant"));

    const chip = (label, value, n) =>
      `<button type="button" class="chip" data-tag="${esc(value)}" aria-pressed="${activeTag === value}">` +
      `${esc(label)}${n != null ? `<span class="count">${n}</span>` : ""}</button>`;

    tagBox.innerHTML = chip("全部", "", null) + names.map((t) => chip(t, t, counts[t])).join("");
    tagBox.querySelector('[data-tag=""]').setAttribute("aria-pressed", String(activeTag === null));
  }

  function card(p) {
    const status = p.status === "reviewed"
      ? '<span class="status status--reviewed">已審閱</span>'
      : '<span class="status status--draft">草稿</span>';
    return `
      <a class="paper-card" href="papers/${esc(p.id)}.html">
        <div class="card-meta"><span>${esc(p.venueShort)} · ${esc(p.year)}</span>${status}</div>
        <h2 class="card-title">${esc(p.shortName)}</h2>
        <p class="card-full">${esc(p.title)}</p>
        <p class="card-tldr">${esc(p.tldr)}</p>
        <div class="card-tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      </a>`;
  }

  function renderGrid() {
    const q = search.value.trim().toLowerCase();
    let list = papers.filter((p) => {
      if (activeTag && !p.tags.includes(activeTag)) return false;
      if (!q) return true;
      const hay = [p.title, p.shortName, p.tldr, p.venue, p.venueShort, ...p.authors, ...p.tags]
        .join(" ").toLowerCase();
      return hay.includes(q);
    });

    const by = sort.value;
    list = list.slice().sort((a, b) => {
      if (by === "year") return b.year - a.year || a.shortName.localeCompare(b.shortName);
      if (by === "name") return a.shortName.localeCompare(b.shortName);
      return b.addedDate.localeCompare(a.addedDate); // 預設：保留 JSON 順序（最新在前）
    });

    grid.innerHTML = list.length
      ? list.map(card).join("")
      : '<p class="empty">沒有符合條件的論文。</p>';
  }

  tagBox.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    activeTag = btn.dataset.tag || null;
    renderTags();
    renderGrid();
  });
  search.addEventListener("input", renderGrid);
  sort.addEventListener("change", renderGrid);

  fetch("data/papers.json")
    .then((r) => {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then((data) => {
      papers = data;
      renderStats();
      renderTags();
      renderGrid();
    })
    .catch(() => {
      grid.innerHTML =
        '<p class="load-error">讀不到 <code>data/papers.json</code>。' +
        '如果是在本機直接打開檔案，請改用 <code>python -m http.server</code> 啟動後再瀏覽。</p>';
    });
})();
