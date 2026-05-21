'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import PublicNav from '@/components/Navbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import OfflineBookingModal from '@/components/OfflineBookingModal';

const GALLERY_ITEMS = [
  { src: '/gallery-1.webp', label: 'Before & After — Hair Treatment' },
  { src: '/gallery-2.webp', label: 'PCOD / Uterus Treatment' },
  { src: '/gallery-3.avif', label: 'Corona Prevention Campaign' },
  { src: '/gallery-4.webp', label: 'Before & After — Psoriasis' },
  { src: '/gallery-5.avif', label: 'Before & After — Skin Treatment' },
  { src: '/ayurvedic-immunization.avif', label: 'Ayurvedic Immunization Camp' },
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

export default function GalleryPage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

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
                  🌿 Case Studies & Camp Gallery
                </div>
              </div>
              <h1 className="serif fade-left d1" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', color: 'white', fontWeight: 800, marginBottom: 12 }}>
                Treatment Gallery
              </h1>
              <p className="sans fade-left d2" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                Real results from real patients. Explore our clinical success stories in skin conditions, hair disorders, gynecological health, and community wellness camps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          GALLERY GRID SECTION
      ══════════════════════════════════════════════════ */}
      <section className="section-pub">
        <div className="container-pub">
          <Reveal style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="h2-pub">Clinical Results & <em>Events</em></h2>
            <p className="p-pub" style={{ maxWidth: 540, margin: '12px auto 0' }}>
              Click on any picture to view a larger image of the treatment outcome or clinic activity.
            </p>
          </Reveal>

          <Reveal>
            <div className="gallery-grid">
              {GALLERY_ITEMS.map((g, i) => (
                <div key={i} className="gallery-item" onClick={() => setLightboxImg(g.src)}>
                  <img src={g.src} alt={g.label} className="gallery-img" loading="lazy" />
                  <div className="gallery-overlay">
                    <span>🔍 {g.label}</span>
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
          <img src={lightboxImg} alt="Gallery" className="lightbox-img" onClick={e => e.stopPropagation()} />
          <button className="lightbox-close" onClick={() => setLightboxImg(null)}>✕</button>
        </div>
      )}

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
