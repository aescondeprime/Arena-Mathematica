# Arena Mathematica — Cognitive Design

## Objective

Arena Mathematica is designed around mathematical *operations on internal models*, not curriculum completion. The game should become harder by increasing structural load: more dependencies, deeper transformations, noisier evidence, more competing hypotheses, and less obvious representations.

## Cognitive loops

| Arena | Core loop | Primary mathematical structure | Cognitive emphasis |
| --- | --- | --- | --- |
| Pattern Forge | Observe → Hypothesize → Predict | sequences / induction | abstraction and rule inference |
| Transformation Chamber | Represent → Transform → Update | functions / vectors | working-memory manipulation |
| Constraint Matrix | Constrain → Search → Eliminate | combinatorics / ordering | constraint satisfaction and inhibition |
| Proof Forge | Premise → Deduce → Verify | propositional logic | deductive depth |
| Orbit Engine | Map cycle → Find invariant → Predict | modular arithmetic | cyclic reasoning and number theory |
| Bayes Reactor | Prior → Evidence → Posterior | conditional probability | uncertainty and base-rate reasoning |
| Dynamics Lab | State → Evolve → Compare | recurrence / dynamical systems | causal simulation |
| Transfer Arena | Strip context → Abstract → Transfer | structural equivalence | representation switching |

## Adaptive load model — v0.1

Each arena owns an independent difficulty tier from 1–8.

- The engine inspects the last four results in the active arena.
- Three or more correct responses with mean latency under 45 seconds increases the tier.
- Two consecutive incorrect responses decrease the tier.
- Difficulty is bounded to 1–8.
- Hint use is recorded now so later versions can discount assisted performance without changing the data model.

The next adaptive system should replace these simple rules with an estimated latent skill model, ideally using a Bayesian or Elo/IRT-style update that considers item difficulty, response time, hint use, and repeated exposure.

## Transfer-oriented design rules

1. **Do not equate bigger numbers with harder reasoning.** Increase the number of interacting rules before increasing raw arithmetic burden.
2. **Change surface representations.** Re-express the same invariant as symbols, geometry, networks, probability, or physical-system stories.
3. **Separate training and transfer tests.** A later version should reserve unseen representations for periodic transfer probes so training familiarity does not contaminate the measurement.
4. **Procedurally generate instances.** Static item memorization should not dominate progression.
5. **Track reasoning cost.** Correctness, latency, hints, retries, branch count, and information gained per action are more informative together than score alone.
6. **Do not claim general-intelligence gains from in-game improvement.** Far transfer must be measured separately.

## Next engine modules

### Hypothesis Lab
The player observes samples from an unknown rule and purchases a limited number of experiments. Scoring rewards information gain and penalizes redundant tests.

### Graph Command
Weighted directed networks, shortest paths, connectivity, flow, matching, and constrained routing. Later tiers should require planning without exposing all intermediate state.

### Optimization Foundry
Allocate limited resources under competing linear/nonlinear constraints. Score solution quality relative to the optimum and search cost.

### Game Theory Arena
Dominance, mixed strategies, repeated games, signaling, and adversarial reasoning against procedural opponents.

### Calculus / Continuous Systems
Reason from rates to accumulated state, compare local versus global behavior, and manipulate qualitative derivative/integral relationships before emphasizing symbolic calculation.

### Branch-and-Restore
Maintain a root state, simulate candidate mathematical operations several steps forward, discard a branch, and accurately restore the root before testing another branch. This is the mathematical analogue of deep mental-chess calculation.
