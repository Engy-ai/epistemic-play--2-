
import React, { useState, useMemo } from 'react';
import { investigations as initialInvestigations } from './data';
import { FilterState, Investigation } from './types';
import MediaPipeline from './components/MediaPipeline';
import FilterSidebar from './components/FilterSidebar';
import InvestigationCard from './components/InvestigationCard';
import TaxonomyView from './components/TaxonomyView';
import EvidenceLogicFlow from './components/EvidenceLogicFlow';
import TimeMap from './components/TimeMap';
import Timeline from './components/Timeline';
import ForensicComparison from './components/ForensicComparison';
import ForensicIndex from './components/ForensicIndex';
import NodeIngestor from './components/NodeIngestor';
import { GitBranch, BarChart3, Clock, Map as MapIcon, Layers, Plus } from 'lucide-react';

const App: React.FC = () => {
  const [investigations, setInvestigations] = useState<Investigation[]>(initialInvestigations);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    actorType: 'all',
    mission: 'all',
    stance: 'all',
    highlightMethod: 'none',
  });

  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [isIngesting, setIsIngesting] = useState(false);
  
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
      const dateMatch = new Date(inv.publicationDate) <= currentDate;
      
      return searchMatch && actorMatch && stanceMatch && dateMatch;
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
          <span>Case File No. 17-10-2023</span>
          <span className="hidden sm:inline">Comparative Epistemology — Gaza Health Sector</span>
          <span>Folio 01 / Unverified</span>
        </div>
        <div className="flex flex-wrap justify-between items-end gap-3">
          <div className="min-w-0 flex-1">
            <p className="file-meta mb-1">Dossier — Al-Ahli Hospital</p>
            <h1 className="font-serif-display text-2xl sm:text-4xl leading-[0.95] text-[var(--text)] flex flex-wrap items-baseline gap-x-3">
              <span style={{ color: 'var(--accent)' }} className="italic">Al-Ahli</span>
              <span className="font-medium">Investigation Comparison</span>
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

      <main className="app-main flex-1 p-4 sm:p-6 space-y-16 w-full mx-auto pb-32">
        
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
          <div className="min-w-0 relative group h-full">
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
                <h2 className="font-serif-display text-2xl sm:text-4xl font-medium text-[var(--text)] leading-tight">Scientific Methods Comparison</h2>
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
          <span className="hidden sm:inline">Al-Ahli Hospital · Gaza · Oct 17 2023</span>
          <span>End of file — p.01</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
