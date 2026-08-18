import type { ModeId, Trial } from './types';
import { pick, randInt, shuffle, uniqueNumbers } from './random';

const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function choiceTrial(
  mode: ModeId,
  title: string,
  prompt: string,
  notation: string | undefined,
  answer: number,
  distractors: number[],
  difficulty: number,
  explanation: string,
  cognitiveLoad: string[],
): Trial {
  const choices = uniqueNumbers(answer, distractors).map(String);
  return {
    id: id(), mode, title, prompt, notation, choices,
    correctIndex: choices.indexOf(String(answer)),
    difficulty, explanation, cognitiveLoad,
  };
}

function patternTrial(difficulty: number): Trial {
  const kind = difficulty <= 2 ? pick(['linear', 'geometric']) : pick(['linear', 'quadratic', 'alternating', 'geometric']);
  if (kind === 'linear') {
    const start = randInt(1, 12);
    const step = randInt(2, 4 + difficulty);
    const seq = Array.from({ length: 5 }, (_, i) => start + step * i);
    const answer = start + step * 5;
    return choiceTrial('patterns', 'Pattern Forge', 'Infer the generating rule, then predict the next state.', `${seq.join('  ·  ')}  ·  ?`, answer, [answer + step, answer - step, answer + 1], difficulty, `The invariant difference is +${step}.`, ['induction', 'rule inference']);
  }
  if (kind === 'geometric') {
    const start = randInt(1, 4);
    const factor = randInt(2, Math.min(4, 2 + Math.floor(difficulty / 2)));
    const len = difficulty >= 5 ? 5 : 4;
    const seq = Array.from({ length: len }, (_, i) => start * factor ** i);
    const answer = start * factor ** len;
    return choiceTrial('patterns', 'Pattern Forge', 'Find the multiplicative invariant.', `${seq.join('  ·  ')}  ·  ?`, answer, [answer / factor, answer + factor, answer - factor], difficulty, `Each state is multiplied by ${factor}.`, ['induction', 'multiplicative reasoning']);
  }
  if (kind === 'quadratic') {
    const a = randInt(1, Math.max(2, Math.ceil(difficulty / 2)));
    const b = randInt(-2, 4);
    const c = randInt(0, 5);
    const f = (n: number) => a * n * n + b * n + c;
    const seq = [1, 2, 3, 4, 5].map(f);
    const answer = f(6);
    return choiceTrial('patterns', 'Pattern Forge', 'Track the first and second differences. Which value continues the structure?', `${seq.join('  ·  ')}  ·  ?`, answer, [answer + 2 * a, answer - 2 * a, answer + a], difficulty, `The sequence follows f(n) = ${a}n² ${b >= 0 ? '+' : '−'} ${Math.abs(b)}n + ${c}; its second difference is constant.`, ['pattern abstraction', 'second-order change']);
  }
  const a = randInt(2, 5 + difficulty);
  const b = randInt(1, 4 + difficulty);
  const start = randInt(2, 8);
  const seq = [start, start + a, start + a - b, start + 2 * a - b, start + 2 * a - 2 * b];
  const answer = start + 3 * a - 2 * b;
  return choiceTrial('patterns', 'Pattern Forge', 'Two operations alternate. Keep both rules active.', `${seq.join('  ·  ')}  ·  ?`, answer, [answer - a, answer + b, answer - b], difficulty, `The operations alternate +${a}, −${b}.`, ['working-memory updating', 'rule switching']);
}

function transformTrial(difficulty: number): Trial {
  const steps = Math.min(5, 2 + Math.floor(difficulty / 2));
  const x0 = randInt(-3, 4);
  const y0 = randInt(-3, 4);
  const transforms = [
    { name: 'A', apply: ([x, y]: number[]) => [x + 2, y - 1], text: 'A(x,y) = (x+2, y−1)' },
    { name: 'B', apply: ([x, y]: number[]) => [y, -x], text: 'B(x,y) = (y, −x)' },
    { name: 'C', apply: ([x, y]: number[]) => [x - y, y + 1], text: 'C(x,y) = (x−y, y+1)' },
  ];
  const allowed = difficulty <= 2 ? transforms.slice(0, 2) : transforms;
  const chain = Array.from({ length: steps }, () => pick(allowed));
  let state = [x0, y0];
  chain.forEach((t) => { state = t.apply(state); });
  const answer = `${state[0]}, ${state[1]}`;
  const distractorStates = [
    [state[0] + 1, state[1]], [state[0], state[1] - 1], [state[1], state[0]], [-state[0], state[1]],
  ].map((v) => `${v[0]}, ${v[1]}`);
  const pool = new Set<string>([answer, ...distractorStates]);
  let offset = 2;
  while (pool.size < 4) {
    pool.add(`${state[0] + offset}, ${state[1] - offset}`);
    offset += 1;
  }
  const choices = shuffle([...pool]).slice(0, 4);
  if (!choices.includes(answer)) choices[0] = answer;
  return {
    id: id(), mode: 'transform', title: 'Transformation Chamber',
    prompt: `Begin at (${x0}, ${y0}). Apply the operators from left to right without external notes.`,
    notation: `${allowed.map((t) => t.text).join('     ')}\n\n${chain.map((t) => t.name).join(' → ')}`,
    choices: choices.map((c) => `(${c})`), correctIndex: choices.indexOf(answer), difficulty,
    explanation: `Following ${chain.map((t) => t.name).join(' → ')} produces (${answer}).`,
    cognitiveLoad: ['state maintenance', 'mental transformation', 'updating'],
  };
}

