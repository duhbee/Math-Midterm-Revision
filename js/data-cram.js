/* Cram mode: the 10 question shapes that cover almost every quiz / homework question,
   ordered by how often they appeared. Each has a trigger, a skeleton (first lines to write) and a past example. */
window.CRAM = [
  { n: 1, title: 'Conditional ratio ("given at least…")', m: ['condratio', 'prod_cases', 'cond'], any: ['condratio'], ex: 'Quiz 1 Q4',
    trigger: '"Given that at least one / at least k / within n attempts / X ≥ …, what is the probability that exactly / all / between…"',
    skel: `P(A | B) = P(A ∩ B) / P(B)
         = [target that is INSIDE the condition] / [the condition]
Denominator "at least 1" = 1 − P(0);  "at least 2" = 1 − P(0) − P(1)`,
    hook: 'Half of Quiz 1 was this. If an option equals just the top or just the bottom, you are not finished.' },
  { n: 2, title: 'Bayes tree', m: ['bayes', 'bayes2'], ex: 'Pop Quiz W2 Q5',
    trigger: 'Shares (50%, 30%, 20%) + rates per source + "came from…" / prevalence + sensitivity + false-positive + "given positive"',
    skel: `branch i = P(source i) × P(evidence | source i)   (× more stages if any)
P(evidence) = sum of branches
P(source k | evidence) = branch k / sum
Two tests: square each likelihood  →  p·s² / (p·s² + (1−p)·f²)`,
    hook: 'Draw the tree. Multiply along, add across, divide.' },
  { n: 3, title: 'Poisson — scale λ first', m: ['poisson', 'pois_approx'], ex: 'HW3 Q3',
    trigger: '"rate of 4.8 per hour" + "during the next 25 minutes"  ·  huge n, tiny p, "Poisson approximation"',
    skel: `λ = rate × time  (same units!)      or  λ = n·p
P(X = k) = e^(−λ) λ^k / k!
P(X ≥ 3) = 1 − e^(−λ)(1 + λ + λ²/2)`,
    hook: 'Never use the hourly rate for a 90-minute window.' },
  { n: 4, title: 'Geometric: first success, memoryless, pity', m: ['geom', 'memoryless', 'pity'], ex: 'Quiz 1 Q7',
    trigger: '"attempt number of the first success" · "already failed" · "given X > 6" · "guaranteed on attempt 15"',
    skel: `q = 1 − p
P(X > n) = qⁿ          P(a ≤ X ≤ b) = q^(a−1) − q^b
Given X > s: subtract s and restart (memoryless)
Pity at N: P(T = N) = q^(N−1)   (no ×p)`,
    hook: 'Everything is powers of q. Count how many attempts must FAIL.' },
  { n: 5, title: 'CDF table → PMF → Y = g(X)', m: ['cdf', 'transform', 'pmf'], ex: 'Quiz 1 Q8',
    trigger: '"A discrete random variable has CDF F(x) = {0, 0.09, 0.29…}" · "Define Y = |X − 1|" · "P(X = x) = c(…)"',
    skel: `jump table:  x  | P(X = x) = F(x) − F(previous)
add column   g(x)
answer = add P's that fit (÷ the condition's P's if "given")
PMF with c:  sum of all = 1  →  c`,
    hook: 'Never read F(x) as P(X = x). Make the jump table first, always.' },
  { n: 6, title: 'Inclusion–exclusion (Venn)', m: ['ie', 'sets'], ex: 'HW1 Q9',
    trigger: 'Group sizes with "both", "all three"; asks "none", "either", "exactly one"',
    skel: `union = A + B + C − AB − AC − BC + ABC
none = total − union
A only = A − AB − AC + ABC   (same for B, C; add for "exactly one")`,
    hook: 'Plus singles, minus pairs, plus triple.' },
  { n: 7, title: 'Counting with a restriction', m: ['block', 'compl_count', 'perm', 'comb', 'cases', 'mult'], ex: 'HW1 Q4',
    trigger: '"must be together" · "must NOT be next to" · "refuse to appear together" · "lineup" vs "team" · "at least one of each type"',
    skel: `together:      (n − k + 1)! × k!
not together:  total − together
order matters → P(n,r) = n!/(n−r)!     order doesn't → C(n,r)
"at least one of each": list every case, add`,
    hook: 'Swap two people — different outcome? Then order matters.' },
  { n: 8, title: 'Normal: z-score / percentile', m: ['normal', 'npercentile'], ex: 'HW4 Q6',
    trigger: '"Normal(70, 8²)" + range → probability · "exceeded by only 2.5%" / "90th percentile" → value',
    skel: `z = (x − μ)/σ      (σ = √variance: N(70, 8²) → σ = 8)
P(X < x) = Φ(z)   P(X > x) = 1 − Φ(z)   Φ(−z) = 1 − Φ(z)
percentile: x = μ + z·σ`,
    hook: 'Use the table on the formula sheet. Round z to 2 dp.' },
  { n: 9, title: 'Exponential / uniform waiting time', m: ['expo', 'unif'], ex: 'HW4 Q8',
    trigger: '"waiting time until the next…" at a rate · "arrives uniformly between 8:00 and 8:18"',
    skel: `Exponential: P(T > t) = e^(−λt)   P(a < T ≤ b) = e^(−λa) − e^(−λb)
  convert units first: 2.4/hour, 20 min = 1/3 h
  given T > s: e^(−λ·extra)  (memoryless)
Uniform: P = favourable length / total length
  given not yet: total = what is LEFT`,
    hook: 'Exponential forgets; uniform does not.' },
  { n: 10, title: 'Expectation toolkit', m: ['ev', 'var', 'lotus', 'lin', 'varsum', 'pdf_c', 'pdf_prob', 'cont_ev', 'cdf_pdf', 'disttable'], ex: 'HW5 Q6',
    trigger: 'PMF table + E[X] / Var · "penalty (X − 2)²" · "Y = 5 + 2X" · "Cov" · density "c(1 + x)"',
    skel: `E[X] = Σ x·p      E[g(X)] = Σ g(x)·p   (NOT g(E[X]))
Var = E[X²] − (E[X])²
E[a + bX] = a + bE[X]     Var(a + bX) = b²·Var(X)
Var(X + Y) = VarX + VarY + 2Cov
density: ∫ f = 1 → c;  E[X] = ∫ x f;  P = ∫ over interval`,
    hook: 'Named distribution? Mean/variance are on the formula sheet.' }
];

