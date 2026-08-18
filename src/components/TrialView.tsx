import { ArrowLeft, Brain, Check, ChevronRight, Lightbulb, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { generateTrial } from '../game/generators';
import type { ModeDefinition, TrialResult } from '../game/types';

type Props = { mode: ModeDefinition; difficulty: number; onBack: () => void; onResult: (result: TrialResult) => void };

export function TrialView({ mode, difficulty, onBack, onResult }: Props) {
  const [trial, setTrial] = useState(() => generateTrial(mode.id, difficulty));
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [hint, setHint] = useState(false);
  const startedAt = useRef(performance.now());
  const status = submitted ? selected === trial.correctIndex : null;
  const tierBars = useMemo(() => Array.from({ length: 8 }, (_, i) => i < trial.difficulty), [trial.difficulty]);

  const submit = () => {
    if (selected === null || submitted) return;
    const elapsedMs = performance.now() - startedAt.current;
    setSubmitted(true);
    onResult({ mode: mode.id, correct: selected === trial.correctIndex, elapsedMs, difficulty: trial.difficulty, usedHint: hint, timestamp: Date.now() });
  };

  const next = () => {
    setTrial(generateTrial(mode.id, difficulty));
    setSelected(null); setSubmitted(false); setHint(false); startedAt.current = performance.now();
  };

  return <main className="trial-shell">
    <header className="trial-header">
      <button className="icon-button" onClick={onBack}><ArrowLeft size={18}/></button>
      <div><span className="eyebrow">{mode.shortName} / ADAPTIVE TRIAL</span><h2>{mode.name}</h2></div>
      <div className="tier-indicator"><span>LOAD {trial.difficulty}</span><div>{tierBars.map((on, i) => <i className={on ? 'on' : ''} key={i}/>)}</div></div>
    </header>

    <section className="trial-stage">
      <div className="trial-kicker"><Brain size={16}/> {trial.cognitiveLoad.join(' / ')}</div>
      <h1>{trial.prompt}</h1>
      {trial.notation && <pre className="notation">{trial.notation}</pre>}
      <div className="choice-grid">{trial.choices.map((choice, index) => {
        const cls = ['choice', selected === index ? 'selected' : '', submitted && index === trial.correctIndex ? 'correct' : '', submitted && selected === index && index !== trial.correctIndex ? 'wrong' : ''].filter(Boolean).join(' ');
        return <button className={cls} key={`${choice}-${index}`} disabled={submitted} onClick={() => setSelected(index)}><span>{String.fromCharCode(65 + index)}</span><strong>{choice}</strong>{submitted && index === trial.correctIndex ? <Check size={18}/> : submitted && selected === index ? <X size={18}/> : null}</button>;
      })}</div>

      {!submitted ? <div className="trial-actions"><button className="secondary" onClick={() => setHint((v) => !v)}><Lightbulb size={16}/> {hint ? 'Hide cue' : 'Reveal cue'}</button><button className="primary" disabled={selected === null} onClick={submit}>Commit answer <ChevronRight size={17}/></button></div>
      : <div className={`feedback ${status ? 'success' : 'failure'}`}><div><strong>{status ? 'Model stable.' : 'Model failed.'}</strong><p>{trial.explanation}</p></div><button className="primary" onClick={next}>Next trial <ChevronRight size={17}/></button></div>}
      {hint && !submitted && <div className="hint">{trial.hint ?? 'Identify the invariant, dependency, or state-transition rule before calculating.'}</div>}
    </section>
  </main>;
}
