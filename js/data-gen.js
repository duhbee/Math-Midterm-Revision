/* Random question generators — endless fresh numbers in the same style as the quizzes.
   Each returns { m: [methods], text, val, ans, steps, tol }. Answers use the same z-table as the exam. */
window.GEN = (function () {
  const R = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
  const C = (n, k) => (k < 0 || k > n ? 0 : Math.round(fact(n) / (fact(k) * fact(n - k))));
  const f4 = (x) => (+x.toFixed(4)).toString();
  const f2 = (x) => (+x.toFixed(2)).toString();
  const pois = (l, k) => Math.exp(-l) * Math.pow(l, k) / fact(k);
  const bin = (n, p, k) => C(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  const pct = (x) => Math.round(x * 100) + '%';
  const sup = (x) => '<sup>' + x + '</sup>';
  const G = {};

  G.ie = { name: 'Inclusion–exclusion', gen() {
    const t = R(3, 9), ab = R(10, 25), ac = R(10, 25), bc = R(8, 22);
    const a = ab + ac - t + R(8, 30), b = ab + bc - t + R(8, 30), c = ac + bc - t + R(8, 30);
    const uni = a + b + c - ab - ac - bc + t, tot = uni + R(5, 40);
    if (Math.random() < 0.5) return { m: ['ie'], text: `Among ${tot} players, ${a} use A, ${b} use B, ${c} use C; ${ab} use both A and B, ${ac} both A and C, ${bc} both B and C, and ${t} use all three. How many use none?`,
      val: tot - uni, ans: String(tot - uni), tol: 0, steps: `<p>Union = ${a}+${b}+${c} − ${ab}−${ac}−${bc} + ${t} = ${uni}. None = ${tot} − ${uni} = <b>${tot - uni}</b>.</p>` };
    const ea = a - ab - ac + t, eb = b - ab - bc + t, ec = c - ac - bc + t;
    return { m: ['ie'], text: `Among ${tot} players, ${a} earned A, ${b} earned B, ${c} earned C; |A∩B| = ${ab}, |A∩C| = ${ac}, |B∩C| = ${bc}; ${t} earned all three. How many earned exactly one?`,
      val: ea + eb + ec, ans: String(ea + eb + ec), tol: 0, steps: `<p>A only ${a}−${ab}−${ac}+${t} = ${ea}; B only ${eb}; C only ${ec}. Sum = <b>${ea + eb + ec}</b>.</p>` };
  } };
  G.block = { name: 'Together / not together', gen() {
    const n = R(6, 10), k = pick([2, 3]);
    const tog = fact(n - k + 1) * fact(k);
    if (Math.random() < 0.5) return { m: ['block'], text: `${n} distinct books are placed on a shelf. ${k} particular books must be next to each other (any order inside). How many arrangements?`,
      val: tog, ans: tog.toLocaleString(), tol: 0, steps: `<p>Block: (${n}−${k}+1)!·${k}! = ${n - k + 1}!·${k}! = <b>${tog.toLocaleString()}</b>.</p>` };
    return { m: ['compl_count', 'block'], text: `${n} distinct heroes stand in a queue. ${k} particular heroes must NOT all stand together as one block. How many arrangements?`,
      val: fact(n) - tog, ans: (fact(n) - tog).toLocaleString(), tol: 0, steps: `<p>${n}! − ${n - k + 1}!·${k}! = ${fact(n).toLocaleString()} − ${tog.toLocaleString()} = <b>${(fact(n) - tog).toLocaleString()}</b>.</p>` };
  } };
  G.rivals = { name: 'Lineup with rivals', gen() {
    const n = R(7, 10), r = R(3, 5), all = fact(n) / fact(n - r), both = C(n - 2, r - 2) * fact(r);
    return { m: ['compl_count', 'perm'], text: `An ordered lineup of ${r} is formed from ${n} distinct heroes, no repeats. Two rivals refuse to appear together. How many lineups?`,
      val: all - both, ans: (all - both).toLocaleString(), tol: 0, steps: `<p>P(${n},${r}) = ${all}. Both rivals: C(${n - 2},${r - 2})·${r}! = ${both}. Answer <b>${all - both}</b>.</p>` };
  } };
  G.condcount = { name: 'Conditional counting', gen() {
    const r = R(8, 16), b = R(6, 14);
    if (Math.random() < 0.5) {
      const t = C(r, 2) * b, cond = C(r, 2) * b + r * C(b, 2);
      return { m: ['cond_count'], text: `A box has ${r} red and ${b} blue tokens. Three are drawn without replacement. Given the sample contains both colors, find P(exactly two red).`,
        val: t / cond, ans: f4(t / cond), steps: `<p>C(${r},2)·${b} = ${t}; + ${r}·C(${b},2) = ${r * C(b, 2)}. ${t}/${cond} = <b>${f4(t / cond)}</b>.</p>` };
    }
    const t = C(r, 2) * b, cond = C(r + b, 3) - C(b, 3);
    return { m: ['cond_count'], text: `A container has ${r} red and ${b} blue tokens. Three are selected without replacement. Given at least one red, find P(exactly two red).`,
      val: t / cond, ans: f4(t / cond), steps: `<p>Target C(${r},2)C(${b},1) = ${t}. Condition C(${r + b},3) − C(${b},3) = ${cond}. Ratio <b>${f4(t / cond)}</b>.</p>` };
  } };
  G.bayes = { name: 'Bayes (3 sources)', gen() {
    const sh = pick([[50, 30, 20], [60, 25, 15], [45, 35, 20], [40, 40, 20], [55, 30, 15]]), rt = [R(1, 3), R(2, 5), R(4, 8)];
    const br = sh.map((s, i) => s / 100 * rt[i] / 100), tot = br.reduce((a, b) => a + b), k = R(0, 2), L = 'ABC';
    return { m: ['bayes'], text: `Lines A, B, C make ${sh[0]}%, ${sh[1]}%, ${sh[2]}% of output with defect rates ${rt[0]}%, ${rt[1]}%, ${rt[2]}%. An item is defective. Find P(it came from ${L[k]}).`,
      val: br[k] / tot, ans: f4(br[k] / tot), steps: `<p>Branches: ${br.map((x) => f4(x)).join(', ')}. P(D) = ${f4(tot)}. P(${L[k]}|D) = ${f4(br[k])}/${f4(tot)} = <b>${f4(br[k] / tot)}</b>.</p>` };
  } };
  G.bayes2 = { name: 'Bayes (two tests)', gen() {
    const p = R(2, 20) / 100, s = R(80, 95) / 100, f = R(5, 16) / 100, two = Math.random() < 0.6;
    const v = two ? p * s * s / (p * s * s + (1 - p) * f * f) : p * s / (p * s + (1 - p) * f);
    return { m: [two ? 'bayes2' : 'bayes'], text: `A condition has prevalence ${pct(p)}. A test has sensitivity ${pct(s)} and false-positive rate ${pct(f)}.${two ? ' Two test results are independent given true status. Find P(condition | two positives).' : ' Find P(condition | one positive).'}`,
      val: v, ans: f4(v), steps: two ? `<p>${p}(${s})² / [${p}(${s})² + ${f2(1 - p)}(${f})²] = <b>${f4(v)}</b>.</p>` : `<p>${p}(${s}) / [${p}(${s}) + ${f2(1 - p)}(${f})] = <b>${f4(v)}</b>.</p>` };
  } };
  G.prodcases = { name: 'Exactly one of three', gen() {
    const p = [R(10, 35), R(10, 35), R(10, 35)].map((x) => x / 100), q = p.map((x) => 1 - x);
    const one = p[0] * q[1] * q[2] + q[0] * p[1] * q[2] + q[0] * q[1] * p[2], al = 1 - q[0] * q[1] * q[2];
    return { m: ['prod_cases', 'condratio'], text: `Three independent components fail with probabilities ${p.join(', ')}. Given at least one fails, find P(exactly one fails).`,
      val: one / al, ans: f4(one / al), steps: `<p>P(≥1) = 1 − ${q.map(f2).join('·')} = ${f4(al)}. P(exactly 1) = ${f4(one)}. Ratio <b>${f4(one / al)}</b>.</p>` };
  } };
  G.solven = { name: 'Smallest n', gen() {
    const p = pick([0.01, 0.02, 0.03, 0.04, 0.05, 0.08, 0.1]), x = pick([0.9, 0.95, 0.99]);
    const v = Math.ceil(Math.log(1 - x) / Math.log(1 - p));
    return { m: ['solve_n'], text: `Each item is defective with probability ${p}, independently. Smallest n so P(at least one defect among n) ≥ ${x}?`,
      val: v, ans: String(v), tol: 0, steps: `<p>n ≥ ln(${f2(1 - x)})/ln(${1 - p}) = ${f2(Math.log(1 - x) / Math.log(1 - p))} → <b>${v}</b>.</p>` };
  } };
  G.condbin = { name: 'Conditional binomial', gen() {
    const n = R(4, 12), p = R(10, 80) / 100, k = R(1, 2);
    const num = Math.random() < 0.5 ? n : k + 1;
    let a = 0, b = 0;
    for (let i = k; i <= n; i++) b += bin(n, p, i);
    if (num === n) a = bin(n, p, n); else a = bin(n, p, k + 1);
    const txt = num === n ? `all ${n} succeed` : `exactly ${k + 1} succeed`;
    return { m: ['condratio', 'binom'], text: `${n} independent uploads each succeed with probability ${p}. Given at least ${k} succeed, find P(${txt}).`,
      val: a / b, ans: f4(a / b), steps: `<p>Numerator ${f4(a)}. P(X ≥ ${k}) = 1 − ${k === 1 ? 'P(0)' : 'P(0) − P(1)'} = ${f4(b)}. Ratio <b>${f4(a / b)}</b>.</p>` };
  } };
  G.geomcond = { name: 'Geometric window', gen() {
    const p = R(8, 40) / 100, q = 1 - p;
    if (Math.random() < 0.5) {
      const s = R(3, 8), a = s + R(2, 4), b = a + R(1, 3), v = Math.pow(q, a - s - 1) - Math.pow(q, b - s);
      return { m: ['memoryless', 'geom'], text: `Attempts succeed independently with probability ${p}. X = attempt of first success. Find P(${a} ≤ X ≤ ${b} | X > ${s}).`,
        val: v, ans: f4(v), steps: `<p>Restart: W = X − ${s}, ${a - s} ≤ W ≤ ${b - s}. q${sup(a - s - 1)} − q${sup(b - s)} = <b>${f4(v)}</b>.</p>` };
    }
    const a = R(1, 3), m = a + R(2, 4), v = (Math.pow(q, a) - Math.pow(q, m)) / (1 - Math.pow(q, m));
    return { m: ['geom', 'condratio'], text: `Attempts succeed independently with probability ${p}. X = attempt of first success. Find P(X > ${a} | X ≤ ${m}).`,
      val: v, ans: f4(v), steps: `<p>(q${sup(a)} − q${sup(m)}) / (1 − q${sup(m)}) = <b>${f4(v)}</b>.</p>` };
  } };
  G.pity = { name: 'Pity system', gen() {
    const p = R(3, 12) / 100, N = R(10, 20), s = R(3, N - 3);
    return { m: ['pity'], text: `An item drops with probability ${p} on each of attempts 1–${N - 1}; if not yet dropped it is guaranteed on attempt ${N}. Find P(T = ${N} | T > ${s}).`,
      val: Math.pow(1 - p, N - 1 - s), ans: f4(Math.pow(1 - p, N - 1 - s)), steps: `<p>(${f2(1 - p)})${sup(N - 1)}/(${f2(1 - p)})${sup(s)} = (${f2(1 - p)})${sup(N - 1 - s)} = <b>${f4(Math.pow(1 - p, N - 1 - s))}</b>.</p>` };
  } };
  G.poisson = { name: 'Poisson (scale λ)', gen() {
    const rate = R(12, 50) / 10, mins = pick([15, 20, 30, 40, 45, 90, 120]), l = rate * mins / 60;
    if (Math.random() < 0.5) {
      const k = R(1, 3); let s = 0; for (let i = 0; i < k; i++) s += pois(l, i);
      return { m: ['poisson'], text: `Requests follow a Poisson process at ${rate} per hour. Find P(at least ${k} in the next ${mins} minutes).`,
        val: 1 - s, ans: f4(1 - s), steps: `<p>λ = ${rate}×${mins}/60 = ${f4(l)}. 1 − Σ_{0}^{${k - 1}} = <b>${f4(1 - s)}</b>.</p>` };
    }
    const v = (pois(l, 2) + pois(l, 3)) / (1 - pois(l, 0));
    return { m: ['poisson', 'condratio'], text: `Requests follow a Poisson process at ${rate} per hour. During ${mins} minutes, given at least one request, find P(2 ≤ N ≤ 3).`,
      val: v, ans: f4(v), steps: `<p>λ = ${f4(l)}. (P2 + P3)/(1 − P0) = <b>${f4(v)}</b>.</p>` };
  } };
  G.poisapprox = { name: 'Poisson approximation', gen() {
    const n = pick([500, 800, 900, 1000, 1200, 2000]), p = pick([0.001, 0.0015, 0.002, 0.003]), l = n * p, v = Math.exp(-l) * (1 + l);
    return { m: ['pois_approx'], text: `${n} chips each defective with probability ${p}, independently. Use a Poisson approximation for P(X ≤ 1).`,
      val: v, ans: f4(v), steps: `<p>λ = np = ${f2(l)}. e${sup('−' + f2(l))}(1 + ${f2(l)}) = <b>${f4(v)}</b>.</p>` };
  } };
  G.cdf = { name: 'CDF jumps', gen() {
    const xs = [-2, 0, 3, 7], cut = [R(5, 15), 0, 0]; cut[1] = cut[0] + R(10, 25); cut[2] = cut[1] + R(15, 35);
    const F = cut.map((c) => c / 100), pm = [F[0], F[1] - F[0], F[2] - F[1], 1 - F[2]], c = R(1, 2);
    const y = xs.map((x) => Math.abs(x - c)), th = 2;
    let num = 0, den = 0; xs.forEach((x, i) => { if (x >= 0) { den += pm[i]; if (y[i] <= th) num += pm[i]; } });
    return { m: ['cdf', 'transform', 'condratio'], text: `Discrete X has CDF F(x) = 0 (x < −2), ${F[0]} (−2 ≤ x < 0), ${F[1]} (0 ≤ x < 3), ${F[2]} (3 ≤ x < 7), 1 (x ≥ 7). Y = |X − ${c}|. Find P(Y ≤ 2 | X ≥ 0).`,
      val: num / den, ans: f4(num / den), steps: `<p>Masses: ${xs.map((x, i) => x + ': ' + f2(pm[i])).join(', ')}. Y = ${y.join(', ')}.</p><p>${f2(num)}/${f2(den)} = <b>${f4(num / den)}</b>.</p>` };
  } };
  G.pmf = { name: 'PMF with c', gen() {
    const a = R(1, 3), b = R(0, 2), xs = [0, 1, 2, 3, 4], w = xs.map((x) => a * x + b + 1), s = w.reduce((x, y) => x + y), k = R(2, 3);
    const v = w.filter((_, i) => i >= k).reduce((x, y) => x + y, 0) / s;
    return { m: ['pmf'], text: `P(X = x) = c(${a}x + ${b + 1}) for x ∈ {0,1,2,3,4}. Find P(X ≥ ${k}).`,
      val: v, ans: f4(v), steps: `<p>c·${s} = 1 → c = 1/${s}. Sum of weights for x ≥ ${k} = ${v * s} → <b>${f4(v)}</b>.</p>` };
  } };
  G.pdf = { name: 'PDF c & probability', gen() {
    const L = pick([2, 3, 4]), up = R(1, L - 1) + pick([0, 0.5]);
    const c = 2 / (L * L), v = c * (L * up - up * up / 2);
    return { m: ['pdf_c', 'pdf_prob'], text: `f(x) = c(${L} − x) for 0 ≤ x ≤ ${L}, 0 otherwise. Find P(X ≤ ${up}).`,
      val: v, ans: f4(v), steps: `<p>∫₀^${L} c(${L} − x) dx = c·${L * L / 2} = 1 → c = ${f4(c)}.</p><p>c[${L}x − x²/2]₀^${up} = <b>${f4(v)}</b>.</p>` };
  } };
  G.unif = { name: 'Uniform conditional', gen() {
    const T = R(12, 30), w = R(2, Math.floor(T / 2)), d = R(2, T - w - 1);
    return { m: ['unif'], text: `A bus arrives uniformly between 0 and ${T} minutes. You arrive at minute ${w}; it hasn't come. P(it arrives in the next ${d} minutes)?`,
      val: d / (T - w), ans: `${d}/${T - w} ≈ ${f4(d / (T - w))}`, steps: `<p>Remaining interval length ${T - w} → ${d}/${T - w} = <b>${f4(d / (T - w))}</b>.</p>` };
  } };
  G.normal = { name: 'Normal interval', gen() {
    const mu = R(40, 120), s = R(4, 16), a = mu - R(2, 2 * s), b = mu + R(2, 2 * s);
    const za = +((a - mu) / s).toFixed(2), zb = +((b - mu) / s).toFixed(2), v = PHI(zb) - PHI(za);
    return { m: ['normal'], text: `X ~ Normal(${mu}, ${s}²). Find P(${a} < X < ${b}) using the table (z to 2 dp).`,
      val: v, ans: f4(v), tol: 0.003, steps: `<p>z = (${a}−${mu})/${s} = ${za}, (${b}−${mu})/${s} = ${zb}. Φ(${zb}) − Φ(${za}) = ${PHI(zb)} − ${PHI(za)} = <b>${f4(v)}</b>.</p>` };
  } };
  G.npct = { name: 'Normal percentile', gen() {
    const mu = R(40, 300), s = R(4, 40), t = pick([[0.9, 1.2816, '10%'], [0.95, 1.645, '5%'], [0.975, 1.96, '2.5%'], [0.99, 2.326, '1%']]);
    return { m: ['npercentile'], text: `X ~ Normal(${mu}, ${s}²). Find the threshold exceeded by only ${t[2]} (z = ${t[1]}).`,
      val: mu + t[1] * s, ans: f2(mu + t[1] * s), tol: 0.05, steps: `<p>x = ${mu} + ${t[1]}(${s}) = <b>${f2(mu + t[1] * s)}</b>.</p>` };
  } };
  G.expo = { name: 'Exponential (units!)', gen() {
    const rate = pick([2, 2.4, 3, 4, 6, 1.5]), m1 = pick([5, 10, 15, 20]), m2 = m1 + pick([10, 15, 20]);
    const l = rate / 60, v = Math.exp(-l * m1) - Math.exp(-l * m2);
    return { m: ['expo'], text: `Calls arrive as a Poisson process at ${rate} per hour. Find P(${m1} < T ≤ ${m2}) where T is the wait in minutes.`,
      val: v, ans: f4(v), steps: `<p>λ = ${rate}/60 per min. e${sup('−λ' + m1)} − e${sup('−λ' + m2)} = <b>${f4(v)}</b>.</p>` };
  } };
  G.expmem = { name: 'Exponential memoryless', gen() {
    const l = pick([0.02, 0.05, 0.1, 0.25]), s = R(10, 60), t = R(5, 30), v = Math.exp(-l * t);
    return { m: ['memoryless', 'expo'], text: `T ~ Exponential(${l}) minutes. Find P(T > ${s + t} | T > ${s}).`,
      val: v, ans: f4(v), steps: `<p>Memoryless: e${sup('−' + l + '·' + t)} = <b>${f4(v)}</b>.</p>` };
  } };
  G.evvar = { name: 'E & Var with unknown p', gen() {
    const xs = [-R(2, 6), R(1, 4), R(8, 14)], p = pick([0.1, 0.15, 0.2, 0.25, 0.3]), mid = 0.5;
    const ps = [p, mid, 0.5 - p], E = xs.reduce((s, x, i) => s + x * ps[i], 0), E2 = xs.reduce((s, x, i) => s + x * x * ps[i], 0), v = E2 - E * E;
    return { m: ['var', 'ev'], text: `P(X = ${xs[0]}) = p, P(X = ${xs[1]}) = 0.5, P(X = ${xs[2]}) = 0.5 − p. If E[X] = ${f4(E)}, find Var(X).`,
      val: v, ans: f4(v), tol: 0.01, steps: `<p>Solve mean → p = ${p}. E[X²] = ${f4(E2)}. Var = ${f4(E2)} − ${f4(E)}² = <b>${f4(v)}</b>.</p>` };
  } };
  G.lotus = { name: 'E[g(X)] (LOTUS)', gen() {
    const xs = [1, 2, R(3, 5)], ps = pick([[0.5, 0.3, 0.2], [0.4, 0.4, 0.2], [0.6, 0.25, 0.15]]), c = 2;
    const v = xs.reduce((s, x, i) => s + (x - c) * (x - c) * ps[i], 0);
    return { m: ['lotus'], text: `P(X = ${xs[0]}) = ${ps[0]}, P(X = ${xs[1]}) = ${ps[1]}, P(X = ${xs[2]}) = ${ps[2]}. Penalty g(X) = (X − ${c})². Find E[g(X)].`,
      val: v, ans: f4(v), steps: `<p>${xs.map((x, i) => `${(x - c) ** 2}(${ps[i]})`).join(' + ')} = <b>${f4(v)}</b>.</p>` };
  } };
  G.lin = { name: 'Linear transform', gen() {
    const a = R(2, 10), b = R(2, 4), mx = R(5, 20), vx = R(2, 9), c = mx - R(-3, 3);
    const v = vx + (mx - c) * (mx - c);
    return { m: ['lin'], text: `Y = ${a} + ${b}X with E[Y] = ${a + b * mx} and Var(Y) = ${b * b * vx}. Find E[(X − ${c})²].`,
      val: v, ans: String(v), tol: 0, steps: `<p>E[X] = ${mx}, Var(X) = ${vx}. E[(X−${c})²] = ${vx} + (${mx}−${c})² = <b>${v}</b>.</p>` };
  } };
  G.varsum = { name: 'Var of a sum', gen() {
    const vx = R(2, 16), vy = R(2, 16), cv = R(-3, 4), a = pick([1, 2, 3]);
    const v = a * a * vx + vy + 2 * a * cv;
    return { m: ['varsum'], text: `Var(X) = ${vx}, Var(Y) = ${vy}, Cov(X, Y) = ${cv}. Find Var(${a === 1 ? '' : a}X + Y).`,
      val: v, ans: String(v), tol: 0, steps: `<p>${a * a}·${vx} + ${vy} + 2·${a}·(${cv}) = <b>${v}</b>.</p>` };
  } };
  G.contev = { name: 'Continuous E[X]', gen() {
    const k = R(1, 3), L = R(1, 3), c = (k + 1) / Math.pow(L, k + 1), E = c * Math.pow(L, k + 2) / (k + 2);
    return { m: ['cont_ev', 'pdf_c'], text: `f(x) = c·x${k > 1 ? sup(k) : ''} for 0 ≤ x ≤ ${L}. Find E[X].`,
      val: E, ans: f4(E), steps: `<p>c = ${k + 1}/${L}${sup(k + 1)}. E[X] = c·${L}${sup(k + 2)}/${k + 2} = (${k + 1}/${k + 2})·${L} = <b>${f4(E)}</b>.</p>` };
  } };
  return G;
})();
