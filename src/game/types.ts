export type ModeId =
  | 'patterns'
  | 'transform'
  | 'constraints'
  | 'proof'
  | 'orbit'
  | 'bayes'
  | 'dynamics'
  | 'transfer'
  | 'hypothesis'
  | 'branch'
  | 'graph';

export type Trial = {
  id: string;
  mode: ModeId;
  title: string;
  prompt: string;
  notation?: string;
  hint?: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  difficulty: number;
  cognitiveLoad: string[];
};

export type TrialResult = {
  mode: ModeId;
  correct: boolean;
  elapsedMs: number;
  difficulty: number;
  usedHint: boolean;
  timestamp: number;
};

export type SkillState = {
  rating: number;
  uncertainty: number;
  attempts: number;
  lastDelta: number;
};

export type Profile = {
  difficultyByMode: Record<ModeId, number>;
  skillByMode: Record<ModeId, SkillState>;
  results: TrialResult[];
  streak: number;
  bestStreak: number;
  totalXp: number;
};

export type ModeDefinition = {
  id: ModeId;
  name: string;
  shortName: string;
  description: string;
  loop: string;
  domains: string[];
  target: string;
};
