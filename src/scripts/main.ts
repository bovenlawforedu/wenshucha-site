// 文书查 · 客户端交互脚本
// 数据一律走 src/lib/api.ts，不直接读演示数据，保证后续接真实数据页面零改动。

import { getCaseData, getCaseKeys, getDefaultCase, searchCases, filterItems, isDemoData } from '../lib/api';
import type { CaseData } from '../lib/api';

const BASE = import.meta.env.BASE_URL; // 子路径部署（GitHub Pages 预览）自动带前缀，正式上线为 '/'

function $(s: string, r?: ParentNode): HTMLElement | null {
  return (r || document).querySelector<HTMLElement>(s);
}
function $all(s: string, r?: ParentNode): HTMLElement[] {
  return Array.from((r || document).querySelectorAll<HTMLElement>(s));
}
function qparam(name: string): string {
  const m = new RegExp('[?&]' + name + '=([^&]*)').exec(location.search);
  return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
}
function esc(s: string): string {
  return (s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
}
function fmt(n: number): string {
  return n >= 10000 ? (n / 10000).toFixed(1) + ' 万' : String(n);
}
function markkw(text: string, kw: string): string {
  if (!kw) return esc(text);
  const idx = text.indexOf(kw);
  if (idx < 0) return esc(text);
  return esc(text.slice(0, idx)) + '<mark>' + esc(text.slice(idx, idx + kw.length)) + '</mark>' + esc(text.slice(idx + kw.length));
}
function distRowHtml(rows: { name: string; val: number; cls?: string }[], maxW = 460): string {
  return rows.map((r) => {
    const w = Math.max(4, r.val * 2.8);
    const cls = r.cls === 'o' ? 'o' : r.cls === 'g' ? 'g' : '';
    return '<div class="row"><span class="name">' + r.name + '</span><div class="barfill ' + cls + '" style="width:' + (w > maxW ? maxW : w) + 'px; max-width:60%;"></div><span class="val">' + r.val + '%</span></div>';
  }).join('');
}

/* ---------- 导航高亮 + FAQ 手风琴 + 模态 ---------- */
function initNav(): void {
  const page = document.body.getAttribute('data-page') || '';
  $all('.topnav nav a').forEach((a) => {
    if (a.getAttribute('data-nav') === page) a.classList.add('active');
  });
}
function initFAQ(): void {
  $all('.faq .q').forEach((q) => {
    q.addEventListener('click', () => q.parentElement?.classList.toggle('open'));
  });
}
function initModals(): void {
  $all('.modal-mask').forEach((mask) => {
    mask.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      if (t === mask || t.classList.contains('close')) mask.classList.remove('show');
    });
  });
}

/* ---------- 搜索提交：跳检索页 ---------- */
function bindSearch(): void {
  $all('[data-search]').forEach((box) => {
    const input = box.querySelector<HTMLInputElement>('input');
    const btn = box.querySelector<HTMLButtonElement>('button');
    if (!input || !btn) return;
    function go() {
      const v = (input.value || '').trim() || getDefaultCase();
      location.href = BASE + 'case-search/?q=' + encodeURIComponent(v);
    }
    btn.addEventListener('click', go);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
  });
}

/* ---------- 首页：类案洞察预览 ---------- */
function initInsightPreview(): void {
  const wrap = document.getElementById('insight-preview');
  if (!wrap) return;
  const picker = document.getElementById('insight-picker');
  const barBox = document.getElementById('insight-bars');
  const label = document.getElementById('insight-label');
  const goBtn = document.getElementById('insight-go') as HTMLAnchorElement | null;
  if (!picker || !barBox || !label) return;
  let cur = getDefaultCase();

  function render() {
    const d = getCaseData(cur);
    if (!d) return;
    label.textContent = cur + ' · 近三年 · 全国';
    barBox.innerHTML = distRowHtml(d.dist, 340);
    if (goBtn) goBtn.href = BASE + 'insight/?q=' + encodeURIComponent(cur);
  }
  getCaseKeys().forEach((k) => {
    const b = document.createElement('button');
    b.className = 'cp' + (k === cur ? ' active' : '');
    b.textContent = k;
    b.addEventListener('click', () => {
      cur = k;
      $all('.cp', picker).forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      render();
    });
    picker.appendChild(b);
  });
  render();
}

