'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearSession, type StaffUser } from '@/lib/auth';

const DOC_LINKS = [
  { label: 'Dashboard', href: '/admin/doctor', icon: '◈' },
  { label: 'Schedule', href: '/admin/doctor/schedule', icon: '◷' },
  { label: 'Patients', href: '/admin/patients', icon: '◉' },
  { label: 'Prescriptions', href: '/admin/doctor/prescriptions', icon: '⊕' },
  { label: 'Calendar', href: '/admin/calendar', icon: '▦' },
];
const REC_LINKS = [
  { label: 'Dashboard', href: '/admin/reception', icon: '◈' },
  { label: 'Appointments', href: '/admin/reception', icon: '◷' },
  { label: 'Calendar', href: '/admin/calendar', icon: '▦' },
];
const PAT_LINKS = [
  { label: 'My Health Dashboard', href: '/dashboard', icon: '◈' },
  { label: 'My Prescriptions', href: '/dashboard/prescriptions', icon: '📋' },
];

export default function AdminSidebar({ user }: { user: StaffUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const links = user.role === 'doctor' ? DOC_LINKS : user.role === 'reception' ? REC_LINKS : PAT_LINKS;

  const logout = () => { clearSession(); router.push(user.role === 'patient' ? '/login' : '/admin/login'); };

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <div className="admin-logo-text">🌿 AyurVeda Care</div>
        <div className="admin-logo-sub">{user.role === 'patient' ? 'Patient Portal' : 'Staff Portal'}</div>
        <div className="admin-user-pill" style={{ marginTop: 14 }}>
          <div className="admin-user-role">{user.role === 'doctor' ? '👩‍⚕️ Doctor' : user.role === 'reception' ? '🏥 Reception' : '👩 Patient'}</div>
          <div className="admin-user-name">{user.name}</div>
        </div>
      </div>

      <nav className="admin-nav">
        <div className="admin-nav-section">Navigation</div>
        {links.map(l => (
          <Link key={l.href + l.label} href={l.href} className={`admin-link ${pathname === l.href ? 'active' : ''}`}>
            <span className="admin-link-icon">{l.icon}</span>{l.label}
          </Link>
        ))}
        <div className="admin-nav-section" style={{ marginTop: 12 }}>Quick Access</div>
        <Link href="/" className="admin-link"><span className="admin-link-icon">🌐</span>Public Site</Link>
        <Link href="/doctor" className="admin-link" target="_blank"><span className="admin-link-icon">👩‍⚕️</span>Doctor Profile</Link>
      </nav>

      <div className="admin-footer">
        <button onClick={logout} className="admin-link w-full" style={{ cursor: 'pointer' }}>
          <span className="admin-link-icon">→</span> Sign Out
        </button>
      </div>
    </aside>
  );
}
