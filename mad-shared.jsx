// Shared atoms + tokens for Mad for Makeup virtual try-on
// Cormorant Garamond + Inter, Parisian-rose palette, mobile-first

// ── Tokens ───────────────────────────────────────────────────
const MAD = {
  rose50:  '#FFF5F7',
  rose100: '#FFE5EB',
  rose200: '#FFCCD9',
  rose500: '#D4738F',  // primary, overridden by Tweaks
  rose600: '#C25E7A',
  rose700: '#8B4A5F',
  cream50: '#FDFCFB',
  cream100:'#F8F5F2',
  gray300: '#D4CCC4',
  gray500: '#9B8F85',
  gray700: '#5C524A',
  gray900: '#2A241E',
  sage100: '#EDF5F0',
  sage500: '#7BA68C',
  sage700: '#4A6B5A',
  error:   '#C97272',
  warning: '#D9A86C',
};

// CSS variables (also re-set by Tweaks)
(function injectMadStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('mad-styles')) return;
  const s = document.createElement('style');
  s.id = 'mad-styles';
  s.textContent = `
    :root {
      --mad-rose-50:  ${MAD.rose50};
      --mad-rose-100: ${MAD.rose100};
      --mad-rose-200: ${MAD.rose200};
      --mad-rose-500: ${MAD.rose500};
      --mad-rose-600: ${MAD.rose600};
      --mad-rose-700: ${MAD.rose700};
      --mad-cream-50: ${MAD.cream50};
      --mad-cream-100:${MAD.cream100};
      --mad-gray-300: ${MAD.gray300};
      --mad-gray-500: ${MAD.gray500};
      --mad-gray-700: ${MAD.gray700};
      --mad-gray-900: ${MAD.gray900};
      --mad-sage-100: ${MAD.sage100};
      --mad-sage-500: ${MAD.sage500};
      --mad-sage-700: ${MAD.sage700};
      --mad-error:    ${MAD.error};
      --mad-warning:  ${MAD.warning};
      --mad-serif: 'Cormorant Garamond', 'Cormorant', Georgia, serif;
      --mad-sans:  'Inter', system-ui, sans-serif;
    }
    .mad-screen { font-family: var(--mad-sans); color: var(--mad-gray-900); }
    .mad-h1 { font-family: var(--mad-serif); font-weight: 400; letter-spacing: -0.012em;
              color: var(--mad-gray-900); line-height: 1.05; margin: 0; }
    .mad-h2 { font-family: var(--mad-serif); font-weight: 400; letter-spacing: -0.01em;
              color: var(--mad-gray-900); line-height: 1.1; margin: 0; }
    .mad-eyebrow { font-family: var(--mad-sans); font-weight: 500; font-size: 11px;
                   text-transform: uppercase; letter-spacing: 0.14em;
                   color: var(--mad-gray-500); }
    .mad-body { font-family: var(--mad-sans); font-size: 15px; line-height: 1.55;
                color: var(--mad-gray-700); }
    .mad-small { font-family: var(--mad-sans); font-size: 13px; line-height: 1.5;
                 color: var(--mad-gray-500); }
    .mad-btn { font-family: var(--mad-sans); font-weight: 500; font-size: 15px;
               border: 0; cursor: pointer; padding: 15px 28px; border-radius: 999px;
               transition: all .15s ease; letter-spacing: 0.005em; }
    .mad-btn-primary { background: var(--mad-rose-500); color: #fff;
                       box-shadow: 0 2px 10px rgba(212,115,143,.25); }
    .mad-btn-primary:hover { background: var(--mad-rose-600);
                             box-shadow: 0 4px 14px rgba(212,115,143,.35);
                             transform: translateY(-1px); }
    .mad-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
    .mad-btn-ghost { background: transparent; color: var(--mad-rose-500);
                     border: 1.5px solid var(--mad-rose-200); }
    .mad-btn-ghost:hover { background: var(--mad-rose-50);
                           border-color: var(--mad-rose-500); }
    .mad-btn-dark { background: var(--mad-gray-900); color: #fff; }
    .mad-btn-dark:hover { background: #000; transform: translateY(-1px); }
    .mad-link { background: none; border: 0; cursor: pointer; padding: 4px 2px;
                color: var(--mad-rose-500); font-family: var(--mad-sans);
                font-size: 14px; text-decoration: underline;
                text-underline-offset: 5px; text-decoration-thickness: 0.5px; }
    .mad-link:hover { color: var(--mad-rose-600); }
    .mad-card { background: var(--mad-cream-100); border-radius: 22px; padding: 22px;
                box-shadow: 0 2px 10px rgba(0,0,0,.03); }
    @keyframes mad-pulse { 0%,100% { opacity: .35; } 50% { opacity: .85; } }
    @keyframes mad-bob   { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
    @keyframes mad-fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    @keyframes mad-scan-sweep { 0% { transform: translateY(-100%); } 100% { transform: translateY(900%); } }
    @keyframes mad-spin { to { transform: rotate(360deg); } }
    .mad-fadein { animation: mad-fadein .35s ease-out both; }
  `;
  document.head.appendChild(s);
})();

