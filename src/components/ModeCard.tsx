import { ArrowUpRight } from 'lucide-react';
import type { ModeDefinition } from '../game/types';

type Props = { mode: ModeDefinition; difficulty: number; accuracy: number; onOpen: () => void };

export function ModeCard({ mode, difficulty, accuracy, onOpen }: Props) {
  return (
    <button className="mode-card" onClick={onOpen}>
      <div className="mode-topline"><span>{mode.shortName}</span><ArrowUpRight size={18} /></div>
      <h3>{mode.name}</h3>
      <p>{mode.description}</p>
      <div className="mode-loop">{mode.loop}</div>
      <div className="mode-meta">
        <span>Tier <strong>{difficulty}</strong></span>
        <span>Accuracy <strong>{accuracy ? Math.round(accuracy * 100) : '—'}{accuracy ? '%' : ''}</strong></span>
      </div>
    </button>
  );
}
