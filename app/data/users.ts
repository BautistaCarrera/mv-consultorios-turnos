export interface User {
  id: string;
  name: string;
  lastName: string;
  dni: string;
  phone: string;
  email?: string;
  createdAt: string;
  lastVisit?: string;
  totalAppointments: number;
  isActive: boolean;
}

// Simulación de base de datos local (en producción sería una base de datos real)
let users: User[] = [];

// Función para crear un nuevo usuario
export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'totalAppointments' | 'isActive'>): Promise<User> => {
  try {
    // Importar dinámicamente para evitar problemas de SSR
    const { createUser: createSupabaseUser } = await import('../lib/database');
    
    // Crear usuario en Supabase
    const supabaseUser = await createSupabaseUser({
      name: userData.name,
      last_name: userData.lastName,
      dni: userData.dni,
      phone: userData.phone,
      email: userData.email || null
    });

    if (!supabaseUser) {
      throw new Error('Error al crear usuario en Supabase');
    }

    // Crear objeto compatible
    const newUser: User = {
      id: supabaseUser.id,
      name: supabaseUser.name,
      lastName: supabaseUser.last_name,
      dni: supabaseUser.dni,
      phone: supabaseUser.phone,
      email: supabaseUser.email || undefined,
      createdAt: supabaseUser.created_at,
      lastVisit: supabaseUser.last_visit || undefined,
      totalAppointments: supabaseUser.total_appointments,
      isActive: supabaseUser.is_active
    };

    // También guardar en localStorage como respaldo
    users.push(newUser);
    saveUsersToStorage();
    
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Fallback a localStorage si Supabase falla
    const existingUser = users.find(user => 
      user.dni === userData.dni || user.phone === userData.phone
    );

    if (existingUser) {
      existingUser.name = userData.name;
      existingUser.lastName = userData.lastName;
      existingUser.email = userData.email;
      existingUser.lastVisit = new Date().toISOString();
      existingUser.totalAppointments += 1;
      existingUser.isActive = true;
      
      saveUsersToStorage();
      return existingUser;
    }

    const newUser: User = {
      ...userData,
      id: generateUserId(),
      createdAt: new Date().toISOString(),
      totalAppointments: 1,
      isActive: true
    };
    
    users.push(newUser);
    saveUsersToStorage();
    
    return newUser;
  }
};

// Función para obtener todos los usuarios
export const getAllUsers = (): User[] => {
  return users;
};

// Función para obtener un usuario por DNI
export const getUserByDNI = (dni: string): User | undefined => {
  return users.find(user => user.dni === dni);
};

// Función para obtener un usuario por teléfono
export const getUserByPhone = (phone: string): User | undefined => {
  return users.find(user => user.phone === phone);
};

// Función para obtener un usuario por ID
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Función para actualizar un usuario
export const updateUser = (id: string, updates: Partial<User>): boolean => {
  const user = users.find(u => u.id === id);
  if (!user) return false;
  
  Object.assign(user, updates);
  saveUsersToStorage();
  
  return true;
};

// Función para desactivar un usuario
export const deactivateUser = (id: string): boolean => {
  const user = users.find(u => u.id === id);
  if (!user) return false;
  
  user.isActive = false;
  saveUsersToStorage();
  
  return true;
};

// Función para buscar usuarios
export const searchUsers = (query: string): User[] => {
  const lowerQuery = query.toLowerCase();
  return users.filter(user => 
    user.name.toLowerCase().includes(lowerQuery) ||
    user.lastName.toLowerCase().includes(lowerQuery) ||
    user.dni.includes(query) ||
    user.phone.includes(query)
  );
};

// Función para obtener estadísticas de usuarios
export const getUserStats = () => {
  const total = users.length;
  const active = users.filter(user => user.isActive).length;
  const inactive = users.filter(user => !user.isActive).length;
  const newThisMonth = users.filter(user => {
    const createdAt = new Date(user.createdAt);
    const now = new Date();
    return createdAt.getMonth() === now.getMonth() && 
           createdAt.getFullYear() === now.getFullYear();
  }).length;
  
  return {
    total,
    active,
    inactive,
    newThisMonth
  };
};

// Función para obtener usuarios más frecuentes
export const getMostFrequentUsers = (limit: number = 10): User[] => {
  return users
    .filter(user => user.isActive)
    .sort((a, b) => b.totalAppointments - a.totalAppointments)
    .slice(0, limit);
};

// Función para obtener usuarios recientes
export const getRecentUsers = (limit: number = 10): User[] => {
  return users
    .filter(user => user.isActive)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

// Función para incrementar el contador de turnos de un usuario
export const incrementUserAppointments = (userId: string): boolean => {
  const user = users.find(u => u.id === userId);
  if (!user) return false;
  
  user.totalAppointments += 1;
  user.lastVisit = new Date().toISOString();
  saveUsersToStorage();
  
  return true;
};

// Función para corregir el contador de turnos basado en turnos reales
export const correctUserAppointmentCounts = (): void => {
  // Esta función se puede usar para sincronizar los contadores con los turnos reales
  // Por ahora, solo la dejamos disponible para uso futuro
  console.log('🔄 Función de corrección de contadores disponible');
};

// Función para limpiar la base de datos de usuarios (para desarrollo)
export const clearUsersDatabase = (): void => {
  if (confirm('¿Estás seguro de que quieres limpiar toda la base de datos de usuarios? Esta acción no se puede deshacer.')) {
    users = [];
    saveUsersToStorage();
    console.log('🗑️ Base de datos de usuarios limpiada');
  }
};

// Función para limpiar la base de datos sin confirmación
export const forceClearUsersDatabase = (): void => {
  users = [];
  saveUsersToStorage();
  console.log('🗑️ Base de datos de usuarios limpiada forzadamente');
  alert('Base de datos limpiada exitosamente');
};

// Funciones auxiliares
const generateUserId = (): string => {
  return 'user_' + Math.random().toString(36).substr(2, 9);
};

const saveUsersToStorage = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mv-users', JSON.stringify(users));
  }
};

const loadUsersFromStorage = (): void => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('mv-users');
    if (stored) {
      users = JSON.parse(stored);
    }
  }
};

// Inicializar cargando datos del localStorage
if (typeof window !== 'undefined') {
  loadUsersFromStorage();
}
