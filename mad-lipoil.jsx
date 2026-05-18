// Mad Lip Oil Try-On — clickable flow
// Screens: landing → tryon (swipe through 5 shades) → save

// ── Landing ──────────────────────────────────────────────────
function LipOilLanding({ onStart, onClose }) {
  return (
    <Screen background="linear-gradient(180deg, var(--mad-cream-50) 0%, var(--mad-rose-50) 100%)">
      <BrandHeader onClose={onClose} />
      <div style={{ paddingTop: 142, paddingLeft: 26, paddingRight: 26, paddingBottom: 60 }}>
        <div className="mad-eyebrow" style={{ marginBottom: 14 }}>Lip oil try-on</div>
        <h1 className="mad-h1" style={{ fontSize: 44, marginBottom: 18 }}>
          Try every shade,<br/>
          <em style={{ color: 'var(--mad-rose-500)', fontFamily: 'inherit' }}>in real time.</em>
        </h1>
        <p className="mad-body" style={{ marginBottom: 32, maxWidth: 320 }}>
          Swipe through five lip oils. See what they look like on your mouth, instantly.
        </p>
        <button className="mad-btn mad-btn-primary" onClick={onStart} style={{ width: '100%' }}>
          Start try-on
        </button>

        {/* Five shades preview row (large swatches) */}
        <div style={{ marginTop: 36, marginBottom: 20 }}>
          <div className="mad-eyebrow" style={{ marginBottom: 14 }}>The five</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            {LIP_SHADES.map(s => (
              <div key={s.id} style={{ flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 6 }}>
                <Swatch hex={s.hex} size={52} />
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--mad-gray-700)',
                  textAlign: 'center', lineHeight: 1.15 }}>{s.short}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shades guide */}
        <div className="mad-card" style={{ marginTop: 18 }}>
          <div className="mad-eyebrow" style={{ marginBottom: 12 }}>Shades, by undertone</div>
          <ScatterPlot
            shades={LIP_SHADES}
            height={220}
            axisLabels={['Warm', 'Cool', 'Light', 'Deep']}
          />
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {LIP_SHADES.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Swatch hex={s.hex} size={22} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--mad-gray-900)' }}>
                    {s.name}
                  </div>
                  <div className="mad-small" style={{ fontSize: 11 }}>{s.description}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--mad-gray-500)' }}>
                  ${s.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="mad-small" style={{ marginTop: 24, fontSize: 11, lineHeight: 1.5,
          color: 'var(--mad-gray-500)', maxWidth: 320 }}>
          Camera runs on-device. We never store your photo or face data.
        </p>
      </div>
    </Screen>
  );
}

