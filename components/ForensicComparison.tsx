
import React from 'react';
import { Investigation } from '../types';
import { ArrowLeftRight, Target, MessageSquareQuote, FileCheck2, Wrench, Link2, Lightbulb, TriangleAlert } from 'lucide-react';

interface Props {
  investigationA: Investigation | null;
  investigationB: Investigation | null;
}

/* ------------------------------------------------------------------ */
/*  Method concept normalisation                                       */
/*  Different investigations phrase the same technique differently     */
/*  (e.g. "Doppler effect mapping" vs "Doppler curve computational     */
/*  modelling" vs "Doppler shift analysis"). We map raw method labels  */
/*  to canonical concepts so related methods register as shared and    */
/*  the comparison reflects that they build on each other.             */
/* ------------------------------------------------------------------ */

const CONCEPT_RULES: { match: RegExp; concept: string }[] = [
  { match: /doppler|spectrogram/i, concept: 'Doppler curve analysis' },
  { match: /acoust|audio|\bsound\b/i, concept: 'Acoustic analysis' },
  { match: /trajector/i, concept: 'Trajectory reconstruction' },
  { match: /triangulat/i, concept: 'Triangulation' },
  { match: /photogrammetry|photo-?match/i, concept: 'Photogrammetry' },
  { match: /3d|simulation|computational|modelling|modeling/i, concept: 'Computational / 3D modelling' },
  { match: /satellite/i, concept: 'Satellite imagery' },
  { match: /geolocation/i, concept: 'Video geolocation' },
  { match: /crater|damage|blast/i, concept: 'Crater / damage analysis' },
  { match: /radar|launch detection/i, concept: 'Radar / launch detection' },
  { match: /intercept/i, concept: 'Intercept analysis' },
  { match: /shadow/i, concept: 'Shadow analysis' },
  { match: /timing|temporal/i, concept: 'Timing analysis' },
  { match: /munition|weapon/i, concept: 'Munition analysis' },
  { match: /aircraft/i, concept: 'Aircraft trajectory' },
  { match: /classified|intelligence/i, concept: 'Classified intelligence' },
];

const methodConcepts = (method: string): string[] => {
  const hits = CONCEPT_RULES.filter(r => r.match.test(method)).map(r => r.concept);
  return hits.length ? Array.from(new Set(hits)) : [method];
};

const conceptSet = (inv: Investigation): Set<string> => {
  const s = new Set<string>();
  inv.methodology.forEach(m => methodConcepts(m).forEach(c => s.add(c)));
  return s;
};

