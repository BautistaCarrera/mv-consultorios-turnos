# 🔧 Actualizar Base de Datos Supabase

## ❌ Problema Actual
La tabla `appointments` tiene el campo `id` como UUID automático, pero nuestro código intenta insertar IDs personalizados como "TURNO-001". Esto causa conflictos.

## ✅ Solución
Necesitas actualizar la estructura de la tabla `appointments` en Supabase.

## 📋 Pasos para Actualizar

### 1. Ir al Dashboard de Supabase
- Ve a https://supabase.com/dashboard
- Selecciona tu proyecto: `uxjfcdpsrmdvsebjaofp`

### 2. Ir al SQL Editor
- En el menú lateral, haz clic en "SQL Editor"
- Haz clic en "New query"

### 3. Ejecutar el Script de Actualización
Copia y pega este script:

```sql
-- ===== ACTUALIZAR TABLA APPOINTMENTS =====

-- 1. Crear tabla temporal con la nueva estructura
CREATE TABLE appointments_new (
  id VARCHAR(50) PRIMARY KEY, -- Cambiado a VARCHAR para permitir IDs personalizados
  specialty_id VARCHAR(255) NOT NULL,
  patient_name VARCHAR(255) NOT NULL,
  patient_phone VARCHAR(20) NOT NULL,
  patient_email VARCHAR(255),
  date DATE NOT NULL,
  time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reminder_sent BOOLEAN DEFAULT false
);

-- 2. Copiar datos existentes (si los hay)
INSERT INTO appointments_new 
SELECT 
  'TURNO-' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at), 3, '0') as id,
  specialty_id,
  patient_name,
  patient_phone,
  patient_email,
  date,
  time,
  status,
  notes,
  created_at,
  reminder_sent
FROM appointments;

-- 3. Eliminar tabla antigua
DROP TABLE appointments;

-- 4. Renombrar tabla nueva
ALTER TABLE appointments_new RENAME TO appointments;

-- 5. Recrear índices
CREATE INDEX idx_appointments_specialty ON appointments(specialty_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- 6. Habilitar RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- 7. Recrear políticas
CREATE POLICY "Allow all operations on appointments" ON appointments FOR ALL USING (true);
```

### 4. Ejecutar el Script
- Haz clic en "Run" para ejecutar el script
- Verifica que no haya errores

### 5. Verificar la Actualización
- Ve a "Table Editor" en el menú lateral
- Selecciona la tabla "appointments"
- Verifica que el campo "id" ahora sea de tipo "text" en lugar de "uuid"

## 🎯 Resultado Esperado
Después de la actualización:
- ✅ La tabla `appointments` aceptará IDs personalizados como "TURNO-001"
- ✅ Los turnos se crearán correctamente
- ✅ Los mensajes de WhatsApp mostrarán IDs simples y fáciles de usar

## 🚀 Probar la Aplicación
Una vez actualizada la base de datos:
1. Ve a http://localhost:3000
2. Intenta reservar un turno
3. Debería funcionar sin errores
4. El mensaje de WhatsApp mostrará IDs como "TURNO-001" y "PAC-XXXX-XXXX"