function constraintsTrial(difficulty: number): Trial {
  const n = difficulty >= 5 ? 5 : 4;
  const letters = ['A', 'B', 'C', 'D', 'E'].slice(0, n);
  const valid = shuffle(letters);
  const beforePairs: [string, string][] = [];
  for (let i = 0; i < Math.min(3, n - 1); i += 1) {
    const left = valid[i];
    const right = valid[randInt(i + 1, n - 1)];
    if (!beforePairs.some(([a, b]) => a === left && b === right)) beforePairs.push([left, right]);
  }
  const anchorIndex = randInt(0, n - 1);
  const anchor = valid[anchorIndex];
  const candidates = [valid.join('')];
  while (candidates.length < 4) {
    const next = shuffle(letters).join('');
    if (!candidates.includes(next)) candidates.push(next);
  }
  const isValid = (candidate: string) => beforePairs.every(([a, b]) => candidate.indexOf(a) < candidate.indexOf(b)) && candidate.indexOf(anchor) === anchorIndex;
  const answer = valid.join('');
  const filtered = [answer, ...candidates.filter((c) => c !== answer && !isValid(c))];
  while (filtered.length < 4) {
    const next = shuffle(letters).join('');
    if (!filtered.includes(next) && !isValid(next)) filtered.push(next);
  }
  const choices = shuffle(filtered.slice(0, 4));
  const clauses = [
    ...beforePairs.map(([a, b]) => `${a} must appear before ${b}.`),
    `${anchor} must occupy position ${anchorIndex + 1}.`,
  ];
  return {
    id: id(), mode: 'constraints', title: 'Constraint Matrix',
    prompt: 'Only one ordering satisfies every active constraint.',
    notation: clauses.join('\n'), choices, correctIndex: choices.indexOf(answer), difficulty,
    explanation: `${answer} preserves every precedence relation and fixes ${anchor} at position ${anchorIndex + 1}.`,
    cognitiveLoad: ['constraint maintenance', 'inhibition', 'combinatorial search'],
  };
}

function proofTrial(difficulty: number): Trial {
  const symbols = ['A', 'B', 'C', 'D', 'E'];
  const length = Math.min(5, 2 + Math.floor(difficulty / 2));
  const chain = symbols.slice(0, length + 1);
  const modusTollens = difficulty >= 3 && Math.random() > 0.45;
  if (modusTollens) {
    const premises = chain.slice(0, -1).map((s, i) => `${s} → ${chain[i + 1]}`);
    premises.push(`¬${chain[chain.length - 1]}`);
    const answer = `¬${chain[0]}`;
    const choices = shuffle([answer, chain[0], chain[chain.length - 1], `¬${chain[1]}`]);
    return { id: id(), mode: 'proof', title: 'Proof Forge', prompt: 'Which conclusion is logically forced?', notation: premises.join('\n'), choices, correctIndex: choices.indexOf(answer), difficulty, explanation: `The implication chain carries ${chain[0]} to ${chain.at(-1)}. Since ¬${chain.at(-1)}, repeated modus tollens yields ${answer}.`, cognitiveLoad: ['deduction', 'dependency tracking', 'inhibition'] };
  }
  const premises = chain.slice(0, -1).map((s, i) => `${s} → ${chain[i + 1]}`);
  premises.push(chain[0]);
  const answer = chain[chain.length - 1];
  const choices = shuffle([answer, `¬${answer}`, chain[1], `¬${chain[0]}`]);
  return { id: id(), mode: 'proof', title: 'Proof Forge', prompt: 'Which conclusion follows necessarily?', notation: premises.join('\n'), choices, correctIndex: choices.indexOf(answer), difficulty, explanation: `Starting with ${chain[0]}, repeated modus ponens traverses the chain to ${answer}.`, cognitiveLoad: ['formal logic', 'multi-step deduction'] };
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a); let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
}

function orbitTrial(difficulty: number): Trial {
  const n = randInt(7 + difficulty, 12 + difficulty * 2);
  let k = randInt(2, n - 2);
  if (difficulty <= 2) {
    const coprimes = Array.from({ length: n - 2 }, (_, i) => i + 2).filter((v) => gcd(v, n) === 1);
    if (coprimes.length && Math.random() > 0.5) k = pick(coprimes);
  }
  const cycle = n / gcd(n, k);
  return choiceTrial(
    'orbit', 'Orbit Engine',
    `A token moves +${k} positions each turn on a ring of ${n} positions. Starting at 0, how many distinct positions are visited before the token returns to 0?`,
    `xₜ₊₁ = (xₜ + ${k}) mod ${n}`,
    cycle,
    [n, gcd(n, k), Math.max(1, cycle - 1), Math.min(n, cycle + 1)],
    difficulty,
    `The orbit length is n / gcd(n,k) = ${n} / ${gcd(n, k)} = ${cycle}. ${gcd(n, k) === 1 ? 'Because the step and ring size are coprime, every position is visited.' : 'A shared divisor partitions the ring into a smaller cycle.'}`,
    ['modular arithmetic', 'cyclic structure', 'number theory'],
  );
}

