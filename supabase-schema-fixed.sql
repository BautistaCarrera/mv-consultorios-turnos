-- ===== TABLA DE USUARIOS =====
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  dni VARCHAR(20) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visit TIMESTAMP WITH TIME ZONE,
  total_appointments INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true
);

-- ===== TABLA DE TURNOS (CORREGIDA) =====
CREATE TABLE appointments (
  id VARCHAR(50) PRIMARY KEY, -- Cambiado a VARCHAR para permitir IDs personalizados como "TURNO-001"
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

-- ===== TABLA DE DISPONIBILIDAD PERSONALIZADA =====
CREATE TABLE custom_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  specialty_id VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(specialty_id, date)
);

-- ===== ÍNDICES PARA MEJOR RENDIMIENTO =====
CREATE INDEX idx_users_dni ON users(dni);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_appointments_specialty ON appointments(specialty_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_custom_availability_specialty_date ON custom_availability(specialty_id, date);

-- ===== POLÍTICAS DE SEGURIDAD (RLS) =====
-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_availability ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir todas las operaciones (para desarrollo)
-- En producción, deberías configurar políticas más restrictivas
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on appointments" ON appointments FOR ALL USING (true);
CREATE POLICY "Allow all operations on custom_availability" ON custom_availability FOR ALL USING (true);

-- ===== FUNCIONES ÚTILES =====

-- Función para obtener estadísticas de usuarios
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS TABLE(
  total BIGINT,
  active BIGINT,
  inactive BIGINT,
  new_this_month BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE is_active = true) as active,
    COUNT(*) FILTER (WHERE is_active = false) as inactive,
    COUNT(*) FILTER (WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())) as new_this_month
  FROM users;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener usuarios más frecuentes
CREATE OR REPLACE FUNCTION get_most_frequent_users(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
  id UUID,
  name VARCHAR(255),
  last_name VARCHAR(255),
  total_appointments INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.name, u.last_name, u.total_appointments
  FROM users u
  WHERE u.is_active = true
  ORDER BY u.total_appointments DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
