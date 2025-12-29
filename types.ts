import { LucideIcon } from 'lucide-react';

export interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface StatItem {
  value: string;
  label: string;
  icon: LucideIcon;
  suffix?: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface DifferenceItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  created_at?: string; // Supabase timestamp column
  date?: string; // Legacy local support if needed, but primarily using created_at
}