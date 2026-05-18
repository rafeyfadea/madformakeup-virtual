// Direction explorations — alternative still-frame treatments.
// Each variant exports a "Bare" component (just the Screen, no device frame)
// and a wrapped version for the design canvas.

// ── VARIATION A — Cushion Result, "Editorial / Parisian minimal" ──
function VariantCushionEditorialBare({ shadeId = 'N1.5' }) {
  const shade = CUSHION_SHADES.find(s => s.id === shadeId) || CUSHION_SHADES[1];
  return (
    <Screen background="var(--mad-cream-50)" scrollable={false}>
      {/* Top minimal nav */}
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        padding: '0 26px', zIndex: 20 }}>
        <MadLogo size={18}/>
      </div>

      {/* Hero portrait full-bleed top half */}
      <div style={{ position: 'absolute', top: 110, left: 0, right: 0, height: 460,
        overflow: 'hidden' }}>
        <FacePhoto src={FACE_PORTRAIT} tint={shade.hex} tintOpacity={0.30} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 50%, var(--mad-cream-50) 100%)' }}/>
      </div>

      {/* Floating shade ID over hero */}
      <div style={{ position: 'absolute', top: 130, left: 26,
        background: 'rgba(253,252,251,0.92)', backdropFilter: 'blur(10px)',
        padding: '8px 16px', borderRadius: 999,
        display: 'inline-flex', alignItems: 'center', gap: 10 }}>
        <Swatch hex={shade.hex} size={24}/>
        <span style={{ fontFamily: 'var(--mad-sans)', fontSize: 11, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--mad-gray-900)' }}>
          Match · {shade.name}
        </span>
      </div>

      {/* Bottom info */}
      <div style={{ position: 'absolute', bottom: 138, left: 26, right: 26 }}>
        <div className="mad-eyebrow" style={{ marginBottom: 10 }}>You wear</div>
        <h1 className="mad-h1" style={{ fontSize: 88, lineHeight: 0.95, marginBottom: 14,
          fontWeight: 300, letterSpacing: '-0.025em' }}>
          <em>{shade.name}</em>
        </h1>
        <p className="mad-body" style={{ fontSize: 15, marginBottom: 22, maxWidth: 300 }}>
          {shade.label} neutral. Pink and yellow, balanced. 87% confidence.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="mad-btn mad-btn-dark" style={{ flex: 1,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 22px' }}>
            <span>Add to cart</span><span style={{ opacity: 0.85, fontWeight: 400 }}>${shade.price}</span>
          </button>
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <StockBadge qty={shade.stock} compact/>
          <span className="mad-small" style={{ fontSize: 11 }}>·</span>
          <button className="mad-link" style={{ fontSize: 12 }}>See all 5 shades</button>
        </div>
      </div>
    </Screen>
  );
}

// ── VARIATION B — Lip Oil Try-On, "Side rail" ────────────────
function VariantLipOilSideRailBare({ shadeId = 'pink-amethyst' }) {
  const idx = LIP_SHADES.findIndex(s => s.id === shadeId);
  const shade = LIP_SHADES[idx] || LIP_SHADES[2];
  const [active, setActive] = React.useState(shade.id);
  const current = LIP_SHADES.find(s => s.id === active) || shade;

  return (
    <Screen background="#1a1612" dark scrollable={false}>
      <FacePhoto src={FACE_PORTRAIT} lipShade={current.hex} lipOpacity={0.62}
                 style={{ position: 'absolute', inset: 0 }}/>
      <div style={{ position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, transparent 60%, rgba(0,0,0,0.45) 100%)' }}/>

      {/* Top brand */}
      <div style={{ position: 'absolute', top: 66, left: 22, right: 22,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MadLogo color="#fff" size={18}/>
      </div>

      {/* Vertical side rail */}
      <div style={{
        position: 'absolute', right: 18, top: 130, bottom: 230,
        width: 64, display: 'flex', flexDirection: 'column',
        background: 'rgba(20,16,14,0.55)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        border: '0.5px solid rgba(255,255,255,0.1)',
        borderRadius: 36, padding: '20px 8px',
        gap: 10, alignItems: 'center', justifyContent: 'space-between',
      }}>
        {LIP_SHADES.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{
            width: 48, height: 48, borderRadius: 24,
            border: s.id === current.id ? '1.5px solid #fff' : '1.5px solid transparent',
            boxShadow: s.id === current.id ? '0 0 0 3px rgba(255,255,255,0.2)' : 'none',
            background: s.hex, cursor: 'pointer', padding: 0,
            transition: 'all .15s ease',
          }} aria-label={s.name}/>
        ))}
      </div>

      {/* Bottom info */}
      <div style={{ position: 'absolute', bottom: 138, left: 22, right: 100 }}>
        <div className="mad-eyebrow" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
          On you now
        </div>
        <h1 className="mad-h1" style={{ color: '#fff', fontSize: 38, marginBottom: 2 }}>
          {current.name}
        </h1>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8 }}>
          <span style={{ fontFamily: 'var(--mad-serif)', fontSize: 20, color: '#fff' }}>
            ${current.price}
          </span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
            {current.stock > 0 ? `${current.stock} left` : 'Sold out'}
          </span>
        </div>
      </div>
    </Screen>
  );
}

