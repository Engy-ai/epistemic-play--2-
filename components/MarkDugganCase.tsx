import React from 'react';
import { FileSearch, Download, ArrowUpRight } from 'lucide-react';

const MarkDugganCase: React.FC = () => {
  return (
    <section className="feature-section p-6 sm:p-10 lg:p-16 relative">
      <div className="file-header">
        <div className="flex items-end gap-3">
          <span className="file-tab">02</span>
          <div>
            <p className="file-meta section-accent-text flex items-center gap-2">
              <FileSearch size={13} /> Dossier — Tottenham, London
            </p>
            <h2 className="font-serif-display text-2xl sm:text-4xl font-medium text-[var(--text)] leading-tight">
              Mark Duggan
            </h2>
          </div>
        </div>
        <div className="file-meta text-right shrink-0">Duggan / Index<br />p.01</div>
      </div>

      <div className="max-w-2xl">
        <span className="stamp text-[var(--accent)] inline-block mb-6">File pending</span>
        <p className="text-lg leading-relaxed text-[var(--text)] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
          The shooting of Mark Duggan, London, August 2011 — a second comparative
          study in contested forensic attribution.
        </p>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed ruled-note pt-1" style={{ fontFamily: 'var(--font-serif)' }}>
          This case file is being assembled. It will mirror the Al-Ahli structure —
          spatial registry, chronology, evidence streams and a methods comparison —
          applied to the disputed ballistic and eyewitness record surrounding the
          incident and the subsequent inquiry.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-8">
          <a
            href="https://content.forensic-architecture.org/wp-content/uploads/2020/06/2020.06-Report-The-Killing-of-Mark-Duggan.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="thesis-btn-secondary px-4 py-2.5 inline-flex items-center gap-2"
          >
            <Download size={14} />
            <span>Download technical report</span>
          </a>
          <a
            href="https://github.com/forensic-architecture/models/tree/master/58"
            target="_blank"
            rel="noopener noreferrer"
            className="thesis-btn-secondary px-4 py-2.5 inline-flex items-center gap-2"
          >
            <span>Mark Duggan Investigation FA repo open source models</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default MarkDugganCase;
