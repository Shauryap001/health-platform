// lib/razorpay.ts
// Razorpay client integration and fallback simulator for Shashwat Ayurveda

export interface RazorpayOptions {
  key?: string;
  amount: number; // in paise (e.g. 50000 for Rs. 500)
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color: string;
  };
  handler: (response: any) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function processRazorpayPayment(options: {
  amount: number; // in INR (e.g. 500)
  serviceName: string;
  name: string;
  email: string;
  phone: string;
  onSuccess: (paymentId: string) => void;
  onFailure: (error: string) => void;
}) {
  const amountInPaise = options.amount * 100;
  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const isDemoMode = !razorpayKey || razorpayKey.includes('YOUR_') || razorpayKey === '';

  if (isDemoMode) {
    // Launch a premium custom payment simulator modal
    createPaymentSimulator({
      amount: options.amount,
      serviceName: options.serviceName,
      name: options.name,
      email: options.email,
      phone: options.phone,
      onSuccess: options.onSuccess,
      onFailure: options.onFailure,
    });
    return;
  }

  const loaded = await loadRazorpayScript();
  if (!loaded) {
    options.onFailure('Failed to load payment gateway script. Please check your internet connection.');
    return;
  }

  try {
    const rzpOptions: RazorpayOptions = {
      key: razorpayKey,
      amount: amountInPaise,
      currency: 'INR',
      name: 'Shashwat Ayurveda',
      description: options.serviceName,
      image: '/logo-icon.png', // Add local logo if available
      prefill: {
        name: options.name,
        email: options.email,
        contact: options.phone,
      },
      theme: {
        color: '#27AE60', // Primary Green
      },
      handler: function (response: any) {
        if (response.razorpay_payment_id) {
          options.onSuccess(response.razorpay_payment_id);
        } else {
          options.onFailure('Payment response was incomplete.');
        }
      },
      modal: {
        ondismiss: function () {
          options.onFailure('Payment cancelled by user.');
        },
      },
    };

    const rzp = new (window as any).Razorpay(rzpOptions);
    rzp.open();
  } catch (err: any) {
    options.onFailure(err.message || 'An error occurred during payment initialization.');
  }
}

