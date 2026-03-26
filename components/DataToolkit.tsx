
import React, { useState } from 'react';
import { ExternalLink, Database, RefreshCw, CheckCircle2, ListFilter, Monitor, ShieldCheck, Cpu } from 'lucide-react';

const DataToolkit: React.FC = () => {
  const primaryGid = "2133649872";
  const healthGid = "2084046080";
  const [activeGid, setActiveGid] = useState(primaryGid);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/1DNZoQjx6W0Qar3JyDmkXx6Cc_DqTZKF-QLXYOy34IS4/pubhtml?gid=${activeGid}&single=true&widget=false&headers=false&chrome=false`;
  const externalUrl = `https://docs.google.com/spreadsheets/d/1DNZoQjx6W0Qar3JyDmkXx6Cc_DqTZKF-QLXYOy34IS4/edit#gid=${activeGid}`;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <section className="bg-zinc-900/40 border border-zinc-800 rounded-none overflow-hidden shadow-2xl relative group">
      <div className="p-8 pb-4 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-none bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <Database className="text-red-500" size={24} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Forensic Terminal</h2>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-black/60 p-1.5 rounded-none border border-zinc-800/80 backdrop-blur-md">
          <button onClick={() => setActiveGid(primaryGid)} className={`px-5 py-2 rounded-none text-[10px] font-black uppercase tracking-widest transition-all ${activeGid === primaryGid ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Log</button>
          <button onClick={() => setActiveGid(healthGid)} className={`px-5 py-2 rounded-none text-[10px] font-black uppercase tracking-widest transition-all ${activeGid === healthGid ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Sector</button>
          <a href={externalUrl} target="_blank" className="flex items-center gap-2 px-5 py-2 bg-red-600 rounded-none text-[10px] font-black text-white uppercase tracking-widest shadow-xl">Raw Data</a>
        </div>
      </div>

      <div className="px-8 pb-8">
        <div className="relative w-full h-[750px] rounded-none overflow-hidden border border-zinc-800/80 bg-[#070708]">
          <iframe key={activeGid + (isRefreshing ? '-refreshing' : '')} src={spreadsheetUrl} className="w-full h-[103%] border-0 grayscale invert opacity-70" title="Terminal" />
        </div>
      </div>
    </section>
  );
};

export default DataToolkit;
