
import React, { useState } from 'react';
import { X, Save, MapPin, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Investigation, ActorType, MissionFocus, Stance } from '../types';

interface Props {
  onClose: () => void;
  onSubmit: (node: Investigation) => void;
}

const NodeIngestor: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    title: '',
    outlet: '',
    actorType: 'Newsroom / media' as ActorType,
    stanceShort: '',
    publicationDate: new Date().toISOString().split('T')[0],
    primaryEpistemicObject: '',
    outcomeForm: '',
    keyFindings: '',
    lat: 31.5049,
    lng: 34.4514,
    mediaUrl: '',
    mediaLabel: '',
  });

  const [methods, setMethods] = useState<string[]>([]);
  const [newMethod, setNewMethod] = useState('');

  const handleAddMethod = () => {
    if (newMethod && !methods.includes(newMethod)) {
      setMethods([...methods, newMethod]);
      setNewMethod('');
    }
  };

  const handleSave = () => {
    const newNode: Investigation = {
      id: `node-${Date.now()}`,
      title: form.title || 'Untitled Investigation',
      outlet: form.outlet || 'Independent Researcher',
      actorType: form.actorType,
      mission: ['Open-source intelligence'] as MissionFocus[],
      stance: ['Inconclusive / uncertain'] as Stance[],
      stanceShort: form.stanceShort || 'No summary provided.',
      publicationDate: form.publicationDate,
      country: 'N/A',
      methodology: methods.length > 0 ? methods : ['Manual Observation'],
      dataInputs: ['Open source media'],
      keyFindings: form.keyFindings || 'Awaiting further evidence.',
      links: [],
      media: form.mediaUrl ? [{ kind: 'image', label: form.mediaLabel || 'Trace', url: form.mediaUrl }] : [],
      primaryEpistemicObject: form.primaryEpistemicObject || 'Contextual data',
      outcomeForm: form.outcomeForm || 'Report',
      location: {
        lat: form.lat,
        lng: form.lng,
        label: form.title || 'New Node'
      }
    };
    onSubmit(newNode);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-xl h-full bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tighter">Data Ingestion Terminal</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Adding new node to Forensic Registry</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Metadata Section */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-red-500 uppercase tracking-[0.3em]">Core Identification</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Investigation Title</label>
                <input 
                  type="text" 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-red-500 outline-none transition-all uppercase font-bold"
                  placeholder="e.g. VISUAL RECONSTRUCTION OF IMPACT SITE"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Outlet / Actor</label>
                  <input 
                    type="text" 
                    value={form.outlet} 
                    onChange={e => setForm({...form, outlet: e.target.value})}
                    className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-red-500 outline-none transition-all uppercase font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Actor Type</label>
                  <select 
                    value={form.actorType} 
                    onChange={e => setForm({...form, actorType: e.target.value as ActorType})}
                    className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-red-500 outline-none transition-all uppercase font-bold"
                  >
                    <option value="OSINT / research agency">OSINT / Research</option>
                    <option value="NGO / human rights">NGO / Human Rights</option>
                    <option value="Newsroom / media">Newsroom / Media</option>
                    <option value="Collective / community OSINT">Collective OSINT</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Spatial Ingestion */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-red-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <MapPin size={12} /> Spatial Coordinates
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-zinc-900/30 p-4 border border-zinc-800">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Latitude</label>
                <input 
                  type="number" 
                  step="0.0001"
                  value={form.lat} 
                  onChange={e => setForm({...form, lat: parseFloat(e.target.value)})}
                  className="w-full bg-black border border-zinc-800 p-3 text-xs font-mono text-zinc-400 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Longitude</label>
                <input 
                  type="number" 
                  step="0.0001"
                  value={form.lng} 
                  onChange={e => setForm({...form, lng: parseFloat(e.target.value)})}
                  className="w-full bg-black border border-zinc-800 p-3 text-xs font-mono text-zinc-400 outline-none"
                />
              </div>
            </div>
            <p className="text-[8px] text-zinc-600 font-mono">Note: Al Ahli default is 31.5049, 34.4514</p>
          </div>

          {/* Epistemic Ingestion */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-red-500 uppercase tracking-[0.3em]">Epistemic Framework</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Object of Inquiry</label>
                <input 
                  type="text" 
                  value={form.primaryEpistemicObject} 
                  onChange={e => setForm({...form, primaryEpistemicObject: e.target.value})}
                  className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-red-500 outline-none uppercase font-bold"
                  placeholder="e.g. CRATER MORPHOLOGY"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Claim Summary</label>
                <textarea 
                  value={form.stanceShort} 
                  onChange={e => setForm({...form, stanceShort: e.target.value})}
                  className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-red-500 outline-none min-h-[80px]"
                  placeholder="Short summary of investigation's conclusion..."
                />
              </div>
            </div>
          </div>

          {/* Methodology Builder */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-red-500 uppercase tracking-[0.3em]">Protocol Overlap (Methods)</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newMethod} 
                  onChange={e => setNewMethod(e.target.value)}
                  className="flex-1 bg-black border border-zinc-800 p-3 text-sm focus:border-red-500 outline-none"
                  placeholder="Add methodology tag..."
                  onKeyDown={e => e.key === 'Enter' && handleAddMethod()}
                />
                <button 
                  onClick={handleAddMethod}
                  className="px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black text-[10px] uppercase border border-zinc-700"
                >
                  ADD
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {methods.map(m => (
                  <span key={m} className="px-3 py-1 bg-red-600/10 border border-red-500/30 text-red-500 text-[9px] font-black uppercase flex items-center gap-2">
                    {m} <button onClick={() => setMethods(methods.filter(x => x !== m))}><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Media Links */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-red-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <ImageIcon size={12} /> Trace Visuals
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Image URL</label>
                <input 
                  type="text" 
                  value={form.mediaUrl} 
                  onChange={e => setForm({...form, mediaUrl: e.target.value})}
                  className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-red-500 outline-none"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Label</label>
                <input 
                  type="text" 
                  value={form.mediaLabel} 
                  onChange={e => setForm({...form, mediaLabel: e.target.value})}
                  className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-red-500 outline-none uppercase font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-zinc-800 bg-zinc-900/50 flex justify-end gap-4">
           <button 
            onClick={onClose}
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-black text-[10px] uppercase tracking-widest border border-zinc-700 transition-all"
           >
             Discard
           </button>
           <button 
            onClick={handleSave}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-500/20 border border-red-500 flex items-center gap-3 transition-all active:scale-95"
           >
             <Save size={16} /> Stabilize Node
           </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #09090b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
        }
      `}</style>
    </div>
  );
};

export default NodeIngestor;
