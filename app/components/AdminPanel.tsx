'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Save, X, Plus, Trash, Edit, Users, Database, Upload } from 'lucide-react';
import { specialties, contactInfo } from '../data/specialties';
import UsersPanel from './UsersPanel';
import MigrationPanel from './MigrationPanel';
import { clearUsersDatabase, forceClearUsersDatabase } from '../data/users';

interface AvailabilityUpdate {
  specialtyId: number;
  date: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null);
  const [availabilityUpdates, setAvailabilityUpdates] = useState<AvailabilityUpdate[]>([]);
  const [newUpdate, setNewUpdate] = useState<AvailabilityUpdate>({
    specialtyId: 0,
    date: '',
    startTime: '08:00',
    endTime: '18:00',
    isActive: true
  });
  const [showUsersPanel, setShowUsersPanel] = useState(false);
  const [showMigrationPanel, setShowMigrationPanel] = useState(false);

  // Cargar actualizaciones guardadas
  useEffect(() => {
    const saved = localStorage.getItem('availabilityUpdates');
    if (saved) {
      setAvailabilityUpdates(JSON.parse(saved));
    }
  }, []);

  // Guardar actualizaciones
  const saveUpdates = (updates: AvailabilityUpdate[]) => {
    localStorage.setItem('availabilityUpdates', JSON.stringify(updates));
    setAvailabilityUpdates(updates);
  };

  // Agregar nueva disponibilidad
  const addAvailability = () => {
    if (newUpdate.specialtyId && newUpdate.date) {
      const updated = [...availabilityUpdates, { ...newUpdate, specialtyId: newUpdate.specialtyId }];
      console.log('💾 Guardando nueva disponibilidad:', newUpdate);
      console.log('📋 Todas las disponibilidades:', updated);
      saveUpdates(updated);
      setNewUpdate({
        specialtyId: 0,
        date: '',
        startTime: '08:00',
        endTime: '18:00',
        isActive: true
      });
    }
  };

  // Eliminar disponibilidad
  const removeAvailability = (index: number) => {
    const updated = availabilityUpdates.filter((_, i) => i !== index);
    saveUpdates(updated);
  };

  // Generar horarios entre startTime y endTime
  const generateTimeSlots = (startTime: string, endTime: string): string[] => {
    const slots: string[] = [];
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    
    while (start < end) {
      slots.push(start.toTimeString().slice(0, 5));
      start.setMinutes(start.getMinutes() + 30);
    }
    
    return slots;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Panel de Administración
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUsersPanel(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Base de Datos</span>
              </button>
              <button
                onClick={() => setShowMigrationPanel(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Migrar a Supabase</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-medium text-blue-800 mb-2">
              📅 Actualizar Disponibilidad de Profesionales
            </h3>
            <p className="text-blue-700 text-sm">
              Aquí puedes agregar fechas específicas donde los profesionales atenderán con horarios personalizados. 
              Por ejemplo: "El Dr. García atenderá el 29 de agosto de 8:00 a 18:00"
            </p>
          </div>

          {/* Formulario para agregar disponibilidad */}
          <div className="bg-gradient-to-br from-mv-beige/20 to-mv-gray/20 p-6 rounded-2xl border border-mv-beige/30 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Plus className="w-5 h-5 mr-2 text-mv-beige" />
              Agregar Nueva Disponibilidad
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Especialidad */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Especialidad *
                </label>
                <select
                  value={newUpdate.specialtyId}
                  onChange={(e) => setNewUpdate({ ...newUpdate, specialtyId: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mv-beige/50 focus:border-mv-beige transition-all duration-300 text-gray-800"
                >
                  <option value={0}>Seleccionar especialidad</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name} - {specialty.professional}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={newUpdate.date}
                  onChange={(e) => setNewUpdate({ ...newUpdate, date: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mv-beige/50 focus:border-mv-beige transition-all duration-300 text-gray-800"
                />
              </div>

              {/* Hora de inicio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hora de inicio
                </label>
                <input
                  type="time"
                  value={newUpdate.startTime}
                  onChange={(e) => setNewUpdate({ ...newUpdate, startTime: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mv-beige/50 focus:border-mv-beige transition-all duration-300 text-gray-800"
                />
              </div>

              {/* Hora de fin */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hora de fin
                </label>
                <input
                  type="time"
                  value={newUpdate.endTime}
                  onChange={(e) => setNewUpdate({ ...newUpdate, endTime: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mv-beige/50 focus:border-mv-beige transition-all duration-300 text-gray-800"
                />
              </div>
            </div>

            {/* Botón agregar */}
            <div className="mt-4">
              <button
                onClick={addAvailability}
                disabled={!newUpdate.specialtyId || !newUpdate.date}
                className="w-full bg-gradient-to-r from-mv-beige to-mv-gray hover:from-mv-gray hover:to-mv-beige text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Agregar Disponibilidad</span>
              </button>
            </div>
          </div>

          {/* Lista de disponibilidades actuales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-mv-beige" />
              Disponibilidades Configuradas
            </h3>

            {availabilityUpdates.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No hay disponibilidades configuradas</p>
                <p className="text-gray-500 text-sm">Agrega la primera disponibilidad arriba</p>
              </div>
            ) : (
              <div className="space-y-3">
                {availabilityUpdates.map((update, index) => {
                  const specialty = specialties.find(s => s.id === update.specialtyId);
                  const timeSlots = generateTimeSlots(update.startTime, update.endTime);
                  
                  return (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-r from-mv-beige to-mv-gray p-2 rounded-lg">
                            <User className="w-4 h-4 text-gray-700" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {specialty?.name} - {specialty?.professional}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {new Date(update.date).toLocaleDateString('es-ES', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeAvailability(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{update.startTime} - {update.endTime}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            {timeSlots.length} horarios disponibles
                          </span>
                        </div>
                      </div>

                      {/* Horarios generados */}
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">Horarios disponibles:</p>
                        <div className="flex flex-wrap gap-1">
                          {timeSlots.slice(0, 6).map((time, i) => (
                            <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {time}
                            </span>
                          ))}
                          {timeSlots.length > 6 && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              +{timeSlots.length - 6} más
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

                     {/* Información adicional */}
           <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
             <h4 className="font-medium text-amber-800 mb-2">💡 Cómo funciona:</h4>
             <ul className="text-amber-700 text-sm space-y-1">
               <li>• Los horarios se generan automáticamente cada 30 minutos</li>
               <li>• Las disponibilidades se guardan en el navegador</li>
               <li>• Los pacientes verán estos horarios al reservar turnos</li>
               <li>• Puedes agregar múltiples fechas para el mismo profesional</li>
             </ul>
           </div>

           {/* Herramientas de administración */}
           <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
             <h4 className="font-medium text-red-800 mb-2">⚠️ Herramientas de Administración:</h4>
                           <div className="flex flex-wrap gap-2">
                <button
                  onClick={clearUsersDatabase}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <Database className="w-4 h-4" />
                  <span>Limpiar Base de Datos</span>
                </button>
                <button
                  onClick={forceClearUsersDatabase}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <Database className="w-4 h-4" />
                  <span>Limpiar Forzado</span>
                </button>
              </div>
             <p className="text-red-700 text-sm mt-2">
               ⚠️ Solo usar si hay problemas con los contadores de turnos
             </p>
           </div>
        </div>
      </div>

      {/* Panel de Usuarios */}
      {showUsersPanel && (
        <UsersPanel onClose={() => setShowUsersPanel(false)} />
      )}

      {/* Panel de Migración */}
      {showMigrationPanel && (
        <MigrationPanel onClose={() => setShowMigrationPanel(false)} />
      )}
    </div>
  );
}
