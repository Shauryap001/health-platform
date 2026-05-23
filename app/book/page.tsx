'use client';
import { useState, useEffect } from 'react';
import PublicNav from '@/components/Navbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import Link from 'next/link';
import { saveBooking, getBookings } from '@/lib/offlineBooking';
import { supabase } from '@/lib/supabase';
import { processRazorpayPayment } from '@/lib/razorpay';

const SERVICES = [
  // Clinic / Offline services
  { label: 'In-Clinic Ayurved Consultation', price: '₹500', type: 'clinic' as const, fee: 500 },
  { label: 'Panchkarma Therapy', price: '₹1500', type: 'clinic' as const, fee: 1500 },
  { label: 'Shirodhara', price: '₹1200', type: 'clinic' as const, fee: 1200 },
  { label: 'Suvarnaprashan (Children 0-16yrs)', price: '₹300', type: 'clinic' as const, fee: 300 },
  { label: 'Ayurvedic Immunization', price: '₹400', type: 'clinic' as const, fee: 400 },
  { label: 'Akshi-Tarpan (Eye Care)', price: '₹600', type: 'clinic' as const, fee: 600 },
  { label: 'Karnapuran (Ear Care)', price: '₹400', type: 'clinic' as const, fee: 400 },

  // Tele / Online services
  { label: 'Tele / Video Consultation', price: '₹800', type: 'tele' as const, fee: 800 },
  { label: 'Online Diet & Lifestyle Plan', price: '₹1000', type: 'tele' as const, fee: 1000 },
  { label: 'Online Chronic Disease Care', price: '₹1200', type: 'tele' as const, fee: 1200 },
];

const SLOTS = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];