// ── Live try-on (swipe shades) ───────────────────────────────
function LipOilTryOn({ shadeId, setShadeId, onSave, onAddToCart, onCompare, onClose, onWaitlist }) {
  const idx = LIP_SHADES.findIndex(s => s.id === shadeId);
  const shade = LIP_SHADES[idx] || LIP_SHADES[0];
  const [meshOn, setMeshOn] = React.useState(true);
  const [scanned, setScanned] = React.useState(false);

  // brief intro scan (lip mesh visible) then dim
  React.useEffect(() => {
    const t = setTimeout(() => setScanned(true), 1400);
    const t2 = setTimeout(() => setMeshOn(false), 2200);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  // swipe handlers
  const touchRef = React.useRef({ x: 0, t: 0, active: false });
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, t: Date.now(), active: true };
  };
  const onTouchEnd = (e) => {
    if (!touchRef.current.active) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    touchRef.current.active = false;
    if (Math.abs(dx) < 30) return;
    if (dx < 0) setShadeId(LIP_SHADES[(idx + 1) % LIP_SHADES.length].id);
    else        setShadeId(LIP_SHADES[(idx - 1 + LIP_SHADES.length) % LIP_SHADES.length].id);
  };

  const stock = shade.stock;
  const status = stockStatus(stock);

  return (
    <Screen background="#1a1612" dark scrollable={false}>
      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
           style={{ position: 'absolute', inset: 0, touchAction: 'pan-y' }}>
        <FacePhoto src={FACE_PORTRAIT} lipShade={shade.hex}
                   lipOpacity={scanned ? 0.62 : 0.0}
                   style={{ position: 'absolute', inset: 0 }}/>
        {/* dim edges */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)' }}/>
        <LipMesh visible={meshOn} />
      </div>

      {/* Close */}
      <CloseBtn onClick={onClose} light top={66} right={22} />

      {/* Mesh toggle */}
      <button onClick={() => setMeshOn(v => !v)} style={{
        position: 'absolute', top: 66, left: 22, height: 36, padding: '0 14px',
        borderRadius: 18, border: 0, cursor: 'pointer',
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        color: '#fff', fontSize: 12, fontWeight: 500, letterSpacing: '0.03em',
        zIndex: 30, display: 'flex', alignItems: 'center', gap: 7,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: meshOn ? '#A8E6CF' : 'rgba(255,255,255,0.4)' }}/>
        {meshOn ? 'Tracking lips' : 'Mesh off'}
      </button>

      {/* Shade name big & subtitle, top center area */}
      <div style={{
        position: 'absolute', top: 124, left: 0, right: 0, textAlign: 'center',
        color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.5)',
        pointerEvents: 'none',
      }}>
        <div key={shade.id} className="mad-fadein"
             style={{ fontFamily: 'var(--mad-serif)', fontSize: 36, fontWeight: 400,
                      letterSpacing: '-0.01em', lineHeight: 1 }}>
          {shade.name}
        </div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4, fontFamily: 'var(--mad-sans)' }}>
          {shade.description}
        </div>
      </div>

      {/* Swipe hint */}
      <div style={{
        position: 'absolute', top: 220, left: 0, right: 0, textAlign: 'center',
        color: 'rgba(255,255,255,0.55)', fontSize: 11, letterSpacing: '0.14em',
        textTransform: 'uppercase', fontWeight: 500,
      }}>
        ← Swipe to switch →
      </div>

      {/* Bottom dock */}
      <div style={{
        position: 'absolute', bottom: 50, left: 14, right: 14,
        borderRadius: 28, padding: '18px 18px 20px',
        background: 'rgba(20,16,14,0.55)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        border: '0.5px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        zIndex: 25,
      }}>
        {/* Shade picker row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, justifyContent: 'space-between' }}>
          {LIP_SHADES.map(s => (
            <button key={s.id} onClick={() => setShadeId(s.id)} style={{
              flex: 1, border: 0, background: 'transparent', cursor: 'pointer',
              padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
            }}>
              <div style={{
                position: 'relative', width: 44, height: 44, borderRadius: 22,
                background: s.hex,
                border: s.id === shade.id ? '1.5px solid #fff' : '1.5px solid transparent',
                boxShadow: s.id === shade.id ? '0 0 0 3px rgba(255,255,255,0.18)' : 'none',
                transition: 'all 150ms ease',
              }}>
                {s.stock === 0 && (
                  <span style={{ position: 'absolute', top: -3, right: -3, width: 14, height: 14,
                    borderRadius: 7, background: 'var(--mad-error)', color: '#fff',
                    fontSize: 9, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1.5px solid #1a1612' }}>!</span>
                )}
              </div>
              <span style={{ fontSize: 10, fontWeight: 600,
                color: s.id === shade.id ? '#fff' : 'rgba(255,255,255,0.55)' }}>
                {s.short}
              </span>
            </button>
          ))}
        </div>

        {/* Stock + price + actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {status.kind === 'in' ? 'In stock' : status.kind === 'low' ? 'Low stock' : 'Sold out'}
            </div>
            <div style={{ fontFamily: 'var(--mad-serif)', fontSize: 22, color: '#fff', lineHeight: 1.1 }}>
              ${shade.price}.00
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <DockBtn label="Save" onClick={onSave} icon={
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 1h6l2 2v10l-5-3-5 3V1h2" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            }/>
            {stock === 0 ? (
              <button onClick={onWaitlist} style={{
                background: 'var(--mad-error)', color: '#fff', border: 0, cursor: 'pointer',
                borderRadius: 999, padding: '10px 18px', fontFamily: 'var(--mad-sans)',
                fontWeight: 600, fontSize: 13,
              }}>Join waitlist</button>
            ) : (
              <button onClick={onAddToCart} style={{
                background: '#fff', color: 'var(--mad-gray-900)', border: 0, cursor: 'pointer',
                borderRadius: 999, padding: '10px 18px', fontFamily: 'var(--mad-sans)',
                fontWeight: 600, fontSize: 13,
              }}>Add to cart</button>
            )}
          </div>
        </div>
      </div>
    </Screen>
  );
}

function DockBtn({ icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'rgba(255,255,255,0.12)', color: '#fff', border: 0, cursor: 'pointer',
      borderRadius: 999, padding: '10px 14px', fontFamily: 'var(--mad-sans)',
      fontWeight: 500, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
    }}>
      {icon} {label}
    </button>
  );
}

// ── Save & Share ─────────────────────────────────────────────
function LipOilSavePhoto({ shadeId, onBack, onClose, onAddToCart }) {
  const shade = LIP_SHADES.find(s => s.id === shadeId) || LIP_SHADES[0];
  return (
    <Screen background="var(--mad-cream-50)">
      <BrandHeader onClose={onClose} />
      <div style={{ paddingTop: 130, paddingLeft: 26, paddingRight: 26, paddingBottom: 60 }}>
        <button onClick={onBack} className="mad-link" style={{ marginBottom: 14,
          textDecoration: 'none', color: 'var(--mad-gray-500)', fontSize: 13 }}>
          ← Back to try-on
        </button>
        <h1 className="mad-h1" style={{ fontSize: 32, marginBottom: 6 }}>
          Saved. <em style={{ color: 'var(--mad-rose-500)', fontFamily: 'inherit' }}>Share it.</em>
        </h1>
        <p className="mad-body" style={{ marginBottom: 22 }}>
          {shade.name} on your lips, with the Mad watermark.
        </p>

        <div style={{ position: 'relative', height: 380, borderRadius: 22, overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          <FacePhoto src={FACE_PORTRAIT} lipShade={shade.hex} lipOpacity={0.62}/>
          {/* watermark */}
          <div style={{ position: 'absolute', bottom: 18, right: 18,
            display: 'flex', alignItems: 'center', gap: 8, color: '#fff',
            textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            <MadLogo color="#fff" size={16}/>
          </div>
          {/* shade tag */}
          <div style={{ position: 'absolute', bottom: 18, left: 18,
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)',
            padding: '6px 12px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Swatch hex={shade.hex} size={20}/>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--mad-gray-900)' }}>{shade.name}</span>
          </div>
        </div>

        {/* Share row */}
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <ShareBtn label="Download" />
          <ShareBtn label="Instagram" accent />
          <ShareBtn label="Copy link" />
        </div>

        {/* Product row */}
        <div className="mad-card" style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Swatch hex={shade.hex} size={48}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--mad-gray-900)' }}>
              Mad Lip Oil · {shade.name}
            </div>
            <div className="mad-small" style={{ fontSize: 12 }}>{shade.description}</div>
            <div style={{ marginTop: 4 }}>
              <StockBadge qty={shade.stock} compact />
            </div>
          </div>
        </div>
        <button className="mad-btn mad-btn-primary" onClick={onAddToCart}
                style={{ width: '100%', marginTop: 14,
                         display: 'flex', justifyContent: 'space-between', padding: '15px 22px' }}>
          <span>Add to cart</span><span style={{ opacity: 0.85, fontWeight: 400 }}>${shade.price}.00</span>
        </button>
      </div>
    </Screen>
  );
}

