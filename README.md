# Arena Mathematica

**Arena Mathematica** is a local-first Electron application for exercising mathematical problem-solving processes rather than rote calculation. It is designed as a separate companion to ROME, with a lighter runtime and a focused adaptive reasoning engine.

## Current arenas

1. **Pattern Forge** — induction, sequence structure, alternating rules, second-order change.
2. **Transformation Chamber** — maintain and update a mental state through chained operators.
3. **Constraint Matrix** — satisfy simultaneous ordering constraints through structured search.
4. **Proof Forge** — multi-step propositional deduction using implication chains.
5. **Orbit Engine** — modular arithmetic, orbit length, cyclic groups, and coprimality.
6. **Bayes Reactor** — base rates, sensitivity, false positives, and posterior belief.
7. **Dynamics Lab** — discrete dynamical systems, recurrence, trajectory simulation, and stability intuition.
8. **Transfer Arena** — identify the same invariant mathematical relationship under different surface representations.

Each arena has its own adaptive difficulty tier. Recent correctness and solution latency modify the next tier independently. Progress is stored locally in the renderer; no account or cloud service is required.

## Cognitive telemetry

The initial engine tracks:

- recent accuracy
- mean solution time
- streak / best streak
- per-arena adaptive difficulty
- Arena XP
- hint use (stored with trial results for later scoring models)

Future versions can add search efficiency, hypothesis efficiency, branching depth, model stability, and cross-domain rule-transfer scoring.

## Development

```bash
npm install
npm run build
npm run desktop:dev
```

The Electron shell loads the production Vite bundle locally. This keeps desktop behavior close to the packaged build and avoids a persistent local server.

## macOS Apple Silicon package

```bash
npm run dist:mac
```

The build configuration targets macOS `arm64` and emits DMG/ZIP artifacts under `release/`.

> Unsigned development builds may trigger macOS Gatekeeper warnings. Code signing/notarization should be added before public distribution.

## Design principles

- **Procedural generation over static question banks.** Training should not collapse into memorizing individual puzzles.
- **Representation switching.** Transfer trials vary surface context while preserving mathematical structure.
- **Adaptive cognitive load.** Difficulty should increase the number of maintained rules, transformations, and dependencies—not merely use larger numbers.
- **Local-first performance.** No database, background server, AI model, or native dependency is required for the core exercise loop.
- **Scientific restraint.** Arena performance can measure improvement on these exercises; it does not by itself establish an increase in general intelligence or broad far transfer.

## Roadmap

- Session composer combining multiple arenas into a single workout
- Graph-theory network puzzles and optimization challenges
- Mental arithmetic / complex-span arena
- Experimental-design arena with information-gain scoring
- Dynamic systems / calculus simulation arena
- Branch-and-restore tasks inspired by mental chess calculation
- Cross-representation transfer tests separated from training trials
- Longitudinal telemetry and exportable local data
- Optional ROME interoperability without runtime coupling

## License

MIT
