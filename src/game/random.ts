export const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = <T,>(items: T[]): T => items[randInt(0, items.length - 1)];

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function uniqueNumbers(correct: number, candidates: number[], count = 4): number[] {
  const set = new Set<number>([correct]);
  for (const value of candidates) {
    if (Number.isFinite(value)) set.add(value);
    if (set.size >= count) break;
  }
  let delta = 1;
  while (set.size < count) {
    set.add(correct + delta);
    delta += 1;
  }
  return shuffle([...set]).slice(0, count);
}
