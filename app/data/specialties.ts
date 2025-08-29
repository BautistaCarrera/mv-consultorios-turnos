export interface Specialty {
  id: number;
  name: string;
  professional: string;
  description: string;
  availableDays: string[]; // Días de la semana disponibles
  availableHours: string[]; // Horarios disponibles
  consultationDuration: number; // Duración en minutos
  isActive: boolean;
}

export interface ContactInfo {
  address: string;
  phone: string;
  whatsapp: string;
  whatsappLink: string;
}

export interface Appointment {
  id: string;
  specialtyId: number;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string;
  createdAt: string;
  reminderSent: boolean;
  reminderDate?: string;
}

export const contactInfo: ContactInfo = {
  address: "San Martin 891, Wheelwright, Santa Fe",
  phone: "2477504122",
  whatsapp: "2477504122",
  whatsappLink: "wa.me/542477504122"
};

export const specialties: Specialty[] = [
  {
    id: 1,
    name: "CARDIOLOGÍA",
    professional: "Lic. Ciro Carrillo",
    description: "Especialista en enfermedades del corazón y sistema cardiovascular",
    availableDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    availableHours: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"],
    consultationDuration: 30,
    isActive: true
  },
  {
    id: 2,
    name: "COSMETOLOGÍA",
    professional: "Lic. Melisa Ministeri",
    description: "Tratamientos estéticos y procedimientos cosméticos",
    availableDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    availableHours: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"],
    consultationDuration: 45,
    isActive: true
  },
  {
    id: 3,
    name: "DEPILACIÓN DEFINITIVA",
    professional: "Lic. Sol Domizioli",
    description: "Tratamientos de depilación láser definitiva",
    availableDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    availableHours: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"],
    consultationDuration: 30,
    isActive: true
  },
  {
    id: 4,
    name: "DERMATOLOGÍA",
    professional: "Lic. Carolina Moreno",
    description: "Diagnóstico y tratamiento de enfermedades de la piel",
    availableDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    availableHours: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"],
    consultationDuration: 30,
    isActive: true
  },
  {
    id: 5,
    name: "ECOGRAFÍAS",
    professional: "Lic. David Barroso/Lic. Andrea Lerea",
    description: "Estudios ecográficos y diagnósticos por imagen",
    availableDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    availableHours: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"],
    consultationDuration: 45,
    isActive: true
  },
  {
    id: 6,
    name: "ENDOCRINOLOGÍA",
    professional: "Lic. Jorgelina Notarpasquale",
    description: "Especialista en trastornos hormonales y metabólicos",
    availableDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    availableHours: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"],
    consultationDuration: 45,
    isActive: true
  },
  {
    id: 7,
    name: "ENTRENAMIENTO",
    professional: "Lic. Florencia Colleri",
    description: "Entrenamiento personalizado y asesoramiento deportivo",
    availableDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    availableHours: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"],
    consultationDuration: 60,
    isActive: true
  },
  {
    id: 8,
    name: "FONOAUDIOLOGÍA",
    professional: "Lic. Rosana Allega",
    description: "Evaluación y tratamiento de trastornos del lenguaje y audición",
    availableDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    availableHours: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"],
    consultationDuration: 45,
    isActive: true
  },
  {
    id: 9,
    name: "GASTROENTEROLOGÍA",
    professional: "Lic. Juan Costanzi",
    description: "Especialista en enfermedades del aparato digestivo",
    availableDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    availableHours: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"],
    consultationDuration: 30,
    isActive: true
  },
  {
    id: 10,
    name: "MASOTERAPIA/OTROS",
    professional: "Lic. Erica Sanchez",
    description: "Tratamientos de masoterapia y terapias complementarias",
    availableDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    availableHours: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"],
    consultationDuration: 60,
    isActive: true
  },
  {
    id: 11,
    name: "NUTRICIÓN",
    professional: "Lic. Valentina Rossi",
    description: "Asesoramiento nutricional y planes alimentarios",
    availableDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    availableHours: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"],
    consultationDuration: 45,
    isActive: true
  },
  {
    id: 12,
    name: "OTORRINOLARINGOLOGÍA",
    professional: "Lic. Mariano Garcia",
    description: "Especialista en enfermedades de oído, nariz y garganta",
    availableDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    availableHours: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"],
    consultationDuration: 30,
    isActive: true
  },
  {
    id: 13,
    name: "PLANTILLAS",
    professional: "Lic. Martin Besson",
    description: "Confección y adaptación de plantillas ortopédicas",
    availableDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    availableHours: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"],
    consultationDuration: 45,
    isActive: true
  },
  {
    id: 14,
    name: "PSICOLOGÍA",
    professional: "Lic. Luciana Jacquelin",
    description: "Atención psicológica y terapia individual",
    availableDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    availableHours: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"],
    consultationDuration: 60,
    isActive: true
  },
  {
    id: 15,
    name: "PSICOPEDAGOGÍA",
    professional: "Lic. Luisina Morgado",
    description: "Evaluación y tratamiento de dificultades de aprendizaje",
    availableDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    availableHours: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"],
    consultationDuration: 45,
    isActive: true
  },
  {
    id: 16,
    name: "PSIQUIATRÍA",
    professional: "Lic. Federico Canga",
    description: "Diagnóstico y tratamiento de trastornos mentales",
    availableDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    availableHours: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"],
    consultationDuration: 45,
    isActive: true
  },
  {
    id: 17,
    name: "YOGA",
    professional: "Lic. Carina Frattesi",
    description: "Clases de yoga y meditación",
    availableDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    availableHours: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"],
    consultationDuration: 60,
    isActive: true
  }
];

