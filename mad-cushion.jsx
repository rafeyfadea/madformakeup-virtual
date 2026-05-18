// Mad Cushion Finder — full clickable flow
// Screens: landing → scan → result → (waitlist) / manual

// ── Landing screen ───────────────────────────────────────────
function CushionLanding({ onStart, onManual, onClose }) {
  return (
    <Screen background="linear-gradient(180deg, var(--mad-cream-50) 0%, var(--mad-rose-50) 100%)">
      <BrandHeader onClose={onClose} />
      <div style={{ paddingTop: 142, paddingLeft: 26, paddingRight: 26, paddingBottom: 60 }}>
        <div className="mad-eyebrow" style={{ marginBottom: 14 }}>Cushion finder</div>
        <h1 className="mad-h1" style={{ fontSize: 44, marginBottom: 18 }}>
          Find your shade,<br/>
          <em style={{ color: 'var(--mad-rose-500)', fontFamily: 'inherit' }}>in 10 seconds.</em>
        </h1>
        <p className="mad-body" style={{ marginBottom: 32, maxWidth: 320 }}>
          We scan your skin tone and recommend from N1, N1.5, N2, W1 or W2. No guesswork.
        </p>
        <button className="mad-btn mad-btn-primary" onClick={onStart} style={{ width: '100%' }}>
          Allow camera access
        </button>
        <div style={{ textAlign: 'center', marginTop: 14, marginBottom: 36 }}>
          <button className="mad-link" onClick={onManual}>Or pick a shade manually</button>
        </div>

        {/* Shades guide card */}
        <div className="mad-card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <span className="mad-eyebrow">The shades</span>
            <span className="mad-small" style={{ color: 'var(--mad-gray-500)' }}>5 shades</span>
          </div>
          <ScatterPlot shades={CUSHION_SHADES} height={200} />
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CUSHION_SHADES.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Swatch hex={s.hex} size={22} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--mad-gray-900)', minWidth: 38 }}>{s.name}</span>
                <span className="mad-small">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div style={{ paddingLeft: 4 }}>
          <div className="mad-eyebrow" style={{ marginBottom: 12 }}>How it works</div>
          {[
            'Camera scans your face',
            'AI reads your skin RGB',
            'Closest of 5 shades, recommended',
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
              <span style={{
                width: 22, height: 22, borderRadius: 11, background: 'var(--mad-rose-100)',
                color: 'var(--mad-rose-700)', fontSize: 11, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{i + 1}</span>
              <span className="mad-body" style={{ fontSize: 14, lineHeight: 1.5 }}>{t}</span>
            </div>
          ))}
        </div>

        <p className="mad-small" style={{ marginTop: 28, fontSize: 11, lineHeight: 1.5,
          color: 'var(--mad-gray-500)', maxWidth: 320 }}>
          Camera runs on-device. We never store your photo. Virtual try-on is for reference, actual shade may vary with lighting.
        </p>
      </div>
    </Screen>
  );
}

// ── Scan screen ──────────────────────────────────────────────
function CushionScan({ onComplete, onCancel }) {
  const [stage, setStage] = React.useState(0); // 0 detect, 1 analyze, 2 match
  React.useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1100);
    const t2 = setTimeout(() => setStage(2), 2300);
    const t3 = setTimeout(() => onComplete(), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);
  const messages = [
    { title: 'Hold steady', sub: 'Detecting your face' },
    { title: 'Reading skin tone', sub: 'Sampling cheek + forehead' },
    { title: 'Matching shade', sub: 'Comparing against the 5' },
  ];
  return (
    <Screen background="#1a1612" dark scrollable={false}>
      <FacePhoto src={FACE_PORTRAIT} style={{ position: 'absolute', inset: 0 }} />
      {/* darken/grade */}
      <div style={{ position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 38%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.55) 80%)',
      }}/>
      <FaceMesh />
      <ScanSweep />
      {/* close */}
      <CloseBtn onClick={onCancel} light top={66} right={22} />
      {/* sampling rectangles (cheek + forehead) */}
      <SampleBoxes visible={stage >= 1} />
      {/* status text bottom */}
      <div style={{
        position: 'absolute', bottom: 80, left: 26, right: 26, textAlign: 'center',
        color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,.5)',
      }}>
        <div style={{ fontFamily: 'var(--mad-serif)', fontSize: 30, fontWeight: 400,
          lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: 8,
        }}>{messages[stage].title}</div>
        <div style={{ fontFamily: 'var(--mad-sans)', fontSize: 14, opacity: 0.85, marginBottom: 18 }}>
          {messages[stage].sub}
        </div>
        <ProgressDots />
      </div>
      {/* step indicator dots top */}
      <div style={{
        position: 'absolute', top: 116, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 8,
      }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            width: i === stage ? 22 : 6, height: 6, borderRadius: 3,
            background: i <= stage ? 'var(--mad-rose-500)' : 'rgba(255,255,255,0.3)',
            transition: 'all .35s ease',
          }}/>
        ))}
      </div>
    </Screen>
  );
}