window.PLAN = [
  ['b1', 'Block 1 · 90 min', 'Read cards 1–5. Cover the skeleton, say it out loud, check. Then press "Do 3 now" on each.'],
  ['b2', 'Block 2 · 90 min', 'Same for cards 6–10.'],
  ['b3', 'Block 3 · 30 min', 'Spot it: keep going until your last 20 are mostly right.'],
  ['b4', 'Block 4 · 60 min', 'Drills on your 3 weakest cards (the % on each card shows which).'],
  ['b5', 'Block 5 · 90 min', 'Mock Paper A, timed. Then read the review: by method first, then the steps.'],
  ['b6', 'Evening · 30 min', 'Redo your mistakes (Progress → Practise my mistakes). Read only the Trap lines. Sleep.'],
  ['b7', 'Exam morning · 20 min', 'Say the 10 skeletons once. 10 Spot-it rounds. Stop — eat, go to E2 early.']
];

window.ROUTINE = `<ol class="steps">
<li><b>15 s:</b> name the method. Which of the 10 cards is it?</li>
<li><b>Write the skeleton</b> on scrap paper before any number.</li>
<li><b>Fill in numbers.</b> Units (λ, minutes vs hours). σ not σ².</li>
<li><b>Check the options:</b> if one equals only a piece (just the top, just P(at least one)), finish the ratio. "None of These" is often right.</li>
<li><b>Stuck after 6 min?</b> Flag it, move on, come back.</li></ol>`;