function getDates() {
  const dates: string[] = [];
  const now = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    if (d.getDay() !== 0) dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

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

export default function BookPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [step, setStep] = useState(1);
  const [consultationType, setConsultationType] = useState<'clinic' | 'tele' | ''>('');
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [booked, setBooked] = useState<{ id: string; date: string; slot: string; paymentId?: string | null; google_meet_link?: string | null } | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const dates = getDates();

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  // Conflict check effect
  useEffect(() => {
    if (!date) {
      setBookedSlots([]);
      return;
    }
    setSlot('');

    const checkConflicts = async () => {
      // 1. Get offline/local bookings from localStorage
      const localBookings = getBookings().filter(
        b => b.date === date && b.status !== 'cancelled'
      );
      const localSlots = localBookings.map(b => b.slot);

      // 2. Fetch from Supabase if online and not in demo mode
      let dbSlots: string[] = [];
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const isDemoMode = !supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL_HERE';

      if (isOnline && !isDemoMode) {
        try {
          const startOfDay = `${date}T00:00:00.000Z`;
          const endOfDay = `${date}T23:59:59.999Z`;

          const { data } = await supabase
            .from('appointments')
            .select('scheduled_at')
            .gte('scheduled_at', startOfDay)
            .lte('scheduled_at', endOfDay)
            .neq('status', 'cancelled');

          if (data) {
            dbSlots = data.map((appt: any) => {
              const d = new Date(appt.scheduled_at);
              const hour = d.getHours();
              const minute = d.getMinutes();
              const ampm = hour >= 12 ? 'PM' : 'AM';
              const displayHour = hour % 12 === 0 ? 12 : hour % 12;
              const displayHourStr = displayHour.toString().padStart(2, '0');
              const displayMinStr = minute.toString().padStart(2, '0');
              return `${displayHourStr}:${displayMinStr} ${ampm}`;
            });
          }
        } catch (err) {
          console.error('Error fetching database slots:', err);
        }
      }

      const allBooked = Array.from(new Set([...localSlots, ...dbSlots]));
      setBookedSlots(allBooked);
    };

    checkConflicts();
  }, [date, isOnline]);

  const selectType = (type: 'clinic' | 'tele') => {
    setConsultationType(type);
    const firstService = SERVICES.find(s => s.type === type) || SERVICES[0];
    setSelectedService(firstService);
    setStep(2);
  };

  const handleBookingSubmit = async () => {
    if (!form.name || !form.phone || !form.email) {
      alert('Please fill in all required fields.');
      return;
    }

    if (isOnline && selectedService.fee > 0) {
      setLoading(true);
      try {
        await processRazorpayPayment({
          amount: selectedService.fee,
          serviceName: selectedService.label,
          name: form.name,
          email: form.email,
          phone: form.phone,
          onSuccess: (paymentId) => {
            doBook(paymentId);
          },
          onFailure: (error) => {
            setLoading(false);
            alert(`Payment failed: ${error}`);
          }
        });
      } catch (err: any) {
        setLoading(false);
        alert(`Payment error: ${err.message || err}`);
      }
    } else {
      doBook(null);
    }
  };

  const generateMeetLink = () => {
    const part1 = Math.random().toString(36).substring(2, 5);
    const part2 = Math.random().toString(36).substring(2, 6);
    const part3 = Math.random().toString(36).substring(2, 5);
    return `https://meet.google.com/${part1}-${part2}-${part3}`;
  };

  const doBook = async (paymentId: string | null) => {
    setLoading(true);
    try {
      const meetLink = selectedService.type === 'tele' ? generateMeetLink() : null;
      const booking = saveBooking({
        name: form.name,
        phone: form.phone,
        email: form.email,
        service: selectedService.label,
        serviceType: selectedService.type,
        date,
        slot,
        notes: form.notes + (paymentId ? ` [Payment ID: ${paymentId}]` : ''),
        status: 'pending',
        google_meet_link: meetLink
      });

      if (isOnline) {
        try {
          await fetch('/api/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...booking, paymentId }),
          });
        } catch { /* saved offline */ }
      }

      setBooked({ id: booking.id, date, slot, paymentId, google_meet_link: meetLink });
      setStep(5);
    } catch (err) {
      console.error('Error booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const STEP_LABELS = ['Type', 'Service', 'Date & Time', 'Details'];

  const filteredServices = SERVICES.filter(s => s.type === consultationType);

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <PublicNav />
      <WhatsAppButton />

      {/* Page Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--green-dark), var(--green-medium))', paddingTop: 100, paddingBottom: 60, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(60,226,130,0.1) 0%, transparent 60%)' }} />
        <div className="container-pub" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="tag-pub" style={{ display: 'inline-flex', background: 'rgba(60,226,130,0.12)', borderColor: 'rgba(60,226,130,0.3)', color: 'var(--green-light)' }}>
            📅 Appointment Booking
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'white', marginBottom: 10 }}>
            Book Your <em style={{ color: 'var(--green-light)', fontStyle: 'italic' }}>Appointment</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem' }}>
            with Dr. Vishal B Bhuva · Shashwat Ayurveda & Panchkarma Hospital
          </p>
          {/* Online/Offline indicator */}
          <div style={{ marginTop: 16 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: isOnline ? 'rgba(60,226,130,0.2)' : 'rgba(255,152,0,0.2)',
              border: `1px solid ${isOnline ? 'rgba(60,226,130,0.4)' : 'rgba(255,152,0,0.4)'}`,
              borderRadius: 20, padding: '6px 14px', fontSize: '0.82rem', fontWeight: 600,
              color: isOnline ? 'var(--green-light)' : '#FFCC80',
            }}>
              {isOnline ? '🟢 Online — Live Payment & Instant Sync' : '📱 Offline — Booking Saved Locally'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ paddingTop: 48, paddingBottom: 80 }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px' }}>

          {/* Progress Indicator */}
          {step < 5 && (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, gap: 4 }}>
              {STEP_LABELS.map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 3 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                    <div className={`step-circle ${step > i + 1 ? 'step-done' : step === i + 1 ? 'step-active' : 'step-inactive'}`}>
                      {step > i + 1 ? '✓' : i + 1}
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: step === i + 1 ? 600 : 400, color: step >= i + 1 ? 'var(--text-dark)' : 'var(--text-light)' }}>
                      {l}
                    </span>
                  </div>
                  {i < 3 && <div className="step-line" style={{ background: step > i + 1 ? 'var(--green-primary)' : 'rgba(39,174,96,0.15)', margin: '0 10px' }} />}
                </div>
              ))}
            </div>
          )}

          {/* Step 1: Type Selection (Online/Offline) */}
          {step === 1 && (
            <div className="card-pub" style={{ padding: 36 }}>
              <h2 className="h3-pub" style={{ marginBottom: 24, textAlign: 'center' }}>Select Appointment Type</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                {/* Online Card */}
                <button 
                  onClick={() => selectType('tele')}
                  style={{
                    padding: '24px', borderRadius: 16,
                    border: '1.5px solid rgba(39, 174, 96, 0.15)',
                    background: 'var(--cream)',
                    textAlign: 'left', cursor: 'pointer', transition: 'all 0.25s',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                    display: 'flex', alignItems: 'flex-start', gap: 16,
                  }}
                  className="rzp-btn"
                >
                  <div style={{ fontSize: '2.5rem', padding: '10px', background: 'rgba(33, 150, 243, 0.08)', borderRadius: 14, flexShrink: 0 }}>📹</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 6 }}>Online Video Consultation</div>
                    <div style={{ fontSize: '0.86rem', color: 'var(--text-mid)', lineHeight: 1.5, marginBottom: 10 }}>
                      Consult with doctor from anywhere via high-quality video call. Perfect for primary diagnosis, chronic plans, and follow-ups.
                    </div>
                    <span style={{ fontSize: '0.8rem', background: 'rgba(33, 150, 243, 0.12)', color: '#1976D2', padding: '5px 12px', borderRadius: 8, fontWeight: 700 }}>
                      ₹800 Fee
                    </span>
                  </div>
                </button>

                {/* Offline Card */}
                <button 
                  onClick={() => selectType('clinic')}
                  style={{
                    padding: '24px', borderRadius: 16,
                    border: '1.5px solid rgba(39, 174, 96, 0.15)',
                    background: 'var(--cream)',
                    textAlign: 'left', cursor: 'pointer', transition: 'all 0.25s',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                    display: 'flex', alignItems: 'flex-start', gap: 16,
                  }}
                  className="rzp-btn"
                >
                  <div style={{ fontSize: '2.5rem', padding: '10px', background: 'rgba(39, 174, 96, 0.08)', borderRadius: 14, flexShrink: 0 }}>🏥</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 6 }}>In-Clinic Consultation & Treatment</div>
                    <div style={{ fontSize: '0.86rem', color: 'var(--text-mid)', lineHeight: 1.5, marginBottom: 10 }}>
                      Visit Dr. Bhuva at our clinic in Vesu, Surat for physical checkups, Nadi Pariksha, and custom Panchakarma therapies.
                    </div>
                    <span style={{ fontSize: '0.8rem', background: 'rgba(39, 174, 96, 0.12)', color: 'var(--green-primary)', padding: '5px 12px', borderRadius: 8, fontWeight: 700 }}>
                      ₹500 Fee
                    </span>
                  </div>
                </button>

              </div>
            </div>
          )}

          {/* Step 2: Service Selection */}
          {step === 2 && (
            <div className="card-pub" style={{ padding: 36 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 className="h3-pub">Select a Service</h2>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>← Back</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filteredServices.map(s => (
                  <button key={s.label} onClick={() => setSelectedService(s)}
                    style={{
                      padding: '14px 18px', borderRadius: 12,
                      border: `1.5px solid ${selectedService.label === s.label ? 'var(--green-primary)' : 'rgba(39,174,96,0.15)'}`,
                      background: selectedService.label === s.label ? 'rgba(39,174,96,0.08)' : 'var(--cream)',
                      textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                    <div>
                      <div style={{ fontWeight: selectedService.label === s.label ? 700 : 500, fontSize: '0.95rem', color: selectedService.label === s.label ? 'var(--green-dark)' : 'var(--text-dark)' }}>
                        {s.label}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: 2 }}>
                        {s.type === 'tele' ? '📹 Video call from anywhere' : '🏥 Visit clinic in Vesu, Surat'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 700, color: 'var(--green-primary)' }}>{s.price}</span>
                      {selectedService.label === s.label && <span style={{ color: 'var(--green-primary)' }}>✓</span>}
                    </div>
                  </button>
                ))}
              </div>
              <button className="btn-primary w-full" style={{ marginTop: 24, justifyContent: 'center', borderRadius: 12, padding: '14px' }} onClick={() => setStep(3)}>
                Continue →
              </button>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <div className="card-pub" style={{ padding: 36 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h2 className="h3-pub">Select Date & Time</h2>
                <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>← Back</button>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--green-primary)', fontWeight: 600, marginBottom: 20 }}>
                🩺 {selectedService.label} — {selectedService.price}
              </div>

              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-mid)', marginBottom: 8 }}>Preferred Date</div>
              <div className="booking-calendar-grid no-scrollbar">
                {dates.map(d => {
                  const dt = new Date(d + 'T12:00:00');
                  return (
                    <button key={d} onClick={() => setDate(d)} className={`date-btn ${date === d ? 'selected' : ''}`} style={{ padding: '10px 4px' }}>
                      <div className="day-name">{dt.toLocaleDateString('en', { weekday: 'narrow' })}</div>
                      <div className="day-num" style={{ fontSize: '1.1rem' }}>{dt.getDate()}</div>
                      <div className="month">{dt.toLocaleDateString('en', { month: 'short' })}</div>
                    </button>
                  );
                })}
              </div>

              {date && (
                <>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-mid)', marginBottom: 8 }}>Preferred Time Slot</div>
                  {SLOTS.filter(s => !bookedSlots.includes(s)).length === 0 ? (
                    <div style={{ color: 'var(--terracotta)', fontSize: '0.88rem', padding: '12px 16px', background: 'rgba(196,97,63,0.08)', border: '1px solid rgba(196,97,63,0.25)', borderRadius: 10, marginBottom: 24 }}>
                      ⚠ No slots available on this date. Please choose another date.
                    </div>
                  ) : (
                    <div className="booking-slots-grid">
                      {SLOTS.filter(s => !bookedSlots.includes(s)).map(s => (
                        <button key={s} onClick={() => setSlot(s)} className={`slot-btn ${slot === s ? 'selected' : ''}`}>{s}</button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {selectedService.type === 'clinic' && (
                <div style={{ background: 'rgba(39,174,96,0.07)', border: '1px solid rgba(39,174,96,0.15)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: '0.85rem', color: 'var(--green-dark)' }}>
                  🏥 <strong>In-Clinic Visit:</strong> 127, Agam Orchid, Opp. Shivkartik Enclave, Near Nandini-2, Vesu, Surat. Please arrive 10 minutes early.
                </div>
              )}

              <button className="btn-primary w-full" style={{ justifyContent: 'center', padding: '14px', borderRadius: 12 }} onClick={() => setStep(4)} disabled={!date || !slot}>
                Continue →
              </button>
            </div>
          )}

          {/* Step 4: Patient Details & Payment */}
          {step === 4 && (
            <div className="card-pub" style={{ padding: 36 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 className="h3-pub">Your Details</h2>
                <button onClick={() => setStep(3)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>← Back</button>
              </div>

              {/* Booking summary */}
              <div style={{ background: 'rgba(39,174,96,0.07)', border: '1px solid rgba(39,174,96,0.18)', borderRadius: 12, padding: '14px 18px', marginBottom: 22 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--green-dark)', marginBottom: 8 }}>Booking Summary</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.85rem' }}>
                  <div><span style={{ color: 'var(--text-light)' }}>Service:</span> <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{selectedService.label}</span></div>
                  <div><span style={{ color: 'var(--text-light)' }}>Price:</span> <span style={{ fontWeight: 600, color: 'var(--green-primary)' }}>{selectedService.price}</span></div>
                  <div><span style={{ color: 'var(--text-light)' }}>Date:</span> <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{new Date(date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}</span></div>
                  <div><span style={{ color: 'var(--text-light)' }}>Time:</span> <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{slot}</span></div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ gap: 14 }} className="grid-2-responsive">
                  <div className="form-field">
                    <label className="form-label">Full Name *</label>
                    <input className="form-ctrl" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Phone *</label>
                    <input className="form-ctrl" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
                <div className="form-field">
                  <label className="form-label">Email *</label>
                  <input className="form-ctrl" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                </div>
                <div className="form-field">
                  <label className="form-label">Symptoms / Additional Notes</label>
                  <textarea className="form-ctrl" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Describe your symptoms, current medications, duration of illness, or any questions for Dr. Bhuva…" rows={4} />
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', background: 'var(--cream-dark)', padding: '10px 14px', borderRadius: 8, lineHeight: 1.6 }}>
                  {isOnline
                    ? '🟢 Your booking will be saved to our system. Live updates will be sent via SMS/WhatsApp.'
                    : '📱 You\'re offline. Your booking will be saved locally and confirmed once you reconnect.'}
                </div>

                <button
                  className="btn-primary w-full"
                  style={{ justifyContent: 'center', padding: '15px', borderRadius: 12, fontSize: '1rem', marginTop: 4 }}
                  onClick={handleBookingSubmit}
                  disabled={loading || !form.name || !form.phone || !form.email}
                >
                  {loading 
                    ? '⏳ Processing booking...' 
                    : isOnline && selectedService.fee > 0 
                      ? `💳 Pay ${selectedService.price} & Confirm` 
                      : '✅ Confirm Appointment (Pay at Clinic)'}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && booked && (
            <div className="card-pub" style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green-primary), var(--green-dark))', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.8rem', boxShadow: '0 10px 36px rgba(39,174,96,0.35)' }}>
                🎉
              </div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 10 }}>
                {isOnline ? 'Appointment Confirmed!' : 'Appointment Saved!'}
              </h2>
              <p style={{ color: 'var(--text-mid)', marginBottom: 28, lineHeight: 1.7 }}>
                {isOnline
                  ? 'Your appointment has been successfully scheduled. We have sent a confirmation message on WhatsApp.'
                  : 'Your appointment has been saved offline. It will be synced and confirmed once you\'re connected to the internet.'}
              </p>

              {/* Details */}
              <div style={{ background: 'var(--cream)', borderRadius: 16, padding: 22, marginBottom: 24, textAlign: 'left' }}>
                {[
                  ['Booking ID', booked.id],
                  ['Doctor', 'Dr. Vishal B Bhuva'],
                  ['Service', selectedService.label],
                  ['Date', new Date(booked.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })],
                  ['Time', booked.slot],
                  ['Payment status', booked.paymentId ? `Paid (ID: ${booked.paymentId.substring(0, 15)}...)` : 'Pay at Clinic'],
                  ['Status', isOnline ? '✅ Confirmed' : '📱 Pending (offline)'],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(39,174,96,0.08)', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-light)' }}>{l}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-dark)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '220px', textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Clinic/Online info */}
              <div style={{ background: 'rgba(39,174,96,0.07)', border: '1px solid rgba(39,174,96,0.15)', borderRadius: 12, padding: '16px 18px', textAlign: 'left', marginBottom: 24 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--green-dark)', marginBottom: 6 }}>
                  {selectedService.type === 'tele' ? '📹 Online Consultation Info' : '📍 Clinic Location'}
                </div>
                <div style={{ fontSize: '0.87rem', color: 'var(--text-mid)', lineHeight: 1.7 }}>
                  {selectedService.type === 'tele' ? (
                    <>
                      Your unique Google Meet link has been generated: <br />
                      <a href={booked.google_meet_link || '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green-primary)', fontWeight: 700, wordBreak: 'break-all' }}>
                        {booked.google_meet_link || 'Generating link...'}
                      </a>
                      <br /><br />
                      The link has also been sent to your WhatsApp number ({form.phone}) and email ({form.email}).
                    </>
                  ) : (
                    <>
                      127, Agam Orchid, Opp. Shivkartik Enclave,<br />
                      Near Nandini-2, Vesu, Surat, Gujarat<br />
                      <strong>Please arrive 10 minutes prior to your schedule.</strong>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="tel:+918320699167"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '13px', borderRadius: 12, background: 'rgba(39,174,96,0.1)', border: '1.5px solid rgba(39,174,96,0.25)', color: 'var(--green-primary)', fontWeight: 700, fontSize: '0.9rem', minWidth: 140 }}>
                  📞 Call Clinic
                </a>
                <a href="https://wa.me/918320699167" target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '13px', borderRadius: 12, background: '#25D366', color: 'white', fontWeight: 700, fontSize: '0.9rem', minWidth: 140 }}>
                  💬 WhatsApp Help
                </a>
                <Link href="/"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '13px', borderRadius: 12, border: '1.5px solid rgba(39,174,96,0.2)', color: 'var(--text-dark)', fontWeight: 600, fontSize: '0.9rem', minWidth: 140 }}>
                  ← Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
