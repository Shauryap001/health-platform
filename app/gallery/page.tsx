'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import PublicNav from '@/components/Navbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import OfflineBookingModal from '@/components/OfflineBookingModal';

const GALLERY_ITEMS = [
  { src: '/gallery-1.webp', label: 'Before & After — Hair Regrowth Treatment' },
  { src: '/gallery-2.webp', label: 'Ayurvedic Treatment for PCOS / Uterus Care' },
  { src: '/gallery-3.avif', label: 'Preventive Healthcare Camp' },
  { src: '/gallery-4.webp', label: 'Before & After — Chronic Psoriasis Recovery' },
  { src: '/gallery-5.avif', label: 'Before & After — Skin Allergies' },
  { src: '/ayurvedic-immunization.avif', label: 'Suvarnaprashan Immunization Camp' },
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

export default function GalleryPage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  return (
    <main style={{ background: 'var(--cream)', overflowX: 'hidden' }}>
      <PublicNav />

      {/* ══════════════════════════════════════════════════
          HERO / HEADER SECTION
      ══════════════════════════════════════════════════ */}
      <section className="hero-pub" style={{ minHeight: '55vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="parallax-wrap" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <img src="/ayurveda_hero_bg.png" alt="Herbs and essential oils background" className="hero-bg-img parallax-img" style={{ pointerEvents: 'none' }} />
        </div>
        <div className="hero-overlay" style={{ background: 'linear-gradient(135deg, rgba(32, 53, 37, 0.9) 0%, rgba(32, 53, 37, 0.7) 100%)', zIndex: 2 }} />
        
        <div className="hero-content" style={{ marginTop: 60, position: 'relative', zIndex: 10 }}>
          <div className="container-pub">
            <div style={{ maxWidth: 760 }}>
              <Reveal style={{ marginBottom: 16 }}>
                <span className="tag-pub" style={{ background: 'rgba(197, 168, 128, 0.15)', borderColor: 'rgba(197, 168, 128, 0.3)', color: 'var(--gold-light)' }}>
                  🌿 Case Studies & Clinical Events
                </span>
              </Reveal>
              <Reveal>
                <h1 className="h1-pub" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', color: 'white', fontWeight: 500, marginBottom: 16 }}>
                  <SplitWords children="Recovery & Camp Gallery" />
                </h1>
              </Reveal>
              <Reveal className="d1">
                <p className="sans" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                  Evidence-based recovery. View actual clinical before-and-after results of patients treated for chronic skin, hair, and gynecological disorders, along with our community wellness events.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          GALLERY GRID SECTION
      ══════════════════════════════════════════════════ */}
      <section className="section-pub" style={{ padding: '140px 0' }}>
        <div className="container-pub">
          <Reveal style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="h2-pub">
              <SplitWords children="Clinical Results &" />{' '}
              <em style={{ display: 'inline-block' }}>
                <SplitWords children="Events" delayOffset={0.15} />
              </em>
            </h2>
            <p className="p-pub" style={{ maxWidth: 540, margin: '14px auto 0' }}>
              Click on any picture to view a larger image of the treatment outcome or clinic activity.
            </p>
          </Reveal>

          <Reveal>
            <div className="gallery-grid" style={{ gap: '24px' }}>
              {GALLERY_ITEMS.map((g, i) => (
                <div key={i} className="gallery-item" onClick={() => setLightboxImg(g.src)} style={{
                  borderRadius: i % 3 === 0 ? '80px 10px 80px 10px' : i % 3 === 1 ? '10px 80px 10px 80px' : '30px',
                  border: '1.5px solid var(--gold-light)',
                  boxShadow: 'var(--shadow-md)',
                  background: 'var(--white)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}>
                  <div style={{ flex: 1, overflow: 'hidden', height: '180px' }}>
                    <img src={g.src} alt={g.label} className="gallery-img" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '16px 20px', background: 'var(--white)' }}>
                    <span className="serif" style={{ color: 'var(--brown)', fontSize: '0.92rem', fontWeight: 400, display: 'flex', alignItems: 'center', gap: 6, lineHeight: 1.4 }}>
                      <span style={{ color: 'var(--gold)' }}>✦</span> {g.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImg && (
        <div className="lightbox-backdrop" onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt="Gallery Case Study" className="lightbox-img" onClick={e => e.stopPropagation()} style={{ border: '2px solid var(--gold-light)' }} />
          <button className="lightbox-close" onClick={() => setLightboxImg(null)}>✕</button>
        </div>
      )}

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
