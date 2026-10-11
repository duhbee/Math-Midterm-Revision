/* Prob Lab — CSD3241 midterm revision app. Vanilla JS, hash router, no build step. */
(function () {
  'use strict';

  /* ---------- storage (falls back to memory) ---------- */
  const mem = {};
  let storageOk = true;
  try { const k = '__t'; localStorage.setItem(k, '1'); localStorage.removeItem(k); } catch (e) { storageOk = false; }
  const store = {
    get(k, d) {
      try { const v = storageOk ? localStorage.getItem('prob:' + k) : mem[k]; return v == null ? d : JSON.parse(v); }
      catch (e) { return d; }
    },
    set(k, v) {
      const s = JSON.stringify(v);
      try { if (storageOk) localStorage.setItem('prob:' + k, s); else mem[k] = s; } catch (e) { mem[k] = s; }
    },
    del(k) { try { if (storageOk) localStorage.removeItem('prob:' + k); } catch (e) {} delete mem[k]; }
  };
  if (!storageOk) document.getElementById('banner').innerHTML =
    '<div class="banner">Browser storage is unavailable — progress will be lost if you reload this tab.</div>';

  /* ---------- helpers ---------- */
  const $app = document.getElementById('app');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const WK = {}; WEEKS.forEach((w) => (WK[w.id] = w));
  const MT = {}; METHODS.forEach((m) => (MT[m.id] = m));
  const QQ = {}; QS.forEach((q) => (QQ[q.id] = q));
  const NT = new Set(['mgf']); // not tested this midterm
  const NONE = 'None of These';
  const LET = 'ABCDEF';
  const SETS = { quiz: 'Quiz 1', pop: 'Pop quiz', hw: 'Homework', rev: 'W6 review', tut: 'Tutorial', lec: 'Lecture' };
  const isNT = (q) => NT.has(q.m[0]);

  function rng(seed) { // mulberry32
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0; let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, r) { const a = arr.slice(); r = r || Math.random; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const fmt = (sec) => { sec = Math.max(0, Math.floor(sec)); const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s).padStart(2, '0'); };
  const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
  const chip = (id, cls) => `<a class="mchip ${cls || ''}" href="#/method/${id}">${MT[id].name}</a>`;
  const chain = (q) => q.m.map((id, k) => chip(id, k ? 'sub' : '')).join('<span class="arrow">+</span>');

  /* highlight the cue phrases that appear verbatim; return [html, unmatched cues] */
  function hl(text, cues) {
    let out = text; const miss = [];
    (cues || []).forEach((c) => { const i = out.indexOf(c); if (i >= 0 && !/<[^>]*$/.test(out.slice(0, i))) out = out.slice(0, i) + '<mark>' + c + '</mark>' + out.slice(i + c.length); else miss.push(c); });
    return [out, miss];
  }
  function cueBlock(q) {
    const cues = q.cue || [];
    return cues.length ? `<div class="cues"><b>Give-away phrases:</b> ${cues.map((c) => `<span class="cue">${c}</span>`).join(' ')}</div>` : '';
  }
  function recipe(id, short) {
    const m = MT[id];
    return `<div class="teach"><h4>Method: ${m.name}${NT.has(id) ? ' · not tested' : ''}</h4><p>${m.short}</p>${short ? '' : `<ol>${m.recipe.map((s) => `<li>${s}</li>`).join('')}</ol>`}<p class="trap"><b>Trap:</b> ${m.trap}</p></div>`;
  }

  /* parse a typed numeric answer: 4/7, 1.224%, 1,320, −3, 2e-3 */
  function parseNum(s) {
    s = String(s).trim().replace(/[−–]/g, '-').replace(/,/g, '').replace(/\s+/g, '').replace(/^\$/, '');
    if (!s) return NaN;
    if (/%$/.test(s)) return parseFloat(s) / 100;
    const f = s.match(/^(-?[\d.]+)\/([\d.]+)$/); if (f) return parseFloat(f[1]) / parseFloat(f[2]);
    return /^-?[\d.]+(e-?\d+)?$/i.test(s) ? parseFloat(s) : NaN;
  }
  function numOk(q, raw) {
    const v = parseNum(raw); if (isNaN(v)) return false;
    if (q.tol === 0) return Math.abs(v - q.val) < 1e-9;
    return Math.abs(v - q.val) <= Math.max(q.tol, Math.abs(q.val) * 0.003);
  }
  function isRight(q, a) { if (a == null || a === '') return false; return q.kind === 'num' ? numOk(q, a) : a === q.ans; }

  /* methods that also correctly describe each other's questions — never offered as distractors */
  const TWINS = { cond: ['condratio', 'cond_count'], condratio: ['cond', 'cond_count'], cond_count: ['cond', 'condratio', 'hyper'], hyper: ['cond_count'], comp_prob: ['compl_count'], compl_count: ['comp_prob'] };
  /* method distractors: confusables first, then same family, then anything */
  function methodOpts(q, r) {
    const main = q.m[0], bad = new Set(q.m.concat(TWINS[main] || [], NT.has(main) ? [] : [...NT]));
    const fam = METHODS.filter((m) => m.fam === MT[main].fam).map((m) => m.id);
    const pool = [].concat(shuffle(MT[main].confuse || [], r), shuffle(fam, r), shuffle(METHODS.map((m) => m.id), r));
    const out = []; pool.forEach((id) => { if (!bad.has(id) && !out.includes(id) && out.length < 3) out.push(id); });
    return shuffle(out.concat([main]), r);
  }
  function optionOrder(q, r) {
    const all = [q.ans].concat(q.wrong);
    return shuffle(all.filter((o) => o !== NONE), r).concat(all.filter((o) => o === NONE));
  }

  /* ---------- history ---------- */
  const hist = store.get('hist', {});            // per question: c, w, last
  const mhist = store.get('mhist', {});          // per method recognition: c, w
  const conf = store.get('conf', {});            // "correct>chosen": count
  function record(id, ok) { const h = hist[id] || { c: 0, w: 0, last: 0 }; ok ? h.c++ : h.w++; h.last = ok ? 1 : 0; hist[id] = h; store.set('hist', hist); }
  function recordMethod(q, chosen) {
    const ok = q.m.includes(chosen), id = q.m[0], h = mhist[id] || { c: 0, w: 0 };
    ok ? h.c++ : h.w++; mhist[id] = h; store.set('mhist', mhist);
    if (!ok) { const k = id + '>' + chosen; conf[k] = (conf[k] || 0) + 1; store.set('conf', conf); }
    return ok;
  }

  /* theme */
  const themeBtn = document.getElementById('theme');
  function applyTheme(t) { document.documentElement.setAttribute('data-theme', t); }
  applyTheme(store.get('theme', 'light'));
  themeBtn.onclick = () => { const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; applyTheme(t); store.set('theme', t); };

  /* ---------- prefs ---------- */
  const prefs = Object.assign({ mode: 'study', weeks: WEEKS.map((w) => w.id), sets: Object.keys(SETS), count: 15, mfirst: true, nt: false }, store.get('prefs', {}));
  const savePrefs = () => store.set('prefs', prefs);
  const pool = () => QS.filter((q) => prefs.weeks.includes(q.wk) && prefs.sets.includes(q.set) && (prefs.nt || !isNT(q)));
  function balancedPick(list, n, r) {
    const by = {}; shuffle(list, r).forEach((q) => (by[q.wk] = by[q.wk] || []).push(q));
    const keys = shuffle(Object.keys(by), r); const out = [];
    while (out.length < n && keys.some((k) => by[k].length)) keys.forEach((k) => { if (by[k].length && out.length < n) out.push(by[k].shift()); });
    return out;
  }

  /* ---------- router ---------- */
  let timerId = null;
  function clearTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
  function route() {
    clearTimer();
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    const r = parts[0] || 'home';
    const nav = { practice: 'home', method: 'notes' };
    document.querySelectorAll('#nav a').forEach((a) => a.classList.toggle('on', a.dataset.r === (nav[r] || r)));
    const views = { home: viewHome, cram: viewCram,finder: viewFinder, spot: viewSpot, notes: viewNotes, method: viewMethod, bank: viewBank, practice: viewPractice, drills: viewDrills, mock: viewMock, sheet: viewSheet, progress: viewProgress };
    (views[r] || viewHome)(parts[1]);
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  const go = (h) => { if (location.hash === h) route(); else location.hash = h; };

  /* ========== HOME / DESK ========== */
  function viewHome() {
    const p = pool(), n = Math.min(prefs.count === 'all' ? p.length : prefs.count, p.length);
    const seen = Object.keys(mhist).reduce((s, k) => s + mhist[k].c + mhist[k].w, 0), mok = Object.keys(mhist).reduce((s, k) => s + mhist[k].c, 0);
    $app.innerHTML = `
<div class="eyebrow">Revision desk · Weeks 1–5</div>
<h1>Name the method, then the number.</h1>
<p class="lede">${QS.length} questions from your Quiz 1, pop quizzes, homework, tutorials, lectures and the Week 6 review — every one tagged with the method it needs and the exact phrases that give it away. Plus ${Object.keys(GEN).length} random generators, a decision tree, and an 18-question mock.</p>
<div class="grid">
 <div>
  <section class="card">
   <div class="card-h"><h2>Train method recognition</h2><span class="step">01 / SPOT</span></div>
   <div class="modes">
    <button class="mode" data-act="goto" data-v="#/spot"><span class="ic">◎</span><b>Spot the method</b><span>Read only the question. Pick the method in seconds. The give-away phrases light up after.</span><span class="tag">Fast</span></button>
    <button class="mode on" data-act="goto" data-v="#/cram"><span class="ic">⚑</span><b>Cram: 1 day left</b><span>The 10 question shapes, the first line to write for each, and today's timetable.</span><span class="tag">Start here</span></button>
    <button class="mode" data-act="goto" data-v="#/mock"><span class="ic">▣</span><b>Mock midterm</b><span>18 MCQ, 1 h 30, Weeks 1–5, no MGF. Graded by question AND method.</span><span class="tag">Exam</span></button>
   </div>
  </section>
  <section class="card">
   <div class="card-h"><h2>Practise questions</h2><span class="step">02 / SOLVE</span></div>
   <div class="row"><div class="field"><label>Mode</label><div class="seg">
     ${[['study', 'Study (instant feedback)'], ['timed', 'Timed (5 min / Q)']].map(([v, l]) => `<button class="${prefs.mode === v ? 'on' : ''}" data-act="pmode" data-v="${v}">${l}</button>`).join('')}</div></div>
    <div class="field"><label>Name the method first?</label><div class="seg">
     ${[[true, 'Yes — method, then answer'], [false, 'No']].map(([v, l]) => `<button class="${prefs.mfirst === v ? 'on' : ''}" data-act="mfirst" data-v="${v}">${l}</button>`).join('')}</div></div></div>
   <div class="field"><label>Weeks</label><div class="seg">${WEEKS.map((w) => `<button class="${prefs.weeks.includes(w.id) ? 'on' : ''}" data-act="wk" data-v="${w.id}">${w.week}</button>`).join('')}</div></div>
   <div class="field" style="margin-top:10px"><label>Sources</label><div class="seg">${Object.keys(SETS).map((s) => `<button class="${prefs.sets.includes(s) ? 'on' : ''}" data-act="src" data-v="${s}">${SETS[s]} (${QS.filter((q) => q.set === s).length})</button>`).join('')}</div></div>
   <div class="row"><div class="field"><label>Questions</label><div class="seg">
     ${[10, 15, 30, 'all'].map((v) => `<button class="${prefs.count === v ? 'on' : ''}" data-act="count" data-v="${v}">${v === 'all' ? 'All' : v}</button>`).join('')}</div></div>
    <label class="chk"><input type="checkbox" data-act="nt" ${prefs.nt ? 'checked' : ''}> Include MGF questions (not tested)</label></div>
   <p class="lede" style="margin:6px 0 14px">${n} of ${p.length} matching questions${prefs.mode === 'timed' ? ' · ' + fmt(n * 300) + ' limit' : ''}</p>
   <button class="btn" data-act="start" ${n ? '' : 'disabled'}>Start ${prefs.mode === 'study' ? 'study session' : 'timed set'} →</button>
  </section>
 </div>
 <aside>
  <div class="side">
   <div class="eyebrow">Midterm test</div>
   <h2>CSD3241 · Weeks 1–5</h2>
   <dl class="kv"><dt>When</dt><dd>Tue 13 Oct 2026, 1:10–2:40 pm</dd><dt>Venue</dt><dd>E2 lab — arrive early</dd><dt>Duration</dt><dd>90 min</dd><dt>Format</dt><dd>15–20 MCQ, lab computers (SEB)</dd><dt>Sheet</dt><dd>Formula sheet provided</dd></dl>
   <ul class="checks"><li>Weeks 1–5 lecture material</li><li>MGFs will <b>not</b> be tested</li><li>"None of These" is often right — compute, don't guess</li><li>E2 lab · check your seat · arrive before 1:10</li></ul>
  </div>
  <div class="card" style="margin-top:18px">
   <div class="eyebrow">Method recognition</div>
   <div class="stats"><div class="stat"><b>${seen}</b><span>methods named</span></div><div class="stat"><b>${pct(mok, seen)}%</b><span>named correctly</span></div></div>
   <a class="btn ghost sm" href="#/progress">See confusions →</a>
  </div>
  <div class="card"><div class="eyebrow">Quick start</div>
   <p><a href="#/notes/w1">Method notes</a> · <a href="#/bank">Question bank</a> · <a href="#/drills">Random drills</a> · <a href="#/sheet">Formula sheet</a></p></div>
 </aside>
</div>
<p class="foot">Built from the CSD3241 Week 1–6 slides, tutorials, homework and quiz reviews. Answers were re-computed; where the Moodle key differs from a naive reading (e.g. Quiz 1 Q5, Q9), the solution explains why.</p>`;
  }

  /* ========== CRAM (1-day plan) ========== */
  const cramDone = store.get('cram', {});
  const cramPool = (t) => QS.filter((q) => !isNT(q) && (t.m.includes(q.m[0]) || (t.any || []).some((m) => q.m.includes(m))));
  const bySrc = (s) => QS.find((q) => q.src === s);
  function viewCram() {
    $app.innerHTML = `<div class="eyebrow">Cram · exam tomorrow</div><h1>10 shapes. Learn the first line of each.</h1>
<p class="lede">You have done these questions before — what's missing is knowing how to <i>start</i>. Almost every quiz and homework question is one of these 10 shapes. Learn each trigger and skeleton; the rest is arithmetic.</p>
<div class="grid"><div>
${CRAM.map((t) => {
      const p = cramPool(t), seen = p.filter((q) => hist[q.id]), ok = seen.filter((q) => hist[q.id].last).length, ex = bySrc(t.ex);
      return `<section class="card cram" id="c${t.n}"><div class="card-h"><h2>${t.n}. ${t.title}</h2><span class="step">${seen.length ? pct(ok, seen.length) + '% right (' + seen.length + ' done)' : p.length + ' questions'}</span></div>
<p><b>Trigger:</b> ${t.trigger}</p>
<pre class="skel">${t.skel}</pre>
<p class="trap">${t.hook}</p>
<details class="terms"><summary>Worked example — ${t.ex}</summary><p>${ex.text}</p><p><b>Answer:</b> ${ex.ans}</p>${ex.steps}</details>
<div class="row"><button class="btn sm" data-act="cram-do" data-v="${t.n}">Do 3 now →</button><a class="step" href="#/method/${t.m[0]}">full method card</a>
<label class="chk"><input type="checkbox" data-act="cram-tick" data-v="c${t.n}" ${cramDone['c' + t.n] ? 'checked' : ''}> I can write this skeleton from memory</label></div></section>`;
    }).join('')}</div>
<aside><div class="side"><div class="eyebrow">Today's timetable</div>
${PLAN.map(([id, h, d]) => `<label class="plan"><input type="checkbox" data-act="cram-tick" data-v="${id}" ${cramDone[id] ? 'checked' : ''}><span><b>${h}</b><br>${d}</span></label>`).join('')}
<p class="step">${PLAN.filter(([id]) => cramDone[id]).length}/${PLAN.length} blocks · ${CRAM.filter((t) => cramDone['c' + t.n]).length}/10 skeletons memorised</p></div>
<div class="card" style="margin-top:18px"><div class="eyebrow">In the exam</div>${ROUTINE}</div></aside></div>`;
  }

  /* ========== METHOD FINDER ========== */
  let TR = { path: ['root'] };
  function viewFinder() {
    const node = TREE[TR.path[TR.path.length - 1]];
    const crumbs = TR.path.slice(0, -1).map((k, i) => `<button class="linkbtn" data-act="tr-back" data-v="${i}">${i ? TREE[k].q.slice(0, 28) + '…' : 'Start'}</button>`).join(' › ');
    let body;
    if (node) body = `<div class="qtext">${node.q}</div><div class="opts">${node.o.map(([l, t], k) => `<button class="opt" data-act="tr-go" data-v="${t}"><span class="k">${LET[k] || k + 1}</span><span>${l}</span></button>`).join('')}</div>`;
    else {
      const id = TR.path[TR.path.length - 1].slice(1), m = MT[id];
      body = `<div class="explain good"><b>Use: ${m.name}</b>${NT.has(id) ? ' <span class="pill">not tested</span>' : ''}<p>${m.short}</p></div>${recipe(id)}<p><b>Formula:</b> ${m.formula}</p><p><b>Example:</b> ${m.ex}</p><div class="row"><a class="btn sm" href="#/method/${id}">All ${QS.filter((q) => q.m.includes(id)).length} questions using this →</a><button class="btn ghost sm" data-act="tr-reset">Start again</button></div>`;
    }
    $app.innerHTML = `<div class="eyebrow">Method finder</div><h1>Stuck? Walk the tree.</h1>
<p class="lede">Answer two or three questions about the wording and the tree lands on the method. Below it, the cue-word decoder lists the phrases that give each method away.</p>
<div class="grid"><div><section class="card qcard"><div class="step" style="margin-bottom:8px">${crumbs || 'Start'}</div>${body}</section></div>
<aside class="side"><div class="eyebrow">The 4-step routine</div><ol class="steps">
<li><b>What is asked?</b> a count, a probability, E/Var.</li><li><b>Is there a condition?</b> "given", "already", "if" → it's a ratio P(A∩B)/P(B) or memoryless.</li><li><b>What makes the randomness?</b> fixed n → binomial; first success → geometric; rate in time → Poisson / exponential; no replacement → counting.</li><li><b>Watch units & complements.</b> λ = rate × time; "at least" → 1 − P(none).</li></ol></aside></div>
<h2 style="margin-top:28px">Cue-word decoder</h2>
<input type="text" id="cuefilter" placeholder="Filter, e.g. given, rate, together…" style="width:100%;max-width:420px;margin:8px 0">
<table class="tbl cuetbl"><tr><th>If the question says…</th><th>Use</th><th>Week</th></tr>${CUES.map(([c, id]) => `<tr data-cue="${esc((c + ' ' + MT[id].name).toLowerCase())}"><td>${c}</td><td>${chip(id)}</td><td>${WK[MT[id].wk].week}${NT.has(id) ? ' · not tested' : ''}</td></tr>`).join('')}</table>`;
  }

  /* ========== SPOT THE METHOD ========== */
  const SP = { q: null, opts: null, pick: null, streak: 0, n: 0, ok: 0, wk: 'all', gen: true };
  function spotNext() {
    let list = QS.filter((q) => !isNT(q) && (SP.wk === 'all' || q.wk === SP.wk));
    let q;
    if (SP.gen && Math.random() < 0.3) {
      const keys = Object.keys(GEN).filter((k) => { const g = GEN[k].gen(); return SP.wk === 'all' || MT[g.m[0]].wk === SP.wk; });
      if (keys.length) { const g = GEN[keys[Math.floor(Math.random() * keys.length)]].gen(); q = Object.assign({ id: 'gen', kind: 'num', src: 'Generated', set: 'new', wk: MT[g.m[0]].wk, cue: [], tol: 0.002 }, g); }
    }
    if (!q) {
      // weight towards methods you get wrong
      const w = list.map((x) => { const h = mhist[x.m[0]]; return 1 + (h ? h.w * 2 - h.c * 0.3 : 1); });
      let t = Math.random() * w.reduce((a, b) => a + Math.max(0.2, b), 0);
      q = list[list.length - 1];
      for (let i = 0; i < list.length; i++) { t -= Math.max(0.2, w[i]); if (t <= 0) { q = list[i]; break; } }
    }
    SP.q = q; SP.opts = methodOpts(q, Math.random); SP.pick = null;
  }
  function viewSpot() {
    if (!SP.q) spotNext();
    const q = SP.q, done = SP.pick != null, ok = done && q.m.includes(SP.pick);
    const [txt, miss] = hl(q.text, done ? q.cue : []);
    $app.innerHTML = `<div class="eyebrow">Spot the method</div><h1>Which method would you use?</h1>
<p class="lede">Don't solve it — just decide how. Aim for under 15 seconds. Keys 1–4 pick, Enter = next.</p>
<div class="row"><div class="seg"><button class="${SP.wk === 'all' ? 'on' : ''}" data-act="sp-wk" data-v="all">All weeks</button>${WEEKS.map((w) => `<button class="${SP.wk === w.id ? 'on' : ''}" data-act="sp-wk" data-v="${w.id}">${w.week}</button>`).join('')}</div>
<label class="chk"><input type="checkbox" data-act="sp-gen" ${SP.gen ? 'checked' : ''}> Mix in generated questions</label>
<span class="step">Streak ${SP.streak} · ${SP.ok}/${SP.n} this visit</span></div>
<section class="card qcard" style="max-width:860px"><div class="qmeta"><span class="pill">${WK[q.wk].week}</span><span class="pill">${q.src}</span></div>
<div class="qtext">${txt}</div>
<div class="opts">${SP.opts.map((id, k) => {
      let cls = ''; if (done) { if (q.m.includes(id)) cls = 'ok'; else if (id === SP.pick) cls = 'no'; }
      return `<button class="opt ${cls}" data-act="sp-pick" data-v="${id}" ${done ? 'disabled' : ''}><span class="k">${k + 1}</span><span><b>${MT[id].name}</b><br><small>${MT[id].short}</small></span></button>`;
    }).join('')}</div>
${done ? `<div class="explain ${ok ? 'good' : 'bad'}"><b>${ok ? 'Yes.' : 'Not quite.'}</b> Method chain: ${chain(q)}
${miss.length && q.cue.length ? `<div class="cues"><b>Also signals:</b> ${miss.map((c) => `<span class="cue">${c}</span>`).join(' ')}</div>` : ''}
${!ok && SP.pick ? `<p class="trap">You picked <b>${MT[SP.pick].name}</b>. ${MT[SP.pick].short}</p>` : ''}
${recipe(q.m[0])}
<details class="terms"><summary>Show the full solution (${q.ans})</summary>${q.steps}</details></div>
<div class="qnav"><span></span><button class="btn" data-act="sp-next">Next →</button></div>` : ''}
</section>`;
  }

  /* ========== NOTES (method cards by week) ========== */
  function viewNotes(wid) {
    wid = WK[wid] ? wid : 'w1';
    const w = WK[wid], idx = WEEKS.indexOf(w);
    const ms = METHODS.filter((m) => m.wk === wid);
    $app.innerHTML = `<div class="eyebrow">${w.week} · Method notes</div><h1>${w.title}</h1><p class="lede">${w.sub}. One card per method: when to use it, the recipe, the trap.</p>
<div class="notes" style="margin-top:20px"><nav class="toc">${WEEKS.map((x) => `<a href="#/notes/${x.id}" class="${x.id === wid ? 'on' : ''}">${x.n} · ${x.title}<small>${x.week}</small></a>`).join('')}
<a href="#/finder">⌥ Method finder</a><a href="#/sheet">▤ Formula sheet</a></nav>
<div>${ms.map((m) => methodCard(m)).join('')}
<div class="row"><button class="btn" data-act="practise-week" data-v="${wid}">Practise ${w.week} →</button>
${idx < WEEKS.length - 1 ? `<a class="btn ghost" href="#/notes/${WEEKS[idx + 1].id}">Next: ${WEEKS[idx + 1].title} →</a>` : ''}</div></div></div>`;
  }
  function methodCard(m, full) {
    const qs = QS.filter((q) => q.m.includes(m.id));
    return `<section class="sec" id="m-${m.id}"><div class="card-h"><h3>${m.name}${NT.has(m.id) ? ' <span class="pill">not tested</span>' : ''}</h3>${full ? '' : `<a class="step" href="#/method/${m.id}">${qs.length} questions →</a>`}</div>
<p class="lede" style="margin-top:0">${m.short}</p>
<div class="two"><div><h4>Use it when you see</h4><ul>${m.when.map((x) => `<li>${x}</li>`).join('')}</ul></div>
<div><h4>Recipe</h4><ol>${m.recipe.map((x) => `<li>${x}</li>`).join('')}</ol></div></div>
<p><b>Formula:</b> <code>${m.formula}</code></p>
<div class="callout"><b>Trap:</b> ${m.trap}</div>
<p><b>Example:</b> ${m.ex}</p>
<p class="step">Often confused with: ${(m.confuse || []).map((id) => chip(id, 'sub')).join(' ')}</p></section>`;
  }
  const openSol = {};
  function viewMethod(id) {
    const m = MT[id]; if (!m) return go('#/notes');
    const qs = QS.filter((q) => q.m.includes(id));
    $app.innerHTML = `<div class="eyebrow"><a href="#/notes/${m.wk}">${WK[m.wk].week} notes</a> · Method</div><h1>${m.name}</h1>
<div style="max-width:900px">${methodCard(m, true)}
<div class="row"><button class="btn" data-act="practise-method" data-v="${id}" ${qs.length ? '' : 'disabled'}>Practise these ${qs.length} →</button></div>
<h2 style="margin-top:20px">Every question that uses it</h2>${qs.map((q) => bankItem(q)).join('')}</div>`;
  }

  /* ========== QUESTION BANK ========== */
  const BK = { set: 'quiz', wk: 'all' };
  function bankItem(q) {
    const [txt] = hl(q.text, q.cue), o = openSol[q.id];
    return `<div class="rev ${hist[q.id] ? (hist[q.id].last ? 'ok' : 'no') : ''}" id="${q.id}"><div class="qmeta"><span class="pill">${q.src}</span><span class="pill">${WK[q.wk].week}</span>${isNT(q) ? '<span class="pill">not tested</span>' : ''}</div>
<div>${txt}</div>${q.kind === 'mcq' ? `<ul class="olist">${optionOrder(q, rng(q.id.length * 7 + +q.id.slice(1))).map((x) => `<li>${x}</li>`).join('')}</ul>` : ''}
<div class="mrow">Method: ${chain(q)}</div>
<button class="linkbtn" data-act="bk-sol" data-v="${q.id}">${o ? 'Hide' : 'Show'} answer &amp; steps</button>
${o ? `<div class="explain"><b>Answer:</b> ${q.ans}${q.steps}</div>` : ''}</div>`;
  }
  function viewBank() {
    const list = QS.filter((q) => (BK.set === 'all' || q.set === BK.set) && (BK.wk === 'all' || q.wk === BK.wk));
    $app.innerHTML = `<div class="eyebrow">Question bank</div><h1>Every past question, labelled.</h1>
<p class="lede">The give-away phrases are <mark>highlighted</mark> and every question shows its method chain. Main method first, then what you combine it with.</p>
<div class="row"><div class="seg"><button class="${BK.set === 'all' ? 'on' : ''}" data-act="bk-set" data-v="all">All</button>${Object.keys(SETS).map((s) => `<button class="${BK.set === s ? 'on' : ''}" data-act="bk-set" data-v="${s}">${SETS[s]}</button>`).join('')}</div></div>
<div class="row"><div class="seg"><button class="${BK.wk === 'all' ? 'on' : ''}" data-act="bk-wk" data-v="all">All weeks</button>${WEEKS.map((w) => `<button class="${BK.wk === w.id ? 'on' : ''}" data-act="bk-wk" data-v="${w.id}">${w.week}</button>`).join('')}</div>
<span class="step">${list.length} questions</span><button class="btn sm" data-act="bk-practise" ${list.length ? '' : 'disabled'}>Practise these →</button></div>
<div style="max-width:900px">${list.map(bankItem).join('')}</div>`;
  }

  /* ========== PRACTICE SESSION ========== */
  let S = store.get('sess', null);
  if (S && S.ids && S.ids.some((id) => !QQ[id])) S = null;
  const saveS = () => store.set('sess', S);
  function startSession(ids, mode, mfirst) {
    const r = rng(Date.now() & 0xffffffff);
    S = { mode, mfirst, ids, i: 0, ans: {}, meth: {}, order: {}, mopts: {}, done: false, start: Date.now(), limit: mode === 'timed' ? ids.length * 300 : 0 };
    ids.forEach((id) => { const q = QQ[id]; if (q.kind === 'mcq') S.order[id] = optionOrder(q, r); S.mopts[id] = methodOpts(q, r); });
    saveS(); go('#/practice');
  }
  function viewPractice() {
    if (!S || !S.ids || !S.ids.length) { $app.innerHTML = `<div class="empty">No session running. <a href="#/">Start one from the desk</a>.</div>`; return; }
    if (S.done) return practiceResults();
    const id = S.ids[S.i], q = QQ[id], chosen = S.ans[id], study = S.mode === 'study';
    const mDone = S.meth[id] != null, needM = S.mfirst && !mDone;
    const locked = study && chosen != null;
    const [txt, miss] = hl(q.text, mDone || locked ? q.cue : []);
    let mblock = '';
    if (S.mfirst) {
      mblock = `<div class="mstep"><div class="step">STEP 1 · WHICH METHOD?</div><div class="mopts">${S.mopts[id].map((m, k) => {
        let cls = ''; if (mDone) { if (q.m.includes(m)) cls = 'ok'; else if (m === S.meth[id]) cls = 'no'; }
        return `<button class="mopt ${cls}" data-act="m-pick" data-v="${m}" ${mDone ? 'disabled' : ''}>${MT[m].name}</button>`;
      }).join('')}</div>
      ${mDone ? `<div class="mfb ${q.m.includes(S.meth[id]) ? 'good' : 'bad'}">${q.m.includes(S.meth[id]) ? '✓ Right method.' : '✗ It\'s ' + MT[q.m[0]].name + '.'} Chain: ${chain(q)}${miss.length && q.cue.length ? ` · signals: ${miss.map((c) => `<span class="cue">${c}</span>`).join(' ')}` : ''}<br><small>${MT[q.m[0]].recipe[0]}</small></div>` : ''}</div>`;
    }
    let body = '';
    if (!needM) {
      if (q.kind === 'mcq') body = `<div class="opts">${S.order[id].map((o, k) => {
        let cls = '';
        if (locked) { if (o === q.ans) cls = 'ok'; else if (o === chosen) cls = 'no'; } else if (o === chosen) cls = 'sel';
        return `<button class="opt ${cls}" data-act="choose" data-v="${k}" ${locked ? 'disabled' : ''}><span class="k">${LET[k]}</span><span>${o}</span></button>`;
      }).join('')}</div>`;
      else body = `<form class="row" data-act="num"><input type="text" id="numin" autocomplete="off" placeholder="Number, fraction (4/7) or %" style="width:260px" value="${esc(chosen || '')}" ${locked ? 'disabled' : ''}>${study ? (locked ? '' : '<button class="btn sm">Check</button>') : '<button class="btn sm">Save</button>'}</form>`;
    }
    const ok = isRight(q, chosen);
    $app.innerHTML = `<div class="qwrap">
 <div class="qhead"><a class="btn ghost sm" href="#/">← Desk</a><div class="bar"><i style="width:${pct(S.i + 1, S.ids.length)}%"></i></div>
  <span class="step">${S.i + 1} / ${S.ids.length}</span>${S.mode === 'timed' ? '<span class="timer" id="tm">--:--</span>' : ''}</div>
 <div class="card qcard">
  <div class="qmeta"><span class="pill">${WK[q.wk].week}</span><span class="pill">${q.src}</span>${S.mfirst ? '' : `<span class="pill">${q.kind === 'mcq' ? 'MCQ' : 'Numeric'}</span>`}</div>
  <div class="qtext">${txt}</div>
  ${mblock}
  ${needM ? '' : (S.mfirst ? '<div class="step" style="margin:14px 0 8px">STEP 2 · ANSWER</div>' : '') + body}
  ${locked ? `<div class="explain ${ok ? 'good' : 'bad'}"><b>${ok ? 'Correct.' : 'Not quite.'}</b> Answer: ${q.ans}${q.steps}<small>Source: ${q.src} · Method: ${chain(q)}</small>${recipe(q.m[0], true)}</div>` : ''}
  <div class="qnav"><button class="btn ghost" data-act="prev" ${S.i ? '' : 'disabled'}>← Back</button>
   <span>${study && !locked && !mDone && !S.mfirst ? '<button class="btn ghost" data-act="hint">Which method?</button>' : ''}</span>
   ${S.i < S.ids.length - 1 ? '<button class="btn" data-act="next">Next →</button>' : `<button class="btn acc" data-act="finish">Finish (${Object.keys(S.ans).length}/${S.ids.length} answered)</button>`}</div>
  <div id="hint"></div>
 </div>
 <div class="palette">${S.ids.map((x, k) => {
      let c = k === S.i ? 'cur ' : '';
      if (S.ans[x] != null) c += study ? (isRight(QQ[x], S.ans[x]) ? 'ok' : 'no') : 'done';
      return `<button class="${c}" data-act="jump" data-v="${k}">${k + 1}</button>`;
    }).join('')}</div>
 <p class="foot">Keys: 1–4 pick method · A–E choose answer · ← → move · Enter next</p></div>`;
    if (S.mode === 'timed') startTimer(S.start, S.limit, () => finishPractice());
    const inp = document.getElementById('numin'); if (inp && !locked) inp.focus();
  }
  function startTimer(start, limit, onEnd) {
    const el = () => document.getElementById('tm');
    const tick = () => {
      const left = limit - (Date.now() - start) / 1000;
      if (el()) { el().textContent = fmt(left); el().classList.toggle('low', left < 300); }
      if (left <= 0) { clearTimer(); onEnd(); }
    };
    tick(); timerId = setInterval(tick, 1000);
  }
  function finishPractice() {
    if (!S.recorded) { if (S.mode !== 'study') S.ids.forEach((id) => { if (S.ans[id] != null) record(id, isRight(QQ[id], S.ans[id])); }); S.recorded = true; }
    S.done = true; saveS(); route();
  }
  function bars(rows, label) {
    return Object.keys(rows).map((k) => `<div class="hbar"><span class="l">${label(k)}</span><span class="b"><i style="width:${pct(rows[k][0], rows[k][1])}%"></i></span><span class="v">${rows[k][0]}/${rows[k][1]}</span></div>`).join('');
  }
  function reviewQ(q, chosen, mchosen) {
    const ok = isRight(q, chosen), [txt] = hl(q.text, q.cue);
    return `<div class="rev ${ok ? 'ok' : 'no'}"><div class="qmeta"><span class="pill">${q.src}</span><span class="pill">${WK[q.wk].week}</span></div>
<div>${txt}</div><p><b>Your answer:</b> ${chosen == null || chosen === '' ? '<i>blank</i>' : esc(chosen).replace(/&lt;(\/?sup)&gt;/g, '<$1>')}<br><b>Correct:</b> ${q.ans}</p>
<div class="mrow">Method: ${chain(q)}${mchosen ? (q.m.includes(mchosen) ? ' · <span class="good-t">you named it ✓</span>' : ` · <span class="bad-t">you said ${MT[mchosen].name}</span>`) : ''}</div>
<details class="terms"><summary>Steps</summary>${q.steps}</details></div>`;
  }
  function practiceResults() {
    const got = S.ids.filter((id) => isRight(QQ[id], S.ans[id])).length;
    const rows = {}; S.ids.forEach((id) => { const w = QQ[id].wk; rows[w] = rows[w] || [0, 0]; rows[w][1]++; if (isRight(QQ[id], S.ans[id])) rows[w][0]++; });
    const mN = S.ids.filter((id) => S.meth[id]).length, mOk = S.ids.filter((id) => S.meth[id] && QQ[id].m.includes(S.meth[id])).length;
    const wrong = S.ids.filter((id) => !isRight(QQ[id], S.ans[id]));
    $app.innerHTML = `<div class="qwrap"><div class="eyebrow">${S.mode === 'timed' ? 'Timed set' : 'Study session'} · results</div>
 <div class="score">${got} / ${S.ids.length}</div><p class="lede">${pct(got, S.ids.length)}% correct${mN ? ` · methods named right ${mOk}/${mN}` : ''} · time ${fmt((Date.now() - S.start) / 1000)}</p>
 <div class="card"><h2>By week</h2>${bars(rows, (k) => WK[k].week + ' · ' + WK[k].title)}</div>
 <div class="row noprint"><button class="btn" data-act="retrywrong" ${wrong.length ? '' : 'disabled'}>Retry ${wrong.length} wrong</button><button class="btn ghost" data-act="goto" data-v="#/cram">Back to Cram</button><button class="btn ghost" data-act="goto" data-v="#/">New session</button>
  <button class="btn ghost" data-act="toggleall">${S.showAll ? 'Show wrong only' : 'Show all'}</button></div>
 ${(S.showAll ? S.ids : wrong).map((id) => reviewQ(QQ[id], S.ans[id], S.meth[id])).join('') || '<div class="empty">Nothing wrong. Nice.</div>'}</div>`;
  }

  /* ========== DRILLS (generators) ========== */
  const D = { type: Object.keys(GEN)[0], cur: null, fb: '', streak: 0, n: 0, ok: 0, mpick: null, mopts: null, mfirst: true };
  function drNew() { const g = GEN[D.type].gen(); D.cur = Object.assign({ tol: 0.002, cue: [] }, g); D.fb = ''; D.mpick = null; D.mopts = methodOpts(D.cur, Math.random); }
  function viewDrills() {
    if (!D.cur) drNew();
    const c = D.cur, needM = D.mfirst && !D.mpick;
    $app.innerHTML = `<div class="eyebrow">Drills · fresh numbers</div><h1>Same method, new numbers.</h1>
<p class="lede">Each generator writes a new question in the quiz style. Give 4 decimals (or a fraction). Normal questions use the exam z-table.</p>
<div class="row"><div class="seg wrapseg">${Object.keys(GEN).map((k) => `<button class="${k === D.type ? 'on' : ''}" data-act="dr-type" data-v="${k}">${GEN[k].name}</button>`).join('')}</div></div>
<label class="chk"><input type="checkbox" data-act="dr-mfirst" ${D.mfirst ? 'checked' : ''}> Name the method first</label>
<div class="card qcard" style="max-width:820px;margin-top:12px"><div class="drill">${c.text}</div>
${D.mfirst ? `<div class="mopts">${D.mopts.map((m) => { let cls = ''; if (D.mpick) { if (c.m.includes(m)) cls = 'ok'; else if (m === D.mpick) cls = 'no'; } return `<button class="mopt ${cls}" data-act="dr-m" data-v="${m}" ${D.mpick ? 'disabled' : ''}>${MT[m].name}</button>`; }).join('')}</div>` : ''}
${needM ? '' : `<form data-act="dr-check" class="row"><input type="text" id="drin" autocomplete="off" placeholder="answer" style="width:200px"><button class="btn">Check</button><button type="button" class="btn ghost" data-act="dr-skip">Skip / new</button></form>`}
<div id="drfb">${D.fb}</div>
<p class="step">Streak ${D.streak} · ${D.ok}/${D.n} correct this visit</p></div>`;
    const inp = document.getElementById('drin'); if (inp && !D.fb) inp.focus();
  }

  /* ========== MOCK EXAM ========== */
  const MQUOTA = { w1: 3, w2: 4, w3: 5, w4: 3, w5: 3 };
  const MTIME = 5400;
  let M = store.get('mock', null);
  if (M && M.ids && M.ids.some((id) => !QQ[id])) M = null;
  const saveM = () => store.set('mock', M);
  function buildPaper(seed) {
    const r = rng(seed); const ids = [];
    WEEKS.forEach((w) => {
      const cand = shuffle(QS.filter((q) => q.kind === 'mcq' && q.wk === w.id && !isNT(q)), r), used = new Set();
      cand.forEach((q) => { if (ids.filter((x) => QQ[x].wk === w.id).length < MQUOTA[w.id] && !used.has(q.m[0])) { ids.push(q.id); used.add(q.m[0]); } });
      cand.forEach((q) => { if (ids.filter((x) => QQ[x].wk === w.id).length < MQUOTA[w.id] && !ids.includes(q.id)) ids.push(q.id); });
    });
    const order = {}; ids.forEach((id) => (order[id] = optionOrder(QQ[id], r)));
    return { ids: shuffle(ids, r), order };
  }
  function viewMock() {
    if (M && !M.done) return mockQuestion();
    if (M && M.done) return mockResults();
    const h = store.get('mockHist', []);
    $app.innerHTML = `<div class="eyebrow">Mock midterm</div><h1>Sit the real format.</h1>
<p class="lede">18 multiple-choice questions from your past quizzes and homework, spread over Weeks 1–5 (MGF questions left out), 1 h 30 min. Flag and come back. After submitting you see your score by week and by method.</p>
<div class="grid"><div class="card"><h2>Choose a paper</h2><p>Papers A–C are fixed so you can retake them. Random draws a new mix.</p>
<div class="modes">${[['A', 11], ['B', 22], ['C', 33]].map(([n, s]) => `<button class="mode" data-act="mock-start" data-v="${s}" data-n="Paper ${n}"><span class="ic">▣</span><b>Paper ${n}</b><span>18 MCQ · 1:30:00</span><span class="tag">Fixed</span></button>`).join('')}</div>
<div class="row"><button class="btn" data-act="mock-start" data-v="rand" data-n="Random paper">Random paper →</button></div></div>
<aside class="side"><div class="eyebrow">Routine for every question</div>${ROUTINE}<div class="eyebrow" style="margin-top:12px">Exam tips</div><ul class="checks"><li>~5 min per question — name the method in the first 15 s</li><li>Conditional? write P(A∩B)/P(B) before any numbers</li><li>Convert λ to the asked time window</li><li>"None of These" is right surprisingly often — finish the arithmetic</li><li>Use the formula sheet's z-table: round z to 2 dp</li></ul>
${h.length ? `<h3>Past attempts</h3>${h.slice(-6).reverse().map((x) => `<p class="step">${x.name} · ${x.score}/${x.n} · ${new Date(x.at).toLocaleDateString()}</p>`).join('')}` : ''}</aside></div>`;
  }
  function mockQuestion() {
    const id = M.ids[M.i], q = QQ[id];
    $app.innerHTML = `<div class="qwrap">
<div class="qhead"><span class="pill">${M.name}</span><div class="bar"><i style="width:${pct(Object.keys(M.ans).length, M.ids.length)}%"></i></div><span class="timer" id="tm">--:--</span></div>
<div class="card qcard"><div class="qmeta"><span class="pill">Question ${M.i + 1} of ${M.ids.length}</span></div>
<div class="qtext">${q.text}</div><div class="opts">${M.order[id].map((o, k) => `<button class="opt ${M.ans[id] === o ? 'sel' : ''}" data-act="mock-choose" data-v="${k}"><span class="k">${LET[k]}</span><span>${o}</span></button>`).join('')}</div>
<div class="field" style="margin-top:14px"><label>Optional: which method did you use? (graded after)</label><select data-act="mock-meth"><option value="">—</option>${WEEKS.map((w) => `<optgroup label="${w.week}">${METHODS.filter((m) => m.wk === w.id && !NT.has(m.id)).map((m) => `<option value="${m.id}" ${M.meth[id] === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}</optgroup>`).join('')}</select></div>
<div class="qnav"><button class="btn ghost" data-act="mock-prev" ${M.i ? '' : 'disabled'}>← Back</button>
<button class="btn ghost" data-act="mock-flag">${M.flag[id] ? '⚑ Unflag' : '⚐ Flag'}</button>
${M.i < M.ids.length - 1 ? '<button class="btn" data-act="mock-next">Next →</button>' : '<button class="btn acc" data-act="mock-submit">Submit paper</button>'}</div></div>
<div class="card"><div class="card-h"><b>Questions</b><button class="btn ghost sm" data-act="mock-submit">Submit paper</button></div>
<div class="palette">${M.ids.map((x, k) => `<button class="${k === M.i ? 'cur ' : ''}${M.flag[x] ? 'flag' : M.ans[x] != null ? 'done' : ''}" data-act="mock-jump" data-v="${k}">${k + 1}</button>`).join('')}</div></div></div>`;
    startTimer(M.start, MTIME, () => submitMock(true));
  }
  function submitMock(auto) {
    if (!auto) { const blank = M.ids.filter((id) => M.ans[id] == null).length; if (!confirm(`Submit the paper?${blank ? ` ${blank} question(s) are blank.` : ''}`)) return; }
    M.done = true; M.end = Date.now();
    M.ids.forEach((id) => { if (M.ans[id] != null) record(id, M.ans[id] === QQ[id].ans); if (M.meth[id]) recordMethod(QQ[id], M.meth[id]); });
    saveM(); clearTimer(); route();
  }
  function mockResults() {
    const got = M.ids.filter((id) => M.ans[id] === QQ[id].ans).length;
    const rows = {}, mrows = {};
    M.ids.forEach((id) => { const q = QQ[id], ok = M.ans[id] === q.ans; rows[q.wk] = rows[q.wk] || [0, 0]; rows[q.wk][1]++; if (ok) rows[q.wk][0]++; const k = q.m[0]; mrows[k] = mrows[k] || [0, 0]; mrows[k][1]++; if (ok) mrows[k][0]++; });
    const named = M.ids.filter((id) => M.meth[id]).length, namedOk = M.ids.filter((id) => M.meth[id] && QQ[id].m.includes(M.meth[id])).length;
    $app.innerHTML = `<div class="qwrap"><div class="eyebrow">${M.name} · results</div>
<div class="score">${got} / ${M.ids.length}</div>
<p class="lede">${pct(got, M.ids.length)}% · time used ${fmt(((M.end || Date.now()) - M.start) / 1000)}${named ? ` · methods named right ${namedOk}/${named}` : ''}</p>
<div class="card"><h2>By week</h2>${bars(rows, (k) => WK[k].week + ' · ' + WK[k].title)}</div>
<div class="card"><h2>By method</h2>${bars(mrows, (k) => MT[k].name)}</div>
<div class="row noprint"><button class="btn" data-act="mock-save">Save score &amp; finish</button><button class="btn ghost" data-act="mock-new">Discard</button></div>
<h2 style="margin-top:24px">Review</h2>${M.ids.map((id) => reviewQ(QQ[id], M.ans[id], M.meth[id])).join('')}</div>`;
  }

  /* ========== FORMULA SHEET ========== */
  function viewSheet() {
    const cols = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    $app.innerHTML = `<div class="noprint"><div class="eyebrow">Formula sheet</div><h1>What you get vs what you must know.</h1>
<p class="lede">Left: what the provided sheet contains. Right: what is NOT on it and must be in your head. Below: the same z-table as the exam, with a lookup.</p>
<div class="row"><button class="btn" onclick="window.print()">Print / save as PDF</button></div></div>
<div class="sheet">${SHEET_GIVEN}${SHEET_MEMO}</div>
<section class="card noprint" style="margin-top:20px"><h2>z-table lookup</h2>
<div class="row"><input type="text" id="zin" placeholder="z, e.g. 1.23 or −0.8" style="width:180px"><span id="zout" class="big"></span></div>
<p class="step">Exam rule: round z to 2 dp. Φ(−z) = 1 − Φ(z). Right tail: 1 − Φ(z). Inverse: z₀.₉₀ = 1.2816 (table 1.28), z₀.₉₅ = 1.645, z₀.₉₇₅ = 1.96.</p>
<div style="overflow-x:auto"><table class="tbl ztbl"><tr><th>z</th>${cols.map((c) => `<th>.0${c}</th>`).join('')}</tr>${ZROWS.map((r, i) => `<tr><th>${(i / 10).toFixed(1)}</th>${r.map((v) => `<td>${v.toFixed(4)}</td>`).join('')}</tr>`).join('')}</table></div></section>`;
  }

  /* ========== PROGRESS ========== */
  function viewProgress() {
    const rows = {}; WEEKS.forEach((w) => (rows[w.id] = [0, 0]));
    Object.keys(hist).forEach((id) => { const q = QQ[id]; if (!q) return; rows[q.wk][1]++; if (hist[id].last) rows[q.wk][0]++; });
    const mrows = {}; Object.keys(mhist).filter((k) => MT[k]).sort((a, b) => mhist[a].c / (mhist[a].c + mhist[a].w) - mhist[b].c / (mhist[b].c + mhist[b].w)).forEach((k) => (mrows[k] = [mhist[k].c, mhist[k].c + mhist[k].w]));
    const cf = Object.keys(conf).sort((a, b) => conf[b] - conf[a]).slice(0, 8);
    const wrong = Object.keys(hist).filter((id) => QQ[id] && !hist[id].last);
    const mh = store.get('mockHist', []);
    $app.innerHTML = `<div class="eyebrow">Progress</div><h1>Where the marks are leaking.</h1>
<div class="stats"><div class="stat"><b>${Object.keys(hist).length}/${QS.length}</b><span>questions answered</span></div><div class="stat"><b>${wrong.length}</b><span>currently wrong</span></div>
<div class="stat"><b>${Object.keys(mhist).length}/${METHODS.length}</b><span>methods practised</span></div><div class="stat"><b>${mh.length ? mh[mh.length - 1].score + '/' + mh[mh.length - 1].n : '—'}</b><span>last mock</span></div></div>
<div class="card"><h2>Method recognition (weakest first)</h2>${Object.keys(mrows).length ? bars(mrows, (k) => `<a href="#/method/${k}">${MT[k].name}</a>`) : '<p class="lede">Do some <a href="#/spot">Spot the method</a> rounds first.</p>'}</div>
<div class="card"><h2>Your method mix-ups</h2>${cf.length ? `<table class="tbl"><tr><th>Question needed</th><th>You picked</th><th>Times</th></tr>${cf.map((k) => { const [a, b] = k.split('>'); return MT[a] && MT[b] ? `<tr><td>${chip(a)}</td><td>${chip(b, 'sub')}</td><td>${conf[k]}</td></tr>` : ''; }).join('')}</table><p class="step">Open both method cards and compare their "use it when" lists.</p>` : '<p class="lede">No mix-ups recorded yet.</p>'}</div>
<div class="card"><h2>Answer accuracy by week</h2>${bars(rows, (k) => WK[k].week + ' · ' + WK[k].title)}</div>
<div class="row"><button class="btn" data-act="drill-wrong" ${wrong.length ? '' : 'disabled'}>Practise my ${wrong.length} mistakes →</button>
<button class="btn ghost" data-act="reset-all">Reset all progress</button></div>
${mh.length ? `<div class="card"><h2>Mock history</h2>${mh.map((x) => `<p class="step">${x.name} · <b>${x.score}/${x.n}</b> · ${new Date(x.at).toLocaleString()}</p>`).join('')}</div>` : ''}`;
  }

  /* ========== events ========== */
  $app.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const act = el.dataset.act, v = el.dataset.v;
    const toggle = (arr, x) => { const i = arr.indexOf(x); i >= 0 ? arr.splice(i, 1) : arr.push(x); };
    switch (act) {
      case 'goto': go(v); break;
      case 'pmode': prefs.mode = v; savePrefs(); route(); break;
      case 'mfirst': prefs.mfirst = v === 'true'; savePrefs(); route(); break;
      case 'wk': toggle(prefs.weeks, v); savePrefs(); route(); break;
      case 'src': toggle(prefs.sets, v); savePrefs(); route(); break;
      case 'count': prefs.count = v === 'all' ? 'all' : +v; savePrefs(); route(); break;
      case 'nt': prefs.nt = el.checked; savePrefs(); route(); break;
      case 'start': { const p = pool(); const n = prefs.count === 'all' ? p.length : Math.min(prefs.count, p.length); startSession(balancedPick(p, n).map((q) => q.id), prefs.mode, prefs.mfirst); break; }
      case 'practise-week': startSession(balancedPick(QS.filter((q) => q.wk === v && !isNT(q)), 15).map((q) => q.id), 'study', true); break;
      case 'practise-method': startSession(shuffle(QS.filter((q) => q.m.includes(v))).map((q) => q.id), 'study', false); break;
      /* cram */
      case 'cram-do': {
        const t = CRAM[+v - 1], p = cramPool(t);
        const fresh = shuffle(p.filter((q) => !(hist[q.id] && hist[q.id].last))), rest = shuffle(p.filter((q) => !fresh.includes(q)));
        startSession(fresh.concat(rest).slice(0, 3).map((q) => q.id), 'study', true); break;
      }
      case 'cram-tick': cramDone[v] = el.checked; store.set('cram', cramDone); break;
      /* finder */
      case 'tr-go': TR.path.push(v); route(); break;
      case 'tr-back': TR.path = TR.path.slice(0, +v + 1); route(); break;
      case 'tr-reset': TR.path = ['root']; route(); break;
      /* spot */
      case 'sp-pick': if (SP.pick == null) { SP.pick = v; SP.n++; const ok = SP.q.id === 'gen' ? SP.q.m.includes(v) : recordMethod(SP.q, v); if (ok) { SP.ok++; SP.streak++; } else SP.streak = 0; route(); } break;
      case 'sp-next': spotNext(); route(); break;
      case 'sp-wk': SP.wk = v; spotNext(); route(); break;
      case 'sp-gen': SP.gen = el.checked; break;
      /* bank */
      case 'bk-set': BK.set = v; route(); break;
      case 'bk-wk': BK.wk = v; route(); break;
      case 'bk-sol': { openSol[v] = !openSol[v]; const box = document.getElementById(v); if (box) box.outerHTML = bankItem(QQ[v]); break; }
      case 'bk-practise': startSession(QS.filter((q) => (BK.set === 'all' || q.set === BK.set) && (BK.wk === 'all' || q.wk === BK.wk)).map((q) => q.id), 'study', true); break;
      /* practice */
      case 'm-pick': { const id = S.ids[S.i]; if (S.meth[id] == null) { S.meth[id] = v; recordMethod(QQ[id], v); saveS(); route(); } break; }
      case 'choose': {
        const id = S.ids[S.i]; if (S.mode === 'study' && S.ans[id] != null) break;
        S.ans[id] = S.order[id][+v];
        if (S.mode === 'study') record(id, isRight(QQ[id], S.ans[id]));
        saveS(); route(); break;
      }
      case 'prev': if (S.i > 0) { S.i--; saveS(); route(); } break;
      case 'next': if (S.i < S.ids.length - 1) { S.i++; saveS(); route(); } break;
      case 'jump': S.i = +v; saveS(); route(); break;
      case 'hint': { const q = QQ[S.ids[S.i]]; document.getElementById('hint').innerHTML = `<div class="explain">Method: ${chain(q)}${cueBlock(q)}${recipe(q.m[0])}</div>`; break; }
      case 'finish': if (S.mode !== 'study' && Object.keys(S.ans).length < S.ids.length && !confirm('Some questions are unanswered. Finish anyway?')) break; finishPractice(); break;
      case 'retrywrong': startSession(S.ids.filter((id) => !isRight(QQ[id], S.ans[id])), S.mode, S.mfirst); break;
      case 'toggleall': S.showAll = !S.showAll; saveS(); route(); break;
      /* drills */
      case 'dr-type': D.type = v; drNew(); route(); break;
      case 'dr-skip': drNew(); route(); break;
      case 'dr-m': D.mpick = v; route(); break;
      case 'dr-mfirst': D.mfirst = el.checked; route(); break;
      /* mock */
      case 'mock-start': {
        const seed = v === 'rand' ? (Date.now() & 0xffffff) : +v; const p = buildPaper(seed);
        M = { name: el.dataset.n, ids: p.ids, order: p.order, ans: {}, meth: {}, flag: {}, i: 0, start: Date.now(), done: false };
        saveM(); route(); break;
      }
      case 'mock-choose': { const id = M.ids[M.i]; M.ans[id] = M.order[id][+v]; saveM(); route(); break; }
      case 'mock-prev': M.i--; saveM(); route(); break;
      case 'mock-next': M.i++; saveM(); route(); break;
      case 'mock-jump': M.i = +v; saveM(); route(); break;
      case 'mock-flag': { const id = M.ids[M.i]; M.flag[id] = !M.flag[id]; saveM(); route(); break; }
      case 'mock-submit': submitMock(false); break;
      case 'mock-save': {
        const mh = store.get('mockHist', []);
        mh.push({ name: M.name, score: M.ids.filter((id) => M.ans[id] === QQ[id].ans).length, n: M.ids.length, at: Date.now() }); store.set('mockHist', mh);
        M = null; store.del('mock'); go('#/progress'); break;
      }
      case 'mock-new': if (confirm('Discard this paper?')) { M = null; store.del('mock'); route(); } break;
      /* progress */
      case 'drill-wrong': startSession(shuffle(Object.keys(hist).filter((id) => QQ[id] && !hist[id].last)), 'study', true); break;
      case 'reset-all':
        if (confirm('Erase all answers, method stats and mock history on this device?')) { ['hist', 'mhist', 'conf', 'mockHist', 'sess', 'mock', 'cram'].forEach(store.del); location.reload(); }
        break;
    }
  });
  $app.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset.act === 'mock-meth') { M.meth[M.ids[M.i]] = el.value || undefined; saveM(); }
  });
  $app.addEventListener('input', (e) => {
    const el = e.target;
    if (el.id === 'cuefilter') { const f = el.value.toLowerCase(); document.querySelectorAll('.cuetbl tr[data-cue]').forEach((tr) => (tr.style.display = tr.dataset.cue.includes(f) ? '' : 'none')); }
    if (el.id === 'zin') { const z = parseNum(el.value); document.getElementById('zout').textContent = isNaN(z) ? '' : `Φ(${z.toFixed(2)}) = ${PHI(z).toFixed(4)}`; }
  });
  $app.addEventListener('submit', (e) => {
    const act = e.target.dataset.act;
    if (act === 'num') {
      e.preventDefault();
      const id = S.ids[S.i], v = document.getElementById('numin').value.trim(); if (!v) return;
      S.ans[id] = v;
      if (S.mode === 'study') record(id, isRight(QQ[id], v)); else if (S.i < S.ids.length - 1) S.i++;
      saveS(); route(); return;
    }
    if (act === 'dr-check') {
      e.preventDefault();
      const raw = document.getElementById('drin').value.trim(); if (!raw) return;
      const c = D.cur, ok = numOk(c, raw); D.n++; if (ok) { D.ok++; D.streak++; } else D.streak = 0;
      D.fb = `<div class="fb ${ok ? 'ok' : 'no'}"><b>${ok ? 'Correct' : 'Answer: ' + c.ans}</b> · Method: ${chain(c)}${c.steps}</div><button class="btn sm" data-act="dr-skip" style="margin-top:10px">Next →</button>`;
      route();
    }
  });

  /* keyboard */
  document.addEventListener('keydown', (e) => {
    if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    const r = location.hash.replace(/^#\/?/, '').split('/')[0];
    const k = e.key.toLowerCase();
    const click = (sel) => { const b = $app.querySelector(sel); if (b && !b.disabled) b.click(); };
    if (r === 'spot') {
      if ('1234'.includes(k) && k) { const b = $app.querySelectorAll('[data-act="sp-pick"]')[+k - 1]; if (b && !b.disabled) b.click(); }
      else if (k === 'enter') click('[data-act="sp-next"]');
    } else if (r === 'practice' && S && !S.done) {
      if ('1234'.includes(k) && k) { const b = $app.querySelectorAll('[data-act="m-pick"]')[+k - 1]; if (b && !b.disabled) b.click(); }
      else if ('abcde'.includes(k) && k) click(`[data-act="choose"][data-v="${'abcde'.indexOf(k)}"]`);
      else if (k === 'arrowright' || k === 'enter') click('[data-act="next"]');
      else if (k === 'arrowleft') click('[data-act="prev"]');
    } else if (r === 'mock' && M && !M.done) {
      if ('abcde'.includes(k) && k) click(`[data-act="mock-choose"][data-v="${'abcde'.indexOf(k)}"]`);
      else if (k === 'arrowright') click('[data-act="mock-next"]');
      else if (k === 'arrowleft') click('[data-act="mock-prev"]');
    } else if (r === 'finder') {
      const i = 'abcdefghijk'.indexOf(k); if (i >= 0 && k) { const b = $app.querySelectorAll('[data-act="tr-go"]')[i]; if (b) b.click(); }
    }
  });

  route();
})();
