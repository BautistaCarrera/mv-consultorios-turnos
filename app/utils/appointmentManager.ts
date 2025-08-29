import { Appointment, specialties, contactInfo } from '../data/specialties';
import { createUser, getUserByDNI, incrementUserAppointments } from '../data/users';
import { createAppointment as createSupabaseAppointment } from '../lib/database';
import { sendConsultorioNotificationDirect } from './whatsappService';

// Simulación de base de datos local (en producción sería una base de datos real)
let appointments: Appointment[] = [];

// Función para crear un nuevo turno
export const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'reminderSent'>): Promise<Appointment> => {
  // Generar ID de turno simple (ahora es async)
  const turnoId = await generateTurnoId();
  
  // Extraer DNI del campo notes
  const dni = appointmentData.notes?.replace('DNI: ', '') || '';
  
  // Generar ID de paciente único
  const patientId = generatePatientId(dni, appointmentData.patientPhone);
  
  // Crear turno en Supabase
  const supabaseAppointment = await createSupabaseAppointment({
    id: turnoId, // ID del turno
    specialty_id: appointmentData.specialtyId.toString(),
    patient_name: appointmentData.patientName,
    patient_phone: appointmentData.patientPhone,
    patient_email: appointmentData.patientEmail || null,
    date: appointmentData.date,
    time: appointmentData.time,
    status: appointmentData.status,
    notes: `${appointmentData.notes || ''} | Paciente ID: ${patientId}` // Agregar ID del paciente a las notas
  });

  if (!supabaseAppointment) {
    throw new Error('Error al crear el turno en la base de datos');
  }

  // Crear el objeto de respuesta compatible
  const newAppointment: Appointment = {
    ...appointmentData,
    id: supabaseAppointment.id,
    createdAt: supabaseAppointment.created_at,
    reminderSent: supabaseAppointment.reminder_sent
  };

  // También guardar en localStorage como respaldo
  appointments.push(newAppointment);
  saveAppointmentsToStorage();

  // Crear o actualizar usuario en la base de datos
  const [firstName, ...lastNameParts] = appointmentData.patientName.split(' ');
  const lastName = lastNameParts.join(' ');

  // Crear/actualizar usuario (ya incluye el incremento del contador de turnos)
  const user = createUser({
    name: firstName,
    lastName: lastName,
    dni: dni, // Usar la variable dni que ya está definida arriba
    phone: appointmentData.patientPhone,
    email: appointmentData.patientEmail
  });

  // Enviar notificación directa al consultorio
  try {
    console.log('📱 Intentando enviar notificación WhatsApp...');
    const specialty = specialties.find(s => s.id === appointmentData.specialtyId);
    if (specialty) {
      console.log('✅ Especialidad encontrada:', specialty.name);
      const result = await sendConsultorioNotificationDirect({
        patientName: appointmentData.patientName,
        patientPhone: appointmentData.patientPhone,
        dni: appointmentData.notes?.replace('DNI: ', '') || 'No especificado',
        date: appointmentData.date,
        time: appointmentData.time,
        specialty: specialty.name,
        professional: specialty.professional,
        appointmentId: newAppointment.id
      });
      console.log('📱 Resultado del envío:', result);
    } else {
      console.error('❌ Especialidad no encontrada para ID:', appointmentData.specialtyId);
    }
  } catch (error) {
    console.error('❌ Error enviando notificación WhatsApp:', error);
  }

  return newAppointment;
};

// Función para obtener todos los turnos
export const getAllAppointments = (): Appointment[] => {
  return appointments;
};

// Función para obtener turnos por paciente
export const getAppointmentsByPatient = (phone: string): Appointment[] => {
  return appointments.filter(app => app.patientPhone === phone);
};

// Función para obtener turnos por especialidad
export const getAppointmentsBySpecialty = (specialtyId: number): Appointment[] => {
  return appointments.filter(app => app.specialtyId === specialtyId);
};

// Función para cancelar un turno
export const cancelAppointment = (appointmentId: string): boolean => {
  const appointment = appointments.find(app => app.id === appointmentId);
  if (!appointment) return false;
  
  appointment.status = 'cancelled';
  saveAppointmentsToStorage();
  
  // Enviar notificación de cancelación por WhatsApp
  sendCancellationNotification(appointment);
  
  return true;
};

// Función para confirmar un turno
export const confirmAppointment = (appointmentId: string): boolean => {
  const appointment = appointments.find(app => app.id === appointmentId);
  if (!appointment) return false;
  
  appointment.status = 'confirmed';
  saveAppointmentsToStorage();
  
  return true;
};

// Función para marcar un turno como completado
export const completeAppointment = (appointmentId: string): boolean => {
  const appointment = appointments.find(app => app.id === appointmentId);
  if (!appointment) return false;
  
  appointment.status = 'completed';
  saveAppointmentsToStorage();
  
  return true;
};