// ── Shade data ───────────────────────────────────────────────
const CUSHION_SHADES = [
  // x: 0..1 along Warm→Cool axis (warm left, cool right)
  // y: 0..1 along Light→Tan axis (light top)
  { id: 'N1',   name: 'N1',   label: 'Light neutral',        hex: '#F1DDC8', undertone: 'Neutral', x: 0.55, y: 0.18, stock: 142, price: 32 },
  { id: 'N1.5', name: 'N1.5', label: 'Light-medium neutral', hex: '#E5C8AE', undertone: 'Neutral', x: 0.58, y: 0.40, stock: 247, price: 32 },
  { id: 'N2',   name: 'N2',   label: 'Medium neutral',       hex: '#CFB096', undertone: 'Neutral', x: 0.55, y: 0.72, stock: 0,   price: 32 },
  { id: 'W1',   name: 'W1',   label: 'Light-medium warm',    hex: '#E8C9A8', undertone: 'Warm',    x: 0.30, y: 0.40, stock: 86,  price: 32 },
  { id: 'W2',   name: 'W2',   label: 'Medium warm',          hex: '#CDA682', undertone: 'Warm',    x: 0.28, y: 0.72, stock: 31,  price: 32 },
];

const LIP_SHADES = [
  { id: 'moon-rose',     name: 'Moon Rose',     short: 'MR', description: 'Cool baby pink',  hex: '#E8A8B5', x: 0.78, y: 0.18, stock: 412, price: 24 },
  { id: 'rose-quartz',   name: 'Rose Quartz',   short: 'RQ', description: 'Rose pink',       hex: '#D17681', x: 0.62, y: 0.42, stock: 0,   price: 24 },
  { id: 'pink-amethyst', name: 'Pink Amethyst', short: 'PA', description: 'Muted mauve',     hex: '#B17C8E', x: 0.46, y: 0.55, stock: 178, price: 24 },
  { id: 'red-jasper',    name: 'Red Jasper',    short: 'RJ', description: 'Terracotta red',  hex: '#C04A3F', x: 0.28, y: 0.75, stock: 64,  price: 24 },
  { id: 'coco-quartz',   name: 'Coco Quartz',   short: 'CQ', description: 'Reddish brown',   hex: '#8C513F', x: 0.18, y: 0.92, stock: 9,   price: 24 },
];

// Stock-status helper
function stockStatus(qty) {
  if (qty === 0) return { kind: 'out',  label: 'Out of stock', color: '--mad-error',   bg: 'rgba(201,114,114,.10)' };
  if (qty < 30)  return { kind: 'low',  label: `Low stock, ${qty} left`, color: '--mad-warning', bg: 'rgba(217,168,108,.14)' };
  return            { kind: 'in',   label: `In stock, ${qty} units`, color: '--mad-sage-700', bg: 'var(--mad-sage-100)' };
}

// ── Atoms ────────────────────────────────────────────────────
function MadLogo({ color, size = 22 }) {
  return (
    <div style={{
      fontFamily: 'var(--mad-serif)',
      fontSize: size, fontWeight: 500, fontStyle: 'italic',
      letterSpacing: '-0.02em', color: color || 'var(--mad-gray-900)',
      lineHeight: 1, userSelect: 'none', whiteSpace: 'nowrap',
    }}>
      Mad<span style={{
        fontStyle: 'normal', fontFamily: 'var(--mad-sans)',
        fontSize: size * 0.36, fontWeight: 500, letterSpacing: '0.14em',
        textTransform: 'uppercase', marginLeft: 6, verticalAlign: 'middle',
        opacity: 0.55,
      }}>for makeup</span>
    </div>
  );
}

