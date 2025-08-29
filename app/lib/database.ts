import { supabase } from './supabase'
import type { Database } from './supabase'

type User = Database['public']['Tables']['users']['Row']
type UserInsert = Database['public']['Tables']['users']['Insert']
type UserUpdate = Database['public']['Tables']['users']['Update']

type Appointment = Database['public']['Tables']['appointments']['Row']
type AppointmentInsert = Database['public']['Tables']['appointments']['Insert']
type AppointmentUpdate = Database['public']['Tables']['appointments']['Update']

type CustomAvailability = Database['public']['Tables']['custom_availability']['Row']
type CustomAvailabilityInsert = Database['public']['Tables']['custom_availability']['Insert']

// ===== USUARIOS =====

export const createUser = async (userData: Omit<UserInsert, 'id' | 'created_at' | 'total_appointments' | 'is_active'>): Promise<User | null> => {
  try {
    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .or(`dni.eq.${userData.dni},phone.eq.${userData.phone}`)
      .single()

    if (existingUser) {
      // Actualizar usuario existente
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          name: userData.name,
          last_name: userData.last_name,
          email: userData.email,
          last_visit: new Date().toISOString(),
          total_appointments: existingUser.total_appointments + 1,
          is_active: true
        })
        .eq('id', existingUser.id)
        .select()
        .single()

      if (error) throw error
      return updatedUser
    }

    // Crear nuevo usuario
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        ...userData,
        created_at: new Date().toISOString(),
        total_appointments: 1,
        is_active: true
      })
      .select()
      .single()

    if (error) throw error
    console.log(`🆕 Nuevo paciente registrado: ${newUser.name} ${newUser.last_name}`)
    return newUser
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting users:', error)
    return []
  }
}

export const searchUsers = async (query: string): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`name.ilike.%${query}%,last_name.ilike.%${query}%,dni.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error searching users:', error)
    return []
  }
}

export const getUserStats = async () => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')

    if (error) throw error

    const total = users.length
    const active = users.filter(user => user.is_active).length
    const inactive = users.filter(user => !user.is_active).length
    
    const now = new Date()
    const newThisMonth = users.filter(user => {
      const createdAt = new Date(user.created_at)
      return createdAt.getMonth() === now.getMonth() && 
             createdAt.getFullYear() === now.getFullYear()
    }).length

    return { total, active, inactive, newThisMonth }
  } catch (error) {
    console.error('Error getting user stats:', error)
    return { total: 0, active: 0, inactive: 0, newThisMonth: 0 }
  }
}

export const deactivateUser = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ is_active: false })
      .eq('id', userId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deactivating user:', error)
    return false
  }
}

// ===== TURNOS =====

// Función para generar ID de paciente único
const generatePatientId = (dni: string, phone: string): string => {
  // Usar los últimos 4 dígitos del DNI y los últimos 4 del teléfono
  // Si son muy cortos, rellenar con ceros
  const dniSuffix = dni.length >= 4 ? dni.slice(-4) : dni.padStart(4, '0');
  const phoneSuffix = phone.length >= 4 ? phone.slice(-4) : phone.padStart(4, '0');
  return `PAC-${dniSuffix}-${phoneSuffix}`;
};

// Función para generar ID de turno simple
const generateTurnoId = async (): Promise<string> => {
  try {
    // Obtener el último turno para generar el siguiente ID
    const { data: lastAppointment, error } = await supabase
      .from('appointments')
      .select('id')
      .like('id', 'TURNO-%')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    let nextNumber = 1;
    
    if (lastAppointment && !error) {
      // Extraer el número del último ID (ej: "TURNO-001" -> 1)
      const lastNumber = parseInt(lastAppointment.id.replace('TURNO-', ''));
      nextNumber = lastNumber + 1;
    }
    
    // Formatear con ceros a la izquierda (ej: 001, 002, 010, 100)
    const formattedCount = nextNumber.toString().padStart(3, '0');
    return `TURNO-${formattedCount}`;
  } catch (error) {
    console.error('Error generating turno ID:', error);
    // Fallback: usar timestamp como ID
    const timestamp = Date.now().toString().slice(-6);
    return `TURNO-${timestamp}`;
  }
};

export const createAppointment = async (appointmentData: Omit<AppointmentInsert, 'created_at' | 'reminder_sent'>): Promise<Appointment | null> => {
  try {
    // Extraer DNI del campo notes
    const dni = appointmentData.notes?.replace('DNI: ', '') || '';
    
    // Generar ID de paciente único
    const patientId = generatePatientId(dni, appointmentData.patient_phone);
    
    // Generar ID de turno simple (ahora es async)
    const turnoId = await generateTurnoId();
    
    const { data: newAppointment, error } = await supabase
      .from('appointments')
      .insert({
        ...appointmentData,
        id: turnoId, // ID del turno
        notes: `${appointmentData.notes || ''} | Paciente ID: ${patientId}`, // Agregar ID del paciente a las notas
        created_at: new Date().toISOString(),
        reminder_sent: false
      })
      .select()
      .single()

    if (error) throw error
    return newAppointment
  } catch (error) {
    console.error('Error creating appointment:', error)
    return null
  }
}

export const getAllAppointments = async (): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting appointments:', error)
    return []
  }
}

export const updateAppointmentStatus = async (appointmentId: string, status: Appointment['status']): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error updating appointment status:', error)
    return false
  }
}

// ===== DISPONIBILIDAD PERSONALIZADA =====

export const addCustomAvailability = async (availabilityData: Omit<CustomAvailabilityInsert, 'id' | 'created_at'>): Promise<CustomAvailability | null> => {
  try {
    const { data: newAvailability, error } = await supabase
      .from('custom_availability')
      .insert({
        ...availabilityData,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return newAvailability
  } catch (error) {
    console.error('Error adding custom availability:', error)
    return null
  }
}

export const getCustomAvailability = async (specialtyId: string, date: string): Promise<CustomAvailability | null> => {
  try {
    const { data, error } = await supabase
      .from('custom_availability')
      .select('*')
      .eq('specialty_id', specialtyId)
      .eq('date', date)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting custom availability:', error)
    return null
  }
}

export const deleteCustomAvailability = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('custom_availability')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting custom availability:', error)
    return false
  }
}

// ===== FUNCIONES DE LIMPIEZA =====

export const clearAllData = async (): Promise<boolean> => {
  try {
    // Limpiar todas las tablas
    const { error: usersError } = await supabase.from('users').delete().neq('id', '')
    const { error: appointmentsError } = await supabase.from('appointments').delete().neq('id', '')
    const { error: availabilityError } = await supabase.from('custom_availability').delete().neq('id', '')

    if (usersError || appointmentsError || availabilityError) {
      throw new Error('Error clearing data')
    }

    console.log('🗑️ Base de datos limpiada completamente')
    return true
  } catch (error) {
    console.error('Error clearing data:', error)
    return false
  }
}
