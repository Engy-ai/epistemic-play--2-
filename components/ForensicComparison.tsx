
import React from 'react';
import { Investigation } from '../types';

interface Props {
  investigationA: Investigation | null;
  investigationB: Investigation | null;
}

const ForensicComparison: React.FC<Props> = ({ investigationA, investigationB }) => {
  if (!investigationA || !investigationB) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-none">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Forensic Comparison Engine</h3>
        <p className="text-[11px] text-zinc-600 mt-2 font-bold uppercase tracking-widest text-center">
          Select two investigation nodes from the index <br/> to compare evidentiary frameworks
        </p>
      </div>
    );
  }

  const sharedMethods = investigationA.methodology.filter(m => investigationB.methodology.includes(m));
  
  // Comparability Logic
  const objectsIncompatible = investigationA.primaryEpistemicObject !== investigationB.primaryEpistemicObject;
  const methodsDivergent = sharedMethods.length === 0;
  
  const noSharedTime = investigationA.publicationDate !== investigationB.publicationDate && sharedMethods.every(m => !m.toLowerCase().includes('time') && !m.toLowerCase().includes('temporal'));
  const outcomeIncompatible = investigationA.outcomeForm !== investigationB.outcomeForm;

  const ComparisonColumn = ({ inv, side }: { inv: Investigation, side: 'left' | 'right' }) => (
    <div className={`flex-1 flex flex-col ${side === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
      <div className="mb-4">
        <div className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-2">Primary Epistemic Object</div>
        <div className="px-3 py-1 bg-red-600/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest">
           {inv.primaryEpistemicObject}
        </div>
      </div>
      
      <h4 className="text-xs font-black uppercase tracking-widest text-white mb-1">{inv.outlet}</h4>
      <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter mb-6">{inv.actorType}</div>
      
      <div className="space-y-6 w-full">
        <div>
          <div className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">Claim Closure</div>
          <div className={`p-4 rounded-none border text-[10px] font-bold leading-relaxed italic ${
            side === 'left' ? 'bg-zinc-800/40 border-zinc-700' : 'bg-zinc-900/40 border-zinc-800'
          }`}>
            "{inv.stanceShort}"
          </div>
        </div>

        <div>
          <div className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">Outcome Form</div>
          <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
            {inv.outcomeForm}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Data translation (Synchronization, alignment, modeling)</div>
          <div className={`flex flex-wrap gap-1.5 ${side === 'right' ? 'justify-end' : ''}`}>
            {inv.methodology.map(m => (
              <span key={m} className={`px-2 py-0.5 rounded-none text-[8px] font-black uppercase tracking-tighter ${
                sharedMethods.includes(m) ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-500'
              }`}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-none p-8 flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px bg-zinc-800/50 hidden md:block" />
      
      <div className="flex justify-between items-center mb-8 relative z-10">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">
          Epistemic Comparison
        </h2>
        
        <div className="flex flex-col items-end gap-2">
           {objectsIncompatible && (
             <div className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 group relative">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-500">ALERT: Incompatible epistemic objects</span>
                <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                   Investigations address structurally different questions.
                </div>
             </div>
           )}
           {noSharedTime && (
             <div className="px-4 py-1.5 bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-red-500">ALERT: No shared temporal reference</span>
             </div>
           )}
           {outcomeIncompatible && (
             <div className="px-4 py-1.5 bg-purple-500/10 border border-purple-500/30 flex items-center gap-2 group relative">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-purple-500">ALERT: Non-comparable outcome forms</span>
                <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                   Narrative closure prevents model-based comparison.
                </div>
             </div>
           )}
           <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest bg-black px-4 py-1.5 rounded-none border border-zinc-800">
              Convergence: {Math.round((sharedMethods.length / Math.max(investigationA.methodology.length, investigationB.methodology.length)) * 100)}%
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12 relative z-10">
        <ComparisonColumn inv={investigationA} side="left" />
        
        <div className="flex flex-col items-center justify-center gap-4">
           <div className="w-10 h-10 bg-black border border-zinc-700 flex items-center justify-center text-[10px] font-black text-zinc-500 rounded-none">VS</div>
           <div className="flex flex-col gap-2">
              <div className="text-[7px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-1">System-generated constraint</div>
              {sharedMethods.map((m, i) => (
                <div key={i} className="px-3 py-1 bg-zinc-800/80 rounded-none border border-zinc-700 text-[8px] font-black uppercase text-zinc-400 whitespace-nowrap">
                   {m}
                </div>
              ))}
              {methodsDivergent && (
                <div className="text-[8px] font-bold text-red-500 uppercase tracking-widest text-center mt-4">
                   ALERT: 0 Protocol Overlap
                </div>
              )}
           </div>
        </div>

        <ComparisonColumn inv={investigationB} side="right" />
      </div>

      <div className="mt-8 p-4 bg-red-600/5 border border-red-500/10 flex items-center gap-6 group relative">
         <div className="flex flex-col gap-1 shrink-0">
            <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.3em]">Synthetic Outcome</span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase italic tracking-widest">Emergent Relation</span>
         </div>
         <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
           This relation does not appear in any single source; it emerges through system-level comparison of structurally different objects of inquiry.
         </p>
      </div>
    </div>
  );
};

export default ForensicComparison;