function CloseBtn({ onClick, light = false, top = 18, right = 18 }) {
  return (
    <button onClick={onClick} aria-label="Close" style={{
      position: 'absolute', top, right, width: 36, height: 36, borderRadius: 18,
      border: 0, cursor: 'pointer',
      background: light ? 'rgba(255,255,255,0.18)' : 'rgba(42,36,30,0.06)',
      backdropFilter: light ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: light ? 'blur(12px)' : 'none',
      color: light ? '#fff' : 'var(--mad-gray-900)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 30,
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14">
        <path d="M1 1 L13 13 M13 1 L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

// Round shade swatch (with optional selected ring + label)
function Swatch({ hex, size = 56, selected = false, onClick, label, outOfStock = false, style = {} }) {
  return (
    <button onClick={onClick} style={{
      width: size, height: size, borderRadius: '50%', cursor: onClick ? 'pointer' : 'default',
      border: selected ? '1.5px solid var(--mad-gray-900)' : '1.5px solid rgba(0,0,0,0.06)',
      boxShadow: selected
        ? `0 0 0 4px var(--mad-rose-100), 0 2px 6px rgba(0,0,0,0.06)`
        : '0 1px 4px rgba(0,0,0,0.08)',
      background: hex, padding: 0, position: 'relative',
      transition: 'all 150ms ease', flexShrink: 0, ...style,
    }} aria-label={label}>
      {outOfStock && (
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'rgba(255,255,255,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 600, color: 'var(--mad-error)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>Out</span>
      )}
    </button>
  );
}

// Stock badge (in / low / out)
function StockBadge({ qty, compact = false }) {
  const s = stockStatus(qty);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: compact ? '5px 10px' : '6px 12px',
      borderRadius: 999,
      background: s.kind === 'in' ? 'var(--mad-sage-100)' : s.bg,
      color: `var(${s.color})`,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
      textTransform: 'uppercase',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: 'currentColor',
        animation: s.kind === 'in' ? 'mad-pulse 1.8s infinite ease-in-out' : 'none',
      }}/>
      {s.label}
    </span>
  );
}

// Pulsing 3-dot loader
function ProgressDots({ color = '#fff' }) {
  return (
    <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: '50%', background: color,
          animation: `mad-pulse 1.2s ${i * 0.18}s infinite ease-in-out`,
        }}/>
      ))}
    </div>
  );
}

