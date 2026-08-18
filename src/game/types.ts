export type ModeId = 'patterns' | 'transform' | 'constraints' | 'proof' | 'orbit' | 'bayes' | 'dynamics' | 'transfer';

export type Trial = {
  id: string;
  mode: ModeId;
  title: string;
  prompt: string;
  notation?: string;
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

export type Profile = {
  difficultyByMode: Record<ModeId, number>;
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
