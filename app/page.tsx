'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PublicNav from '@/components/Navbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import OfflineBookingModal from '@/components/OfflineBookingModal';

// ── Data ──────────────────────────────────────────────────────────
const CONDITIONS = [
  'Digestive Disorders', 'Infertility', 'Migraine', 'Allergy & Sinusitis',
  'Skin Disease', 'Kidney Disease', 'Viral Disease', 'Hair Problems',
  'Child Disease', 'Panchkarma', 'Joint Pain', 'Obesity', 'Diabetes',
  'Thyroid Issues', 'Stress & Anxiety', 'PCOD / PCOS',
];

const SERVICES = [
  {
    icon: '🏥',
    title: 'In-Clinic Ayurved Consultation',
    price: '₹500',
    desc: 'Personalized Ayurvedic consultation with Dr. Vishal B Bhuva at our Vesu, Surat clinic. Includes Prakriti analysis and customized treatment plan.',
    tag: 'Most Popular',
    tagColor: 'var(--green-primary)',
    img: null,
  },
  {
    icon: '💻',
    title: 'Tele / Video Consultation',
    price: '₹800',
    desc: 'Consult from anywhere in India via video call. Get personalized herbal prescriptions and follow-up care digitally.',
    tag: 'Online',
    tagColor: '#1976D2',
    img: null,
  },
  {
    icon: '🌊',
    title: 'Panchkarma Therapy',
    price: 'Custom',
    desc: 'Ancient detoxification therapy: Vamana, Virechana, Basti, Nasya & Raktamokshana. Complete rejuvenation and deep healing.',
    tag: 'Detox',
    tagColor: 'var(--terracotta)',
    img: null,
  },
  {
    icon: '🫗',
    title: 'Shirodhara',
    price: 'Custom',
    desc: 'Continuous flow of warm medicated oil on the forehead. Relieves stress, migraine, insomnia, and promotes deep mental calm.',
    tag: 'Relaxation',
    tagColor: 'var(--gold)',
    img: null,
  },
  {
    icon: '👁️',
    title: 'Akshi-Tarpan (Eye Care)',
    price: 'Custom',
    desc: 'Medicated ghee pooled around the eyes to nourish, strengthen vision, and relieve eye strain and related disorders.',
    tag: 'Eye Care',
    tagColor: '#0288D1',
    img: null,
  },
  {
    icon: '✨',
    title: 'Suvarnaprashan',
    price: '₹50',
    desc: 'Ancient Ayurvedic immunization for children (0–16 years). Pure gold with herbs & honey for enhanced immunity, intellect, and strength.',
    tag: "Children's",
    tagColor: '#E65100',
    img: '/ayurvedic-immunization.avif',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Desai', city: 'Surat', condition: 'PCOS & Hormonal Imbalance',
    text: 'After years of hormonal issues, Dr. Vishal Bhuva\'s Ayurvedic treatment brought my cycles back to normal within 3 months. The clinic feels like home — so warm and caring.',
    rating: 5, initials: 'PD',
  },
  {
    name: 'Rajan Mehta', city: 'Surat', condition: 'Chronic Digestive Issues',
    text: 'I had been suffering from digestive problems for 7 years. The Panchkarma treatment at Shashwat Ayurveda transformed my gut health completely. Highly recommended!',
    rating: 5, initials: 'RM',
  },
  {
    name: 'Anita Sharma', city: 'Vesu, Surat', condition: 'Skin Disease',
    text: 'Psoriasis had affected my confidence badly. Dr. Bhuva\'s treatment plan — herbal medicines and Virechana — gave me results that dermatologists couldn\'t achieve.',
    rating: 5, initials: 'AS',
  },
  {
    name: 'Manish Patel', city: 'Surat', condition: 'Migraine',
    text: 'Shirodhara sessions at Shashwat Ayurveda reduced my migraine frequency from daily to almost zero. Life-changing experience with deeply knowledgeable doctors.',
    rating: 5, initials: 'MP',
  },
  {
    name: 'Kavita Joshi', city: 'Surat', condition: 'Child Immunity',
    text: 'My son gets Suvarnaprashan every Pushya Nakshatra. His immunity has improved remarkably. The staff is incredibly gentle with kids.',
    rating: 5, initials: 'KJ',
  },
  {
    name: 'Suresh Agarwal', city: 'Surat', condition: 'Kidney Disease',
    text: 'Diagnosed with early kidney disease, I turned to Ayurveda. Dr. Bhuva\'s protocol helped stabilize my creatinine levels significantly. Grateful beyond words.',
    rating: 5, initials: 'SA',
  },
];

