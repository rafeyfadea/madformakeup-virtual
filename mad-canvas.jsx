// Main mounting — either fullscreen phone (launcher) or design canvas review.
// Default: launcher. Add ?canvas to URL for design canvas review mode.

// Apply Tweaks values to CSS variables on :root
function applyTweaks(values) {
  const r = document.documentElement;
  if (values.primaryColor) {
    r.style.setProperty('--mad-rose-500', values.primaryColor);
    r.style.setProperty('--mad-rose-600', shiftLightness(values.primaryColor, -0.10));
    r.style.setProperty('--mad-rose-200', shiftLightness(values.primaryColor, 0.32));
    r.style.setProperty('--mad-rose-100', shiftLightness(values.primaryColor, 0.42));
    r.style.setProperty('--mad-rose-50',  shiftLightness(values.primaryColor, 0.46));
    r.style.setProperty('--mad-rose-700', shiftLightness(values.primaryColor, -0.20));
  }
}

// hex → HSL → shifted L → hex
function shiftLightness(hex, delta) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const r = parseInt(h.slice(0,2),16)/255, g = parseInt(h.slice(2,4),16)/255, b = parseInt(h.slice(4,6),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let H, S, L = (max + min) / 2;
  if (max === min) { H = S = 0; }
  else {
    const d = max - min;
    S = L > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: H = (g - b) / d + (g < b ? 6 : 0); break;
      case g: H = (b - r) / d + 2; break;
      default: H = (r - g) / d + 4;
    }
    H /= 6;
  }
  L = Math.min(1, Math.max(0, L + delta));
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  let R, G, B;
  if (S === 0) { R = G = B = L; }
  else {
    const q = L < 0.5 ? L * (1 + S) : L + S - L * S;
    const p = 2 * L - q;
    R = hue2rgb(p, q, H + 1/3);
    G = hue2rgb(p, q, H);
    B = hue2rgb(p, q, H - 1/3);
  }
  const to = v => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${to(R)}${to(G)}${to(B)}`;
}

const ROSE_OPTIONS = [
  '#D4738F', // PRD default — Mad dusty rose
  '#B85D7A', // deeper mauve
  '#E69BAA', // soft peach-rose
  '#9C5063', // burgundy
];

// ── Tweaks panel ─────────────────────────────────────────────
function MadTweaks() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  React.useEffect(() => { applyTweaks(t); }, [t]);
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Primary color">
        <TweakColor
          label="Mad rose"
          value={t.primaryColor}
          options={ROSE_OPTIONS}
          onChange={v => setTweak('primaryColor', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

// ── Fullscreen phone prototype (default) ─────────────────────
function MadPhoneApp() {
  const [route, setRoute] = React.useState('launcher');
  // pageKey forces a fresh app mount on re-entry (reset state)
  const [pageKey, setPageKey] = React.useState(0);

  const goto = (r) => { setRoute(r); setPageKey(k => k + 1); };
  const home = () => { setRoute('launcher'); setPageKey(k => k + 1); };

  return (
    <PhoneStage>
      <IOSDevice width={402} height={874}>
        {route === 'launcher' && <LauncherScreen onPick={goto}/>}
        {route === 'cushion'  && <CushionFlow key={pageKey} onExit={home}/>}
        {route === 'lipoil'   && <LipOilFlow  key={pageKey} onExit={home}/>}
        {route === 'variants' && <VariantsBrowser onExit={home}/>}
      </IOSDevice>
    </PhoneStage>
  );
}

// ── Design canvas review mode (?canvas) ──────────────────────
function MadDesignReview() {
  return (
    <DesignCanvas>
      <DCSection id="cushion"
        title="Mad Cushion Finder"
        subtitle="Skin tone scan + shade match. Tap through the flow: scan, see your match, swap shades, demo waitlist, or pick manually.">
        <DCArtboard id="cushion-app" label="Interactive prototype" width={402} height={874}>
          <CushionApp/>
        </DCArtboard>
      </DCSection>

      <DCSection id="lipoil"
        title="Mad Lip Oil Try-On"
        subtitle="Live shade swatch on lips. Tap a swatch in the dock, or swipe inside the camera area to switch.">
        <DCArtboard id="lipoil-app" label="Interactive prototype" width={402} height={874}>
          <LipOilApp/>
        </DCArtboard>
      </DCSection>

      <DCSection id="variants"
        title="Direction explorations"
        subtitle="Three still-frame treatments to compare alongside the baseline. Each is a single screen.">
        <DCArtboard id="v-editorial" label="A · Result, editorial" width={402} height={874}>
          <VariantCushionEditorial/>
        </DCArtboard>
        <DCArtboard id="v-siderail" label="B · Lip oil, side rail" width={402} height={874}>
          <VariantLipOilSideRail/>
        </DCArtboard>
        <DCArtboard id="v-magazine" label="C · Landing, magazine" width={402} height={874}>
          <VariantCushionMagazine/>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

// ── Root ─────────────────────────────────────────────────────
function Root() {
  // ?canvas in URL → design canvas review mode (for design review)
  const isCanvas = typeof window !== 'undefined'
    && new URLSearchParams(window.location.search).has('canvas');

  return (
    <>
      {isCanvas ? <MadDesignReview/> : <MadPhoneApp/>}
      <MadTweaks/>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root/>);
