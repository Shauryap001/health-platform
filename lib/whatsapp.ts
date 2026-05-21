// lib/whatsapp.ts
// WhatsApp Automation integration for Shashwat Ayurveda bookings

export interface WhatsAppNotificationPayload {
  phone: string;
  patientName: string;
  serviceName: string;
  serviceType: 'clinic' | 'tele';
  date: string;
  slot: string;
  bookingId: string;
  meetLink?: string | null;
}

/**
 * Sends a WhatsApp notification to the patient confirming their appointment.
 * Supports Meta's official WhatsApp Cloud API and falls back to logging in demo mode.
 * 
 * --- HOW TO CONNECT WHATSAPP AUTOMATION ---
 * 1. Go to the Meta for Developers dashboard (developers.facebook.com) and create an App.
 * 2. Add the "WhatsApp" product to your App.
 * 3. Set up a WhatsApp Business Account (WABA) and add a test/verified phone number.
 * 4. Obtain the following credentials:
 *    - WHATSAPP_PHONE_NUMBER_ID
 *    - WHATSAPP_ACCESS_TOKEN (Generate a permanent system user token)
 * 5. Create a Message Template in your WhatsApp Business Manager named "booking_confirmation".
 *    - Example Template Body:
 *      "Namaste {{1}}! Your appointment at Shashwat Ayurveda for {{2}} ({{3}}) has been scheduled for {{4}} at {{5}}. Booking ID: {{6}}. {{7}} Thank you for choosing us."
 *      (where {{7}} is either your Google Meet link or clinic directions).
 * 6. Add the credentials to your .env.local:
 *    - WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
 *    - WHATSAPP_ACCESS_TOKEN=your_permanent_access_token
 * ------------------------------------------
 */
export async function sendWhatsAppConfirmation(payload: WhatsAppNotificationPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  // Format phone number (Meta WhatsApp API requires country code without '+' or leading zeros, e.g. 91XXXXXXXXXX)
  // Let's strip special characters and prepend 91 (India) if it's 10 digits
  let formattedPhone = payload.phone.replace(/\D/g, '');
  if (formattedPhone.length === 10) {
    formattedPhone = `91${formattedPhone}`;
  }

  const isDemoMode = !phoneId || !accessToken || phoneId.includes('YOUR_') || accessToken.includes('YOUR_');

  const displayDate = new Date(payload.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const locationOrMeetText = payload.serviceType === 'tele' 
    ? `Video Join Link: ${payload.meetLink || 'Will be sent prior to the session'}`
    : 'Clinic Location: Shashwat Ayurveda Clinic, Sector 5, HSR Layout, Bengaluru';

  if (isDemoMode) {
    console.log('\n======================================================');
    console.log('📢 WHATSAPP SIMULATED NOTIFICATION (DEMO MODE ACTIVE)');
    console.log(`To: ${formattedPhone} (${payload.patientName})`);
    console.log(`Template: booking_confirmation`);
    console.log('Template Parameters:');
    console.log(`  1. Name: ${payload.patientName}`);
    console.log(`  2. Service: ${payload.serviceName}`);
    console.log(`  3. Type: ${payload.serviceType === 'tele' ? 'Online Video' : 'In-Clinic Visit'}`);
    console.log(`  4. Date: ${displayDate}`);
    console.log(`  5. Slot: ${payload.slot}`);
    console.log(`  6. Booking ID: ${payload.bookingId}`);
    console.log(`  7. Meet Link / Clinic Info: ${locationOrMeetText}`);
    console.log('======================================================\n');
    
    return { success: true, messageId: `msg_sim_${Math.random().toString(36).substring(2, 10)}` };
  }

  try {
    const url = `https://graph.facebook.com/v17.0/${phoneId}/messages`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'template',
        template: {
          name: 'booking_confirmation',
          language: {
            code: 'en_US'
          },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: payload.patientName },
                { type: 'text', text: payload.serviceName },
                { type: 'text', text: payload.serviceType === 'tele' ? 'Online Video' : 'In-Clinic Visit' },
                { type: 'text', text: displayDate },
                { type: 'text', text: payload.slot },
                { type: 'text', text: payload.bookingId },
                { type: 'text', text: locationOrMeetText }
              ]
            }
          ]
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('WhatsApp API error response:', data);
      return { 
        success: false, 
        error: data?.error?.message || `HTTP error ${response.status}` 
      };
    }

    return { 
      success: true, 
      messageId: data?.messages?.[0]?.id 
    };
  } catch (error: any) {
    console.error('WhatsApp API request failed:', error);
    return { 
      success: false, 
      error: error?.message || 'Network request failed' 
    };
  }
}