function ShareBtn({ label, accent = false }) {
  return (
    <button style={{
      flex: 1, padding: '13px 8px', fontSize: 13, fontWeight: 500,
      fontFamily: 'var(--mad-sans)', cursor: 'pointer',
      border: accent ? 0 : '1.5px solid var(--mad-rose-200)',
      background: accent ? 'var(--mad-rose-500)' : 'transparent',
      color: accent ? '#fff' : 'var(--mad-rose-500)',
      borderRadius: 999,
    }}>{label}</button>
  );
}

// ── Lip waitlist (sold out) ─────────────────────────────────
function LipOilWaitlist({ shadeId, onBack, onClose }) {
  const shade = LIP_SHADES.find(s => s.id === shadeId) || LIP_SHADES[0];
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  return (
    <Screen background="var(--mad-cream-50)">
      <BrandHeader onClose={onClose} />
      <div style={{ paddingTop: 130, paddingLeft: 26, paddingRight: 26, paddingBottom: 60 }}>
        <button onClick={onBack} className="mad-link" style={{ marginBottom: 18,
          textDecoration: 'none', color: 'var(--mad-gray-500)', fontSize: 13 }}>
          ← Back
        </button>
        <div className="mad-eyebrow" style={{ marginBottom: 12, color: 'var(--mad-error)' }}>Sold out</div>
        <h1 className="mad-h1" style={{ fontSize: 38, marginBottom: 14 }}>
          {shade.name} is<br/>
          <em style={{ color: 'var(--mad-rose-500)', fontFamily: 'inherit' }}>flying off shelves.</em>
        </h1>
        <p className="mad-body" style={{ marginBottom: 26 }}>
          Drop your email. We restock fast.
        </p>

        <div className="mad-card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Swatch hex={shade.hex} size={56} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Mad Lip Oil · {shade.name}</div>
            <div className="mad-small">{shade.description}</div>
          </div>
          <StockBadge qty={0} compact />
        </div>

        {submitted ? (
          <div style={{ background: 'var(--mad-sage-100)', borderRadius: 18, padding: '22px 20px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: 'var(--mad-sage-500)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="14" viewBox="0 0 18 14"><path d="M1 7l5 5L17 2" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontFamily: 'var(--mad-serif)', fontSize: 22, color: 'var(--mad-sage-700)' }}>
              You&apos;re on the list.
            </div>
            <div className="mad-small" style={{ color: 'var(--mad-sage-700)' }}>
              Position #18. Restock typically arrives in 2 weeks.
            </div>
          </div>
        ) : (
          <>
            <label className="mad-eyebrow" style={{ display: 'block', marginBottom: 8 }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
              style={{ width: '100%', boxSizing: 'border-box', padding: '15px 18px',
                border: '1.5px solid var(--mad-gray-300)', borderRadius: 14,
                fontFamily: 'var(--mad-sans)', fontSize: 15, background: '#fff', outline: 'none',
                marginBottom: 14 }}/>
            <button className="mad-btn mad-btn-primary" style={{ width: '100%' }}
                    disabled={!email.includes('@')} onClick={() => setSubmitted(true)}>
              Notify me
            </button>
          </>
        )}
      </div>
    </Screen>
  );
}

// ── Toast (cart added) ───────────────────────────────────────
function Toast({ message, visible }) {
  return (
    <div style={{
      position: 'absolute', bottom: visible ? 130 : 70, left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--mad-gray-900)', color: '#fff',
      padding: '12px 22px', borderRadius: 999,
      fontFamily: 'var(--mad-sans)', fontSize: 13, fontWeight: 500,
      boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
      opacity: visible ? 1 : 0, transition: 'all .3s ease',
      pointerEvents: 'none', zIndex: 100, whiteSpace: 'nowrap',
    }}>{message}</div>
  );
}

