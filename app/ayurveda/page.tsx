'use client';
import PublicNav from '@/components/Navbar';
import Link from 'next/link';

export default function AyurvedaInfoPage() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <PublicNav />
      <div style={{ paddingTop: 120, paddingBottom: 80 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60, padding: '0 24px' }}>
          <div className="tag-pub" style={{ margin: '0 auto 16px', display: 'inline-flex' }}>✦ The Science of Life</div>
          <h1 className="h1-pub" style={{ maxWidth: 800, margin: '0 auto 20px' }}>
            Understanding <em style={{ color: 'var(--sage)' }}>Ayurveda</em>
          </h1>
          <p className="p-pub" style={{ maxWidth: 600, margin: '0 auto' }}>
            Originating in India over 5,000 years ago, Ayurveda translates to "The Science of Life". It is the world's oldest holistic healing system, focusing on balance between mind, body, and spirit.
          </p>
        </div>

        {/* The Three Doshas */}
        <section className="section-pub" style={{ background: 'white', padding: '80px 0' }}>
          <div className="container-pub">
            <h2 className="h2-pub" style={{ textAlign: 'center', marginBottom: 48 }}>The Three <em style={{ color: 'var(--gold)' }}>Doshas</em></h2>
            <p className="p-pub" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 60px' }}>
              According to Ayurveda, everything in the universe is made of five elements: Space, Air, Fire, Water, and Earth. These elements combine in the human body to form three life forces or energies, called Doshas.
            </p>

            <div className="grid-3-responsive" style={{ gap: 30 }}>
              <div className="card-pub" style={{ borderTop: '4px solid #89CFF0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🌬️</div>
                <h3 className="serif" style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--brown)', marginBottom: 8 }}>Vata <span style={{ fontSize: '1rem', color: 'var(--text-light)', fontWeight: 400 }}>(Air + Space)</span></h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: 16 }}>
                  Controls bodily functions associated with motion, including blood circulation, breathing, and heartbeat.
                </p>
                <div style={{ fontSize: '0.85rem' }}>
                  <strong style={{ color: 'var(--brown)' }}>In Balance:</strong> Creative, energetic, flexible.<br/><br/>
                  <strong style={{ color: 'var(--brown)' }}>Out of Balance:</strong> Anxiety, asthma, heart disease, skin problems.
                </div>
              </div>

              <div className="card-pub" style={{ borderTop: '4px solid #FF7F50' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🔥</div>
                <h3 className="serif" style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--brown)', marginBottom: 8 }}>Pitta <span style={{ fontSize: '1rem', color: 'var(--text-light)', fontWeight: 400 }}>(Fire + Water)</span></h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: 16 }}>
                  Controls the body's metabolic systems, including digestion, absorption, nutrition, and your body's temperature.
                </p>
                <div style={{ fontSize: '0.85rem' }}>
                  <strong style={{ color: 'var(--brown)' }}>In Balance:</strong> Intelligent, strong digestion, good leader.<br/><br/>
                  <strong style={{ color: 'var(--brown)' }}>Out of Balance:</strong> Anger, ulcers, inflammation, heartburn.
                </div>
              </div>

              <div className="card-pub" style={{ borderTop: '4px solid #90EE90' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🌍</div>
                <h3 className="serif" style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--brown)', marginBottom: 8 }}>Kapha <span style={{ fontSize: '1rem', color: 'var(--text-light)', fontWeight: 400 }}>(Earth + Water)</span></h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: 16 }}>
                  Controls growth in the body. It supplies water to all body parts, moisturizes the skin, and maintains the immune system.
                </p>
                <div style={{ fontSize: '0.85rem' }}>
                  <strong style={{ color: 'var(--brown)' }}>In Balance:</strong> Calm, loving, strong immunity.<br/><br/>
                  <strong style={{ color: 'var(--brown)' }}>Out of Balance:</strong> Greed, obesity, depression, sinus congestion.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Treatment Approach */}
        <section className="section-pub">
          <div className="container-pub">
            <div className="grid-2-responsive" style={{ gap: 60, alignItems: 'center' }}>
              <div>
                <h2 className="h2-pub" style={{ marginBottom: 24 }}>The <em style={{ color: 'var(--terracotta)' }}>Healing</em> Process</h2>
                <p className="p-pub" style={{ marginBottom: 20 }}>
                  Ayurvedic treatment does not suppress symptoms. Instead, it aims to eliminate the root impurities, reduce symptoms, increase resistance to disease, and reduce worry.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 32 }}>
                  {[
                    { title: '1. Prakriti Analysis', desc: 'Understanding your unique mind-body constitution during the initial consultation.' },
                    { title: '2. Root Cause Identification', desc: 'Finding the source of the Dosha imbalance (Vikriti).' },
                    { title: '3. Aahar (Diet)', desc: 'Customized dietary recommendations based on your dosha.' },
                    { title: '4. Vihar (Lifestyle)', desc: 'Daily routines (Dinacharya) and seasonal regimens (Ritucharya).' },
                    { title: '5. Aushadhi (Herbs)', desc: 'Personalized herbal prescriptions to gently restore balance.' }
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 16, background: 'rgba(201,150,58,0.05)', padding: '16px 20px', borderRadius: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--brown)', marginBottom: 4 }}>{s.title.substring(3)}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-mid)' }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ background: 'var(--sage)', borderRadius: 30, padding: 40, color: 'white', boxShadow: '0 20px 60px rgba(92,122,78,0.2)' }}>
                  <h3 className="serif" style={{ fontSize: '2rem', marginBottom: 20 }}>"When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need."</h3>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>— Ancient Ayurvedic Proverb</div>
                </div>
                <div style={{ position: 'absolute', bottom: -30, left: -30, background: 'var(--gold)', padding: 24, borderRadius: 20, color: 'white', width: '80%' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: 8 }}>Start Your Journey</h4>
                  <p style={{ fontSize: '0.85rem', marginBottom: 16, opacity: 0.9 }}>Discover your dosha and get a personalized healing plan from Dr. Sharma.</p>
                  <Link href="/book" style={{ display: 'inline-block', background: 'white', color: 'var(--gold)', padding: '10px 20px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700 }}>Book Consultation</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