function SampleBoxes({ visible }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"
         style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                  pointerEvents: 'none', opacity: visible ? 1 : 0, transition: 'opacity .4s' }}>
      {/* forehead */}
      <rect x="44" y="34" width="12" height="8" rx="1.5"
            fill="none" stroke="#A8E6CF" strokeWidth="0.35" strokeDasharray="1 1.2"/>
      <text x="44" y="32" fontSize="2.2" fill="#A8E6CF" fontFamily="Inter">FOREHEAD</text>
      {/* left cheek */}
      <rect x="35" y="50" width="9" height="7" rx="1.5"
            fill="none" stroke="#A8E6CF" strokeWidth="0.35" strokeDasharray="1 1.2"/>
      <text x="35" y="60" fontSize="2.2" fill="#A8E6CF" fontFamily="Inter">CHEEK</text>
      {/* right cheek */}
      <rect x="56" y="50" width="9" height="7" rx="1.5"
            fill="none" stroke="#A8E6CF" strokeWidth="0.35" strokeDasharray="1 1.2"/>
    </svg>
  );
}

// ── Result screen ────────────────────────────────────────────
function CushionResult({ shadeId, setShadeId, stockOverride, setStockOverride, onWaitlist, onTryAgain, onSavePhoto, onClose }) {
  const idx = CUSHION_SHADES.findIndex(s => s.id === shadeId);
  const shade = CUSHION_SHADES[idx] || CUSHION_SHADES[1];
  const stock = stockOverride ?? shade.stock;
  const status = stockStatus(stock);

  const prev = () => setShadeId(CUSHION_SHADES[(idx - 1 + CUSHION_SHADES.length) % CUSHION_SHADES.length].id);
  const next = () => setShadeId(CUSHION_SHADES[(idx + 1) % CUSHION_SHADES.length].id);

  return (
    <Screen background="var(--mad-cream-50)">
      <BrandHeader onClose={onClose} />
      {/* Hero: face preview with tinted shade */}
      <div style={{ paddingTop: 130, paddingLeft: 26, paddingRight: 26 }}>
        <div className="mad-eyebrow" style={{ textAlign: 'center', marginBottom: 8,
          color: 'var(--mad-rose-700)' }}>Your match</div>
        <h1 className="mad-h1" style={{ fontSize: 64, textAlign: 'center', marginBottom: 4 }}>
          {shade.name}
        </h1>
        <p className="mad-small" style={{ textAlign: 'center', marginBottom: 24 }}>
          {shade.label} undertone
        </p>

        {/* Face preview with tint */}
        <div style={{
          position: 'relative', height: 260, borderRadius: 22, overflow: 'hidden',
          marginBottom: 22, boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }}>
          <FacePhoto src={FACE_PORTRAIT} tint={shade.hex} tintOpacity={0.32} />
          {/* swatch chip floating bottom-right */}
          <div style={{
            position: 'absolute', bottom: 14, right: 14,
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            padding: '8px 12px 8px 8px', borderRadius: 999,
          }}>
            <Swatch hex={shade.hex} size={28} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--mad-gray-900)' }}>{shade.name}</span>
          </div>
        </div>

        {/* Why this shade */}
        <div className="mad-card" style={{ marginBottom: 22 }}>
          <div className="mad-eyebrow" style={{ marginBottom: 8 }}>Why {shade.name}</div>
          <p className="mad-body" style={{ fontSize: 14 }}>
            Your skin reads {shade.undertone.toLowerCase()} (balanced pink and yellow) with {shade.label.toLowerCase()} depth. Match confidence 87%.
          </p>
        </div>

        {/* Stock + CTA */}
        <div style={{ marginBottom: 14 }}>
          <StockBadge qty={stock} />
        </div>

        {status.kind === 'out' ? (
          <button className="mad-btn mad-btn-primary" onClick={onWaitlist} style={{ width: '100%' }}>
            Join the waitlist
          </button>
        ) : (
          <button className="mad-btn mad-btn-dark" style={{ width: '100%',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
            <span>Add to cart</span>
            <span style={{ fontWeight: 400, opacity: 0.8 }}>${shade.price}.00</span>
          </button>
        )}

        {/* Shade nav */}
        <div style={{ marginTop: 28 }}>
          <div className="mad-eyebrow" style={{ marginBottom: 12, textAlign: 'center' }}>Try another</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--mad-cream-100)', borderRadius: 999, padding: 6 }}>
            <button onClick={prev} aria-label="Previous" style={{
              width: 38, height: 38, borderRadius: 19, border: 0, background: 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--mad-gray-700)',
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {CUSHION_SHADES.map(s => (
                <button key={s.id} onClick={() => setShadeId(s.id)} style={{
                  border: 0, background: 'transparent', padding: 0, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                }}>
                  <Swatch hex={s.hex} size={28} selected={s.id === shade.id} />
                  <span style={{ fontSize: 10, fontWeight: 600,
                    color: s.id === shade.id ? 'var(--mad-gray-900)' : 'var(--mad-gray-500)' }}>{s.name}</span>
                </button>
              ))}
            </div>
            <button onClick={next} aria-label="Next" style={{
              width: 38, height: 38, borderRadius: 19, border: 0, background: 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--mad-gray-700)',
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M5 1l6 6-6 6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        {/* Secondary actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 24, marginBottom: 16 }}>
          <button className="mad-btn mad-btn-ghost" onClick={onTryAgain}
                  style={{ flex: 1, padding: '13px 14px', fontSize: 14 }}>
            Try again
          </button>
          <button className="mad-btn mad-btn-ghost" onClick={onSavePhoto}
                  style={{ flex: 1, padding: '13px 14px', fontSize: 14 }}>
            Save photo
          </button>
        </div>

        {/* dev: stock toggle (subtle, for demo of waitlist) */}
        <div style={{ marginTop: 18, padding: '10px 12px',
          background: 'rgba(0,0,0,0.025)', borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: 'var(--mad-gray-500)', letterSpacing: '0.04em' }}>
            DEMO: force out of stock
          </span>
          <button onClick={() => setStockOverride(stock === 0 ? null : 0)} style={{
            border: 0, background: stock === 0 ? 'var(--mad-rose-500)' : 'var(--mad-gray-300)',
            color: '#fff', fontSize: 11, padding: '5px 12px', borderRadius: 999, cursor: 'pointer',
            fontWeight: 600,
          }}>{stock === 0 ? 'On' : 'Off'}</button>
        </div>
        <div style={{ height: 60 }}/>
      </div>
    </Screen>
  );
}

// ── Waitlist (out of stock) ─────────────────────────────────
function CushionWaitlist({ shadeId, onBack, onClose }) {
  const shade = CUSHION_SHADES.find(s => s.id === shadeId) || CUSHION_SHADES[2];
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <Screen background="var(--mad-cream-50)">
      <BrandHeader onClose={onClose} />
      <div style={{ paddingTop: 130, paddingLeft: 26, paddingRight: 26, paddingBottom: 60 }}>
        {/* back link */}
        <button onClick={onBack} className="mad-link" style={{ marginBottom: 18,
          textDecoration: 'none', color: 'var(--mad-gray-500)', fontSize: 13 }}>
          ← Back to result
        </button>

        <div className="mad-eyebrow" style={{ marginBottom: 12, color: 'var(--mad-error)' }}>
          Sold out for now
        </div>
        <h1 className="mad-h1" style={{ fontSize: 38, marginBottom: 16 }}>
          {shade.name} is in<br/>
          <em style={{ color: 'var(--mad-rose-500)', fontFamily: 'inherit' }}>high demand.</em>
        </h1>
        <p className="mad-body" style={{ marginBottom: 28, maxWidth: 320 }}>
          Drop your email and we&apos;ll ping you the second it restocks. No spam, just the shade.
        </p>

        {/* shade preview card */}
        <div className="mad-card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 26 }}>
          <Swatch hex={shade.hex} size={56} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--mad-gray-900)', marginBottom: 2 }}>
              Mad Cushion · {shade.name}
            </div>
            <div className="mad-small">{shade.label} undertone</div>
          </div>
          <StockBadge qty={0} compact />
        </div>

        {submitted ? (
          <div style={{
            background: 'var(--mad-sage-100)', borderRadius: 18, padding: '22px 20px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: 'var(--mad-sage-500)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="14" viewBox="0 0 18 14"><path d="M1 7l5 5L17 2" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontFamily: 'var(--mad-serif)', fontSize: 22, color: 'var(--mad-sage-700)' }}>
              You&apos;re on the list.
            </div>
            <div className="mad-small" style={{ color: 'var(--mad-sage-700)', maxWidth: 240 }}>
              Position #47 in the queue. Estimated restock: June 1.
            </div>
            <button className="mad-link" onClick={onBack} style={{ marginTop: 6, color: 'var(--mad-sage-700)' }}>
              Back to shade preview
            </button>
          </div>
        ) : (
          <>
            <label className="mad-eyebrow" style={{ display: 'block', marginBottom: 8 }}>
              Email address
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%', boxSizing: 'border-box', padding: '15px 18px',
                border: '1.5px solid var(--mad-gray-300)', borderRadius: 14,
                fontFamily: 'var(--mad-sans)', fontSize: 15, color: 'var(--mad-gray-900)',
                background: '#fff', outline: 'none', marginBottom: 14,
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--mad-rose-500)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--mad-gray-300)'}
            />
            <button className="mad-btn mad-btn-primary" style={{ width: '100%' }}
                    disabled={!email.includes('@')}
                    onClick={() => setSubmitted(true)}>
              Notify me
            </button>
            <p className="mad-small" style={{ marginTop: 18, fontSize: 12 }}>
              You&apos;ll be notified once. We won&apos;t send anything else.
            </p>
          </>
        )}

        {/* analytics-y demand signal */}
        <div style={{ marginTop: 36, padding: 18, borderRadius: 18,
          background: 'var(--mad-rose-50)', border: '1px solid var(--mad-rose-100)' }}>
          <div className="mad-eyebrow" style={{ color: 'var(--mad-rose-700)', marginBottom: 8 }}>
            Demand signal
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--mad-serif)', fontSize: 34, color: 'var(--mad-gray-900)' }}>312</span>
            <span className="mad-small">people waiting on {shade.name}</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'rgba(212,115,143,0.18)', overflow: 'hidden' }}>
            <div style={{ width: '78%', height: '100%', background: 'var(--mad-rose-500)' }}/>
          </div>
          <p className="mad-small" style={{ marginTop: 8, fontSize: 11 }}>
            Restock prioritized based on waitlist size.
          </p>
        </div>
      </div>
    </Screen>
  );
}

