
import React from 'react';

const taxonomyData = {
  fa: {
    name: "Forensic Architecture",
    id: "FA",
    description: "Multidisciplinary spatial and architectural reconstruction.",
    color: "sky"
  },
  bc: {
    name: "Bellingcat",
    id: "BC",
    description: "OSINT collective utilizing open-source social intelligence.",
    color: "amber"
  },
  hrw: {
    name: "Human Rights Watch",
    id: "HRW",
    description: "Legal and NGO documentation for international human rights standards.",
    color: "rose"
  }
};

const categories = [
  {
    title: "Spatial & Sat-Relational Methods",
    color: "text-sky-400",
    bg: "bg-sky-400/5",
    border: "border-sky-400/20",
    methods: {
      fa: [
        "Architectural 3D modelling from UGC",
        "Camera matching & photogrammetry",
        "Satellite-to-ground trajectory mapping",
        "Material behaviour & explosion simulation"
      ],
      bc: [
        "Landmark-based satellite geolocation",
        "Visual horizon/skyline matching",
        "Military hardware and munition ID",
        "Impact crater geometry analysis"
      ],
      hrw: [
        "Incident geolocation across frames",
        "Satellite-based damage assessment",
        "Mapping of hospital grounds boundaries",
        "Visual correlation with launch origins"
      ]
    }
  },
  {
    title: "Temporal & Chronological Methods",
    color: "text-amber-400",
    bg: "bg-amber-400/5",
    border: "border-amber-400/20",
    methods: {
      fa: [
        "Audio-visual timeline synchronization",
        "Projectile flight path timing (Earshot)",
        "Shadow-based sun-path inference",
        "Physics-based sequencing of events"
      ],
      bc: [
        "Metadata and timestamp triangulation",
        "Visual sequencing of livestream data",
        "Matching TV broadcast timing",
        "Chronological launch site verification"
      ],
      hrw: [
        "Narrative timeline construction",
        "Timestamp validation of witness media",
        "Reviewing satellite revisit intervals",
        "Historical incident alignment"
      ]
    }
  },
  {
    title: "Affective, Testimonial & Visual",
    color: "text-rose-400",
    bg: "bg-rose-400/5",
    border: "border-rose-400/20",
    methods: {
      fa: [
        "Memory-driven architectural modelling",
        "Witness POV virtual walkthroughs",
        "Composite media montage analysis",
        "Visualising gaps/absences in testimony"
      ],
      bc: [
        "Crowd-sourced media annotation",
        "Social media insignia recognition",
        "Facial recognition analysis",
        "Publicly vetted verification logs"
      ],
      hrw: [
        "Trauma-informed witness interviews",
        "Co-drawing site maps with witnesses",
        "Verification of medical documentation",
        "Legal standard-based illustration"
      ]
    }
  },
  {
    title: "Forensic Verification & Provenance",
    color: "text-zinc-400",
    bg: "bg-zinc-800/10",
    border: "border-zinc-800",
    methods: {
      fa: [
        "Iterative sat–model–photo alignment",
        "Cross-modal acoustic-spatial check",
        "Uncertainty and probability mapping",
        "Collaborative public visual argument"
      ],
      bc: [
        "EXIF/metadata forensic extraction",
        "Reverse image search verification",
        "File hashing and integrity checks",
        "Open-source audit trail publication"
      ],
      hrw: [
        "Chain-of-custody for digital evidence",
        "Satellite sensor metadata validation",
        "Human rights legal standard checks",
        "Multi-agency witness corroboration"
      ]
    }
  }
];

const TaxonomyView: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Matrix Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-zinc-800 pb-12">
        {(Object.keys(taxonomyData) as Array<keyof typeof taxonomyData>).map(key => (
          <div key={key} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 bg-white`}></div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                {taxonomyData[key].name}
              </h3>
            </div>
            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed max-w-sm">
              {taxonomyData[key].description}
            </p>
          </div>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="space-y-20">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-8">
            <div className="flex items-center gap-6">
              <h4 className={`text-[12px] font-black uppercase tracking-[0.5em] ${cat.color}`}>
                {cat.title}
              </h4>
              <div className="h-px flex-1 bg-zinc-800"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* FA Column */}
              <div className={`p-8 border ${cat.border} ${cat.bg} space-y-4 relative group overflow-hidden`}>
                <div className="absolute top-0 right-0 p-3 opacity-5 font-black text-3xl group-hover:opacity-10 transition-opacity">FA</div>
                {cat.methods.fa.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-1 h-1 mt-2 ${cat.color.replace('text-', 'bg-')}`}></div>
                    <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-tight leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              {/* BC Column */}
              <div className={`p-8 border ${cat.border} ${cat.bg} space-y-4 relative group overflow-hidden`}>
                <div className="absolute top-0 right-0 p-3 opacity-5 font-black text-3xl group-hover:opacity-10 transition-opacity">BC</div>
                {cat.methods.bc.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-1 h-1 mt-2 ${cat.color.replace('text-', 'bg-')}`}></div>
                    <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-tight leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              {/* HRW Column */}
              <div className={`p-8 border ${cat.border} ${cat.bg} space-y-4 relative group overflow-hidden`}>
                <div className="absolute top-0 right-0 p-3 opacity-5 font-black text-3xl group-hover:opacity-10 transition-opacity">HRW</div>
                {cat.methods.hrw.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-1 h-1 mt-2 ${cat.color.replace('text-', 'bg-')}`}></div>
                    <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-tight leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 p-10 bg-zinc-950 border border-dashed border-zinc-800 flex flex-col items-center justify-center text-center">
        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em] mb-4">Evidentiary Protocol Convergence</p>
        <p className="text-xs text-zinc-400 max-w-3xl font-medium italic leading-relaxed">
          The alignment of these methodologies across spatial, temporal, and testimonial categories demonstrates a 
          shared epistemic standard. Despite differing organizational missions, the convergence on specific verification 
          technologies (e.g., 3D modelling, sat-to-ground correlation) establishes a unified cross-modal forensic framework.
        </p>
      </div>
    </div>
  );
};

export default TaxonomyView;
