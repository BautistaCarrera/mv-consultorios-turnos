# MV Consultorios - Sistema de Reserva de Turnos

Una aplicación web moderna para reservar turnos en MV consultorios, desarrollada con Next.js, TypeScript y Tailwind CSS.

## 🌐 **Aplicación en Producción**

**URL de la aplicación:** [https://mv-consultorios-turnos.vercel.app](https://mv-consultorios-turnos.vercel.app)

> ⚠️ **Nota:** Reemplaza la URL anterior con la URL real de tu aplicación en Vercel

## Características

- 🏥 **17 especialidades médicas** con sus respectivos profesionales
- 📅 **Sistema de reserva intuitivo** con selección de fecha y horario
- 🔍 **Búsqueda y filtros** para encontrar especialidades rápidamente
- 💬 **Integración con WhatsApp** para confirmación de turnos
- 📱 **Diseño responsive** que funciona en todos los dispositivos
- 🎨 **Colores personalizados** de MV consultorios

## Especialidades Disponibles

- Cardiología - Ciro Carrillo
- Cosmetología - Melisa Ministeri
- Depilación Definitiva
- Dermatología - Carolina Moreno
- Ecografías - David Barroso / Andrea Lerea
- Endocrinología - Jorgelina Notarpasquale
- Entrenamiento - Florencia Colleri
- Fonoaudiología - Rosana Allega
- Gastroenterología - Juan Costanzi
- Masoterapia/Otros - Erica Sanchez
- Nutrición - Valentina Rossi
- Otorrinolaringología - Mariano Garcia
- Plantillas - Martin Besson
- Psicología - Luciana Jacquelin
- Psicopedagogía - Luisina Morgado
- Psiquiatría - Federico Canga
- Yoga - Carina Frattesi

## Tecnologías Utilizadas

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS
- **Lucide React** - Iconos
- **date-fns** - Manejo de fechas

## Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd mv-consultorios-turnos
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

## Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en modo producción
- `npm run lint` - Ejecuta el linter

## Estructura del Proyecto

```
├── app/
│   ├── components/          # Componentes reutilizables
│   │   ├── Header.tsx      # Encabezado con logo y contacto
│   │   ├── SpecialtyCard.tsx # Tarjeta de especialidad
│   │   └── BookingModal.tsx # Modal de reserva
│   ├── data/
│   │   └── specialties.ts  # Datos de especialidades
│   ├── globals.css         # Estilos globales
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página principal
├── public/                 # Archivos estáticos
└── package.json           # Dependencias y scripts
```

## Colores Personalizados

La aplicación utiliza los colores oficiales de MV consultorios:

- **MV Beige**: `#E3DBD0` - Color principal
- **MV Light**: `#F4F4F4` - Color de fondo
- **MV Gray**: `#CBC7C1` - Color de hover

## Funcionalidades

### Búsqueda y Filtros
- Búsqueda por nombre de especialidad o profesional
- Filtros por categorías principales
- Interfaz intuitiva y responsive

### Sistema de Reserva
- Formulario completo con datos del paciente
- Selección de fecha (próximos 14 días)
- Selección de horario disponible
- Notas adicionales opcionales

### Integración WhatsApp
- Generación automática de mensaje con datos de la reserva
- Enlace directo a WhatsApp con el número de contacto
- Formato profesional del mensaje

## Contacto

**MV Consultorios**
- 📍 San Martín 891 - Wheelwright, Sta Fe
- 📞 2473454605
- 💬 Turnos por WhatsApp: wa.link/g61gw1

## Licencia

Este proyecto es privado y pertenece a MV consultorios.
