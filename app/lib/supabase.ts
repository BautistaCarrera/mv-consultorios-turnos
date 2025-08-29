import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uxjfcdpsrmdvsebjaofp.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4amZjZHBzcm1kdnNlYmphb2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzOTk3NTQsImV4cCI6MjA3MTk3NTc1NH0.RmjP7O4gbqg9ZJYm847EaL87tQ90tEPYhV_geZr9kHU'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas')
  console.log('🔧 Usando valores por defecto...')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          last_name: string
          dni: string
          phone: string
          email: string | null
          created_at: string
          last_visit: string | null
          total_appointments: number
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          last_name: string
          dni: string
          phone: string
          email?: string | null
          created_at?: string
          last_visit?: string | null
          total_appointments?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          last_name?: string
          dni?: string
          phone?: string
          email?: string | null
          created_at?: string
          last_visit?: string | null
          total_appointments?: number
          is_active?: boolean
        }
      }
      appointments: {
        Row: {
          id: string // Ahora es VARCHAR(50) para permitir IDs personalizados como "TURNO-001"
          specialty_id: string
          patient_name: string
          patient_phone: string
          patient_email: string | null
          date: string
          time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes: string | null
          created_at: string
          reminder_sent: boolean
        }
        Insert: {
          id: string // Requerido ahora, ya que no tiene DEFAULT
          specialty_id: string
          patient_name: string
          patient_phone: string
          patient_email?: string | null
          date: string
          time: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes?: string | null
          created_at?: string
          reminder_sent?: boolean
        }
        Update: {
          id?: string
          specialty_id?: string
          patient_name?: string
          patient_phone?: string
          patient_email?: string | null
          date?: string
          time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes?: string | null
          created_at?: string
          reminder_sent?: boolean
        }
      }
      custom_availability: {
        Row: {
          id: string
          specialty_id: string
          date: string
          start_time: string
          end_time: string
          created_at: string
        }
        Insert: {
          id?: string
          specialty_id: string
          date: string
          start_time: string
          end_time: string
          created_at?: string
        }
        Update: {
          id?: string
          specialty_id?: string
          date?: string
          start_time?: string
          end_time?: string
          created_at?: string
        }
      }
    }
  }
}
