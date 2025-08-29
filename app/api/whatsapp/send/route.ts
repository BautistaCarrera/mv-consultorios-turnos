import { NextRequest, NextResponse } from 'next/server';

// Configuración de WhatsApp Business API
// Nota: Necesitas configurar estas variables en tu .env.local
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json();

    // Validar que tengamos las credenciales necesarias
    if (!WHATSAPP_API_URL || !WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
      console.log('⚠️ WhatsApp Business API no configurada, usando método alternativo');
      
      // Método alternativo: usar API pública de WhatsApp
      const whatsappUrl = `https://wa.me/54${to}?text=${encodeURIComponent(message)}`;
      
      return NextResponse.json({ 
        success: true, 
        message: 'Mensaje preparado para envío',
        whatsappUrl,
        note: 'Se requiere configuración de WhatsApp Business API para envío directo'
      });
    }

    // Envío directo usando WhatsApp Business API
    const response = await fetch(`${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: `54${to}`,
        type: 'text',
        text: { body: message }
      })
    });

    if (response.ok) {
      const result = await response.json();
      return NextResponse.json({ 
        success: true, 
        message: 'Mensaje enviado exitosamente',
        data: result 
      });
    } else {
      const error = await response.text();
      console.error('Error enviando mensaje WhatsApp:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Error enviando mensaje' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error en API WhatsApp:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}
