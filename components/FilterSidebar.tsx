
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
    <div className="bg-[var(--bg-panel)] border border-[var(--border)]  p-6 space-y-8">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-2">
          Search
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Title, outlet, notes..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-2">
          Stance
        </h3>
        <div className="flex flex-wrap gap-2">
          {['all', 'Israeli munition', 'Palestinian rocket', 'Inconclusive / uncertain'].map(s => (
            <button
              key={s}
              onClick={() => updateFilter('stance', s)}
              className={`px-4 py-1.5  text-xs font-semibold border transition-all ${
                filters.stance === s 
                  ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]' 
                  : 'bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-2">
          Actor Type
        </h3>
        <select
          value={filters.actorType}
          onChange={(e) => updateFilter('actorType', e.target.value)}
          className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm appearance-none focus:outline-none focus:border-[var(--accent)]"
        >
          <option value="all">All Actors</option>
          <option value="OSINT / research agency">OSINT / Research</option>
          <option value="NGO / human rights">NGO / Human Rights</option>
          <option value="Newsroom / media">Newsroom / Media</option>
          <option value="State actor / intelligence">State / Intel</option>
          <option value="Collective / community OSINT">Collective OSINT</option>
          <option value="Independent researcher">Independent Researcher</option>
        </select>
      </div>
    </div>
  );
};

export default FilterSidebar;
