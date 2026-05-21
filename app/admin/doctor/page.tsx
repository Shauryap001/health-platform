'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/Sidebar';
import { getSession, type StaffUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { getBookings } from '@/lib/offlineBooking';

function parseSlotTo24H(slot: string): string {
  const parts = slot.trim().split(' ');
  if (parts.length < 2) return slot;
  const timeParts = parts[0].split(':');
  let hour = parseInt(timeParts[0], 10);
  const minute = timeParts[1];
  const ampm = parts[1].toUpperCase();
  if (ampm === 'PM' && hour < 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, '0')}:${minute}:00`;
}

type Appt = { id: string; patient_name: string; scheduled_at: string; status: string; google_meet_link: string | null; notes: string; phone?: string; patient_id: string };

type PrescModal = { appointmentId: string; patientId: string; patientName: string } | null;

const MOCK_APPOINTMENTS: Appt[] = [
  {
    id: 'appt-1',
    patient_id: 'pat-1',
    patient_name: 'Riya Patel',
    phone: '+91 98765 43210',
    scheduled_at: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    status: 'pending',
    google_meet_link: null,
    notes: 'Severe acidity and gas troubles'
  },
  {
    id: 'appt-2',
    patient_id: 'pat-2',
    patient_name: 'Arjun Mehta',
    phone: '+91 99887 76655',
    scheduled_at: new Date(new Date().setHours(14, 30, 0, 0)).toISOString(),
    status: 'confirmed',
    google_meet_link: 'https://meet.google.com/abc-defg-hij',
    notes: 'Joint pain and stiffness'
  },
  {
    id: 'appt-3',
    patient_id: 'pat-3',
    patient_name: 'Sunita Sharma',
    phone: '+91 98234 56789',
    scheduled_at: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
    google_meet_link: 'https://meet.google.com/pqr-stuv-wxy',
    notes: 'Ayurvedic detox follow-up'
  },
  {
    id: 'appt-4',
    patient_id: 'pat-4',
    patient_name: 'Rajesh Kumar',
    phone: '+91 97654 32109',
    scheduled_at: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'pending',
    google_meet_link: null,
    notes: 'Stress management consultation'
  }
];

export default function DoctorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<StaffUser | null>(null);
  const [appointments, setAppointments] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [modal, setModal] = useState<PrescModal>(null);
  const [presc, setPresc] = useState({ diagnosis: '', followUp: '', meds: [{ name: '', dosage: '', freq: '', duration: '', note: '' }] });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateStatus = async (apptId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const isDemoMode = !supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL_HERE';

      if (!isDemoMode) {
        const { error } = await supabase
          .from('appointments')
          .update({ status: newStatus })
          .eq('id', apptId);

        if (error) {
          console.error('Error updating status:', error.message);
          alert(`Failed to update status in database: ${error.message}`);
          return;
        }
      }

      // Update local storage if it matches local/offline booking
      const bookings = getBookings();
      if (bookings.some(b => b.id === apptId)) {
        const updated = bookings.map(b => 
          b.id === apptId ? { ...b, status: newStatus === 'confirmed' ? 'confirmed' : 'cancelled' as any } : b
        );
        localStorage.setItem('shashwat_bookings', JSON.stringify(updated));
      }

      setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status: newStatus } : a));
    } catch (err: any) {
      console.error(err);
      alert(`Error updating status: ${err.message || err}`);
    }
  };

  const generateMeetLink = async (apptId: string) => {
    const part1 = Math.random().toString(36).substring(2, 5);
    const part2 = Math.random().toString(36).substring(2, 6);
    const part3 = Math.random().toString(36).substring(2, 5);
    const link = `https://meet.google.com/${part1}-${part2}-${part3}`;

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const isDemoMode = !supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL_HERE';

      if (!isDemoMode) {
        const { error } = await supabase
          .from('appointments')
          .update({ google_meet_link: link })
          .eq('id', apptId);

        if (error) {
          console.error('Error updating meet link:', error.message);
        }
      } else {
        console.log('[Demo Mode] Bypassed Supabase update for meet link.');
      }

      // Update local storage too if offline booking matches
      const bookings = getBookings();
      if (bookings.some(b => b.id === apptId)) {
        const updated = bookings.map(b => 
          b.id === apptId ? { ...b, google_meet_link: link } : b
        );
        localStorage.setItem('shashwat_bookings', JSON.stringify(updated));
      }

      setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, google_meet_link: link } : a));
    } catch (err) {
      console.error(err);
      setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, google_meet_link: link } : a));
    }
  };

  useEffect(() => {
    const s = getSession();
    if (!s || s.role !== 'doctor') { router.push('/admin/login'); return; }
    setUser(s);

    const fetchAppts = async () => {
      try {
        const { data } = await supabase.from('appointments').select(`
          id, scheduled_at, status, google_meet_link, notes, patient_id,
          profiles:patient_id (full_name, phone)
        `);
        
        let allAppts: Appt[] = [];
        if (data && data.length > 0) {
          allAppts = data.map((d: any) => ({
            id: d.id,
            patient_id: d.patient_id,
            patient_name: d.profiles?.full_name || 'Unknown Patient',
            phone: d.profiles?.phone || '',
            scheduled_at: d.scheduled_at,
            status: d.status,
            google_meet_link: d.google_meet_link,
            notes: d.notes || ''
          }));
        } else {
          allAppts = [...MOCK_APPOINTMENTS];
        }

        // Merge offline/local bookings from localStorage!
        const localBookings = getBookings();
        if (localBookings.length > 0) {
          const localMapped = localBookings.map(b => ({
            id: b.id,
            patient_id: `local-pat-${b.phone}`,
            patient_name: b.name,
            phone: b.phone,
            scheduled_at: new Date(`${b.date}T${parseSlotTo24H(b.slot)}`).toISOString(),
            status: b.status === 'synced' ? 'confirmed' : b.status,
            google_meet_link: b.google_meet_link || null,
            notes: `[Local: ${b.service}] ${b.notes || ''}`
          }));

          const merged = [...localMapped, ...allAppts.filter(a => !localMapped.some(l => l.id === a.id))];
          merged.sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());
          setAppointments(merged);
        } else {
          allAppts.sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());
          setAppointments(allAppts);
        }
      } catch (err) {
        console.error(err);
        setAppointments(MOCK_APPOINTMENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchAppts();
  }, [router]);

  if (!user) return null;

  const todayStr = new Date().toDateString();
  const todayAppts = appointments.filter(a => new Date(a.scheduled_at).toDateString() === todayStr);

  const addMed = () => setPresc(p => ({ ...p, meds: [...p.meds, { name: '', dosage: '', freq: '', duration: '', note: '' }] }));
  const updMed = (i: number, f: string, v: string) => setPresc(p => ({ ...p, meds: p.meds.map((m, idx) => idx === i ? { ...m, [f]: v } : m) }));
  const removeMed = (i: number) => setPresc(p => ({ ...p, meds: p.meds.filter((_, idx) => idx !== i) }));
  
  const savePresc = async () => { 
    if (!modal) return;
    setSaving(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const isDemoMode = !supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL_HERE';
      
      if (!isDemoMode) {
        await supabase.from('prescriptions').insert({
          appointment_id: modal.appointmentId,
          patient_id: modal.patientId,
          diagnosis: presc.diagnosis,
          medicines: presc.meds,
          follow_up_date: presc.followUp || null
        });
      } else {
        console.log('[Demo Mode] Bypassed Supabase insert for prescription.');
      }
      
      setSaved(true); 
      setAppointments(prev => prev.map(a => a.id === modal.appointmentId ? { ...a, status: 'completed' } : a));
      setTimeout(() => { 
        setModal(null); setSaved(false); setSaving(false);
        setPresc({ diagnosis: '', followUp: '', meds: [{ name: '', dosage: '', freq: '', duration: '', note: '' }] }); 
      }, 1800);
    } catch (err) {
      console.error(err);
      setSaved(true);
      setAppointments(prev => prev.map(a => a.id === modal.appointmentId ? { ...a, status: 'completed' } : a));
      setTimeout(() => { 
        setModal(null); setSaved(false); setSaving(false);
        setPresc({ diagnosis: '', followUp: '', meds: [{ name: '', dosage: '', freq: '', duration: '', note: '' }] }); 
      }, 1800);
    }
  };

  return (
    <div className="admin-body" style={{ display: 'flex' }}>
      <AdminSidebar user={user} />
      <main className="admin-main">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div className="admin-page-title">Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {user.name} 👩‍⚕️</div>
            <div className="admin-page-sub">{new Date().toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <a href="/admin/calendar" className="admin-btn admin-btn-outline">🗓 View Calendar</a>
        </div>

        {loading ? <div style={{ textAlign: 'center', padding: 40, color: 'var(--gold)' }}>Loading appointments...</div> : (
          <>
            {/* Stats */}
            <div className="grid-4 mb-24">
              {[
                { icon: '📅', val: todayAppts.length, label: "Today's Sessions", col: 'var(--gold)' },
                { icon: '⏳', val: appointments.filter(a => a.status === 'pending').length, label: 'Awaiting', col: '#FFA726' },
                { icon: '✅', val: appointments.filter(a => a.status === 'completed').length, label: 'Completed', col: '#66BB6A' },
                { icon: '👥', val: new Set(appointments.map(a => a.patient_id)).size, label: 'Total Patients', col: '#42A5F5' },
              ].map((s, i) => (
                <div key={i} className="admin-card">
                  <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>{s.icon}</div>
                  <div className="admin-stat-val" style={{ color: s.col }}>{s.val}</div>
                  <div className="admin-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Today */}
            <div className="admin-card mb-20">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={{ fontWeight: 700, color: 'var(--admin-text)' }}>📅 Today's Schedule</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--admin-muted)' }}>{new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
              </div>
              {todayAppts.length === 0 && <div style={{ textAlign: 'center', color: 'var(--admin-muted)', padding: '24px 0', fontSize: '0.9rem' }}>No sessions scheduled for today 🌿</div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {todayAppts.map(a => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', background: 'var(--admin-card2)', borderRadius: 10, borderLeft: '3px solid var(--gold)' }}>
                    <div style={{ textAlign: 'center', minWidth: 52, padding: '6px 8px', background: 'rgba(201,150,58,0.1)', borderRadius: 8 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--admin-muted)' }}>TIME</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold)', marginTop: 1 }}>{new Date(a.scheduled_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{a.patient_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--admin-muted)', marginTop: 2 }}>{a.notes || 'Consultation'} · {a.phone}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span className={`admin-badge badge-${a.status}`}>{a.status}</span>
                      
                      {a.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => updateStatus(a.id, 'confirmed')} className="admin-btn admin-btn-sm" style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '6px 10px', fontSize: '0.78rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>✓ Accept</button>
                          <button onClick={() => updateStatus(a.id, 'cancelled')} className="admin-btn admin-btn-sm" style={{ background: '#F44336', color: 'white', border: 'none', padding: '6px 10px', fontSize: '0.78rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>✕ Cancel</button>
                        </div>
                      )}
                      {a.status === 'confirmed' && (
                        <button onClick={() => updateStatus(a.id, 'cancelled')} className="admin-btn admin-btn-sm" style={{ background: '#F44336', color: 'white', border: 'none', padding: '6px 10px', fontSize: '0.78rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>✕ Cancel</button>
                      )}

                      {a.google_meet_link ? (
                        <a href={a.google_meet_link} target="_blank" rel="noopener noreferrer" className="meet-pill" style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#42A5F5', color: 'white', textDecoration: 'none', padding: '6px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>📹 Connect</a>
                      ) : (
                        <button 
                          className="meet-pill-gen" 
                          onClick={() => generateMeetLink(a.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: 'rgba(66, 165, 245, 0.1)', border: '1px solid rgba(66, 165, 245, 0.3)',
                            borderRadius: '20px', padding: '6px 12px', fontSize: '0.82rem', fontWeight: 600,
                            color: '#1E88E5', cursor: 'pointer', transition: 'all 0.2s',
                          }}
                        >
                          📹 Gen Meet
                        </button>
                      )}
                      {a.status !== 'completed' && a.status !== 'cancelled' && (
                        <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => setModal({ appointmentId: a.id, patientId: a.patient_id, patientName: a.patient_name })}>✍ Prescribe</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Appointments */}
            <div className="admin-card">
              <div style={{ fontWeight: 700, color: 'var(--admin-text)', marginBottom: 16 }}>📋 All Appointments</div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Patient</th><th>Date & Time</th><th>Notes</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {appointments.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--admin-muted)', padding: 24 }}>No appointments found</td></tr>}
                    {appointments.map(a => (
                      <tr key={a.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{a.patient_name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--admin-muted)' }}>{a.phone}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.88rem' }}>{new Date(a.scheduled_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--admin-muted)' }}>{new Date(a.scheduled_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>
                        <td style={{ color: 'var(--admin-muted)', fontSize: '0.85rem' }}>{a.notes || '—'}</td>
                        <td><span className={`admin-badge badge-${a.status}`}>{a.status}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                            {a.status === 'pending' && (
                              <>
                                <button onClick={() => updateStatus(a.id, 'confirmed')} className="admin-btn" style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '4px 8px', fontSize: '0.72rem', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }} title="Accept Appointment">✓ Accept</button>
                                <button onClick={() => updateStatus(a.id, 'cancelled')} className="admin-btn" style={{ background: '#F44336', color: 'white', border: 'none', padding: '4px 8px', fontSize: '0.72rem', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }} title="Cancel Appointment">✕ Cancel</button>
                              </>
                            )}
                            {a.status === 'confirmed' && (
                              <button onClick={() => updateStatus(a.id, 'cancelled')} className="admin-btn" style={{ background: '#F44336', color: 'white', border: 'none', padding: '4px 8px', fontSize: '0.72rem', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }} title="Cancel Appointment">✕ Cancel</button>
                            )}

                            {a.google_meet_link ? (
                              <a href={a.google_meet_link} target="_blank" rel="noopener noreferrer" className="meet-pill" style={{ fontSize: '0.75rem', padding: '4px 10px', background: '#42A5F5', color: 'white', borderRadius: 20, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }} title="Connect Video Call">📹 Connect</a>
                            ) : (
                              <button 
                                onClick={() => generateMeetLink(a.id)}
                                style={{ 
                                  fontSize: '0.72rem', padding: '4px 8px', 
                                  background: 'rgba(66, 165, 245, 0.1)', border: '1px solid rgba(66, 165, 245, 0.3)',
                                  borderRadius: '20px', color: '#1E88E5', fontWeight: 600, cursor: 'pointer'
                                }}
                                title="Generate Google Meet Link"
                              >
                                📹 Gen Meet
                              </button>
                            )}
                            
                            {a.status !== 'completed' && a.status !== 'cancelled' && (
                              <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => setModal({ appointmentId: a.id, patientId: a.patient_id, patientName: a.patient_name })} title="Write Prescription">📋</button>
                            )}
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

      {/* Prescription Modal */}
      {modal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-box" style={{ maxWidth: 640 }}>
            <div className="modal-hdr">
              <div className="modal-title">✍ Write Prescription — {modal.patientName}</div>
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setModal(null)}>✕</button>
            </div>
            {saved ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
                <div style={{ color: '#66BB6A', fontWeight: 700, fontSize: '1.05rem' }}>Prescription saved successfully!</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div className="grid-2">
                  <div><label className="admin-label">Diagnosis *</label><input className="admin-input" value={presc.diagnosis} onChange={e => setPresc(p => ({ ...p, diagnosis: e.target.value }))} placeholder="e.g., Vata Imbalance" /></div>
                  <div><label className="admin-label">Follow-up Date</label><input className="admin-input" type="date" value={presc.followUp} onChange={e => setPresc(p => ({ ...p, followUp: e.target.value }))} /></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label className="admin-label" style={{ margin: 0 }}>🌿 Medicines</label>
                  <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={addMed}>+ Add</button>
                </div>
                {presc.meds.map((m, i) => (
                  <div key={i} style={{ background: 'var(--admin-card2)', border: '1px solid var(--admin-border)', borderRadius: 10, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--gold)' }}>Medicine {i + 1}</span>
                      {i > 0 && <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => removeMed(i)}>Remove</button>}
                    </div>
                    <div className="grid-2" style={{ gap: 10 }}>
                      <div><label className="admin-label">Name</label><input className="admin-input" value={m.name} onChange={e => updMed(i, 'name', e.target.value)} placeholder="Triphala Churna" /></div>
                      <div><label className="admin-label">Dosage</label><input className="admin-input" value={m.dosage} onChange={e => updMed(i, 'dosage', e.target.value)} placeholder="5g" /></div>
                      <div><label className="admin-label">Frequency</label><input className="admin-input" value={m.freq} onChange={e => updMed(i, 'freq', e.target.value)} placeholder="Twice daily" /></div>
                      <div><label className="admin-label">Duration</label><input className="admin-input" value={m.duration} onChange={e => updMed(i, 'duration', e.target.value)} placeholder="3 months" /></div>
                      <div style={{ gridColumn: '1/-1' }}><label className="admin-label">Instructions</label><input className="admin-input" value={m.note} onChange={e => updMed(i, 'note', e.target.value)} placeholder="Take with warm water after meals" /></div>
                    </div>
                  </div>
                ))}
                <button className="admin-btn admin-btn-gold w-full" style={{ justifyContent: 'center', padding: '12px' }} onClick={savePresc} disabled={!presc.diagnosis || saving}>{saving ? 'Saving...' : '✅ Save Prescription'}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
