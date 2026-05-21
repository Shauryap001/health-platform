'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/Sidebar';
import { getSession, type StaffUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

type Appt = { id: string; patient_name: string; phone: string; scheduled_at: string; notes: string; status: 'pending' | 'confirmed' | 'completed' | 'cancelled'; google_meet_link: string | null; };

const MOCK_APPTS: Appt[] = [
  {
    id: 'appt-1',
    patient_name: 'Riya Patel',
    phone: '+91 98765 43210',
    scheduled_at: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    notes: 'Severe acidity and gas troubles',
    status: 'pending',
    google_meet_link: null
  },
  {
    id: 'appt-2',
    patient_name: 'Arjun Mehta',
    phone: '+91 99887 76655',
    scheduled_at: new Date(new Date().setHours(14, 30, 0, 0)).toISOString(),
    notes: 'Joint pain and stiffness',
    status: 'confirmed',
    google_meet_link: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: 'appt-3',
    patient_name: 'Sunita Sharma',
    phone: '+91 98234 56789',
    scheduled_at: new Date(Date.now() - 86400000).toISOString(),
    notes: 'Ayurvedic detox follow-up',
    status: 'completed',
    google_meet_link: 'https://meet.google.com/pqr-stuv-wxy'
  }
];

function genMeet() {
  const s = (n: number) => Array.from({ length: n }, () => 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]).join('');
  return `https://meet.google.com/${s(3)}-${s(4)}-${s(3)}`;
}

