import { supabase } from './supabase'
import { createUser, createAppointment, addCustomAvailability } from './database'

// Función para migrar usuarios del localStorage a Supabase
export const migrateUsersToSupabase = async (): Promise<{ success: boolean; count: number; errors: string[] }> => {
  const errors: string[] = []
  let count = 0

  try {
    // Obtener usuarios del localStorage
    const storedUsers = localStorage.getItem('mv-users')
    if (!storedUsers) {
      return { success: true, count: 0, errors: [] }
    }

    const users = JSON.parse(storedUsers)
    console.log(`🔄 Migrando ${users.length} usuarios a Supabase...`)

    for (const user of users) {
      try {
        const result = await createUser({
          name: user.name,
          last_name: user.lastName,
          dni: user.dni,
          phone: user.phone,
          email: user.email || null
        })

        if (result) {
          count++
        } else {
          errors.push(`Error migrando usuario ${user.name} ${user.lastName}`)
        }
      } catch (error) {
        errors.push(`Error migrando usuario ${user.name} ${user.lastName}: ${error}`)
      }
    }

    console.log(`✅ Migración completada: ${count} usuarios migrados`)
    return { success: true, count, errors }
  } catch (error) {
    console.error('Error en migración de usuarios:', error)
    return { success: false, count, errors: [error as string] }
  }
}

// Función para migrar turnos del localStorage a Supabase
export const migrateAppointmentsToSupabase = async (): Promise<{ success: boolean; count: number; errors: string[] }> => {
  const errors: string[] = []
  let count = 0

  try {
    // Obtener turnos del localStorage
    const storedAppointments = localStorage.getItem('mv-appointments')
    if (!storedAppointments) {
      return { success: true, count: 0, errors: [] }
    }

    const appointments = JSON.parse(storedAppointments)
    console.log(`🔄 Migrando ${appointments.length} turnos a Supabase...`)

    for (const appointment of appointments) {
      try {
        const result = await createAppointment({
          id: appointment.id,
          specialty_id: appointment.specialtyId,
          patient_name: appointment.patientName,
          patient_phone: appointment.patientPhone,
          patient_email: appointment.patientEmail || null,
          date: appointment.date,
          time: appointment.time,
          status: appointment.status,
          notes: appointment.notes || null
        })

        if (result) {
          count++
        } else {
          errors.push(`Error migrando turno ${appointment.id}`)
        }
      } catch (error) {
        errors.push(`Error migrando turno ${appointment.id}: ${error}`)
      }
    }

    console.log(`✅ Migración completada: ${count} turnos migrados`)
    return { success: true, count, errors }
  } catch (error) {
    console.error('Error en migración de turnos:', error)
    return { success: false, count, errors: [error as string] }
  }
}

// Función para migrar disponibilidad personalizada del localStorage a Supabase
export const migrateCustomAvailabilityToSupabase = async (): Promise<{ success: boolean; count: number; errors: string[] }> => {
  const errors: string[] = []
  let count = 0

  try {
    // Obtener disponibilidad del localStorage
    const storedAvailability = localStorage.getItem('mv-custom-availability')
    if (!storedAvailability) {
      return { success: true, count: 0, errors: [] }
    }

    const availability = JSON.parse(storedAvailability)
    console.log(`🔄 Migrando ${availability.length} disponibilidades a Supabase...`)

    for (const avail of availability) {
      try {
        const result = await addCustomAvailability({
          specialty_id: avail.specialtyId,
          date: avail.date,
          start_time: avail.startTime,
          end_time: avail.endTime
        })

        if (result) {
          count++
        } else {
          errors.push(`Error migrando disponibilidad ${avail.id}`)
        }
      } catch (error) {
        errors.push(`Error migrando disponibilidad ${avail.id}: ${error}`)
      }
    }

    console.log(`✅ Migración completada: ${count} disponibilidades migradas`)
    return { success: true, count, errors }
  } catch (error) {
    console.error('Error en migración de disponibilidad:', error)
    return { success: false, count, errors: [error as string] }
  }
}

// Función para migrar todos los datos
export const migrateAllDataToSupabase = async (): Promise<{
  success: boolean
  users: { success: boolean; count: number; errors: string[] }
  appointments: { success: boolean; count: number; errors: string[] }
  availability: { success: boolean; count: number; errors: string[] }
}> => {
  console.log('🚀 Iniciando migración completa a Supabase...')

  const users = await migrateUsersToSupabase()
  const appointments = await migrateAppointmentsToSupabase()
  const availability = await migrateCustomAvailabilityToSupabase()

  const success = users.success && appointments.success && availability.success

  if (success) {
    console.log('✅ Migración completa exitosa!')
    console.log(`📊 Resumen:`)
    console.log(`   - Usuarios: ${users.count}`)
    console.log(`   - Turnos: ${appointments.count}`)
    console.log(`   - Disponibilidad: ${availability.count}`)
  } else {
    console.error('❌ Error en la migración')
  }

  return {
    success,
    users,
    appointments,
    availability
  }
}

// Función para verificar si hay datos en localStorage
export const hasLocalStorageData = (): boolean => {
  const hasUsers = localStorage.getItem('mv-users') !== null
  const hasAppointments = localStorage.getItem('mv-appointments') !== null
  const hasAvailability = localStorage.getItem('mv-custom-availability') !== null

  return hasUsers || hasAppointments || hasAvailability
}

// Función para limpiar localStorage después de migración exitosa
export const clearLocalStorageAfterMigration = (): void => {
  localStorage.removeItem('mv-users')
  localStorage.removeItem('mv-appointments')
  localStorage.removeItem('mv-custom-availability')
  localStorage.removeItem('mv-next-registration')
  
  console.log('🗑️ localStorage limpiado después de migración exitosa')
}
