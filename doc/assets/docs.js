// 文档页的小交互：图标、窄屏上收起目录、代码块复制。
(() => {
  if (window.lucide) window.lucide.createIcons();

  const menu = document.querySelector('.menu');
  if (menu && matchMedia('(max-width: 900px)').matches) menu.open = false;

  // 右侧目录：高亮当前读到的小节
  const links = [...document.querySelectorAll('.toc a')];
  const targets = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
  if (targets.length && 'IntersectionObserver' in window) {
    const visible = new Set();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target);
      const current = targets.find((t) => visible.has(t));
      if (current) for (const a of links) a.classList.toggle('active', decodeURIComponent(a.hash.slice(1)) === current.id);
    }, { rootMargin: '-70px 0px -65% 0px' });
    targets.forEach((t) => observer.observe(t));
  }

  // Local HTTP previews also support copying, without the secure Clipboard API.
  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(text); return; } catch { /* Try the selection-based fallback. */ }
    }
    const previous = document.activeElement;
    const field = document.createElement('textarea');
    field.value = text;
    field.readOnly = true;
    field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.append(field);
    try {
      field.select();
      if (!document.execCommand('copy')) throw new Error('Copy failed');
    } finally {
      field.remove();
      previous?.focus({ preventScroll: true });
    }
  }

  // Button labels are localized by the build.
  for (const button of document.querySelectorAll('.copy-button')) {
    const label = button.textContent;
    button.addEventListener('click', async () => {
      const code = button.closest('.code-block')?.querySelector('pre code');
      if (!code) return;
      try {
        await copyText(code.textContent);
        button.textContent = button.dataset.copied || '已复制';
      } catch {
        button.textContent = button.dataset.failed || '复制失败';
      }
      setTimeout(() => { button.textContent = label; }, 1600);
    });
  }
  // Tìm kiếm (OXMODE): hộp thoại dùng chỉ mục Pagefind tạo lúc build, chỉ tải khi mở lần đầu.
  const dialog = document.querySelector('.search-dialog');
  const opener = document.querySelector('.search-open');
  if (dialog && opener && typeof dialog.showModal === 'function') {
    const input = dialog.querySelector('input');
    const box = dialog.querySelector('.search-results');
    const hint = box.textContent.trim();
    const note = (text) => { box.replaceChildren(Object.assign(document.createElement('p'), { className: 'search-note', textContent: text })); };
    let engine;
    const load = () => engine ??= import(`${dialog.dataset.base}pagefind/pagefind.js`).then(async (pf) => {
      await pf.options({ baseUrl: dialog.dataset.base, excerptLength: 22 });
      pf.init();
      return pf;
    });
    let seq = 0;
    async function run() {
      const q = input.value.trim();
      const mine = ++seq;
      if (!q) return;
      let pf;
      try { pf = await load(); } catch { if (mine === seq) note(dialog.dataset.error); return; }
      const found = await pf.debouncedSearch(q, {}, 180);
      if (found === null || mine !== seq) return;
      const rows = await Promise.all(found.results.slice(0, 8).map((r) => r.data()));
      if (mine !== seq) return;
      if (!rows.length) { note(dialog.dataset.empty); return; }
      const list = document.createElement('ul');
      for (const row of rows) {
        const marks = (x) => (x.excerpt.match(/<mark>/g) || []).length;
        const sub = (row.sub_results || []).filter((x) => x.url !== row.url && marks(x)).sort((x, y) => marks(y) - marks(x))[0] || null;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = (sub || row).url;
        const title = document.createElement('strong');
        title.textContent = row.meta?.title || row.url;
        if (sub?.title && sub.title !== title.textContent) {
          const small = document.createElement('small');
          small.textContent = ` › ${sub.title}`;
          title.append(small);
        }
        const excerpt = document.createElement('span');
        excerpt.innerHTML = (sub || row).excerpt; // Pagefind trả về đoạn trích đã escape, chỉ thêm <mark>.
        a.append(title, excerpt);
        li.append(a);
        list.append(li);
      }
      box.replaceChildren(list);
    }
    const open = () => {
      if (dialog.open) return;
      dialog.showModal();
      input.focus();
      input.select();
      load().catch(() => {});
    };
    opener.addEventListener('click', open);
    input.addEventListener('input', () => { if (!input.value.trim()) { seq++; note(hint); return; } run(); });
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    document.addEventListener('keydown', (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
      if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); open(); }
    });
  }
  // Trang chủ: lọc thẻ năng lực theo từ khóa.
  const filter = document.querySelector('.lp-filter input');
  if (filter) {
    const cards = [...document.querySelectorAll('.lp-cap')];
    const empty = document.querySelector('.lp-empty');
    const fold = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();
    filter.addEventListener('input', () => {
      const q = fold(filter.value.trim());
      let shown = 0;
      for (const c of cards) { const hit = !q || fold(c.dataset.search).includes(q); c.hidden = !hit; shown += hit; }
      if (empty) empty.hidden = shown > 0;
    });
  }
})();