// ── Manual selection (scatter plot) ──────────────────────────
function CushionManual({ shadeId, setShadeId, onConfirm, onBack, onClose }) {
  const shade = CUSHION_SHADES.find(s => s.id === shadeId) || CUSHION_SHADES[1];
  return (
    <Screen background="var(--mad-cream-50)">
      <BrandHeader onClose={onClose} />
      <div style={{ paddingTop: 130, paddingLeft: 26, paddingRight: 26, paddingBottom: 60 }}>
        <button onClick={onBack} className="mad-link" style={{ marginBottom: 14,
          textDecoration: 'none', color: 'var(--mad-gray-500)', fontSize: 13 }}>
          ← Back
        </button>
        <h1 className="mad-h1" style={{ fontSize: 36, marginBottom: 8 }}>
          Pick your shade<br/>manually.
        </h1>
        <p className="mad-body" style={{ marginBottom: 26 }}>
          Tap a swatch to preview. Position reflects undertone and depth.
        </p>

        <ScatterPlot shades={CUSHION_SHADES} selected={shade.id}
                     onSelect={setShadeId} height={280} />

        {/* selected preview row */}
        <div style={{ marginTop: 24, display: 'flex', gap: 16, alignItems: 'center',
          background: '#fff', borderRadius: 18, padding: 16, border: '1px solid var(--mad-cream-100)' }}>
          <Swatch hex={shade.hex} size={56} selected />
          <div style={{ flex: 1 }}>
            <div className="mad-eyebrow" style={{ marginBottom: 2 }}>Selected</div>
            <div style={{ fontFamily: 'var(--mad-serif)', fontSize: 26, lineHeight: 1, color: 'var(--mad-gray-900)' }}>
              {shade.name}
            </div>
            <div className="mad-small" style={{ marginTop: 4 }}>{shade.label}</div>
          </div>
        </div>

        <button className="mad-btn mad-btn-primary" onClick={onConfirm}
                style={{ width: '100%', marginTop: 22 }}>
          See {shade.name} on a face
        </button>
      </div>
    </Screen>
  );
}