export default function ReceptionDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<StaffUser | null>(null);
  const [appts, setAppts] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newAppt, setNewAppt] = useState({ patient: '', phone: '', email: '', date: '', time: '', reason: 'General Consultation', notes: '' });

  useEffect(() => {
    const s = getSession();
    if (!s || s.role !== 'reception') { router.push('/admin/login'); return; }
    setUser(s);

    const fetchAppts = async () => {
      try {
        const { data } = await supabase.from('appointments').select(`
          id, scheduled_at, status, google_meet_link, notes,
          profiles:patient_id (full_name, phone)
        `).order('scheduled_at', { ascending: false });
        
        if (data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            patient_name: d.profiles?.full_name || 'Unknown Patient',
            phone: d.profiles?.phone || '',
            scheduled_at: d.scheduled_at,
            status: d.status,
            google_meet_link: d.google_meet_link,
            notes: d.notes || ''
          }));
          setAppts(mapped);
        } else {
          setAppts(MOCK_APPTS);
        }
      } catch (err) {
        console.error(err);
        setAppts(MOCK_APPTS);
      } finally {
        setLoading(false);
      }
    };
    fetchAppts();
  }, [router]);

  if (!user) return null;

  const update = async (id: string, status: Appt['status']) => {
    setAppts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const isDemoMode = !supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL_HERE';
      if (!isDemoMode) {
        await supabase.from('appointments').update({ status }).eq('id', id);
      }
    } catch (err) {
      console.error('Error updating appointment:', err);
    }
  };
  
  const filtered = appts.filter(a => (filter === 'all' || a.status === filter) && (!search || a.patient_name.toLowerCase().includes(search.toLowerCase()) || a.notes.toLowerCase().includes(search.toLowerCase())));
  const pending = appts.filter(a => a.status === 'pending').length;
  const today = appts.filter(a => new Date(a.scheduled_at).toDateString() === new Date().toDateString()).length;

  const confirmNew = async () => {
    const scheduledAt = new Date(`${newAppt.date}T${newAppt.time}:00`).toISOString();
    const apptId = Math.random().toString(36).substring(2, 9);
    const meetLink = genMeet();

    const createdAppt: Appt = {
      id: apptId,
      patient_name: newAppt.patient,
      phone: newAppt.phone,
      scheduled_at: scheduledAt,
      notes: newAppt.reason + (newAppt.notes ? ` — ${newAppt.notes}` : ''),
      status: 'confirmed',
      google_meet_link: meetLink
    };

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const isDemoMode = !supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL_HERE';
      if (!isDemoMode) {
        await supabase.from('appointments').insert({
          patient_id: '00000000-0000-0000-0000-000000000000',
          doctor_id: '00000000-0000-0000-0000-000000000000',
          scheduled_at: scheduledAt,
          duration_minutes: 30,
          status: 'confirmed',
          google_meet_link: meetLink,
          notes: newAppt.reason + (newAppt.notes ? ` — ${newAppt.notes}` : '')
        });
      }
    } catch (err) {
      console.error('Error inserting appointment:', err);
    }

    setAppts(prev => [createdAppt, ...prev]);
    setShowModal(false);
    setNewAppt({ patient: '', phone: '', email: '', date: '', time: '', reason: 'General Consultation', notes: '' });
  };

  return (
    <div className="admin-body" style={{ display: 'flex' }}>
      <AdminSidebar user={user} />
      <main className="admin-main">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div className="admin-page-title">Reception Dashboard 🏥</div>
            <div className="admin-page-sub">Manage all appointments and patient bookings</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href="/admin/calendar" className="admin-btn admin-btn-outline">🗓 Calendar</a>
            <button className="admin-btn admin-btn-gold" onClick={() => setShowModal(true)}>+ New Booking</button>
          </div>
        </div>

        {loading ? <div style={{ textAlign: 'center', padding: 40, color: 'var(--gold)' }}>Loading appointments...</div> : (
          <>
            {/* Stats */}
            <div className="grid-4 mb-20">
              {[
                { icon: '📅', val: today, label: "Today's Appointments", col: 'var(--gold)' },
                { icon: '⏳', val: pending, label: 'Pending Confirmation', col: '#FFA726' },
                { icon: '✅', val: appts.filter(a => a.status === 'confirmed').length, label: 'Confirmed', col: '#66BB6A' },
                { icon: '👥', val: new Set(appts.map(a => a.patient_name)).size, label: 'Patients', col: '#42A5F5' },
              ].map((s, i) => (
                <div key={i} className="admin-card">
                  <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{s.icon}</div>
                  <div className="admin-stat-val" style={{ color: s.col }}>{s.val}</div>
                  <div className="admin-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            {pending > 0 && (
              <div style={{ background: 'rgba(255,152,0,0.08)', border: '1px solid rgba(255,152,0,0.2)', borderRadius: 10, padding: '12px 18px', marginBottom: 16, fontSize: '0.88rem', color: '#FFA726', display: 'flex', alignItems: 'center', gap: 10 }}>
                ⚠ <strong>{pending} appointment{pending > 1 ? 's' : ''}</strong> waiting for your confirmation.
              </div>
            )}

            {/* Filters */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${filter === f ? 'var(--gold)' : 'var(--admin-border)'}`, background: filter === f ? 'rgba(201,150,58,0.12)' : 'transparent', color: filter === f ? 'var(--gold)' : 'var(--admin-muted)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: filter === f ? 700 : 400, textTransform: 'capitalize', fontFamily: 'Inter', transition: 'all 0.2s' }}>
                    {f}{f !== 'all' && <span style={{ marginLeft: 5, fontSize: '0.72rem', opacity: 0.7 }}>{appts.filter(a => a.status === f).length}</span>}
                  </button>
                ))}
              </div>
              <input className="admin-input" style={{ width: 220 }} placeholder="🔍 Search patient…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Table */}
            <div className="admin-card">
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Patient</th><th>Date & Time</th><th>Reason</th><th>Status</th><th>Meet Link</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--admin-muted)', padding: 24 }}>No appointments found</td></tr>}
                    {filtered.map(a => (
                      <tr key={a.id}>
                        <td><div style={{ fontWeight: 600 }}>{a.patient_name}</div><div style={{ fontSize: '0.78rem', color: 'var(--admin-muted)' }}>{a.phone}</div></td>
                        <td><div>{new Date(a.scheduled_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</div><div style={{ fontSize: '0.78rem', color: 'var(--admin-muted)' }}>{new Date(a.scheduled_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</div></td>
                        <td style={{ color: 'var(--admin-muted)', fontSize: '0.85rem' }}>{a.notes || '—'}</td>
                        <td><span className={`admin-badge badge-${a.status}`}>{a.status}</span></td>
                        <td>{a.google_meet_link ? <a href={a.google_meet_link} target="_blank" rel="noopener noreferrer" className="meet-pill" style={{ fontSize: '0.78rem' }}>📹 Join</a> : <span style={{ color: 'var(--admin-muted)', fontSize: '0.82rem' }}>—</span>}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {a.status === 'pending' && (<><button className="admin-btn admin-btn-success admin-btn-sm" onClick={() => update(a.id, 'confirmed')}>✓ Confirm</button><button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => update(a.id, 'cancelled')}>✕</button></>)}
                            {a.status === 'confirmed' && (<><button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => update(a.id, 'completed')}>Done</button><button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => update(a.id, 'cancelled')}>✕</button></>)}
                            {(a.status === 'completed' || a.status === 'cancelled') && <span style={{ fontSize: '0.8rem', color: 'var(--admin-muted)' }}>—</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* New Booking Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-hdr">
              <div className="modal-title">📅 New Booking</div>
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="grid-2">
                <div><label className="admin-label">Patient Name *</label><input className="admin-input" value={newAppt.patient} onChange={e => setNewAppt({ ...newAppt, patient: e.target.value })} placeholder="Full name" /></div>
                <div><label className="admin-label">Phone *</label><input className="admin-input" value={newAppt.phone} onChange={e => setNewAppt({ ...newAppt, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" /></div>
              </div>
              <div><label className="admin-label">Email</label><input className="admin-input" type="email" value={newAppt.email} onChange={e => setNewAppt({ ...newAppt, email: e.target.value })} placeholder="patient@email.com" /></div>
              <div className="grid-2">
                <div><label className="admin-label">Date *</label><input className="admin-input" type="date" value={newAppt.date} onChange={e => setNewAppt({ ...newAppt, date: e.target.value })} /></div>
                <div><label className="admin-label">Time *</label><input className="admin-input" type="time" value={newAppt.time} onChange={e => setNewAppt({ ...newAppt, time: e.target.value })} /></div>
              </div>
              <div><label className="admin-label">Reason</label>
                <select className="admin-input" value={newAppt.reason} onChange={e => setNewAppt({ ...newAppt, reason: e.target.value })}>
                  {['General Consultation', 'Follow-up', 'Panchakarma', 'Digestive Issues', 'Joint Pain', 'Skin Problems', "Women's Health", 'Mental Wellness', 'Weight Management'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div><label className="admin-label">Notes</label><textarea className="admin-textarea" value={newAppt.notes} onChange={e => setNewAppt({ ...newAppt, notes: e.target.value })} placeholder="Additional notes…" /></div>
              <button className="admin-btn admin-btn-gold w-full" style={{ justifyContent: 'center', padding: 12, marginTop: 4 }} onClick={confirmNew} disabled={!newAppt.patient || !newAppt.date || !newAppt.time}>✅ Confirm Booking & Generate Meet Link</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
