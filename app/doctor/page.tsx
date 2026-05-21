'use client';
import PublicNav from '@/components/Navbar';
import Link from 'next/link';

export default function DoctorProfilePage() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <PublicNav />
      <div style={{ paddingTop: 120, paddingBottom: 80 }}>
        <div className="container-pub">
          
          <div className="grid-2-responsive" style={{ gap: 60, alignItems: 'center' }}>
            {/* Left: Image / Portrait */}
            <div style={{ position: 'relative' }}>
              <div style={{ background: 'linear-gradient(145deg, #FDF3E3, #F5E6C8)', borderRadius: 28, padding: 60, boxShadow: '0 30px 80px rgba(61,43,31,0.15)', border: '1px solid rgba(201,150,58,0.2)', textAlign: 'center' }}>
                <div style={{ width: 200, height: 200, borderRadius: '50%', background: 'linear-gradient(145deg, #C9963A, #8B6214)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem', boxShadow: '0 10px 40px rgba(201,150,58,0.3)', border: '6px solid rgba(255,255,255,0.6)' }}>👩‍⚕️</div>
              </div>
              <div style={{ position: 'absolute', bottom: -20, right: -20, background: 'white', padding: '16px 24px', borderRadius: 20, boxShadow: '0 10px 30px rgba(61,43,31,0.1)', border: '1px solid rgba(201,150,58,0.2)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Experience</div>
                <div className="serif" style={{ fontSize: '1.8rem', color: 'var(--gold)', fontWeight: 700 }}>15+ Years</div>
              </div>
            </div>

            {/* Right: Bio */}
            <div>
              <div className="tag-pub">✦ Head Physician</div>
              <h1 className="h1-pub" style={{ marginBottom: 16 }}>Dr. Priya <em style={{ color: 'var(--gold)' }}>Sharma</em></h1>
              <div style={{ fontSize: '1.1rem', color: 'var(--text-mid)', fontWeight: 500, marginBottom: 24 }}>BAMS, MD (Ayurveda), Fellowship in Panchakarma</div>
              
              <p className="p-pub" style={{ marginBottom: 20 }}>
                Dr. Priya Sharma is a globally recognized Ayurvedic physician with over 15 years of clinical experience. She specializes in chronic lifestyle disorders, autoimmune conditions, and traditional Panchakarma therapies.
              </p>
              <p className="p-pub" style={{ marginBottom: 32 }}>
                Her healing philosophy bridges the ancient wisdom of the Charaka Samhita with a modern understanding of physiology, offering a deeply personalized, root-cause approach to health and wellness.
              </p>

              <div style={{ display: 'flex', gap: 16 }}>
                <Link href="/book" className="btn-book">Book Consultation</Link>
              </div>
            </div>
          </div>

          {/* Timeline & Expertise */}
          <div className="grid-2-responsive" style={{ marginTop: 100, gap: 60 }}>
            <div>
              <h2 className="h2-pub" style={{ marginBottom: 32 }}>Education & <em style={{ color: 'var(--sage)' }}>Credentials</em></h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                  { y: '2008 - 2013', t: 'BAMS (Bachelor of Ayurvedic Medicine & Surgery)', d: 'Gujarat Ayurved University, Jamnagar. Graduated with Gold Medal.' },
                  { y: '2014 - 2017', t: 'MD Ayurveda (Internal Medicine)', d: 'Rajiv Gandhi University of Health Sciences, Bangalore. Thesis on gut microbiome and Agni.' },
                  { y: '2018 - 2019', t: 'Fellowship in Panchakarma', d: 'All India Institute of Ayurveda, New Delhi. Advanced clinical training in detox therapies.' },
                  { y: '2020 - Present', t: 'Founder & Head Physician', d: 'AyurVeda Care Digital Clinic, treating patients across 15+ countries.' }
                ].map((e, i) => (
                  <div key={i} style={{ display: 'flex', gap: 20 }}>
                    <div style={{ width: 120, flexShrink: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--gold)', paddingTop: 4 }}>{e.y}</div>
                    <div style={{ flex: 1, paddingBottom: 24, borderBottom: i < 3 ? '1px solid rgba(61,43,31,0.1)' : 'none' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--brown)', marginBottom: 6 }}>{e.t}</div>
                      <div style={{ fontSize: '0.95rem', color: 'var(--text-mid)', lineHeight: 1.6 }}>{e.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="h2-pub" style={{ marginBottom: 32 }}>Areas of <em style={{ color: 'var(--terracotta)' }}>Expertise</em></h2>
              <div className="grid-2" style={{ gap: 20 }}>
                {[
                  { i: '🌿', t: 'Digestive Health', d: 'IBS, Acid Reflux, Gut Microbiome Restoration' },
                  { i: '🧘‍♀️', t: 'Mental Wellness', d: 'Stress, Anxiety, Insomnia, Adrenal Fatigue' },
                  { i: '🌸', t: "Women's Health", d: 'PCOS, Menopause, Hormonal Imbalance' },
                  { i: '🦴', t: 'Joint Care', d: 'Arthritis, Inflammation, Mobility issues' },
                  { i: '✨', t: 'Skin Disorders', d: 'Eczema, Psoriasis, Acne, Allergy' },
                  { i: '🔄', t: 'Metabolic Health', d: 'Weight Management, Thyroid Imbalance' },
                ].map(x => (
                  <div key={x.t} className="card-pub" style={{ padding: '24px' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>{x.i}</div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--brown)', marginBottom: 8 }}>{x.t}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-mid)', lineHeight: 1.5 }}>{x.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