// ── State machine (no device frame) ──────────────────────────
function LipOilFlow({ initialScreen = 'landing', initialShade = 'rose-quartz', onExit }) {
  const [screen, setScreen] = React.useState(initialScreen);
  const [shadeId, setShadeId] = React.useState(initialShade);
  const [toast, setToast] = React.useState(null);
  const close = () => {
    if (onExit) onExit();
    else setScreen('landing');
  };
  const addToCart = () => {
    setToast('Added to cart');
    setTimeout(() => setToast(null), 1800);
  };
  return (
    <>
      {screen === 'landing'  && <LipOilLanding onStart={() => setScreen('tryon')} onClose={close}/>}
      {screen === 'tryon'    && <LipOilTryOn shadeId={shadeId} setShadeId={setShadeId}
                                     onSave={() => setScreen('save')}
                                     onAddToCart={addToCart}
                                     onWaitlist={() => setScreen('waitlist')}
                                     onClose={close}/>}
      {screen === 'save'     && <LipOilSavePhoto shadeId={shadeId} onBack={() => setScreen('tryon')}
                                     onAddToCart={addToCart} onClose={close}/>}
      {screen === 'waitlist' && <LipOilWaitlist shadeId={shadeId} onBack={() => setScreen('tryon')} onClose={close}/>}
      <Toast message={toast || ''} visible={!!toast}/>
    </>
  );
}

function LipOilApp(props) {
  return (
    <div style={{ position: 'relative' }}>
      <IOSDevice width={402} height={874}>
        <LipOilFlow {...props} />
      </IOSDevice>
    </div>
  );
}

Object.assign(window, {
  LipOilApp, LipOilFlow, LipOilLanding, LipOilTryOn, LipOilSavePhoto, LipOilWaitlist,
});
