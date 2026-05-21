'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/Sidebar';
import { getSession, type StaffUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const MOCK_APPOINTMENTS = [
  {
    id: 'appt-1',
    scheduled_at: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    status: 'pending',
    google_meet_link: null
  },
  {
    id: 'appt-2',
    scheduled_at: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
    google_meet_link: 'https://meet.google.com/pqr-stuv-wxy'
  }
];

const MOCK_PRESCRIPTIONS = [
  {
    id: 'presc-1',
    diagnosis: 'Vata Imbalance & General Weakness',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    medicines: [
      { name: 'Ashwagandha Arishta', dosage: '15ml', freq: 'twice daily', note: 'Mix with equal amount of water after meals' },
      { name: 'Triphala Churna', dosage: '5g', freq: 'once daily at night', note: 'Take with warm water before sleeping' }
    ]
  }
];

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<StaffUser | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getSession();
    if (!s || s.role !== 'patient') { router.push('/login'); return; }
    setUser(s);

    const fetchData = async () => {
      try {
        const { data: appts } = await supabase.from('appointments').select('*').order('scheduled_at', { ascending: false });
        if (appts && appts.length > 0) {
          setAppointments(appts);
        } else {
          setAppointments(MOCK_APPOINTMENTS);
        }

        const { data: prescs } = await supabase.from('prescriptions').select('*').order('created_at', { ascending: false });
        if (prescs && prescs.length > 0) {
          setPrescriptions(prescs);
        } else {
          setPrescriptions(MOCK_PRESCRIPTIONS);
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
        setAppointments(MOCK_APPOINTMENTS);
        setPrescriptions(MOCK_PRESCRIPTIONS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  if (!user) return null;

  return (
    <div className="admin-body" style={{ display: 'flex' }}>
      <AdminSidebar user={user} />
      <main className="admin-main">
        <div style={{ marginBottom: 32 }}>
          <div className="admin-page-title">Welcome back, {user.name} 🌿</div>
          <div className="admin-page-sub">View your upcoming sessions and prescribed Ayurvedic treatments.</div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gold)' }}>Loading your health data...</div>
        ) : (
          <div className="grid-2">
            {/* Appointments */}
            <div>
              <h3 className="serif" style={{ fontSize: '1.4rem', color: 'var(--brown)', marginBottom: 16 }}>Your Appointments</h3>
              {appointments.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--admin-muted)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 10 }}>📅</div>
                  <p>You have no scheduled appointments.</p>
                  <a href="/book" className="btn-book" style={{ display: 'inline-block', marginTop: 16 }}>Book a Session</a>
                </div>
              ) : (
                <div className="admin-card" style={{ padding: 0 }}>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead><tr><th>Date & Time</th><th>Status</th><th>Meet Link</th></tr></thead>
                      <tbody>
                        {appointments.map(a => (
                          <tr key={a.id}>
                            <td>
                              <div style={{ fontWeight: 600 }}>{new Date(a.scheduled_at).toLocaleDateString()}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--admin-muted)' }}>{new Date(a.scheduled_at).toLocaleTimeString()}</div>
                            </td>
                            <td><span className={`admin-badge badge-${a.status}`}>{a.status}</span></td>
                            <td>{a.google_meet_link && <a href={a.google_meet_link} target="_blank" className="meet-pill">Join</a>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Prescriptions */}
            <div>
              <h3 className="serif" style={{ fontSize: '1.4rem', color: 'var(--brown)', marginBottom: 16 }}>Your Prescriptions</h3>
              {prescriptions.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--admin-muted)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 10 }}>💊</div>
                  <p>You have no prescriptions yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {prescriptions.map(p => (
                    <div key={p.id} className="admin-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ fontWeight: 700, color: 'var(--brown)' }}>Diagnosis: {p.diagnosis}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--admin-muted)' }}>{new Date(p.created_at).toLocaleDateString()}</div>
                      </div>
                      <div style={{ background: 'var(--admin-card2)', borderRadius: 8, padding: '12px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: 'var(--gold)' }}>Medicines:</div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem' }}>
                          {(p.medicines || []).map((m: any, i: number) => (
                            <li key={i} style={{ marginBottom: 6, borderBottom: '1px solid var(--admin-border)', paddingBottom: 6 }}>
                              <strong>{m.name}</strong> — {m.dosage} ({m.freq})<br/>
                              <span style={{ color: 'var(--admin-muted)' }}>{m.note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
