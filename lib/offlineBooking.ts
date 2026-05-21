// lib/offlineBooking.ts
// Offline-first booking utility for Shashwat Ayurveda

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  serviceType: 'clinic' | 'tele';
  date: string;
  slot: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'synced' | 'cancelled';
  createdAt: string;
  synced: boolean;
  google_meet_link?: string | null;
}

const STORAGE_KEY = 'shashwat_bookings';

export function saveBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'synced'>): Booking {
  const newBooking: Booking = {
    ...booking,
    id: `SA-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    synced: false,
  };

  const existing = getBookings();
  existing.push(newBooking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return newBooking;
}

export function getBookings(): Booking[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getPendingCount(): number {
  return getBookings().filter(b => !b.synced).length;
}

export async function syncBookings(): Promise<{ synced: number; failed: number }> {
  const bookings = getBookings();
  const unsynced = bookings.filter(b => !b.synced);
  let synced = 0;
  let failed = 0;

  for (const booking of unsynced) {
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
      if (res.ok) {
        booking.synced = true;
        booking.status = 'confirmed';
        synced++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  // Update storage with synced status
  const all = getBookings();
  const updated = all.map(b => {
    const found = unsynced.find(u => u.id === b.id);
    return found && found.synced ? { ...b, synced: true, status: 'confirmed' as const } : b;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return { synced, failed };
}

export function clearBookings(): void {
  localStorage.removeItem(STORAGE_KEY);
}
