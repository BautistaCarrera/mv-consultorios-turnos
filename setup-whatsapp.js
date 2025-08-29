const fs = require('fs');
const path = require('path');

// Configuración de WhatsApp Business API
const WHATSAPP_CONFIG = {
  API_URL: 'https://graph.facebook.com/v18.0',
  // Estas credenciales las obtienes de Meta for Developers
  ACCESS_TOKEN: 'TU_ACCESS_TOKEN_AQUI',
  PHONE_NUMBER_ID: 'TU_PHONE_NUMBER_ID_AQUI',
  BUSINESS_ACCOUNT_ID: 'TU_BUSINESS_ACCOUNT_ID_AQUI'
};

function setupWhatsAppAPI() {
  console.log('🚀 Configurando WhatsApp Business API...');
  
  // Leer el archivo .env.local actual
  const envPath = path.join(__dirname, '.env.local');
  let envContent = '';
  
  try {
    envContent = fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    console.log('📁 Archivo .env.local no encontrado, creando uno nuevo...');
  }
  
  // Agregar configuración de WhatsApp
  const whatsappConfig = `
# WhatsApp Business API Configuration
WHATSAPP_API_URL=${WHATSAPP_CONFIG.API_URL}
WHATSAPP_API_TOKEN=${WHATSAPP_CONFIG.ACCESS_TOKEN}
WHATSAPP_PHONE_NUMBER_ID=${WHATSAPP_CONFIG.PHONE_NUMBER_ID}
WHATSAPP_BUSINESS_ACCOUNT_ID=${WHATSAPP_CONFIG.BUSINESS_ACCOUNT_ID}`;
  
  // Verificar si ya existe la configuración
  if (envContent.includes('WHATSAPP_API_URL')) {
    console.log('⚠️ Configuración de WhatsApp ya existe en .env.local');
    console.log('📝 Actualiza las credenciales manualmente:');
    console.log(whatsappConfig);
  } else {
    // Agregar al final del archivo
    const newContent = envContent + whatsappConfig;
    fs.writeFileSync(envPath, newContent);
    console.log('✅ Configuración de WhatsApp agregada a .env.local');
  }
  
  console.log('\n📋 Pasos para completar la configuración:');
  console.log('1. Ve a https://developers.facebook.com/');
  console.log('2. Crea una aplicación de tipo "Business"');
  console.log('3. Agrega "WhatsApp" como producto');
  console.log('4. Configura tu número: 2477504122');
  console.log('5. Obtén las credenciales:');
  console.log('   - Access Token (permanente)');
  console.log('   - Phone Number ID');
  console.log('   - Business Account ID');
  console.log('6. Reemplaza los valores en .env.local');
  console.log('7. Reinicia el servidor: npm run dev');
  
  console.log('\n🎯 Una vez configurado:');
  console.log('- Los mensajes se enviarán automáticamente');
  console.log('- Sin abrir ventanas de WhatsApp');
  console.log('- Respuestas automáticas disponibles');
  console.log('- Integración completa con la aplicación');
}

// Función para probar la conexión
async function testWhatsAppConnection() {
  console.log('\n🧪 Probando conexión con WhatsApp Business API...');
  
  try {
    const response = await fetch(`${WHATSAPP_CONFIG.API_URL}/${WHATSAPP_CONFIG.PHONE_NUMBER_ID}`, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_CONFIG.ACCESS_TOKEN}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Conexión exitosa con WhatsApp Business API');
      return true;
    } else {
      console.log('❌ Error en la conexión:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    return false;
  }
}

// Ejecutar configuración
setupWhatsAppAPI();

// Exportar funciones para uso manual
module.exports = {
  setupWhatsAppAPI,
  testWhatsAppConnection,
  WHATSAPP_CONFIG
};
