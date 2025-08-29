# 🚀 Configuración Completa de Supabase para MV Consultorios

## 📋 Pasos para Configurar Supabase

### 1. Crear Cuenta en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Inicia sesión con GitHub o crea una cuenta
4. Haz clic en "New Project"

### 2. Configurar el Proyecto

1. **Nombre del proyecto:** `mv-consultorios`
2. **Contraseña de la base de datos:** (guarda esta contraseña)
3. **Región:** Elige la más cercana a Argentina
4. Haz clic en "Create new project"

### 3. Obtener Credenciales

1. Ve a **Settings** → **API**
2. Copia:
   - **Project URL** (ej: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (empieza con `eyJ...`)

### 4. Configurar Variables de Entorno

1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega las credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
```

### 5. Crear las Tablas en Supabase

1. Ve a **SQL Editor** en Supabase
2. Copia y pega el contenido del archivo `supabase-schema.sql`
3. Haz clic en "Run" para ejecutar el script

### 6. Verificar la Configuración

1. Reinicia el servidor de desarrollo:
```bash
npm run dev
```

2. Abre la aplicación y verifica que no hay errores en la consola

## 🗄️ Estructura de la Base de Datos

### Tabla: `users`
- `id` - UUID único
- `name` - Nombre del paciente
- `last_name` - Apellido del paciente
- `dni` - DNI único
- `phone` - Teléfono único
- `email` - Email (opcional)
- `created_at` - Fecha de registro
- `last_visit` - Última visita
- `total_appointments` - Total de turnos
- `is_active` - Estado activo/inactivo

### Tabla: `appointments`
- `id` - UUID único
- `specialty_id` - ID de la especialidad
- `patient_name` - Nombre del paciente
- `patient_phone` - Teléfono del paciente
- `patient_email` - Email del paciente
- `date` - Fecha del turno
- `time` - Hora del turno
- `status` - Estado (pending/confirmed/cancelled/completed)
- `notes` - Notas adicionales
- `created_at` - Fecha de creación
- `reminder_sent` - Recordatorio enviado

### Tabla: `custom_availability`
- `id` - UUID único
- `specialty_id` - ID de la especialidad
- `date` - Fecha
- `start_time` - Hora de inicio
- `end_time` - Hora de fin
- `created_at` - Fecha de creación

## 🔄 Migración de Datos

### Migrar desde localStorage

1. Abre el panel de administración (Ctrl + M + V + Enter)
2. Haz clic en "Migrar a Supabase"
3. Confirma la migración
4. Los datos se migrarán automáticamente

### Verificar Migración

1. Ve a **Table Editor** en Supabase
2. Verifica que las tablas tienen datos
3. Revisa que no hay errores en la consola

## 🚀 Despliegue en Producción

### 1. Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Agrega las variables de entorno en Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Despliega automáticamente

### 2. Netlify

1. Conecta tu repositorio a Netlify
2. Agrega las variables de entorno
3. Configura el build command: `npm run build`

## 🔧 Funcionalidades Disponibles

### ✅ Base de Datos Real
- Datos persistentes en la nube
- Backup automático
- Acceso desde cualquier lugar
- Escalable automáticamente

### ✅ Panel de Administración
- Gestión de usuarios
- Gestión de turnos
- Disponibilidad personalizada
- Estadísticas en tiempo real

### ✅ Migración Automática
- Migración desde localStorage
- Preservación de datos existentes
- Verificación de integridad

## 🛠️ Solución de Problemas

### Error: "Invalid API key"
- Verifica que las credenciales estén correctas
- Asegúrate de usar la clave "anon public"

### Error: "Table does not exist"
- Ejecuta el script SQL en Supabase
- Verifica que las tablas se crearon correctamente

### Error: "Network error"
- Verifica tu conexión a internet
- Revisa que la URL de Supabase sea correcta

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador
2. Verifica las credenciales de Supabase
3. Asegúrate de que las tablas existan

## 🎉 ¡Listo!

Una vez configurado, tu aplicación tendrá:
- ✅ Base de datos real y persistente
- ✅ Datos seguros en la nube
- ✅ Acceso desde cualquier dispositivo
- ✅ Escalabilidad automática
- ✅ Backup automático

¡Tu consultorio ahora tiene una base de datos profesional!
