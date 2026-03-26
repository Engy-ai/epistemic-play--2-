
import React, { useState } from 'react';
import { Investigation } from '../types';

interface Props {
  investigation: Investigation;
  isHighlighted: boolean;
  onSelect: () => void;
  methodHighlight: string;
}

const InvestigationCard: React.FC<Props> = ({ investigation, isHighlighted, onSelect, methodHighlight }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const getActorColor = (type: string) => {
    if (type.includes("State")) return "border-red-500 text-red-400 bg-red-500/5";
    if (type.includes("NGO")) return "border-emerald-500 text-emerald-400 bg-emerald-500/5";
    if (type.includes("Newsroom")) return "border-amber-500 text-amber-400 bg-amber-500/5";
    return "border-purple-500 text-purple-400 bg-purple-500/5";
  };

  const nextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMediaIndex((prev) => (prev + 1) % investigation.media.length);
  };

  const prevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMediaIndex((prev) => (prev - 1 + investigation.media.length) % investigation.media.length);
  };

  return (
    <div 
      onClick={onSelect}
      className={`group relative flex flex-col bg-zinc-900 border transition-all duration-500 rounded-none overflow-hidden cursor-pointer h-full ${
        isHighlighted 
          ? 'border-red-500 ring-1 ring-red-500 shadow-2xl shadow-red-500/20' 
          : 'border-zinc-800 hover:border-zinc-700 shadow-xl'
      }`}
    >
      {investigation.media.length > 0 && (
        <div className="h-64 overflow-hidden border-b border-zinc-800 relative bg-black">
          <img 
            src={investigation.media[currentMediaIndex].url} 
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" 
            alt={investigation.media[currentMediaIndex].label} 
          />
          
          {/* Epistemic Overlay Tags */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            <div className="bg-red-600/95 backdrop-blur-md px-3 py-1.5 border border-red-400/50 flex flex-col shadow-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-white">Primary epistemic object: {investigation.primaryEpistemicObject}</span>
              </div>
            </div>
          </div>

          {/* Gallery Navigation */}
          {investigation.media.length > 1 && (
            <>
              <button 
                onClick={prevMedia}
                className="absolute left-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-[9px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 rounded-none uppercase tracking-widest"
              >
                PREV
              </button>
              <button 
                onClick={nextMedia}
                className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-[9px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 rounded-none uppercase tracking-widest"
              >
                NEXT
              </button>
            </>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
             <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
               Trace interpretation (Conjectural reading of indicia)
             </div>
          </div>
        </div>
      )}

      <div className="p-8 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h3 className="text-lg font-bold leading-tight text-white mb-1 group-hover:text-red-400 transition-colors uppercase tracking-tight">
              {investigation.title}
            </h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{investigation.outlet}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
             <div className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">Epistemic Actor</div>
             <div className={`inline-block px-2 py-1 rounded-none text-[8px] font-black uppercase tracking-widest border ${getActorColor(investigation.actorType)}`}>
               {investigation.actorType}
             </div>
          </div>
          <div className="space-y-1">
             <div className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">Publication</div>
             <div className="text-[10px] text-zinc-300 font-bold font-mono">{investigation.publicationDate}</div>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">Outcome Form</div>
            <div className="bg-zinc-800/40 p-3 border border-zinc-800 text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
              {investigation.outcomeForm}
            </div>
          </div>

          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">Data translation (Synchronization, alignment, modeling)</div>
            <div className="flex flex-wrap gap-1.5">
              {investigation.methodology.map(m => (
                <span key={m} className={`px-2 py-1 rounded-none text-[8px] font-black uppercase border transition-all ${m === methodHighlight ? 'border-blue-500 text-blue-400 bg-blue-500/20' : 'border-zinc-800 text-zinc-500 bg-zinc-800/20'}`}>
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-black/40 p-4 border-l-2 border-red-500/30">
            <div className="text-[8px] font-black text-red-500 uppercase tracking-[0.3em] mb-2">Claim Closure</div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium italic">"{investigation.stanceShort}"</p>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800 mt-auto flex justify-between items-center">
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700">SHA-256 Indexed</span>
          <div className="flex gap-3">
            {investigation.links.slice(0, 1).map(link => (
              <a 
                key={link.url} 
                href={link.url} 
                target="_blank" 
                className="text-zinc-500 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest"
                onClick={e => e.stopPropagation()}
              >
                LINK
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationCard;
