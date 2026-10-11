/* Question bank. Every question carries:
   m    – method ids (first = the main method, rest = the "chain" you also need)
   cue  – exact phrases in the text that give the method away (highlighted in Spot the Method)
   kind – 'mcq' (options, like the Moodle quiz) or 'num' (type a number; fractions like 4/7 accepted)
   set  – quiz | pop | hw | rev | tut | lec  (where it came from) */
window.QS = [];
(function () {
  const sup = (x) => '<sup>' + x + '</sup>';
  const ex = (x) => 'e' + sup(x);
  const NONE = 'None of These';
  let n = 0;
  function Q(src, set, wk, m, cue, text, ans, wrong, steps) {
    QS.push({ id: 'q' + (++n), kind: 'mcq', src, set, wk, m, cue, text, ans, wrong, steps });
  }
  function N(src, set, wk, m, cue, text, val, shown, steps, tol) {
    QS.push({ id: 'q' + (++n), kind: 'num', src, set, wk, m, cue, text, val, ans: shown, tol: tol == null ? 0.002 : tol, steps });
  }

  /* ======================= QUIZ 1 (Week 4, covers W1–3) ======================= */
  Q('Quiz 1 Q1', 'quiz', 'w3', ['poisson', 'condratio'], ['Poisson process at rate 2.8 per hour', 'During 90 minutes', 'given that at least one request occurs'],
    'Requests follow a Poisson process at rate 2.8 per hour. During 90 minutes, given that at least one request occurs, what is the probability that between two and four requests occur, inclusive?',
    '0.520', ['0.584', '0.134', '0.512', NONE],
    `<p><b>Scale λ:</b> 90 min = 1.5 h → λ = 2.8 × 1.5 = 4.2.</p><p><b>Ratio:</b> P(2 ≤ N ≤ 4 | N ≥ 1) = [P(2)+P(3)+P(4)] / [1 − P(0)].</p><p>P(0) = ${ex('−4.2')} = 0.0150, P(2) = 0.1323, P(3) = 0.1852, P(4) = 0.1944 → 0.5119 / 0.9850 = <b>0.520</b>.</p><p>0.512 is the trap: you forgot to divide by P(N ≥ 1).</p>`);
  Q('Quiz 1 Q2', 'quiz', 'w2', ['bayes2'], ['prevalence 16%', 'sensitivity 85%', 'false-positive rate 14%', 'two test results are independent', 'given two positive results'],
    'A condition has prevalence 16%. A test has sensitivity 85% and false-positive rate 14%. Conditional on a person\'s true status, two test results are independent. What is the probability that the person has the condition given two positive results?',
    '0.875', ['0.536', '0.116', '0.974', NONE],
    `<p>Two conditionally independent tests → <b>square the likelihoods</b>.</p><p>P(++|D) = 0.85² = 0.7225, P(++|Dᶜ) = 0.14² = 0.0196.</p><p>P(D|++) = 0.16(0.7225) / [0.16(0.7225) + 0.84(0.0196)] = 0.1156 / 0.13206 = <b>0.875</b>.</p><p>0.536 is one positive test only (one Bayes step).</p>`);
  Q('Quiz 1 Q3', 'quiz', 'w2', ['cond_count', 'comb'], ['14 red and 9 blue', 'drawn without replacement', 'Given that the sample contains both colors'],
    'A box contains 14 red and 9 blue tokens. Three tokens are drawn without replacement. Given that the sample contains both colors, what is the probability that exactly two tokens are red?',
    '0.619', ['0.462', '0.747', '0.381', NONE],
    `<p>"Both colours" with 3 tokens = (2R,1B) or (1R,2B).</p><p>#(2R1B) = C(14,2)·C(9,1) = 91·9 = 819. #(1R2B) = 14·C(9,2) = 14·36 = 504.</p><p>P = 819 / (819 + 504) = 819/1323 = <b>0.619</b>. (C(23,3) cancels.)</p>`);
  Q('Quiz 1 Q4', 'quiz', 'w3', ['binom', 'condratio'], ['Bin(12, 0.16)', '| X ≥ 2'],
    'Let X ~ Bin(12, 0.16). Find P(2 ≤ X ≤ 4 | X ≥ 2).',
    '0.948', ['0.564', '0.451', '0.497', NONE],
    `<p>Numerator P(2 ≤ X ≤ 4) = P2 + P3 + P4 = 0.2955 + 0.1876 + 0.0804 = 0.5635.</p><p>Denominator P(X ≥ 2) = 1 − 0.84¹² − 12(0.16)(0.84)¹¹ = 1 − 0.1234 − 0.2821 = 0.5945.</p><p>0.5635 / 0.5945 = <b>0.948</b>. (0.564 = numerator only.)</p>`);
  Q('Quiz 1 Q5', 'quiz', 'w2', ['prod_cases', 'condratio'], ['Three independent components fail with probabilities', 'Given that at least one component fails', 'exactly one component fails'],
    'Three independent components fail with probabilities 0.31, 0.28 and 0.3. Given that at least one component fails, what is the probability that exactly one component fails?',
    NONE, ['0.285', '0.441', '0.0399', '0.652'],
    `<p>P(none) = 0.69·0.72·0.70 = 0.34776 → P(≥ 1) = 0.65224.</p><p>P(exactly one) = 0.31·0.72·0.70 + 0.69·0.28·0.70 + 0.69·0.72·0.30 = 0.15624 + 0.13524 + 0.14904 = 0.44052.</p><p>Ratio = 0.44052 / 0.65224 = <b>0.675</b> → not listed → <b>None of These</b>.</p><p>Trap: 0.441 is P(exactly one) and 0.652 is P(at least one) — both are pieces, not the answer.</p>`);
  Q('Quiz 1 Q6', 'quiz', 'w3', ['geom', 'condratio'], ['attempt number of the first success', 'within 5 attempts', 'P(X > 2 | X ≤ 5)'],
    'Independent attempts succeed with probability 0.35. Let X be the attempt number of the first success. Given that the first success occurs within 5 attempts, what is P(X > 2 | X ≤ 5)?',
    '0.347', ['0.306', '0.423', '0.653', NONE],
    `<p>q = 0.65. P(2 < X ≤ 5) = P(X > 2) − P(X > 5) = q² − q⁵ = 0.4225 − 0.1160 = 0.3065.</p><p>P(X ≤ 5) = 1 − q⁵ = 0.8840.</p><p>0.3065 / 0.8840 = <b>0.347</b>. (0.306 = numerator only — forgot to divide.)</p>`);
  Q('Quiz 1 Q7', 'quiz', 'w3', ['memoryless', 'geom'], ['attempt number of the first success', 'Given X > 6', 'P(10 ≤ X ≤ 12 | X > 6)'],
    'Independent attempts succeed with probability 0.15. Let X be the attempt number of the first success. Given X > 6, find P(10 ≤ X ≤ 12 | X > 6).',
    '0.237', ['0.386', '0.145', '0.170', NONE],
    `<p>Memoryless: restart after attempt 6, W = X − 6 ~ Geo(0.15). 10 ≤ X ≤ 12 ⇔ 4 ≤ W ≤ 6.</p><p>P(4 ≤ W ≤ 6) = q³ − q⁶ = 0.85³ − 0.85⁶ = 0.6141 − 0.3771 = <b>0.237</b>.</p>`);
  Q('Quiz 1 Q8', 'quiz', 'w3', ['cdf', 'transform', 'condratio'], ['discrete random variable has CDF', 'Define Y = |X − 1|', 'P(Y ≤ 2 | X ≥ 0)'],
    'A discrete random variable has CDF F(x) = 0 for x < −2; 0.09 for −2 ≤ x < 0; 0.29 for 0 ≤ x < 3; 0.61 for 3 ≤ x < 7; 1 for x ≥ 7. Define Y = |X − 1|. Find P(Y ≤ 2 | X ≥ 0).',
    '0.571', ['0.352', '0.429', '0.520', NONE],
    `<p><b>Jumps → PMF:</b> P(−2) = 0.09, P(0) = 0.20, P(3) = 0.32, P(7) = 0.39.</p><p>Y values: X = 0 → 1, X = 3 → 2, X = 7 → 6.</p><p>Given X ≥ 0 (mass 0.91): Y ≤ 2 for X = 0, 3 → 0.52.</p><p>0.52 / 0.91 = <b>0.571</b>. (0.429 is Y > 2.)</p>`);
  Q('Quiz 1 Q9', 'quiz', 'w1', ['block'], ['12 distinct books', 'must appear consecutively', 'in any order within their block'],
    'A shelf contains 12 distinct books. A designated set of 3 books must appear consecutively, but those designated books may be arranged in any order within their block. How many arrangements are possible?',
    NONE, ['2177280', '10886400', '479001600', '3628800'],
    `<p>Glue the 3 into one block → 10 objects → 10! ways. Inside the block 3! ways.</p><p>10! × 3! = 3,628,800 × 6 = <b>21,772,800</b> → not listed → <b>None of These</b>.</p><p>3,628,800 = 10! (forgot 3!). 479,001,600 = 12! (no restriction).</p>`);
  Q('Quiz 1 Q10', 'quiz', 'w1', ['ie'], ['Among 144 students', 'use both A and B', 'all three', 'none of the platforms'],
    'Among 144 students, 52 use platform A, 48 use B, and 54 use C. Also, 14 use both A and B, 15 use both A and C, 19 use both B and C, and 5 use all three. How many use none of the platforms?',
    '33', ['111', '43', '38', NONE],
    `<p>Union = 52+48+54 − 14−15−19 + 5 = 111. None = 144 − 111 = <b>33</b>.</p>`);

  /* ======================= POP QUIZ WEEK 2 ======================= */
  Q('Pop Quiz W2 Q1', 'pop', 'w2', ['indep'], ['Two independent fair coins', 'both coins show the same result', 'Which statement is correct'],
    'Two independent fair coins are tossed. Let A be the event that the first coin is heads, B the event that the second coin is heads, and C the event that both coins show the same result. Which statement is correct?',
    'A, B, and C are pairwise independent but not mutually independent.', ['Only A and B are independent.', 'A, B, and C are mutually independent.', 'No pair among A, B, and C is independent.', NONE],
    `<p>P(A) = P(B) = P(C) = 1/2. A∩B = HH → 1/4 = P(A)P(B). A∩C = HH → 1/4 ✓. B∩C = HH → 1/4 ✓ — pairwise independent.</p><p>A∩B∩C = HH → 1/4 ≠ 1/8 → <b>not mutually independent</b>.</p>`);
  Q('Pop Quiz W2 Q2', 'pop', 'w3', ['cdf', 'condratio'], ['discrete random variable X has CDF', 'X ∈ {1, 4}', 'X ≥ 1'],
    'A discrete random variable X has CDF F(x) = 0 for x < 0; 0.10 for 0 ≤ x < 1; 0.35 for 1 ≤ x < 2; 0.80 for 2 ≤ x < 4; 1 for x ≥ 4. What is P(X ∈ {1, 4} | X ≥ 1)?',
    NONE, ['0.45', '0.55', '0.40', '0.25'],
    `<p>Jumps: P(0) = .10, P(1) = .25, P(2) = .45, P(4) = .20.</p><p>(0.25 + 0.20) / 0.90 = <b>0.50</b> → <b>None of These</b>.</p>`);
  Q('Pop Quiz W2 Q3', 'pop', 'w2', ['condratio', 'binom'], ['Four independent uploads succeed with probability 0.75', 'Given that at least three uploads succeed', 'all four succeed'],
    'Four independent uploads succeed with probability 0.75 each. Given that at least three uploads succeed, what is the probability that all four succeed?',
    '3/7', ['3/8', '1/4', '2/5', NONE],
    `<p>All four ⊂ at least three. P(4) = 0.75⁴. P(3) = 4(0.75)³(0.25).</p><p>0.75⁴ / [0.75⁴ + 4·0.75³·0.25] = 0.75 / (0.75 + 1) = <b>3/7</b>.</p>`);
  Q('Pop Quiz W2 Q4', 'pop', 'w2', ['solve_n', 'comp_prob'], ['defective component with probability 0.03', 'smallest number n', 'at least one defect is at least 0.90'],
    'A manufacturing process produces a defective component with probability 0.03, independently. What is the smallest number n of components that must be inspected so that the probability of finding at least one defect is at least 0.90?',
    '76', ['77', '75', '90', NONE],
    `<p>1 − 0.97ⁿ ≥ 0.90 → 0.97ⁿ ≤ 0.10 → n ≥ ln 0.1 / ln 0.97 = 75.6 → round up: <b>76</b>.</p>`);
  Q('Pop Quiz W2 Q5', 'pop', 'w2', ['bayes'], ['lines A, B, and C for 50%, 30%, and 20%', 'defect rates are 2%, 4%, and 5%', 'detects an actual defect with probabilities', 'came from line C'],
    'A factory uses lines A, B, and C for 50%, 30%, and 20% of output. Their defect rates are 2%, 4%, and 5%. A scanner detects an actual defect with probabilities 90%, 80%, and 70% on the three lines, respectively. A random item is defective and detected. What is the probability it came from line C?',
    '35/128', ['7/20', '7/25', '5/16', NONE],
    `<p>Each branch = share × defect × detect: A .5·.02·.9 = .009, B .3·.04·.8 = .0096, C .2·.05·.7 = .007.</p><p>Total .0256. P(C | defective & detected) = .007/.0256 = <b>35/128</b>.</p>`);

  /* ======================= POP QUIZ WEEK 3 ======================= */
  Q('Pop Quiz W3 Q1', 'pop', 'w3', ['pmf', 'binthm'], ['P(X = x) = c·C(4, x)·2ˣ', 'What is P(X ≥ 3)'],
    'A discrete random variable X has PMF P(X = x) = c·C(4, x)·2ˣ for x ∈ {0, 1, 2, 3, 4}, and 0 otherwise. What is P(X ≥ 3)?',
    '16/27', ['32/81', '65/81', '16/81', NONE],
    `<p>Σ C(4,x)2ˣ = (1+2)⁴ = 81 → c = 1/81.</p><p>P(3) = 4·8/81 = 32/81, P(4) = 16/81 → 48/81 = <b>16/27</b>.</p>`);
  Q('Pop Quiz W3 Q2', 'pop', 'w3', ['cdf', 'transform', 'condratio'], ['The CDF of a discrete random variable', 'Define Y = |X − 1|', 'P(Y ≥ 2 | X ≥ 0)'],
    'The CDF of a discrete random variable X is F(x) = 0 for x < −1; 0.10 for −1 ≤ x < 0; 0.35 for 0 ≤ x < 2; 0.80 for 2 ≤ x < 5; 1 for x ≥ 5. X only takes values −1, 0, 2 and 5. Define Y = |X − 1|. What is P(Y ≥ 2 | X ≥ 0)?',
    '2/9', ['1/5', '7/9', '1/3', NONE],
    `<p>Jumps: P(−1) = .10, P(0) = .25, P(2) = .45, P(5) = .20.</p><p>Y: X = 0 → 1, X = 2 → 1, X = 5 → 4. Given X ≥ 0 (mass 0.90), Y ≥ 2 only when X = 5.</p><p>0.20 / 0.90 = <b>2/9</b>.</p>`);
  Q('Pop Quiz W3 Q3', 'pop', 'w3', ['binom', 'condratio'], ['15 independently deployed software patches', 'Given that at least two patches fail', 'exactly two patches fail'],
    'Each of 15 independently deployed software patches fails with probability 0.10. Given that at least two patches fail, what is the probability that exactly two patches fail?',
    'C(15,2)(0.1)²(0.9)¹³ / [1 − (0.9)¹⁵ − 15(0.1)(0.9)¹⁴]', ['C(15,2)(0.1)²(0.9)¹³', 'C(15,2)(0.1)²(0.9)¹³ / [1 − (0.9)¹⁵]', 'C(15,2)(0.1)²(0.9)¹³ / Σ_{k=0}^{2} C(15,k)(0.1)ᵏ(0.9)^{15−k}', NONE],
    `<p>X ~ Bin(15, 0.1). Numerator P(X = 2). Denominator P(X ≥ 2) = 1 − P(0) − P(1).</p><p>Value ≈ 0.2669 / 0.4510 = 0.592.</p>`);
  Q('Pop Quiz W3 Q4', 'pop', 'w3', ['pity', 'memoryless'], ['probability 0.08 on each of the first 14 attempts', 'guaranteed on attempt 15', 'P(T = 15 | T > 10)'],
    'A reward appears independently with probability 0.08 on each of the first 14 attempts. If it has not appeared earlier, it is guaranteed on attempt 15. Let T be the attempt on which it first appears. Given that T > 10, what is P(T = 15 | T > 10)?',
    '(0.92)⁴', ['(0.92)⁴(0.08)', '(0.92)⁵', '1 − (0.92)⁴', NONE],
    `<p>T = 15 ⇔ attempts 1–14 all fail: P = 0.92¹⁴ (no ×0.08 — attempt 15 is certain).</p><p>P(T > 10) = 0.92¹⁰. Ratio = 0.92¹⁴ / 0.92¹⁰ = <b>(0.92)⁴</b> (attempts 11–14 fail).</p>`);
  Q('Pop Quiz W3 Q5', 'pop', 'w3', ['pois_approx', 'condratio'], ['900 independently transmitted packets', 'lost with probability 0.002', 'Using a Poisson approximation', 'P(X = 2 | X ≥ 1)'],
    'Each of 900 independently transmitted packets is lost with probability 0.002. Let X be the number of lost packets. Using a Poisson approximation, estimate P(X = 2 | X ≥ 1).',
    `${ex('−1.8')}(1.8)²/2 ÷ (1 − ${ex('−1.8')})`, [`${ex('−1.8')}(1.8)²/2 ÷ [1 − ${ex('−1.8')}(1 + 1.8)]`, `${ex('−0.002')}(0.002)²/2 ÷ (1 − ${ex('−0.002')})`, `${ex('−1.8')}(1.8)²/2`, NONE],
    `<p>λ = np = 900 × 0.002 = 1.8.</p><p>P(X = 2)/P(X ≥ 1) = [${ex('−1.8')}1.8²/2] / (1 − ${ex('−1.8')}) ≈ 0.321.</p>`);

  /* ======================= HOMEWORK WEEK 1 ======================= */
  Q('HW1 Q1', 'hw', 'w1', ['comp_prob', 'binom'], ['independently contains a secret figure with probability 1/72', 'at least two secret figures', 'opening 72 boxes'],
    'Each blind box independently contains a secret figure with probability 1/72. Which expression gives the probability of obtaining at least two secret figures after opening 72 boxes?',
    `1 − (71/72)${sup(72)} − (71/72)${sup(71)}`, [`1 − (71/72)${sup(72)}`, `(1/72)²(71/72)${sup(70)}`, `1 − 72(1/72)(71/72)${sup(71)}`, NONE],
    `<p>Complement of "at least two" = zero or exactly one.</p><p>P(0) = (71/72)⁷², P(1) = 72·(1/72)(71/72)⁷¹ = (71/72)⁷¹.</p><p>Answer: 1 − (71/72)⁷² − (71/72)⁷¹.</p>`);
  Q('HW1 Q2', 'hw', 'w1', ['cases', 'comb'], ['5 attackers, 4 defenders, and 3 support', 'at least one hero of each type', 'designate one selected attacker as captain'],
    'A roster has 5 attackers, 4 defenders, and 3 support heroes. A team contains 5 heroes, must include at least one hero of each type, and must designate one selected attacker as captain. How many distinct team-and-captain configurations are possible?',
    '1,130', ['792', '590', '2,950', NONE],
    `<p>Cases (a,d,s): (1,1,3) 5·4·1·1 = 20, (1,2,2) 5·6·3·1 = 90, (1,3,1) 5·4·3·1 = 60, (2,1,2) 10·4·3·2 = 240, (2,2,1) 10·6·3·2 = 360, (3,1,1) 10·4·3·3 = 360.</p><p>(The last factor is the a captain choices.) Total <b>1,130</b>.</p>`);
  Q('HW1 Q3', 'hw', 'w1', ['axioms'], ['Ω = {a, b, c, d}', 'P(A ∩ B) = 0.27', 'Which statement must be true'],
    'Let Ω = {a, b, c, d}, A = {a, b}, and B = {b, c}. A probability measure satisfies P(A) = 0.62, P(B) = 0.55, P(A ∩ B) = 0.27, and P({d}) = 0.10. Which statement must be true?',
    'P({a, c}) = 0.63', ['P({a}) = 0.27', 'P({c}) = 0.45', 'P({b, d}) = 0.65', NONE],
    `<p>A∩B = {b} → P(b) = 0.27. P(a) = 0.62 − 0.27 = 0.35, P(c) = 0.55 − 0.27 = 0.28.</p><p>P({a,c}) = <b>0.63</b>.</p>`);
  Q('HW1 Q4', 'hw', 'w1', ['compl_count', 'block'], ['Seven distinct heroes are arranged in a queue', 'must not stand next to each other'],
    'Seven distinct heroes are arranged in a queue. Two particular healers must not stand next to each other. How many valid arrangements are possible?',
    '3,600', ['2,520', '4,320', '1,440', NONE],
    `<p>All: 7! = 5,040. Adjacent (block): 6!·2! = 1,440.</p><p>5,040 − 1,440 = <b>3,600</b>.</p>`);
  Q('HW1 Q5', 'hw', 'w1', ['perm'], ['ordered three-hero lineups', 'C(6,3) = 20', 'Which evaluation'],
    'A student counts ordered three-hero lineups from 6 distinct heroes as C(6,3) = 20. Which evaluation of the student\'s method is correct?',
    'The method ignores order; each selected team has 3! orders, so the answer is 20 × 6 = 120.', ['The method should use 6³ because a hero may occupy any of the three positions.', 'The method is correct because the same three heroes form the same lineup in every order.', 'The method overcounts each lineup by 3!, so the answer is 20/6.', NONE],
    `<p>"Ordered lineup" → permutation. P(6,3) = C(6,3)·3! = <b>120</b>. 6³ allows repeats (wrong).</p>`);
  Q('HW1 Q6', 'hw', 'w1', ['comp_prob'], ['only the larger of the two scores is recorded', 'either 5 or 6'],
    'Two fair six-sided dice are rolled, and only the larger of the two scores is recorded. What is the probability that the recorded value is either 5 or 6?',
    '5/9', ['1/3', '4/9', '2/3', NONE],
    `<p>max ≤ 4 ⇔ both ≤ 4: (4/6)² = 4/9. So P(max ∈ {5,6}) = 1 − 4/9 = <b>5/9</b>.</p><p>1/3 assumes the six maxima are equally likely — they aren't.</p>`);
  Q('HW1 Q7', 'hw', 'w1', ['binthm'], ['coefficient of x²', '(1 + x)⁶(1 − x)⁴'],
    'What is the coefficient of x² in (1 + x)⁶(1 − x)⁴?',
    NONE, ['3', '−9', '21', '45'],
    `<p>x² = x²·1 + x·x + 1·x²: C(6,2) − C(6,1)C(4,1) + C(4,2) = 15 − 24 + 6 = −3 → <b>None of These</b>.</p>`);
  Q('HW1 Q8', 'hw', 'w1', ['sets', 'ie'], ['recorded as H (hit) or M (miss)', 'first attack hits', 'exactly two of the four attacks hit', 'Aᶜ ∪ B'],
    'Four game attacks are recorded as H (hit) or M (miss). Let A be the event that the first attack hits, and let B be the event that exactly two of the four attacks hit. How many outcomes belong to Aᶜ ∪ B?',
    '11', ['10', '8', '9', NONE],
    `<p>|Aᶜ| = 2³ = 8 (first is M). |B| = C(4,2) = 6. |Aᶜ ∩ B| = first M, two H among last three = C(3,2) = 3.</p><p>8 + 6 − 3 = <b>11</b>.</p>`);
  Q('HW1 Q9', 'hw', 'w1', ['ie'], ['Among 120 players', 'pairwise overlaps', '12 players earned all three', 'exactly one of the three'],
    'Among 120 players, 68 earned achievement A, 57 earned B, and 49 earned C. The pairwise overlaps are |A ∩ B| = 31, |A ∩ C| = 26, and |B ∩ C| = 22; 12 players earned all three. How many players earned exactly one of the three achievements?',
    '52', ['45', '40', '64', NONE],
    `<p>A only = 68 − 31 − 26 + 12 = 23. B only = 57 − 31 − 22 + 12 = 16. C only = 49 − 26 − 22 + 12 = 13.</p><p>23 + 16 + 13 = <b>52</b>.</p>`);
  Q('HW1 Q10', 'hw', 'w1', ['compl_count', 'perm'], ['ordered lineup of 4 heroes', 'refuse to appear together', 'No hero may be repeated'],
    'An ordered lineup of 4 heroes is formed from 8 distinct heroes. Two particular rival heroes refuse to appear together in the lineup. No hero may be repeated. How many valid lineups are possible?',
    '1,320', ['360', '840', '1,680', NONE],
    `<p>All: P(8,4) = 1,680. Both rivals in: choose 2 of the other 6, arrange 4: C(6,2)·4! = 360.</p><p>1,680 − 360 = <b>1,320</b>.</p>`);

  /* ======================= HOMEWORK WEEK 2 ======================= */
  Q('HW2 Q1', 'hw', 'w2', ['condratio', 'binom'], ['on time with probability 0.80', 'Given that at least two packages are on time', 'all three are on time'],
    'Three packages are delivered independently. Each package is on time with probability 0.80. Given that at least two packages are on time, what is the probability that all three are on time?',
    '4/7', ['0.512', '0.896', '0.800', NONE],
    `<p>P(3) = 0.8³ = 0.512. P(≥2) = 3(0.8)²(0.2) + 0.512 = 0.896.</p><p>0.512 / 0.896 = <b>4/7</b>.</p>`);
  Q('HW2 Q2', 'hw', 'w2', ['indep'], ['Events A and B are independent', 'P(A ∪ B) = 0.70'],
    'Events A and B are independent. Suppose P(A) = 0.40 and P(A ∪ B) = 0.70. What is P(B)?',
    '0.50', ['0.30', '0.70', '0.40', NONE],
    `<p>0.70 = 0.40 + P(B) − 0.40P(B) = 0.40 + 0.60P(B) → P(B) = <b>0.50</b>.</p>`);
  Q('HW2 Q3', 'hw', 'w2', ['bayes'], ['P(D) = 0.02', 'P(Positive | D) = 0.90', 'P(D | Positive) = 0.60', 'false-positive rate'],
    'In a screening population, P(D) = 0.02 and P(Positive | D) = 0.90. It is also known that P(D | Positive) = 0.60. What false-positive rate P(Positive | Dᶜ) is consistent with these values?',
    '1.224%', ['2.00%', '4.082%', '0.60%', NONE],
    `<p>Let q = P(Pos | Dᶜ). Bayes: 0.60 = 0.018 / (0.018 + 0.98q).</p><p>0.018 + 0.98q = 0.03 → q = 0.012/0.98 = 0.01224 = <b>1.224%</b>.</p>`);
  Q('HW2 Q4', 'hw', 'w2', ['bayes'], ['clusters A, B, and C with probabilities 0.50, 0.30, and 0.20', 'error rates', 'came from cluster C'],
    'Server requests come from clusters A, B, and C with probabilities 0.50, 0.30, and 0.20. Their error rates are 0.01, 0.02, and 0.05, respectively. Given that a request produced an error, what is the probability it came from cluster C?',
    '10/21', ['5/21', '3/7', '2/7', NONE],
    `<p>P(err) = .5(.01) + .3(.02) + .2(.05) = .005 + .006 + .010 = .021.</p><p>P(C|err) = .010/.021 = <b>10/21</b>.</p>`);
  Q('HW2 Q5', 'hw', 'w2', ['transform', 'binom'], ['number of on-time deliveries among three', 'Define Y = (X − 1)²', 'range of Y and P(Y = 1)'],
    'Let X be the number of on-time deliveries among three independent packages, each on time with probability 0.80. Define Y = (X − 1)². Which pair gives the range of Y and P(Y = 1)?',
    'Range {0,1,4}; P(Y = 1) = 0.392', ['Range {0,1,4}; P(Y = 1) = 0.488', 'Range {0,1,4}; P(Y = 1) = 0.384', 'Range {0,1,2,4}; P(Y = 1) = 0.392', NONE],
    `<p>X = 0,1,2,3 → Y = 1, 0, 1, 4. Range {0,1,4}.</p><p>P(Y = 1) = P(X=0) + P(X=2) = 0.2³ + 3(0.8)²(0.2) = 0.008 + 0.384 = <b>0.392</b>.</p>`);
  Q('HW2 Q6', 'hw', 'w2', ['cdf', 'condratio'], ['CDF values Fₓ(1) = 0.25 and Fₓ(3) = 0.80', 'P(1 < X ≤ 3 | X ≤ 3)'],
    'A random variable X has CDF values Fₓ(1) = 0.25 and Fₓ(3) = 0.80. What is P(1 < X ≤ 3 | X ≤ 3)?',
    '0.6875', ['0.7500', '0.5500', '0.8000', NONE],
    `<p>P(1 < X ≤ 3) = F(3) − F(1) = 0.55. Divide by P(X ≤ 3) = 0.80 → <b>0.6875</b>.</p>`);
  Q('HW2 Q7', 'hw', 'w2', ['memoryless', 'geom'], ['defective with probability 0.08', 'Given that the first 10 inspected components were acceptable', 'by the end of inspection 15'],
    'A component is defective with probability 0.08, independently from component to component. Given that the first 10 inspected components were acceptable, what is the probability that a defect is found by the end of inspection 15?',
    `1 − 0.92${sup(5)}`, [`0.08(0.92)${sup(4)}`, `1 − 0.92${sup(15)}`, `0.92${sup(5)}`, NONE],
    `<p>Memoryless: only inspections 11–15 matter. P(at least one defect in 5) = 1 − 0.92⁵ ≈ 0.341.</p>`);
  Q('HW2 Q8', 'hw', 'w2', ['pmf'], ['P(X = x) = c(x + 1)', 'Which pair gives c and P(X ≥ 2)'],
    'A discrete random variable X ∈ {0, 1, 2, 3} with P(X = x) = c(x + 1). Which pair gives c and P(X ≥ 2)?',
    NONE, ['c = 0.10 and P(X ≥ 2) = 0.60', 'c = 0.40 and P(X ≥ 2) = 0.70', 'c = 0.10 and P(X ≥ 2) = 0.30', 'c = 0.25 and P(X ≥ 2) = 0.70'],
    `<p>c(1+2+3+4) = 1 → c = 0.10. P(X ≥ 2) = 0.1(3 + 4) = 0.70. The pair (0.10, 0.70) is not listed → <b>None of These</b>.</p>`);
  Q('HW2 Q9', 'hw', 'w2', ['cond_count', 'comb'], ['5-card hand', 'Given that the hand contains at least one ace', 'exactly one ace'],
    'A 5-card hand is dealt uniformly from a standard 52-card deck. Given that the hand contains at least one ace, which expression equals the probability that it contains exactly one ace?',
    'C(4,1)C(48,4) / [C(52,5) − C(48,5)]', ['[C(4,1)C(48,4) + C(4,2)C(48,3)] / C(52,5)', 'C(4,1)C(48,4) / C(52,5)', '1 − C(48,5)/C(52,5)', NONE],
    `<p>Target count: C(4,1)C(48,4). Condition count: all hands minus no-ace hands = C(52,5) − C(48,5). Divide.</p>`);
  Q('HW2 Q10', 'hw', 'w2', ['cdf', 'model'], ['could be a cumulative distribution function'],
    'Which of the following functions could be a cumulative distribution function?',
    'F(x) = 0 for x < 0; 0.3 for 0 ≤ x < 2; 1 for x ≥ 2', ['F(x) = 0, 0.6, 0.4, 1 on x < 0, [0,1), [1,2), x ≥ 2', 'F(x) = 0.5 for all x', 'F(x) = 1/(1 + eˣ) for all x', NONE],
    `<p>A CDF is non-decreasing, right-continuous, → 0 at −∞ and → 1 at +∞.</p><p>0.6 → 0.4 decreases ✗. Constant 0.5 never reaches 0 or 1 ✗. 1/(1+eˣ) decreases ✗.</p>`);

  /* ======================= HOMEWORK WEEK 3 ======================= */
  Q('HW3 Q1', 'hw', 'w3', ['pmf'], ['P(X = x) = c(2x + 1)', 'What is P(X ≥ 3)'],
    'A discrete random variable X has PMF P(X = x) = c(2x + 1) for x ∈ {0, 1, 2, 3, 4}, and 0 otherwise. What is P(X ≥ 3)?',
    '0.64', ['0.60', '0.40', '0.36', NONE],
    `<p>c(1+3+5+7+9) = 25c = 1 → c = 1/25. P(X ≥ 3) = (7+9)/25 = <b>0.64</b>.</p>`);
  Q('HW3 Q2', 'hw', 'w3', ['cdf', 'condratio'], ['The CDF of a discrete random variable', 'P(1 ≤ X ≤ 2 | X > 0)'],
    'The CDF of a discrete random variable X is F(x) = 0 for x < 0; 0.12 for 0 ≤ x < 1; 0.40 for 1 ≤ x < 2; 0.76 for 2 ≤ x < 3; 1 for x ≥ 3. What is P(1 ≤ X ≤ 2 | X > 0)?',
    '8/11', ['19/25', '16/25', '7/22', NONE],
    `<p>P(1 ≤ X ≤ 2) = F(2) − F(0) = 0.76 − 0.12 = 0.64. P(X > 0) = 1 − 0.12 = 0.88.</p><p>0.64/0.88 = <b>8/11</b>.</p>`);
  Q('HW3 Q3', 'hw', 'w3', ['poisson'], ['Poisson model at a mean rate of 4.8 per hour', 'at least three', 'next 25 minutes'],
    'Critical support requests follow a Poisson model at a mean rate of 4.8 per hour. What is the probability of receiving at least three critical requests during the next 25 minutes?',
    `1 − 5${ex('−2')}`, [`5${ex('−2')}`, `1 − 3${ex('−2')}`, `1 − 5${ex('−4.8')}`, NONE],
    `<p>λ = 4.8 × 25/60 = 2. P(X ≥ 3) = 1 − ${ex('−2')}(1 + 2 + 2²/2) = 1 − 5${ex('−2')}.</p>`);
  Q('HW3 Q4', 'hw', 'w3', ['transform'], ['Define Y = (X − 1)²', 'What is P(Y = 1)'],
    'A discrete random variable X has PMF P(X=0) = 0.15, P(X=1) = 0.25, P(X=2) = 0.30, P(X=3) = 0.30. Define Y = (X − 1)². What is P(Y = 1)?',
    '0.45', ['0.30', '0.15', '0.40', NONE],
    `<p>Y = 1 when X = 0 or X = 2: 0.15 + 0.30 = <b>0.45</b>.</p>`);
  Q('HW3 Q5', 'hw', 'w3', ['geom'], ['number of inspections required to discover the first fault', 'P(6 ≤ T ≤ 10)'],
    'Each inspection independently discovers a fault with probability 0.12. Let T be the number of inspections required to discover the first fault. Which expression equals P(6 ≤ T ≤ 10)?',
    `(0.88)${sup(5)} − (0.88)${sup(10)}`, [`(0.88)${sup(5)} − (0.88)${sup(9)}`, `(0.88)${sup(4)} − (0.88)${sup(9)}`, `(0.88)${sup(6)} − (0.88)${sup(11)}`, NONE],
    `<p>P(6 ≤ T ≤ 10) = P(T > 5) − P(T > 10) = 0.88⁵ − 0.88¹⁰.</p>`);
  Q('HW3 Q6', 'hw', 'w3', ['pity'], ['probability 0.05 on each of the first nine attempts', 'it is guaranteed on attempt 10', 'What is P(T = 10)'],
    'A reward system gives an item independently with probability 0.05 on each of the first nine attempts. If the item has not appeared, it is guaranteed on attempt 10. Let T be the attempt on which the item first appears. What is P(T = 10)?',
    `(0.95)${sup(9)}`, [`(0.95)${sup(9)}(0.05)`, `(0.95)${sup(10)}`, `1 − (0.95)${sup(9)}`, NONE],
    `<p>T = 10 exactly when the first nine fail. Attempt 10 is guaranteed → (0.95)⁹.</p>`);
  Q('HW3 Q7', 'hw', 'w3', ['pois_approx'], ['1,200 independently produced microchips', 'probability 0.0015', 'exact model and a Poisson approximation'],
    'Each of 1,200 independently produced microchips is defective with probability 0.0015. Let X be the number of defective chips. Which statement correctly gives the exact model and a Poisson approximation to P(X ≤ 1)?',
    `X ~ Bin(1200, 0.0015) and P(X ≤ 1) ≈ 2.8${ex('−1.8')}`, [`X ~ Bin(1200, 0.0015) and P(X ≤ 1) ≈ 1 − 2.8${ex('−1.8')}`, `X ~ Bin(1200, 0.0015) and P(X ≤ 1) ≈ 1.8${ex('−1.8')}`, `X ~ Pois(1.8) exactly and P(X ≤ 1) = 2.8${ex('−1.8')}`, NONE],
    `<p>Exact: Bin(1200, 0.0015). λ = np = 1.8. P(X ≤ 1) ≈ ${ex('−1.8')}(1 + 1.8) = 2.8${ex('−1.8')} ≈ 0.463.</p>`);
  Q('HW3 Q8', 'hw', 'w3', ['binom', 'condratio'], ['Bin(10, 0.30)', 'P(2 ≤ X ≤ 4 | X ≤ 4)'],
    'Let X ~ Bin(10, 0.30). Which expression equals P(2 ≤ X ≤ 4 | X ≤ 4)?',
    'Σ_{k=2}^{4} C(10,k)(0.3)ᵏ(0.7)^{10−k} ÷ Σ_{k=0}^{4} C(10,k)(0.3)ᵏ(0.7)^{10−k}', ['Σ_{k=2}^{4} C(10,k)(0.3)ᵏ(0.7)^{10−k} ÷ Σ_{k=2}^{10} C(10,k)(0.3)ᵏ(0.7)^{10−k}', 'Σ_{k=2}^{4} C(10,k)(0.3)ᵏ(0.7)^{10−k}', '1 − Σ_{k=0}^{1} C(10,k)(0.3)ᵏ(0.7)^{10−k}', NONE],
    `<p>Numerator P(2 ≤ X ≤ 4), denominator P(X ≤ 4) = sum from 0 to 4.</p>`);
  Q('HW3 Q9', 'hw', 'w3', ['model', 'binom'], ['Which random variable is not binomial'],
    'Which random variable is not binomial under the assumptions stated?',
    'The number of successful logins among 10 independent users when the users have different login-success probabilities.', ['The number of defective sensors among 30 independent sensors, each with defect probability 0.02.', 'The number of heads in 20 independent tosses of the same coin.', 'The number of clicks among 100 independent ad impressions, each with click probability 0.04.', NONE],
    `<p>Binomial needs the SAME p on every trial. Different login probabilities break that.</p>`);
  Q('HW3 Q10', 'hw', 'w3', ['memoryless', 'geom'], ['Eight attempts have already failed', 'within the next three attempts'],
    'A game server reconnects successfully on each attempt with probability 0.25, independently of previous attempts. Eight attempts have already failed. What is the probability that reconnection occurs within the next three attempts?',
    `1 − (0.75)${sup(3)}`, [`(0.75)${sup(8)}[1 − (0.75)${sup(3)}]`, `(0.75)${sup(3)}`, `1 − (0.75)${sup(11)}`, NONE],
    `<p>Memoryless: past failures don't matter. 1 − 0.75³ ≈ 0.578.</p>`);

  /* ======================= HOMEWORK WEEK 4 ======================= */
  Q('HW4 Q1', 'hw', 'w4', ['pdf_c'], ['c(1 + x)', 'What value of c makes fₓ a valid PDF'],
    'Let fₓ(x) = c(1 + x) for 0 ≤ x ≤ 2, and 0 otherwise. What value of c makes fₓ a valid PDF?',
    '1/4', ['1', '1/2', '1/3', NONE],
    `<p>1 = c∫₀² (1 + x) dx = c[x + x²/2]₀² = 4c → c = <b>1/4</b>.</p>`);
  Q('HW4 Q2', 'hw', 'w4', ['pdf_prob'], ['¼(1 + x)', 'what is P(X > 1)'],
    'Using fₓ(x) = ¼(1 + x) for 0 ≤ x ≤ 2, and 0 otherwise, what is P(X > 1)?',
    '5/8', ['3/8', '1/2', '3/4', NONE],
    `<p>∫₁² ¼(1 + x) dx = ¼[x + x²/2]₁² = ¼(4 − 1.5) = <b>5/8</b>.</p>`);
  Q('HW4 Q3', 'hw', 'w4', ['cdf_pdf'], ['continuous random variable has CDF', '1 − e^(−3x)', 'Which expression is its PDF'],
    'A continuous random variable has CDF Fₓ(x) = 0 for x < 0 and 1 − e^(−3x) for x ≥ 0. Which expression is its PDF?',
    `fₓ(x) = 3${ex('−3x')} for x ≥ 0, and 0 otherwise`, [`fₓ(x) = ${ex('−3x')} for x ≥ 0, and 0 otherwise`, `fₓ(x) = 1 − 3${ex('−3x')} for x ≥ 0, and 0 otherwise`, `fₓ(x) = 3${ex('3x')} for x ≥ 0, and 0 otherwise`, NONE],
    `<p>Differentiate: d/dx (1 − ${ex('−3x')}) = 3${ex('−3x')}.</p>`);
  Q('HW4 Q4', 'hw', 'w4', ['pdf_prob'], ['X is continuous', 'Fₓ(2) = 0.31', 'Fₓ(5) = 0.82', 'P(2 < X ≤ 5)'],
    'Suppose X is continuous and Fₓ(2) = 0.31, Fₓ(5) = 0.82. What is P(2 < X ≤ 5)?',
    '0.51', ['0.49', '0.31', '0.82', NONE],
    `<p>F(5) − F(2) = 0.82 − 0.31 = <b>0.51</b>.</p>`);
  Q('HW4 Q5', 'hw', 'w4', ['unif'], ['arrives uniformly between 8:00 a.m. and 8:18 a.m.', 'given that it has not yet arrived'],
    'An autonomous shuttle arrives uniformly between 8:00 a.m. and 8:18 a.m. A passenger arrives at 8:05 a.m. What is the probability that the shuttle arrives during the next 7 minutes, given that it has not yet arrived?',
    '7/13', ['12/18', '7/18', '5/13', NONE],
    `<p>Given not arrived by 8:05, it is uniform on 8:05–8:18 (13 min). Favourable 8:05–8:12 = 7 min → <b>7/13</b>.</p>`);
  Q('HW4 Q6', 'hw', 'w4', ['normal'], ['Normal(70, 8²)', 'P(62 < X < 82)', 'standard normal CDF Φ'],
    'Let X ~ Normal(70, 8²). Which expression correctly gives P(62 < X < 82) in terms of the standard normal CDF Φ?',
    'Φ(1.5) − Φ(−1)', ['Φ(1) − Φ(−1.5)', 'Φ(82) − Φ(62)', '1 − Φ(1.5) + Φ(−1)', NONE],
    `<p>z = (62 − 70)/8 = −1, (82 − 70)/8 = 1.5 → Φ(1.5) − Φ(−1).</p>`);
  Q('HW4 Q7', 'hw', 'w4', ['npercentile'], ['Normal(100, 15²)', 'threshold is exceeded by only 2.5%', 'Φ(1.96) ≈ 0.975'],
    'A sensor reading is modeled by X ~ Normal(100, 15²). Approximately what threshold is exceeded by only 2.5% of readings? Use Φ(1.96) ≈ 0.975.',
    '129.4', ['101.96', '115.0', '70.6', NONE],
    `<p>97.5th percentile: x = μ + zσ = 100 + 1.96(15) = <b>129.4</b>.</p>`);
  Q('HW4 Q8', 'hw', 'w4', ['expo'], ['Poisson process at a rate of 2.4 per hour', 'waiting time in minutes until the next request', 'P(T > 20)'],
    'Requests arrive according to a Poisson process at a rate of 2.4 per hour. Let T be the waiting time in minutes until the next request. What is P(T > 20)?',
    ex('−0.8'), ['1 − ' + ex('−0.8'), ex('−48'), ex('−2.4'), NONE],
    `<p>20 min = 1/3 h. P(T > 20) = ${ex('−2.4(1/3)')} = ${ex('−0.8')} ≈ 0.449.</p>`);
  Q('HW4 Q9', 'hw', 'w4', ['memoryless', 'expo'], ['Exponential(0.05)', 'Given that T > 30', 'P(T > 50 | T > 30)'],
    'Suppose T ~ Exponential(0.05), where time is measured in minutes. Given that T > 30, what is P(T > 50 | T > 30)?',
    ex('−1'), ['1 − ' + ex('−1'), ex('−2.5'), ex('−1.5'), NONE],
    `<p>Memoryless: P(T > 20) = ${ex('−0.05(20)')} = ${ex('−1')}.</p>`);
  Q('HW4 Q10', 'hw', 'w4', ['model', 'expo'], ['least suitable for an exponential model'],
    'Which situation is least suitable for an exponential model?',
    'Lifetime of a component whose failure risk increases sharply as it ages', ['Waiting time until the next independent network request at a stable rate', 'Waiting time until the next call when calls form a constant-rate Poisson process', 'Waiting time until the next radioactive decay from a stable source', NONE],
    `<p>Exponential = constant hazard (memoryless). Ageing parts have increasing hazard.</p>`);

  /* ======================= HOMEWORK WEEK 5 ======================= */
  Q('HW5 Q1', 'hw', 'w5', ['varsum'], ['Var(X) = 4, Var(Y) = 9, Cov(X, Y) = −2', 'What is Var(X + Y)'],
    'Two processing times X and Y satisfy Var(X) = 4, Var(Y) = 9, Cov(X, Y) = −2. What is Var(X + Y)?',
    '9', ['17', '13', '5', NONE],
    `<p>4 + 9 + 2(−2) = <b>9</b>. 13 forgets the covariance, 17 uses +2·2, 5 uses 4·Cov.</p>`);
  Q('HW5 Q2', 'hw', 'w5', ['lin'], ['Y = 5 + 2X', 'E[Y] = 29 and Var(Y) = 36', 'E[(X − 10)²]'],
    'A transformed score is Y = 5 + 2X. Suppose E[Y] = 29 and Var(Y) = 36. What is E[(X − 10)²]?',
    '13', ['36', '4', '9', NONE],
    `<p>E[X] = (29 − 5)/2 = 12. Var(X) = 36/2² = 9.</p><p>E[(X − 10)²] = Var(X) + (E[X] − 10)² = 9 + 4 = <b>13</b>.</p>`);
  Q('HW5 Q3', 'hw', 'w5', ['varsum', 'disttable'], ['Poisson(2) and Y ~ Poisson(3) be independent', 'W = 2X + Y', 'E[W] and Var(W)'],
    'Let X ~ Poisson(2) and Y ~ Poisson(3) be independent. Define W = 2X + Y. Which pair gives E[W] and Var(W) respectively?',
    '(7, 11)', ['(7, 7)', '(5, 5)', '(8, 11)', NONE],
    `<p>E[W] = 2(2) + 3 = 7. Var(W) = 2²(2) + 3 = 11.</p>`);
  Q('HW5 Q4', 'hw', 'w5', ['lotus', 'cont_ev'], ['density fₓ(x) = 2x', 'C = 100X²', 'What is E[C]'],
    'A delivery-delay proportion X has density fₓ(x) = 2x for 0 ≤ x ≤ 1. The compensation is C = 100X² dollars. What is E[C]?',
    '50 dollars', ['200/3 dollars', '400/9 dollars', '100 dollars', NONE],
    `<p>E[C] = 100∫₀¹ x²·2x dx = 100·(2/4) = <b>50</b>. 400/9 is 100(E[X])² — the LOTUS trap.</p>`);
  Q('HW5 Q5', 'hw', 'w5', ['mgf', 'disttable'], ['MGF', 'exp(3(eᵗ − 1))', 'E[X] and Var(X)'],
    'A random variable has MGF Mₓ(t) = exp(3(eᵗ − 1)). Which pair gives E[X] and Var(X) respectively?',
    '(3, 3)', ['(3, 9)', '(12, 3)', '(12, 12)', NONE],
    `<p>exp(λ(eᵗ − 1)) is the Poisson(λ) MGF with λ = 3 → mean = variance = 3.</p>`);
  Q('HW5 Q6', 'hw', 'w5', ['ev', 'var'], ['P(X = −4) = p', 'P(X = 10) = 0.50 − p', 'If E[X] = 2.5', 'what is Var(X)'],
    'A project has net profit X, in thousands of dollars, with P(X = −4) = p, P(X = 2) = 0.50, P(X = 10) = 0.50 − p. If E[X] = 2.5, what is Var(X)?',
    '24.75', ['28.50', '18.75', '31.00', NONE],
    `<p>−4p + 1 + 5 − 10p = 2.5 → p = 0.25.</p><p>E[X²] = 16(.25) + 4(.5) + 100(.25) = 31. Var = 31 − 6.25 = <b>24.75</b>.</p>`);
  Q('HW5 Q7', 'hw', 'w5', ['mgf', 'lotus'], ['R ~ N(μ, σ²)', 'M_R(t) = exp(μt + ½σ²t²)', 'E[e^(2R)]'],
    'Suppose R ~ N(μ, σ²), so M_R(t) = exp(μt + ½σ²t²). What is E[e^(2R)]?',
    NONE, ['exp(μ + 2σ²)', 'exp(2μ + 4σ²)', 'exp(μ + ½σ²)', 'exp(2μ + σ²)'],
    `<p>E[e^{2R}] = M_R(2) = exp(2μ + ½σ²·4) = <b>exp(2μ + 2σ²)</b> → not listed → None of These.</p>`);
  Q('HW5 Q8', 'hw', 'w5', ['cont_ev', 'pdf_c'], ['density fₓ(x) = cx for 0 ≤ x ≤ 2', 'What is E[X]'],
    'A continuous random variable has density fₓ(x) = cx for 0 ≤ x ≤ 2, and 0 otherwise. What is E[X]?',
    NONE, ['2', '3/2', '1', '8/3'],
    `<p>c∫₀² x dx = 2c = 1 → c = 1/2. E[X] = ∫₀² x·x/2 dx = 8/6 = <b>4/3</b> → None of These.</p>`);
  Q('HW5 Q9', 'hw', 'w5', ['var', 'ev'], ['Reward A pays 12 tokens with probability 1', 'Reward B pays 0 or 24 tokens'],
    'Reward A pays 12 tokens with probability 1. Reward B pays 0 or 24 tokens, each with probability 0.5. Which statement is correct?',
    'A and B have the same mean, but B has the larger variance.', ['B has the larger mean, but A has the larger variance.', 'A has the larger mean and the smaller variance.', 'A and B have the same mean and the same variance.', NONE],
    `<p>Both means 12. Var(A) = 0, Var(B) = 144.</p>`);
  Q('HW5 Q10', 'hw', 'w5', ['lotus'], ['penalty is g(X) = (X − 2)²', 'What is E[g(X)]'],
    'A service request has latency X seconds with P(X = 1) = 0.50, P(X = 2) = 0.30, P(X = 4) = 0.20. The penalty is g(X) = (X − 2)². What is E[g(X)]?',
    '1.30', ['1.00', '1.90', '0.01', NONE],
    `<p>1(0.5) + 0(0.3) + 4(0.2) = <b>1.30</b>. 0.01 = g(E[X]) (trap); 1.90 = E[X].</p>`);

  /* ======================= WEEK 6 REVIEW (harder past-style) ======================= */
  N('Review W1', 'rev', 'w1', ['ie'], ['Among 117 students', 'use none of the three platforms'],
    'Among 117 students: |A| = 56, |B| = 37, |C| = 50, |A∩B| = 19, |A∩C| = 21, |B∩C| = 14, |A∩B∩C| = 10. How many students use none of the three platforms?',
    18, '18', `<p>Union = 56+37+50 − 19−21−14 + 10 = 99. None = 117 − 99 = <b>18</b>.</p>`, 0);
  N('Review W1', 'rev', 'w2', ['cond_count'], ['15 red tokens and 18 blue tokens', 'selected uniformly without replacement', 'Given that the sample contains at least one red token'],
    'A container has 15 red tokens and 18 blue tokens. Three tokens are selected uniformly without replacement. Given that the sample contains at least one red token, what is the probability that it contains exactly two red tokens?',
    189 / 464, '189/464 ≈ 0.407', `<p>Target: C(15,2)C(18,1) = 105·18 = 1890. Condition: C(33,3) − C(18,3) = 5456 − 816 = 4640.</p><p>1890/4640 = <b>0.407</b>.</p>`);
  N('Review W2', 'rev', 'w2', ['bayes2'], ['affects 2% of a population', 'sensitivity 0.84', 'false-positive rate 0.15', 'conditionally independent', 'both tests are positive'],
    'A condition affects 2% of a population. A test has sensitivity 0.84 and false-positive rate 0.15. The outcomes of two tests are conditionally independent given whether the person has the condition. If both tests are positive, what is the probability that the person has the condition?',
    0.3902, '≈ 0.390', `<p>0.02(0.84)² / [0.02(0.84)² + 0.98(0.15)²] = 0.014112 / 0.036162 = <b>0.390</b>.</p>`);
  N('Review W2', 'rev', 'w2', ['prod_cases', 'condratio'], ['fail independently with probabilities 0.14, 0.28, 0.27', 'Given that at least one component fails', 'exactly one component fails'],
    'Three components fail independently with probabilities 0.14, 0.28, 0.27. Given that at least one component fails, what is the probability that exactly one component fails?',
    0.7602, '≈ 0.760', `<p>P(≥ 1) = 1 − 0.86·0.72·0.73 = 0.547984.</p><p>P(exactly one) = 0.14·0.72·0.73 + 0.86·0.28·0.73 + 0.86·0.72·0.27 = 0.416552.</p><p>Ratio = <b>0.760</b>.</p>`);
  N('Review W3', 'rev', 'w3', ['memoryless', 'geom'], ['attempt number of the first success', 'P(9 ≤ X ≤ 12 | X > 6)'],
    'Each attempt succeeds independently with probability p = 0.16. Let X be the attempt number of the first success. Find P(9 ≤ X ≤ 12 | X > 6).',
    0.3543, '0.84² − 0.84⁶ ≈ 0.354', `<p>W = X − 6 ~ Geo(0.16). 9 ≤ X ≤ 12 ⇔ 3 ≤ W ≤ 6.</p><p>P(W ≥ 3) − P(W ≥ 7) = 0.84² − 0.84⁶ = <b>0.354</b>.</p>`);
  N('Review W3', 'rev', 'w3', ['cdf', 'transform', 'condratio'], ['CDF of a discrete random variable', 'Define Y = |X − 2|', 'P(Y ≥ 5 | X ≥ 0)'],
    'The CDF of a discrete X is F(x) = 0 for x < −2; 0.08 for −2 ≤ x < 0; 0.24 for 0 ≤ x < 3; 0.53 for 3 ≤ x < 7; 1 for x ≥ 7. Define Y = |X − 2|. Find P(Y ≥ 5 | X ≥ 0).',
    0.47 / 0.92, '0.47/0.92 ≈ 0.511', `<p>Masses: −2: .08, 0: .16, 3: .29, 7: .47. Given X ≥ 0 (0.92), Y ≥ 5 only at X = 7 (Y = 5).</p><p>0.47/0.92 = <b>0.511</b>.</p>`);
  N('Review W3', 'rev', 'w3', ['poisson', 'condratio'], ['Poisson process at a rate of 2 per hour', 'during the next 90 minutes', 'P(N ≥ 3 | N ≥ 1)'],
    'Requests arrive according to a Poisson process at a rate of 2 per hour. Let N be the number of requests during the next 90 minutes. Find P(N ≥ 3 | N ≥ 1).',
    0.6070, '≈ 0.607', `<p>λ = 2 × 1.5 = 3. P(N ≥ 3) = 1 − ${ex('−3')}(1 + 3 + 9/2). P(N ≥ 1) = 1 − ${ex('−3')}.</p><p>Ratio = <b>0.607</b>.</p>`);
  N('Review W4', 'rev', 'w4', ['pdf_prob'], ['density fₓ(x) = 3x/2 − 3x²/4', 'P(0.5 ≤ X ≤ 1.5)'],
    'X has density fₓ(x) = 3x/2 − 3x²/4 for 0 ≤ x ≤ 2, 0 otherwise. Find P(0.5 ≤ X ≤ 1.5).',
    0.6875, '11/16 = 0.6875', `<p>Antiderivative 3x²/4 − x³/4. At 1.5: 1.6875 − 0.84375 = 0.84375. At 0.5: 0.1875 − 0.03125 = 0.15625.</p><p>Difference = <b>0.6875</b>.</p>`);
  N('Review W4', 'rev', 'w5', ['cont_ev', 'var'], ['density fₓ(x) = 3x/2 − 3x²/4', 'Var(X)'],
    'Same density fₓ(x) = 3x/2 − 3x²/4 on [0, 2]. Find Var(X). (E[X] = 1.)',
    0.2, '0.2', `<p>E[X²] = ∫₀² x²(3x/2 − 3x²/4) dx = [3x⁴/8 − 3x⁵/20]₀² = 6 − 4.8 = 1.2.</p><p>Var = 1.2 − 1² = <b>0.2</b>.</p>`);
  N('Review W4', 'rev', 'w4', ['normal'], ['X ~ N(42, 6²) minutes', 'P(35 < X < 48)'],
    'A delivery time is modeled by X ~ N(42, 6²) minutes. Use Φ(1) ≈ 0.8413 and Φ(−1.17) ≈ 0.1210. Find P(35 < X < 48).',
    0.7203, '≈ 0.720', `<p>z = (35 − 42)/6 = −1.17, (48 − 42)/6 = 1. Φ(1) − Φ(−1.17) = 0.8413 − 0.1210 = <b>0.720</b>.</p>`);
  N('Review W4', 'rev', 'w4', ['npercentile'], ['X ~ N(42, 6²) minutes', '90th percentile', 'Φ⁻¹(0.90) ≈ 1.2816'],
    'X ~ N(42, 6²) minutes. Using Φ⁻¹(0.90) ≈ 1.2816, find the 90th percentile of the delivery time.',
    49.69, '≈ 49.69 min', `<p>x = 42 + 1.2816(6) = <b>49.69</b>.</p>`, 0.02);
  N('Review W5', 'rev', 'w5', ['lotus', 'cont_ev'], ['density fₓ(x) = 2x', 'C = 100X²', 'Compare E[C] with 100(E[X])²'],
    'A delay proportion X has density fₓ(x) = 2x on [0, 1]. The compensation is C = 100X². Give 100(E[X])² (the WRONG way) — compare with E[C] = 50.',
    400 / 9, '400/9 ≈ 44.44', `<p>E[X] = ∫₀¹ 2x² dx = 2/3. 100(2/3)² = 44.44 ≠ 50, because E[X²] ≠ (E[X])² unless Var(X) = 0.</p>`, 0.02);
  N('Review W5', 'rev', 'w5', ['varsum', 'mgf'], ['X ~ Poisson(2), Y ~ Poisson(3)', 'W = 2X + Y', 'Var(W)'],
    'Let X ~ Poisson(2), Y ~ Poisson(3) independent, W = 2X + Y. M_W(t) = exp(2(e^{2t} − 1) + 3(eᵗ − 1)). Find Var(W). Is W Poisson?',
    11, '11 (not Poisson: mean 7 ≠ 11)', `<p>Var(W) = 4·2 + 3 = <b>11</b>. Mean 7 ≠ variance 11 → not Poisson.</p>`, 0);

  /* ======================= TUTORIALS ======================= */
  N('Tutorial 1 Q1', 'tut', 'w1', ['sets', 'ie'], ['rolls a six-sided die twice', 'total score is at least 9', 'at least one roll is 6', 'A ∪ B'],
    'A die is rolled twice. A = {total is at least 9}, B = {at least one roll is 6}. How many outcomes are in A ∪ B?',
    14, '14', `<p>|A| = 10: (3,6)(4,5)(4,6)(5,4)(5,5)(5,6)(6,3)(6,4)(6,5)(6,6). |B| = 11. |A∩B| = 7 (those with a 6).</p><p>10 + 11 − 7 = <b>14</b>.</p>`, 0);
  N('Tutorial 1 Q2', 'tut', 'w1', ['ie'], ['survey of 120 students', '30 students play both games', 'play neither game'],
    'In a survey of 120 students, 70 play Valorant, 55 play Minecraft, and 30 play both. How many play neither game?',
    25, '25', `<p>|V∪M| = 70 + 55 − 30 = 95. Neither = 120 − 95 = <b>25</b>. Not disjoint (30 in both).</p>`, 0);
  N('Tutorial 1 Q3', 'tut', 'w1', ['mult'], ['2 uppercase English letters', 'followed by 3 digits', 'Repetition is allowed'],
    'A robot name consists of 2 uppercase English letters followed by 3 digits. Repetition is allowed. How many different robot names are possible?',
    676000, '676,000', `<p>26·26·10·10·10 = <b>676,000</b>. Starting with "AI": 10³ = 1,000. P(starts with A) = 1/26.</p>`, 0);
  N('Tutorial 1 Q4', 'tut', 'w1', ['perm'], ['captain and vice-captain', 'from the 8 players'],
    'An esports club has 8 players. How many ways can a captain and vice-captain be chosen?',
    56, '56', `<p>Order matters (two different roles): P(8,2) = 8·7 = <b>56</b>.</p>`, 0);
  N('Tutorial 1 Q4', 'tut', 'w1', ['comb'], ['5-player teams contain both Alex and Sarah'],
    'An esports club has 8 players. How many 5-player teams contain both Alex and Sarah?',
    20, '20', `<p>Fix Alex and Sarah, choose 3 of the other 6: C(6,3) = <b>20</b>. (Any team: C(8,5) = 56.)</p>`, 0);
  N('Tutorial 1 Q5', 'tut', 'w1', ['compl_count', 'perm'], ['4-digit access code', 'contains at least one digit 7', 'digits cannot repeat'],
    'A 4-digit access code uses digits 0–9 and digits cannot repeat. How many codes contain at least one digit 7?',
    2016, '2,016', `<p>All: P(10,4) = 5,040. No 7: P(9,4) = 3,024. At least one 7: 5,040 − 3,024 = <b>2,016</b> (probability 0.4).</p>`, 0);
  N('Tutorial 1 Q5', 'tut', 'w1', ['mult', 'compl_count'], ['4-digit access code', 'begins with an even digit', 'contains at least one digit 7', 'digits cannot repeat'],
    'Same codes (no repeated digits). How many codes begin with an even digit AND contain at least one 7?',
    840, '840', `<p>Begins even: 5·P(9,3) = 2,520. Begins even with no 7: 5·P(8,3) = 1,680. Difference = <b>840</b>.</p>`, 0);
  N('Tutorial 2 Q1', 'tut', 'w2', ['cond', 'indep'], ['studies 1,000 randomly selected users', 'Notification Enabled', 'P(B | A)'],
    'Of 1,000 users, 500 had notifications enabled; 300 of those returned next day. 540 returned overall. Find P(B | A) where A = enabled, B = returned.',
    0.6, '0.60', `<p>P(B|A) = 300/500 = <b>0.60</b>. P(B) = 0.54 ≠ 0.60, and P(A∩B) = 0.30 ≠ 0.5·0.54 = 0.27 → not independent. Association ≠ causation.</p>`);
  N('Tutorial 2 Q2', 'tut', 'w2', ['bayes'], ['5% of incoming network requests are malicious', 'flags a malicious request with probability 0.92', 'incorrectly flags a legitimate request with probability 0.08', 'Given that a request was flagged'],
    '5% of requests are malicious. The system flags a malicious request with probability 0.92 and a legitimate one with probability 0.08. Given that a request was flagged, find the probability it is malicious.',
    0.046 / 0.122, '0.046/0.122 ≈ 0.377', `<p>P(F) = .05(.92) + .95(.08) = .046 + .076 = .122.</p><p>P(M|F) = .046/.122 = <b>0.377</b>. P(legit | not flagged) = .874/.878 ≈ 0.995.</p>`);
  N('Tutorial 2 Q3', 'tut', 'w2', ['bayes'], ['three suppliers', 'Share of Purchases', 'Defect Rate', 'P(C | D)'],
    'Suppliers A, B, C supply 60%, 25%, 15% with defect rates 1%, 3%, 7%. Given that a microcontroller is defective, find P(C | D).',
    0.4375, '0.0105/0.024 = 0.4375', `<p>P(D) = .006 + .0075 + .0105 = .024. P(A|D) = .25, P(B|D) = .3125, P(C|D) = <b>.4375</b>. If C drops to 2%: P(D) = .0165, a 31.25% decrease.</p>`);
  N('Tutorial 2 Q4', 'tut', 'w2', ['geom'], ['rare cosmetic with probability 0.10', 'until the first rare cosmetic appears', 'P(5 ≤ X ≤ 10)'],
    'Each box contains a rare cosmetic with probability 0.10, independently. X = boxes opened until the first rare cosmetic. Find P(5 ≤ X ≤ 10).',
    0.3074, '0.9⁴ − 0.9¹⁰ ≈ 0.307', `<p>P(X ≥ 5) − P(X ≥ 11) = 0.9⁴ − 0.9¹⁰ = 0.6561 − 0.3487 = <b>0.307</b>.</p>`);
  N('Tutorial 2 Q4', 'tut', 'w2', ['memoryless', 'geom'], ['opened six boxes without receiving the cosmetic', 'receives it by the tenth box'],
    'Same game (p = 0.10). A player has opened six boxes without receiving the cosmetic. Find the probability that they receive it by the tenth box.',
    0.3439, '1 − 0.9⁴ = 0.3439', `<p>Memoryless: 4 more boxes. 1 − 0.9⁴ = <b>0.3439</b>.</p>`);
  N('Tutorial 2 Q4', 'tut', 'w2', ['solve_n', 'geom'], ['smallest integer n such that', 'P(X ≤ n) ≥ 0.95'],
    'Same game (p = 0.10). Find the smallest integer n such that P(X ≤ n) ≥ 0.95.',
    29, '29', `<p>1 − 0.9ⁿ ≥ 0.95 → n ≥ ln 0.05/ln 0.9 = 28.4 → <b>29</b>.</p>`, 0);
  N('Tutorial 2 Q5', 'tut', 'w2', ['hyper', 'condratio'], ['12 sensors, of which 4 are defective', 'selects 3 sensors without replacement', 'P(X ≥ 2 | X ≥ 1)'],
    'A shipment has 12 sensors, 4 defective. 3 are selected without replacement; X = number defective. Find P(X ≥ 2 | X ≥ 1).',
    13 / 41, '52/164 = 13/41 ≈ 0.317', `<p>P(X=x) = C(4,x)C(8,3−x)/220: 56, 112, 48, 4 (/220).</p><p>(48 + 4)/(112 + 48 + 4) = 52/164 = <b>0.317</b>. With replacement → Bin(3, 1/3).</p>`);
  N('Tutorial 3 Q1', 'tut', 'w3', ['pmf'], ['0.10 c 2c 0.15', 'Find c'],
    'X has PMF P(0) = 0.10, P(1) = c, P(2) = 2c, P(3) = 0.15. Find P(1 < X ≤ 3).',
    0.65, '0.65 (c = 0.25)', `<p>0.10 + 3c + 0.15 = 1 → c = 0.25. P(1 < X ≤ 3) = 2c + 0.15 = <b>0.65</b> = F(3) − F(1) = 1 − 0.35.</p>`);
  N('Tutorial 3 Q2', 'tut', 'w3', ['binom'], ['detects a hidden bug with probability 0.08', 'number of detections among the next 20 runs', 'P(N = 2)'],
    'Each run independently detects a bug with probability 0.08. N = detections among 20 runs. Find P(N = 2).',
    0.2711, 'C(20,2)(.08)²(.92)¹⁸ ≈ 0.271', `<p>N ~ Bin(20, 0.08): 190·0.0064·0.92¹⁸ = <b>0.271</b>. P(N ≥ 1) = 1 − 0.92²⁰ = 0.811 = 1 − P(T > 20).</p>`);
  N('Tutorial 3 Q3', 'tut', 'w3', ['poisson'], ['rate of 1.8 alerts per hour', 'during the next 30 minutes', 'P(Y ≥ 2)'],
    'Critical alerts arrive as a Poisson model at 1.8 per hour. Y = alerts in the next 30 minutes. Find P(Y ≥ 2).',
    0.2275, '1 − e^{−0.9}(1.9) ≈ 0.228', `<p>λ = 0.9. P(Y ≥ 2) = 1 − ${ex('−0.9')}(1 + 0.9) = <b>0.228</b>. P(Y = 0) = 0.407.</p>`);
  N('Tutorial 3 Q3', 'tut', 'w3', ['pois_approx'], ['600 equal six-second intervals', 'probability 0.003', 'Poisson approximation', 'P(Z ≥ 1)'],
    'An hour is split into 600 intervals; each contains an alert with probability 0.003 independently. Z = alerts in the hour. Use a Poisson approximation for P(Z ≥ 1).',
    0.8347, '1 − e^{−1.8} ≈ 0.835', `<p>Exact Z ~ Bin(600, 0.003). λ = 1.8. P(Z ≥ 1) ≈ 1 − ${ex('−1.8')} = <b>0.835</b>.</p>`);
  N('Tutorial 4 Q1', 'tut', 'w4', ['pdf_c', 'pdf_prob'], ['c(2 − x), 0 ≤ x ≤ 2', 'Find the median m'],
    'fₓ(x) = c(2 − x) on [0, 2]. Find the median m.',
    2 - Math.SQRT2, '2 − √2 ≈ 0.586', `<p>c = 1/2. F(x) = x − x²/4. F(m) = 0.5 → m² − 4m + 2 = 0 → m = 2 − √2 = <b>0.586</b>. P(0.5 < X ≤ 1.5) = 0.5.</p>`);
  N('Tutorial 4 Q2', 'tut', 'w4', ['normal'], ['Normal(42, 6²) minutes', 'more than 50 minutes'],
    'X ~ Normal(42, 6²) minutes. Find P(X > 50) using the table.',
    0.0918, '1 − Φ(1.33) ≈ 0.0918', `<p>z = 8/6 = 1.33. 1 − Φ(1.33) = 1 − 0.9082 = <b>0.0918</b>.</p>`, 0.003);
  N('Tutorial 4 Q3', 'tut', 'w4', ['expo'], ['average rate of 4 requests per hour', 'between 5 and 20 minutes from now'],
    'Requests arrive as a Poisson process at 4 per hour. T = waiting time in minutes. Find P(5 < T < 20).',
    0.4529, 'e^{−1/3} − e^{−4/3} ≈ 0.453', `<p>λ = 4/60 = 1/15 per min. ${ex('−5/15')} − ${ex('−20/15')} = 0.7165 − 0.2636 = <b>0.453</b>.</p>`);
  N('Tutorial 4 Q3', 'tut', 'w4', ['memoryless', 'expo'], ['no request has arrived during the first 15 minutes', 'waiting at least another 10 minutes'],
    'Same help desk (4 per hour). Given no request in the first 15 minutes, find the probability of waiting at least another 10 minutes.',
    0.5134, 'e^{−2/3} ≈ 0.513', `<p>Memoryless: P(T > 10) = ${ex('−10/15')} = <b>0.513</b>.</p>`);
  N('Tutorial 5 Q1', 'tut', 'w5', ['ev', 'lin'], ['pays 6 tokens to enter', '0.60 0.35 0.05', 'X = R − 6', 'Find E[X]'],
    'A player pays 6 tokens; gross reward R = 0, 10, 30 with probabilities 0.60, 0.35, 0.05. X = R − 6. Find E[X].',
    -1, '−1', `<p>E[R] = 3.5 + 1.5 = 5. E[X] = 5 − 6 = <b>−1</b> (losing on average). Var(X) = Var(R) = 55.</p>`);
  N('Tutorial 5 Q1', 'tut', 'w5', ['varsum'], ['enters 100 times', 'S = X₁ + ⋯ + X₁₀₀', 'σ_S'],
    'Same game (E[X] = −1, Var(X) = 55). The player enters 100 independent times; S = X₁ + … + X₁₀₀. Find the standard deviation of S.',
    Math.sqrt(5500), '√5500 ≈ 74.16', `<p>E[S] = −100, Var(S) = 100·55 = 5500, σ = <b>74.16</b>.</p>`, 0.05);
  N('Tutorial 5 Q2', 'tut', 'w5', ['lotus', 'cont_ev'], ['c(4 − x), 0 ≤ x ≤ 4', 'C = 20 + 15X + 10X²', 'Find E[C]'],
    'fₓ(x) = c(4 − x) on [0, 4]. Compensation C = 20 + 15X + 10X². Find E[C].',
    200 / 3, '200/3 ≈ 66.67', `<p>c = 1/8. E[X] = 4/3, E[X²] = 8/3. E[C] = 20 + 20 + 80/3 = <b>66.67</b>. Plugging E[X] gives 57.78 — underestimates.</p>`, 0.02);
  N('Tutorial 5 Q3', 'tut', 'w5', ['varsum', 'mgf'], ['X ~ Poisson(5) from the website', 'Y ~ Poisson(3) from the mobile app', 'W = 2X + Y', 'Var(W)'],
    'X ~ Poisson(5), Y ~ Poisson(3) independent. W = 2X + Y. Find Var(W).',
    23, '23', `<p>M_W(t) = exp(5(e^{2t} − 1) + 3(eᵗ − 1)). E[W] = 13, Var(W) = 4·5 + 3 = <b>23</b>. P(W = 0) = ${ex('−8')}. Not Poisson (13 ≠ 23).</p>`, 0);

  /* ======================= LECTURE EXAMPLES ======================= */
  N('Lecture W1', 'lec', 'w1', ['comp_prob'], ['secret edition appears with probability 1/72', 'after opening 72 boxes', 'at least one secret'],
    'A secret figure appears with probability 1/72 per box, independently. After opening 72 boxes, find P(at least one secret).',
    0.6347, '1 − (71/72)⁷² ≈ 0.635', `<p>1 − (71/72)⁷² = <b>0.635</b> — 72 boxes is NOT a guarantee.</p>`);
  N('Lecture W1', 'lec', 'w1', ['ie'], ['integers 0 to 999', 'divisible by 11 or 13'],
    'A number is chosen at random from 0 to 999. Find P(divisible by 11 or 13).',
    0.161, '161/1000 = 0.161', `<p>Multiples of 11: 91 (0…990). Of 13: 77. Of 143: 7. 91 + 77 − 7 = 161 → <b>0.161</b>.</p>`);
  N('Lecture W1', 'lec', 'w1', ['ie'], ['surveyed 800 players', 'every surveyed player joined at least one', 'all three events'],
    '800 players: 500 Boss Raid, 400 Treasure Hunt, 300 Mini-Games; 220 B&T, 180 B&M, 100 T&M. Everyone joined at least one. How many joined all three?',
    100, '100', `<p>800 = 500 + 400 + 300 − 220 − 180 − 100 + x = 700 + x → x = <b>100</b>.</p>`, 0);
  N('Lecture W1', 'lec', 'w1', ['comp_prob', 'comb'], ['13-card hand', 'at least two aces'],
    'A 13-card hand is dealt from 52 cards. Find P(at least two aces).',
    0.2573, '≈ 0.257', `<p>1 − [C(48,13) + C(4,1)C(48,12)] / C(52,13) = <b>0.257</b>.</p>`);
  N('Lecture W2', 'lec', 'w2', ['cond_count'], ['13-card hand', 'Given that the hand contains at least one ace', 'exactly one ace'],
    '13-card hand. Given at least one ace, find P(exactly one ace).',
    0.6304, '≈ 0.630', `<p>C(4,1)C(48,12) / [C(52,13) − C(48,13)] = <b>0.630</b>.</p>`);
  N('Lecture W2', 'lec', 'w2', ['cond'], ['at least one roll is a 6', 'both rolls are 6'],
    'Roll a die twice. Given at least one roll is a 6, find P(both are 6).',
    1 / 11, '1/11', `<p>Restricted space: 11 ordered outcomes, one is (6,6) → <b>1/11</b> (not 1/6).</p>`);
  N('Lecture W2', 'lec', 'w2', ['bayes'], ['1% of people have a certain disease', 'P(Positive | D) = 0.95', 'Specificity'],
    'Prevalence 1%, sensitivity 0.95, specificity 0.98. Find P(D | Positive).',
    0.3242, '0.0095/0.0293 ≈ 0.324', `<p>P(+) = .95(.01) + .02(.99) = .0293. P(D|+) = .0095/.0293 = <b>0.324</b>.</p>`);
  N('Lecture W2', 'lec', 'w2', ['bayes'], ['20% of incoming emails are spam', 'suspicious link', 'P(S | L)'],
    '20% of emails are spam. P(link | spam) = 0.80, P(link | not spam) = 0.10. Find P(spam | link).',
    2 / 3, '2/3', `<p>P(L) = .16 + .08 = .24. P(S|L) = .16/.24 = <b>2/3</b>.</p>`);
  N('Lecture W2', 'lec', 'w2', ['bayes'], ['three series', 'Share of boxes', 'Defect rate', 'came from Series B'],
    'Series A, B, C: shares 50%, 30%, 20%; defect rates 3%, 4%, 5%. A defective figurine is found. P(it came from B)?',
    0.012 / 0.037, '0.012/0.037 ≈ 0.324', `<p>P(D) = .015 + .012 + .010 = .037 → P(B|D) = <b>0.324</b>.</p>`);
  N('Lecture W2', 'lec', 'w2', ['indep'], ['selected uniformly at random from S = {1, 2, …, 9}', 'prime', 'less than 5', 'independent'],
    'A number is chosen from {1,…,9}. A = prime, B = less than 5. Give P(A∩B) − P(A)P(B) (0 would mean independent).',
    2 / 9 - 16 / 81, '2/9 − 16/81 = 2/81 ≈ 0.0247 → not independent', `<p>A = {2,3,5,7}, B = {1,2,3,4}, A∩B = {2,3}: 2/9 vs (4/9)² = 16/81 → <b>dependent</b>.</p>`);
  N('Lecture W3', 'lec', 'w3', ['binom'], ['critical hit with probability 0.60', 'eight attacks', 'P(X ≥ 6)'],
    'Each attack is a critical hit with probability 0.60 independently. Eight attacks. Find P(X ≥ 6).',
    0.3154, '≈ 0.315', `<p>P6 + P7 + P8 = 28(.6)⁶(.4)² + 8(.6)⁷(.4) + .6⁸ = .2090 + .0896 + .0168 = <b>0.315</b>.</p>`);
  N('Lecture W3', 'lec', 'w3', ['memoryless', 'geom'], ['API request succeeds with probability 0.25', 'first three attempts failed', 'success by attempt five'],
    'An API call succeeds with probability 0.25 per attempt. Given the first three attempts failed, find P(success by attempt five).',
    0.4375, '1 − 0.75² = 0.4375', `<p>Two more attempts: 1 − 0.75² = <b>0.4375</b>.</p>`);
  N('Lecture W3', 'lec', 'w3', ['poisson'], ['average of 2.5 critical alerts per hour', 'no alerts in a two-hour period'],
    'A server averages 2.5 critical alerts per hour (Poisson). Find the probability of no alerts in two hours.',
    Math.exp(-5), 'e^{−5} ≈ 0.0067', `<p>λ = 5 → ${ex('−5')} = <b>0.0067</b>.</p>`, 0.0005);
  N('Lecture W3', 'lec', 'w3', ['pois_approx'], ['1,000 independently produced components', 'defective with probability 0.002', 'P(X ≤ 1)'],
    '1,000 components, each defective with probability 0.002. Approximate P(X ≤ 1).',
    0.4060, '3e^{−2} ≈ 0.406', `<p>λ = 2: ${ex('−2')}(1 + 2) = <b>0.406</b>.</p>`);
  N('Lecture W4', 'lec', 'w4', ['normal'], ['Normal(220, 35²) milliseconds', 'P(X > 280)'],
    'API response X ~ Normal(220, 35²) ms. Find P(X > 280) using the table (z to 2 dp).',
    0.0436, '1 − Φ(1.71) ≈ 0.0436', `<p>z = 60/35 = 1.71. 1 − 0.9564 = <b>0.0436</b>.</p>`, 0.003);
  N('Lecture W4', 'lec', 'w4', ['normal'], ['Normal(10.00, 0.04²) mm', '9.94 ≤ X ≤ 10.06'],
    'Diameter X ~ Normal(10.00, 0.04²) mm. Accept if 9.94 ≤ X ≤ 10.06. Find the acceptance probability.',
    0.8664, '2Φ(1.5) − 1 ≈ 0.866', `<p>z = ±0.06/0.04 = ±1.5. Φ(1.5) − Φ(−1.5) = 2(0.9332) − 1 = <b>0.866</b>.</p>`);
  N('Lecture W4', 'lec', 'w4', ['unif'], ['spawns uniformly along a 40-metre corridor', 'within 6 metres of either end'],
    'An item spawns uniformly along a 40 m corridor. Find P(within 6 m of either end).',
    0.3, '12/40 = 0.30', `<p>[0,6] ∪ [34,40] = 12 m → 12/40 = <b>0.30</b>.</p>`);
  N('Lecture W4', 'lec', 'w4', ['expo'], ['average rate of 3 per hour', 'wait is between 10 and 30 minutes'],
    'Support requests arrive at 3 per hour. Find P(wait between 10 and 30 minutes).',
    0.3834, 'e^{−0.5} − e^{−1.5} ≈ 0.383', `<p>Hours: 1/6 and 1/2. ${ex('−0.5')} − ${ex('−1.5')} = <b>0.383</b>.</p>`);
  N('Lecture W4', 'lec', 'w4', ['memoryless', 'expo'], ['Exponential(0.02) hours', 'already run for 40 hours', 'at least another 15 hours'],
    'Time to next server failure X ~ Exponential(0.02) hours. Given 40 hours already, find P(at least another 15 hours).',
    0.7408, 'e^{−0.3} ≈ 0.741', `<p>${ex('−0.02·15')} = ${ex('−0.3')} = <b>0.741</b>.</p>`);
  N('Lecture W5', 'lec', 'w5', ['ev'], ['costs $2 per play', 'pays $10 with probability 0.15', 'net gain'],
    'A machine costs $2 per play and pays $10 with probability 0.15. Find E[net gain].',
    -0.5, '−$0.50', `<p>8(0.15) + (−2)(0.85) = 1.20 − 1.70 = <b>−0.50</b>.</p>`);
  N('Lecture W5', 'lec', 'w5', ['lin'], ['E[X] = 20, Var(X) = 4', 'Y = 32 + 1.8X', 'Var(Y)'],
    'Celsius X: E[X] = 20, Var(X) = 4. Fahrenheit Y = 32 + 1.8X. Find Var(Y).',
    12.96, '12.96', `<p>1.8²·4 = <b>12.96</b> (E[Y] = 68, σ = 3.6).</p>`, 0.01);
  N('Lecture W5', 'lec', 'w5', ['varsum'], ['three independent stages', 'variances 0.25, 0.64, and 0.09', 'total processing time'],
    'Three independent stages have variances 0.25, 0.64, 0.09. Find the standard deviation of the total time.',
    Math.sqrt(0.98), '√0.98 ≈ 0.990', `<p>Var = 0.98 → σ = <b>0.990</b>.</p>`);
  N('Lecture W5', 'lec', 'w5', ['varsum', 'binom'], ['500 devices', 'probability 0.012', 'expected total investigation cost', '$18'],
    'An update goes to 500 devices; each files a bug report with probability 0.012. Each report costs $18. Find the expected total cost.',
    108, '$108', `<p>Indicators: E[X] = 500(0.012) = 6 (no independence needed). Cost = 18·6 = <b>108</b>.</p>`, 0.01);
  N('Lecture W5', 'lec', 'w5', ['disttable'], ['Exp(0.25)', 'measured in minutes', 'Var(X)'],
    'X ~ Exp(0.25) minutes. Find Var(X).',
    16, '16', `<p>Var = 1/λ² = 1/0.0625 = <b>16</b>. E = 4 min, σ = 4.</p>`, 0.01);
})();
