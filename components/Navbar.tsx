'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSession, clearSession, type StaffUser } from '@/lib/auth';

const NAV_SERVICES = [
  {
    id: 'clinic-consultation',
    icon: '🏥',
    title: 'In-Clinic Consultation',
    desc: 'Deep Prakriti analysis and custom pulse examination (Nadi Pariksha) with Dr. Vishal Bhuva.',
    price: '₹500',
  },
  {
    id: 'video-consultation',
    icon: '💻',
    title: 'Tele / Video Consultation',
    desc: 'Consult virtually from anywhere. Includes herbal delivery prescription.',
    price: '₹800',
  },
  {
    id: 'panchkarma-detox',
    icon: '🌊',
    title: 'Panchkarma Detox Therapy',
    desc: 'Classical purification techniques for cellular tissue rejuvenation.',
    price: 'Customized',
  },
  {
    id: 'shirodhara-ritual',
    icon: '🫗',
    title: 'Shirodhara Ritual',
    desc: 'Medicated warm oil stream on forehead to dissolve deep stress.',
    price: 'Customized',
  },
  {
    id: 'akshi-tarpan',
    icon: '👁️',
    title: 'Akshi-Tarpan (Eye Care)',
    desc: 'Medicated organic ghee pool around eyes to relieve digital eye strain.',
    price: 'Customized',
  },
  {
    id: 'suvarnaprashan',
    icon: '✨',
    title: 'Suvarnaprashan',
    desc: 'Ayurvedic gold-liquid drops for intelligence and immunity in children.',
    price: '₹50',
  },
];

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [user, setUser] = useState<StaffUser | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    setUser(getSession());
  }, []);

  // Sync overlays: close services dropdown if mobile drawer is open, and vice-versa
  useEffect(() => {
    if (open) setServicesDropdownOpen(false);
  }, [open]);

  useEffect(() => {
    if (servicesDropdownOpen) setOpen(false);
  }, [servicesDropdownOpen]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/#about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/#doctor', label: 'Our Doctor' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className={`pub-nav ${scrolled ? 'scrolled' : ''} ${open ? 'nav-open' : ''}`}>
        {/* Logo */}
        <Link href="/" className="pub-logo" onClick={() => setOpen(false)} title="Shashwat Ayurveda">
          <div className="pub-logo-icon">🌿</div>
          <span className="pub-logo-text">
            Shashwat <span>Ayurveda</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="pub-links" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {links.map(l => {
            if (l.label === 'Services') {
              return (
                <div key={l.href} style={{ position: 'relative' }}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setServicesDropdownOpen(!servicesDropdownOpen);
                    }}
                    className={`pub-nav-dropdown-btn ${servicesDropdownOpen ? 'active' : ''}`}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: scrolled ? 'var(--text-mid)' : 'rgba(255,255,255,0.9)',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.88rem',
                      fontWeight: 500,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 0',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                  >
                    Services
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transform: servicesDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              );
            }
            return (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="pub-nav-btns" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <a href="tel:+918320699167"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.25rem', fontWeight: 600,
              color: scrolled ? 'var(--green-primary)' : 'rgba(255,255,255,0.9)',
              transition: 'color 0.4s',
            }}
            title="Call +91-8320699167"
          >
            📞
          </a>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link href={user.role === 'doctor' ? '/admin/doctor' : user.role === 'reception' ? '/admin/reception' : '/dashboard'} 
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(58, 95, 67, 0.1)', border: '1.5px solid rgba(58, 95, 67, 0.3)',
                  borderRadius: '20px', padding: '6px 12px', fontSize: '0.82rem', fontWeight: 700,
                  color: scrolled ? 'var(--green-dark)' : 'white', cursor: 'pointer', transition: 'all 0.3s',
                  textDecoration: 'none'
                }}>
                  <span>{user.avatar}</span>
                  <span>{user.name.split(' ')[0]}</span>
              </Link>
              <button onClick={() => { clearSession(); setUser(null); window.location.href = '/'; }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.82rem', color: scrolled ? 'var(--text-light)' : 'rgba(255,255,255,0.7)',
                  fontWeight: 600
                }}>
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: scrolled ? 'var(--green-primary)' : 'white', textDecoration: 'none', background: scrolled ? 'rgba(58,95,67,0.06)' : 'rgba(255,255,255,0.12)', border: scrolled ? '1.5px solid var(--green-primary)' : '1.5px solid rgba(255,255,255,0.4)', borderRadius: '50%', width: '34px', height: '34px', transition: 'all 0.3s' }} title="Login / Health Portal">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          )}

        </div>

        {/* Mobile hamburger */}
        <button
          className="hamburger"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
          style={{ display: 'none' }}
        >
          <span style={{ transform: open ? 'rotate(45deg) translateY(7px)' : 'none' }} />
          <span style={{ opacity: open ? 0 : 1, transform: open ? 'scaleX(0)' : 'none' }} />
          <span style={{ transform: open ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${open ? 'open' : ''}`}>
        {links.map(l => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
        ))}
        <div className="mobile-drawer-btns" style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          {user ? (
            <>
              <Link href={user.role === 'doctor' ? '/admin/doctor' : user.role === 'reception' ? '/admin/reception' : '/dashboard'} 
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'rgba(255, 255, 255, 0.08)', border: '1.5px solid var(--gold-light)',
                  borderRadius: 30, padding: '14px', fontSize: '0.88rem', fontWeight: 600,
                  color: 'white', textDecoration: 'none', justifyContent: 'center',
                  letterSpacing: '0.05em', textTransform: 'uppercase'
                }}
                onClick={() => setOpen(false)}>
                <span>{user.avatar}</span>
                <span>{user.name} (Dashboard)</span>
              </Link>
              <button onClick={() => { clearSession(); setUser(null); setOpen(false); window.location.href = '/'; }}
                style={{
                  justifyContent: 'center', borderRadius: 30, padding: '14px',
                  background: 'none', border: '1.5px solid rgba(255, 255, 255, 0.3)', cursor: 'pointer',
                  fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600,
                  letterSpacing: '0.05em', textTransform: 'uppercase'
                }}>
                Logout
              </button>
            </>
          ) : (
            <Link href="/login"
              style={{ justifyContent: 'center', borderRadius: 30, padding: '14px', background: 'none', border: '1.5px solid var(--gold-light)', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.88rem' }}
              onClick={() => setOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Login / Portal
            </Link>
          )}

          <a href="tel:+918320699167"
            style={{
              display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
              padding: '14px', borderRadius: 30,
              background: 'none', border: '1.5px solid rgba(255, 255, 255, 0.4)',
              color: 'white',
              fontWeight: 600, fontSize: '0.88rem',
              letterSpacing: '0.05em', textTransform: 'uppercase',
              textDecoration: 'none'
            }}
            onClick={() => setOpen(false)}
          >
            📞 Call +91-8320699167
          </a>
          <Link href="/book" className="btn-primary"
            style={{ justifyContent: 'center', borderRadius: 30, padding: '14px', background: 'var(--gold)', color: 'white', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.88rem' }}
            onClick={() => setOpen(false)}
          >
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Drawer backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 998,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Services Dropdown Backdrop (fixed overlay) */}
      {servicesDropdownOpen && (
        <div
          onClick={() => setServicesDropdownOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.15)',
            zIndex: 998,
            backdropFilter: 'blur(3px)',
            animation: 'fadeInOverlay 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        />
      )}

      {/* Mega Menu Dropdown */}
      {servicesDropdownOpen && (
        <div
          className="mega-menu no-scrollbar"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--cream)',
            color: 'var(--text-dark)',
            borderBottom: '1.5px solid rgba(184, 144, 71, 0.25)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            padding: '30px 60px 40px',
            animation: 'slideDownFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            zIndex: 1001,
            maxHeight: '50vh',
            overflowY: 'auto',
          }}
        >
          <div className="container-pub">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px 32px' }}>
              {NAV_SERVICES.map((s, idx) => (
                <Link
                  key={idx}
                  href={`/services#${s.id}`}
                  onClick={() => setServicesDropdownOpen(false)}
                  className="mega-menu-item"
                  style={{
                    display: 'flex',
                    gap: 16,
                    textDecoration: 'none',
                    padding: '16px',
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    border: '1.5px solid transparent',
                    background: 'rgba(250, 248, 245, 0.4)',
                    color: 'var(--text-dark)',
                  }}
                >
                  <div style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ivory)', width: 50, height: 50, borderRadius: '12px', border: '1px solid rgba(184, 144, 71, 0.15)', flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600, color: 'var(--brown)', marginBottom: 4 }}>
                      {s.title}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-mid)', lineHeight: 1.45, margin: 0, fontWeight: 300 }}>
                      {s.desc}
                    </p>
                    <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Fee: {s.price}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 36, borderTop: '1px solid rgba(184, 144, 71, 0.12)', paddingTop: 20 }}>
              <Link 
                href="/services" 
                onClick={() => setServicesDropdownOpen(false)}
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--green-primary)',
                  color: 'white',
                  padding: '10px 24px',
                  borderRadius: '30px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s'
                }}
                className="view-all-services-btn"
              >
                View All Treatments & Rituals Menu ↗
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Show hamburger on mobile via inline style injection */}
      <style>{`
        @media (max-width: 768px) {
          .hamburger { display: flex !important; }
          .pub-nav-btns { display: none !important; }
          .pub-links { display: none !important; }
        }
        .mega-menu-item:hover {
          background: var(--ivory) !important;
          border-color: rgba(184, 144, 71, 0.25) !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }
        .view-all-services-btn:hover {
          background: var(--green-dark) !important;
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
        @keyframes slideDownFade {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
