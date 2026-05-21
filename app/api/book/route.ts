// app/api/book/route.ts
// Server-side route handler for Shashwat Ayurveda bookings

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendWhatsAppConfirmation } from '@/lib/whatsapp';

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, phone, email, service, serviceType, date, slot, notes, paymentId, google_meet_link } = body;

    if (!name || !phone || !email || !service || !date || !slot) {
      return NextResponse.json(
        { success: false, error: 'Missing required booking fields (name, phone, email, service, date, slot).' },
        { status: 400 }
      );
    }

    console.log(`[API/BOOK] Processing booking ${id} for ${name} (${serviceType})`);

    // Check if Supabase is in Demo Mode
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isDemoMode = !supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL_HERE';

    let dbSyncSuccess = false;
    let dbErrorMessage = '';

    if (!isDemoMode) {
      try {
        console.log('[API/BOOK] Supabase credentials detected. Attempting database insertion...');
        
        // Step A: Check if a user session is active, or use guest booking flow.
        // NOTE: In production, user registration is handled via Supabase Auth.
        // For public visitor/guest bookings, RLS policies require a authenticated user.
        // We will attempt to insert if permissions allow, or log the constraint.
        
        // 1. Try to find if a patient profile exists
        // (This will only work if RLS allows or if the user is authenticated in the session)
        const { data: profiles, error: profileErr } = await supabase
          .from('profiles')
          .select('id')
          .eq('phone', phone)
          .limit(1);

        let patientId: string | null = null;
        if (profiles && profiles.length > 0) {
          patientId = profiles[0].id;
        }

        // 2. Fetch a doctor profile to associate the appointment with
        const { data: doctors, error: docErr } = await supabase
          .from('doctor_profiles')
          .select('doctor_id')
          .limit(1);

        const doctorId = doctors && doctors.length > 0 
          ? doctors[0].doctor_id 
          : '00000000-0000-0000-0000-000000000000'; // Default fallback UUID

        if (patientId) {
          // 3. Create the appointment
          const time24h = parseSlotTo24H(slot);
          const scheduledAt = new Date(`${date}T${time24h}`).toISOString();
          
          const { error: apptErr } = await supabase
            .from('appointments')
            .insert({
              patient_id: patientId,
              doctor_id: doctorId,
              scheduled_at: scheduledAt,
              duration_minutes: 30,
              status: 'pending',
              google_meet_link: google_meet_link || null,
              notes: `[Service: ${service}] [Payment ID: ${paymentId || 'None'}] ${notes || ''}`,
            });

          if (!apptErr) {
            dbSyncSuccess = true;
          } else {
            console.warn('[API/BOOK] Appointment insertion failed:', apptErr.message);
            dbErrorMessage = apptErr.message;
          }
        } else {
          console.warn('[API/BOOK] No existing patient profile found for phone:', phone);
          dbErrorMessage = 'Patient profile not found. Guest bookings require user registration first.';
        }
      } catch (err: any) {
        console.error('[API/BOOK] Supabase operation threw error:', err);
        dbErrorMessage = err.message;
      }
    } else {
      console.log('[API/BOOK] Supabase is in Demo Mode. Skipping DB insert.');
    }

    // Step B: Trigger WhatsApp notification (async background flow)
    const waResponse = await sendWhatsAppConfirmation({
      phone,
      patientName: name,
      serviceName: service,
      serviceType,
      date,
      slot,
      bookingId: id,
      meetLink: google_meet_link || (serviceType === 'tele' ? `https://meet.google.com/xyz-demo-meet` : null)
    });

    console.log('[API/BOOK] WhatsApp trigger result:', waResponse);

    return NextResponse.json({
      success: true,
      bookingId: id,
      syncedToDb: dbSyncSuccess,
      dbError: dbErrorMessage || undefined,
      whatsappStatus: waResponse.success ? 'sent' : 'failed',
      whatsappError: waResponse.error || undefined,
      message: 'Booking request processed successfully.'
    });

  } catch (error: any) {
    console.error('[API/BOOK] Critical handler error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
