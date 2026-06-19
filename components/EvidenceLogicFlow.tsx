
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface Props {
  onSelect?: (id: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Themed palette — mirrors the site's paradigm colour logic          */
/*    conjecture-led  → amber   (--paradigm-conjecture)                 */
/*    model-led       → blue    (--paradigm-model)                      */
/*    ruled-out       → accent  (--accent)                              */
/*    institutional   → neutral (--bg-elevated / --border-strong)       */
/*    event / outcome → accent-framed neutral                          */
/* ------------------------------------------------------------------ */

type Fill =
  | 'event'
  | 'question'
  | 'evidence'
  | 'evidenceDashed'
  | 'conjecture'
  | 'model'
  | 'ruled'
  | 'idf'
  | 'outcome';

interface VStyle {
  background: string;
  border: string;
  title: string;
}

const mix = (token: string, pct: number) =>
  `color-mix(in srgb, var(${token}) ${pct}%, var(--bg-panel))`;

const variantStyle = (fill: Fill, prominent?: boolean): VStyle => {
  switch (fill) {
    case 'event':
    case 'outcome':
      return {
        background: 'var(--bg-elevated)',
        border: '2px solid var(--accent)',
        title: 'var(--text)',
      };
    case 'question':
      return {
        background: 'var(--bg-panel)',
        border: '1.5px solid var(--border-strong)',
        title: 'var(--text)',
      };
    case 'evidence':
      return {
        background: 'var(--bg-panel)',
        border: '1.5px solid var(--border)',
        title: 'var(--text)',
      };
    case 'evidenceDashed':
      return {
        background: 'var(--bg-elevated)',
        border: '1.5px dashed var(--border-strong)',
        title: 'var(--text)',
      };
    case 'conjecture':
      return {
        background: mix('--paradigm-conjecture', 10),
        border: `${prominent ? 2.5 : 1.5}px solid var(--paradigm-conjecture)`,
        title: 'var(--paradigm-conjecture)',
      };
    case 'model':
      return {
        background: mix('--paradigm-model', 10),
        border: `${prominent ? 2.5 : 1.5}px solid var(--paradigm-model)`,
        title: 'var(--paradigm-model)',
      };
    case 'ruled':
      return {
        background: mix('--accent', 10),
        border: `${prominent ? 2.5 : 1.5}px solid var(--accent)`,
        title: 'var(--accent)',
      };
    case 'idf':
      return {
        background: 'var(--bg-elevated)',
        border: '1.5px solid var(--border-strong)',
        title: 'var(--text-secondary)',
      };
  }
};

/* ------------------------------------------------------------------ */
/*  Box                                                                */
/* ------------------------------------------------------------------ */

const Box: React.FC<{
  fill: Fill;
  title: string;
  body?: string;
  meta?: string;
  prominent?: boolean;
  boxRef?: (el: HTMLDivElement | null) => void;
}> = ({ fill, title, body, meta, prominent, boxRef }) => {
  const s = variantStyle(fill, prominent);
  return (
    <div
      ref={boxRef}
      className="h-full flex flex-col gap-1"
      style={{
        background: s.background,
        border: s.border,
        borderRadius: 12,
        padding: '8px 11px',
        boxShadow: 'var(--shadow-soft)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 12.5, lineHeight: 1.2, color: s.title }}>
        {title}
      </div>
      {body && (
        <div style={{ fontSize: 10.5, lineHeight: 1.32, color: 'var(--text-secondary)' }}>
          {body}
        </div>
      )}
      {meta && (
        <div
          style={{
            fontSize: 9.5,
            lineHeight: 1.3,
            color: 'var(--text-muted)',
            fontWeight: 600,
            marginTop: 'auto',
          }}
        >
          {meta}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Layout helpers                                                     */
/* ------------------------------------------------------------------ */

const Layer: React.FC<{ columns: number; children: React.ReactNode; maxWidth?: number }> = ({
  columns,
  children,
  maxWidth,
}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      gap: 10,
      maxWidth: maxWidth ?? '100%',
      margin: '0 auto',
      width: '100%',
    }}
  >
    {children}
  </div>
);

const SectionLabels: React.FC = () => {
  const pill = (token: string): React.CSSProperties => ({
    display: 'inline-block',
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: `var(${token})`,
    padding: '3px 12px',
    borderRadius: 999,
    border: `1px solid var(${token})`,
    background: mix(token, 8),
  });
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <span style={pill('--paradigm-conjecture')}>Conjecture-led analysis</span>
      </div>
      <div style={{ textAlign: 'center' }}>
        <span style={pill('--paradigm-model')}>Model-led analysis</span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Connection map  (parent → child, dashed = secondary)               */
/* ------------------------------------------------------------------ */

type Conn = [from: string, to: string, dashed?: boolean];

const CONNECTIONS: Conn[] = [
  // Event → questions
  ['event', 'qWho'],
  ['event', 'qMun'],
  // Questions → evidence streams
  ['qWho', 'crater'],
  ['qWho', 'sky'],
  ['qWho', 'audio'],
  ['qMun', 'crater', true],
  ['qMun', 'sat'],
  ['qMun', 'audio', true],
  // Evidence → methods
  ['crater', 'ballistic'],
  ['sky', 'geo'],
  ['sky', 'traj3d'],
  ['audio', 'audioX'],
  ['audio', 'doppler'],
  ['sat', 'ballistic', true],
  ['sat', 'traj3d', true],
  // Methods → findings (directly below)
  ['ballistic', 'craterF'],
  ['geo', 'launchF'],
  ['audioX', 'freqF'],
  ['traj3d', 'hamasF'],
  ['doppler', 'dirF'],
  // Findings → munition candidates
  ['craterF', 'hamasRocket'],
  ['craterF', 'gbu39', true],
  ['launchF', 'ironDome'],
  ['freqF', 'israeliStrike'],
  ['hamasF', 'israeliStrike'],
  ['hamasF', 'ironDome', true],
  ['dirF', 'israeliStrike'],
  ['dirF', 'gbu39'],
  // Munition → IDF claim & rebuttals
  ['hamasRocket', 'idf'],
  ['ironDome', 'idf'],
  ['israeliStrike', 'interceptEdited', true],
  ['gbu39', 'swRuled', true],
  // IDF claim challenged by rebuttals
  ['idf', 'interceptEdited'],
  ['idf', 'swRuled'],
  // Claim / rebuttals → limits
  ['idf', 'noRemains'],
  ['idf', 'night'],
  ['interceptEdited', 'siteInacc'],
  ['swRuled', 'partiality'],
  // Limits converge → outcome
  ['noRemains', 'outcome'],
  ['night', 'outcome'],
  ['siteInacc', 'outcome'],
  ['partiality', 'outcome'],
];

/* ------------------------------------------------------------------ */
/*  Legend                                                             */
/* ------------------------------------------------------------------ */

const Swatch: React.FC<{ fill: Fill }> = ({ fill }) => {
  const s = variantStyle(fill);
  return (
    <span
      style={{
        background: s.background,
        border: s.border,
        borderRadius: 5,
        width: 18,
        height: 18,
        flexShrink: 0,
        display: 'inline-block',
      }}
    />
  );
};

const LegendItem: React.FC<{ children: React.ReactNode; label: string }> = ({
  children,
  label,
}) => (
  <div className="flex items-center" style={{ gap: 7 }}>
    {children}
    <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{label}</span>
  </div>
);

const Legend: React.FC = () => (
  <div
    style={{
      marginTop: 22,
      paddingTop: 14,
      borderTop: '1px solid var(--border)',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px 22px',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 1,
    }}
  >
    <LegendItem label="Conjecture-led method / finding">
      <Swatch fill="conjecture" />
    </LegendItem>
    <LegendItem label="Model-led method / finding">
      <Swatch fill="model" />
    </LegendItem>
    <LegendItem label="Ruled out / limit / insufficient">
      <Swatch fill="ruled" />
    </LegendItem>
    <LegendItem label="Institutional (IDF) — unverifiable">
      <Swatch fill="idf" />
    </LegendItem>
    <LegendItem label="Event / unresolved outcome">
      <Swatch fill="event" />
    </LegendItem>
    <LegendItem label="Analytical flow">
      <span className="flex items-center">
        <span style={{ width: 22, height: 0, borderTop: '2px solid var(--border-strong)' }} />
        <span
          style={{
            width: 0,
            height: 0,
            borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent',
            borderLeft: '6px solid var(--border-strong)',
          }}
        />
      </span>
    </LegendItem>
    <LegendItem label="Secondary / connective relationship">
      <span className="flex items-center">
        <span style={{ width: 22, height: 0, borderTop: '1.5px dashed var(--text-dim)' }} />
        <span
          style={{
            width: 0,
            height: 0,
            borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent',
            borderLeft: '6px solid var(--text-dim)',
          }}
        />
      </span>
    </LegendItem>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Diagram                                                            */
/* ------------------------------------------------------------------ */

const EvidenceLogicFlow: React.FC<Props> = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [paths, setPaths] = useState<{ d: string; dashed: boolean }[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const setRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      boxRefs.current[id] = el;
    },
    [],
  );

  const compute = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wr = wrap.getBoundingClientRect();
    const next: { d: string; dashed: boolean }[] = [];
    for (const [from, to, dashed] of CONNECTIONS) {
      const a = boxRefs.current[from];
      const b = boxRefs.current[to];
      if (!a || !b) continue;
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      const x1 = ar.left + ar.width / 2 - wr.left;
      const y1 = ar.bottom - wr.top;
      const x2 = br.left + br.width / 2 - wr.left;
      const y2 = br.top - wr.top;
      const my = (y1 + y2) / 2;
      next.push({
        d: `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`,
        dashed: !!dashed,
      });
    }
    setSize({ w: wrap.scrollWidth, h: wrap.scrollHeight });
    setPaths(next);
  }, []);

  useLayoutEffect(() => {
    compute();
    const ro = new ResizeObserver(() => compute());
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener('resize', compute);
    // Recompute once fonts have settled (box heights can shift).
    const t = window.setTimeout(compute, 350);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', compute);
      window.clearTimeout(t);
    };
  }, [compute]);

  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <div
        ref={wrapRef}
        style={{
          color: 'var(--text)',
          minWidth: 720,
          maxWidth: 940,
          margin: '0 auto',
          padding: '4px 0 8px',
          position: 'relative',
        }}
      >
        {/* SVG connector overlay */}
        <svg
          width={size.w}
          height={size.h}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 0,
            overflow: 'visible',
          }}
          aria-hidden
        >
          <defs>
            <marker
              id="ev-arrow"
              viewBox="0 0 10 10"
              markerWidth="7"
              markerHeight="7"
              refX="8"
              refY="5"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="var(--border-strong)" />
            </marker>
            <marker
              id="ev-arrow-dashed"
              viewBox="0 0 10 10"
              markerWidth="7"
              markerHeight="7"
              refX="8"
              refY="5"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="var(--text-dim)" />
            </marker>
          </defs>
          {paths.map((p, i) => (
            <path
              key={i}
              d={p.d}
              fill="none"
              stroke={p.dashed ? 'var(--text-dim)' : 'var(--border-strong)'}
              strokeWidth={p.dashed ? 1.5 : 2}
              strokeDasharray={p.dashed ? '5 4' : undefined}
              markerEnd={p.dashed ? 'url(#ev-arrow-dashed)' : 'url(#ev-arrow)'}
            />
          ))}
        </svg>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 18, position: 'relative', zIndex: 1 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              color: 'var(--text)',
            }}
          >
            Al-Ahli Hospital — Evidence Logic Map
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>
            Vertical reasoning flow · conjecture-led vs model-led analysis
          </div>
        </div>

        {/* Layers — vertical gap leaves room for the connectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {/* Layer 1 — Event */}
          <Layer columns={1} maxWidth={460}>
            <Box
              fill="event"
              title="Al-Ahli Hospital explosion"
              body="Oct 17 2023 · Gaza · hundreds killed"
              boxRef={setRef('event')}
            />
          </Layer>

          {/* Layer 2 — Two central questions */}
          <Layer columns={2} maxWidth={620}>
            <Box fill="question" title="Who fired it?" body="IDF strike vs Hamas / PIJ misfire" boxRef={setRef('qWho')} />
            <Box fill="question" title="What munition?" body="Rocket, missile, interceptor, bomb" boxRef={setRef('qMun')} />
          </Layer>

          {/* Layer 3 — Four evidence streams */}
          <Layer columns={4}>
            <Box
              fill="evidenceDashed"
              title="Crater + blast site"
              body="Small crater, car fires, light structural damage"
              boxRef={setRef('crater')}
            />
            <Box
              fill="evidence"
              title="Sky / explosion footage"
              body="Al Jazeera balcony, Tel Aviv cam, rooftop"
              boxRef={setRef('sky')}
            />
            <Box
              fill="evidence"
              title="Audio / acoustics"
              body="IDF intercept, Doppler signatures in footage"
              boxRef={setRef('audio')}
            />
            <Box
              fill="evidenceDashed"
              title="Satellite imagery"
              body="Pre / post site state, crater dimensions"
              boxRef={setRef('sat')}
            />
          </Layer>

          <SectionLabels />

          {/* Layer 4 — Five analysis methods */}
          <Layer columns={5}>
            <Box
              fill="conjecture"
              title="Ballistic expert"
              body="Crater size, blast pattern, munition type"
              meta="HRW · WaPo · NYT · BBC"
              boxRef={setRef('ballistic')}
            />
            <Box
              fill="conjecture"
              title="Video geolocation"
              body="Spatial placement of cameras + launch points"
              meta="All conjecture orgs"
              boxRef={setRef('geo')}
            />
            <Box
              fill="conjecture"
              title="Audio expert"
              body="Frequency rise = vertical drop"
              meta="WaPo · BBC"
              boxRef={setRef('audioX')}
            />
            <Box
              fill="model"
              title="3D trajectory model"
              body="Camera motion tracked, missile triangulated"
              meta="FA · WaPo · NYT"
              boxRef={setRef('traj3d')}
            />
            <Box
              fill="model"
              title="Doppler curve model"
              body="Audio → spectrogram → trajectory simulation"
              meta="Earshot · Kobs · Maher Arar"
              boxRef={setRef('doppler')}
            />
          </Layer>

          {/* Layer 5 — Five key findings */}
          <Layer columns={5}>
            <Box
              fill="ruled"
              prominent
              title="Crater: largely irrelevant"
              body="No remains found. Small crater fits both GBU-39 and misfire."
              boxRef={setRef('craterF')}
            />
            <Box
              fill="conjecture"
              title="Launch triangulated"
              body="Balcony projectile = Iron Dome interceptor from inside Israel. Not the cause."
              boxRef={setRef('launchF')}
            />
            <Box
              fill="conjecture"
              title="Freq. rising"
              body="Object accelerating downward. Vertical drop."
              boxRef={setRef('freqF')}
            />
            <Box
              fill="model"
              title="Hamas missile ruled out"
              body="Intercepted at 5km alt. Debris needs 31s. Blast: 8s."
              boxRef={setRef('hamasF')}
            />
            <Box
              fill="model"
              title="Direction: NE / E / SE"
              body="Not SW (IDF claim). Kobs: fighter jet 34°. Maher Arar: GBU-39."
              boxRef={setRef('dirF')}
            />
          </Layer>

          {/* Layer 6 — Four munition candidates */}
          <Layer columns={4}>
            <Box
              fill="conjecture"
              title="Hamas / PIJ rocket"
              body="Supported by HRW, NYT, WaPo, BBC. Crater size, no remains, propellant."
              boxRef={setRef('hamasRocket')}
            />
            <Box
              fill="ruled"
              prominent
              title="Iron Dome interceptor"
              body="Ruled out: balcony video shows it. 7s gap too short. WaPo + FA."
              boxRef={setRef('ironDome')}
            />
            <Box
              fill="model"
              title="Israeli strike"
              body="FA 3D model: Hamas missiles too far. Kobs: jet azimuth 34°. Abu-Sittah: fragmentation wounds."
              boxRef={setRef('israeliStrike')}
            />
            <Box
              fill="model"
              prominent
              title="GBU-39 specifically"
              body="Carbon shell disintegrates = no remains. Doppler sim compatible. In IDF arsenal since 2021."
              boxRef={setRef('gbu39')}
            />
          </Layer>

          {/* Layer 7 — IDF claim + two rebuttals */}
          <Layer columns={4}>
            <div style={{ gridColumn: 'span 2' }}>
              <Box
                fill="idf"
                title="IDF claim"
                body="PIJ rocket from SW · radar data · audio intercept as proof · institutional authority, no scrutiny."
                boxRef={setRef('idf')}
              />
            </div>
            <Box
              fill="ruled"
              title="Intercept: edited"
              body="Earshot: two audio channels merged via Audacity. Noise added."
              boxRef={setRef('interceptEdited')}
            />
            <Box
              fill="ruled"
              title="SW origin: ruled out"
              body="Earshot: Doppler curve incompatible with SW. Kobs confirms."
              boxRef={setRef('swRuled')}
            />
          </Layer>

          {/* Layer 8 — Four limits */}
          <Layer columns={4}>
            <Box
              fill="ruled"
              title="No missile remains"
              body="GBU-39 carbon shell disintegrates. No proof either way."
              boxRef={setRef('noRemains')}
            />
            <Box
              fill="ruled"
              title="Night footage only"
              body="Low visibility. No direct view of impact. Inference only."
              boxRef={setRef('night')}
            />
            <Box
              fill="ruled"
              title="Site inaccessible"
              body="No ground-truth. All analysis remote. Models unverifiable."
              boxRef={setRef('siteInacc')}
            />
            <Box
              fill="ruled"
              title="Partiality problem"
              body="Debate collapsed into accusations of bias. No arbiter of methods."
              boxRef={setRef('partiality')}
            />
          </Layer>

          {/* Layer 9 — Unresolved outcome */}
          <Layer columns={1}>
            <Box
              fill="outcome"
              title="Case formally unresolved"
              body="Model-led: Israeli ordnance (GBU-39 / jet strike). Conjecture-led: Hamas misfire. No physical proof recoverable."
              boxRef={setRef('outcome')}
            />
          </Layer>
        </div>

        <Legend />
      </div>
    </div>
  );
};

export default EvidenceLogicFlow;
