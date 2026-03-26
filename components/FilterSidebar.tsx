
import React from 'react';
import { FilterState } from '../types';

interface Props {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const FilterSidebar: React.FC<Props> = ({ filters, setFilters }) => {
  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-none p-6 space-y-8">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
          Search
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Title, outlet, notes..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
          Stance
        </h3>
        <div className="flex flex-wrap gap-2">
          {['all', 'Israeli munition', 'Palestinian rocket', 'Inconclusive / uncertain'].map(s => (
            <button
              key={s}
              onClick={() => updateFilter('stance', s)}
              className={`px-4 py-1.5 rounded-none text-xs font-semibold border transition-all ${
                filters.stance === s 
                  ? 'bg-red-500/10 border-red-500 text-red-500' 
                  : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
          Actor Type
        </h3>
        <select
          value={filters.actorType}
          onChange={(e) => updateFilter('actorType', e.target.value)}
          className="w-full bg-black border border-zinc-800 rounded-none px-4 py-2.5 text-sm appearance-none focus:outline-none focus:border-red-500"
        >
          <option value="all">All Actors</option>
          <option value="OSINT / research agency">OSINT / Research</option>
          <option value="NGO / human rights">NGO / Human Rights</option>
          <option value="Newsroom / media">Newsroom / Media</option>
          <option value="State actor / intelligence">State / Intel</option>
        </select>
      </div>
    </div>
  );
};

export default FilterSidebar;