// Función para verificar disponibilidad de horario
export const isTimeSlotAvailable = (specialtyId: number, date: string, time: string): boolean => {
  const conflictingAppointments = appointments.filter(app => 
    app.specialtyId === specialtyId && 
    app.date === date && 
    app.time === time && 
    app.status !== 'cancelled'
  );
  
  return conflictingAppointments.length === 0;
};

// Función para obtener horarios disponibles en una fecha
export const getAvailableTimeSlots = (specialtyId: number, date: string): string[] => {
  const specialty = specialties.find(s => s.id === specialtyId);
  if (!specialty) return [];
  
  // Verificar si hay disponibilidad personalizada para esta fecha
  const availabilityUpdates = JSON.parse(localStorage.getItem('availabilityUpdates') || '[]');
  console.log('🕐 Buscando horarios para:', { specialtyId, date });
  console.log('📋 Disponibilidades en localStorage:', availabilityUpdates);
  
  const customAvailability = availabilityUpdates.find((update: any) => 
    update.specialtyId === specialtyId && update.date === date && update.isActive
  );
  
  console.log('✅ Disponibilidad personalizada para horarios:', customAvailability);
  
  let availableHours: string[] = [];
  
  if (customAvailability) {
    // Usar horarios personalizados
    const startTime = new Date(`2000-01-01 ${customAvailability.startTime}`);
    const endTime = new Date(`2000-01-01 ${customAvailability.endTime}`);
    
    console.log('⏰ Generando horarios personalizados:', { 
      startTime: customAvailability.startTime, 
      endTime: customAvailability.endTime 
    });
    
    while (startTime < endTime) {
      availableHours.push(startTime.toTimeString().slice(0, 5));
      startTime.setMinutes(startTime.getMinutes() + 30);
    }
    
    console.log('📅 Horarios generados:', availableHours);
  } else {
    // Usar horarios por defecto de la especialidad
    availableHours = specialty.availableHours;
    console.log('📅 Usando horarios por defecto:', availableHours);
  }
  
  // Filtrar horarios ya reservados
  const bookedHours = appointments
    .filter(app => app.specialtyId === specialtyId && app.date === date && app.status !== 'cancelled')
    .map(app => app.time);
  
  console.log('🚫 Horarios reservados:', bookedHours);
  
  const finalHours = availableHours.filter(hour => !bookedHours.includes(hour));
  console.log('✅ Horarios finales disponibles:', finalHours);
  
  return finalHours;
};

