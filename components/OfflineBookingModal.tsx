'use client';
import { useState, useEffect } from 'react';
import { saveBooking } from '@/lib/offlineBooking';
import { processRazorpayPayment } from '@/lib/razorpay';

const SERVICES = [
  // Clinic / Offline services
  { label: 'In-Clinic Ayurved Consultation (₹500)', value: 'In Clinic Ayurved Consultation', type: 'clinic' as const, fee: 500 },
  { label: 'Panchakarma Therapy (₹1500)', value: 'Panchkarma', type: 'clinic' as const, fee: 1500 },
  { label: 'Shirodhara (₹1200)', value: 'Shirodhara', type: 'clinic' as const, fee: 1200 },
  { label: 'Suvarnaprashan (Children) (₹300)', value: 'Suvarnaprashan Camp', type: 'clinic' as const, fee: 300 },
  { label: 'Ayurvedic Immunization (₹400)', value: 'Ayurvedic Immunization', type: 'clinic' as const, fee: 400 },
  { label: 'Akshi-Tarpan (Eye Care) (₹600)', value: 'Akshi-Tarpan', type: 'clinic' as const, fee: 600 },
  { label: 'Karnapuran (Ear Care) (₹400)', value: 'Karnapuran', type: 'clinic' as const, fee: 400 },

  // Tele / Online services
  { label: 'Tele/Video Consultation (₹800)', value: 'Tele/Video Consultation', type: 'tele' as const, fee: 800 },
  { label: 'Online Diet & Lifestyle Plan (₹1000)', value: 'Online Diet & Lifestyle Plan', type: 'tele' as const, fee: 1000 },
  { label: 'Online Chronic Disease Care (₹1200)', value: 'Online Chronic Disease Care', type: 'tele' as const, fee: 1200 },
];

const SLOTS = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM'];

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

interface Props {
  onClose: () => void;
}