// 2D scatter-plot placer for shades (warm-cool × light-tan)
function ScatterPlot({ shades, selected, onSelect, axisLabels = ['Warm', 'Cool', 'Light', 'Deep'], height = 220 }) {
  const [warmLabel, coolLabel, lightLabel, deepLabel] = axisLabels;
  return (
    <div style={{
      position: 'relative', height,
      background: 'linear-gradient(135deg, var(--mad-cream-50), var(--mad-rose-50) 100%)',
      borderRadius: 18, padding: '14px 16px',
    }}>
      {/* axis labels */}
      <span style={{ position: 'absolute', top: 8, left: 14, fontSize: 10, fontWeight: 500, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'var(--mad-gray-500)' }}>{warmLabel}</span>
      <span style={{ position: 'absolute', top: 8, right: 14, fontSize: 10, fontWeight: 500, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'var(--mad-gray-500)' }}>{coolLabel}</span>
      <span style={{ position: 'absolute', bottom: 10, left: 14, fontSize: 10, fontWeight: 500, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'var(--mad-gray-500)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{lightLabel}</span>
      <span style={{ position: 'absolute', bottom: 10, right: 14, fontSize: 10, fontWeight: 500, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'var(--mad-gray-500)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{deepLabel}</span>
      {/* center crosshair */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <line x1="50%" y1="14%" x2="50%" y2="86%" stroke="rgba(91,82,74,0.10)" strokeWidth="1" strokeDasharray="2 4"/>
        <line x1="14%" y1="50%" x2="86%" y2="50%" stroke="rgba(91,82,74,0.10)" strokeWidth="1" strokeDasharray="2 4"/>
      </svg>
      {/* swatches */}
      {shades.map(s => {
        const isSel = selected && selected === s.id;
        const left = 14 + s.x * (100 - 28) + '%';
        const top  = 14 + s.y * (100 - 28) + '%';
        const swatchSize = 44;
        return (
          <div key={s.id} style={{
            position: 'absolute', left, top,
            transform: 'translate(-50%, -50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <Swatch hex={s.hex} size={swatchSize} selected={isSel}
                    onClick={onSelect ? () => onSelect(s.id) : undefined}
                    outOfStock={s.stock === 0} />
            <span style={{
              fontSize: 10, fontWeight: 600, color: 'var(--mad-gray-700)',
              letterSpacing: '0.04em',
              padding: '1px 6px', borderRadius: 6,
              background: isSel ? 'var(--mad-gray-900)' : 'transparent',
              color: isSel ? '#fff' : 'var(--mad-gray-700)',
            }}>{s.name}</span>
          </div>
        );
      })}
    </div>
  );
}

// Face image with optional tint overlay (for shade preview)
function FacePhoto({ src, tint = null, tintOpacity = 0.18, lipShade = null, lipOpacity = 0.55, style = {} }) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      overflow: 'hidden',
      background: 'linear-gradient(160deg, #efd9c9, #d9b39f)', // fallback if img fails
      ...style,
    }}>
      <img src={src} alt="" referrerPolicy="no-referrer" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center 30%',
        display: 'block',
      }}/>
      {/* shade tint (cushion) */}
      {tint && (
        <div style={{
          position: 'absolute', inset: 0,
          background: tint, opacity: tintOpacity,
          mixBlendMode: 'multiply', pointerEvents: 'none',
        }}/>
      )}
      {/* lip overlay */}
      {lipShade && <LipTint hex={lipShade} opacity={lipOpacity}/>}
    </div>
  );
}

// SVG lip-shaped tint over the face. Positioned relative to image.
function LipTint({ hex, opacity = 0.55 }) {
  // viewBox approximates lip placement; positioned within face image roughly
  return (
    <svg viewBox="0 0 200 280" preserveAspectRatio="xMidYMid slice"
         style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                  pointerEvents: 'none', mixBlendMode: 'multiply',
                  transition: 'opacity .3s ease' }}>
      <defs>
        <filter id="lip-soft" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1.4"/>
        </filter>
      </defs>
      {/* Upper lip + cupid's bow, lower lip — stylized lip silhouette */}
      <g filter="url(#lip-soft)" fill={hex} fillOpacity={opacity}>
        {/* upper lip */}
        <path d="M 78 198
                 C 84 192, 90 192, 96 196
                 C 99 192, 101 192, 104 196
                 C 110 192, 116 192, 122 198
                 C 118 204, 110 207, 100 207
                 C 90 207, 82 204, 78 198 Z"/>
        {/* lower lip */}
        <path d="M 80 200
                 C 86 213, 94 218, 100 218
                 C 106 218, 114 213, 120 200
                 C 116 208, 110 211, 100 211
                 C 90 211, 84 208, 80 200 Z"/>
      </g>
    </svg>
  );
}

// Face-mesh dots overlay (decorative). Animates a subtle pulse.
function FaceMesh({ visible = true, color = '#A8E6CF' }) {
  // generate dot positions clustered around face area
  const dots = React.useMemo(() => {
    const pts = [];
    // 5 rows × 7 cols, jittered, clipped to face oval
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 8; c++) {
        const x = 50 + (c - 3.5) * 5.5 + (Math.sin(r * 1.3 + c) * 1.2);
        const y = 50 + (r - 3) * 6.5 + (Math.cos(c * 0.9 + r) * 1.0);
        const dx = (x - 50) / 25, dy = (y - 50) / 30;
        if (dx*dx + dy*dy <= 1.0) pts.push({ x, y, d: (r * 8 + c) * 60 });
      }
    }
    return pts;
  }, []);
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"
         style={{
           position: 'absolute', inset: 0, width: '100%', height: '100%',
           pointerEvents: 'none', opacity: visible ? 1 : 0,
           transition: 'opacity .4s ease',
         }}>
      <defs>
        <radialGradient id="mesh-glow" cx="50%" cy="50%" r="40%">
          <stop offset="0%" stopColor={color} stopOpacity="0.05"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="50" rx="26" ry="32" fill="url(#mesh-glow)"/>
      {/* face outline (subtle) */}
      <ellipse cx="50" cy="50" rx="26" ry="32" fill="none" stroke={color}
               strokeWidth="0.3" strokeOpacity="0.55"/>
      {/* connecting strokes (sparse) */}
      {dots.slice(0, 24).map((d, i) => {
        const next = dots[(i + 5) % dots.length];
        return <line key={`l${i}`} x1={d.x} y1={d.y} x2={next.x} y2={next.y}
                     stroke={color} strokeWidth="0.18" strokeOpacity="0.35"/>;
      })}
      {/* dots */}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="0.55" fill={color}
                style={{ animation: `mad-pulse 1.6s ${(d.d % 1200) / 1000}s infinite ease-in-out` }}/>
      ))}
    </svg>
  );
}