// Función para obtener días disponibles de una especialidad
export const getAvailableDays = (specialtyId: number): string[] => {
  const specialty = specialties.find(s => s.id === specialtyId);
  return specialty?.availableDays || [];
};

// Función para obtener horarios disponibles de una especialidad
export const getAvailableHours = (specialtyId: number): string[] => {
  const specialty = specialties.find(s => s.id === specialtyId);
  return specialty?.availableHours || [];
};

// Función para verificar si una fecha está disponible
export const isDateAvailable = (specialtyId: number, date: string): boolean => {
  const specialty = specialties.find(s => s.id === specialtyId);
  if (!specialty) return false;
  
  console.log('🔍 isDateAvailable iniciada:', { specialtyId, date, specialtyName: specialty.name });
  
  // Verificar que la fecha no sea pasada
  const dateObj = new Date(date);
  const today = new Date();
  
  // Resetear las horas para comparar solo las fechas
  today.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);
  
  // Si la fecha es anterior a hoy, no está disponible
  if (dateObj < today) {
    console.log('❌ Fecha pasada detectada:', { date, today: today.toISOString().split('T')[0] });
    return false;
  }
  
  // Verificar que no sea sábado (6) o domingo (0) - ESTA RESTRICCIÓN TIENE PRIORIDAD ABSOLUTA
  const dayOfWeek = dateObj.getDay();
  console.log('📅 Día de la semana:', { date, dayOfWeek, dayName: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][dayOfWeek] });
  
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    console.log('❌ FECHA EN FIN DE SEMANA RECHAZADA:', { date, dayOfWeek, dayName: dayOfWeek === 0 ? 'Domingo' : 'Sábado' });
    return false;
  }
  
  // Verificar si hay disponibilidad personalizada para esta fecha (solo para días de semana)
  if (typeof window !== 'undefined') {
    const availabilityUpdates = JSON.parse(localStorage.getItem('availabilityUpdates') || '[]');
    console.log('🔍 Verificando disponibilidad personalizada para:', { specialtyId, date });
    
    const customAvailability = availabilityUpdates.find((update: any) => 
      update.specialtyId === specialtyId && update.date === date && update.isActive
    );
    
    if (customAvailability) {
      console.log('✅ Disponibilidad personalizada encontrada:', customAvailability);
      return true; // Si hay disponibilidad personalizada, la fecha está disponible
    }
  }
  
  // Si no hay disponibilidad personalizada, verificar días regulares (solo lunes a viernes)
  // Mapear números de día a nombres en español
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayName = dayNames[dayOfWeek];
  
  console.log('📅 Verificando día regular:', { date, dayName, availableDays: specialty.availableDays });
  
  // Solo verificar días de lunes a viernes (1-5)
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    const isAvailable = specialty.availableDays.includes(dayName);
    console.log('✅ Resultado final:', { date, dayName, isAvailable, availableDays: specialty.availableDays });
    return isAvailable;
  }
  
  console.log('❌ Día fuera del rango lunes-viernes:', { date, dayOfWeek });
  return false;
};

// Función para obtener horarios disponibles en una fecha específica
export const getAvailableHoursForDate = (specialtyId: number, date: string): string[] => {
  if (!isDateAvailable(specialtyId, date)) return [];
  
  const specialty = specialties.find(s => s.id === specialtyId);
  if (!specialty) return [];
  
  const allHours = specialty.availableHours;
  const dateObj = new Date(date);
  const today = new Date();
  
  // Si es hoy, filtrar solo horarios futuros (con 30 min de anticipación)
  if (dateObj.toDateString() === today.toDateString()) {
    const currentTime = new Date();
    const bufferMinutes = 30; // 30 minutos de anticipación
    currentTime.setMinutes(currentTime.getMinutes() + bufferMinutes);
    
    const currentTimeString = currentTime.toTimeString().slice(0, 5); // HH:MM
    
    console.log('🕐 Filtrando horarios para hoy:', {
      currentTime: currentTimeString,
      allHours,
      filteredHours: allHours.filter(hour => hour > currentTimeString)
    });
    
    return allHours.filter(hour => hour > currentTimeString);
  }
  
  // Si no es hoy, devolver todos los horarios
  return allHours;
};

// Función para verificar si es hoy
export const isToday = (date: string): boolean => {
  const dateObj = new Date(date);
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
};

// Función para obtener el nombre del día
export const getDayName = (date: string): string => {
  const dateObj = new Date(date);
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dayNames[dateObj.getDay()];
};
