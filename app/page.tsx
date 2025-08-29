'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, User, MapPin, Phone, MessageCircle, Clock, X, Heart, Star, Settings } from 'lucide-react';
import { specialties, contactInfo, isDateAvailable, getAvailableHoursForDate, getDayName, isToday } from './data/specialties';
import AdminPanel from './components/AdminPanel';
import { createAppointment, getAvailableTimeSlots, sendConfirmationNotification, getAllAppointments } from './utils/appointmentManager';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [keySequence, setKeySequence] = useState('');

  const filteredSpecialties = specialties.filter(specialty => {
    const matchesSearch = specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         specialty.professional.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterCategory || specialty.name.includes(filterCategory);
    return matchesSearch && matchesFilter;
  });

  const handleBooking = (specialty: any) => {
    setSelectedSpecialty(specialty);
    setShowModal(true);
  };

  // Función para verificar si es administrador
  const checkAdminAccess = () => {
    if (typeof window !== 'undefined') {
      const adminKey = localStorage.getItem('mv-admin-key');
      if (adminKey === 'mv-consultorios-2024') {
        setIsAdmin(true);
        return true;
      }
    }
    return false;
  };

  // Función para activar modo administrador
  const activateAdminMode = () => {
    console.log('🔐 Función activateAdminMode ejecutada');
    setShowPasswordModal(true);
  };

  // Función para verificar contraseña
  const verifyPassword = () => {
    console.log('🔑 Verificando contraseña:', passwordInput);
    
    if (passwordInput === 'mv-consultorios-2024') {
      console.log('✅ Contraseña correcta, activando modo admin...');
      localStorage.setItem('mv-admin-key', passwordInput);
      setIsAdmin(true);
      setShowPasswordModal(false);
      setPasswordInput('');
      alert('Modo administrador activado');
      console.log('🎉 Modo admin activado exitosamente');
    } else {
      console.log('❌ Contraseña incorrecta');
      alert('Clave incorrecta');
      setPasswordInput('');
    }
  };

  // Función para desactivar modo administrador
  const deactivateAdminMode = () => {
    localStorage.removeItem('mv-admin-key');
    setIsAdmin(false);
    setShowAdminPanel(false);
    alert('Modo administrador desactivado');
  };

  // Manejar atajos de teclado
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Secuencia secreta para activar admin: Ctrl + M + V + Enter
      if (!isAdmin && event.ctrlKey && !event.shiftKey) {
        if (event.key === 'M' || event.key === 'm') {
          setKeySequence(prev => prev + 'M');
        } else if (event.key === 'V' || event.key === 'v') {
          if (keySequence === 'M') {
            setKeySequence(prev => prev + 'V');
          } else {
            setKeySequence('');
          }
        } else if (event.key === 'Enter') {
          if (keySequence === 'MV') {
            event.preventDefault();
            activateAdminMode();
            setKeySequence('');
          } else {
            setKeySequence('');
          }
        } else {
          // Resetear secuencia si se presiona otra tecla
          setKeySequence('');
        }
      } else if (!isAdmin && !event.ctrlKey) {
        // Resetear secuencia si no se presiona Ctrl
        setKeySequence('');
      }
      
      // Ctrl + Shift + A para abrir panel admin (solo si ya está en modo admin)
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        if (isAdmin) {
          setShowAdminPanel(true);
        }
      }
      
      // Ctrl + Shift + D para desactivar admin
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        if (isAdmin) {
          deactivateAdminMode();
        }
      }
      
      // Escape para cerrar panel
      if (event.key === 'Escape') {
        setShowModal(false);
        setShowAdminPanel(false);
        setShowPasswordModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    // Verificar si ya está en modo admin
    checkAdminAccess();

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isAdmin, showAdminPanel, keySequence]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-mv-light via-white to-mv-beige">
      {/* Professional Header */}
             <header className="bg-gradient-to-r from-white via-mv-light to-white shadow-xl border-b border-gray-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           {/* Main Navigation */}
           <div className="flex items-center justify-center py-6">
             {/* Centered Title */}
             <div className="text-center">
               <h1 className="text-4xl font-light text-gray-800 tracking-wide">MV CONSULTORIOS</h1>
               <p className="text-sm text-gray-600 font-medium mt-1">Consultorios privados</p>
             </div>
           </div>
         </div>
       </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-gray-800 mb-6">
            Nuestros Profesionales
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Reserva tu turno con nuestros especialistas de confianza. 
            Atención personalizada y profesional en todas nuestras especialidades.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search className="text-mv-beige w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Buscar especialidad o profesional..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-mv-beige/40 rounded-3xl focus:outline-none focus:ring-2 focus:ring-mv-beige/50 focus:border-mv-beige/60 shadow-lg hover:shadow-xl transition-all duration-300 text-lg text-gray-800 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Specialties Grid - MOBILE OPTIMIZED - FORCE DEPLOY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredSpecialties.map((specialty) => (
            <div key={specialty.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group min-h-[200px] flex flex-col">
              <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between h-full">
                <div className="text-center flex-1 flex flex-col justify-center">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 leading-tight min-h-[4rem] flex items-center justify-center px-1 break-words hyphens-auto">
                    {specialty.name}
                  </h3>
                  <div className="flex items-center justify-center text-xs text-gray-600 mb-3">
                    <User className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="font-medium text-xs leading-tight break-words">{specialty.professional}</span>
                  </div>
                </div>
                
                <div className="mt-auto pt-2">
                  <button
                    onClick={() => handleBooking(specialty)}
                    className="w-full bg-gradient-to-r from-mv-beige to-mv-gray hover:from-mv-gray hover:to-mv-beige text-gray-800 font-medium py-2 px-2 sm:px-3 rounded-xl transition-all duration-200 flex items-center justify-center group-hover:scale-105 shadow-sm hover:shadow-md text-xs"
                  >
                    <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span>Reservar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSpecialties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No se encontraron especialidades
            </h3>
            <p className="text-gray-500">
              Intenta con otros términos de búsqueda o elimina los filtros aplicados.
            </p>
          </div>
        )}
      </main>

      {/* Professional Footer */}
      <footer className="bg-gradient-to-r from-mv-light via-white to-mv-beige text-gray-800 mt-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logo and Description */}
            <div>
              <div className="mb-4">
                <h3 className="text-2xl font-light text-gray-800 tracking-wide">MV CONSULTORIOS</h3>
                <p className="text-gray-600 text-sm font-medium">Consultorios privados</p>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Brindamos atención médica de calidad con profesionales especializados en diversas áreas. 
                Nuestro compromiso es ofrecer un servicio personalizado y profesional para el cuidado de tu salud.
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-light text-gray-800 mb-4">Información de Contacto</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-pink-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 text-sm font-medium">Dirección</p>
                    <p className="text-gray-600 text-sm">{contactInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MessageCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 text-sm font-medium">WhatsApp</p>
                    <a href={`https://wa.me/54${contactInfo.phone}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 text-sm hover:text-gray-800 transition-colors">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a 
          href={`https://wa.me/54${contactInfo.phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>

      {/* Admin Panel Button - Solo visible para administradores */}
      {isAdmin && (
        <div className="fixed bottom-6 left-6 z-40">
          <button
            onClick={() => setShowAdminPanel(true)}
            className="bg-gradient-to-r from-mv-beige to-mv-gray hover:from-mv-gray hover:to-mv-beige text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
            aria-label="Panel de Administración"
            title="Panel de Administración"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Booking Modal */}
      {showModal && selectedSpecialty && (
        <BookingModal 
          specialty={selectedSpecialty} 
          onClose={() => setShowModal(false)} 
        />
      )}

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel 
          onClose={() => setShowAdminPanel(false)} 
        />
      )}

             {/* Admin Mode Indicator */}
       {isAdmin && (
         <div className="fixed top-4 right-4 z-50">
           <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center space-x-2">
             <span>🔧 Modo Admin</span>
             <button
               onClick={deactivateAdminMode}
               className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 rounded-full text-xs transition-colors"
               title="Salir del modo admin (Ctrl + Shift + D)"
             >
               ✕
             </button>
           </div>
         </div>
       )}

       {/* Password Modal */}
       {showPasswordModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
             <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-semibold text-gray-800">
                   Acceso Administrador
                 </h2>
                 <button
                   onClick={() => {
                     setShowPasswordModal(false);
                     setPasswordInput('');
                   }}
                   className="text-gray-400 hover:text-gray-600 transition-colors"
                 >
                   <X className="w-6 h-6" />
                 </button>
               </div>

               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">
                     Clave de Administrador
                   </label>
                                       <input
                      type="text"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          verifyPassword();
                        }
                      }}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mv-beige/50 focus:border-mv-beige transition-all duration-300 text-gray-800"
                      placeholder="Ingresa la clave"
                      autoFocus
                    />
                 </div>

                 <div className="flex space-x-3">
                   <button
                     onClick={verifyPassword}
                     className="flex-1 bg-gradient-to-r from-mv-beige to-mv-gray hover:from-mv-gray hover:to-mv-beige text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                   >
                     Verificar
                   </button>
                   <button
                     onClick={() => {
                       setShowPasswordModal(false);
                       setPasswordInput('');
                     }}
                     className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-xl transition-all duration-300"
                   >
                     Cancelar
                   </button>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 }

