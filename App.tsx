
import React, { useState, useMemo } from 'react';
import { investigations as initialInvestigations } from './data';
import { FilterState, Investigation } from './types';
import MediaPipeline from './components/MediaPipeline';
import FilterSidebar from './components/FilterSidebar';
import InvestigationCard from './components/InvestigationCard';
import TaxonomyView from './components/TaxonomyView';
import MethodologyNetwork from './components/MethodologyNetwork';
import TimeMap from './components/TimeMap';
import Timeline from './components/Timeline';
import ForensicComparison from './components/ForensicComparison';
import ForensicIndex from './components/ForensicIndex';
import NodeIngestor from './components/NodeIngestor';
import { Network, BarChart3, Clock, Map as MapIcon, Layers, Plus } from 'lucide-react';

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
  
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2024-03-01'));

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
    <div className="min-h-screen flex flex-col font-sans selection:bg-red-500/30 bg-[#09090b] text-zinc-100">
      <header className="sticky top-0 z-[60] bg-[#09090b]/95 backdrop-blur-xl border-b border-zinc-800 px-8 py-5 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black tracking-tighter text-white uppercase flex items-center gap-3">
            <span className="text-red-500">AL AHLI</span> Investigation Comparison
          </h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold mt-1">
            Comparative Epistemology — Gaza Health Sector
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              Live Analysis Mode
            </span>
          </div>
          <button 
            onClick={() => setIsIngesting(true)}
            className="flex items-center gap-2 text-[9px] font-black px-5 py-2.5 bg-red-600 hover:bg-red-700 transition-colors border border-red-500 text-white uppercase tracking-widest shadow-lg shadow-red-500/20"
          >
            <Plus size={14} /> Stabilize New Node
          </button>
          <button 
            onClick={resetFilters}
            className="text-[9px] font-black px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 transition-colors border border-zinc-700 text-zinc-300 uppercase tracking-widest"
          >
            Reset Workspace
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-16 max-w-[1800px] mx-auto w-full pb-32">
        
        {/* 1. SPATIO-TEMPORAL MAP + FORENSIC INDEX (FIRST) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[750px]">
          <div className="lg:col-span-3 h-full">
            <ForensicIndex 
              investigations={filteredInvestigations}
              selectedId={highlightedId}
              onSelect={setHighlightedId}
              onCompare={setComparisonIds}
            />
          </div>
          <div className="lg:col-span-9 relative group h-full">
            <div className="absolute top-6 left-10 z-[10] pointer-events-none">
              <div className="bg-black/80 backdrop-blur-md border border-zinc-800 p-4 shadow-2xl flex items-center gap-4">
                <MapIcon size={16} className="text-red-500" />
                <div>
                  <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Spatial Registry</div>
                  <div className="text-[10px] font-bold text-white uppercase">{currentDate.toISOString().split('T')[0]}</div>
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
        <section className="bg-zinc-950 border border-zinc-800 p-8 shadow-2xl">
           <div className="flex items-center gap-3 text-red-500 mb-8 border-l-2 border-red-500 pl-4">
              <Layers size={20} />
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em]">Trace Evidence Pipeline</h2>
           </div>
          <MediaPipeline 
            investigations={filteredInvestigations} 
            onSelect={setHighlightedId}
            highlightedId={highlightedId}
          />
        </section>

        {/* 3. TIMELINE */}
        <section className="bg-zinc-950 border border-zinc-800 p-8 shadow-xl overflow-hidden relative">
          <div className="mb-8 flex items-center gap-4">
            <Clock size={18} className="text-zinc-500" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Investigation Chronology</h2>
          </div>
          <Timeline 
            investigations={filteredInvestigations} 
            highlightedId={highlightedId}
            onSelect={setHighlightedId}
          />
        </section>

        {/* 4. INVESTIGATION NODES (CARDS + FILTERS) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start pt-12 border-t border-zinc-800">
          <aside className="lg:sticky lg:top-32 space-y-8">
            <FilterSidebar filters={filters} setFilters={setFilters} />
            <div className="p-6 bg-red-600/5 border border-red-500/10 rounded-none">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-3">Analytical Note</h3>
               <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                 Interaction with any node here synchronizes the spatial and temporal planes above.
               </p>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-10">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Investigation Nodes</h2>
              <span className="text-[10px] text-zinc-600 font-mono">[{filteredInvestigations.length} ACTIVE]</span>
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

        {/* 5. METHODOLOGICAL CONNECTIVITY */}
        <section className="bg-zinc-950 border border-zinc-800 p-10 shadow-2xl overflow-hidden relative group/network">
          <div className="mb-10 flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                <Network className="text-red-500" /> Methodological Connectivity
              </h2>
              <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Mapping protocol convergence between actors</p>
            </div>
          </div>
          <div className="h-[500px] bg-black/40 border border-zinc-900">
             <MethodologyNetwork 
              investigations={investigations} 
              onSelect={setHighlightedId}
              selectedId={highlightedId}
             />
          </div>
        </section>

        {/* 6. SCIENTIFIC METHODS COMPARISON (TAXONOMY) */}
        <section className="bg-zinc-950 border border-zinc-800 p-10 lg:p-16 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none uppercase font-black text-7xl tracking-tighter group-hover:opacity-10 transition-opacity">
            Taxonomy
          </div>
          <div className="mb-16 space-y-2 relative z-10">
            <div className="flex items-center gap-3 text-red-500 mb-2">
               <BarChart3 size={24} />
               <span className="text-[10px] font-black uppercase tracking-[0.5em]">Methods Table</span>
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Scientific Methods Comparison</h2>
            <p className="text-sm text-zinc-500 max-w-2xl font-medium tracking-wide">
              A detailed matrix comparing the evidentiary protocols utilized by Forensic Architecture, Bellingcat, and Human Rights Watch.
            </p>
          </div>
          <TaxonomyView />
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

      <footer className="p-12 border-t border-zinc-800 bg-black/50 text-center">
        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.5em]">Independent Epistemic Workspace // Al Ahli Hospital</p>
      </footer>
    </div>
  );
};

export default App;
