# 🔧 Configuración de Variables de Entorno

## 📝 Crear archivo .env.local

Crea un archivo llamado `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
# Variables de Entorno - MV Consultorios
# Configuración de Supabase
NEXT_PUBLIC_SUPABASE_URL=https://uxjfcdpsrmdvsebjaofp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4amZjZHBzcm1kdnNlYmphb2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzOTk3NTQsImV4cCI6MjA3MTk3NTc1NH0.RmjP7O4gbqg9ZJYm847EaL87tQ90tEPYhV_geZr9kHU

# WhatsApp Business API (Configurar cuando tengas el número real)
# WHATSAPP_API_URL=https://graph.facebook.com/v18.0
# WHATSAPP_API_TOKEN=tu_token_aqui
# WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id

# Configuración del Sitio
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=MV Consultorios
```

## 🚀 Pasos para Configurar

1. **Crear el archivo .env.local** con el contenido arriba
2. **Ejecutar el script de verificación:**
   ```bash
   npm run prepare-production
   ```
3. **Probar la aplicación:**
   ```bash
   npm run build
   npm run start
   ```

## 📋 Variables Explicadas

### Supabase (Base de Datos)
- `NEXT_PUBLIC_SUPABASE_URL`: URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave pública de Supabase

### WhatsApp Business API (Opcional)
- `WHATSAPP_API_URL`: URL de la API de WhatsApp
- `WHATSAPP_API_TOKEN`: Token de acceso
- `WHATSAPP_PHONE_NUMBER_ID`: ID del número de teléfono

### Sitio Web
- `NEXT_PUBLIC_SITE_URL`: URL de tu sitio web
- `NEXT_PUBLIC_SITE_NAME`: Nombre del sitio

## 🔒 Seguridad

- **NUNCA** subas el archivo `.env.local` a GitHub
- **SÍ** sube `.env.example` como referencia
- Las variables con `NEXT_PUBLIC_` son visibles en el navegador
- Las variables sin `NEXT_PUBLIC_` son solo del servidor