// Booking Modal Component
function BookingModal({ specialty, onClose }: { specialty: any; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    dni: '',
    phone: '',
    date: '',
    time: ''
  });

  const [step, setStep] = useState(1);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [allTimeSlots, setAllTimeSlots] = useState<Array<{time: string, isBooked: boolean}>>([]);



  // Cargar horarios disponibles cuando se selecciona una fecha
  const handleDateChange = (date: string) => {
    setFormData({ ...formData, date });
    if (date) {
      if (isDateAvailable(specialty.id, date)) {
        // Usar la nueva función que filtra horarios pasados para hoy
        const times = getAvailableHoursForDate(specialty.id, date);
        setAvailableTimes(times);
        
        // Cargar todos los horarios con su estado de ocupación
        const allTimes = getAllTimeSlots(specialty.id, date);
        const timeSlotsWithStatus = allTimes.map(time => ({
          time,
          isBooked: isTimeSlotBooked(specialty.id, date, time) || !times.includes(time)
        }));
        setAllTimeSlots(timeSlotsWithStatus);
        
        console.log('📅 Fecha seleccionada:', {
          date,
          dayName: getDayName(date),
          isToday: isToday(date),
          availableTimes: times.length,
          totalTimes: allTimes.length
        });
      } else {
        setAvailableTimes([]);
        setAllTimeSlots([]);
        
        // Mostrar información sobre por qué la fecha no está disponible
        const dayName = getDayName(date);
        const isTodayDate = isToday(date);
        
        if (isTodayDate) {
          console.log('❌ Hoy no está disponible para esta especialidad');
        } else {
          console.log('❌ Fecha no disponible:', { date, dayName });
        }
      }
    } else {
      setAvailableTimes([]);
      setAllTimeSlots([]);
    }
  };

  // Función para obtener todos los horarios de la especialidad (disponibles y ocupados)
  const getAllTimeSlots = (specialtyId: number, date: string) => {
    const specialty = specialties.find(s => s.id === specialtyId);
    if (!specialty) return [];

    // Obtener todos los horarios de la especialidad
    let allTimes: string[] = [];
    
    // Verificar si hay disponibilidad personalizada para esta fecha
    const availabilityUpdates = JSON.parse(localStorage.getItem('availabilityUpdates') || '[]');
    const customAvailability = availabilityUpdates.find((update: any) => 
      update.specialtyId === specialtyId && update.date === date && update.isActive
    );
    
    if (customAvailability) {
      // Usar horarios personalizados
      const startTime = new Date(`2000-01-01 ${customAvailability.startTime}`);
      const endTime = new Date(`2000-01-01 ${customAvailability.endTime}`);
      
      while (startTime < endTime) {
        allTimes.push(startTime.toTimeString().slice(0, 5));
        startTime.setMinutes(startTime.getMinutes() + 30);
      }
    } else {
      // Usar horarios por defecto de la especialidad
      allTimes = specialty.availableHours;
    }

    return allTimes;
  };

  // Función para verificar si un horario está ocupado
  const isTimeSlotBooked = (specialtyId: number, date: string, time: string) => {
    // Verificar en localStorage
    const localAppointments = JSON.parse(localStorage.getItem('mv-appointments') || '[]');
    const isBookedLocal = localAppointments.some((app: any) => 
      app.specialtyId === specialtyId && 
      app.date === date && 
      app.time === time && 
      app.status !== 'cancelled'
    );
    
    // Verificar en Supabase (si está disponible)
    const supabaseAppointments = getAllAppointments();
    const isBookedSupabase = supabaseAppointments.some((app: any) => 
      app.specialtyId === specialtyId && 
      app.date === date && 
      app.time === time && 
      app.status !== 'cancelled'
    );
    
    return isBookedLocal || isBookedSupabase;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar DNI (8 dígitos numéricos)
    const dniRegex = /^\d{8}$/;
    if (!dniRegex.test(formData.dni)) {
      alert('El DNI debe tener exactamente 8 dígitos numéricos.');
      return;
    }
    
    // Validar teléfono (10 dígitos numéricos)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert('El teléfono debe tener exactamente 10 dígitos numéricos.');
      return;
    }
    
    // Validar que la fecha sea válida antes de enviar
    if (!isDateAvailable(specialty.id, formData.date)) {
      alert('Por favor selecciona una fecha válida donde el profesional atienda.');
      return;
    }
    
    // Validar que el horario no esté ocupado
    if (isTimeSlotBooked(specialty.id, formData.date, formData.time)) {
      alert('El horario seleccionado ya está ocupado. Por favor selecciona otro horario.');
      return;
    }
    
    try {
      // Crear el turno en el sistema
      const newAppointment = await createAppointment({
        specialtyId: specialty.id,
        patientName: `${formData.name} ${formData.lastName}`,
        patientPhone: formData.phone,
        patientEmail: '', // No requerimos email
        date: formData.date,
        time: formData.time,
        status: 'pending',
        notes: `DNI: ${formData.dni}`
      });

      // Enviar notificación al consultorio por WhatsApp
      // La notificación ya se envía automáticamente desde createAppointment
      
      setStep(2);
    } catch (error) {
      console.error('Error al crear el turno:', error);
      alert('Error al crear el turno. Por favor intenta nuevamente.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {step === 1 ? 'Reservar Turno' : 'Confirmación'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Especialidad seleccionada */}
              <div className="bg-gradient-to-br from-mv-beige/20 to-mv-gray/20 p-4 rounded-2xl border border-mv-beige/30">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Especialidad Seleccionada
                </label>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-mv-beige to-mv-gray p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{specialty.name}</p>
                    <p className="text-sm text-gray-600">{specialty.professional}</p>
                  </div>
                </div>
              </div>

              {/* Datos personales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-mv-beige" />
                  Datos Personales
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mv-beige/50 focus:border-mv-beige transition-all duration-300 group-hover:border-mv-beige/30 text-gray-800"
                        placeholder="Tu nombre"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-gray-400 group-focus-within:text-mv-beige transition-colors" />
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Apellido *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mv-beige/50 focus:border-mv-beige transition-all duration-300 group-hover:border-mv-beige/30 text-gray-800"
                        placeholder="Tu apellido"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-gray-400 group-focus-within:text-mv-beige transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="group">
                     <label className="block text-sm font-semibold text-gray-700 mb-2">
                       DNI *
                     </label>
                     <div className="relative">
                       <input
                         type="text"
                         required
                         maxLength={8}
                         value={formData.dni}
                         onChange={(e) => {
                           const value = e.target.value.replace(/\D/g, ''); // Solo números
                           setFormData({ ...formData, dni: value });
                         }}
                         className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mv-beige/50 focus:border-mv-beige transition-all duration-300 group-hover:border-mv-beige/30 text-gray-800 ${
                           formData.dni.length === 8 ? 'border-green-300' : formData.dni.length > 0 ? 'border-red-300' : 'border-gray-200'
                         }`}
                         placeholder="12345678"
                       />
                       <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                         <div className={`w-4 h-4 rounded-sm transition-colors ${
                           formData.dni.length === 8 ? 'bg-green-500' : formData.dni.length > 0 ? 'bg-red-500' : 'bg-gray-400'
                         }`}></div>
                       </div>
                     </div>
                     {formData.dni.length > 0 && formData.dni.length !== 8 && (
                       <p className="text-red-500 text-xs mt-1">El DNI debe tener exactamente 8 dígitos</p>
                     )}
                   </div>

                                     <div className="group">
                     <label className="block text-sm font-semibold text-gray-700 mb-2">
                       Teléfono *
                     </label>
                     <div className="relative">
                       <input
                         type="tel"
                         required
                         maxLength={10}
                         value={formData.phone}
                         onChange={(e) => {
                           const value = e.target.value.replace(/\D/g, ''); // Solo números
                           setFormData({ ...formData, phone: value });
                         }}
                         className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mv-beige/50 focus:border-mv-beige transition-all duration-300 group-hover:border-mv-beige/30 text-gray-800 ${
                           formData.phone.length === 10 ? 'border-green-300' : formData.phone.length > 0 ? 'border-red-300' : 'border-gray-200'
                         }`}
                         placeholder="2473454605"
                       />
                       <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                         <Phone className={`w-4 h-4 transition-colors ${
                           formData.phone.length === 10 ? 'text-green-500' : formData.phone.length > 0 ? 'text-red-500' : 'text-gray-400'
                         }`} />
                       </div>
                     </div>
                     {formData.phone.length > 0 && formData.phone.length !== 10 && (
                       <p className="text-red-500 text-xs mt-1">El teléfono debe tener exactamente 10 dígitos</p>
                     )}
                   </div>
                </div>
              </div>

              {/* Fecha y horario */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-mv-beige" />
                  Fecha y Horario
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fecha de atención *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mv-beige/50 focus:border-mv-beige transition-all duration-300 group-hover:border-mv-beige/30 text-gray-800"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Calendar className="w-4 h-4 text-gray-400 group-focus-within:text-mv-beige transition-colors" />
                      </div>
                    </div>
                    {formData.date && !isDateAvailable(specialty.id, formData.date) && (
                      <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-amber-700 text-sm flex items-center">
                          <span className="mr-2">ℹ️</span>
                          {isToday(formData.date) 
                            ? 'El profesional no atiende hoy. Selecciona otro día para ver horarios disponibles.'
                            : getDayName(formData.date) === 'Sábado' || getDayName(formData.date) === 'Domingo'
                            ? `No se atiende los ${getDayName(formData.date)}s. Selecciona un día de lunes a viernes.`
                            : 'El profesional no atiende en esta fecha. Selecciona otro día para ver horarios disponibles.'
                          }
                        </p>
                      </div>
                    )}
                    
                    {formData.date && isDateAvailable(specialty.id, formData.date) && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm flex items-center">
                          <span className="mr-2">✅</span>
                          {isToday(formData.date) 
                            ? `Hoy (${getDayName(formData.date)}) - Solo horarios futuros disponibles`
                            : `${getDayName(formData.date)} - Fecha disponible`
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Horario preferido *
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mv-beige/50 focus:border-mv-beige transition-all duration-300 group-hover:border-mv-beige/30 appearance-none text-gray-800"
                      >
                        <option value="">Seleccionar horario</option>
                        {formData.date && isDateAvailable(specialty.id, formData.date) ? (
                          allTimeSlots.map((slot) => (
                            <option 
                              key={slot.time} 
                              value={slot.time}
                              disabled={slot.isBooked}
                              className={slot.isBooked ? 'text-gray-400 bg-gray-100' : ''}
                            >
                              {slot.time} {slot.isBooked ? ' - OCUPADO' : ''}
                            </option>
                          ))
                        ) : (
                          availableTimes.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))
                        )}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Clock className="w-4 h-4 text-gray-400 group-focus-within:text-mv-beige transition-colors" />
                      </div>
                    </div>
                    {formData.date && isDateAvailable(specialty.id, formData.date) && (
                      <div className="mt-2 text-xs text-gray-600">
                        <p>💡 Los horarios marcados como "OCUPADO" no están disponibles</p>
                        {isToday(formData.date) && (
                          <p className="text-amber-600 mt-1">⏰ Solo se muestran horarios futuros (con 30 min de anticipación)</p>
                        )}
                        <div className="mt-1 flex items-center space-x-4">
                          <span className="flex items-center">
                            <div className="w-3 h-3 bg-green-400 rounded-full mr-1"></div>
                            Disponible: {allTimeSlots.filter(slot => !slot.isBooked).length}
                          </span>
                          <span className="flex items-center">
                            <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
                            Ocupado: {allTimeSlots.filter(slot => slot.isBooked).length}
                          </span>
                          {isToday(formData.date) && (
                            <span className="flex items-center">
                              <div className="w-3 h-3 bg-gray-400 rounded-full mr-1"></div>
                              Pasado: {allTimeSlots.length - availableTimes.length}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Botón de reserva */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-mv-beige to-mv-gray hover:from-mv-gray hover:to-mv-beige text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Reservar Turno</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="text-lg font-medium text-green-800 mb-3">
                   ¡Turno reservado exitosamente! ✅
                </h3>
                <p className="text-green-700 text-sm leading-relaxed">
                   Tu turno ha sido registrado y se ha enviado una notificación al consultorio. 
                   Recibirás la confirmación por WhatsApp una vez que el consultorio confirme tu turno.
                </p>
              </div>

              <div className="bg-gradient-to-r from-mv-beige to-mv-gray p-4 rounded-xl">
                <h4 className="font-medium text-gray-800 mb-3">Detalles de la reserva:</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Especialidad:</strong> {specialty.name}</p>
                  <p><strong>Profesional:</strong> {specialty.professional}</p>
                  <p><strong>Paciente:</strong> {formData.name} {formData.lastName}</p>
                  <p><strong>DNI:</strong> {formData.dni}</p>
                  <p><strong>Teléfono:</strong> {formData.phone}</p>
                  <p><strong>Fecha:</strong> {formData.date}</p>
                  <p><strong>Horario:</strong> {formData.time}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Abrir WhatsApp automáticamente
                    const whatsappUrl = `https://wa.me/54${contactInfo.phone}?text=${encodeURIComponent(
                      `Hola! Acabo de reservar un turno para ${specialty.name} con ${specialty.professional} el ${formData.date} a las ${formData.time}. Mi nombre es ${formData.name} ${formData.lastName}, DNI: ${formData.dni}. ¿Podrían confirmarme el turno?`
                    )}`;
                    window.open(whatsappUrl, '_blank');
                    onClose();
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contactar por WhatsApp</span>
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-mv-beige to-mv-gray hover:from-mv-gray hover:to-mv-beige text-gray-800 font-medium py-3 px-4 rounded-xl transition-all duration-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
