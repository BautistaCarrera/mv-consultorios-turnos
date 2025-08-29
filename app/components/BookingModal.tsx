'use client';

import { useState } from 'react';
import { X, Calendar, Clock, User, Phone, MessageCircle } from 'lucide-react';
import { Specialty, contactInfo } from '../data/specialties';
import { format, addDays, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface BookingModalProps {
  specialty: Specialty | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ specialty, isOpen, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    notes: ''
  });

  const [step, setStep] = useState(1);

  if (!isOpen || !specialty) return null;

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(startOfDay(new Date()), i + 1);
    return format(date, 'yyyy-MM-dd');
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleWhatsAppBooking = () => {
    const message = `Hola! Quiero reservar un turno para ${specialty.name} con ${specialty.professional}.

Datos del paciente:
- Nombre: ${formData.name}
- Teléfono: ${formData.phone}
- Email: ${formData.email}
- Fecha preferida: ${formData.date}
- Horario preferido: ${formData.time}
${formData.notes ? `- Notas: ${formData.notes}` : ''}`;

    const whatsappUrl = `https://wa.me/54${contactInfo.phone.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidad
                </label>
                <div className="bg-mv-light p-3 rounded-md">
                  <p className="font-medium text-gray-800">{specialty.name}</p>
                  <p className="text-sm text-gray-600">{specialty.professional}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mv-beige"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mv-beige"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mv-beige"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha preferida *
                </label>
                <select
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mv-beige"
                >
                  <option value="">Seleccionar fecha</option>
                  {availableDates.map((date) => (
                    <option key={date} value={date}>
                      {format(new Date(date), 'EEEE, d \'de\' MMMM', { locale: es })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horario preferido *
                </label>
                <select
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mv-beige"
                >
                  <option value="">Seleccionar horario</option>
                  {availableTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas adicionales
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mv-beige"
                  placeholder="Información adicional sobre tu consulta..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-mv-beige hover:bg-mv-gray text-gray-800 font-medium py-3 px-4 rounded-md transition-colors duration-200"
              >
                Continuar
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="text-lg font-medium text-green-800 mb-2">
                  ¡Reserva completada!
                </h3>
                <p className="text-green-700">
                  Tu solicitud de turno ha sido registrada. Te contactaremos pronto para confirmar.
                </p>
              </div>

              <div className="bg-mv-light p-4 rounded-md">
                <h4 className="font-medium text-gray-800 mb-3">Detalles de la reserva:</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Especialidad:</strong> {specialty.name}</p>
                  <p><strong>Profesional:</strong> {specialty.professional}</p>
                  <p><strong>Paciente:</strong> {formData.name}</p>
                  <p><strong>Teléfono:</strong> {formData.phone}</p>
                  <p><strong>Fecha:</strong> {formData.date}</p>
                  <p><strong>Horario:</strong> {formData.time}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppBooking}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Confirmar por WhatsApp
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-md transition-colors duration-200"
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
