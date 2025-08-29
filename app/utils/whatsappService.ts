// Servicio para enviar mensajes directamente a WhatsApp
// Nota: Para que funcione completamente, necesitas configurar WhatsApp Business API

interface WhatsAppMessage {
  to: string;
  message: string;
  type: 'text' | 'template';
}

// Función para enviar mensaje directo a WhatsApp
export const sendDirectWhatsAppMessage = async (phoneNumber: string, message: string): Promise<boolean> => {
  try {
    console.log('📱 Iniciando envío de WhatsApp...');
    
    // Método directo y simple
    const whatsappUrl = `https://wa.me/54${phoneNumber}?text=${encodeURIComponent(message)}`;
    console.log('📱 URL de WhatsApp:', whatsappUrl);
    
    if (typeof window !== 'undefined') {
      console.log('📱 Abriendo WhatsApp...');
      window.open(whatsappUrl, '_blank');
      console.log('✅ WhatsApp abierto exitosamente');
      return true;
    } else {
      console.log('❌ No se puede abrir WhatsApp (no es cliente)');
      return false;
    }
  } catch (error) {
    console.error('❌ Error enviando mensaje WhatsApp:', error);
    return false;
  }
};

// Función para enviar notificación al consultorio
export const sendConsultorioNotificationDirect = async (appointmentData: {
  patientName: string;
  patientPhone: string;
  dni: string;
  date: string;
  time: string;
  specialty: string;
  professional: string;
  appointmentId: string;
}): Promise<boolean> => {
  console.log('📱 sendConsultorioNotificationDirect iniciado');
  
  // Generar ID de paciente único
  const dniSuffix = appointmentData.dni.slice(-4);
  const phoneSuffix = appointmentData.patientPhone.slice(-4);
  const patientId = `PAC-${dniSuffix}-${phoneSuffix}`;
  
  const message = `NUEVA RESERVA DE TURNO - MV CONSULTORIOS

Se ha registrado una nueva reserva:

👤 Paciente: ${appointmentData.patientName}
📱 Teléfono: ${appointmentData.patientPhone}
🆔 DNI: ${appointmentData.dni}

📅 Fecha: ${appointmentData.date}
⏰ Horario: ${appointmentData.time}
🏥 Especialidad: ${appointmentData.specialty}
👨‍⚕️ Profesional: ${appointmentData.professional}`;

  console.log('📱 Mensaje preparado:', message);
  console.log('📱 Enviando a número:', '2477504122');
  
  const result = await sendDirectWhatsAppMessage('2477504122', message);
  console.log('📱 Resultado final:', result);
  
  return result;
};

// Función para enviar confirmación al paciente
export const sendPatientConfirmationDirect = async (appointmentData: {
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
  specialty: string;
  professional: string;
  address: string;
  consultorioPhone: string;
}): Promise<boolean> => {
  const message = `✅ TURNO CONFIRMADO - MV CONSULTORIOS

Hola ${appointmentData.patientName}!

Tu turno ha sido confirmado exitosamente:

📅 Fecha: ${appointmentData.date}
⏰ Horario: ${appointmentData.time}
🏥 Especialidad: ${appointmentData.specialty}
👨‍⚕️ Profesional: ${appointmentData.professional}

📍 Dirección: ${appointmentData.address}

Te enviaremos un recordatorio 24 horas antes de tu consulta.

Para cancelar o reprogramar, contáctanos al ${appointmentData.consultorioPhone}

¡Gracias por elegirnos!`;

  return await sendDirectWhatsAppMessage(appointmentData.patientPhone, message);
};
