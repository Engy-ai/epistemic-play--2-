
import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { Investigation } from '../types';
import { healthSectorFacilities } from '../data';
import { Crosshair, ZoomIn, Play, Pause, ArrowUpRight, ShieldAlert, Globe, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  investigations: Investigation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const TimeMap: React.FC<Props> = ({ investigations, selectedId, onSelect }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const investigationMarkersRef = useRef<{ [key: string]: L.Marker }>({});
  const facilityMarkersRef = useRef<{ [key: string]: L.Marker }>({});
  const vectorsRef = useRef<L.LayerGroup | null>(null);
  const regionRef = useRef<L.LayerGroup | null>(null);

  const [currentDate, setCurrentDate] = useState<Date>(new Date('2023-11-01')); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeFacilityId, setActiveFacilityId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const startDate = useMemo(() => new Date('2023-10-07'), []);
  const endDate = useMemo(() => new Date(), []);

  const gazaStripCoords: [number, number][] = [
    [31.597, 34.530], [31.543, 34.542], [31.455, 34.475], [31.355, 34.385], [31.221, 34.254], [31.314, 34.180], [31.450, 34.350], [31.595, 34.490], [31.597, 34.530]
  ];

  const selectedInvestigation = useMemo(() => investigations.find(inv => inv.id === selectedId), [investigations, selectedId]);
  const activeFacility = useMemo(() => healthSectorFacilities.find(h => h.id === activeFacilityId), [activeFacilityId]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedId]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
    const map = L.map(mapContainerRef.current, { 
      center: [31.5049, 34.4514], 
      zoom: 13, 
      zoomControl: false, 
      attributionControl: false 
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { 
      maxZoom: 20 
    }).addTo(map);

    vectorsRef.current = L.layerGroup().addTo(map);
    regionRef.current = L.layerGroup().addTo(map);

    L.polygon(gazaStripCoords, { 
      color: '#ef4444', 
      weight: 1, 
      dashArray: '5, 10', 
      fillOpacity: 0.03, 
      interactive: false 
    }).addTo(regionRef.current);

    // Map background click to clear selection
    map.on('click', (e) => {
      // Check if clicking the map directly, not a marker
      if ((e as any).originalEvent.target.classList.contains('leaflet-container')) {
        onSelect(null as any);
        setActiveFacilityId(null);
      }
    });

    mapRef.current = map;

    // Cleanup for Strict Mode
    return () => {
      map.remove();
      mapRef.current = null;
      investigationMarkersRef.current = {};
      facilityMarkersRef.current = {};
    };
  }, []);

  // Sync Markers with Filtered Data and Time
  useEffect(() => {
    if (!mapRef.current) return;

    // 1. Remove markers for investigations that are NO LONGER in the list (filtered out)
    const currentInvIds = new Set(investigations.map(inv => inv.id));
    Object.keys(investigationMarkersRef.current).forEach(id => {
      if (!currentInvIds.has(id)) {
        investigationMarkersRef.current[id].remove();
        delete investigationMarkersRef.current[id];
      }
    });

    // 2. Process active investigations
    investigations.forEach(inv => {
      if (!inv.location) return;
      
      const isPublished = new Date(inv.publicationDate) <= currentDate;
      let marker = investigationMarkersRef.current[inv.id];

      if (isPublished) {
        const isActive = inv.id === selectedId;
        const html = `
          <div class="investigation-marker-wrapper relative group">
            <div class="marker-inner border-2 ${isActive ? 'active border-red-500 scale-125' : 'border-white/50 scale-100'} transition-all duration-300" 
                 style="width: ${isActive ? '68px' : '56px'}; height: ${isActive ? '68px' : '56px'}; border-radius: 0px; background: black;">
              <img src="${inv.media[0]?.url || ''}" class="w-full h-full object-cover" />
              <div class="absolute bottom-0 inset-x-0 bg-red-600 text-[7px] font-black text-white text-center py-1 uppercase tracking-tighter">${inv.outlet.split(' ')[0]}</div>
            </div>
            <div class="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-black border border-zinc-800 pointer-events-none ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'} transition-all duration-300 whitespace-nowrap z-[3000]">
               <div class="text-[7px] font-black text-red-500 uppercase tracking-[0.2em] mb-0.5">Inquiry Focus</div>
               <div class="text-[9px] font-black text-white uppercase tracking-tighter">${inv.primaryEpistemicObject}</div>
            </div>
          </div>
        `;

        if (!marker) {
          marker = L.marker([inv.location.lat, inv.location.lng], { 
            icon: L.divIcon({ 
              className: 'investigation-marker-container', 
              html, 
              iconSize: [80, 80], 
              iconAnchor: [40, 40] 
            }) 
          }).addTo(mapRef.current!).on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            onSelect(inv.id);
            setActiveFacilityId(null);
          });
          investigationMarkersRef.current[inv.id] = marker;
        } else { 
          marker.setIcon(L.divIcon({ 
            className: 'investigation-marker-container', 
            html, 
            iconSize: [80, 80], 
            iconAnchor: [40, 40] 
          })); 
        }
      } else if (marker) { 
        marker.remove(); 
        delete investigationMarkersRef.current[inv.id]; 
      }
    });

    // 3. Process facilities
    healthSectorFacilities.forEach(f => {
      const isCurrentlyHit = f.incidents.some(inc => new Date(inc.date).toDateString() === currentDate.toDateString());
      const hasBeenHit = f.incidents.some(inc => new Date(inc.date) <= currentDate);
      const isActive = f.id === activeFacilityId;
      
      const nodeClasses = [
        "facility-node",
        "relative",
        "w-8",
        "h-8",
        isActive ? 'ring-2 ring-white scale-110 z-[4000]' : '',
        hasBeenHit ? 'bg-red-600 border-red-400 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-600'
      ].join(' ');

      const iconColor = hasBeenHit ? 'white' : 'currentColor';
      const borderBottom = hasBeenHit ? 'border-b-2 border-white/50' : 'border-b-2 border-red-500/30';

      const markerHtml = `
        <div class="${nodeClasses}" style="${borderBottom}; border-radius: 0px; transition: all 0.5s ease;">
          ${isCurrentlyHit ? '<div class="event-ping" style="border-radius: 0px;"></div>' : ''}
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="${iconColor}">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
          </svg>
        </div>
      `;

      let marker = facilityMarkersRef.current[f.id];
      if (!marker) {
        marker = L.marker([f.location.lat, f.location.lng], { 
          icon: L.divIcon({ 
            className: 'facility-marker-container', 
            html: markerHtml, 
            iconSize: [32, 32], 
            iconAnchor: [16, 16] 
          }) 
        }).addTo(mapRef.current!).on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          setActiveFacilityId(f.id);
          onSelect(null as any);
        });
        facilityMarkersRef.current[f.id] = marker;
      } else { 
        marker.setIcon(L.divIcon({ 
          className: 'facility-marker-container', 
          html: markerHtml, 
          iconSize: [32, 32], 
          iconAnchor: [16, 16] 
        })); 
      }
    });
  }, [currentDate, selectedId, investigations, activeFacilityId]);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentDate(prev => {
          const next = new Date(prev.getTime() + 24 * 60 * 60 * 1000);
          if (next > endDate) { setIsPlaying(false); return prev; }
          return next;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isPlaying, endDate]);

  return (
    <div className="flex flex-col h-[750px] w-full bg-black rounded-none overflow-hidden border border-zinc-800 shadow-2xl relative">
      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="absolute inset-0 z-0" />
        
        <div className="absolute top-6 left-6 z-[1000] pointer-events-none space-y-4 w-96">
           <div className="bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800 p-6 rounded-none shadow-2xl pointer-events-auto">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2"><Globe size={14} className="text-red-500" /> Palestine</h3>
                 <span className="text-[10px] font-mono text-zinc-500 bg-black/50 px-2 py-1 rounded-none">{currentDate.toLocaleDateString('en-GB')}</span>
              </div>
              <div className="h-1.5 bg-zinc-900 rounded-none overflow-hidden">
                <div className="h-full bg-red-600 transition-all duration-700" style={{ width: `${(currentDate.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime()) * 100}%` }} />
              </div>
           </div>

           {selectedInvestigation && (
             <div className="bg-zinc-950/95 border border-red-500/40 rounded-none shadow-2xl animate-in pointer-events-auto overflow-hidden flex flex-col">
                {/* Image Gallery in Map Card */}
                {selectedInvestigation.media.length > 0 && (
                  <div className="h-48 relative bg-black group/media">
                    <img 
                      src={selectedInvestigation.media[activeImageIndex].url} 
                      className="w-full h-full object-cover opacity-80" 
                      alt="Investigation trace"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 flex gap-2">
                       {selectedInvestigation.media.map((_, i) => (
                         <div key={i} className={`w-1.5 h-1.5 rounded-none ${i === activeImageIndex ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]' : 'bg-zinc-700'}`} />
                       ))}
                    </div>
                    {selectedInvestigation.media.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover/media:opacity-100 transition-opacity">
                         <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => (prev - 1 + selectedInvestigation.media.length) % selectedInvestigation.media.length); }} className="p-2 bg-black/60 border border-white/10 text-white"><ChevronLeft size={16} /></button>
                         <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => (prev + 1) % selectedInvestigation.media.length); }} className="p-2 bg-black/60 border border-white/10 text-white"><ChevronRight size={16} /></button>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="p-6 pt-2">
                  <div className="flex items-center gap-2 mb-4">
                     <div className="p-1.5 bg-red-600/10 border border-red-500/30">
                        <Zap size={12} className="text-red-500" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase text-red-500 tracking-[0.2em]">Inquiry Focus</span>
                        <h4 className="text-[11px] font-black text-white uppercase tracking-tighter leading-tight">
                           {selectedInvestigation.primaryEpistemicObject}
                        </h4>
                     </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">{selectedInvestigation.outlet}</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Forensic Registry Node</p>
                  </div>

                  <div className="bg-black/40 p-4 rounded-none border border-white/5 mb-4">
                    <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <ShieldAlert size={10} /> Evidentiary Claim
                    </div>
                    <p className="text-[10px] text-zinc-300 font-medium italic leading-relaxed">
                      "{selectedInvestigation.stanceShort}"
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <div className="flex flex-col">
                          <span className="text-[7px] font-black text-zinc-600 uppercase">Methods</span>
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">{selectedInvestigation.methodology[0]}, {selectedInvestigation.methodology[1]}</span>
                       </div>
                    </div>
                    <button className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 flex items-center gap-2 border-b border-red-500/20 pb-0.5">
                       View Repo <ArrowUpRight size={10} />
                    </button>
                  </div>
                </div>
             </div>
           )}

           {activeFacility && (
             <div className="bg-zinc-950/95 border border-zinc-700 p-6 rounded-none shadow-2xl animate-in pointer-events-auto">
                <h4 className="text-sm font-black text-white mb-2">{activeFacility.name}</h4>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   {activeFacility.incidents.filter(i => new Date(i.date) <= currentDate).reverse().map((inc, idx) => (
                     <div key={idx} className="relative pl-5 border-l-2 border-zinc-800 pb-4">
                        <div className="absolute -left-[7px] top-1 w-3 h-3 bg-red-500 border-2 border-zinc-950"></div>
                        <p className="text-[11px] text-zinc-300 font-bold">{inc.description}</p>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>

        <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-3 pointer-events-auto">
           <button onClick={() => mapRef.current?.zoomIn()} className="p-4 bg-zinc-950/90 border border-zinc-800 rounded-none text-zinc-400 shadow-xl"><ZoomIn size={18} /></button>
           <button onClick={() => mapRef.current?.setView([31.5049, 34.4514], 15)} className="p-4 bg-zinc-950/90 border border-zinc-800 rounded-none text-zinc-400 shadow-xl"><Crosshair size={18} /></button>
        </div>
      </div>

      <div className="h-44 bg-zinc-950 border-t border-zinc-900 p-8 flex flex-col justify-center pointer-events-auto">
        <div className="flex items-center gap-8">
           <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 bg-red-500 text-white rounded-none flex items-center justify-center shadow-2xl transition-all">
             {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
           </button>
           <div className="flex-1">
              <input type="range" min={startDate.getTime()} max={endDate.getTime()} value={currentDate.getTime()} onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value)))} className="w-full h-2 bg-zinc-900 rounded-none appearance-none cursor-pointer accent-red-500" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default TimeMap;
