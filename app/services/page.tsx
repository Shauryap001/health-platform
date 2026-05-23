'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import PublicNav from '@/components/Navbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import OfflineBookingModal from '@/components/OfflineBookingModal';

const SERVICES = [
  {
    id: 'clinic-consultation',
    icon: '/logo_clinic.png',
    title: 'In-Clinic Ayurved Consultation',
    price: '₹500',
    desc: 'Personalized Ayurvedic consultation with Dr. Vishal B Bhuva at our Vesu, Surat clinic. Includes pulse analysis (Nadi Pariksha), Prakriti diagnosis, and customized herbal treatment plan.',
    tag: 'Most Popular',
    tagColor: 'var(--gold)',
    img: '/service_consultation.png',
  },
  {
    id: 'video-consultation',
    icon: '/logo_video.png',
    title: 'Tele / Video Consultation',
    price: '₹800',
    desc: 'Consult from anywhere in India via secure video call. Get detailed root-cause evaluation, customized diet plans, and authentic herbal prescriptions delivered to your home.',
    tag: 'Online Care',
    tagColor: 'var(--green-primary)',
    img: null,
  },
  {
    id: 'panchkarma-detox',
    icon: '/logo_panchkarma.png',
    title: 'Panchkarma detox Therapy',
    price: 'Customized',
    desc: 'Ancient Ayurvedic detoxification therapies including Vamana, Virechana, Basti, Nasya & Raktamokshana. Complete deep-tissue cellular rejuvenation and cleansing.',
    tag: 'Pure Cleansing',
    tagColor: 'var(--terracotta)',
    img: '/service_panchkarma.png',
  },
  {
    id: 'shirodhara-ritual',
    icon: '/logo_shirodhara.png',
    title: 'Shirodhara Ritual',
    price: 'Customized',
    desc: 'Continuous stream of warm medicated herbal oil poured on the forehead. Relieves stress, chronic migraines, insomnia, and promotes absolute mental peace.',
    tag: 'Somatic Calm',
    tagColor: 'var(--gold)',
    img: '/service_shirodhara.png',
  },
  {
    id: 'akshi-tarpan',
    icon: '/logo_akshi.png',
    title: 'Akshi-Tarpan (Eye Care)',
    price: 'Customized',
    desc: 'Medicated organic ghee pooled around the eyes inside a dough ring to nourish visual pathways, strengthen eye muscles, and relieve digital eye strain.',
    tag: 'Nerve Nourishment',
    tagColor: 'var(--green-accent)',
    img: null,
  },
  {
    id: 'suvarnaprashan',
    icon: '/logo_suvarnaprashan.png',
    title: 'Suvarnaprashan Immunization',
    price: '₹50',
    desc: 'Ancient Ayurvedic immunization camps for children (0–16 years). Pure gold particles blended with intelligence-promoting herbs and raw honey for strength and immunity.',
    tag: "Children's Health",
    tagColor: 'var(--terracotta)',
    img: '/ayurvedic-immunization.avif',
  },
];

// Stagger Text Component
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

// Scroll reveal hook
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

