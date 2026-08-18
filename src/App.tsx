import { Atom, RotateCcw, Sigma } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ModeCard } from './components/ModeCard';
import { Telemetry } from './components/Telemetry';
import { TrialView } from './components/TrialView';
import { MODES } from './game/modes';
import { applyResult, defaultProfile, loadProfile, saveProfile, telemetry } from './game/profile';
import type { ModeId, Profile, TrialResult } from './game/types';

function App() {
  const [profile, setProfile] = useState<Profile>(() => loadProfile());
  const [activeMode, setActiveMode] = useState<ModeId | null>(null);
  const stats = useMemo(() => telemetry(profile), [profile]);
  const mode = MODES.find((m) => m.id === activeMode);

  useEffect(() => saveProfile(profile), [profile]);

  const record = (result: TrialResult) => setProfile((p) => applyResult(p, result));

  if (mode) return <TrialView mode={mode} difficulty={profile.difficultyByMode[mode.id]} onBack={() => setActiveMode(null)} onResult={record}/>;

  return <div className="app-shell">
    <div className="ambient ambient-one"/><div className="ambient ambient-two"/>
    <header className="topbar">
      <div className="brand"><div className="sigil"><Sigma size={21}/></div><div><strong>ARENA MATHEMATICA</strong><span>Adaptive reasoning laboratory</span></div></div>
      <div className="status"><i/> LOCAL ENGINE / READY</div>
    </header>

    <main className="dashboard">
      <section className="hero">
        <div className="hero-copy"><span className="eyebrow">COGNITIVE SYSTEM / 01</span><h1>Train the <em>process</em>,<br/>not the answer.</h1><p>Five mathematical arenas isolate induction, mental transformation, constraint search, deduction, and cross-representation transfer. Difficulty adapts independently by domain.</p></div>
        <div className="hero-mark"><Atom size={64}/><span>AXIOM ENGINE</span><strong>v0.1</strong></div>
      </section>

      <Telemetry profile={profile}/>

      <section className="section-head"><div><span className="eyebrow">SELECT ARENA</span><h2>Mathematical systems</h2></div><button className="reset" onClick={() => { if (confirm('Reset all local Arena Mathematica progress?')) setProfile(defaultProfile()); }}><RotateCcw size={15}/> Reset telemetry</button></section>
      <section className="mode-grid">{MODES.map((m) => <ModeCard key={m.id} mode={m} difficulty={profile.difficultyByMode[m.id]} accuracy={stats.modeAccuracy[m.id]} onOpen={() => setActiveMode(m.id)}/>)}</section>

      <footer><span>Experimental cognitive-training software. Performance gains inside the arena do not establish broad intelligence transfer.</span><span>LOCAL-FIRST / NO ACCOUNT REQUIRED</span></footer>
    </main>
  </div>;
}

export default App;
