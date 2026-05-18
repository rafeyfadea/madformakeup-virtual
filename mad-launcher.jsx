// Launcher home screen + fullscreen phone stage
// User opens app → sees iPhone home with 3 large tappable cards.

// ── PhoneStage: scales a fixed 402×874 phone to fit viewport ─
function PhoneStage({ children, bg = 'var(--mad-cream-100)' }) {
  const PW = 402, PH = 874;
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const recalc = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const margin = vw < 600 ? 0 : 32;
      const s = Math.min((vw - margin) / PW, (vh - margin) / PH);
      setScale(Math.min(1.15, s));
    };
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, []);
  return (
    <div style={{
      position: 'fixed', inset: 0, background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <div style={{
        width: PW, height: PH,
        transform: `scale(${scale})`, transformOrigin: 'center center',
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Launcher screen (fits inside IOSDevice) ──────────────────
function LauncherScreen({ onPick }) {
  return (
    <Screen background="linear-gradient(180deg, var(--mad-cream-50) 0%, var(--mad-rose-50) 100%)">
      <div style={{ position: 'relative', paddingTop: 78, paddingBottom: 80,
        paddingLeft: 24, paddingRight: 24 }}>

        {/* Brand mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
          <MadLogo size={20}/>
          <span style={{ flex: 1 }}/>
          <span className="mad-eyebrow" style={{ fontSize: 10 }}>Try-on suite</span>
        </div>

        {/* Hero */}
        <div className="mad-eyebrow" style={{ marginBottom: 12 }}>Welcome</div>
        <h1 className="mad-h1" style={{ fontSize: 46, marginBottom: 14 }}>
          Try a shade,<br/>
          <em style={{ color: 'var(--mad-rose-500)', fontFamily: 'inherit' }}>skip the swatch.</em>
        </h1>
        <p className="mad-body" style={{ marginBottom: 32, fontSize: 15, maxWidth: 320 }}>
          Three tools, one phone. Pick where to start.
        </p>

        {/* Cards stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <LauncherCard
            tag="01"
            title="Cushion Finder"
            sub="AI matches your skin tone to N1, N1.5, N2, W1 or W2. Ten-second scan."
            kind="cushion"
            onClick={() => onPick('cushion')}
          />
          <LauncherCard
            tag="02"
            title="Lip Oil Try-On"
            sub="Swipe through five shades, live on your mouth."
            kind="lipoil"
            onClick={() => onPick('lipoil')}
          />
          <LauncherCard
            tag="03"
            title="Direction explorations"
            sub="Three alternative design treatments to compare."
            kind="variants"
            onClick={() => onPick('variants')}
          />
        </div>

        {/* Footer */}
        <div style={{ marginTop: 36, textAlign: 'center' }}>
          <div className="mad-small" style={{ fontSize: 11, color: 'var(--mad-gray-500)' }}>
            Mad for Makeup &middot; Virtual try-on prototype
          </div>
          <div className="mad-small" style={{ fontSize: 10, marginTop: 4, color: 'var(--mad-gray-300)' }}>
            May 2026
          </div>
        </div>
      </div>
    </Screen>
  );
}

function LauncherCard({ tag, title, sub, kind, onClick }) {
  // Each card has a distinct visual preview on the right side.
  return (
    <button onClick={onClick} style={{
      position: 'relative', display: 'flex', alignItems: 'stretch',
      padding: 0, border: 0, cursor: 'pointer',
      background: '#fff', borderRadius: 22, overflow: 'hidden',
      textAlign: 'left', minHeight: 130,
      boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
      transition: 'all .2s ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)';
                         e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'none';
                         e.currentTarget.style.boxShadow = '0 2px 14px rgba(0,0,0,0.04)'; }}>
      {/* Text side */}
      <div style={{ flex: 1, padding: '20px 8px 20px 22px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div className="mad-eyebrow" style={{ marginBottom: 6, fontSize: 10,
            color: 'var(--mad-rose-500)' }}>{tag} &nbsp;·&nbsp; Tool</div>
          <div style={{ fontFamily: 'var(--mad-serif)', fontSize: 24, fontWeight: 500,
            lineHeight: 1.05, color: 'var(--mad-gray-900)', marginBottom: 8 }}>
            {title}
          </div>
          <p className="mad-small" style={{ fontSize: 12, lineHeight: 1.45, marginBottom: 0 }}>
            {sub}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12,
          fontSize: 12, color: 'var(--mad-rose-500)', fontWeight: 500 }}>
          Open
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M2 6h7M5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                  fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {/* Preview side */}
      <div style={{ width: 110, position: 'relative', background: 'var(--mad-cream-100)' }}>
        {kind === 'cushion' && <CushionPreview/>}
        {kind === 'lipoil'  && <LipOilPreview/>}
        {kind === 'variants'&& <VariantsPreview/>}
      </div>
    </button>
  );
}

// Mini previews for launcher cards
function CushionPreview() {
  // Stack of shade swatches
  return (
    <div style={{ position: 'absolute', inset: 0,
      background: 'linear-gradient(135deg, #F8F5F2, #FFE5EB)',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        {CUSHION_SHADES.map((s, i) => (
          <div key={s.id} style={{
            position: 'absolute', width: 40, height: 40, borderRadius: 20,
            background: s.hex, border: '2px solid #fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            left:  [10, 36, 0, 22, 44][i],
            top:   [4, 12, 32, 38, 48][i],
            transform: `rotate(${(i - 2) * 6}deg)`,
          }}/>
        ))}
      </div>
    </div>
  );
}

function LipOilPreview() {
  return (
    <div style={{ position: 'absolute', inset: 0,
      background: 'linear-gradient(160deg, #1a1612 0%, #2a1a1f 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Stylized lip silhouette */}
      <svg viewBox="0 0 80 60" width="78" height="58">
        <defs>
          <linearGradient id="lipgrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#E8A8B5"/>
            <stop offset="50%" stopColor="#D17681"/>
            <stop offset="100%" stopColor="#8C513F"/>
          </linearGradient>
        </defs>
        <path d="M 16 28
                 C 22 21, 30 21, 36 26
                 C 39 22, 41 22, 44 26
                 C 50 21, 58 21, 64 28
                 C 60 38, 50 45, 40 45
                 C 30 45, 20 38, 16 28 Z"
              fill="url(#lipgrad)" opacity="0.95"/>
        {/* tracking dots */}
        {[[16,28],[24,24],[32,22],[40,24],[48,22],[56,24],[64,28]].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r="1.2" fill="#fff" opacity="0.55"/>
        ))}
      </svg>
    </div>
  );
}

function VariantsPreview() {
  return (
    <div style={{ position: 'absolute', inset: 0,
      background: 'linear-gradient(140deg, #FDFCFB 0%, #FFF5F7 100%)',
      padding: 14, display: 'grid',
      gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 6 }}>
      <div style={{ background: 'var(--mad-gray-900)', borderRadius: 6 }}/>
      <div style={{ background: 'var(--mad-rose-500)', borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--mad-serif)', color: '#fff',
          fontSize: 14, fontStyle: 'italic' }}>A</span>
      </div>
      <div style={{ background: 'var(--mad-rose-100)', borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--mad-serif)', color: 'var(--mad-rose-700)',
          fontSize: 14, fontStyle: 'italic' }}>B</span>
      </div>
      <div style={{ background: '#1a1612', borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--mad-serif)', color: '#fff',
          fontSize: 14, fontStyle: 'italic' }}>C</span>
      </div>
    </div>
  );
}

// ── Variants browser (swipeable pager inside the phone) ──────
function VariantsBrowser({ onExit }) {
  const [page, setPage] = React.useState(0);
  const pages = [
    { label: 'A · Editorial result',     Component: VariantCushionEditorialBare },
    { label: 'B · Lip oil, side rail',   Component: VariantLipOilSideRailBare },
    { label: 'C · Magazine landing',     Component: VariantCushionMagazineBare },
  ];

  const touch = React.useRef({ x: 0, active: false });
  const onTouchStart = (e) => { touch.current = { x: e.touches[0].clientX, active: true }; };
  const onTouchEnd = (e) => {
    if (!touch.current.active) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    touch.current.active = false;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) setPage(p => Math.min(pages.length - 1, p + 1));
    else        setPage(p => Math.max(0, p - 1));
  };
  // Same for mouse drag (desktop)
  const mouse = React.useRef({ x: 0, active: false });
  const onMouseDown = (e) => { mouse.current = { x: e.clientX, active: true }; };
  const onMouseUp   = (e) => {
    if (!mouse.current.active) return;
    const dx = e.clientX - mouse.current.x;
    mouse.current.active = false;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) setPage(p => Math.min(pages.length - 1, p + 1));
    else        setPage(p => Math.max(0, p - 1));
  };

  const Page = pages[page].Component;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%',
                  background: 'var(--mad-cream-50)' }}
         onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
         onMouseDown={onMouseDown}   onMouseUp={onMouseUp}>
      {/* The whole inner artboard sits in here — but it has its own IOSDevice.
          We override that by rendering it directly without device wrapper.
          Actually variants are IOSDevice-wrapped, so we render them inside but
          hide their outer device chrome. Simpler: render inner Screen directly. */}
      <Page/>

      {/* Top bar: Home only */}
      <div style={{
        position: 'absolute', top: 62, left: 16, height: 36,
        display: 'flex', alignItems: 'center',
        zIndex: 50,
      }}>
        <button onClick={onExit} style={{
          background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)', border: 0, cursor: 'pointer',
          padding: '7px 14px', borderRadius: 999, fontFamily: 'var(--mad-sans)',
          fontSize: 12, fontWeight: 600, color: 'var(--mad-gray-900)',
          letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M7 1L3 5l4 4"
            stroke="currentColor" strokeWidth="1.6" fill="none"
            strokeLinecap="round" strokeLinejoin="round"/></svg>
          Home
        </button>
      </div>

      {/* Bottom: label + dots + arrows */}
      <div style={{
        position: 'absolute', bottom: 50, left: 14, right: 14,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 28, padding: '12px 16px',
        boxShadow: '0 6px 24px rgba(0,0,0,0.10)',
        display: 'flex', alignItems: 'center', gap: 12,
        zIndex: 50,
      }}>
        <button onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                style={pagerBtn(page === 0)}>
          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M7 1L3 5l4 4"
            stroke="currentColor" strokeWidth="1.6" fill="none"
            strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: 5 }}>
          <div style={{ fontFamily: 'var(--mad-sans)', fontSize: 11, fontWeight: 600,
            color: 'var(--mad-gray-700)', letterSpacing: '0.06em',
            textTransform: 'uppercase' }}>
            {pages[page].label}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {pages.map((_, i) => (
              <button key={i} onClick={() => setPage(i)} style={{
                width: i === page ? 20 : 6, height: 6, borderRadius: 3,
                background: i === page ? 'var(--mad-gray-900)' : 'rgba(0,0,0,0.18)',
                border: 0, cursor: 'pointer', padding: 0,
                transition: 'all .25s ease',
              }} aria-label={`Go to page ${i + 1}`}/>
            ))}
          </div>
        </div>

        <button onClick={() => setPage(p => Math.min(pages.length - 1, p + 1))}
                disabled={page === pages.length - 1}
                style={pagerBtn(page === pages.length - 1)}>
          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M3 1l4 4-4 4"
            stroke="currentColor" strokeWidth="1.6" fill="none"
            strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}

function pagerBtn(disabled) {
  return {
    width: 32, height: 32, borderRadius: 16,
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    border: 0, cursor: disabled ? 'not-allowed' : 'pointer',
    color: disabled ? 'rgba(0,0,0,0.2)' : 'var(--mad-gray-900)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    opacity: disabled ? 0.5 : 1,
  };
}

// Each variant component returns an IOSDevice — we need to strip that frame
// when rendering inside the persistent phone. Wrap them in unframed versions.
function UnframedVariant({ children }) {
  // Children is an IOSDevice — we extract its inner children via a wrapper.
  // Simpler: render the inner screen content directly.
  return children;
}

Object.assign(window, {
  PhoneStage, LauncherScreen, LauncherCard, VariantsBrowser,
});
