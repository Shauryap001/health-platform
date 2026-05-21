import type { Metadata } from 'next';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';

export const metadata: Metadata = {
  title: 'Shashwat Ayurveda — Top Rated Ayurvedic Hospital in Surat | Dr. Vishal B Bhuva',
  description: 'Shashwat Ayurveda & Panchkarma Hospital, Vesu, Surat. Specialist in Digestive Disorders, Infertility, Migraine, Skin Disease, Panchkarma, Shirodhara. Dr. Vishal B Bhuva — BAMS, 12+ years experience. Book appointment online.',
  keywords: 'Shashwat Ayurveda, Ayurveda Surat, Panchkarma Surat, Dr Vishal Bhuva, Ayurvedic hospital Vesu, Shirodhara Surat, Digestive disorder ayurveda, Skin disease ayurveda, PCOD ayurveda surat',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
