'use client';

import { useState, useEffect } from 'react';
import { Search, Calendar, User, Phone, Mail, Clock, CheckCircle, XCircle, AlertCircle, Filter, Download } from 'lucide-react';
import { Appointment } from '../data/specialties';
import { getAllAppointments, searchAppointments, filterAppointmentsByStatus, filterAppointmentsByDate, cancelAppointment, confirmAppointment, completeAppointment, sendReminderNotification } from '../utils/appointmentManager';
import { specialties } from '../data/specialties';

interface AppointmentHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppointmentHistory({ isOpen, onClose }: AppointmentHistoryProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Appointment['status'] | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAppointments();
    }
  }, [isOpen]);

  const loadAppointments = () => {
    let filteredAppointments = getAllAppointments();

    // Aplicar filtros
    if (searchTerm) {
      filteredAppointments = searchAppointments(searchTerm);
    }

    if (statusFilter !== 'all') {
      filteredAppointments = filteredAppointments.filter(app => app.status === statusFilter);
    }

    if (dateFilter) {
      filteredAppointments = filteredAppointments.filter(app => app.date === dateFilter);
    }

    setAppointments(filteredAppointments);
  };

  const handleSearch = () => {
    loadAppointments();
  };

  const handleStatusChange = (status: Appointment['status'] | 'all') => {
    setStatusFilter(status);
    loadAppointments();
  };

  const handleDateChange = (date: string) => {
    setDateFilter(date);
    loadAppointments();
  };

  const handleCancelAppointment = (appointmentId: string) => {
    if (cancelAppointment(appointmentId)) {
      loadAppointments();
    }
  };

  const handleConfirmAppointment = (appointmentId: string) => {
    if (confirmAppointment(appointmentId)) {
      loadAppointments();
    }
  };

  const handleCompleteAppointment = (appointmentId: string) => {
    if (completeAppointment(appointmentId)) {
      loadAppointments();
    }
  };

  const handleSendReminder = (appointment: Appointment) => {
    sendReminderNotification(appointment);
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'cancelled':
        return 'Cancelado';
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSpecialtyName = (specialtyId: number) => {
    const specialty = specialties.find(s => s.id === specialtyId);
    return specialty?.name || 'Especialidad no encontrada';
  };

  const getProfessionalName = (specialtyId: number) => {
    const specialty = specialties.find(s => s.id === specialtyId);
    return specialty?.professional || 'Profesional no encontrado';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-light text-gray-800">Historial de Consultas</h2>
            <p className="text-gray-600 text-sm">Gestiona todos los turnos y consultas</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre, teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mv-beige focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value as Appointment['status'] | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mv-beige focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmado</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>

            {/* Date Filter */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => handleDateChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mv-beige focus:border-transparent"
            />

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-mv-beige to-mv-gray hover:from-mv-gray hover:to-mv-beige text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No se encontraron consultas
              </h3>
              <p className="text-gray-500">
                No hay consultas que coincidan con los filtros aplicados.
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid gap-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-800">
                            {appointment.patientName}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(appointment.status)}`}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1">{getStatusText(appointment.status)}</span>
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-mv-beige" />
                            <span>{formatDate(appointment.date)} - {appointment.time}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-mv-beige" />
                            <span>{getSpecialtyName(appointment.specialtyId)}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-mv-beige" />
                            <span>{appointment.patientPhone}</span>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="mt-2 text-sm text-gray-500">
                            <strong>Notas:</strong> {appointment.notes}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleConfirmAppointment(appointment.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs transition-colors"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs transition-colors"
                            >
                              Cancelar
                            </button>
                          </>
                        )}

                        {appointment.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => handleCompleteAppointment(appointment.id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs transition-colors"
                            >
                              Completar
                            </button>
                            <button
                              onClick={() => handleSendReminder(appointment)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs transition-colors"
                            >
                              Recordatorio
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => setSelectedAppointment(appointment)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-xs transition-colors"
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-sm">
              Total de consultas: {appointments.length}
            </p>
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
