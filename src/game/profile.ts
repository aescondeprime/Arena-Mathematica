import type { ModeId, Profile, SkillState, TrialResult } from './types';

const STORAGE_KEY = 'arena-mathematica-profile-v1';
export const modes: ModeId[] = ['patterns', 'transform', 'constraints', 'proof', 'orbit', 'bayes', 'dynamics', 'transfer', 'hypothesis', 'branch', 'graph'];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const initialSkill = (rating = 1.6): SkillState => ({ rating, uncertainty: 1.35, attempts: 0, lastDelta: 0 });

function defaultSkills(): Record<ModeId, SkillState> {
  return Object.fromEntries(modes.map((mode) => [mode, initialSkill(mode === 'patterns' ? 2.1 : 1.6)])) as Record<ModeId, SkillState>;
}

function defaultDifficulties(): Record<ModeId, number> {
  return Object.fromEntries(modes.map((mode) => [mode, mode === 'patterns' ? 2 : 1])) as Record<ModeId, number>;
}

export const defaultProfile = (): Profile => ({
  difficultyByMode: defaultDifficulties(),
  skillByMode: defaultSkills(),
  results: [],
  streak: 0,
  bestStreak: 0,
  totalXp: 0,
});

export function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProfile();
    const parsed = JSON.parse(raw) as Partial<Profile>;
    const base = defaultProfile();
    const migratedSkills = { ...base.skillByMode };

    for (const mode of modes) {
      const existing = parsed.skillByMode?.[mode];
      const legacyDifficulty = parsed.difficultyByMode?.[mode];
      migratedSkills[mode] = existing
        ? { ...base.skillByMode[mode], ...existing, rating: clamp(existing.rating ?? base.skillByMode[mode].rating, 1, 8) }
        : initialSkill(clamp(typeof legacyDifficulty === 'number' ? legacyDifficulty : base.skillByMode[mode].rating, 1, 8));
    }

    return {
      ...base,
      ...parsed,
      difficultyByMode: { ...base.difficultyByMode, ...(parsed.difficultyByMode ?? {}) },
      skillByMode: migratedSkills,
      results: Array.isArray(parsed.results) ? parsed.results.slice(-500) : [],
    };
  } catch {
    return defaultProfile();
  }
}

export function saveProfile(profile: Profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...profile, results: profile.results.slice(-500) }));
}

function expectedSuccess(skill: number, challenge: number) {
  return 1 / (1 + Math.exp(-(skill - challenge) / 1.05));
}

function updateSkill(state: SkillState, result: TrialResult): SkillState {
  const expected = expectedSuccess(state.rating, result.difficulty);
  const targetMs = 18000 + result.difficulty * 6000;
  const speedRatio = targetMs / Math.max(5000, result.elapsedMs);
  const speedAdjustment = result.correct ? clamp((speedRatio - 1) * 0.08, -0.12, 0.08) : 0;
  const hintPenalty = result.usedHint ? 0.18 : 0;
  const observed = result.correct ? clamp(1 - hintPenalty + speedAdjustment, 0.55, 1.08) : 0;
  const learningRate = 0.72 * (0.65 + state.uncertainty / 1.7);
  const delta = clamp(learningRate * (observed - expected), -0.72, 0.72);
  const rating = clamp(state.rating + delta, 1, 8);
  const uncertainty = clamp(state.uncertainty * 0.94 + (result.correct ? -0.015 : 0.025), 0.28, 1.5);
  return { rating, uncertainty, attempts: state.attempts + 1, lastDelta: delta };
}

function nextLoad(skill: SkillState, recent: TrialResult[]) {
  const recentMode = recent.slice(-4);
  const twoMisses = recentMode.slice(-2).length === 2 && recentMode.slice(-2).every((row) => !row.correct);
  const challengeBias = twoMisses ? -0.35 : 0.35;
  return clamp(Math.round(skill.rating + challengeBias), 1, 8);
}

export function applyResult(profile: Profile, result: TrialResult): Profile {
  const results = [...profile.results, result].slice(-500);
  const current = profile.skillByMode[result.mode] ?? initialSkill(profile.difficultyByMode[result.mode]);
  const nextSkill = updateSkill(current, result);
  const recentMode = results.filter((row) => row.mode === result.mode);
  const nextDifficulty = nextLoad(nextSkill, recentMode);

  const streak = result.correct ? profile.streak + 1 : 0;
  const hintMultiplier = result.usedHint ? 0.72 : 1;
  const speedBonus = result.correct ? clamp(Math.round((40000 - result.elapsedMs) / 4000), 0, 7) : 0;
  const xp = result.correct ? Math.round((42 + result.difficulty * 13 + speedBonus) * hintMultiplier) : 7;

  return {
    ...profile,
    results,
    difficultyByMode: { ...profile.difficultyByMode, [result.mode]: nextDifficulty },
    skillByMode: { ...profile.skillByMode, [result.mode]: nextSkill },
    streak,
    bestStreak: Math.max(profile.bestStreak, streak),
    totalXp: profile.totalXp + xp,
  };
}

export function telemetry(profile: Profile) {
  const recent = profile.results.slice(-40);
  const accuracy = recent.length ? recent.filter((r) => r.correct).length / recent.length : 0;
  const avgTime = recent.length ? recent.reduce((s, r) => s + r.elapsedMs, 0) / recent.length : 0;
  const modeAccuracy = Object.fromEntries(modes.map((mode) => {
    const rows = recent.filter((r) => r.mode === mode);
    return [mode, rows.length ? rows.filter((r) => r.correct).length / rows.length : 0];
  })) as Record<ModeId, number>;
  const meanSkill = modes.reduce((sum, mode) => sum + profile.skillByMode[mode].rating, 0) / modes.length;
  return { accuracy, avgTime, modeAccuracy, meanSkill };
}
