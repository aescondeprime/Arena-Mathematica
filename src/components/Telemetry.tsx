import { BrainCircuit, Gauge, Timer, Trophy } from 'lucide-react';
import type { Profile } from '../game/types';
import { telemetry } from '../game/profile';

export function Telemetry({ profile }: { profile: Profile }) {
  const stats = telemetry(profile);
  const items = [
    { icon: BrainCircuit, label: 'Recent accuracy', value: profile.results.length ? `${Math.round(stats.accuracy * 100)}%` : '—' },
    { icon: Timer, label: 'Mean solve', value: stats.avgTime ? `${(stats.avgTime / 1000).toFixed(1)}s` : '—' },
    { icon: Gauge, label: 'Current streak', value: String(profile.streak) },
    { icon: Trophy, label: 'Arena XP', value: profile.totalXp.toLocaleString() },
  ];
  return <div className="telemetry">{items.map(({ icon: Icon, label, value }) => <div className="telemetry-item" key={label}><Icon size={17}/><div><span>{label}</span><strong>{value}</strong></div></div>)}</div>;
}
