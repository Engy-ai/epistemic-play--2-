
import React from 'react';
import { Investigation } from '../types';

interface Props {
  investigations: Investigation[];
  highlightedId: string | null;
  onSelect: (id: string) => void;
}

const MediaPipeline: React.FC<Props> = ({ investigations, highlightedId, onSelect }) => {
  const mediaItems = investigations.flatMap(inv => 
    inv.media.map(m => ({ ...m, invId: inv.id, outlet: inv.outlet, date: inv.publicationDate }))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
      {mediaItems.map((item, idx) => (
        <button
          key={`${item.invId}-${idx}`}
          onClick={() => onSelect(item.invId)}
          className={`relative flex-shrink-0 group transition-all duration-300 ${
            highlightedId === item.invId 
              ? 'ring-2 ring-red-500 scale-105' 
              : 'opacity-70 hover:opacity-100 hover:scale-102'
          }`}
        >
          <div className="w-48 h-28 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700">
            {item.kind === 'image' ? (
              <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                <span className="text-red-500 font-black text-[10px] uppercase tracking-widest">VIDEO</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{item.date}</span>
              <span className="text-[11px] text-zinc-100 font-medium truncate">{item.outlet}</span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-zinc-500 font-medium truncate w-48 text-left">
            {item.label}
          </div>
        </button>
      ))}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MediaPipeline;
