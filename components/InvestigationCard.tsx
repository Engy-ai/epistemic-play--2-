
import React, { useState } from 'react';
import { Investigation, EpistemicParadigm } from '../types';

interface Props {
  investigation: Investigation;
  isHighlighted: boolean;
  onSelect: () => void;
  methodHighlight: string;
}

const paradigmColor: Record<EpistemicParadigm, string> = {
  'Conjecture-led': 'text-[var(--paradigm-conjecture)]',
  'Model-led': 'text-[var(--paradigm-model)]',
  Hybrid: 'text-[var(--paradigm-hybrid)]',
};

const getAttributionLabel = (inv: Investigation): string => {
  if (inv.stance.includes('Israeli munition')) return 'Israeli munition';
  if (inv.stance.includes('Palestinian rocket')) return 'Palestinian rocket';
  return 'Inconclusive / uncertain';
};

const getAttributionStampColor = (label: string): string => {
  if (label === 'Israeli munition') return 'text-[var(--accent)]';
  if (label === 'Palestinian rocket') return 'text-[var(--stance-palestinian)]';
  return 'text-[var(--stance-uncertain)]';
};

const InvestigationCard: React.FC<Props> = ({ investigation, isHighlighted, onSelect, methodHighlight }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const attribution = getAttributionLabel(investigation);

  const getActorColor = (type: string) => {
    if (type.includes("State")) return "border-[var(--accent)] text-[var(--accent)] bg-stance-israeli";
    if (type.includes("NGO")) return "border-[var(--stance-palestinian)] text-[var(--stance-palestinian)] bg-stance-palestinian";
    if (type.includes("Newsroom")) return "border-[var(--stance-uncertain)] text-[var(--stance-uncertain)] bg-stance-uncertain";
    if (type.includes("Independent")) return "border-[var(--paradigm-hybrid)] text-[var(--paradigm-hybrid)] bg-paradigm-hybrid";
    return "border-[var(--text-muted)] text-[var(--text-muted)] bg-[var(--bg-elevated)]";
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
      className={`group relative flex flex-col bg-[var(--bg-panel)] border transition-all duration-500 rounded-2xl overflow-hidden cursor-pointer h-full ${
        isHighlighted 
          ? 'border-[var(--accent)] thesis-selected' 
          : 'border-[var(--border)] hover:border-[var(--border-strong)] shadow-sm hover:shadow-md'
      }`}
    >
      {investigation.media.length > 0 && (
        <div className="h-48 sm:h-56 lg:h-64 overflow-hidden border-b border-[var(--border)] relative bg-[var(--bg-elevated)]">
          <img 
            src={investigation.media[currentMediaIndex].url} 
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" 
            alt={investigation.media[currentMediaIndex].label} 
          />
          
          {/* Gallery Navigation */}
          {investigation.media.length > 1 && (
            <>
              <button 
                onClick={prevMedia}
                className="absolute left-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-[9px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--accent)]  uppercase tracking-widest"
              >
                PREV
              </button>
              <button 
                onClick={nextMedia}
                className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-[9px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--accent)]  uppercase tracking-widest"
              >
                NEXT
              </button>
            </>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
             <div className="file-meta text-white/85">
               Trace interpretation — conjectural reading of indicia
             </div>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
        <div className="file-header !mb-4">
          <span className="file-meta">Entry · {investigation.outlet}</span>
          <span className="file-meta shrink-0">{investigation.publicationDate}</span>
        </div>

        <div className="flex justify-between items-start gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-serif-display text-xl sm:text-2xl leading-tight text-[var(--text)] mb-1 group-hover:text-[var(--accent)] transition-colors">
              {investigation.title}
            </h3>
            <p className={`file-meta ${paradigmColor[investigation.epistemicParadigm]}`}>
              {investigation.epistemicParadigm} · {investigation.outcomeForm}
            </p>
          </div>
          <span className={`stamp shrink-0 mt-1 ${getAttributionStampColor(attribution)}`}>
            {attribution}
          </span>
        </div>

        <div className="ruled-note bg-[var(--bg-elevated)] p-4 border border-[var(--border)] rounded-md mb-6">
          <div className="file-meta mb-2">Central question</div>
          <p className="text-[13px] text-[var(--text-secondary)] italic leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>"{investigation.centralQuestion}"</p>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed mt-3" style={{ fontFamily: 'var(--font-serif)' }}>{investigation.primaryEpistemicObject}</p>
        </div>

        <div className="space-y-2 mb-6">
          <div className="leader-row">
            <span className="text-[var(--text-dim)]">Epistemic actor</span>
            <span className="leader-fill" />
            <span className={`shrink-0 ${getActorColor(investigation.actorType).split(' ').find(c => c.startsWith('text-')) || 'text-[var(--text-secondary)]'}`}>{investigation.actorType}</span>
          </div>
          <div className="leader-row">
            <span className="text-[var(--text-dim)]">Filed</span>
            <span className="leader-fill" />
            <span className="text-[var(--text-secondary)] shrink-0">{investigation.publicationDate}</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="file-meta mb-3">Data translation — synchronization, alignment, modeling</div>
          <div className="flex flex-wrap gap-1.5">
            {investigation.methodology.map(m => (
              <span key={m} className={`font-doc-mono px-2 py-1 text-[9px] uppercase tracking-wide border rounded transition-all ${m === methodHighlight ? 'border-[var(--accent)] text-[var(--accent)] bg-accent-dim' : 'border-[var(--border)] text-[var(--text-muted)] bg-[var(--bg-elevated)]'}`}>
                {m}
              </span>
            ))}
          </div>
        </div>

        <div className="ruled-note bg-[var(--bg-elevated)] p-4 border-l-2 border-[var(--accent)] rounded-r-md mb-2">
          <div className="file-meta text-[var(--accent)] mb-2">Attribution / claim closure</div>
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed italic" style={{ fontFamily: 'var(--font-serif)' }}>"{investigation.stanceShort}"</p>
        </div>

        <div className="pt-5 border-t border-dashed border-[var(--border)] mt-auto flex justify-between items-center">
          <span className="file-meta">SHA-256 indexed</span>
          <div className="flex gap-3">
            {investigation.links.slice(0, 1).map(link => (
              <a 
                key={link.url} 
                href={link.url} 
                target="_blank" 
                className="file-meta hover:text-[var(--text)] transition-colors"
                onClick={e => e.stopPropagation()}
              >
                Open ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationCard;