// ── Save photo ───────────────────────────────────────────────
function CushionSavePhoto({ shadeId, onBack, onClose }) {
  const shade = CUSHION_SHADES.find(s => s.id === shadeId) || CUSHION_SHADES[1];
  return (
    <Screen background="var(--mad-cream-50)">
      <BrandHeader onClose={onClose} />
      <div style={{ paddingTop: 130, paddingLeft: 26, paddingRight: 26, paddingBottom: 60 }}>
        <button onClick={onBack} className="mad-link" style={{ marginBottom: 14,
          textDecoration: 'none', color: 'var(--mad-gray-500)', fontSize: 13 }}>
          ← Back
        </button>
        <h1 className="mad-h1" style={{ fontSize: 32, marginBottom: 6 }}>
          Saved. Share it,<br/>or keep it for you.
        </h1>
        <p className="mad-body" style={{ marginBottom: 24 }}>
          {shade.name} on your face, watermarked.
        </p>

        {/* photo preview with watermark */}
        <div style={{ position: 'relative', height: 360, borderRadius: 22, overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          <FacePhoto src={FACE_PORTRAIT} tint={shade.hex} tintOpacity={0.30} />
          {/* watermark bottom-right */}
          <div style={{ position: 'absolute', bottom: 16, right: 16,
            display: 'flex', alignItems: 'center', gap: 8, color: '#fff',
            textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            <MadLogo color="#fff" size={16}/>
          </div>
          {/* shade tag bottom-left */}
          <div style={{ position: 'absolute', bottom: 16, left: 16,
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)',
            padding: '6px 12px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Swatch hex={shade.hex} size={20}/>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--mad-gray-900)' }}>{shade.name}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button className="mad-btn mad-btn-ghost" style={{ flex: 1, padding: '13px 14px', fontSize: 14 }}>
            Download
          </button>
          <button className="mad-btn mad-btn-ghost" style={{ flex: 1, padding: '13px 14px', fontSize: 14 }}>
            Share
          </button>
        </div>
        <button className="mad-btn mad-btn-primary" style={{ width: '100%', marginTop: 12 }}>
          Add to cart, ${shade.price}.00
        </button>
      </div>
    </Screen>
  );
}

// ── State machine (no device frame) ──────────────────────────
function CushionFlow({ initialScreen = 'landing', initialShade = 'N1.5', onExit }) {
  const [screen, setScreen] = React.useState(initialScreen);
  const [shadeId, setShadeId] = React.useState(initialShade);
  const [stockOverride, setStockOverride] = React.useState(null);

  // X always exits back to host (launcher); if no onExit, reset to landing.
  const close = () => {
    if (onExit) onExit();
    else { setScreen('landing'); setStockOverride(null); }
  };

  return (
    <>
      {screen === 'landing'  && <CushionLanding onStart={() => setScreen('scan')} onManual={() => setScreen('manual')} onClose={close}/>}
      {screen === 'scan'     && <CushionScan onComplete={() => setScreen('result')} onCancel={() => setScreen('landing')}/>}
      {screen === 'result'   && <CushionResult
                                  shadeId={shadeId} setShadeId={setShadeId}
                                  stockOverride={stockOverride} setStockOverride={setStockOverride}
                                  onWaitlist={() => setScreen('waitlist')}
                                  onTryAgain={() => setScreen('scan')}
                                  onSavePhoto={() => setScreen('save')}
                                  onClose={close}/>}
      {screen === 'waitlist' && <CushionWaitlist shadeId={shadeId} onBack={() => setScreen('result')} onClose={close}/>}
      {screen === 'manual'   && <CushionManual shadeId={shadeId} setShadeId={setShadeId}
                                  onConfirm={() => setScreen('result')}
                                  onBack={() => setScreen('landing')} onClose={close}/>}
      {screen === 'save'     && <CushionSavePhoto shadeId={shadeId} onBack={() => setScreen('result')} onClose={close}/>}
    </>
  );
}

// CushionApp wraps the flow in an iOS device frame (design-canvas mode).
function CushionApp(props) {
  return (
    <IOSDevice width={402} height={874}>
      <CushionFlow {...props} />
    </IOSDevice>
  );
}

Object.assign(window, {
  CushionApp, CushionFlow, CushionLanding, CushionScan, CushionResult,
  CushionWaitlist, CushionManual, CushionSavePhoto,
});
