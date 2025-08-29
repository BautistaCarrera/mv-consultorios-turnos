'use client';

import { useState } from 'react';
import { X, Database, Upload, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { migrateAllDataToSupabase, hasLocalStorageData, clearLocalStorageAfterMigration } from '../lib/migration';

interface MigrationPanelProps {
  onClose: () => void;
}

export default function MigrationPanel({ onClose }: MigrationPanelProps) {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleMigration = async () => {
    if (!confirm('¿Estás seguro de que quieres migrar todos los datos a Supabase? Esta acción no se puede deshacer.')) {
      return;
    }

    setIsMigrating(true);
    setMigrationResult(null);

    try {
      const result = await migrateAllDataToSupabase();
      setMigrationResult(result);

      if (result.success) {
        setShowSuccess(true);
        // Limpiar localStorage después de migración exitosa
        clearLocalStorageAfterMigration();
      }
    } catch (error) {
      console.error('Error en migración:', error);
      setMigrationResult({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const hasData = hasLocalStorageData();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Migración a Supabase</h2>
                <p className="text-gray-600 mt-1">Migrar datos del localStorage a base de datos real</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!hasData ? (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No hay datos para migrar</h3>
              <p className="text-gray-600">
                No se encontraron datos en el localStorage para migrar a Supabase.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Database className="w-6 h-6 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-800 mb-1">Datos encontrados para migrar</h3>
                    <p className="text-blue-700 text-sm">
                      Se encontraron datos en el localStorage que pueden ser migrados a Supabase para tener una base de datos real y persistente.
                    </p>
                  </div>
                </div>
              </div>

              {!migrationResult && !isMigrating && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-1">⚠️ Importante</h4>
                        <ul className="text-yellow-700 text-sm space-y-1">
                          <li>• Esta acción migrará todos los datos del localStorage a Supabase</li>
                          <li>• Los datos se mantendrán en el localStorage como respaldo</li>
                          <li>• Después de la migración exitosa, se limpiará el localStorage</li>
                          <li>• Asegúrate de tener configuradas las credenciales de Supabase</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleMigration}
                    disabled={isMigrating}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isMigrating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Migrando datos...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Iniciar Migración</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {isMigrating && (
                <div className="text-center py-8">
                  <RefreshCw className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Migrando datos...</h3>
                  <p className="text-gray-600">
                    Por favor espera mientras se migran los datos a Supabase.
                  </p>
                </div>
              )}

              {migrationResult && (
                <div className="space-y-4">
                  {migrationResult.success ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-800 mb-2">✅ Migración exitosa</h4>
                          <div className="text-green-700 text-sm space-y-1">
                            <p><strong>Usuarios:</strong> {migrationResult.users.count} migrados</p>
                            <p><strong>Turnos:</strong> {migrationResult.appointments.count} migrados</p>
                            <p><strong>Disponibilidad:</strong> {migrationResult.availability.count} migradas</p>
                          </div>
                          {migrationResult.users.errors.length > 0 && (
                            <div className="mt-3">
                              <p className="text-yellow-700 text-sm">
                                <strong>Advertencias:</strong> {migrationResult.users.errors.length} errores menores
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-800 mb-2">❌ Error en la migración</h4>
                          <p className="text-red-700 text-sm">
                            {migrationResult.error || 'Ocurrió un error durante la migración'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={onClose}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-medium transition-colors"
                    >
                      Cerrar
                    </button>
                    {!migrationResult.success && (
                      <button
                        onClick={handleMigration}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-medium transition-colors"
                      >
                        Reintentar
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