// Custom simulated UI when Razorpay keys are not configured
function createPaymentSimulator(params: {
  amount: number;
  serviceName: string;
  name: string;
  email: string;
  phone: string;
  onSuccess: (paymentId: string) => void;
  onFailure: (error: string) => void;
}) {
  if (typeof document === 'undefined') return;

  // Create backdrop container
  const overlay = document.createElement('div');
  overlay.id = 'razorpay-simulator';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(13, 31, 13, 0.65)'; // deep backdrop
  overlay.style.backdropFilter = 'blur(10px)';
  overlay.style.zIndex = '9999';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.fontFamily = "'DM Sans', sans-serif";

  // Create modal container
  const modal = document.createElement('div');
  modal.style.width = '100%';
  modal.style.maxWidth = '440px';
  modal.style.backgroundColor = '#FFFFFF';
  modal.style.borderRadius = '24px';
  modal.style.boxShadow = '0 30px 80px rgba(13, 31, 13, 0.25)';
  modal.style.border = '1px solid rgba(39, 174, 96, 0.15)';
  modal.style.overflow = 'hidden';
  modal.style.margin = '16px';
  modal.style.animation = 'rzp-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

  // Inject CSS styles for animations and premium details
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes rzp-fade-in {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .rzp-btn {
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .rzp-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(39,174,96,0.15);
    }
    .rzp-btn:active {
      transform: translateY(0);
    }
    .rzp-cancel:hover {
      background-color: #F9FAFB !important;
    }
  `;
  document.head.appendChild(styleTag);

  modal.innerHTML = `
    <!-- Modal Header -->
    <div style="background: linear-gradient(135deg, #1B5E20, #27AE60); padding: 24px; color: white; position: relative;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.15); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; border: 1px solid rgba(255,255,255,0.2);">
          🌿
        </div>
        <div>
          <div style="font-weight: 700; font-size: 1.1rem; letter-spacing: -0.01em;">Shashwat Ayurveda</div>
          <div style="font-size: 0.75rem; opacity: 0.8; font-weight: 500;">Payment Gateway (Simulator)</div>
        </div>
      </div>
      <button id="rzp-sim-close" style="position: absolute; top: 24px; right: 24px; background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; opacity: 0.8; transition: opacity 0.2s;">×</button>
    </div>

    <!-- Modal Content -->
    <div style="padding: 24px;">
      <!-- Billing Info -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px solid #ECEFF1; margin-bottom: 20px;">
        <div>
          <div style="font-size: 0.8rem; color: #78909C; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Consultation / Service</div>
          <div style="font-weight: 600; color: #1E293B; font-size: 0.95rem; margin-top: 2px;">${params.serviceName}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.8rem; color: #78909C; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Amount</div>
          <div style="font-weight: 800; color: #27AE60; font-size: 1.3rem; margin-top: 2px;">₹${params.amount}</div>
        </div>
      </div>

      <!-- Prefill info -->
      <div style="background: #FAFAF5; border: 1px solid rgba(39, 174, 96, 0.1); border-radius: 12px; padding: 14px; margin-bottom: 20px; font-size: 0.85rem; line-height: 1.5;">
        <div style="color: #4A5568; margin-bottom: 4px;"><strong>Patient:</strong> ${params.name}</div>
        <div style="color: #4A5568; margin-bottom: 4px;"><strong>Email:</strong> ${params.email}</div>
        <div style="color: #4A5568;"><strong>Phone:</strong> ${params.phone}</div>
      </div>

      <!-- Notice -->
      <div style="background: #FFF8E7; border: 1px solid rgba(201, 150, 58, 0.2); border-radius: 12px; padding: 14px; margin-bottom: 24px; font-size: 0.8rem; color: #6B4226; display: flex; gap: 8px; align-items: flex-start; line-height: 1.45;">
        <span style="font-size: 1rem;">ℹ️</span>
        <div>
          <strong>Demo Mode Active:</strong> Razorpay API Key is not set in <code style="background: rgba(0,0,0,0.05); padding: 2px 4px; border-radius: 4px;">.env.local</code>. You can test success and failure scenarios below.
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button id="rzp-sim-success" class="rzp-btn" style="background: #27AE60; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 0.95rem; width: 100%;">
          Simulate Successful Payment
        </button>
        
        <button id="rzp-sim-fail" class="rzp-btn" style="background: #FFF5F5; color: #E53E3E; border: 1px solid #FED7D7; padding: 12px; border-radius: 12px; font-weight: 600; font-size: 0.9rem; width: 100%;">
          Simulate Declined Payment
        </button>

        <button id="rzp-sim-cancel" class="rzp-btn rzp-cancel" style="background: transparent; color: #718096; border: 1px solid #E2E8F0; padding: 12px; border-radius: 12px; font-weight: 500; font-size: 0.9rem; width: 100%; margin-top: 4px;">
          Cancel Booking
        </button>
      </div>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Close helper
  const destroy = () => {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.25s ease';
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    }, 250);
  };

  // Bind Events
  document.getElementById('rzp-sim-close')?.addEventListener('click', () => {
    destroy();
    params.onFailure('Cancelled by user.');
  });

  document.getElementById('rzp-sim-cancel')?.addEventListener('click', () => {
    destroy();
    params.onFailure('Payment cancelled.');
  });

  document.getElementById('rzp-sim-success')?.addEventListener('click', () => {
    // Show spinner in button
    const successBtn = document.getElementById('rzp-sim-success') as HTMLButtonElement;
    if (successBtn) {
      successBtn.disabled = true;
      successBtn.innerHTML = '<span style="display:inline-block; width:16px; height:16px; border:2px solid white; border-top-color:transparent; border-radius:50%; animation:rzp-spin 0.6s linear infinite; margin-right:8px; vertical-align:middle;"></span>Processing...';
      
      // Inject spin animation
      const spinStyle = document.createElement('style');
      spinStyle.textContent = `@keyframes rzp-spin { to { transform: rotate(360deg); } }`;
      document.head.appendChild(spinStyle);
    }

    setTimeout(() => {
      destroy();
      const mockPaymentId = `pay_sim_${Math.random().toString(36).substring(2, 16)}`;
      params.onSuccess(mockPaymentId);
    }, 1200);
  });

  document.getElementById('rzp-sim-fail')?.addEventListener('click', () => {
    const failBtn = document.getElementById('rzp-sim-fail') as HTMLButtonElement;
    if (failBtn) {
      failBtn.disabled = true;
      failBtn.innerHTML = 'Declining...';
    }
    setTimeout(() => {
      destroy();
      params.onFailure('Payment declined by simulating gateway.');
    }, 800);
  });
}
