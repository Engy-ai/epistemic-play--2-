
import React from 'react';

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
}> = ({ fill, title, body, meta, prominent }) => {
  const s = variantStyle(fill, prominent);
  return (
    <div
      className="h-full flex flex-col gap-1"
      style={{
        background: s.background,
        border: s.border,
        borderRadius: 12,
        padding: '8px 11px',
        boxShadow: 'var(--shadow-soft)',
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
/*  Connectors                                                         */
/* ------------------------------------------------------------------ */

const Arrow: React.FC<{ dashed?: boolean }> = ({ dashed }) => (
  <div className="flex flex-col items-center" style={{ padding: '6px 0' }} aria-hidden>
    <div
      style={{
        height: 16,
        borderLeft: dashed
          ? '1.5px dashed var(--text-dim)'
          : '2px solid var(--border-strong)',
      }}
    />
    <div
      style={{
        width: 0,
        height: 0,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: `7px solid ${dashed ? 'var(--text-dim)' : 'var(--border-strong)'}`,
      }}
    />
  </div>
);

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
        margin: '10px auto 2px',
        width: '100%',
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
  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <div
        style={{
          color: 'var(--text)',
          minWidth: 720,
          maxWidth: 940,
          margin: '0 auto',
          padding: '4px 0 8px',
        }}
      >
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
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

        {/* Layer 1 — Event */}
        <Layer columns={1}>
          <Box
            fill="event"
            title="Al-Ahli Hospital explosion"
            body="Oct 17 2023 · Gaza · hundreds killed"
          />
        </Layer>

        <Arrow />

        {/* Layer 2 — Two central questions */}
        <Layer columns={2} maxWidth={620}>
          <Box fill="question" title="Who fired it?" body="IDF strike vs Hamas / PIJ misfire" />
          <Box fill="question" title="What munition?" body="Rocket, missile, interceptor, bomb" />
        </Layer>

        <Arrow />

        {/* Layer 3 — Four evidence streams */}
        <Layer columns={4}>
          <Box
            fill="evidenceDashed"
            title="Crater + blast site"
            body="Small crater, car fires, light structural damage"
          />
          <Box
            fill="evidence"
            title="Sky / explosion footage"
            body="Al Jazeera balcony, Tel Aviv cam, rooftop"
          />
          <Box
            fill="evidence"
            title="Audio / acoustics"
            body="IDF intercept, Doppler signatures in footage"
          />
          <Box
            fill="evidenceDashed"
            title="Satellite imagery"
            body="Pre / post site state, crater dimensions"
          />
        </Layer>

        <SectionLabels />
        <Arrow />

        {/* Layer 4 — Five analysis methods */}
        <Layer columns={5}>
          <Box
            fill="conjecture"
            title="Ballistic expert"
            body="Crater size, blast pattern, munition type"
            meta="HRW · WaPo · NYT · BBC"
          />
          <Box
            fill="conjecture"
            title="Video geolocation"
            body="Spatial placement of cameras + launch points"
            meta="All conjecture orgs"
          />
          <Box
            fill="conjecture"
            title="Audio expert"
            body="Frequency rise = vertical drop"
            meta="WaPo · BBC"
          />
          <Box
            fill="model"
            title="3D trajectory model"
            body="Camera motion tracked, missile triangulated"
            meta="FA · WaPo · NYT"
          />
          <Box
            fill="model"
            title="Doppler curve model"
            body="Audio → spectrogram → trajectory simulation"
            meta="Earshot · Kobs · Maher Arar"
          />
        </Layer>

        <Arrow />

        {/* Layer 5 — Five key findings */}
        <Layer columns={5}>
          <Box
            fill="ruled"
            prominent
            title="Crater: largely irrelevant"
            body="No remains found. Small crater fits both GBU-39 and misfire."
          />
          <Box
            fill="conjecture"
            title="Launch triangulated"
            body="Balcony projectile = Iron Dome interceptor from inside Israel. Not the cause."
          />
          <Box
            fill="conjecture"
            title="Freq. rising"
            body="Object accelerating downward. Vertical drop."
          />
          <Box
            fill="model"
            title="Hamas missile ruled out"
            body="Intercepted at 5km alt. Debris needs 31s. Blast: 8s."
          />
          <Box
            fill="model"
            title="Direction: NE / E / SE"
            body="Not SW (IDF claim). Kobs: fighter jet 34°. Maher Arar: GBU-39."
          />
        </Layer>

        <Arrow />

        {/* Layer 6 — Four munition candidates */}
        <Layer columns={4}>
          <Box
            fill="conjecture"
            title="Hamas / PIJ rocket"
            body="Supported by HRW, NYT, WaPo, BBC. Crater size, no remains, propellant."
          />
          <Box
            fill="ruled"
            prominent
            title="Iron Dome interceptor"
            body="Ruled out: balcony video shows it. 7s gap too short. WaPo + FA."
          />
          <Box
            fill="model"
            title="Israeli strike"
            body="FA 3D model: Hamas missiles too far. Kobs: jet azimuth 34°. Abu-Sittah: fragmentation wounds."
          />
          <Box
            fill="model"
            prominent
            title="GBU-39 specifically"
            body="Carbon shell disintegrates = no remains. Doppler sim compatible. In IDF arsenal since 2021."
          />
        </Layer>

        <Arrow />

        {/* Layer 7 — IDF claim + two rebuttals */}
        <Layer columns={4}>
          <div style={{ gridColumn: 'span 2' }}>
            <Box
              fill="idf"
              title="IDF claim"
              body="PIJ rocket from SW · radar data · audio intercept as proof · institutional authority, no scrutiny."
            />
          </div>
          <Box
            fill="ruled"
            title="Intercept: edited"
            body="Earshot: two audio channels merged via Audacity. Noise added."
          />
          <Box
            fill="ruled"
            title="SW origin: ruled out"
            body="Earshot: Doppler curve incompatible with SW. Kobs confirms."
          />
        </Layer>

        <Arrow />

        {/* Layer 8 — Four limits */}
        <Layer columns={4}>
          <Box
            fill="ruled"
            title="No missile remains"
            body="GBU-39 carbon shell disintegrates. No proof either way."
          />
          <Box
            fill="ruled"
            title="Night footage only"
            body="Low visibility. No direct view of impact. Inference only."
          />
          <Box
            fill="ruled"
            title="Site inaccessible"
            body="No ground-truth. All analysis remote. Models unverifiable."
          />
          <Box
            fill="ruled"
            title="Partiality problem"
            body="Debate collapsed into accusations of bias. No arbiter of methods."
          />
        </Layer>

        <Arrow />

        {/* Layer 9 — Unresolved outcome */}
        <Layer columns={1}>
          <Box
            fill="outcome"
            title="Case formally unresolved"
            body="Model-led: Israeli ordnance (GBU-39 / jet strike). Conjecture-led: Hamas misfire. No physical proof recoverable."
          />
        </Layer>

        <Legend />
      </div>
    </div>
  );
};

export default EvidenceLogicFlow;