/* ---------- 洞察页 ---------- */
function initInsight(): void {
  if (!document.getElementById('insight-app')) return;
  const q = qparam('q');
  let cur = getCaseData(q) ? q : getDefaultCase();
  const picker = document.getElementById('insight-picker');
  const box = document.getElementById('insight-box');
  const shareBtn = document.getElementById('share-btn');
  const shareModal = document.getElementById('share-modal');
  const shareCanvas = document.getElementById('share-canvas') as HTMLCanvasElement | null;
  if (!picker || !box) return;

  function render() {
    const d = getCaseData(cur);
    if (!d) return;
    box.innerHTML =
      '<div class="stat-grid">' +
      '<div class="stat-card"><h4>判决结果分布</h4><div class="bars">' + distRowHtml(d.dist) + '</div></div>' +
      '<div class="stat-card"><h4>法院层级分布</h4><div class="bars">' + distRowHtml(d.level, 380) + '</div></div>' +
      '<div class="stat-card"><h4>地域分布 TOP5</h4><div class="bars">' + distRowHtml(d.region, 380) + '</div></div>' +
      '<div class="stat-card"><h4>关键指标</h4>' +
      '<div class="ds2" style="margin-bottom:10px;"><div class="n">' + fmt(d.total) + '</div><div class="t">相关文书总量</div></div>' +
      '<div class="ds2" style="margin-bottom:10px;"><div class="n">' + d.comp + '</div><div class="t">常见判赔区间</div></div>' +
      '<div class="ds2"><div class="n">' + d.days + '</div><div class="t">平均审结周期</div></div>' +
      '</div>' +
      '</div>';
    const title = document.getElementById('insight-title');
    if (title) title.textContent = cur;
  }
  getCaseKeys().forEach((k) => {
    const b = document.createElement('button');
    b.className = 'cp' + (k === cur ? ' active' : '');
    b.textContent = k;
    b.addEventListener('click', () => {
      cur = k;
      $all('.cp', picker).forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      render();
    });
    picker.appendChild(b);
  });
  render();

  if (shareBtn && shareCanvas && shareModal) {
    shareBtn.addEventListener('click', () => {
      drawShare(cur);
      shareModal.classList.add('show');
    });
    const dl = document.getElementById('share-download');
    if (dl) dl.addEventListener('click', () => {
      const a = document.createElement('a');
      a.download = '文书查-类案洞察-' + cur + '.png';
      a.href = shareCanvas.toDataURL('image/png');
      a.click();
    });
  }
}
function drawShare(key: string): void {
  const d = getCaseData(key);
  const c = document.getElementById('share-canvas') as HTMLCanvasElement | null;
  if (!d || !c) return;
  c.width = 900; c.height = 470;
  const ctx = c.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 900, 470);
  ctx.fillStyle = '#0C447C'; ctx.fillRect(0, 0, 900, 86);
  ctx.fillStyle = '#fff'; ctx.font = '600 30px PingFang SC, sans-serif'; ctx.fillText('文书查 · 类案洞察', 44, 54);
  ctx.font = '16px PingFang SC, sans-serif'; ctx.fillStyle = '#E6F1FB'; ctx.fillText('wenshucha.com/insight', 720, 56);
  ctx.fillStyle = '#1a2233'; ctx.font = '600 26px PingFang SC, sans-serif'; ctx.fillText(key + ' · 近三年 · 全国', 44, 138);
  ctx.font = '15px PingFang SC, sans-serif'; ctx.fillStyle = '#5f6b7a';
  ctx.fillText('相关文书 ' + fmt(d.total) + ' 篇 · 常见判赔区间 ' + d.comp + ' · 平均审结 ' + d.days, 44, 172);
  let y = 218; const bw = 560;
  d.dist.forEach((r) => {
    ctx.fillStyle = '#5f6b7a'; ctx.font = '15px PingFang SC, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(r.name, 130, y + 14);
    ctx.textAlign = 'left';
    ctx.fillStyle = r.cls === 'o' ? '#BA7517' : r.cls === 'g' ? '#639922' : '#185FA5';
    ctx.fillRect(150, y, Math.max(8, (bw * r.val) / 100), 24);
    ctx.fillStyle = '#1a2233'; ctx.font = '600 16px PingFang SC, sans-serif';
    ctx.fillText(r.val + '%', 150 + Math.max(8, (bw * r.val) / 100) + 14, y + 17);
    y += 52;
  });
  ctx.fillStyle = '#185FA5'; ctx.font = '14px PingFang SC, sans-serif';
  ctx.fillText('数据源：中国裁判文书网公开文书' + (isDemoData() ? '（演示数据）' : '') + '· 不构成法律意见', 44, 428);
}

