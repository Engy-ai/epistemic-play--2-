
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
  const [isZoomed, setIsZoomed] = useState(false);
  const attribution = getAttributionLabel(investigation);

  useEffect(() => {
    if (!isZoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsZoomed(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isZoomed]);

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
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 cursor-zoom-in" 
            alt={investigation.media[currentMediaIndex].label} 
            onClick={(e) => { e.stopPropagation(); setIsZoomed(true); }}
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
            <span className="text-[var(--text-dim)]">Actor</span>
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
          <div className="file-meta text-[var(--accent)] mb-2">Summary</div>
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>{investigation.epistemicAnalysis ?? investigation.stanceShort}</p>
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

      {isZoomed && (
        <div
          className="fixed inset-0 z-[9500] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in"
          onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
            aria-label="Close image"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
          >
            <X size={20} />
          </button>

          {investigation.media.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevMedia}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-black text-white uppercase tracking-widest rounded-md transition-colors"
              >
                PREV
              </button>
              <button
                type="button"
                onClick={nextMedia}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-black text-white uppercase tracking-widest rounded-md transition-colors"
              >
                NEXT
              </button>
            </>
          )}

          <figure className="max-w-full max-h-full flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img
              src={investigation.media[currentMediaIndex].url}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              alt={investigation.media[currentMediaIndex].label}
            />
            <figcaption className="text-[11px] text-white/70 font-mono text-center px-4">
              {investigation.media[currentMediaIndex].label}
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
};

export default InvestigationCard;
