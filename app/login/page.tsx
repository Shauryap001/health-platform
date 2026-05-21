'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { staffLogin, saveSession } from '@/lib/auth';
import PublicNav from '@/components/Navbar';

export default function PatientLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 600));
    const user = staffLogin(email.trim(), password);
    if (!user) { 
      setError('Invalid email or password. Please check your credentials.'); 
      setLoading(false); 
      return; 
    }
    saveSession(user);
    if (user.role === 'doctor') {
      router.push('/admin/doctor');
    } else if (user.role === 'reception') {
      router.push('/admin/reception');
    } else {
      router.push('/dashboard');
    }
  };

  const fillDemo = (role: 'patient' | 'admin') => {
    if (role === 'patient') {
      setEmail('riya@gmail.com');
      setPassword('password123');
    } else {
      setEmail('admin@gmail.com');
      setPassword('1234567890');
    }
  };

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />
      <div className="login-page" style={{ flex: 1 }}>
        {/* Background decorations */}
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,150,58,0.15) 0%, transparent 70%)', top: -100, right: -50 }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,122,78,0.1) 0%, transparent 70%)', bottom: -80, left: -80 }} />

        <div className="login-card">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🌿</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 700, color: 'var(--brown)' }}>Patient & Staff Login</div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-mid)', marginTop: 12, lineHeight: 1.6 }}>Sign in to view your prescriptions, appointments, or manage the clinic.</p>
          </div>

          {/* Demo buttons */}
          <div style={{ background: 'rgba(92,122,78,0.06)', border: '1px solid rgba(92,122,78,0.2)', borderRadius: 12, padding: 14, marginBottom: 24 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Quick Demo Access</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => fillDemo('patient')} style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(92,122,78,0.25)', background: 'rgba(92,122,78,0.08)', color: 'var(--sage)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                👩 Patient Portal
              </button>
              <button type="button" onClick={() => fillDemo('admin')} style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(201,150,58,0.25)', background: 'rgba(201,150,58,0.08)', color: 'var(--brown)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                👩‍⚕️ Admin Portal
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(196,97,63,0.08)', border: '1px solid rgba(196,97,63,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: '0.87rem', color: 'var(--terracotta)' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-field">
              <label className="form-label">Email Address</label>
              <input className="form-ctrl" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required autoFocus />
            </div>
            <div className="form-field" style={{ position: 'relative' }}>
              <label className="form-label">Password</label>
              <input className="form-ctrl" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, bottom: 13, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-light)' }}>
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
            <button type="submit" className="btn-book" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem', marginTop: 4, borderRadius: 12 }} disabled={loading}>
              {loading ? '⏳ Signing in...' : '🔐 View My Health Portal'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-light)' }}>
            <Link href="/" style={{ color: 'var(--sage)', fontWeight: 500, transition: 'color 0.2s' }}>← Back to Public Site</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