/* ---------- 检索演示页 ---------- */
function initCaseSearch(): void {
  const wrap = document.getElementById('case-app');
  if (!wrap) return;
  const input = document.getElementById('cs-input') as HTMLInputElement | null;
  const btn = document.getElementById('cs-btn');
  const count = document.getElementById('cs-count');
  const list = document.getElementById('cs-list');
  const empty = document.getElementById('cs-empty');
  const reportBtn = document.getElementById('cs-report');
  if (!input || !btn || !count || !list || !empty) return;
  const selected: Record<string, boolean> = {};
  const filters = { level: '全部', prog: '全部', year: '全部' };
  let currentKey = '';

  function render() {
    const res = searchCases(input.value);
    currentKey = res.key;
    const d = res.data;
    const items = filterItems(d, filters);
    if (!res.matched) {
      empty.style.display = 'block';
      empty.textContent = '演示模式：当前仅收录 5 个案由演示数据。已为你展示「' + d.key + '」示例，正式版将支持任意关键词。';
    } else {
      empty.style.display = 'none';
    }
    count.textContent = d.key + ' · 共 ' + fmt(d.total) + ' 篇相关文书，当前命中 ' + items.length + ' 条';
    const kw = input.value.trim();
    list.innerHTML = items.map((it) =>
      '<div class="resultcard">' +
      '<div class="top"><div class="case-title">' + esc(it.no) + '</div>' +
      '<label style="font-size:13px; cursor:pointer;"><input type="checkbox" class="chk" data-no="' + esc(it.no) + '"> 选用</label></div>' +
      '<div class="meta"><span>' + esc(it.court) + '</span><span>' + it.date + '</span><span>' + it.prog + '</span><span>' + it.level + '</span></div>' +
      '<div class="snippet">' + markkw(it.snip, kw.length > 3 ? kw : '') + '</div>' +
      '<div class="foot"><span class="tag">' + esc(it.result) + '</span>' +
      '<a href="' + it.cite + '" target="_blank" rel="noopener" style="font-size:12px;">回溯裁判文书网原文 →</a></div>' +
      '</div>'
    ).join('');
    $all('.chk', list).forEach((c) => {
      const cb = c as HTMLInputElement;
      cb.checked = !!selected[cb.dataset.no || ''];
      cb.addEventListener('change', () => {
        const no = cb.dataset.no || '';
        if (cb.checked) selected[no] = true; else delete selected[no];
      });
    });
  }
  function bindFilter() {
    $all('[data-filter]').forEach((b) => {
      b.addEventListener('click', () => {
        const group = b.getAttribute('data-group') || '';
        filters[group as keyof typeof filters] = b.getAttribute('data-filter') || '全部';
        $all("[data-group='" + group + "']").forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
        render();
      });
    });
  }
  function go() {
    if (!input.value.trim()) input.value = getDefaultCase();
    render();
  }
  btn.addEventListener('click', go);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
  $all('[data-quick]').forEach((b) => {
    b.addEventListener('click', () => {
      input.value = b.getAttribute('data-quick') || '';
      $all('[data-quick]').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      go();
    });
  });
  if (reportBtn) reportBtn.addEventListener('click', () => {
    const d = getCaseData(currentKey);
    const items = d ? filterItems(d, filters) : [];
    const sel = items.filter((it) => selected[it.no]);
    const body = document.getElementById('report-body');
    if (!body) return;
    if (!sel.length) {
      body.innerHTML = '<p style="color:var(--sub);">请先在结果中勾选 1 条以上案例。</p>';
    } else {
      body.innerHTML =
        '<p><b>AI 综述（演示）</b>：基于所选用例，该类案件在所选区域内维持原判比例较高，裁判尺度相对统一；判赔金额集中于常见区间，建议按检索报告组织代理意见。</p>' +
        '<table class="tbl" style="margin-top:12px;"><tr><th>案号</th><th>法院</th><th>裁判结果</th></tr>' +
        sel.map((it) => '<tr><td>' + esc(it.no) + '</td><td>' + esc(it.court) + '</td><td>' + esc(it.result) + '</td></tr>').join('') +
        '</table>';
    }
    document.getElementById('report-modal')?.classList.add('show');
  });
  const initial = qparam('q');
  if (initial) { input.value = initial; }
  go();
  bindFilter();
}

/* ---------- 表单 ---------- */
function initForm(): void {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = document.getElementById('form-ok');
    if (ok) ok.classList.add('show');
    form.style.display = 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav(); initFAQ(); initModals(); bindSearch();
  initInsightPreview(); initInsight(); initCaseSearch(); initForm();
});
