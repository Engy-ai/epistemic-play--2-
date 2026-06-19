
import React, { useState, useMemo } from 'react';
import { investigations as initialInvestigations } from './data';
import { FilterState, Investigation } from './types';
import MediaPipeline from './components/MediaPipeline';
import FilterSidebar from './components/FilterSidebar';
import InvestigationCard from './components/InvestigationCard';
import TaxonomyView from './components/TaxonomyView';
import TimeMap from './components/TimeMap';
import Timeline from './components/Timeline';
import ForensicComparison from './components/ForensicComparison';
import ForensicIndex from './components/ForensicIndex';
import NodeIngestor from './components/NodeIngestor';
import ThesisBook from './components/ThesisBook';
import MarkDugganCase from './components/MarkDugganCase';
import EvidenceLogicFlow from './components/EvidenceLogicFlow';
import { GitBranch, BarChart3, Clock, Map as MapIcon, Layers, Plus, Minus, Download, BookOpen, FileSearch } from 'lucide-react';

type CaseTab = 'al-ahli' | 'mark-duggan' | 'book';

const App: React.FC = () => {
  const [investigations, setInvestigations] = useState<Investigation[]>(initialInvestigations);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    actorType: 'all',
    mission: 'all',
    stance: 'all',
    paradigm: 'all',
    highlightMethod: 'none',
  });

  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [isIngesting, setIsIngesting] = useState(false);
  const [activeCase, setActiveCase] = useState<CaseTab>('al-ahli');
  const [introOpen, setIntroOpen] = useState(true);
  
  const [currentDate] = useState<Date>(() => new Date());

  const filteredInvestigations = useMemo(() => {
    return investigations.filter((inv) => {
      const searchMatch = (
        inv.title + 
        inv.outlet + 
        inv.keyFindings + 
        inv.stanceShort
      ).toLowerCase().includes(filters.search.toLowerCase());

      const actorMatch = filters.actorType === 'all' || inv.actorType === filters.actorType;
      const stanceMatch = filters.stance === 'all' || inv.stance.includes(filters.stance as any);
      const paradigmMatch = filters.paradigm === 'all' || inv.epistemicParadigm === filters.paradigm;
      const dateMatch = new Date(inv.publicationDate) <= currentDate;
      
      return searchMatch && actorMatch && stanceMatch && paradigmMatch && dateMatch;
    });
  }, [investigations, filters, currentDate]);

  const handleAddNode = (newNode: Investigation) => {
    setInvestigations(prev => [...prev, newNode]);
    setIsIngesting(false);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      actorType: 'all',
      mission: 'all',
      stance: 'all',
      paradigm: 'all',
      highlightMethod: 'none',
    });
    setHighlightedId(null);
    setComparisonIds([]);
  };

  const invA = comparisonIds[0] ? investigations.find(i => i.id === comparisonIds[0]) || null : null;
  const invB = comparisonIds[1] ? investigations.find(i => i.id === comparisonIds[1]) || null : null;

  return (
    <div className="app-shell min-h-screen flex flex-col font-sans selection:bg-[var(--accent)]/30 bg-[var(--bg)] text-[var(--text)] overflow-x-hidden">
      <header className="w-full min-w-0 z-[60] bg-[var(--bg)]/95 backdrop-blur-xl border-b border-[var(--border)] px-4 sm:px-6 lg:px-8 pt-3 pb-5">
        <div className="file-meta flex items-center justify-between gap-3 pb-3 mb-3 border-b border-dashed border-[var(--border)]">
          <span>By Federico Zurani and Engy El Shenawy</span>
          <span className="hidden sm:inline">investigative models</span>
          <a href={`${import.meta.env.BASE_URL}thesis.pdf`} target="_blank" rel="noopener noreferrer" className="thesis-btn-secondary px-3 py-1.5 inline-flex items-center gap-2">
            <Download size={14} />
            <span>Download thesis</span>
          </a>
        </div>
        <div className="flex flex-wrap justify-between items-end gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="font-serif-display text-xl sm:text-3xl leading-tight text-[var(--text)] flex flex-wrap items-center gap-x-3 gap-y-0 max-w-xl">
              <span style={{ color: '#000000' }} className="font-moslin text-lg sm:text-2xl">Investigative models</span>
              <span className="font-sans font-medium text-sm sm:text-base">— Towards the definition of an epistemic framework of OSINT</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setIsIngesting(true)}
              className="thesis-btn-primary flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5"
            >
              <Plus size={14} /> <span className="hidden sm:inline">Add source</span><span className="sm:hidden">Add</span>
            </button>
            <button 
              onClick={resetFilters}
              className="thesis-btn-secondary px-3 sm:px-5 py-2 sm:py-2.5"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      <div className="w-full border-b border-[var(--border)] bg-[var(--bg)] z-[55]">
        <div className="case-tabbar">
          <button
            className={`case-tab ${activeCase === 'al-ahli' ? 'active' : ''}`}
            onClick={() => setActiveCase('al-ahli')}
          >
            <Layers size={13} /> Al-Ahli
          </button>
          <button
            className={`case-tab ${activeCase === 'mark-duggan' ? 'active' : ''}`}
            onClick={() => setActiveCase('mark-duggan')}
          >
            <FileSearch size={13} /> Mark Duggan
          </button>
          <button
            className={`case-tab ${activeCase === 'book' ? 'active' : ''}`}
            onClick={() => setActiveCase('book')}
          >
            <BookOpen size={13} /> Thesis Book
          </button>
        </div>
      </div>

      {activeCase === 'mark-duggan' && (
        <main className="app-main flex-1 p-4 sm:p-6 w-full mx-auto pb-32 pt-12">
          <MarkDugganCase />
        </main>
      )}

      {activeCase === 'book' && (
        <main className="app-main flex-1 p-4 sm:p-6 w-full mx-auto pb-32 pt-12 flex justify-center">
          <ThesisBook />
        </main>
      )}

      {activeCase === 'al-ahli' && (
      <main className="app-main flex-1 p-4 sm:p-6 space-y-16 w-full mx-auto pb-32">

        {/* 0. CASE INTRODUCTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start -mb-10">
          <div className="lg:col-span-4">
            <p className="file-meta section-accent-text mb-3">Case opening · Al-Ahli Hospital</p>
            <button
              type="button"
              onClick={() => setIntroOpen((v) => !v)}
              aria-expanded={introOpen}
              aria-label={introOpen ? 'Collapse case opening' : 'Expand case opening'}
              className="flex items-center gap-3 text-left group/intro"
            >
              <span className="flex items-center justify-center w-6 h-6 shrink-0 border border-[var(--border-strong)] rounded-full text-[var(--text)] group-hover/intro:bg-[var(--bg-elevated)] transition-colors">
                {introOpen ? <Minus size={14} /> : <Plus size={14} />}
              </span>
              {introOpen && (
                <h2 className="font-serif-display text-xl sm:text-2xl font-medium text-black leading-tight group-hover/intro:text-[var(--accent)] transition-colors">
                  Archive of Investigations
                </h2>
              )}
            </button>
            {introOpen && (
              <blockquote
                className="mt-4 pl-4 border-l-2 border-[var(--accent)] text-[14px] leading-relaxed text-[var(--text-secondary)] italic"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                &ldquo;Palestinian officials say an Israeli strike caused the blast, while Israeli
                military say it was caused by a failed rocket launch by militant group Islamic
                Jihad.&rdquo;
                <cite className="block mt-2 not-italic text-[12px] text-[var(--text-muted)] font-mono">
                  — Bellingcat
                </cite>
              </blockquote>
            )}
          </div>
          {introOpen && (
          <div
            className="lg:col-span-8 space-y-4 text-[15px] sm:text-base leading-relaxed text-[var(--text-secondary)] text-right"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            <p className="file-meta invisible select-none !mt-0" aria-hidden="true">Case opening</p>
            <p>
              On 17 October 2023, an explosion at al-Ahli Hospital in Gaza-Palestine killed hundreds
              of people. In the days, weeks, months and years that followed, the incident became the
              subject of more than ten separate investigations by states, media organisations, human
              rights groups, and independent OSINT researchers. These inquiries drew on largely
              overlapping open-source material, yet arrived at very different and, in some cases,
              mutually incompatible conclusions about the cause of the blast and damage.
            </p>
            <p>
              What makes this divergence remarkable is not the disagreement itself but the conditions
              under which it occurs. Many organisations involved in the investigation shared similar
              intentions, professional backgrounds, and normative commitments to human rights and
              evidentiary rigour. Yet despite this shared horizon, their analyses of the al-Ahli
              Hospital explosion produced not convergence but divergence: a proliferation of
              competing &ldquo;truths,&rdquo; each internally coherent, evidence-based, and often
              methodologically sophisticated.
            </p>
          </div>
          )}
        </section>

        {/* 1. SPATIO-TEMPORAL MAP + FORENSIC INDEX (FIRST) */}
        <section className="hero-grid lg:h-[750px]">
          <div className="min-w-0 h-[420px] lg:h-[750px]">
            <ForensicIndex 
              investigations={filteredInvestigations}
              selectedId={highlightedId}
              onSelect={setHighlightedId}
              onCompare={setComparisonIds}
            />
          </div>
          <div className="min-w-0 relative group h-[420px] lg:h-full">
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-[10] pointer-events-none">
              <div className="bg-[var(--bg-panel)]/90 backdrop-blur-md border border-[var(--border)] rounded-xl p-4 shadow-lg flex items-center gap-4">
                <MapIcon size={16} className="text-[var(--accent)]" />
                <div>
                  <div className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">Spatial Registry</div>
                  <div className="text-[10px] font-bold text-[var(--text)] uppercase">{currentDate.toISOString().split('T')[0]}</div>
                </div>
              </div>
            </div>
            <TimeMap 
              investigations={investigations} 
              selectedId={highlightedId}
              onSelect={setHighlightedId}
            />
          </div>
        </section>

        {/* 2. TRACE EVIDENCE PIPELINE */}
        <section className="panel-section feature-section tint-amber p-4 sm:p-6 lg:p-8">
           <div className="file-header">
              <div className="flex items-end gap-3">
                 <span className="file-tab">01</span>
                 <div>
                    <p className="file-meta section-accent-text flex items-center gap-2"><Layers size={13} /> Exhibit · Trace evidence</p>
                    <h2 className="font-serif-display text-2xl sm:text-3xl font-medium text-[var(--text)] leading-tight">Trace Evidence Pipeline</h2>
                 </div>
              </div>
              <div className="file-meta text-right shrink-0">Al-Ahli / Trace<br/>p.01</div>
           </div>
          <MediaPipeline 
            investigations={filteredInvestigations} 
            onSelect={setHighlightedId}
            highlightedId={highlightedId}
          />
        </section>

        {/* 3. TIMELINE */}
        <section className="panel-section feature-section tint-blue p-4 sm:p-6 lg:p-8 relative">
          <div className="file-header">
            <div className="flex items-end gap-3">
              <span className="file-tab">02</span>
              <div>
                <p className="file-meta section-accent-text flex items-center gap-2"><Clock size={13} /> Chronology · Logged entries</p>
                <h2 className="font-serif-display text-2xl sm:text-3xl font-medium text-[var(--text)] leading-tight">Investigation Chronology</h2>
              </div>
            </div>
            <div className="file-meta text-right shrink-0">Al-Ahli / Time<br/>p.02</div>
          </div>
          <Timeline 
            investigations={filteredInvestigations} 
            highlightedId={highlightedId}
            onSelect={setHighlightedId}
          />
        </section>

        {/* 4. INVESTIGATION NODES (CARDS + FILTERS) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start pt-12 border-t border-[var(--border)] w-full min-w-0">
          <aside className="lg:sticky lg:top-32 space-y-8 min-w-0">
            <FilterSidebar filters={filters} setFilters={setFilters} />
            <div className="p-6 bg-[var(--bg-panel)] border border-[var(--border)] rounded-lg shadow-sm relative">
               <span className="stamp text-[var(--accent)] absolute -top-3 right-4">Margin note</span>
               <h3 className="file-meta text-[var(--text)] mb-3">Marginalia</h3>
               <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed ruled-note pt-1" style={{ fontFamily: 'var(--font-serif)' }}>
                 Selecting any entry cross-references it on the map and the chronology above.
               </p>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-10 min-w-0">
            <div className="file-header !mb-0 pb-4">
              <div className="flex items-end gap-3">
                <span className="file-tab" style={{ ['--section-accent' as any]: 'var(--text)' }}>03</span>
                <div>
                  <p className="file-meta">Entries · Central questions &amp; attribution</p>
                  <h2 className="font-serif-display text-2xl sm:text-3xl font-medium text-[var(--text)] leading-tight">Case Entries</h2>
                </div>
              </div>
              <span className="file-meta shrink-0">{filteredInvestigations.length} filed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
              {filteredInvestigations.map((inv) => (
                <InvestigationCard 
                  key={inv.id} 
                  investigation={inv} 
                  isHighlighted={highlightedId === inv.id}
                  onSelect={() => setHighlightedId(inv.id)}
                  methodHighlight={filters.highlightMethod}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 5. EVIDENCE LOGIC FLOW */}
        <section className="feature-section tint-accent p-4 sm:p-6 lg:p-10 relative">
          <div className="file-header">
            <div className="flex items-end gap-3">
              <span className="file-tab">04</span>
              <div>
                <p className="file-meta section-accent-text flex items-center gap-2"><GitBranch size={13} /> Reasoning · Evidence streams &amp; outcomes</p>
                <h2 className="font-serif-display text-2xl sm:text-3xl font-medium text-[var(--text)] leading-tight">Evidence Logic</h2>
              </div>
            </div>
            <div className="file-meta text-right shrink-0">Al-Ahli / Logic<br/>p.04</div>
          </div>
          <div className="w-full min-w-0">
            <EvidenceLogicFlow />
          </div>
        </section>

        {/* 6. SCIENTIFIC METHODS COMPARISON (TAXONOMY) */}
        <section className="feature-section tint-violet p-4 sm:p-8 lg:p-12 relative group">
          <div className="file-header">
            <div className="flex items-end gap-3">
              <span className="file-tab">05</span>
              <div>
                <p className="file-meta section-accent-text flex items-center gap-2"><BarChart3 size={13} /> Appendix · Methods table</p>
                <h2 className="font-serif-display text-2xl sm:text-4xl font-medium text-[var(--text)] leading-tight">Evidential Paradigm</h2>
              </div>
            </div>
            <div className="file-meta text-right shrink-0">Al-Ahli / Methods<br/>p.05</div>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl mb-8 sm:mb-12 -mt-2" style={{ fontFamily: 'var(--font-serif)' }}>
            Comparative matrix of all ten Al-Ahli case studies mapped to conjecture-led, model-led, and hybrid epistemic paradigms.
          </p>
          <TaxonomyView investigations={investigations} />
        </section>

        {/* Dynamic Comparison Suite (Overlay-style) */}
        {comparisonIds.length > 0 && (
          <section className="animate-in slide-in-from-bottom-6 duration-700">
             <ForensicComparison investigationA={invA} investigationB={invB} />
          </section>
        )}
      </main>
      )}

      {/* Ingestor Modal */}
      {isIngesting && (
        <NodeIngestor 
          onClose={() => setIsIngesting(false)} 
          onSubmit={handleAddNode} 
        />
      )}

      <footer className="w-full px-6 sm:px-10 py-10 border-t border-[var(--border)] bg-[var(--bg-panel)]">
        <div className="file-meta flex flex-wrap items-center justify-between gap-3 max-w-6xl mx-auto">
          <span>Independent Epistemic Workspace</span>
          <span>End of file — p.01</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
