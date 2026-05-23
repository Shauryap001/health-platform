'use client';
import PublicNav from '@/components/Navbar';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

// ── Stagger Text Component ────────────────────────────────────────
function SplitWords({ children, delayOffset = 0 }: { children: string; delayOffset?: number }) {
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
      {children.split(' ').map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.22em', verticalAlign: 'bottom' }}>
          <span
            className="split-word-inner"
            style={{ transitionDelay: `${delayOffset + i * 0.05}s` }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

// ── Scroll Reveal Hook ────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, style, className = '' }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${className}`} style={style}>{children}</div>;
}

export default function AyurvedaInfoPage() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', paddingBottom: 60 }}>
      <PublicNav />
      <div style={{ paddingTop: 140, paddingBottom: 80 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 80, padding: '0 24px' }}>
          <Reveal>
            <div className="tag-pub" style={{ margin: '0 auto 16px', display: 'inline-flex' }}>✦ The Science of Life</div>
          </Reveal>
          <Reveal className="d1">
            <h1 className="h1-pub" style={{ maxWidth: 840, margin: '0 auto 24px', color: 'var(--text-dark)' }}>
              <SplitWords children="Understanding" />{' '}
              <em style={{ display: 'inline-block' }}>
                <SplitWords children="Ayurveda" delayOffset={0.15} />
              </em>
            </h1>
          </Reveal>
          <Reveal className="d2">
            <p className="sans" style={{ maxWidth: 660, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--text-mid)' }}>
              Originating in India over 5,000 years ago, Ayurveda translates to "The Science of Life" (Ayu means life, Veda means science). It is a somatic medical system focusing on restoring absolute balance between mind, body, and nature.
            </p>
          </Reveal>
        </div>

        {/* The Three Doshas */}
        <section className="section-pub" style={{ background: 'var(--ivory)', padding: '100px 0', borderTop: '1px solid rgba(62,50,40,0.06)', borderBottom: '1px solid rgba(62,50,40,0.06)' }}>
          <div className="container-pub">
            <Reveal style={{ textAlign: 'center', marginBottom: 20 }}>
              <h2 className="h2-pub">
                <SplitWords children="The Three Elements of Life:" />{' '}
                <em style={{ display: 'inline-block' }}>
                  <SplitWords children="Tridoshas" delayOffset={0.2} />
                </em>
              </h2>
            </Reveal>
            <Reveal className="d1" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 64px' }}>
              <p className="sans" style={{ color: 'var(--text-mid)' }}>
                According to Ayurvedic cosmology, the universe and the human body are made of five elements: Space, Air, Fire, Water, and Earth. In the body, these elements form three life forces, or energies, known as Doshas.
              </p>
            </Reveal>

            <div className="grid-3-responsive" style={{ gap: 36 }}>
              {/* Vata Card */}
              <Reveal className="d1">
                <div style={{
                  borderRadius: '40px 10px 40px 10px',
                  border: '1.5px solid var(--gold-light)',
                  background: 'var(--white)',
                  boxShadow: 'var(--shadow-md)',
                  padding: '40px 32px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🌬️</div>
                  <h3 className="serif" style={{ fontSize: '1.8rem', fontWeight: 300, color: 'var(--brown)', marginBottom: 12 }}>Vata <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 450, fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>(Air + Space)</span></h3>
                  <p className="sans" style={{ fontSize: '0.95rem', color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 24, fontWeight: 300 }}>
                    Controls bodily movement, nerve impulses, circulation, breathing, and heartbeat. When out of balance, it creates restlessness and coldness.
                  </p>
                  <div style={{ fontSize: '0.88rem', paddingTop: 20, borderTop: '1px solid rgba(184,144,71,0.15)', marginTop: 'auto', lineHeight: 1.6, color: 'var(--text-mid)', fontWeight: 300 }}>
                    <strong style={{ color: 'var(--brown)', fontWeight: 600 }}>In Balance:</strong> Creative, energetic, light, communicative.<br/><br/>
                    <strong style={{ color: 'var(--terracotta)', fontWeight: 600 }}>Out of Balance:</strong> Anxiety, insomnia, gas/bloating, tremors, dry skin.
                  </div>
                </div>
              </Reveal>

              {/* Pitta Card */}
              <Reveal className="d2">
                <div style={{
                  borderRadius: '10px 40px 10px 40px',
                  border: '1.5px solid var(--gold-light)',
                  background: 'var(--white)',
                  boxShadow: 'var(--shadow-md)',
                  padding: '40px 32px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🔥</div>
                  <h3 className="serif" style={{ fontSize: '1.8rem', fontWeight: 300, color: 'var(--brown)', marginBottom: 12 }}>Pitta <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 450, fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>(Fire + Water)</span></h3>
                  <p className="sans" style={{ fontSize: '0.95rem', color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 24, fontWeight: 300 }}>
                    Controls the body's metabolic systems, including digestion, enzyme release, body temperature, and intellect.
                  </p>
                  <div style={{ fontSize: '0.88rem', paddingTop: 20, borderTop: '1px solid rgba(184,144,71,0.15)', marginTop: 'auto', lineHeight: 1.6, color: 'var(--text-mid)', fontWeight: 300 }}>
                    <strong style={{ color: 'var(--brown)', fontWeight: 600 }}>In Balance:</strong> Highly intelligent, strong digestion, focused, warm.<br/><br/>
                    <strong style={{ color: 'var(--terracotta)', fontWeight: 600 }}>Out of Balance:</strong> Acid reflux, ulcers, skin rashes, inflammation, anger.
                  </div>
                </div>
              </Reveal>

              {/* Kapha Card */}
              <Reveal className="d3">
                <div style={{
                  borderRadius: '40px 10px 40px 10px',
                  border: '1.5px solid var(--gold-light)',
                  background: 'var(--white)',
                  boxShadow: 'var(--shadow-md)',
                  padding: '40px 32px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🌍</div>
                  <h3 className="serif" style={{ fontSize: '1.8rem', fontWeight: 300, color: 'var(--brown)', marginBottom: 12 }}>Kapha <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 450, fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>(Earth + Water)</span></h3>
                  <p className="sans" style={{ fontSize: '0.95rem', color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 24, fontWeight: 300 }}>
                    Controls structure and lubrication. It supplies fluids, protects organs, moisturizes skin, and maintains the immune system.
                  </p>
                  <div style={{ fontSize: '0.88rem', paddingTop: 20, borderTop: '1px solid rgba(184,144,71,0.15)', marginTop: 'auto', lineHeight: 1.6, color: 'var(--text-mid)', fontWeight: 300 }}>
                    <strong style={{ color: 'var(--brown)', fontWeight: 600 }}>In Balance:</strong> Calm, loving, compassionate, strong stamina.<br/><br/>
                    <strong style={{ color: 'var(--terracotta)', fontWeight: 600 }}>Out of Balance:</strong> Weight gain, fluid retention, asthma, lethargy, congestion.
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Treatment Approach */}
        <section className="section-pub" style={{ padding: '120px 0 40px' }}>
          <div className="container-pub">
            <div style={{ alignItems: 'center', gap: '80px' }} className="grid-2-responsive-unequal">
              <Reveal>
                <span className="tag-pub">🌿 The Recovery Process</span>
                <h2 className="h2-pub" style={{ marginBottom: 24 }}>Aligning Vikriti to <em>Prakriti</em></h2>
                <p className="p-pub" style={{ marginBottom: 24 }}>
                  Ayurvedic therapeutics do not battle diseases in isolation. Our system focuses on purging deep impurities, clearing channels, and rebuilding metabolic strength (Ojas) to prevent future illness.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 32 }}>
                  {[
                    { title: 'Prakriti Analysis', desc: 'Understanding your unique element composition through Nadi Pariksha (pulse analysis).' },
                    { title: 'Vikriti Mapping', desc: 'Identifying current metabolic errors, accumulation of toxins (Ama), and dosha imbalance.' },
                    { title: 'Aahar (Dietary Regimen)', desc: 'Customized herbal food rules designed specifically for your metabolic fire (Agni).' },
                    { title: 'Vihar (Daily Routine)', desc: 'Optimizing circadian cycles (Dinacharya) and seasonal cycles (Ritucharya).' },
                    { title: 'Aushadhi (Herbal Medicine)', desc: 'Prescribing authentic single-herb powders and classical decoctions.' }
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 16, background: 'rgba(184,144,71,0.05)', padding: '16px 20px', borderRadius: 12, border: '1px solid rgba(184,144,71,0.1)' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--green-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>{i+1}</div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--brown)', fontSize: '0.95rem', marginBottom: 2 }}>{s.title}</div>
                        <div style={{ fontSize: '0.86rem', color: 'var(--text-mid)', lineHeight: 1.5 }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Right: Asymmetrical proverb callout */}
              <div style={{ position: 'relative' }}>
                <Reveal>
                  <div style={{ background: 'var(--green-primary)', borderRadius: '30px 60px 30px 60px', padding: '50px 40px', color: 'white', boxShadow: 'var(--shadow-xl)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 className="serif" style={{ fontSize: '1.9rem', marginBottom: 24, lineHeight: 1.5, fontWeight: 400 }}>
                      "When diet is incorrect, medicine is of no use. When diet is correct, medicine is of no need."
                    </h3>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8, letterSpacing: '0.05em' }}>— Ancient Sage Charaka</div>
                  </div>
                </Reveal>

                <div style={{
                  position: 'absolute',
                  bottom: '-40px',
                  left: '20px',
                  background: 'var(--white)',
                  padding: '24px 28px',
                  borderRadius: '16px',
                  color: 'var(--text-dark)',
                  border: '1.5px solid var(--gold-light)',
                  boxShadow: 'var(--shadow-lg)',
                  width: '90%',
                  zIndex: 10
                }} className="hide-mobile">
                  <Reveal>
                    <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--brown)', marginBottom: 6 }}>Begin Your Journey</h4>
                    <p style={{ fontSize: '0.85rem', marginBottom: 16, color: 'var(--text-mid)', lineHeight: 1.5 }}>
                      Discover your primary constitution and get a customized lifestyle prescription from **Dr. Vishal B Bhuva**.
                    </p>
                    <Link href="/book" style={{ display: 'inline-block', background: 'var(--gold)', color: 'white', padding: '10px 22px', borderRadius: '30px', fontSize: '0.82rem', fontWeight: 700 }}>
                      Book Private Assessment
                    </Link>
                  </Reveal>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
