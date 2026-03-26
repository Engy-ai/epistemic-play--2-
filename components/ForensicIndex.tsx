
import React, { useState } from 'react';
import { Investigation, Facility } from '../types';
import { healthSectorFacilities } from '../data';

interface Props {
  investigations: Investigation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCompare?: (ids: string[]) => void;
}

const ForensicIndex: React.FC<Props> = ({ investigations, selectedId, onSelect, onCompare }) => {
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareMode, setIsCompareMode] = useState(false);

  const getStanceColor = (stance: string) => {
    if (stance.includes("Challenges") || stance.includes("Israeli")) return "text-red-500";
    if (stance.includes("Palestinian") || stance.includes("Supports")) return "text-emerald-500";
    return "text-amber-500";
  };

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
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-none flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">
            Forensic Node Index
          </h3>
          <button 
            onClick={() => {
              setIsCompareMode(!isCompareMode);
              if (!isCompareMode && onCompare) onCompare([]);
            }}
            className={`px-3 py-1 rounded-none border transition-all text-[9px] font-black uppercase tracking-widest ${
              isCompareMode ? 'bg-red-500 border-red-400 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
            }`}
            title="Toggle Comparison Mode"
          >
            COMPARE
          </button>
        </div>
        
        {isCompareMode && (
          <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-none animate-in fade-in zoom-in-95 duration-200">
             <p className="text-[9px] font-black text-red-500 uppercase tracking-widest leading-tight">
               Comparison Mode Active: Select 2 nodes
             </p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        <div className="px-4 py-2">
          <h4 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-4">
            Investigations
          </h4>
          {investigations.map(inv => {
            const isComparing = compareList.includes(inv.id);
            const isSelected = selectedId === inv.id;
            
            return (
              <button
                key={inv.id}
                onClick={() => handleEntryClick(inv.id)}
                className={`w-full text-left p-3 rounded-none transition-all flex flex-col gap-2 group mb-2 border ${
                  (isSelected && !isCompareMode) || (isComparing && isCompareMode)
                    ? 'bg-red-500/10 border-red-500/30' 
                    : 'hover:bg-zinc-800/50 border-transparent'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-none ${getStanceColor(inv.stanceShort).replace('text-', 'bg-')} shadow-[0_0_8px_rgba(239,68,68,0.4)]`} />
                    <div>
                      <div className={`text-[10px] font-black uppercase tracking-tight ${isSelected || isComparing ? 'text-red-400' : 'text-zinc-300'}`}>
                        {inv.outlet}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1 pl-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase text-zinc-600 tracking-widest truncate max-w-[180px]">
                        Primary epistemic object: {inv.primaryEpistemicObject}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 bg-black/40 border-t border-zinc-800 text-[8px] font-mono text-zinc-600 uppercase tracking-widest text-center">
        EPISTEMIC_REGISTRY_v1.0 // CACHE_LIVE
      </div>
    </div>
  );
};

export default ForensicIndex;
