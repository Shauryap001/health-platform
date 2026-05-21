export type StaffRole = 'doctor' | 'reception' | 'patient';
export interface StaffUser { email: string; name: string; role: StaffRole; avatar: string; }

const ACCOUNTS: Record<string, { password: string; user: StaffUser }> = {
  'admin@gmail.com': { password: '1234567890', user: { email: 'admin@gmail.com', name: 'Dr. Priya Sharma', role: 'doctor', avatar: '👩‍⚕️' } },
  '01@gmail.com': { password: '123456789', user: { email: '01@gmail.com', name: 'Meena Iyer', role: 'reception', avatar: '🏥' } },
  'riya@gmail.com': { password: 'password123', user: { email: 'riya@gmail.com', name: 'Riya Patel', role: 'patient', avatar: '👩' } },
};

export function staffLogin(email: string, password: string): StaffUser | null {
  const acc = ACCOUNTS[email.toLowerCase()];
  if (!acc || acc.password !== password) return null;
  return acc.user;
}
export function saveSession(user: StaffUser) { if (typeof window !== 'undefined') localStorage.setItem('staff_user', JSON.stringify(user)); }
export function getSession(): StaffUser | null {
  if (typeof window === 'undefined') return null;
  try { const r = localStorage.getItem('staff_user'); return r ? JSON.parse(r) : null; } catch { return null; }
}
export function clearSession() { if (typeof window !== 'undefined') localStorage.removeItem('staff_user'); }
