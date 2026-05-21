'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import PublicNav from '@/components/Navbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import OfflineBookingModal from '@/components/OfflineBookingModal';

const SERVICES = [
  {
    icon: '🏥',
    title: 'In-Clinic Ayurved Consultation',
    price: '₹500',
    desc: 'Personalized Ayurvedic consultation with Dr. Vishal B Bhuva at our Vesu, Surat clinic. Includes Prakriti analysis and customized treatment plan.',
    tag: 'Most Popular',
    tagColor: 'var(--green-primary)',
    img: '/service_consultation.png',
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
    img: '/service_panchkarma.png',
  },
  {
    icon: '🫗',
    title: 'Shirodhara',
    price: 'Custom',
    desc: 'Continuous flow of warm medicated oil on the forehead. Relieves stress, migraine, insomnia, and promotes deep mental calm.',
    tag: 'Relaxation',
    tagColor: 'var(--gold)',
    img: '/service_shirodhara.png',
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

// Scroll reveal hook
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

function Reveal({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useReveal();
  return <div ref={ref} className="reveal" style={style}>{children}</div>;
}

export default function ServicesPage() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <main style={{ background: 'var(--cream)', overflowX: 'hidden' }}>
      <PublicNav />

      {/* ══════════════════════════════════════════════════
          HERO / HEADER SECTION
      ══════════════════════════════════════════════════ */}
      <section className="hero-pub" style={{ minHeight: '45vh', display: 'flex', alignItems: 'center' }}>
        <img src="/hero-bg.avif" alt="Ayurvedic herbs background" className="hero-bg-img" />
        <div className="hero-overlay" style={{ background: 'linear-gradient(135deg, rgba(13,31,13,0.85) 0%, rgba(27,94,32,0.65) 100%)' }} />
        
        <div className="hero-content" style={{ marginTop: 60 }}>
          <div className="container-pub">
            <div style={{ maxWidth: 720 }}>
              <div className="fade-left" style={{ marginBottom: 16 }}>
                <div className="tag-pub" style={{ background: 'rgba(60,226,130,0.12)', borderColor: 'rgba(60,226,130,0.3)', color: 'var(--green-light)' }}>
                  🌿 Shashwat Ayurveda Specialities
                </div>
              </div>
              <h1 className="serif fade-left d1" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', color: 'white', fontWeight: 800, marginBottom: 12 }}>
                Our Healing Services
              </h1>
              <p className="sans fade-left d2" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                Rooted in authentic classical Ayurvedic textbooks, our therapies are customized to balance your unique body constitution (Prakriti) and promote sustainable health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SERVICES GRID SECTION
      ══════════════════════════════════════════════════ */}
      <section className="section-pub">
        <div className="container-pub">
          <div className="grid-3-responsive">
            {SERVICES.map((s, i) => (
              <Reveal key={i}>
                <div className="service-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  {s.img ? (
                    <div className="service-img-wrap" style={{ height: '240px' }}>
                      <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div className="service-icon-wrap" style={{ height: '240px' }}>
                      <span style={{ fontSize: '4.5rem' }}>{s.icon}</span>
                    </div>
                  )}
                  <div className="service-body">
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)', lineHeight: 1.3 }}>
                        {s.title}
                      </h3>
                      {s.tag && (
                        <span style={{
                          display: 'inline-block', background: `${s.tagColor}18`,
                          border: `1px solid ${s.tagColor}40`,
                          color: s.tagColor, borderRadius: 20, padding: '3px 10px',
                          fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
                        }}>
                          {s.tag}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-mid)', lineHeight: 1.75, marginBottom: 18 }}>
                      {s.desc}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                      <div className="service-price">{s.price}</div>
                      <button
                        onClick={() => setBookingOpen(true)}
                        style={{
                          background: 'none', border: 'none',
                          color: 'var(--green-primary)', fontSize: '0.88rem',
                          fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                          padding: '6px 0', transition: 'gap 0.2s',
                        }}
                      >
                        Book Now →
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal style={{ textAlign: 'center', marginTop: 60 }}>
            <div style={{ background: 'var(--ivory)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(39,174,96,0.12)', maxWidth: '680px', margin: '0 auto' }}>
              <h3 className="serif" style={{ fontSize: '1.4rem', color: 'var(--text-dark)', marginBottom: 12 }}>Need a customized treatment plan?</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: 20 }}>
                Consult with Dr. Vishal B Bhuva to receive a personalized diet, lifestyle, and herbal prescription tailored specifically to your body type.
              </p>
              <button className="btn-primary" onClick={() => setBookingOpen(true)}>
                📅 Book Appointment
              </button>
            </div>
          </Reveal>
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

      {/* Floating Elements */}
      <WhatsAppButton />

      {/* Offline Booking Modal */}
      {bookingOpen && <OfflineBookingModal onClose={() => setBookingOpen(false)} />}
    </main>
  );
}