function bayesTrial(difficulty: number): Trial {
  const presets = [
    [10, 90, 10], [20, 80, 20], [5, 90, 5], [25, 90, 10], [10, 95, 5], [2, 95, 5], [5, 98, 2], [1, 99, 1],
  ];
  const [prevalence, sensitivity, falsePositive] = presets[Math.min(presets.length - 1, difficulty - 1)];
  const population = 10000;
  const trueCases = population * prevalence / 100;
  const falseCases = population - trueCases;
  const truePositives = trueCases * sensitivity / 100;
  const falsePositives = falseCases * falsePositive / 100;
  const posterior = Math.round((truePositives / (truePositives + falsePositives)) * 100);
  return choiceTrial(
    'bayes', 'Bayes Reactor',
    'A detector returns positive. Estimate the probability that the target condition is actually present.',
    `Base rate: ${prevalence}%\nSensitivity: ${sensitivity}%\nFalse-positive rate: ${falsePositive}%`,
    posterior,
    [prevalence, sensitivity, Math.round(100 - posterior), Math.min(99, posterior + 10), Math.max(1, posterior - 10)],
    difficulty,
    `Using 10,000 cases: about ${truePositives.toFixed(0)} true positives and ${falsePositives.toFixed(0)} false positives occur. The positive predictive probability is therefore ≈ ${posterior}%.`,
    ['Bayesian updating', 'base-rate reasoning', 'uncertainty'],
  );
}

function dynamicsTrial(difficulty: number): Trial {
  const aOptions = difficulty >= 5 ? [-2, -1, 2, 3] : [1, 2, 3];
  const a = pick(aOptions);
  const b = randInt(-2, 3);
  const start = randInt(-2, 5);
  const steps = Math.min(5, 2 + Math.floor(difficulty / 2));
  let state = start;
  const trajectory = [state];
  for (let i = 0; i < steps; i += 1) {
    state = a * state + b;
    trajectory.push(state);
  }
  const answer = state;
  return choiceTrial(
    'dynamics', 'Dynamics Lab',
    `Start at x₀ = ${start}. Evolve the system ${steps} times. What is x${steps}?`,
    `xₜ₊₁ = ${a}xₜ ${b >= 0 ? '+' : '−'} ${Math.abs(b)}`,
    answer,
    [trajectory.at(-2) ?? answer - 1, answer + a, answer - a, -answer],
    difficulty,
    `The trajectory is ${trajectory.join(' → ')}. Each state becomes the input to the next update.`,
    ['dynamic-state simulation', 'recurrence', 'working-memory updating'],
  );
}

function transferTrial(difficulty: number): Trial {
  const multiplier = randInt(2, Math.min(5, 2 + Math.ceil(difficulty / 2)));
  const seed = randInt(1, 4);
  const values = [seed, seed * multiplier, seed * multiplier ** 2, seed * multiplier ** 3];
  const answer = `Each state is ${multiplier}× the previous state`;
  const choices = shuffle([
    answer,
    `Each state adds ${multiplier}`,
    `Each state squares the previous state`,
    `Each state adds the original seed`,
  ]);
  const context = pick([
    `${values[0]} cells → ${values[1]} → ${values[2]} → ${values[3]}`,
    `${values[0]} signals → ${values[1]} → ${values[2]} → ${values[3]}`,
    `${values[0]} branches → ${values[1]} → ${values[2]} → ${values[3]}`,
  ]);
  return { id: id(), mode: 'transfer', title: 'Transfer Arena', prompt: 'Ignore the surface story. Identify the invariant mathematical structure.', notation: context, choices, correctIndex: choices.indexOf(answer), difficulty, explanation: `The representation changes, but the invariant is geometric growth with ratio ${multiplier}.`, cognitiveLoad: ['abstraction', 'representation switching', 'far-transfer practice'] };
}

export function generateTrial(mode: ModeId, difficulty: number): Trial {
  const bounded = Math.max(1, Math.min(8, difficulty));
  switch (mode) {
    case 'patterns': return patternTrial(bounded);
    case 'transform': return transformTrial(bounded);
    case 'constraints': return constraintsTrial(bounded);
    case 'proof': return proofTrial(bounded);
    case 'orbit': return orbitTrial(bounded);
    case 'bayes': return bayesTrial(bounded);
    case 'dynamics': return dynamicsTrial(bounded);
    case 'transfer': return transferTrial(bounded);
  }
}
