'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import PublicNav from '@/components/Navbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import OfflineBookingModal from '@/components/OfflineBookingModal';

// ── Data ──────────────────────────────────────────────────────────
const CONDITIONS = [
  'Digestive Disorders', 'Infertility & Gynecological', 'Migraine & Sinusitis',
  'Skin Disorders & Psoriasis', 'Chronic Kidney Disease', 'Hair Fall & Alopecia',
  'Joint Pain & Arthritis', 'Stress & Anxiety Management', 'PCOS / PCOD Treatment',
  'Diabetes & Thyroid Care', 'Childhood Immunity & Suvarnaprashan',
];

const SERVICES = [
  {
    icon: '🏥',
    title: 'In-Clinic Ayurved Consultation',
    price: '₹500',
    desc: 'Deep Prakriti analysis and custom pulse examination (Nadi Pariksha) with Dr. Vishal B Bhuva at Vesu, Surat clinic.',
    tag: 'Recommended',
    tagColor: 'var(--gold)',
  },
  {
    icon: '💻',
    title: 'Tele / Video Consultation',
    price: '₹800',
    desc: 'Consult virtually from anywhere. Includes detailed root-cause evaluation and home-delivery prescription of authentic herbs.',
    tag: 'Online Care',
    tagColor: 'var(--green-primary)',
  },
  {
    icon: '🌊',
    title: 'Panchkarma Detox Therapy',
    price: 'Customized',
    desc: 'Five sacred detoxification procedures (Vamana, Virechana, Basti, Nasya, Raktamokshana) tailored to remove toxins.',
    tag: 'Detox Ritual',
    tagColor: 'var(--terracotta)',
  },
  {
    icon: '🫗',
    title: 'Shirodhara Ritual',
    price: 'Customized',
    desc: 'Continuous flow of warm medicated herbal oil on the forehead. Dissolves deep-seated stress, migraine, and insomnia.',
    tag: 'Somatic Calm',
    tagColor: 'var(--gold)',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Desai', city: 'Surat', condition: 'PCOS & Hormonal Imbalance',
    text: 'For 5 years I struggled with hormonal imbalance. Dr. Vishal Bhuva’s patient evaluation and customized herbal therapy restored my cycle naturally in 3 months. The clinic feels like a sanctuary of care.',
    rating: 5, initials: 'PD',
  },
  {
    name: 'Rajan Mehta', city: 'Surat', condition: 'Chronic IBS & Digestive Issues',
    text: 'I suffered from chronic digestive pain. Through Nadi Pariksha, Dr. Bhuva identified the root imbalance and recommended Virechana. The healing was gentle and life-changing.',
    rating: 5, initials: 'RM',
  },
  {
    name: 'Anita Sharma', city: 'Vesu, Surat', condition: 'Severe Psoriasis',
    text: 'Psoriasis left me physically in pain and emotionally drained. The Panchkarma detox therapies and seasonal herbs at Shashwat Ayurveda cleared my skin and rebuilt my confidence. Invaluable doctors.',
    rating: 5, initials: 'AS',
  },
  {
    name: 'Manish Patel', city: 'Surat', condition: 'Migraine & Insomnia',
    text: 'Shirodhara sessions at the clinic calmed my nervous system completely. My daily migraine attacks stopped, and I can finally sleep peacefully. The staff treats you like family.',
    rating: 5, initials: 'MP',
  },
];

const STATS = [
  { num: '12+', label: 'Years of Dedicated Healing' },
  { num: '2500+', label: 'Happy Families Restored' },
  { num: '5000+', label: 'Therapies Conducted' },
  { num: '98%', label: 'Clinical Recovery Rate' },
];

// ── Stagger Text Components ──────────────────────────────────────
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
      { threshold: 0.08 }
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