export default function ServicesPage() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <main style={{ background: 'var(--cream)', overflowX: 'hidden' }}>
      <PublicNav />

      {/* ══════════════════════════════════════════════════
          HERO / HEADER SECTION
      ══════════════════════════════════════════════════ */}
      <section className="hero-pub" style={{ minHeight: '55vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="parallax-wrap" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <img src="/ayurveda_hero_bg.png" alt="Ayurvedic oils and botanical infusions background" className="hero-bg-img parallax-img" style={{ pointerEvents: 'none' }} />
        </div>
        <div className="hero-overlay" style={{ background: 'linear-gradient(135deg, rgba(32, 53, 37, 0.9) 0%, rgba(32, 53, 37, 0.7) 100%)', zIndex: 2 }} />
        
        <div className="hero-content" style={{ marginTop: 60, position: 'relative', zIndex: 10 }}>
          <div className="container-pub">
            <div style={{ maxWidth: 760 }}>
              <Reveal style={{ marginBottom: 16 }}>
                <span className="tag-pub" style={{ background: 'rgba(197, 168, 128, 0.15)', borderColor: 'rgba(197, 168, 128, 0.3)', color: 'var(--gold-light)' }}>
                  🌿 Traditional Medical Specialities
                </span>
              </Reveal>
              <Reveal>
                <h1 className="h1-pub" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', color: 'white', fontWeight: 500, marginBottom: 16 }}>
                  <SplitWords children="Our Healing Treatments" />
                </h1>
              </Reveal>
              <Reveal className="d1">
                <p className="sans" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                  Rooted strictly in classical Ayurvedic textbooks (Sushruta and Charaka Samhitas), our treatments are custom-tailored to balance your bodily energies and restore homeostasis.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SERVICES EDITORIAL RITUAL MENU
      ══════════════════════════════════════════════════ */}
      <section className="section-pub" style={{ padding: '140px 0' }}>
        <div className="container-pub">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '100px' }}>
            {SERVICES.map((s, i) => (
              <Reveal key={i} className={`d${(i % 3) + 1}`}>
                <div
                  id={s.id}
                  className={`service-item-row ${i % 2 === 0 ? 'even-row' : 'odd-row'}`}
                >
                  {/* Image Column */}
                  <div className="service-image-col parallax-wrap">
                    {s.img ? (
                      <img src={s.img} alt={s.title} className="parallax-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div className="service-fallback-icon" style={{ height: '100%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          src={s.icon}
                          alt={s.title}
                          style={{
                            width: '110px',
                            height: '110px',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 4px 16px rgba(184,144,71,0.3))',
                            opacity: 0.92,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Text Column */}
                  <div className="service-text-col">
                    {s.tag && (
                      <span className="tag-pub service-tag" style={{ color: s.tagColor, background: `${s.tagColor}12`, borderColor: `${s.tagColor}30` }}>
                        {s.tag}
                      </span>
                    )}
                    <h3 className="serif service-title">
                      {s.title}
                    </h3>
                    <p className="sans service-desc">
                      {s.desc}
                    </p>
                    <div className="fee-box">
                      <span className="serif price">{s.price}</span>
                      <span className="label">Therapy Fee</span>
                    </div>
                    <button className="btn-primary" onClick={() => setBookingOpen(true)}>
                      Book Ritual
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Assessment callout */}
          <Reveal style={{ textAlign: 'center', marginTop: 80 }}>
            <div style={{ background: 'var(--ivory)', padding: '50px 40px', borderRadius: '30px', border: '1.5px solid var(--gold-light)', maxWidth: '720px', margin: '0 auto', boxShadow: 'var(--shadow-md)' }}>
              <h3 className="serif" style={{ fontSize: '1.8rem', color: 'var(--brown)', marginBottom: 12 }}>Unsure which therapy is suitable for you?</h3>
              <p style={{ fontSize: '0.96rem', color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: 28 }}>
                Every body type has individual requirements. Consult directly with Dr. Vishal B Bhuva to analyze your Tridoshas and define a customized healing regime.
              </p>
              <button className="btn-primary" onClick={() => setBookingOpen(true)}>
                📅 Book Ayurvedic Assessment
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer className="site-footer" style={{ background: 'var(--deep)', padding: '80px 0 40px' }}>
        <div className="container-pub">
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div className="pub-logo-icon" style={{ background: 'var(--gold)', boxShadow: 'none' }}>🌿</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 700, color: 'white' }}>
                  Shashwat Ayurveda
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.8, maxWidth: 300, color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>
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

            {/* Quick Links */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: 20 }}>Quick Links</div>
              {[['/#about', 'About Us'], ['/services', 'Services'], ['/#doctor', 'Our Doctor'], ['/gallery', 'Gallery'], ['/#contact', 'Contact'], ['/book', 'Book Appointment']].map(([h, l]) => (
                <Link key={h} href={h} className="footer-link" style={{ color: 'rgba(255,255,255,0.45)' }}>{l}</Link>
              ))}
            </div>

            {/* Services */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: 20 }}>Services</div>
              {['Panchkarma', 'Shirodhara', 'Tele Consultation', 'Suvarnaprashan', 'Akshi-Tarpan', 'Karnapuran'].map(s => (
                <div key={s} className="footer-link" style={{ color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }}>{s}</div>
              ))}
            </div>

            {/* Contact */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: 20 }}>Contact</div>
              <div style={{ fontSize: '0.85rem', lineHeight: 2.2, color: 'rgba(255,255,255,0.55)' }}>
                <div>📍 127, Agam Orchid, Vesu, Surat</div>
                <div>📞 +91-8320699167</div>
                <div>💬 +91-8530660183</div>
                <div>⏰ Mon–Sat: 9AM–7PM</div>
              </div>
            </div>
          </div>

          <div className="footer-divider" style={{ background: 'rgba(255,255,255,0.06)', margin: '40px 0 24px' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)' }}>
              © 2026 Shashwat Ayurveda & Panchkarma Hospital. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: '0.82rem' }}>
              <Link href="/admin/login" style={{ color: 'rgba(255,255,255,0.2)', transition: 'color 0.2s' }}>
                Staff Portal ↗
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Elements */}
      <WhatsAppButton />

      {/* Offline Booking Modal */}
      {bookingOpen && <OfflineBookingModal onClose={() => setBookingOpen(false)} />}
    </main>
  );
}
