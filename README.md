# Arena Mathematica

**Arena Mathematica** is a local-first Electron application for exercising mathematical problem-solving processes rather than rote calculation. It is designed as a separate companion to ROME, with a light runtime and a focused adaptive reasoning engine.

## v0.2 arenas

1. **Pattern Forge** — induction, sequence structure, alternating rules, second-order change.
2. **Transformation Chamber** — maintain and update a mental state through chained operators.
3. **Constraint Matrix** — satisfy simultaneous ordering constraints through structured search.
4. **Proof Forge** — multi-step propositional deduction using implication chains.
5. **Orbit Engine** — modular arithmetic, orbit length, cyclic groups, and coprimality.
6. **Bayes Reactor** — base rates, sensitivity, false positives, and posterior belief.
7. **Dynamics Lab** — discrete dynamical systems, recurrence, trajectory simulation, and stability intuition.
8. **Transfer Arena** — identify the same invariant mathematical relationship under different surface representations.
9. **Hypothesis Lab** — select maximally discriminating experiments among rival mathematical models.
10. **Branch & Restore** — maintain a checkpoint, simulate one branch, restore the checkpoint, then compare another branch.
11. **Graph Command** — search weighted networks for globally optimal routes instead of greedy local moves.

## Adaptive skill model

v0.2 replaces threshold-based tier changes with a continuous per-arena latent-skill estimate. Every result updates estimated skill, uncertainty, attempted challenge, correctness, response latency, and hint assistance. The next load tier is selected from the updated estimate with a small challenge bias, while repeated misses temporarily reduce challenge. Existing v0.1 local progress migrates automatically.

## Cognitive telemetry

The engine tracks recent accuracy, mean solution time, per-arena latent skill, per-arena adaptive load, streaks, Arena XP, and hint use.

## Development

```bash
npm install
npm run build
npm run desktop:dev
```

The Electron shell loads the production Vite bundle locally. Core gameplay requires no database, background server, cloud service, or AI model.

## macOS Apple Silicon package

```bash
npm run dist:mac
```

The build configuration targets macOS `arm64` and emits DMG/ZIP artifacts under `release/`.

> The first development builds are unsigned. macOS Gatekeeper may require the user to explicitly approve opening them. Code signing and notarization should be added before general distribution.

## Design principles

- **Procedural generation over static question banks.** Training should not collapse into memorizing individual puzzles.
- **Representation switching.** Transfer trials vary surface context while preserving mathematical structure.
- **Adaptive cognitive load.** Difficulty should increase structural burden—not merely use larger numbers.
- **Reasoning cues over answer cues.** Hints point toward strategies such as checkpoint restoration or global path comparison without revealing the solution.
- **Local-first performance.** No database, server, or native computational dependency is required for the core exercise loop.
- **Scientific restraint.** Arena improvement is evidence of learning the trained reasoning tasks; broad far transfer must be measured separately.

## Roadmap

- Session composer combining multiple arenas into a single workout
- Optimization Foundry for constrained resource allocation
- Game Theory Arena with procedural strategic opponents
- Mental arithmetic / complex-span arena
- richer Hypothesis Lab experiments with sequential information-gain scoring
- graph connectivity, flow, matching, and constrained routing
- continuous/calculus systems beyond discrete recurrences
- reserved transfer-test trials separated from training trials
- longitudinal telemetry and exportable local data
- optional ROME interoperability without runtime coupling

## License

MIT