// ── Main Page Component ───────────────────────────────────────────
export default function HomePage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial(v => (v + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <main style={{ background: 'var(--cream)', overflowX: 'hidden' }}>
      <PublicNav />

      {/* ══════════════════════════════════════════════════
          HERO SECTION (ASYMMETRICAL, CINEMATIC PARALLAX)
      ══════════════════════════════════════════════════ */}
      <section className="hero-pub" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 80, overflow: 'hidden' }}>
        
        {/* Parallax background image wrap */}
        <div className="parallax-wrap" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <img src="/ayurveda_hero_bg.png" alt="Ayurvedic herbs and essential oils" className="hero-bg-img parallax-img" style={{ pointerEvents: 'none' }} />
        </div>
        <div className="hero-overlay" style={{ background: 'linear-gradient(to right, rgba(32, 53, 37, 0.9) 0%, rgba(32, 53, 37, 0.72) 50%, rgba(32, 53, 37, 0.4) 100%)', zIndex: 2 }} />
        
        <div className="hero-content" style={{ zIndex: 10, width: '100%', position: 'relative' }}>
          <div className="container-pub">
            <div style={{ alignItems: 'center', gap: '40px' }} className="grid-2-responsive-unequal">
              
              {/* Hero Left: Text Content */}
              <div style={{ paddingRight: '20px' }}>
                <Reveal className="d1" style={{ marginBottom: 20 }}>
                  <span className="tag-pub" style={{ background: 'rgba(197, 168, 128, 0.15)', borderColor: 'rgba(197, 168, 128, 0.3)', color: 'var(--gold-light)' }}>
                    🌿 Shashwat Ayurveda & Panchkarma Hospital · Surat
                  </span>
                </Reveal>

                <Reveal className="d2">
                  <h1 className="h1-pub" style={{ marginBottom: 24, fontSize: 'clamp(2.4rem, 5vw, 4.8rem)' }}>
                    <SplitWords children="Treating Root Causes" />
                    <br />
                    <span style={{ display: 'inline-block' }}>
                      <SplitWords children="Through " delayOffset={0.2} />
                      <em style={{ display: 'inline-block' }}>
                        <SplitWords children="Authentic Ayurveda" delayOffset={0.3} />
                      </em>
                    </span>
                  </h1>
                </Reveal>

                <Reveal className="d3">
                  <p className="sans" style={{
                    fontSize: '1.08rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8,
                    maxWidth: 580, marginBottom: 40,
                  }}>
                    "True health is not merely the absence of disease, but a state of absolute physical, mental, and spiritual harmony." Under the expert guidance of <strong style={{ color: 'white' }}>Dr. Vishal B Bhuva</strong> (BAMS, 12+ Years), we combine ancient Ayurvedic texts with Panchkarma cleansing to restore your body’s innate power.
                  </p>
                </Reveal>

                <Reveal className="d4" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
                  <button className="btn-primary" style={{ background: 'var(--gold)', color: 'white' }}
                    onClick={() => setBookingOpen(true)}>
                    📅 Book Consultation
                  </button>
                  <a href="#philosophy" className="btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
                    Our Healing Philosophy
                  </a>
                </Reveal>

                {/* Quick Contacts */}
                <Reveal className="d5" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                  <a href="tel:+918320699167" style={{ color: 'white', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1.1rem' }}>📞</span> Call Doctor: +91-8320699167
                  </a>
                  <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
                  <a href="https://wa.me/918530660183" target="_blank" rel="noopener noreferrer" style={{ color: '#4ade80', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>💬</span> WhatsApp Live Care
                  </a>
                </Reveal>
              </div>

              {/* Hero Right: Asymmetrical Badge overlay */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="hide-tablet">
                <Reveal className="d3">
                  <div className="hero-badge-circle" style={{ position: 'relative', top: 'auto', right: 'auto', width: '220px', height: '220px', display: 'flex', flexDirection: 'column', padding: '24px' }}>
                    <span style={{ fontSize: '0.9rem', letterSpacing: '0.1em', color: '#FAF8F5' }}>Restoring</span>
                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--gold-light)', margin: '4px 0' }}>Balance</span>
                    <span style={{ fontSize: '0.68rem', letterSpacing: '0.05em', opacity: 0.8 }}>Since 2011 · Vesu</span>
                  </div>
                </Reveal>
              </div>

            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-hint">
          <div className="hero-scroll-arrow" style={{ borderColor: 'rgba(255,255,255,0.4)' }} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ELEGANT STATS BAR (BREATHING & MINIMAL)
      ══════════════════════════════════════════════════ */}
      <div className="stats-bar" style={{ background: 'var(--cream-dark)', padding: '48px 0', borderTop: '1px solid rgba(62,50,40,0.06)', borderBottom: '1px solid rgba(62,50,40,0.06)' }}>
        <div className="container-pub">
          <div className="grid-4" style={{ gap: '32px' }}>
            {STATS.map((s, i) => (
              <div key={i} className="stat-item" style={{ textAlign: 'center' }}>
                <div className="stat-num" style={{ color: 'var(--green-dark)', fontWeight: 500, fontSize: '2.8rem' }}>{s.num}</div>
                <div className="stat-label" style={{ color: 'var(--text-mid)', fontSize: '0.8rem', letterSpacing: '0.08em', marginTop: '6px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MUTE GOLD CONDITIONS TICKER
      ══════════════════════════════════════════════════ */}
      <div className="ticker-wrap" style={{ background: 'var(--gold)', padding: '16px 0', borderBottom: '1px solid rgba(62,50,40,0.05)' }}>
        <div className="ticker-inner">
          {[...CONDITIONS, ...CONDITIONS].map((c, i) => (
            <span key={i} className="ticker-item" style={{ color: 'var(--cream)', fontWeight: 500, fontSize: '0.82rem', letterSpacing: '0.05em' }}>
              <span style={{ color: 'var(--green-primary)', marginRight: 8 }}>✦</span>
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          PHILOSOPHY SECTION (STORYTELLING, ASYMMETRICAL & PARALLAX)
      ══════════════════════════════════════════════════ */}
      <section id="philosophy" className="section-pub" style={{ background: 'var(--cream)', padding: '140px 0 100px' }}>
        <div className="container-pub">
          <div style={{ alignItems: 'center', gap: '80px' }} className="grid-2-responsive-unequal">
            
            {/* Left: Asymmetrical Image Collage with Parallax */}
            <Reveal style={{ position: 'relative' }}>
              <div className="parallax-wrap" style={{
                position: 'relative',
                borderRadius: '160px 30px 160px 30px',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid rgba(184, 144, 71, 0.15)',
                height: '540px'
              }}>
                <img src="/clinic_sanctuary.png" alt="Peaceful Ayurvedic therapy room" className="parallax-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(32,53,37,0.4) 0%, transparent 60%)', zIndex: 5 }} />
              </div>

              {/* Floating Handcrafted Card */}
              <div style={{
                position: 'absolute',
                bottom: '-28px',
                right: '20px',
                background: 'var(--ivory)',
                padding: '24px 30px',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-lg)',
                border: '1.5px solid var(--gold-light)',
                maxWidth: '280px',
                zIndex: 20
              }} className="hide-mobile">
                <span style={{ fontSize: '1.8rem' }}>🍃</span>
                <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--brown)', margin: '8px 0 4px' }}>Somatic Peace</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-mid)', lineHeight: 1.5 }}>Our clinic is designed as a sanctuary of quietness, inviting deep release of cellular memory and stress.</p>
              </div>
            </Reveal>

            {/* Right: Narrative Philosophy */}
            <div>
              <Reveal>
                <span className="tag-pub">🌿 Healing Philosophy</span>
                <h2 className="h2-pub" style={{ marginBottom: 28, fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
                  <SplitWords children="Modern Healing Rooted in" />
                  <br />
                  <em style={{ display: 'inline-block' }}>
                    <SplitWords children="Ancient Ayurvedic Truths" delayOffset={0.2} />
                  </em>
                </h2>
              </Reveal>
              
              <Reveal className="d1">
                <p className="p-pub" style={{ marginBottom: 24, fontSize: '1.05rem' }}>
                  True healing does not mean suppressing symptoms with immediate chemicals. Ayurveda teaches that health is the equilibrium of **Agni** (digestive fire), **Tridoshas** (Vata, Pitta, Kapha), and the waste channels of the body.
                </p>
                <p className="p-pub" style={{ marginBottom: 36, color: 'var(--text-mid)' }}>
                  At Shashwat Ayurveda, every consultation begins with an intensive examination of your body’s unique Prakriti (innate constitution) and Vikriti (current imbalance). We guide you through classic diet regimens, lifestyle adjustments, and seasonal detoxification rituals to gently remove the root disease.
                </p>
              </Reveal>

              {/* Philosophy Elements */}
              <Reveal className="d2 grid-2" style={{ gap: '20px', marginBottom: 40 }}>
                <div style={{ borderLeft: '3px solid var(--gold)', paddingLeft: '16px' }}>
                  <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 6 }}>Root-Cause Analysis</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-light)', lineHeight: 1.5 }}>Addressing the physical and psychological sources of illness, rather than superficial recovery.</p>
                </div>
                <div style={{ borderLeft: '3px solid var(--green-primary)', paddingLeft: '16px' }}>
                  <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 6 }}>Classical Panchkarma</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-light)', lineHeight: 1.5 }}>Authentic detox techniques designed according to traditional Ayurvedic scriptures.</p>
                </div>
              </Reveal>

              <Reveal className="d3" style={{ display: 'flex', gap: 16 }}>
                <button className="btn-primary" onClick={() => setBookingOpen(true)}>Book Assessment</button>
                <Link href="/services" className="btn-outline-green" style={{ borderBottom: 'none' }}>
                  Explore Treatments
                </Link>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PANCHKARMA EXPERIENCE (JOURNEY & PARALLAX IMAGES)
      ══════════════════════════════════════════════════ */}
      <section id="panchkarma" className="section-pub" style={{ background: 'var(--ivory)', padding: '140px 0' }}>
        <div className="container-pub">
          
          <Reveal style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 80px' }}>
            <span className="tag-pub">✦ Rejuvenation Rituals</span>
            <h2 className="h2-pub">
              <SplitWords children="The Panchkarma" />{' '}
              <em style={{ display: 'inline-block' }}>
                <SplitWords children="Experience" delayOffset={0.15} />
              </em>
            </h2>
            <p className="p-pub" style={{ marginTop: 14 }}>
              Panchkarma is not a spa therapy—it is a medical system of deep tissues cleansing. We physically extract toxins (Ama) accumulated in fat cells and organs, restoring homeostasis.
            </p>
          </Reveal>

          {/* Staggered Storytelling Blocks (Non-Grid) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            
            {/* Step 1: Shirodhara */}
            <div className="flex-responsive-row">
              <Reveal style={{ flex: 1.1 }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }}>🫗</span>
                <h3 className="serif" style={{ fontSize: '1.8rem', color: 'var(--brown)', marginBottom: 16 }}>
                  Shirodhara: <em>Calming the Nervous Flow</em>
                </h3>
                <p className="p-pub" style={{ marginBottom: 20 }}>
                  Warm, continuous streams of medicated herbal oils are poured with rhythmic precision over the forehead (the Ajna chakra). This stimulates the pineal gland, calms the sympathetic nervous system, and triggers deep somatic release.
                </p>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                  <strong>Indicated for:</strong> Tension headaches, chronic migraine, insomnia, anxiety, and hair thinning.
                </div>
              </Reveal>
              <Reveal style={{ flex: 0.9 }}>
                <div className="parallax-wrap" style={{ borderRadius: '24px 80px 24px 80px', border: '1px solid rgba(184,144,71,0.12)', boxShadow: 'var(--shadow-md)', height: '300px' }}>
                  <img src="/service_shirodhara.png" alt="Shirodhara Treatment" className="parallax-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </Reveal>
            </div>

            {/* Step 2: Virechana & Vamana */}
            <div className="flex-responsive-row-reverse">
              <Reveal style={{ flex: 1.1 }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }}>🌊</span>
                <h3 className="serif" style={{ fontSize: '1.8rem', color: 'var(--brown)', marginBottom: 16 }}>
                  Virechana & Vamana: <em>Internal Cellular Detox</em>
                </h3>
                <p className="p-pub" style={{ marginBottom: 20 }}>
                  The physical removal of morbid Pitta and Kapha toxins from the body through controlled purification procedures. Prior to the detox, we lubricate the body internally with medicated ghee (Snehapana) to mobilize deep toxins.
                </p>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                  <strong>Indicated for:</strong> Stubborn skin conditions (psoriasis, eczema), acid reflux, liver/kidney purification, and metabolic diseases.
                </div>
              </Reveal>
              <Reveal style={{ flex: 0.9 }}>
                <div className="parallax-wrap" style={{ borderRadius: '80px 24px 80px 24px', border: '1px solid rgba(184,144,71,0.12)', boxShadow: 'var(--shadow-md)', height: '300px' }}>
                  <img src="/service_panchkarma.png" alt="Panchkarma Treatment" className="parallax-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </Reveal>
            </div>

          </div>

          <Reveal style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link href="/services" className="btn-primary" style={{ padding: '14px 40px' }}>
              View All Therapies & Pricing
            </Link>
          </Reveal>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          DOCTOR SECTION (CREDIBILITY & PARALLAX PHOTOGRAPHY)
      ══════════════════════════════════════════════════ */}
      <section id="doctor" className="section-pub" style={{ background: 'var(--cream)', padding: '140px 0' }}>
        <div className="container-pub">
          <div style={{ alignItems: 'center', gap: '60px' }} className="grid-2-responsive-unequal">
            
            {/* Left: Doctor Photo with Parallax frame */}
            <Reveal style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative' }}>
                <div className="parallax-wrap" style={{
                  borderRadius: '160px 30px 160px 30px',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1.5px solid var(--gold-light)',
                  width: '320px',
                  height: '420px'
                }}>
                  <img src="/dr-vishal.jpg" alt="Dr. Vishal B Bhuva" className="parallax-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                {/* Floating Badges */}
                <div style={{
                  position: 'absolute',
                  top: '-16px',
                  left: '-24px',
                  background: 'var(--green-dark)',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-md)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  lineHeight: 1.3,
                  zIndex: 10
                }}>
                  🎓 BAMS Certified<br />
                  <span style={{ fontSize: '0.68rem', opacity: 0.8, fontWeight: 400 }}>Gujarat Ayurved Univ.</span>
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: '24px',
                  right: '-24px',
                  background: 'var(--white)',
                  border: '1.5px solid var(--gold-light)',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-md)',
                  color: 'var(--brown)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  lineHeight: 1.3,
                  zIndex: 10
                }}>
                  🏆 12+ Years Practice<br />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 400 }}>Reg. No: GB I 18974</span>
                </div>
              </div>
            </Reveal>

            {/* Right: Doctor Biography */}
            <div>
              <Reveal>
                <span className="tag-pub">✦ Meet Your Healer</span>
                <h2 className="h2-pub" style={{ marginBottom: 20 }}>
                  <SplitWords children="Dr. Vishal B" />{' '}
                  <em style={{ display: 'inline-block' }}>
                    <SplitWords children="Bhuva" delayOffset={0.15} />
                  </em>
                </h2>
                <div style={{ fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 600, fontFamily: 'Cormorant Garamond, serif', marginBottom: 20 }}>
                  Lead Physician & Panchkarma Specialist · AMAI Member
                </div>
              </Reveal>
              
              <Reveal className="d1">
                <p className="p-pub" style={{ marginBottom: 20 }}>
                  Over the past 12 years, Dr. Vishal Bhuva has dedicated his practice to restoring wellness in thousands of patients in Surat. His methodology centers on clinical authenticity, aligning classic text protocols (from Charaka Samhita) with modern diagnostic clarity.
                </p>
                <p className="p-pub" style={{ marginBottom: 32, color: 'var(--text-mid)' }}>
                  He specializes in managing chronic conditions, particularly stubborn gut disorders, infertility, PCOD, hormonal imbalances, skin conditions like psoriasis, and preventive pediatric immunization (Suvarnaprashan).
                </p>
              </Reveal>

              {/* Credential row */}
              <Reveal className="d2" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: 36 }}>
                {[
                  ['Experience', '12+ Years in Ayurvedic Healthcare & Panchkarma'],
                  ['Registration', 'Gujarat Board of Ayurvedic & Unani Systems of Medicine (Reg No. GB I 18974)'],
                  ['Education', 'BAMS (2011) — Gujarat Ayurved University, Jamnagar'],
                  ['Location', '127, Agam Orchid, near Nandini-2, Vesu, Surat'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', fontSize: '0.88rem', borderBottom: '1px solid rgba(62,50,40,0.06)', paddingBottom: '8px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--brown)', width: '120px', flexShrink: 0 }}>{label}</span>
                    <span style={{ color: 'var(--text-mid)' }}>{value}</span>
                  </div>
                ))}
              </Reveal>

              <Reveal className="d3" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <button className="btn-primary" onClick={() => setBookingOpen(true)}>Book Private Visit</button>
                <a href="tel:+918320699167" className="btn-outline-green" style={{ borderBottom: 'none' }}>
                  📞 Call Dr. Bhuva
                </a>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PATIENT HEALING JOURNEYS (TESTIMONIALS JOURNAL)
      ══════════════════════════════════════════════════ */}
      <section id="testimonials" className="section-pub" style={{ background: 'var(--ivory)', padding: '140px 0' }}>
        <div className="container-pub">
          
          <Reveal style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="tag-pub">🌿 Transformation Journal</span>
            <h2 className="h2-pub">
              <SplitWords children="Patient Healing" />{' '}
              <em style={{ display: 'inline-block' }}>
                <SplitWords children="Journeys" delayOffset={0.15} />
              </em>
            </h2>
            <p className="p-pub" style={{ maxWidth: '580px', margin: '12px auto 0' }}>
              Real people, genuine healing. Read how custom herbs and Panchkarma detox changed lives at our Surat hospital.
            </p>
          </Reveal>

          {/* Featured Testimonial (Storybook layout) */}
          <Reveal style={{ maxWidth: '840px', margin: '0 auto' }}>
            <div style={{
              background: 'var(--cream)',
              borderRadius: '30px',
              padding: '60px 48px',
              border: '1.5px solid var(--gold-light)',
              boxShadow: 'var(--shadow-md)',
              position: 'relative'
            }}>
              {/* Quote mark ornament */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '40px',
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '8rem',
                color: 'rgba(184, 144, 71, 0.1)',
                lineHeight: 1,
                pointerEvents: 'none'
              }}>"</div>

              <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                {Array.from({ length: 5 }).map((_, i) => <span key={i} style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>★</span>)}
              </div>

              <blockquote style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.6rem',
                lineHeight: 1.6,
                color: 'var(--brown)',
                fontStyle: 'italic',
                marginBottom: 32
              }}>
                "{TESTIMONIALS[activeTestimonial].text}"
              </blockquote>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'var(--green-primary)',
                  color: 'white',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(58,95,67,0.2)'
                }}>
                  {TESTIMONIALS[activeTestimonial].initials}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--brown)', fontSize: '1rem' }}>
                    {TESTIMONIALS[activeTestimonial].name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: 2 }}>
                    {TESTIMONIALS[activeTestimonial].city} · Treated for <strong>{TESTIMONIALS[activeTestimonial].condition}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Nav Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 32 }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  aria-label={`Show testimonial ${i+1}`}
                  style={{
                    width: i === activeTestimonial ? '32px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: i === activeTestimonial ? 'var(--green-primary)' : 'rgba(58, 95, 67, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </Reveal>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          BOOKING CTA SECTION
      ══════════════════════════════════════════════════ */}
      <section style={{ background: 'var(--green-dark)', padding: '140px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="parallax-wrap" style={{ position: 'absolute', inset: 0, opacity: 0.18, width: '100%', height: '100%', zIndex: 1 }}>
          <img src="/clinic_sanctuary.png" alt="Tranquil background" className="parallax-img" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(32,53,37,0.92) 0%, rgba(32,53,37,0.85) 100%)', zIndex: 2 }} />

        <div className="container-pub" style={{ position: 'relative', textAlign: 'center', zIndex: 10 }}>
          <Reveal>
            <span className="tag-pub" style={{ background: 'rgba(197,168,128,0.15)', borderColor: 'rgba(197,168,128,0.25)', color: 'var(--gold-light)' }}>
              ✦ Start Your Rejuvenation
            </span>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 500, color: 'white', marginBottom: 20, lineHeight: 1.2 }}>
              Discover Your Body’s <em>Natural Equilibrium</em>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.08rem', maxWidth: '580px', margin: '0 auto 40px', lineHeight: 1.7 }}>
              Book an appointment with Dr. Vishal B Bhuva today. Works even without internet — your booking will save safely offline!
            </p>
            
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
              <button className="btn-white" style={{ background: 'var(--gold)', color: 'white', border: 'none', boxShadow: 'none' }} onClick={() => setBookingOpen(true)}>
                📅 Book Online Consultation
              </button>
              <a href="tel:+918320699167" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
                📞 Call +91-8320699167
              </a>
            </div>

            {/* Offline features list */}
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['✓ Secure Payments', '✓ Offline Sync Enabled', '✓ Instant WhatsApp Notice', '✓ Medicine Delivery'].map(f => (
                <span key={f} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '6px 16px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {f}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════════════════ */}
      <div className="newsletter-section" style={{ background: 'var(--cream-dark)', padding: '100px 0', borderTop: '1px solid rgba(62,50,40,0.06)' }}>
        <div className="container-pub">
          <Reveal style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <span className="tag-pub">🌿 Seasonal Wellness Guidelines</span>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.4rem', color: 'var(--brown)', fontWeight: 500, marginBottom: 12 }}>
              Receive Authentic <em>Health Tips</em>
            </h2>
            <p style={{ color: 'var(--text-mid)', fontSize: '0.95rem', marginBottom: 36, lineHeight: 1.6 }}>
              Join our mailing list to receive seasonal routine (Ritucharya) advice, natural recipes, and clinic updates directly from Dr. Vishal Bhuva.
            </p>

            {!subscribed ? (
              <form
                style={{ display: 'flex', gap: 12 }}
                onSubmit={e => { e.preventDefault(); setSubscribed(true); }}
                className="grid-2-responsive"
              >
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address…"
                  required
                  className="newsletter-input"
                  style={{
                    background: 'white',
                    color: 'var(--brown)',
                    border: '1.5px solid rgba(184, 144, 71, 0.25)',
                    borderRadius: '30px',
                    padding: '16px 24px',
                    outline: 'none',
                    flex: 1
                  }}
                />
                <button type="submit" className="btn-gold" style={{ padding: '16px 36px', borderRadius: '30px', whiteSpace: 'nowrap' }}>
                  Subscribe →
                </button>
              </form>
            ) : (
              <div style={{ background: 'rgba(58, 95, 67, 0.1)', border: '1px solid rgba(58, 95, 67, 0.2)', borderRadius: '16px', padding: '18px 24px', color: 'var(--green-dark)', fontSize: '1rem', fontWeight: 600 }}>
                🎉 Gratitude. You will receive health advice shortly.
              </div>
            )}
          </Reveal>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          CONTACT SECTION
      ══════════════════════════════════════════════════ */}
      <section id="contact" className="section-pub" style={{ background: 'var(--cream)', padding: '140px 0' }}>
        <div className="container-pub">
          
          <Reveal style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="tag-pub">✦ Visit Surat Clinic</span>
            <h2 className="h2-pub">
              <SplitWords children="Locate Our" />{' '}
              <em style={{ display: 'inline-block' }}>
                <SplitWords children="Hospital" delayOffset={0.15} />
              </em>
            </h2>
          </Reveal>

          <div className="grid-2-responsive" style={{ gap: 40, alignItems: 'stretch' }}>
            
            <Reveal>
              <div className="contact-info-card" style={{ padding: 40, border: '1px solid rgba(62,50,40,0.06)' }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 700, color: 'var(--brown)', marginBottom: 6 }}>
                  Shashwat Ayurveda
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 28 }}>
                  & Panchkarma Hospital
                </div>

                {[
                  { icon: '📍', label: 'Surat Address', value: '127, Agam Orchid, Opp. Shivkartik Enclave,\nNear Nandini-2, Vesu, Surat, Gujarat' },
                  { icon: '📞', label: 'Phone', value: '+91-8320699167' },
                  { icon: '💬', label: 'WhatsApp', value: '+91-8530660183' },
                  { icon: '⏰', label: 'Visiting Hours', value: 'Mon–Sat: 9:00 AM – 1:00 PM\nand 2:00 PM – 7:00 PM\nSunday: Closed' },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="contact-row" style={{ borderBottom: '1px solid rgba(62,50,40,0.06)' }}>
                    <div className="contact-icon" style={{ background: 'rgba(184,144,71,0.08)', color: 'var(--gold)' }}>{icon}</div>
                    <div>
                      <div className="contact-label" style={{ color: 'var(--text-light)' }}>{label}</div>
                      <div className="contact-value" style={{ color: 'var(--brown)', whiteSpace: 'pre-line' }}>{value}</div>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
                  <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setBookingOpen(true)}>
                    Book Visit
                  </button>
                  <a href="https://wa.me/918530660183" target="_blank" rel="noopener noreferrer"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#25D366', color: 'white', borderRadius: '30px', fontWeight: 600, fontSize: '0.9rem' }}>
                    💬 WhatsApp Live
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="map-frame" style={{ border: '1px solid rgba(62,50,40,0.06)', borderRadius: '24px' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.847578!2d72.769668!3d21.136314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04ef2b0000001%3A0x1!2sVesu%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1620000000000"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shashwat Ayurveda Hospital Location Surat"
                  style={{ width: '100%', height: '100%', minHeight: 400 }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER (GROUNDED & EDITORIAL)
      ══════════════════════════════════════════════════ */}
      <footer className="site-footer" style={{ background: 'var(--deep)', padding: '80px 0 40px' }}>
        <div className="container-pub">
          <div className="footer-grid">
            
            {/* Column 1: Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div className="pub-logo-icon" style={{ background: 'var(--gold)', boxShadow: 'none' }}>🌿</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 700, color: 'white' }}>
                  Shashwat Ayurveda
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.45)', marginBottom: 24, maxWidth: '280px' }}>
                "To Rejuvenate and Protect the Health of all living beings through the classical science of Ayurveda."
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <a href="tel:+918320699167" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '8px 14px', fontSize: '0.8rem', color: 'white', fontWeight: 600 }}>
                  📞 Call
                </a>
                <a href="https://wa.me/918530660183" target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(37,211,102,0.1)', borderRadius: '8px', padding: '8px 14px', fontSize: '0.8rem', color: '#4ade80', fontWeight: 600 }}>
                  💬 WhatsApp
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: 20 }}>Navigation</div>
              {[['/#about', 'About Hospital'], ['/services', 'Our Treatments'], ['/#doctor', 'Our Doctor'], ['/gallery', 'Success Cases'], ['/#contact', 'Location'], ['/book', 'Book Appointment']].map(([h, l]) => (
                <Link key={h} href={h} className="footer-link" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}>{l}</Link>
              ))}
            </div>

            {/* Column 3: Services */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: 20 }}>Panchkarma</div>
              {['Shirodhara', 'Virechana Detox', 'Basti Karma', 'Nasya (Sinus Care)', 'Akshi-Tarpan (Eye)', 'Suvarnaprashan'].map(s => (
                <div key={s} className="footer-link" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', cursor: 'pointer' }}>{s}</div>
              ))}
            </div>

            {/* Column 4: Contact */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: 20 }}>Surat Clinic</div>
              <div style={{ fontSize: '0.85rem', lineHeight: 2, color: 'rgba(255,255,255,0.45)' }}>
                <div>📍 127, Agam Orchid, Vesu, Surat</div>
                <div>📞 +91-8320699167</div>
                <div>💬 +91-8530660183</div>
                <div>⏰ Mon–Sat: 9AM–7PM</div>
              </div>
            </div>

          </div>

          <div className="footer-divider" style={{ background: 'rgba(255,255,255,0.06)', margin: '40px 0 24px' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
              © 2026 Shashwat Ayurveda & Panchkarma Hospital. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: '0.8rem' }}>
              <Link href="/admin/login" style={{ color: 'rgba(255,255,255,0.2)', transition: 'color 0.2s' }}>
                Staff Portal ↗
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button & Modal */}
      <WhatsAppButton />
      {bookingOpen && <OfflineBookingModal onClose={() => setBookingOpen(false)} />}
    </main>
  );
}