export default function OfflineBookingModal({ onClose }: Props) {
  const [isOnline, setIsOnline] = useState(true);
  const [step, setStep] = useState(1);
  const [consultationType, setConsultationType] = useState<'clinic' | 'tele' | ''>('');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });
  const [booked, setBooked] = useState<{ id: string; date: string; slot: string; paymentId?: string | null } | null>(null);
  const [loading, setLoading] = useState(false);
  const dates = getDates();

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const selectType = (type: 'clinic' | 'tele') => {
    setConsultationType(type);
    const firstService = SERVICES.find(s => s.type === type) || SERVICES[0];
    setSelectedService(firstService);
    setStep(2);
  };

  const handleBookingSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      alert('Please fill out all required fields.');
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
      // Offline or free booking - bypass payment
      doBook(null);
    }
  };

  const doBook = async (paymentId: string | null) => {
    setLoading(true);
    try {
      const booking = saveBooking({
        name: form.name,
        phone: form.phone,
        email: form.email,
        service: selectedService.value,
        serviceType: selectedService.type,
        date,
        slot,
        notes: form.notes + (paymentId ? ` [Payment ID: ${paymentId}]` : ''),
        status: 'pending',
      });

      // Attempt online sync if connected
      if (isOnline) {
        try {
          await fetch('/api/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...booking, paymentId }),
          });
        } catch {
          // Saved offline, will sync later
        }
      }

      setBooked({ id: booking.id, date, slot, paymentId });
      setStep(5);
    } catch (err) {
      console.error('Error saving booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const canConfirm = form.name.trim() && form.phone.trim() && form.email.trim();

  // Filter services by consultation type
  const filteredServices = SERVICES.filter(s => s.type === consultationType);

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="modal-title">Book Appointment</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: 2 }}>
              Dr. Vishal B Bhuva · Shashwat Ayurveda
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Online/Offline badge */}
        <div className={isOnline ? 'online-badge' : 'offline-badge'} style={{ marginBottom: 20 }}>
          {isOnline ? '🟢 Online — Instant Booking & Payment Portal Active' : '📱 Offline — Bookings will sync when connected'}
        </div>

        {/* Progress steps */}
        {step < 5 && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 4 }}>
            {['Type', 'Service', 'Date & Time', 'Details'].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 3 ? 1 : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                  <div className={`step-circle ${step > i + 1 ? 'step-done' : step === i + 1 ? 'step-active' : 'step-inactive'}`}
                    style={{ width: 30, height: 30, fontSize: '0.78rem' }}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: step === i + 1 ? 600 : 400, color: step >= i + 1 ? 'var(--text-dark)' : 'var(--text-light)' }}>{l}</span>
                </div>
                {i < 3 && <div className="step-line" style={{ background: step > i + 1 ? 'var(--green-primary)' : 'rgba(39,174,96,0.15)', margin: '0 8px' }} />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Type Selection (Online/Offline) */}
        {step === 1 && (
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 16 }}>Select Appointment Type</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              {/* Online Option */}
              <button 
                onClick={() => selectType('tele')}
                style={{
                  padding: '20px 18px', borderRadius: 16,
                  border: '1.5px solid rgba(39, 174, 96, 0.15)',
                  background: 'var(--cream)',
                  textAlign: 'left', cursor: 'pointer', transition: 'all 0.25s',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                }}
                className="rzp-btn"
              >
                <div style={{ fontSize: '2.2rem', padding: '8px', background: 'rgba(33, 150, 243, 0.08)', borderRadius: 12, flexShrink: 0 }}>📹</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: 4 }}>Online Video Consultation</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-mid)', lineHeight: 1.45, marginBottom: 8 }}>
                    Consult from the comfort of your home. Get digital prescriptions & diet charts.
                  </div>
                  <span style={{ fontSize: '0.76rem', background: 'rgba(33, 150, 243, 0.12)', color: '#1976D2', padding: '4px 10px', borderRadius: 8, fontWeight: 700 }}>
                    ₹800 Fee
                  </span>
                </div>
              </button>

              {/* Offline Option */}
              <button 
                onClick={() => selectType('clinic')}
                style={{
                  padding: '20px 18px', borderRadius: 16,
                  border: '1.5px solid rgba(39, 174, 96, 0.15)',
                  background: 'var(--cream)',
                  textAlign: 'left', cursor: 'pointer', transition: 'all 0.25s',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                }}
                className="rzp-btn"
              >
                <div style={{ fontSize: '2.2rem', padding: '8px', background: 'rgba(39, 174, 96, 0.08)', borderRadius: 12, flexShrink: 0 }}>🏥</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: 4 }}>In-Clinic Consultation / Therapy</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-mid)', lineHeight: 1.45, marginBottom: 8 }}>
                    Visit our hospital in Vesu, Surat for personal checkup and specialized Panchakarma therapies.
                  </div>
                  <span style={{ fontSize: '0.76rem', background: 'rgba(39, 174, 96, 0.12)', color: 'var(--green-primary)', padding: '4px 10px', borderRadius: 8, fontWeight: 700 }}>
                    ₹500 Fee
                  </span>
                </div>
              </button>

            </div>
          </div>
        )}

        {/* Step 2: Service Selection */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--text-dark)' }}>Select a Service</h3>
              <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500 }}>← Back</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
              {filteredServices.map(s => (
                <button key={s.value} onClick={() => setSelectedService(s)}
                  style={{
                    padding: '12px 16px', borderRadius: 12,
                    border: `1.5px solid ${selectedService.value === s.value ? 'var(--green-primary)' : 'rgba(39,174,96,0.15)'}`,
                    background: selectedService.value === s.value ? 'rgba(39,174,96,0.08)' : 'var(--cream)',
                    textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: selectedService.value === s.value ? 600 : 400, color: selectedService.value === s.value ? 'var(--green-primary)' : 'var(--text-dark)' }}>
                    {s.label}
                  </span>
                  <span style={{ fontSize: '0.75rem', background: s.type === 'tele' ? 'rgba(33,150,243,0.1)' : 'rgba(39,174,96,0.1)', color: s.type === 'tele' ? '#1976D2' : 'var(--green-primary)', padding: '3px 8px', borderRadius: 8, fontWeight: 600 }}>
                    {s.type === 'tele' ? '📹 Video' : '🏥 Clinic'}
                  </span>
                </button>
              ))}
            </div>

            <button className="btn-primary w-full" style={{ marginTop: 20, justifyContent: 'center', borderRadius: 12 }} onClick={() => setStep(3)}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--text-dark)' }}>Select Date & Time</h3>
              <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500 }}>← Back</button>
            </div>

            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-mid)', marginBottom: 8 }}>Preferred Date</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 20 }}>
              {dates.map(d => {
                const dt = new Date(d + 'T12:00:00');
                return (
                  <button key={d} onClick={() => setDate(d)} className={`date-btn ${date === d ? 'selected' : ''}`}
                    style={{ padding: '10px 4px' }}>
                    <div className="day-name">{dt.toLocaleDateString('en', { weekday: 'narrow' })}</div>
                    <div className="day-num" style={{ fontSize: '1.1rem' }}>{dt.getDate()}</div>
                    <div className="month">{dt.toLocaleDateString('en', { month: 'short' })}</div>
                  </button>
                );
              })}
            </div>

            {date && (
              <>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-mid)', marginBottom: 8 }}>Preferred Time</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20, maxHeight: '160px', overflowY: 'auto' }}>
                  {SLOTS.map(s => (
                    <button key={s} onClick={() => setSlot(s)} className={`slot-btn ${slot === s ? 'selected' : ''}`}>{s}</button>
                  ))}
                </div>
              </>
            )}

            <button className="btn-primary w-full" style={{ justifyContent: 'center', borderRadius: 12 }} onClick={() => setStep(4)} disabled={!date || !slot}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 4: Details & Payment */}
        {step === 4 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--text-dark)' }}>Your Details</h3>
              <button onClick={() => setStep(3)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500 }}>← Back</button>
            </div>

            {/* Summary */}
            <div style={{ background: 'rgba(39,174,96,0.07)', border: '1px solid rgba(39,174,96,0.18)', borderRadius: 10, padding: '12px 14px', marginBottom: 18, fontSize: '0.85rem', color: 'var(--green-dark)', fontWeight: 500 }}>
              📅 {new Date(date + 'T12:00:00').toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })} at {slot}
              <br />
              🩺 {selectedService.label}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-field">
                  <label className="form-label">Full Name *</label>
                  <input className="form-ctrl" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
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
                <label className="form-label">Symptoms / Notes</label>
                <textarea className="form-ctrl" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Describe your symptoms or any questions for the doctor…" rows={3} />
              </div>
              
              <button className="btn-primary w-full" style={{ justifyContent: 'center', borderRadius: 12, marginTop: 4, padding: '14px' }}
                onClick={handleBookingSubmit} disabled={loading || !canConfirm}>
                {loading 
                  ? '⏳ Processing...' 
                  : isOnline && selectedService.fee > 0 
                    ? `💳 Pay ₹${selectedService.fee} & Confirm` 
                    : '✅ Confirm Appointment (Pay at Clinic)'}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && booked && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--green-primary), var(--green-dark))',
              margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.2rem', boxShadow: '0 8px 28px rgba(39,174,96,0.3)',
            }}>🎉</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 8 }}>
              Appointment Booked!
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-mid)', marginBottom: 20, lineHeight: 1.6 }}>
              {isOnline 
                ? 'Your appointment is confirmed. You will receive a notification on WhatsApp shortly.' 
                : 'Saved offline. Your booking will sync automatically once connected.'}
            </p>

            <div style={{ background: 'var(--cream)', borderRadius: 14, padding: '16px 20px', textAlign: 'left', marginBottom: 20 }}>
              {[
                ['Booking ID', booked.id],
                ['Doctor', 'Dr. Vishal B Bhuva'],
                ['Date', new Date(booked.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })],
                ['Time', booked.slot],
                ['Service', selectedService.label],
                ['Payment status', booked.paymentId ? `Paid (ID: ${booked.paymentId.substring(0, 15)}...)` : 'Pay at Clinic'],
                ['Status', isOnline ? 'Confirmed' : 'Pending (offline)'],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(39,174,96,0.08)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-light)' }}>{l}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-dark)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px', textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Clinic info */}
            <div style={{ background: 'rgba(39,174,96,0.07)', border: '1px solid rgba(39,174,96,0.15)', borderRadius: 12, padding: '14px 16px', textAlign: 'left', marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--green-dark)', marginBottom: 6 }}>{selectedService.type === 'tele' ? '📹 Online Consultation Info' : '📍 Clinic Location'}</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-mid)', lineHeight: 1.6 }}>
                {selectedService.type === 'tele' ? (
                  <>
                    A Google Meet video link will be sent to your email and WhatsApp number prior to the slot. Please be ready 5 mins before.
                  </>
                ) : (
                  <>
                    127, Agam Orchid, Opp. Shivkartik Enclave,<br/>
                    Near Nandini-2, Vesu, Surat, Gujarat<br/>
                    📞 +91-8320699167
                  </>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <a href="tel:+918320699167" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px', borderRadius: 10, border: '1.5px solid rgba(39,174,96,0.25)', color: 'var(--green-primary)', fontWeight: 600, fontSize: '0.88rem' }}>
                📞 Call Clinic
              </a>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', borderRadius: 10, padding: '12px' }} onClick={onClose}>
                Done ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