const ForensicComparison: React.FC<Props> = ({ investigationA, investigationB }) => {
  if (!investigationA || !investigationB) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 p-12 bg-[var(--bg-panel)] border border-dashed border-[var(--border)] rounded-2xl text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/40 flex items-center justify-center">
          <ArrowLeftRight size={20} className="text-[var(--accent)]" />
        </div>
        <h3 className="text-base font-bold text-[var(--text)]">Compare two investigations</h3>
        <p className="text-sm text-[var(--text-muted)] max-w-sm leading-relaxed">
          Pick any two investigations from the list to see how their questions, conclusions, and methods line up side by side.
        </p>
      </div>
    );
  }

  const conceptsA = conceptSet(investigationA);
  const conceptsB = conceptSet(investigationB);
  const sharedMethods = Array.from(conceptsA).filter(c => conceptsB.has(c));

  // A raw method tag counts as shared if any of its concepts appears in the
  // other investigation's concept set.
  const isSharedMethod = (method: string, side: 'left' | 'right') => {
    const other = side === 'left' ? conceptsB : conceptsA;
    return methodConcepts(method).some(c => other.has(c));
  };

  const objectsIncompatible = investigationA.primaryEpistemicObject !== investigationB.primaryEpistemicObject;
  const noSharedTime = investigationA.publicationDate !== investigationB.publicationDate && !sharedMethods.includes('Timing analysis');
  const outcomeIncompatible = investigationA.outcomeForm !== investigationB.outcomeForm;

  const convergence = Math.round((sharedMethods.length / Math.max(conceptsA.size, conceptsB.size)) * 100);

  const notes: { label: string; tip: string }[] = [];
  if (objectsIncompatible) notes.push({ label: 'They asked different questions', tip: 'Each investigation set out to answer a structurally different question.' });
  if (noSharedTime) notes.push({ label: 'No shared moment in time', tip: 'They analysed different time references, so timing-based claims do not line up.' });
  if (outcomeIncompatible) notes.push({ label: 'Different kinds of conclusions', tip: 'One reaches a narrative conclusion while the other produces a model — hard to compare directly.' });

  const Field: React.FC<{ icon: React.ReactNode; label: string; align: 'left' | 'right'; children: React.ReactNode }> = ({ icon, label, align, children }) => (
    <div>
      <div className={`flex items-center gap-1.5 mb-2 text-[var(--text-muted)] ${align === 'right' ? 'justify-end' : ''}`}>
        {align === 'left' && icon}
        <span className="text-xs font-semibold">{label}</span>
        {align === 'right' && icon}
      </div>
      {children}
    </div>
  );

  const ComparisonColumn = ({ inv, side }: { inv: Investigation, side: 'left' | 'right' }) => {
    const align = side;
    return (
      <div className={`flex-1 min-w-0 flex flex-col gap-6 ${side === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
        <div className={`w-full ${side === 'right' ? 'items-end' : 'items-start'} flex flex-col`}>
          <h4 className="text-lg font-bold text-[var(--text)] leading-tight">{inv.outlet}</h4>
          <span className="mt-1 text-sm text-[var(--text-muted)]">{inv.actorType}</span>
        </div>

        <Field icon={<Target size={13} className="text-[var(--accent)]" />} label="What they focused on" align={align}>
          <div className="inline-block px-3 py-1.5 bg-[var(--accent)]/10 border border-[var(--accent)]/50 rounded-full text-[var(--accent)] text-xs font-semibold">
            {inv.primaryEpistemicObject}
          </div>
        </Field>

        <Field icon={<MessageSquareQuote size={13} />} label="Their conclusion" align={align}>
          <div className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-xl text-sm text-[var(--text-secondary)] leading-relaxed">
            &ldquo;{inv.stanceShort}&rdquo;
          </div>
        </Field>

        <Field icon={<FileCheck2 size={13} />} label="Form of the result" align={align}>
          <span className="text-sm font-medium text-[var(--text)]">{inv.outcomeForm}</span>
        </Field>

        <Field icon={<Wrench size={13} />} label="Methods used" align={align}>
          <div className={`flex flex-wrap gap-1.5 ${side === 'right' ? 'justify-end' : ''}`}>
            {inv.methodology.map(m => {
              const shared = isSharedMethod(m, side);
              return (
                <span
                  key={m}
                  title={shared ? 'Related to a method the other investigation uses' : undefined}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    shared
                      ? 'bg-[var(--accent)]/15 border-[var(--accent)]/50 text-[var(--accent)]'
                      : 'bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-muted)]'
                  }`}
                >
                  {m}
                </span>
              );
            })}
          </div>
        </Field>
      </div>
    );
  };

  return (
    <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 flex flex-col gap-8 w-full max-w-full min-w-0">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/40 flex items-center justify-center shrink-0">
            <ArrowLeftRight size={16} className="text-[var(--accent)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text)] leading-tight">Side-by-side comparison</h2>
            <p className="text-sm text-[var(--text-muted)]">How these two investigations relate</p>
          </div>
        </div>

        {/* Convergence meter */}
        <div className="min-w-[180px]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-[var(--text-muted)]">Method overlap</span>
            <span className="text-sm font-bold text-[var(--text)]">{convergence}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[var(--bg-elevated)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-700"
              style={{ width: `${convergence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-6 w-full min-w-0">
        <ComparisonColumn inv={investigationA} side="left" />

        <div className="flex md:flex-col items-center justify-center gap-4 md:px-2 shrink-0">
          <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-strong)] flex items-center justify-center text-xs font-bold text-[var(--text-muted)]">
            vs
          </div>
          <div className="flex flex-col gap-2 items-center max-w-[180px]">
            {sharedMethods.length > 0 ? (
              <>
                <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                  <Link2 size={13} className="text-[var(--accent)]" />
                  <span className="text-xs font-semibold">What they share</span>
                </div>
                {sharedMethods.map((m, i) => (
                  <div key={i} className="px-3 py-1 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/50 text-xs font-medium text-[var(--accent)] text-center break-words">
                    {m}
                  </div>
                ))}
              </>
            ) : (
              <div className="text-xs text-[var(--text-muted)] text-center leading-relaxed">
                These two use entirely different methods.
              </div>
            )}
          </div>
        </div>

        <ComparisonColumn inv={investigationB} side="right" />
      </div>

      {/* Things to keep in mind */}
      {notes.length > 0 && (
        <div className="rounded-xl border border-[var(--stance-uncertain)]/40 bg-[var(--stance-uncertain)]/5 p-4">
          <div className="flex items-center gap-2 mb-2 text-[var(--stance-uncertain)]">
            <TriangleAlert size={14} />
            <span className="text-sm font-semibold">Worth keeping in mind</span>
          </div>
          <ul className="space-y-1.5">
            {notes.map((n, i) => (
              <li key={i} className="text-sm text-[var(--text-secondary)] leading-relaxed">
                <span className="font-semibold text-[var(--text)]">{n.label}.</span> {n.tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Takeaway */}
      <div className="rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/40 p-4 flex items-start gap-3">
        <Lightbulb size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-semibold text-[var(--text)] mb-0.5">The bigger picture</div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Comparing these side by side reveals a relationship you won&rsquo;t find in either investigation
            on its own — it only becomes visible when you look at their different questions and methods together.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForensicComparison;
