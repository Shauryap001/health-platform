'use client';
import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, type View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AdminSidebar from '@/components/Sidebar';
import { getSession, type StaffUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getBookings } from '@/lib/offlineBooking';

const localizer = momentLocalizer(moment);

type Ev = { id: string; title: string; start: Date; end: Date; resource: { status: string; meet: string | null; patient: string; reason: string } };

const STATUS_COLORS: Record<string, string> = { pending: '#FFA726', confirmed: '#66BB6A', completed: '#42A5F5', cancelled: '#EF5350' };

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

const MOCK_EVENTS = () => [
  {
    id: 'appt-1',
    title: 'Riya Patel — Severe acidity and gas troubles',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(10, 30, 0, 0)),
    resource: {
      status: 'pending',
      meet: null,
      patient: 'Riya Patel',
      reason: 'Severe acidity and gas troubles'
    }
  },
  {
    id: 'appt-2',
    title: 'Arjun Mehta — Joint pain and stiffness',
    start: new Date(new Date().setHours(14, 30, 0, 0)),
    end: new Date(new Date().setHours(15, 0, 0, 0)),
    resource: {
      status: 'confirmed',
      meet: 'https://meet.google.com/abc-defg-hij',
      patient: 'Arjun Mehta',
      reason: 'Joint pain and stiffness'
    }
  },
  {
    id: 'appt-3',
    title: 'Sunita Sharma — Ayurvedic detox follow-up',
    start: new Date(Date.now() - 86400000),
    end: new Date(Date.now() - 86400000 + 1800000),
    resource: {
      status: 'completed',
      meet: 'https://meet.google.com/pqr-stuv-wxy',
      patient: 'Sunita Sharma',
      reason: 'Ayurvedic detox follow-up'
    }
  }
];

export default function AdminCalendar() {
  const router = useRouter();
  const [user, setUser] = useState<StaffUser | null>(null);
  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState(new Date());
  const [selected, setSelected] = useState<Ev | null>(null);
  const [events, setEvents] = useState<Ev[]>([]);
  const [loading, setLoading] = useState(true);

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

      setEvents(prev => prev.map(e => e.id === apptId ? { ...e, resource: { ...e.resource, status: newStatus } } : e));
      setSelected(prev => prev && prev.id === apptId ? { ...prev, resource: { ...prev.resource, status: newStatus } } : prev);
    } catch (err: any) {
      console.error(err);
      alert(`Error updating status: ${err.message || err}`);
    }
  };

  useEffect(() => {
    const s = getSession();
    if (!s) { router.push('/admin/login'); return; }
    setUser(s);

    const fetchEvents = async () => {
      try {
        const { data } = await supabase.from('appointments').select(`
          id, scheduled_at, duration_minutes, status, google_meet_link, notes,
          profiles:patient_id (full_name)
        `);
        
        let allEvents: Ev[] = [];
        if (data && data.length > 0) {
          allEvents = data.map((d: any) => {
            const start = new Date(d.scheduled_at);
            const end = new Date(start.getTime() + (d.duration_minutes || 30) * 60000);
            const patient = d.profiles?.full_name || 'Unknown Patient';
            return {
              id: d.id,
              title: `${patient} — ${d.notes || 'Consultation'}`,
              start,
              end,
              resource: {
                status: d.status,
                meet: d.google_meet_link,
                patient,
                reason: d.notes || 'Consultation'
              }
            };
          });
        } else {
          allEvents = MOCK_EVENTS();
        }

        // Merge offline/local bookings from localStorage!
        const localBookings = getBookings();
        if (localBookings.length > 0) {
          const localMapped = localBookings.map(b => {
            const startStr = `${b.date}T${parseSlotTo24H(b.slot)}`;
            const start = new Date(startStr);
            const end = new Date(start.getTime() + 30 * 60000);
            const patient = b.name;
            const reason = `[Local: ${b.service}] ${b.notes || ''}`;
            return {
              id: b.id,
              title: `${patient} — ${reason}`,
              start,
              end,
              resource: {
                status: b.status === 'synced' ? 'confirmed' : b.status,
                meet: b.google_meet_link || null,
                patient,
                reason
              }
            };
          });

          const merged = [...localMapped, ...allEvents.filter(a => !localMapped.some(l => l.id === a.id))];
          setEvents(merged);
        } else {
          setEvents(allEvents);
        }
      } catch (err) {
        console.error(err);
        setEvents(MOCK_EVENTS());
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [router]);

  if (!user) return null;

  return (
    <div className="admin-body" style={{ display: 'flex' }}>
      <AdminSidebar user={user} />
      <main className="admin-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div className="admin-page-title">📅 Appointment Calendar</div>
            <div className="admin-page-sub">All scheduled consultations at a glance</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {Object.entries(STATUS_COLORS).map(([s, c]) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--admin-muted)', textTransform: 'capitalize' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        
        {loading ? <div style={{ textAlign: 'center', padding: 40, color: 'var(--gold)' }}>Loading calendar...</div> : (
          <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: 680 }}>
              <Calendar 
                localizer={localizer} 
                events={events} 
                startAccessor="start" 
                endAccessor="end" 
                view={view} 
                onView={v => setView(v)} 
                date={date} 
                onNavigate={d => setDate(d)} 
                onSelectEvent={e => setSelected(e)} 
                eventPropGetter={e => ({ style: { backgroundColor: STATUS_COLORS[e.resource.status] || '#C9963A', border: 'none', borderRadius: 4, fontSize: '0.78rem' } })} 
                style={{ height: '100%', padding: 16 }} 
                popup 
              />
            </div>
          </div>
        )}
      </main>

      {selected && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal-box" style={{ maxWidth: 400 }}>
            <div className="modal-hdr">
              <div className="modal-title">Appointment Details</div>
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[['Patient', selected.resource.patient], ['Date', selected.start.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })], ['Time', `${selected.start.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })} — ${selected.end.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}`], ['Reason', selected.resource.reason]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--admin-border)', alignItems: 'center' }}>
                  <span style={{ color: 'var(--admin-muted)', width: 80, fontSize: '0.82rem', flexShrink: 0 }}>{l}</span>
                  <span style={{ fontSize: '0.9rem' }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--admin-border)', alignItems: 'center' }}>
                <span style={{ color: 'var(--admin-muted)', width: 80, fontSize: '0.82rem', flexShrink: 0 }}>Status</span>
                <span className={`admin-badge badge-${selected.resource.status}`}>{selected.resource.status}</span>
              </div>
              
              {/* Accept / Cancel Actions */}
              {(selected.resource.status === 'pending' || selected.resource.status === 'confirmed') && (
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  {selected.resource.status === 'pending' && (
                    <button 
                      onClick={() => updateStatus(selected.id, 'confirmed')} 
                      className="admin-btn" 
                      style={{ flex: 1, background: '#4CAF50', color: 'white', border: 'none', padding: '10px', fontSize: '0.82rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                    >
                      ✓ Accept
                    </button>
                  )}
                  <button 
                    onClick={() => updateStatus(selected.id, 'cancelled')} 
                    className="admin-btn" 
                    style={{ flex: 1, background: '#F44336', color: 'white', border: 'none', padding: '10px', fontSize: '0.82rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                  >
                    ✕ Cancel
                  </button>
                </div>
              )}

              {selected.resource.meet && (
                <a href={selected.resource.meet} target="_blank" rel="noopener noreferrer" className="meet-pill" style={{ marginTop: 16, justifyContent: 'center', borderRadius: 10, padding: '10px', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>📹 Connect</a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
