
import React, { useState } from 'react';
import { Investigation } from '../types';

interface Props {
  investigations: Investigation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCompare?: (ids: string[]) => void;
}

const getStanceColor = (stanceShort: string): string => {
  const s = stanceShort.toLowerCase();
  if (s.includes('israeli') || s.includes('artillery') || s.includes('idf') || s.includes('shell')) return 'var(--stance-israeli)';
  if (s.includes('palestinian') || s.includes('rocket') || s.includes('hamas')) return 'var(--stance-palestinian)';
  return 'var(--stance-uncertain)';
};

const ForensicIndex: React.FC<Props> = ({ investigations, selectedId, onSelect, onCompare }) => {
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareMode, setIsCompareMode] = useState(false);

  const handleEntryClick = (id: string) => {
    if (isCompareMode) {
      setCompareList(prev => {
        const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id].slice(-2);
        if (onCompare) onCompare(next);
        return next;
      });
    } else {
      onSelect(id);
    }
  };

  return (
    <div className="thesis-panel flex flex-col h-full overflow-hidden w-full max-w-full min-w-0 border-0 border-r border-[var(--border)]">
      <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-panel)] space-y-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="file-meta">Index</p>
            <h3 className="font-serif-display text-lg leading-none text-[var(--text)]">Investigations</h3>
          </div>
          <button
            onClick={() => {
              setIsCompareMode(!isCompareMode);
              if (!isCompareMode && onCompare) onCompare([]);
            }}
            className={`px-3 py-1 border text-[9px] font-black uppercase tracking-widest transition-all ${
              isCompareMode
                ? 'bg-[var(--accent)] border-[var(--accent-bright)] text-white'
                : 'bg-[var(--bg-elevated)] border-[var(--border-strong)] text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            COMPARE
          </button>
        </div>
        {isCompareMode && (
          <div className="bg-accent-dim border border-[var(--accent)] p-3">
            <p className="text-[9px] font-black text-[var(--accent)] uppercase tracking-widest">
              Comparison Mode Active: Select 2 nodes
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-2">
        {investigations.map(inv => {
          const isComparing = compareList.includes(inv.id);
          const isSelected = selectedId === inv.id;
          const isActive = (isSelected && !isCompareMode) || (isComparing && isCompareMode);
          const stanceColor = getStanceColor(inv.stanceShort);

          return (
            <button
              key={inv.id}
              onClick={() => handleEntryClick(inv.id)}
              className={`w-full text-left p-3 mb-1 flex flex-col gap-2 border transition-all ${
                isActive ? 'thesis-selected' : 'border-transparent hover:bg-[var(--bg-elevated)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: stanceColor, boxShadow: `0 0 8px ${stanceColor}` }}
                />
                <div className={`font-serif-display text-[15px] leading-tight break-words ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text)]'}`}>
                  {inv.outlet}
                </div>
              </div>
              <div className="pl-5">
                <span className="file-meta normal-case tracking-wide" style={{ textTransform: 'none' }}>
                  Object — {inv.primaryEpistemicObject}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex-shrink-0 p-3 border-t border-dashed border-[var(--border)] bg-[var(--bg-elevated)] file-meta text-center">
        {investigations.length} entries on file · index complete
      </div>
    </div>
  );
};

export default ForensicIndex;
