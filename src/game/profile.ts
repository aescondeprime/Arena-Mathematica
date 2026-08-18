import type { ModeId, Profile, TrialResult } from './types';

const STORAGE_KEY = 'arena-mathematica-profile-v1';
const modes: ModeId[] = ['patterns', 'transform', 'constraints', 'proof', 'orbit', 'bayes', 'dynamics', 'transfer'];

export const defaultProfile = (): Profile => ({
  difficultyByMode: { patterns: 2, transform: 1, constraints: 1, proof: 1, orbit: 1, bayes: 1, dynamics: 1, transfer: 1 },
  results: [], streak: 0, bestStreak: 0, totalXp: 0,
});

export function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProfile();
    const parsed = JSON.parse(raw) as Partial<Profile>;
    return {
      ...defaultProfile(),
      ...parsed,
      difficultyByMode: { ...defaultProfile().difficultyByMode, ...(parsed.difficultyByMode ?? {}) },
      results: Array.isArray(parsed.results) ? parsed.results.slice(-300) : [],
    };
  } catch {
    return defaultProfile();
  }
}

export function saveProfile(profile: Profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...profile, results: profile.results.slice(-300) }));
}

export function applyResult(profile: Profile, result: TrialResult): Profile {
  const results = [...profile.results, result].slice(-300);
  const recentMode = results.filter((r) => r.mode === result.mode).slice(-4);
  const correctCount = recentMode.filter((r) => r.correct).length;
  const avgTime = recentMode.reduce((sum, r) => sum + r.elapsedMs, 0) / Math.max(1, recentMode.length);
  let nextDifficulty = profile.difficultyByMode[result.mode];
  if (recentMode.length >= 3 && correctCount >= 3 && avgTime < 45000) nextDifficulty += 1;
  if (recentMode.length >= 2 && recentMode.slice(-2).every((r) => !r.correct)) nextDifficulty -= 1;
  nextDifficulty = Math.max(1, Math.min(8, nextDifficulty));

  const streak = result.correct ? profile.streak + 1 : 0;
  const xp = result.correct ? 40 + result.difficulty * 12 + Math.max(0, Math.round((45000 - result.elapsedMs) / 3000)) : 8;
  return {
    ...profile,
    results,
    difficultyByMode: { ...profile.difficultyByMode, [result.mode]: nextDifficulty },
    streak,
    bestStreak: Math.max(profile.bestStreak, streak),
    totalXp: profile.totalXp + xp,
  };
}

export function telemetry(profile: Profile) {
  const recent = profile.results.slice(-30);
  const accuracy = recent.length ? recent.filter((r) => r.correct).length / recent.length : 0;
  const avgTime = recent.length ? recent.reduce((s, r) => s + r.elapsedMs, 0) / recent.length : 0;
  const modeAccuracy = Object.fromEntries(modes.map((mode) => {
    const rows = recent.filter((r) => r.mode === mode);
    return [mode, rows.length ? rows.filter((r) => r.correct).length / rows.length : 0];
  })) as Record<ModeId, number>;
  return { accuracy, avgTime, modeAccuracy };
}
