'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSession, clearSession, type StaffUser } from '@/lib/auth';

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<StaffUser | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    setUser(getSession());
  }, []);

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
        <div className="pub-links">
          {links.map(l => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
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

      {/* Show hamburger on mobile via inline style injection */}
      <style>{`
        @media (max-width: 768px) {
          .hamburger { display: flex !important; }
          .pub-nav-btns { display: none !important; }
        }
      `}</style>
    </>
  );
}
