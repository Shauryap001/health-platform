'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSession, clearSession, type StaffUser } from '@/lib/auth';

const NAV_SERVICES = [
  {
    id: 'clinic-consultation',
    icon: '/logo_clinic.png',
    title: 'In-Clinic Consultation',
    desc: 'Deep Prakriti analysis and custom pulse examination (Nadi Pariksha) with Dr. Vishal Bhuva.',
    price: '₹500',
  },
  {
    id: 'video-consultation',
    icon: '/logo_video.png',
    title: 'Tele / Video Consultation',
    desc: 'Consult virtually from anywhere. Includes herbal delivery prescription.',
    price: '₹800',
  },
  {
    id: 'panchkarma-detox',
    icon: '/logo_panchkarma.png',
    title: 'Panchkarma Detox Therapy',
    desc: 'Classical purification techniques for cellular tissue rejuvenation.',
    price: 'Customized',
  },
  {
    id: 'shirodhara-ritual',
    icon: '/logo_shirodhara.png',
    title: 'Shirodhara Ritual',
    desc: 'Medicated warm oil stream on forehead to dissolve deep stress.',
    price: 'Customized',
  },
  {
    id: 'akshi-tarpan',
    icon: '/logo_akshi.png',
    title: 'Akshi-Tarpan (Eye Care)',
    desc: 'Medicated organic ghee pool around eyes to relieve digital eye strain.',
    price: 'Customized',
  },
  {
    id: 'suvarnaprashan',
    icon: '/logo_suvarnaprashan.png',
    title: 'Suvarnaprashan',
    desc: 'Ayurvedic gold-liquid drops for intelligence and immunity in children.',
    price: '₹50',
  },
];

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
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
    else setMobileServicesOpen(false);
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
        <Link href="/" className="pub-logo" onClick={() => setOpen(false)} title="Shashwat Ayurveda" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img 
            src="/main-logo.jpg" 
            alt="Shashwat Ayurveda Logo" 
            style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '50%', 
              border: scrolled ? '1.5px solid rgba(58, 95, 67, 0.2)' : '1.5px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              objectFit: 'cover',
              transition: 'border-color 0.4s'
            }} 
          />
          <span className="pub-logo-text-custom" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", fontWeight: 700, color: scrolled ? 'var(--green-dark)' : 'white', letterSpacing: '0.02em', lineHeight: 1.1, transition: 'color 0.4s' }}>
              Shashwat
            </span>
            <span style={{ fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1 }}>
              Ayurveda
            </span>
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

        {/* Mega Menu Dropdown (placed inside nav for relative positioning context) */}
        {servicesDropdownOpen && (
          <div
            className="mega-menu"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'var(--cream)',
              color: 'var(--text-dark)',
              borderBottom: '1.5px solid rgba(184, 144, 71, 0.25)',
              boxShadow: '0 25px 50px rgba(32, 53, 37, 0.12)',
              padding: '30px 60px 25px',
              animation: 'slideDownFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              zIndex: 1001,
              maxHeight: '65vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div className="container-pub" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              {/* Scrollable grid of options */}
              <div 
                className="mega-menu-grid-scroll" 
                style={{ 
                  overflowY: 'auto', 
                  padding: '10px 4px 20px', 
                  maxHeight: 'calc(65vh - 120px)' 
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px 32px' }}>
                  {NAV_SERVICES.map((s, idx) => (
                    <Link
                      key={idx}
                      href={`/services#${s.id}`}
                      onClick={() => setServicesDropdownOpen(false)}
                      className="mega-menu-item"
                      style={{
                        display: 'flex',
                        gap: 18,
                        textDecoration: 'none',
                        padding: '20px',
                        borderRadius: '16px',
                        border: '1px solid rgba(184, 144, 71, 0.12)',
                        background: 'var(--ivory)',
                        color: 'var(--text-dark)',
                        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                        animation: 'staggerSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
                        animationDelay: `${idx * 0.05}s`,
                      }}
                    >
                      <div className="mega-menu-icon-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', width: 52, height: 52, borderRadius: '12px', border: '1px solid rgba(184, 144, 71, 0.15)', flexShrink: 0, transition: 'all 0.3s', padding: 6, overflow: 'hidden' }}>
                        <img src={s.icon} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', fontWeight: 600, color: 'var(--brown)', marginBottom: 6 }}>
                          {s.title}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-mid)', lineHeight: 1.55, margin: 0, fontWeight: 300 }}>
                          {s.desc}
                        </p>
                        <div style={{ marginTop: 10, fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          Fee: {s.price}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              {/* Sticky bottom CTA - Never cut off */}
              <div style={{ textAlign: 'center', borderTop: '1px solid rgba(184, 144, 71, 0.12)', paddingTop: 16, flexShrink: 0 }}>
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
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${open ? 'open' : ''}`}>
        {links.map(l => {
          if (l.label === 'Services') {
            return (
              <div key={l.href} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileServicesOpen(!mobileServicesOpen);
                  }}
                  style={{
                    background: 'none', border: 'none',
                    fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
                    fontSize: 'clamp(1.8rem, 7vw, 2.6rem)',
                    fontWeight: 300, color: 'var(--cream)',
                    padding: '12px 0', width: '100%',
                    borderBottom: '1px solid rgba(197, 168, 128, 0.15)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px',
                    letterSpacing: '0.02em', cursor: 'pointer'
                  }}
                >
                  {l.label}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: mobileServicesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {mobileServicesOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px 0', marginTop: '12px', gap: '8px' }}>
                    {NAV_SERVICES.map((s, idx) => (
                      <Link
                        key={idx}
                        href={`/services#${s.id}`}
                        onClick={() => setOpen(false)}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '1.05rem',
                          color: 'var(--gold-light)',
                          padding: '10px 20px',
                          border: 'none',
                          textAlign: 'center',
                          letterSpacing: '0.03em',
                          textDecoration: 'none'
                        }}
                      >
                        {s.title}
                      </Link>
                    ))}
                    <Link
                      href="/services"
                      onClick={() => setOpen(false)}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '1rem',
                        color: 'var(--cream)',
                        padding: '14px 20px 8px',
                        border: 'none',
                        textAlign: 'center',
                        fontWeight: 600,
                        textDecoration: 'underline',
                        marginTop: '4px'
                      }}
                    >
                      View All Services
                    </Link>
                  </div>
                )}
              </div>
            );
          }
          return (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
          );
        })}
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



      {/* Show hamburger on mobile via inline style injection */}
      <style>{`
        @media (max-width: 768px) {
          .hamburger { display: flex !important; }
          .pub-nav-btns { display: none !important; }
          .pub-links { display: none !important; }
        }
        .pub-nav-dropdown-btn:hover {
          color: var(--gold-light) !important;
        }
        .pub-nav.scrolled .pub-nav-dropdown-btn:hover {
          color: var(--green-primary) !important;
        }
        .mega-menu-item:hover {
          background: rgba(197, 168, 128, 0.08) !important;
          border-color: rgba(184, 144, 71, 0.35) !important;
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        .mega-menu-item:hover .mega-menu-icon-wrap {
          background: var(--ivory) !important;
          transform: scale(1.08) rotate(4deg);
          border-color: var(--gold-light) !important;
        }
        .view-all-services-btn:hover {
          background: var(--green-dark) !important;
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
        .mega-menu-grid-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .mega-menu-grid-scroll::-webkit-scrollbar-track {
          background: rgba(184, 144, 71, 0.05);
        }
        .mega-menu-grid-scroll::-webkit-scrollbar-thumb {
          background: var(--gold-light);
          border-radius: 4px;
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
        @keyframes staggerSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