const GALLERY_ITEMS = [
  { src: '/gallery-1.webp', label: 'Before & After — Hair Treatment' },
  { src: '/gallery-2.webp', label: 'PCOD / Uterus Treatment' },
  { src: '/gallery-3.avif', label: 'Corona Prevention Campaign' },
  { src: '/gallery-4.webp', label: 'Before & After — Psoriasis' },
  { src: '/gallery-5.avif', label: 'Before & After — Skin Treatment' },
  { src: '/ayurvedic-immunization.avif', label: 'Ayurvedic Immunization Camp' },
];

const STATS = [
  { num: '12+', label: 'Years Experience' },
  { num: '2500+', label: 'Happy Patients' },
  { num: '5000+', label: 'Treatments Done' },
  { num: '98%', label: 'Satisfaction Rate' },
];

// ── Scroll reveal hook ────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ── Section wrapper with reveal ──────────────────────────────────
function Reveal({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useReveal();
  return <div ref={ref} className="reveal" style={style}>{children}</div>;
}

// ── Main Page ─────────────────────────────────────────────────────
export default function HomePage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Testimonial auto-rotate
  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial(v => (v + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <main style={{ background: 'var(--cream)', overflowX: 'hidden' }}>
      <PublicNav />

      {/* ══════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════ */}
      <section className="hero-pub" style={{ minHeight: '100vh' }}>
        {/* Background image */}
        <img src="/hero-bg.avif" alt="Ayurvedic herbs background" className="hero-bg-img" />
        <div className="hero-overlay" />
        <div className="hero-overlay-pattern" />

        {/* Decorative circles */}
        <div className="hero-circle" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(60,226,130,0.06) 0%, transparent 70%)', top: -100, right: -100 }} />
        <div className="hero-circle" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(201,150,58,0.06) 0%, transparent 70%)', bottom: 50, left: -50 }} />

        <div className="hero-content">
          {/* Custom Interactive Circle Badge */}
          <div className="hero-badge-circle">
            <span>100% Pure<br />Ayurveda<br />Healing</span>
          </div>

          <div className="container-pub" style={{ paddingTop: 100, paddingBottom: 60 }}>
            <div style={{ maxWidth: 720 }}>
              {/* Tag */}
              <div className="fade-left" style={{ marginBottom: 24 }}>
                <div className="tag-pub" style={{ background: 'rgba(60,226,130,0.12)', borderColor: 'rgba(60,226,130,0.3)', color: 'var(--green-light)' }}>
                  🌿 Shashwat Ayurveda & Panchkarma Hospital · Surat
                </div>
              </div>

              {/* Headline */}
              <h1 className="h1-pub fade-left d1" style={{ marginBottom: 24, color: 'white' }}>
                Rejuvenate &<br />
                Restore Your<br />
                <em style={{ color: 'var(--green-light)' }}>Natural Health</em>
              </h1>

              {/* Description */}
              <p className="fade-left d2" style={{
                fontSize: '1.1rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.85,
                maxWidth: 540, marginBottom: 36,
              }}>
                <em style={{ fontStyle: 'normal', fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>
                  "Prevention & Cure with World's Oldest Holistic Healthcare System"
                </em>
                <br />
                Led by <strong style={{ color: 'white' }}>Dr. Vishal B Bhuva</strong> (BAMS, 12+ Years) — Specialist in Panchkarma, Digestive Disorders, Skin & Fertility.
              </p>

              {/* CTAs */}
              <div className="fade-left d3" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
                <button className="btn-primary" style={{ fontSize: '1rem', padding: '16px 36px' }}
                  onClick={() => setBookingOpen(true)}>
                  📅 Book Appointment
                </button>
                <a href="#doctor" className="btn-outline" style={{ fontSize: '1rem', padding: '15px 32px' }}>
                  Meet Dr. Bhuva →
                </a>
              </div>

              {/* Quick contact chips */}
              <div className="fade-left d4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="tel:+918320699167" style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 50, padding: '8px 18px', color: 'white', fontSize: '0.85rem', fontWeight: 600,
                  backdropFilter: 'blur(8px)', transition: 'all 0.3s',
                }}>
                  📞 +91-8320699167
                </a>
                <a href="https://wa.me/918530660183" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(37,211,102,0.2)', border: '1px solid rgba(37,211,102,0.4)',
                  borderRadius: 50, padding: '8px 18px', color: 'white', fontSize: '0.85rem', fontWeight: 600,
                  backdropFilter: 'blur(8px)', transition: 'all 0.3s',
                }}>
                  💬 WhatsApp Us
                </a>

              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="hero-scroll-hint">
          <div className="hero-scroll-arrow" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════════ */}
      <div className="stats-bar">
        <div className="container-pub" style={{ position: 'relative' }}>
          <div className="grid-4" style={{ gap: 20 }}>
            {STATS.map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          CONDITIONS TICKER
      ══════════════════════════════════════════════════ */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[...CONDITIONS, ...CONDITIONS, ...CONDITIONS].map((c, i) => (
            <span key={i} className="ticker-item">
              <span className="ticker-dot">✦</span>
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          ABOUT / WELCOME SECTION
      ══════════════════════════════════════════════════ */}
      <section id="about" className="section-pub" style={{ background: 'var(--ivory)' }}>
        <div className="container-pub">
          <div className="grid-2-responsive" style={{ alignItems: 'center' }}>
            <Reveal>
              <div className="tag-pub">🌿 Our Mission</div>
              <h2 className="h2-pub" style={{ marginBottom: 20 }}>
                Ancient Wisdom for<br /><em>Modern Health</em>
              </h2>
              <p className="p-pub" style={{ marginBottom: 16 }}>
                <strong>Shashwat Ayurveda & Panchkarma Hospital</strong> is a leading Ayurvedic healthcare center located in Vesu, Surat. We are committed to{' '}
                <em style={{ fontStyle: 'normal', color: 'var(--green-primary)', fontWeight: 600 }}>
                  "Rejuvenating and Protecting the Health of All Living Beings"
                </em>{' '}
                through the world's oldest holistic healthcare system.
              </p>
              <p className="p-pub" style={{ marginBottom: 28 }}>
                Under the expert guidance of <strong>Dr. Vishal B Bhuva</strong> (BAMS, 12+ years experience), we offer authentic Panchkarma therapies, personalized Ayurvedic consultations, and preventive healthcare programs rooted in classical Vedic science.
              </p>

              {/* Mission pillars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {[
                  ['🎯', 'Root Cause Healing', 'We address the source of imbalance, not just symptoms.'],
                  ['🌱', 'Holistic Care', 'Mind, body & spirit in perfect harmony through Ayurveda.'],
                  ['🔬', 'Classical Protocols', 'Treatments based on ancient Charaka Samhita texts.'],
                ].map(([icon, title, desc]) => (
                  <div key={title} style={{ display: 'flex', gap: 14, padding: '14px 18px', background: 'white', borderRadius: 14, border: '1px solid rgba(39,174,96,0.1)', boxShadow: '0 2px 12px rgba(39,174,96,0.06)' }}>
                    <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-dark)', marginBottom: 2 }}>{title}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-mid)' }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 14 }}>
                <button className="btn-primary" onClick={() => setBookingOpen(true)}>Book Consultation</button>
                <a href="#doctor" className="btn-outline-green">Meet Dr. Bhuva →</a>
              </div>
            </Reveal>

            {/* Right side: visual card */}
            <Reveal>
              <div style={{ position: 'relative' }}>
                <div style={{
                  background: 'linear-gradient(145deg, #E8F5E9, #F1F8E9)',
                  borderRadius: 28, padding: '40px 36px',
                  border: '1px solid rgba(39,174,96,0.15)',
                  boxShadow: '0 20px 60px rgba(39,174,96,0.12)',
                }}>
                  <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ fontSize: '4rem', marginBottom: 12 }}>🏥</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 4 }}>
                      Shashwat Ayurveda
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>& Panchkarma Hospital</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      ['⏰', 'Timing', 'Mon–Sat: 9 AM – 1 PM & 2 PM – 7 PM'],
                      ['📍', 'Location', '127, Agam Orchid, Near Nandini-2, Vesu, Surat'],
                      ['📞', 'Phone', '+91-8320699167'],
                      ['💬', 'WhatsApp', '+91-8530660183'],
                      ['🏥', 'AMAI Member', 'Reg. No: GB I 18974'],
                    ].map(([icon, label, value]) => (
                      <div key={label} style={{ display: 'flex', gap: 10, padding: '10px 14px', background: 'white', borderRadius: 12, fontSize: '0.85rem' }}>
                        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</span>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-light)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                          <div style={{ color: 'var(--text-dark)', marginTop: 1 }}>{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating badge */}
                <div style={{ position: 'absolute', top: -16, right: -16, background: 'var(--green-primary)', color: 'white', borderRadius: 14, padding: '10px 16px', boxShadow: '0 8px 24px rgba(39,174,96,0.4)', fontSize: '0.82rem', fontWeight: 700 }}>
                  ✅ Est. 2011
                </div>
                <div style={{ position: 'absolute', bottom: -16, left: -16, background: 'var(--gold)', color: 'white', borderRadius: 14, padding: '10px 16px', boxShadow: '0 8px 24px rgba(201,150,58,0.4)', fontSize: '0.82rem', fontWeight: 700 }}>
                  🏆 AMAI Certified
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>



      {/* ══════════════════════════════════════════════════
          DOCTOR SECTION
      ══════════════════════════════════════════════════ */}
      <section id="doctor" className="section-pub" style={{ background: 'var(--cream)' }}>
        <div className="container-pub">
          <Reveal style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="tag-pub" style={{ display: 'inline-flex' }}>✦ Meet Your Healer</div>
            <h2 className="h2-pub">Dr. Vishal B <em>Bhuva</em></h2>
          </Reveal>

          <div className="grid-2-responsive" style={{ alignItems: 'center' }}>
            {/* Photo */}
            <Reveal>
              <div className="doctor-photo-frame float">
                <img src="/dr-vishal.jpg" alt="Dr. Vishal B Bhuva" className="doctor-photo" />
                {/* Badges */}
                <div className="doctor-badge" style={{ top: 20, right: -20, background: 'white', color: 'var(--green-dark)' }}>
                  <span className="doctor-badge-icon">🏆</span>
                  <span>12+ Years<br /><span style={{ fontWeight: 400, fontSize: '0.72rem', color: 'var(--text-light)' }}>Experience</span></span>
                </div>
                <div className="doctor-badge" style={{ bottom: 40, left: -20, background: 'var(--green-primary)', color: 'white' }}>
                  <span className="doctor-badge-icon">🌿</span>
                  <span>BAMS<br /><span style={{ fontWeight: 400, fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)' }}>Certified</span></span>
                </div>
              </div>
            </Reveal>

            {/* Details */}
            <Reveal>
              <div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 4 }}>
                  Dr. Vishal B Bhuva
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: 20 }}>
                  BAMS (2011) · Ayurvedic Physician & Panchkarma Specialist
                </p>

                {/* Specializations */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                    Specializes In
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {[
                      'Digestive Disorders', 'Infertility', 'Migraine',
                      'Allergy & Sinusitis', 'Skin Disease', 'Kidney Disease',
                      'Viral Disease', 'Hair Problems', 'Child Disease', 'Panchkarma',
                    ].map(s => (
                      <span key={s} className="spec-chip">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Credentials */}
                <div style={{ marginBottom: 28 }}>
                  {[
                    ['Education', 'BAMS — Finished in 2011'],
                    ['Experience', '12 Years of Clinical Practice'],
                    ['Membership', 'AMAI — Ayurveda Medical Association of India'],
                    ['Registration', 'GB I 18974'],
                    ['Mobile', '+91-8320699167'],
                    ['Clinic', '127, Agam Orchid, Near Nandini-2, Vesu, Surat'],
                  ].map(([label, value]) => (
                    <div key={label} className="cred-row">
                      <div className="cred-label">{label}</div>
                      <div className="cred-value">{value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <button className="btn-primary" onClick={() => setBookingOpen(true)}>
                    📅 Book Appointment
                  </button>
                  <a href="tel:+918320699167" className="btn-outline-green">
                    📞 Call Doctor
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>



      {/* ══════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════ */}
      <section id="testimonials" className="section-pub" style={{ background: 'var(--ivory)' }}>
        <div className="container-pub">
          <Reveal style={{ textAlign: 'center', marginBottom: 50 }}>
            <div className="tag-pub" style={{ display: 'inline-flex' }}>✦ Patient Stories</div>
            <h2 className="h2-pub">Lives <em>Transformed</em></h2>
            <p className="p-pub" style={{ maxWidth: 500, margin: '12px auto 0' }}>
              Thousands of patients have healed at Shashwat Ayurveda. Here's what they say.
            </p>
          </Reveal>

          {/* Featured testimonial */}
          <Reveal>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{
                background: 'white', borderRadius: 28, padding: '48px',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid rgba(39,174,96,0.1)',
                marginBottom: 24, position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: 24, right: 32, fontFamily: 'Playfair Display, serif', fontSize: '6rem', color: 'rgba(39,174,96,0.07)', lineHeight: 1 }}>"</div>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-mid)', lineHeight: 1.85, fontStyle: 'italic', marginBottom: 24, maxWidth: 700 }}>
                  "{TESTIMONIALS[activeTestimonial].text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="avatar-circle" style={{ width: 52, height: 52, fontSize: '1rem' }}>
                    {TESTIMONIALS[activeTestimonial].initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-dark)' }}>
                      {TESTIMONIALS[activeTestimonial].name}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
                      {TESTIMONIALS[activeTestimonial].city} · {TESTIMONIALS[activeTestimonial].condition}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    style={{
                      width: i === activeTestimonial ? 24 : 8, height: 8,
                      borderRadius: 4, border: 'none', cursor: 'pointer',
                      background: i === activeTestimonial ? 'var(--green-primary)' : 'rgba(39,174,96,0.2)',
                      transition: 'all 0.3s',
                    }}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          {/* Mini testimonials grid */}
          <div className="grid-3-responsive" style={{ marginTop: 40 }}>
            {TESTIMONIALS.slice(0, 3).map((t, i) => (
              <Reveal key={i}>
                <div className="testimonial-card">
                  <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                    {Array.from({ length: t.rating }).map((_, j) => <span key={j} className="star">★</span>)}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-mid)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: 18 }}>
                    "{t.text.slice(0, 120)}…"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 14, borderTop: '1px solid rgba(39,174,96,0.08)' }}>
                    <div className="avatar-circle">{t.initials}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-dark)' }}>{t.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{t.city} · {t.condition}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          BOOKING CTA SECTION
      ══════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--green-medium) 100%)', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(60,226,130,0.1) 0%, transparent 60%)' }} />
        <div className="container-pub" style={{ position: 'relative', textAlign: 'center' }}>
          <Reveal>
            <div className="tag-pub" style={{ background: 'rgba(60,226,130,0.12)', borderColor: 'rgba(60,226,130,0.3)', color: 'var(--green-light)', display: 'inline-flex' }}>
              ✦ Book Your Healing Journey
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 700, color: 'white', marginBottom: 16, lineHeight: 1.2 }}>
              Start Your Path to<br /><em style={{ color: 'var(--green-light)', fontStyle: 'italic' }}>Natural Wellness</em>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.8 }}>
              Book an appointment with Dr. Vishal B Bhuva today. Works even without internet — we save your booking offline!
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-white" style={{ fontSize: '1.05rem', padding: '16px 40px' }} onClick={() => setBookingOpen(true)}>
                📅 Book Appointment
              </button>
              <a href="tel:+918320699167" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: 'rgba(255,255,255,0.85)', fontSize: '1rem', fontWeight: 600,
                padding: '16px 32px', borderRadius: 50, border: '2px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s',
              }}>
                📞 Call +91-8320699167
              </a>
            </div>

            {/* Feature chips */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
              {['✓ Works Offline', '✓ Instant Confirmation', '✓ Free Consultation', '✓ Home Delivery of Herbs'].map(f => (
                <span key={f} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: '6px 16px', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.15)' }}>
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
      <div className="newsletter-section">
        <div className="container-pub" style={{ position: 'relative' }}>
          <Reveal style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
            <div className="tag-pub" style={{ background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.25)', color: 'white', display: 'inline-flex' }}>
              📧 Health Tips Newsletter
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: 'white', marginBottom: 8 }}>
              Get Fresh Health Tips
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', marginBottom: 28 }}>
              Stay updated with the latest Ayurvedic health tips, seasonal advice, and clinic updates.
            </p>
            {!subscribed ? (
              <form
                style={{ display: 'flex', gap: 12, maxWidth: 500, margin: '0 auto' }}
                onSubmit={e => { e.preventDefault(); setSubscribed(true); }}
              >
                <input
                  className="newsletter-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address…"
                  required
                />
                <button type="submit" className="btn-gold" style={{ padding: '16px 28px', borderRadius: 50, whiteSpace: 'nowrap' }}>
                  Subscribe →
                </button>
              </form>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 14, padding: '18px 24px', color: 'white', fontSize: '1rem', fontWeight: 600 }}>
                🎉 Thank you! You'll receive health tips in your inbox.
              </div>
            )}
          </Reveal>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          CONTACT SECTION
      ══════════════════════════════════════════════════ */}
      <section id="contact" className="section-pub" style={{ background: 'var(--cream)' }}>
        <div className="container-pub">
          <Reveal style={{ textAlign: 'center', marginBottom: 50 }}>
            <div className="tag-pub" style={{ display: 'inline-flex' }}>✦ Find Us</div>
            <h2 className="h2-pub">Visit Our <em>Clinic</em></h2>
          </Reveal>

          <div className="grid-2-responsive" style={{ gap: 32, alignItems: 'stretch' }}>
            <Reveal>
              <div className="contact-info-card">
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 4 }}>
                  Shashwat Ayurveda
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: 20 }}>& Panchkarma Hospital</div>

                {[
                  { icon: '📍', label: 'Address', value: '127, Agam Orchid, Opp. Shivkartik Enclave,\nNear Nandini-2, Vesu, Surat, Gujarat' },
                  { icon: '📞', label: 'Phone', value: '+91-8320699167' },
                  { icon: '💬', label: 'WhatsApp', value: '+91-8530660183' },
                  { icon: '⏰', label: 'Clinic Hours', value: 'Mon–Sat: 9 AM – 1 PM & 2 PM – 7 PM\nSunday: Closed' },
                  { icon: '🏥', label: 'Membership', value: 'AMAI — Reg. No: GB I 18974' },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="contact-row">
                    <div className="contact-icon">{icon}</div>
                    <div>
                      <div className="contact-label">{label}</div>
                      <div className="contact-value" style={{ whiteSpace: 'pre-line' }}>{value}</div>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                  <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', borderRadius: 12 }} onClick={() => setBookingOpen(true)}>
                    Book Appointment
                  </button>
                  <a href="https://wa.me/918530660183" target="_blank" rel="noopener noreferrer"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#25D366', color: 'white', borderRadius: 12, fontWeight: 700, fontSize: '0.9rem' }}>
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="map-frame">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.847578!2d72.769668!3d21.136314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04ef2b0000001%3A0x1!2sVesu%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1620000000000"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shashwat Ayurveda Location"
                  style={{ width: '100%', height: '100%', border: 'none', minHeight: 400 }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer className="site-footer">
        <div className="container-pub">
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div className="pub-logo-icon">🌿</div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>
                  Shashwat Ayurveda
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.8, maxWidth: 300, color: 'rgba(255,255,255,0.55)', marginBottom: 20 }}>
                "To Rejuvenate and Protect the Health of Healthy and Unhealthy Living Beings" through the world's oldest holistic healthcare system.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <a href="tel:+918320699167" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(39,174,96,0.15)', border: '1px solid rgba(39,174,96,0.3)', borderRadius: 8, padding: '8px 14px', fontSize: '0.8rem', color: 'var(--green-light)', fontWeight: 600 }}>
                  📞 Call
                </a>
                <a href="https://wa.me/918530660183" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: 8, padding: '8px 14px', fontSize: '0.8rem', color: '#4ade80', fontWeight: 600 }}>
                  💬 WhatsApp
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>Quick Links</div>
              {[['/#about', 'About Us'], ['/services', 'Services'], ['/#doctor', 'Our Doctor'], ['/gallery', 'Gallery'], ['/#contact', 'Contact'], ['/book', 'Book Appointment']].map(([h, l]) => (
                <Link key={h} href={h} className="footer-link">{l}</Link>
              ))}
            </div>

            {/* Services */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>Services</div>
              {['Panchkarma', 'Shirodhara', 'Tele Consultation', 'Suvarnaprashan', 'Akshi-Tarpan', 'Karnapuran'].map(s => (
                <div key={s} className="footer-link" style={{ cursor: 'pointer' }}>{s}</div>
              ))}
            </div>

            {/* Contact */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>Contact</div>
              <div style={{ fontSize: '0.85rem', lineHeight: 2.2, color: 'rgba(255,255,255,0.55)' }}>
                <div>📍 127, Agam Orchid, Vesu, Surat</div>
                <div>📞 +91-8320699167</div>
                <div>💬 +91-8530660183</div>
                <div>⏰ Mon–Sat: 9AM–7PM</div>
              </div>
            </div>
          </div>

          <div className="footer-divider" />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)' }}>
              © 2025 Shashwat Ayurveda & Panchkarma Hospital. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: '0.82rem' }}>
              <Link href="/admin/login" style={{ color: 'rgba(255,255,255,0.25)', transition: 'color 0.2s' }}>
                Staff Portal ↗
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════
          FLOATING ELEMENTS
      ══════════════════════════════════════════════════ */}
      <WhatsAppButton />

      {/* Offline Booking Modal */}
      {bookingOpen && <OfflineBookingModal onClose={() => setBookingOpen(false)} />}
    </main>
  );
}
