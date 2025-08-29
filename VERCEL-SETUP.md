# 🚀 Guía de Configuración de Vercel - MV Consultorios

## 📋 Pasos para Configurar Vercel

### **Paso 1: Login en Vercel CLI**
```bash
vercel
```

Selecciona una opción de login:
- **Continue with GitHub** (recomendado)
- **Continue with Google**
- **Continue with Email**

### **Paso 2: Configuración del Proyecto**
Cuando Vercel te pregunte:

1. **¿Vincular con proyecto existente?** → **N** (No)
2. **Scope** → Selecciona tu cuenta
3. **Nombre del proyecto** → `mv-consultorios`
4. **Directorio del código** → **Enter** (raíz)
5. **¿Sobrescribir configuración?** → **N** (No)

### **Paso 3: Configurar Variables de Entorno**

Después del despliegue, ve al [Dashboard de Vercel](https://vercel.com/dashboard):

1. **Selecciona tu proyecto** `mv-consultorios`
2. **Ve a Settings** → **Environment Variables**
3. **Agrega estas variables:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://uxjfcdpsrmdvsebjaofp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4amZjZHBzcm1kdnNlYmphb2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzOTk3NTQsImV4cCI6MjA3MTk3NTc1NH0.RmjP7O4gbqg9ZJYm847EaL87tQ90tEPYhV_geZr9kHU
```

4. **Selecciona todos los environments** (Production, Preview, Development)
5. **Click en Save**

### **Paso 4: Configurar Dominio Personalizado (Opcional)**

1. **Ve a Settings** → **Domains**
2. **Agrega tu dominio** (ej: mvconsultorios.com)
3. **Configura los registros DNS** según las instrucciones de Vercel

### **Paso 5: Verificar el Despliegue**

1. **Ve a la URL** que te dio Vercel (ej: https://mv-consultorios.vercel.app)
2. **Prueba todas las funcionalidades:**
   - Reserva de turnos
   - Panel de administración
   - WhatsApp notifications
   - Base de datos

## 🔧 Comandos Útiles

### **Desplegar manualmente:**
```bash
vercel --prod
```

### **Ver logs:**
```bash
vercel logs
```

### **Configurar variables desde CLI:**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 📱 URLs Importantes

- **Dashboard de Vercel:** https://vercel.com/dashboard
- **Tu proyecto:** https://mv-consultorios.vercel.app (después del despliegue)
- **Supabase Dashboard:** https://supabase.com/dashboard

## ✅ Checklist de Verificación

- [ ] Login en Vercel completado
- [ ] Proyecto creado
- [ ] Variables de entorno configuradas
- [ ] Despliegue exitoso
- [ ] Funcionalidades probadas
- [ ] Dominio configurado (opcional)

---

**¿Necesitas ayuda con algún paso específico?**
