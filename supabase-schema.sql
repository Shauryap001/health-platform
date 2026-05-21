-- =============================================
-- AYURVEDA CARE PLATFORM — SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'reception')),
  phone TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctor profiles table
CREATE TABLE IF NOT EXISTS doctor_profiles (
  doctor_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  specialization TEXT DEFAULT 'Ayurvedic Medicine',
  years_of_experience INTEGER DEFAULT 0,
  qualifications TEXT[] DEFAULT '{}',
  bio TEXT DEFAULT '',
  consultation_fee NUMERIC DEFAULT 500,
  available_days TEXT[] DEFAULT ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday'],
  available_slots JSONB DEFAULT '["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30"]'
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  google_meet_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  medicines JSONB NOT NULL DEFAULT '[]',
  diagnosis TEXT NOT NULL,
  follow_up_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: users can view their own, doctors/reception can view all
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (
  auth.uid() = id OR
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('doctor', 'reception'))
);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Appointments: patients see their own, doctors/reception see all
CREATE POLICY "appointments_select" ON appointments FOR SELECT USING (
  patient_id = auth.uid() OR
  doctor_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'reception')
);
CREATE POLICY "appointments_insert" ON appointments FOR INSERT WITH CHECK (
  patient_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('reception', 'doctor'))
);
CREATE POLICY "appointments_update" ON appointments FOR UPDATE USING (
  doctor_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'reception')
);

-- Prescriptions: patients see their own, doctors see all their prescriptions
CREATE POLICY "prescriptions_select" ON prescriptions FOR SELECT USING (
  patient_id = auth.uid() OR doctor_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'reception')
);
CREATE POLICY "prescriptions_insert" ON prescriptions FOR INSERT WITH CHECK (
  doctor_id = auth.uid()
);

-- Doctor profiles: anyone can view
CREATE POLICY "doctor_profiles_select" ON doctor_profiles FOR SELECT USING (true);
CREATE POLICY "doctor_profiles_insert" ON doctor_profiles FOR INSERT WITH CHECK (
  doctor_id = auth.uid()
);

-- =============================================
-- SEED DOCTOR PROFILE (optional demo data)
-- =============================================
-- After creating your doctor user account, insert their profile:
-- INSERT INTO doctor_profiles (doctor_id, specialization, years_of_experience, qualifications, bio, consultation_fee)
-- VALUES (
--   '<your-doctor-user-uuid>',
--   'Panchakarma & Internal Medicine',
--   15,
--   ARRAY['BAMS - Gujarat Ayurved University', 'MD Ayurveda - RGUHS', 'Fellowship in Panchakarma - AIIA'],
--   'Dr. Priya Sharma is a distinguished Ayurvedic physician with 15+ years of experience.',
--   500
-- );
