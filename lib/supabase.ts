import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://xyzcompanyplaceholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder.placeholder';

let _supabase: SupabaseClient;
try {
  _supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch {
  // Demo mode — no Supabase credentials configured
  _supabase = createClient('https://xyzcompanyplaceholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder.placeholder');
}
export const supabase = _supabase;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: 'patient' | 'doctor' | 'reception';
          phone: string | null;
          avatar_url: string | null;
          date_of_birth: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
      appointments: {
        Row: {
          id: string;
          patient_id: string;
          doctor_id: string;
          scheduled_at: string;
          duration_minutes: number;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          google_meet_link: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['appointments']['Row']>;
      };
      prescriptions: {
        Row: {
          id: string;
          appointment_id: string;
          patient_id: string;
          doctor_id: string;
          medicines: Medicine[];
          diagnosis: string;
          follow_up_date: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['prescriptions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['prescriptions']['Row']>;
      };
      doctor_profiles: {
        Row: {
          doctor_id: string;
          specialization: string;
          years_of_experience: number;
          qualifications: string[];
          bio: string;
          consultation_fee: number;
          available_days: string[];
        };
        Insert: Database['public']['Tables']['doctor_profiles']['Row'];
        Update: Partial<Database['public']['Tables']['doctor_profiles']['Row']>;
      };
    };
  };
};

export type Medicine = {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
};

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type Prescription = Database['public']['Tables']['prescriptions']['Row'];
export type DoctorProfile = Database['public']['Tables']['doctor_profiles']['Row'];