// Lip-mesh / contour overlay (for lip oil scan)
function LipMesh({ visible = true, color = '#fff' }) {
  return (
    <svg viewBox="0 0 200 280" preserveAspectRatio="xMidYMid slice"
         style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                  pointerEvents: 'none', opacity: visible ? 1 : 0,
                  transition: 'opacity .4s ease' }}>
      <g stroke={color} strokeWidth="0.8" fill="none" strokeOpacity="0.85">
        <path d="M 78 198 C 88 192, 94 192, 100 196 C 106 192, 112 192, 122 198"/>
        <path d="M 78 198 C 84 208, 92 218, 100 218 C 108 218, 116 208, 122 198"/>
      </g>
      {/* tracking dots along lip contour */}
      {[
        [78,198],[84,194],[90,193],[96,195],[100,196],
        [104,195],[110,193],[116,194],[122,198],
        [84,205],[92,212],[100,216],[108,212],[116,205],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="0.9" fill={color} fillOpacity="0.9"
                style={{ animation: `mad-pulse 1.4s ${i * 0.08}s infinite ease-in-out` }}/>
      ))}
    </svg>
  );
}

// Scan-sweep line that travels down the screen
function ScanSweep({ color = '#A8E6CF' }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 110,
        background: `linear-gradient(180deg, transparent, ${color}33 45%, ${color}AA 50%, ${color}33 55%, transparent)`,
        filter: 'blur(0.5px)',
        animation: 'mad-scan-sweep 2.6s ease-in-out infinite',
      }}/>
    </div>
  );
}

// Phone-screen container — fills IOSDevice content area
function Screen({ children, background = 'var(--mad-cream-50)', dark = false, scrollable = true, style = {} }) {
  return (
    <div className="mad-screen mad-fadein" style={{
      position: 'relative', width: '100%', minHeight: '100%',
      background, color: dark ? '#fff' : 'var(--mad-gray-900)',
      overflow: scrollable ? 'auto' : 'hidden',
      ...style,
    }}>
      {children}
    </div>
  );
}

// Brand header (Mad wordmark + close)
function BrandHeader({ onClose, light = false }) {
  return (
    <div style={{
      position: 'absolute', top: 60, left: 0, right: 0, height: 48,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 22px', zIndex: 20,
    }}>
      <MadLogo color={light ? '#fff' : undefined} />
      <CloseBtn onClick={onClose} light={light} top={6} right={0} />
    </div>
  );
}

// Image URLs (Unsplash — neutral portrait close-ups).
// When bundled via super_inline_html, the resource gets inlined and
// the runtime value comes from window.__resources.facePortrait instead.
const FACE_PORTRAIT     = (typeof window !== 'undefined' && window.__resources && window.__resources.facePortrait)
                          || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=80';
const FACE_PORTRAIT_ALT = (typeof window !== 'undefined' && window.__resources && window.__resources.facePortraitAlt)
                          || 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80';

Object.assign(window, {
  MAD, CUSHION_SHADES, LIP_SHADES, stockStatus,
  MadLogo, CloseBtn, Swatch, StockBadge, ProgressDots,
  ScatterPlot, FacePhoto, LipTint, FaceMesh, LipMesh, ScanSweep,
  Screen, BrandHeader, FACE_PORTRAIT, FACE_PORTRAIT_ALT,
});
