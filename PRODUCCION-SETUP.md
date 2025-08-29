# 🚀 Guía de Preparación para Producción - MV Consultorios

## 📋 Checklist de Preparación

### ✅ 1. Variables de Entorno para Producción

Crear archivo `.env.production` con:

```env
# Supabase (Base de datos)
NEXT_PUBLIC_SUPABASE_URL=https://uxjfcdpsrmdvsebjaofp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4amZjZHBzcm1kdnNlYmphb2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzOTk3NTQsImV4cCI6MjA3MTk3NTc1NH0.RmjP7O4gbqg9ZJYm847EaL87tQ90tEPYhV_geZr9kHU

# WhatsApp Business API (Configurar cuando tengas el número real)
# WHATSAPP_API_URL=https://graph.facebook.com/v18.0
# WHATSAPP_API_TOKEN=tu_token_aqui
# WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id

# Configuración del Sitio
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NEXT_PUBLIC_SITE_NAME=MV Consultorios
```

### ✅ 2. Actualizar Datos del Consultorio

En `app/data/specialties.ts`, actualizar:

```typescript
export const contactInfo: ContactInfo = {
  address: "TU_DIRECCION_REAL_AQUI",
  phone: "TU_TELEFONO_REAL_AQUI", // Sin código de país
  whatsapp: "TU_TELEFONO_REAL_AQUI",
  whatsappLink: "wa.me/54TU_TELEFONO_REAL_AQUI"
};
```

### ✅ 3. Configurar Dominio y Hosting

#### Opción A: Vercel (Recomendado)
1. Crear cuenta en [vercel.com](https://vercel.com)
2. Conectar repositorio de GitHub
3. Configurar variables de entorno en Vercel Dashboard
4. Configurar dominio personalizado

#### Opción B: Netlify
1. Crear cuenta en [netlify.com](https://netlify.com)
2. Conectar repositorio
3. Configurar variables de entorno
4. Configurar dominio

### ✅ 4. Configurar WhatsApp Business API

1. **Crear cuenta de WhatsApp Business**
2. **Obtener credenciales:**
   - API URL
   - Access Token
   - Phone Number ID
3. **Actualizar variables de entorno**
4. **Probar envío de mensajes**

### ✅ 5. Configurar Base de Datos (Supabase)

1. **Verificar configuración actual:**
   - URL: https://uxjfcdpsrmdvsebjaofp.supabase.co
   - Anon Key: (ya configurado)
2. **Configurar Row Level Security (RLS)**
3. **Crear backups automáticos**
4. **Configurar monitoreo**

### ✅ 6. Configurar SSL y Seguridad

1. **Certificado SSL automático** (Vercel/Netlify lo manejan)
2. **Configurar headers de seguridad**
3. **Configurar CSP (Content Security Policy)**

### ✅ 7. Configurar Analytics y Monitoreo

#### Google Analytics
```html
<!-- Agregar en layout.tsx -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

#### Monitoreo de Errores
- Sentry.io
- LogRocket
- Vercel Analytics

### ✅ 8. Optimizaciones de Rendimiento

1. **Optimizar imágenes**
2. **Configurar cache**
3. **Minificar CSS/JS**
4. **Configurar CDN**

### ✅ 9. Configurar Backup y Recuperación

1. **Backup automático de base de datos**
2. **Backup de código**
3. **Plan de recuperación**

### ✅ 10. Configurar Notificaciones

1. **Notificaciones de errores**
2. **Monitoreo de uptime**
3. **Alertas de rendimiento**

## 🔧 Comandos para Despliegue

### Preparar para producción:
```bash
npm run build
npm run start
```

### Verificar build:
```bash
npm run lint
npm run type-check
```

## 📱 Configuración Post-Despliegue

### 1. Verificar Funcionalidades:
- [ ] Reserva de turnos funciona
- [ ] WhatsApp notifications llegan
- [ ] Panel de admin funciona
- [ ] Base de datos conectada
- [ ] Formularios validan correctamente

### 2. Configurar SEO:
- [ ] Meta tags optimizados
- [ ] Sitemap generado
- [ ] Robots.txt configurado
- [ ] Google Search Console

### 3. Configurar Redes Sociales:
- [ ] Open Graph tags
- [ ] Twitter Cards
- [ ] Favicon configurado

## 🚨 Consideraciones de Seguridad

1. **Variables de entorno** nunca en código
2. **API keys** rotadas regularmente
3. **Backups** automáticos
4. **Monitoreo** de acceso
5. **Actualizaciones** regulares

## 📞 Soporte y Mantenimiento

1. **Documentación** actualizada
2. **Plan de respaldo** establecido
3. **Contacto de soporte** configurado
4. **Procedimientos de emergencia** documentados

---

## 🎯 Próximos Pasos

1. **Elegir plataforma de hosting** (Vercel recomendado)
2. **Configurar dominio**
3. **Actualizar datos del consultorio**
4. **Configurar WhatsApp Business API**
5. **Probar en producción**
6. **Configurar analytics**

¿Necesitas ayuda con algún paso específico?