// ── VARIATION C — Cushion Landing, "Magazine / Type-led" ────
function VariantCushionMagazineBare() {
  return (
    <Screen background="var(--mad-rose-50)">
      {/* Header */}
      <div style={{ position: 'absolute', top: 60, left: 26, right: 26,
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 20 }}>
        <MadLogo size={20}/>
      </div>
      <div style={{ paddingTop: 130, paddingLeft: 26, paddingRight: 26, paddingBottom: 130 }}>
        {/* huge number */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: -10 }}>
          <span style={{ fontFamily: 'var(--mad-serif)', fontSize: 180, fontWeight: 300,
            lineHeight: 0.85, color: 'var(--mad-rose-500)', letterSpacing: '-0.05em' }}>5</span>
          <div style={{ paddingBottom: 16 }}>
            <div className="mad-eyebrow">Shades</div>
            <div style={{ fontFamily: 'var(--mad-serif)', fontSize: 22, fontStyle: 'italic',
              color: 'var(--mad-gray-900)', lineHeight: 1 }}>One match.</div>
          </div>
        </div>

        <h1 className="mad-h1" style={{ fontSize: 40, marginBottom: 18, marginTop: 18 }}>
          Skin tones aren&apos;t<br/>infinite. Your<br/>
          <em style={{ color: 'var(--mad-rose-500)', fontFamily: 'inherit' }}>match isn&apos;t either.</em>
        </h1>
        <p className="mad-body" style={{ marginBottom: 26, maxWidth: 320 }}>
          We made five cushions covering every undertone. Ten-second scan finds yours.
        </p>

        {/* shade swatch row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 50, alignItems: 'flex-end' }}>
          {CUSHION_SHADES.map((s, i) => (
            <div key={s.id} style={{ flex: 1, height: i === 1 ? 84 : 64,
              background: s.hex, borderRadius: '40px 40px 4px 4px',
              position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <span style={{ position: 'absolute', bottom: -22, left: 0, right: 0,
                textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--mad-gray-700)' }}>
                {s.name}
              </span>
            </div>
          ))}
        </div>

        <button className="mad-btn mad-btn-primary" style={{ width: '100%' }}>
          Scan my face
        </button>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <button className="mad-link">Or pick a shade manually</button>
        </div>
      </div>
    </Screen>
  );
}

// Wrapped versions for design canvas
function VariantCushionEditorial(p) {
  return <IOSDevice width={402} height={874}><VariantCushionEditorialBare {...p}/></IOSDevice>;
}
function VariantLipOilSideRail(p) {
  return <IOSDevice width={402} height={874}><VariantLipOilSideRailBare {...p}/></IOSDevice>;
}
function VariantCushionMagazine(p) {
  return <IOSDevice width={402} height={874}><VariantCushionMagazineBare {...p}/></IOSDevice>;
}

Object.assign(window, {
  VariantCushionEditorial, VariantLipOilSideRail, VariantCushionMagazine,
  VariantCushionEditorialBare, VariantLipOilSideRailBare, VariantCushionMagazineBare,
});
