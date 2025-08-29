#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Preparando MV Consultorios para Producción...\n');

// Verificar archivos necesarios
const requiredFiles = [
  '.env.local',
  'app/data/specialties.ts',
  'app/layout.tsx',
  'package.json'
];

console.log('📋 Verificando archivos necesarios...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTANTE`);
  }
});

// Verificar dependencias
console.log('\n📦 Verificando dependencias...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = ['next', 'react', 'react-dom', '@supabase/supabase-js'];
requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
    console.log(`✅ ${dep}`);
  } else {
    console.log(`❌ ${dep} - FALTANTE`);
  }
});

// Verificar configuración de Supabase
console.log('\n🗄️ Verificando configuración de Supabase...');
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  if (envContent.includes('NEXT_PUBLIC_SUPABASE_URL')) {
    console.log('✅ Supabase URL configurada');
  } else {
    console.log('❌ Supabase URL no encontrada');
  }
  if (envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')) {
    console.log('✅ Supabase Anon Key configurada');
  } else {
    console.log('❌ Supabase Anon Key no encontrada');
  }
} catch (error) {
  console.log('❌ Archivo .env.local no encontrado');
}

// Verificar datos del consultorio
console.log('\n🏥 Verificando datos del consultorio...');
try {
  const specialtiesContent = fs.readFileSync('app/data/specialties.ts', 'utf8');
  if (specialtiesContent.includes('contactInfo')) {
    console.log('✅ Datos de contacto configurados');
  } else {
    console.log('❌ Datos de contacto no encontrados');
  }
  if (specialtiesContent.includes('Lic.')) {
    console.log('✅ Títulos profesionales configurados');
  } else {
    console.log('❌ Títulos profesionales no encontrados');
  }
} catch (error) {
  console.log('❌ Error leyendo datos del consultorio');
}

// Verificar configuración de WhatsApp
console.log('\n📱 Verificando configuración de WhatsApp...');
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  if (envContent.includes('WHATSAPP_API_URL')) {
    console.log('✅ WhatsApp API configurada');
  } else {
    console.log('⚠️ WhatsApp API no configurada (opcional)');
  }
} catch (error) {
  console.log('⚠️ WhatsApp API no configurada (opcional)');
}

console.log('\n🎯 Próximos pasos para producción:');
console.log('1. Ejecutar: npm run build');
console.log('2. Ejecutar: npm run start (para probar)');
console.log('3. Configurar hosting (Vercel/Netlify)');
console.log('4. Configurar dominio personalizado');
console.log('5. Configurar variables de entorno en hosting');
console.log('6. Configurar WhatsApp Business API');
console.log('7. Probar todas las funcionalidades');

console.log('\n📚 Documentación completa en: PRODUCCION-SETUP.md');
console.log('✅ Preparación completada!\n');