// Función para enviar recordatorio por WhatsApp
export const sendReminderNotification = (appointment: Appointment): void => {
  const specialty = specialties.find(s => s.id === appointment.specialtyId);
  if (!specialty) return;
  
  const message = `🔔 RECORDATORIO - MV CONSULTORIOS

Hola ${appointment.patientName}! 

Te recordamos que tienes un turno programado:

📅 Fecha: ${formatDate(appointment.date)}
⏰ Horario: ${appointment.time}
🏥 Especialidad: ${specialty.name}
👨‍⚕️ Profesional: ${specialty.professional}

📍 Dirección: ${contactInfo.address}

Por favor confirma tu asistencia respondiendo a este mensaje.

Para cancelar o reprogramar, contáctanos al ${contactInfo.phone}`;

  const whatsappUrl = `https://wa.me/54${contactInfo.phone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};

// Función para enviar notificación de cancelación
export const sendCancellationNotification = (appointment: Appointment): void => {
  const specialty = specialties.find(s => s.id === appointment.specialtyId);
  if (!specialty) return;
  
  const message = `❌ CANCELACIÓN DE TURNO - MV CONSULTORIOS

Hola ${appointment.patientName}!

Tu turno ha sido cancelado:

📅 Fecha: ${formatDate(appointment.date)}
⏰ Horario: ${appointment.time}
🏥 Especialidad: ${specialty.name}
👨‍⚕️ Profesional: ${specialty.professional}

Para reprogramar tu turno, contáctanos al ${contactInfo.phone}

Gracias por tu comprensión.`;

  const whatsappUrl = `https://wa.me/54${appointment.patientPhone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};

// Función para enviar notificación al consultorio
export const sendConsultorioNotification = (appointment: Appointment): void => {
  const specialty = specialties.find(s => s.id === appointment.specialtyId);
  if (!specialty) return;
  
  // Extraer DNI y generar ID de paciente
  const dni = appointment.notes?.replace('DNI: ', '') || 'No especificado';
  const dniSuffix = dni !== 'No especificado' ? dni.slice(-4) : '0000';
  const phoneSuffix = appointment.patientPhone.slice(-4);
  const patientId = `PAC-${dniSuffix}-${phoneSuffix}`;
  
  const message = `🆕 NUEVA RESERVA DE TURNO - MV CONSULTORIOS

Se ha registrado una nueva reserva:

👤 Paciente: ${appointment.patientName}
📱 Teléfono: ${appointment.patientPhone}
🆔 DNI: ${dni}
🆔 ID Paciente: ${patientId}

📅 Fecha: ${formatDate(appointment.date)}
⏰ Horario: ${appointment.time}
🏥 Especialidad: ${specialty.name}
👨‍⚕️ Profesional: ${specialty.professional}

🆔 ID de Turno: ${appointment.id}

Para confirmar el turno, responde con:
✅ CONFIRMAR ${appointment.id}

Para cancelar el turno, responde con:
❌ CANCELAR ${appointment.id}

Para reprogramar, responde con:
🔄 REPROGRAMAR ${appointment.id}

💡 Ejemplo: "✅ CONFIRMAR TURNO-001"
💡 ID Paciente: ${patientId} (siempre el mismo para este paciente)`;

  const whatsappUrl = `https://wa.me/54${contactInfo.phone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};

// Función para enviar confirmación de turno al paciente
export const sendConfirmationNotification = (appointment: Appointment): void => {
  const specialty = specialties.find(s => s.id === appointment.specialtyId);
  if (!specialty) return;
  
  const message = `✅ TURNO CONFIRMADO - MV CONSULTORIOS

Hola ${appointment.patientName}!

Tu turno ha sido confirmado exitosamente:

📅 Fecha: ${formatDate(appointment.date)}
⏰ Horario: ${appointment.time}
🏥 Especialidad: ${specialty.name}
👨‍⚕️ Profesional: ${specialty.professional}

📍 Dirección: ${contactInfo.address}

Te enviaremos un recordatorio 24 horas antes de tu consulta.

Para cancelar o reprogramar, contáctanos al ${contactInfo.phone}

¡Gracias por elegirnos!`;

  const whatsappUrl = `https://wa.me/54${appointment.patientPhone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};

// Función para programar recordatorios automáticos
export const scheduleReminders = (): void => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  const appointmentsTomorrow = appointments.filter(app => 
    app.date === tomorrowStr && 
    app.status === 'confirmed' && 
    !app.reminderSent
  );
  
  appointmentsTomorrow.forEach(appointment => {
    sendReminderNotification(appointment);
    appointment.reminderSent = true;
    appointment.reminderDate = new Date().toISOString();
  });
  
  saveAppointmentsToStorage();
};

// Función para obtener estadísticas
export const getAppointmentStats = () => {
  const total = appointments.length;
  const confirmed = appointments.filter(app => app.status === 'confirmed').length;
  const cancelled = appointments.filter(app => app.status === 'cancelled').length;
  const completed = appointments.filter(app => app.status === 'completed').length;
  const pending = appointments.filter(app => app.status === 'pending').length;
  
  return {
    total,
    confirmed,
    cancelled,
    completed,
    pending
  };
};

// Función para buscar turnos
export const searchAppointments = (query: string): Appointment[] => {
  const lowerQuery = query.toLowerCase();
  return appointments.filter(app => 
    app.patientName.toLowerCase().includes(lowerQuery) ||
    app.patientPhone.includes(query) ||
    app.patientEmail.toLowerCase().includes(lowerQuery)
  );
};

// Función para filtrar turnos por estado
export const filterAppointmentsByStatus = (status: Appointment['status']): Appointment[] => {
  return appointments.filter(app => app.status === status);
};

// Función para filtrar turnos por fecha
export const filterAppointmentsByDate = (date: string): Appointment[] => {
  return appointments.filter(app => app.date === date);
};

// Función para filtrar turnos por rango de fechas
export const filterAppointmentsByDateRange = (startDate: string, endDate: string): Appointment[] => {
  return appointments.filter(app => app.date >= startDate && app.date <= endDate);
};

// Funciones auxiliares
const generatePatientId = (dni: string, phone: string): string => {
  // Usar los últimos 4 dígitos del DNI y los últimos 4 del teléfono
  // Si son muy cortos, rellenar con ceros
  const dniSuffix = dni.length >= 4 ? dni.slice(-4) : dni.padStart(4, '0');
  const phoneSuffix = phone.length >= 4 ? phone.slice(-4) : phone.padStart(4, '0');
  return `PAC-${dniSuffix}-${phoneSuffix}`;
};

const generateTurnoId = async (): Promise<string> => {
  try {
    // Importar dinámicamente para evitar problemas de SSR
    const { supabase } = await import('../lib/supabase');
    
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

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const saveAppointmentsToStorage = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mv-appointments', JSON.stringify(appointments));
  }
};

const loadAppointmentsFromStorage = (): void => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('mv-appointments');
    if (stored) {
      appointments = JSON.parse(stored);
    }
  }
};

// Inicializar cargando datos del localStorage
if (typeof window !== 'undefined') {
  loadAppointmentsFromStorage();
}
