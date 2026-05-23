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

export default function DoctorProfilePage() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', paddingBottom: 60 }}>
      <PublicNav />
      <div style={{ paddingTop: 140, paddingBottom: 80 }}>
        <div className="container-pub">
          
          <div style={{ alignItems: 'center', gap: '80px' }} className="grid-2-responsive-unequal">
            
            {/* Left: Image / Portrait frame with Parallax */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <Reveal>
                <div className="parallax-wrap" style={{
                  position: 'relative',
                  borderRadius: '160px 30px 160px 30px',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1.5px solid var(--gold-light)',
                  width: '320px',
                  height: '460px'
                }}>
                  <img src="/dr-vishal.jpg" alt="Dr. Vishal B Bhuva" className="parallax-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(32,53,37,0.3) 0%, transparent 60%)', zIndex: 5 }} />
                </div>
              </Reveal>

              {/* Floating experience badge */}
              <div style={{
                position: 'absolute',
                bottom: '-16px',
                right: '10px',
                background: 'var(--white)',
                padding: '16px 24px',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-lg)',
                border: '1.5px solid var(--gold-light)',
                zIndex: 10
              }} className="hide-mobile">
                <div style={{ fontSize: '0.74rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Clinical experience</div>
                <div className="serif" style={{ fontSize: '1.8rem', color: 'var(--gold)', fontWeight: 700 }}>12+ Years</div>
              </div>
            </div>

            {/* Right: Bio */}
            <div>
              <Reveal>
                <span className="tag-pub">✦ Head Physician</span>
                <h1 className="h1-pub" style={{ marginBottom: 16, color: 'var(--text-dark)' }}>
                  <SplitWords children="Dr. Vishal B" />{' '}
                  <em style={{ color: 'var(--gold)' }}>
                    <SplitWords children="Bhuva" delayOffset={0.15} />
                  </em>
                </h1>
                <div style={{ fontSize: '1.1rem', color: 'var(--text-mid)', fontWeight: 600, fontFamily: 'Cormorant Garamond, serif', marginBottom: 24 }}>
                  BAMS (2011) · Specialist in Panchkarma, Digestive Disorders & Skin Diseases
                </div>
              </Reveal>
              
              <Reveal className="d1">
                <p className="p-pub" style={{ marginBottom: 20 }}>
                  Dr. Vishal B Bhuva is a distinguished Ayurvedic physician with over 12 years of hands-on clinical experience in Gujarat. He is the founder and lead physician at Shashwat Ayurveda & Panchkarma Hospital in Surat, where he has guided thousands of patients toward sustainable healing.
                </p>
                <p className="p-pub" style={{ marginBottom: 32, color: 'var(--text-mid)' }}>
                  Dr. Bhuva believes in restoring metabolic homeostasis (Agni) through classical Panchkarma therapies. By assessing the unique bodily balance of every individual, he designs gentle, natural recovery routes for chronic, long-term conditions.
                </p>
              </Reveal>

              <Reveal className="d2" style={{ display: 'flex', gap: 16 }}>
                <Link href="/book" className="btn-primary">Book Consultation</Link>
                <a href="tel:+918320699167" className="btn-outline-green" style={{ borderBottom: 'none' }}>
                  📞 Call +91-8320699167
                </a>
              </Reveal>
            </div>
          </div>

          {/* Timeline & Expertise */}
          <div style={{ gap: '80px', marginTop: 100 }} className="grid-2-responsive-unequal">
            
            {/* Left Column: Education */}
            <Reveal>
              <h2 className="h2-pub" style={{ marginBottom: 32 }}>Education & <em style={{ color: 'var(--green-primary)' }}>Credentials</em></h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                  { y: '2006 - 2011', t: 'BAMS (Bachelor of Ayurvedic Medicine & Surgery)', d: 'Gujarat Ayurved University, Jamnagar. Extensive study of classical Sanskrit texts, physiology, and herbal medicine.' },
                  { y: '2011 - Present', t: 'Panchkarma clinical practice', d: 'Over 12 years of clinical application across various healthcare centers in Gujarat, establishing Shashwat Hospital.' },
                  { y: 'AMAI Member', t: 'Ayurveda Medical Association of India', d: 'Active professional member promoting authentic Ayurvedic practices and medical standards.' },
                  { y: 'Reg: GB I 18974', t: 'Registered Ayurvedic Practitioner', d: 'Licensed by the Gujarat Board of Ayurvedic & Unani Systems of Medicine.' }
                ].map((e, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-year">{e.y}</div>
                    <div style={{ flex: 1, paddingBottom: 24, borderBottom: i < 3 ? '1px solid rgba(62,50,40,0.08)' : 'none' }}>
                      <div style={{ fontWeight: 750, fontSize: '1.02rem', color: 'var(--brown)', marginBottom: 4 }}>{e.t}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-mid)', lineHeight: 1.6 }}>{e.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            
            {/* Right Column: Areas of Expertise */}
            <Reveal className="d1">
              <h2 className="h2-pub" style={{ marginBottom: 32 }}>Specialized Areas of <em style={{ color: 'var(--terracotta)' }}>Healing</em></h2>
              <div className="grid-2" style={{ gap: 20 }}>
                {[
                  { i: '🍃', t: 'Digestive Health', d: 'Restoring Agni for IBS, colitis, chronic constipation, and acid reflux.' },
                  { i: '🌸', t: "Infertility & Women's Care", d: 'Managing PCOD/PCOS, uterine health, and hormonal imbalances.' },
                  { i: '💆‍♂️', t: 'Shirodhara & Migraine', d: 'Treating stress, chronic migraine, insomnia, and nervous fatigue.' },
                  { i: '✨', t: 'Skin Disease Care', d: 'Root-cause relief for psoriasis, eczema, acne, and allergies.' },
                  { i: '🔬', t: 'Chronic Care', d: 'Renal management, early diabetes control, and thyroid support.' },
                  { i: '👶', t: 'Suvarnaprashan', d: 'Circadian-based pediatric immunization camps for children.' },
                ].map(x => (
                  <div key={x.t} className="card-pub" style={{ padding: '24px', borderRadius: '16px' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>{x.i}</div>
                    <div style={{ fontWeight: 750, fontSize: '1.02rem', color: 'var(--brown)', marginBottom: 6 }}>{x.t}</div>
                    <div style={{ fontSize: '0.86rem', color: 'var(--text-mid)', lineHeight: 1.55 }}>{x.d}</div>
                  </div>
                ))}
              </div>
            </Reveal>

          </div>

        </div>
      </div>
    </main>
  );
}
