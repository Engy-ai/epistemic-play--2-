
import React from 'react';
import { Investigation, EpistemicParadigm } from '../types';

interface Props {
  investigations: Investigation[];
}

const METHOD_COLUMNS: { key: keyof Investigation['methodProfile']; label: string }[] = [
  { key: 'video', label: 'Video' },
  { key: 'satellite', label: 'Satellite' },
  { key: 'crater', label: 'Crater / Damage' },
  { key: 'audio', label: 'Audio' },
  { key: 'modelling3d', label: '3D Modelling' },
  { key: 'trajectory', label: 'Trajectory' },
  { key: 'triangulation', label: 'Triangulation' },
  { key: 'computational', label: 'Computational' },
];

const paradigmMeta: Record<EpistemicParadigm, { title: string; description: string; color: string; border: string; bg: string }> = {
  'Conjecture-led': {
    title: 'Conjecture-led',
    description: 'Evidence, trained experts, and verification protocols are connected through inferential chains. Knowledge emerges from reading investigative traces — crater morphology, timing, witness media — into a single hypothesis.',
    color: 'text-[var(--paradigm-conjecture)]',
    border: 'border-[var(--paradigm-conjecture)]',
    bg: 'bg-paradigm-conjecture',
  },
  'Model-led': {
    title: 'Model-led',
    description: 'Data is translated into model space (3D scenes, Doppler curves, simulations). Knowledge emerges from the behaviour of the model rather than from a linear chain of conjectures.',
    color: 'text-[var(--paradigm-model)]',
    border: 'border-[var(--paradigm-model)]',
    bg: 'bg-paradigm-model',
  },
  Hybrid: {
    title: 'Hybrid',
    description: 'Combines conjecture-led evidence gathering with model-led simulation. Conjectures about munition type and aircraft trajectory are tested through computational systems where results emerge from the model.',
    color: 'text-[var(--paradigm-hybrid)]',
    border: 'border-[var(--paradigm-hybrid)]',
    bg: 'bg-paradigm-hybrid',
  },
};

const getAttributionLabel = (inv: Investigation): string => {
  if (inv.stance.includes('Israeli munition')) return 'Israeli munition';
  if (inv.stance.includes('Palestinian rocket')) return 'Palestinian rocket';
  return 'Inconclusive / uncertain';
};

const getAttributionColor = (label: string): string => {
  if (label === 'Israeli munition') return 'text-[var(--accent)] bg-stance-israeli';
  if (label === 'Palestinian rocket') return 'text-[var(--stance-palestinian)] bg-stance-palestinian';
  return 'text-[var(--stance-uncertain)] bg-stance-uncertain';
};

const shortOutlet = (outlet: string): string => {
  if (outlet.includes('Forensic Architecture')) return 'FA';
  if (outlet.includes('Human Rights Watch')) return 'HRW';
  if (outlet.includes('New York Times')) return 'NYT';
  if (outlet.includes('Washington Post')) return 'WaPo';
  if (outlet.includes('BBC')) return 'BBC';
  if (outlet.includes('Israel Defense')) return 'IDF';
  if (outlet.includes('Bellingcat')) return 'BC';
  if (outlet.includes('Michael Kobs')) return 'Kobs';
  if (outlet.includes('Maher Arar')) return 'MAB';
  if (outlet.includes('Earshot')) return 'ES';
  return outlet.slice(0, 12);
};

const TaxonomyView: React.FC<Props> = ({ investigations }) => {
  const sorted = [...investigations]
    .filter((inv) => inv.id !== 'idf')
    .sort(
      (a, b) => new Date(a.publicationDate).getTime() - new Date(b.publicationDate).getTime()
    );

  const byParadigm = (paradigm: EpistemicParadigm) =>
    sorted.filter((inv) => inv.epistemicParadigm === paradigm);

  return (
    <div className="space-y-12 w-full max-w-full min-w-0">
      {/* Paradigm overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {(['Conjecture-led', 'Model-led', 'Hybrid'] as EpistemicParadigm[]).map((paradigm) => {
          const meta = paradigmMeta[paradigm];
          const actors = byParadigm(paradigm);
          return (
            <div key={paradigm} className={`p-6 border ${meta.border} ${meta.bg} space-y-4`}>
              <div>
                <h3 className={`text-sm font-black uppercase tracking-[0.3em] ${meta.color}`}>{meta.title}</h3>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mt-3">{meta.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {actors.map((inv) => (
                  <span
                    key={inv.id}
                    className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest border ${getAttributionColor(getAttributionLabel(inv))}`}
                  >
                    {shortOutlet(inv.outlet)}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Methodology matrix */}
      <div className="space-y-4">
        <div className="flex items-center gap-6">
          <h4 className="text-[12px] font-black uppercase tracking-[0.5em] text-[var(--text-secondary)]">
            Methodology Comparison Matrix
          </h4>
          <div className="h-px flex-1 bg-[var(--bg-elevated)]" />
        </div>
        <div className="overflow-x-auto custom-scrollbar border border-[var(--border)] rounded-xl bg-[var(--bg-elevated)]">
          <table className="w-full min-w-[720px] text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-panel)]">
                <th className="p-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] sticky left-0 bg-[var(--bg-panel)] z-10">
                  Organization
                </th>
                <th className="p-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Paradigm</th>
                {METHOD_COLUMNS.map((col) => (
                  <th key={col.key} className="p-3 text-[8px] font-black uppercase tracking-widest text-[var(--text-dim)] text-center">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((inv) => (
                <tr key={inv.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-panel)] transition-colors">
                  <td className="p-3 sticky left-0 bg-[var(--bg)] z-10">
                    <div className="text-[10px] font-black text-[var(--text)] uppercase tracking-tight">{shortOutlet(inv.outlet)}</div>
                    <div className="text-[8px] text-[var(--text-dim)] font-mono mt-0.5">{inv.publicationDate}</div>
                  </td>
                  <td className="p-3">
                    <span className={`text-[8px] font-black uppercase tracking-widest ${paradigmMeta[inv.epistemicParadigm].color}`}>
                      {inv.epistemicParadigm}
                    </span>
                  </td>
                  {METHOD_COLUMNS.map((col) => (
                    <td key={col.key} className="p-3 text-center">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${inv.methodProfile[col.key] ? 'bg-[var(--accent)]' : 'bg-[var(--bg-elevated)]'}`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaxonomyView;
