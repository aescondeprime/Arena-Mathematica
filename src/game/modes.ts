import type { ModeDefinition } from './types';

export const MODES: ModeDefinition[] = [
  { id: 'patterns', name: 'Pattern Forge', shortName: 'FORGE', description: 'Infer hidden generating rules from changing mathematical states.', loop: 'Observe → Hypothesize → Predict', domains: ['Sequences', 'Induction', 'Number theory'], target: 'Rule induction' },
  { id: 'transform', name: 'Transformation Chamber', shortName: 'VECTOR', description: 'Hold a state in mind while successive operators mutate it.', loop: 'Represent → Transform → Update', domains: ['Linear algebra', 'Geometry', 'Functions'], target: 'Working-memory manipulation' },
  { id: 'constraints', name: 'Constraint Matrix', shortName: 'MATRIX', description: 'Search a solution space while preserving multiple simultaneous constraints.', loop: 'Constrain → Search → Eliminate', domains: ['Combinatorics', 'Graph theory', 'Optimization'], target: 'Constraint reasoning' },
  { id: 'proof', name: 'Proof Forge', shortName: 'PROOF', description: 'Construct and audit chains of necessary implication.', loop: 'Premise → Deduce → Verify', domains: ['Logic', 'Proof', 'Set reasoning'], target: 'Deductive depth' },
  { id: 'orbit', name: 'Orbit Engine', shortName: 'ORBIT', description: 'Reason through cyclic systems using modular arithmetic and coprimality.', loop: 'Map cycle → Find invariant → Predict', domains: ['Modular arithmetic', 'Number theory', 'Cyclic groups'], target: 'Cyclic reasoning' },
  { id: 'bayes', name: 'Bayes Reactor', shortName: 'BAYES', description: 'Update beliefs from base rates, noisy evidence, and conditional likelihoods.', loop: 'Prior → Evidence → Posterior', domains: ['Probability', 'Statistics', 'Bayesian inference'], target: 'Uncertainty reasoning' },
  { id: 'dynamics', name: 'Dynamics Lab', shortName: 'DYNAMICS', description: 'Simulate discrete dynamical systems and reason about trajectories and stability.', loop: 'State → Evolve → Compare', domains: ['Recurrence', 'Dynamical systems', 'Calculus intuition'], target: 'Causal simulation' },
  { id: 'transfer', name: 'Transfer Arena', shortName: 'TRANSFER', description: 'Recognize identical mathematical structure under different surface representations.', loop: 'Strip context → Abstract → Transfer', domains: ['Modeling', 'Isomorphism', 'Generalization'], target: 'Representation transfer' },
];
