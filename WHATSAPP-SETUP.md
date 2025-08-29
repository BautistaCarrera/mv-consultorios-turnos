# 📱 Configuración de WhatsApp Business API

## 🎯 **Para envío directo de mensajes**

### **Opción 1: WhatsApp Business API (Recomendado)**

#### **1. Crear cuenta en Meta for Developers:**
1. Ve a: https://developers.facebook.com/
2. Crea una cuenta de desarrollador
3. Crea una nueva aplicación

#### **2. Configurar WhatsApp Business API:**
1. En tu aplicación, ve a "Productos"
2. Agrega "WhatsApp"
3. Configura tu número de teléfono
4. Obtén las credenciales:
   - **Access Token**
   - **Phone Number ID**

#### **3. Configurar variables de entorno:**
Agrega estas líneas a tu archivo `.env.local`:

```env
# WhatsApp Business API
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_API_TOKEN=tu_access_token_aqui
WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id_aqui
```

### **Opción 2: Servicios de terceros**

#### **Twilio WhatsApp:**
1. Crea cuenta en Twilio
2. Activa WhatsApp Sandbox
3. Usa la API de Twilio para enviar mensajes

#### **MessageBird:**
1. Crea cuenta en MessageBird
2. Configura WhatsApp Business
3. Usa su API para envío directo

### **Opción 3: WhatsApp Cloud API (Más fácil)**

#### **1. Configurar WhatsApp Cloud API:**
1. Ve a: https://developers.facebook.com/apps/
2. Crea una nueva aplicación
3. Agrega "WhatsApp" como producto
4. Configura tu número de teléfono

#### **2. Obtener credenciales:**
- **Access Token** (permanente)
- **Phone Number ID**
- **Business Account ID**

#### **3. Configurar webhook:**
Para recibir respuestas automáticas

## 🔧 **Configuración actual**

### **Método actual (funcionando):**
- ✅ Se abre WhatsApp automáticamente
- ✅ Mensaje pre-llenado
- ✅ Funciona sin configuración adicional

### **Método mejorado (requiere configuración):**
- 🚀 Envío directo sin abrir ventanas
- 🚀 Respuestas automáticas
- 🚀 Integración completa

## 📋 **Pasos para implementar envío directo:**

### **1. Configurar WhatsApp Business API:**
```bash
# Agregar al .env.local
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_API_TOKEN=tu_token_aqui
WHATSAPP_PHONE_NUMBER_ID=tu_id_aqui
```

### **2. Verificar configuración:**
```bash
# Reiniciar servidor
npm run dev
```

### **3. Probar envío:**
- Reserva un turno
- Verifica que llegue directamente al WhatsApp

## 🎯 **Beneficios del envío directo:**

- ✅ **Sin intervención manual**
- ✅ **Mensajes automáticos**
- ✅ **Respuestas programadas**
- ✅ **Integración completa**
- ✅ **Escalabilidad**

## ⚠️ **Notas importantes:**

1. **WhatsApp Business API** requiere aprobación de Meta
2. **Número verificado** necesario
3. **Plantillas de mensaje** para envío automático
4. **Límites de envío** según el plan

## 🚀 **Estado actual:**

- ✅ **Funcionando:** Envío automático con apertura de WhatsApp
- 🔄 **En desarrollo:** Envío directo con API
- 📋 **Pendiente:** Configuración de credenciales

**¡El sistema actual funciona perfectamente! Solo necesitas configurar las credenciales para envío directo.**
