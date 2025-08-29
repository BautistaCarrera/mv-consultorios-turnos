'use client';

import { useState, useEffect } from 'react';
import { X, Search, User, Phone, Calendar, TrendingUp, Users, Clock, Filter } from 'lucide-react';
import { getAllUsers, searchUsers, getUserStats, getMostFrequentUsers, getRecentUsers, deactivateUser } from '../data/users';

interface UsersPanelProps {
  onClose: () => void;
}

export default function UsersPanel({ onClose }: UsersPanelProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [stats, setStats] = useState<any>({});
  const [mostFrequent, setMostFrequent] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  const loadUsers = () => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
    setMostFrequent(getMostFrequentUsers(5));
    setRecentUsers(getRecentUsers(5));
  };

  const loadStats = () => {
    setStats(getUserStats());
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      const results = searchUsers(term);
      setUsers(results);
    } else {
      setUsers(getAllUsers());
    }
  };

  const handleFilter = (filterType: 'all' | 'active' | 'inactive') => {
    setFilter(filterType);
    const allUsers = getAllUsers();
    
    if (filterType === 'active') {
      setUsers(allUsers.filter(user => user.isActive));
    } else if (filterType === 'inactive') {
      setUsers(allUsers.filter(user => !user.isActive));
    } else {
      setUsers(allUsers);
    }
  };

  const handleDeactivateUser = (userId: string) => {
    if (confirm('¿Estás seguro de que quieres desactivar este usuario?')) {
      deactivateUser(userId);
      loadUsers();
      loadStats();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Base de Datos de Usuarios</h2>
              <p className="text-gray-600 mt-1">Gestión de pacientes registrados</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Usuarios</p>
                  <p className="text-2xl font-bold">{stats.total || 0}</p>
                </div>
                <Users className="w-8 h-8 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Usuarios Activos</p>
                  <p className="text-2xl font-bold">{stats.active || 0}</p>
                </div>
                <User className="w-8 h-8 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Nuevos este Mes</p>
                  <p className="text-2xl font-bold">{stats.newThisMonth || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Usuarios Inactivos</p>
                  <p className="text-2xl font-bold">{stats.inactive || 0}</p>
                </div>
                <Clock className="w-8 h-8 opacity-80" />
              </div>
            </div>
          </div>

          {/* Búsqueda y Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                             <input
                 type="text"
                 placeholder="Buscar por nombre, DNI o teléfono..."
                 value={searchTerm}
                 onChange={(e) => handleSearch(e.target.value)}
                 className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mv-beige/50 focus:border-mv-beige"
               />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-mv-beige text-gray-800' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => handleFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'active' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => handleFilter('inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'inactive' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Inactivos
              </button>
            </div>
          </div>

          {/* Tabla de Usuarios */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                                 <thead className="bg-gray-50">
                   <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Paciente
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       DNI
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Teléfono
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Turnos
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Registro
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Estado
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Acciones
                     </th>
                   </tr>
                 </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                                     {users.map((user) => (
                     <tr key={user.id} className="hover:bg-gray-50">
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div>
                           <div className="text-sm font-medium text-gray-900">
                             {user.name} {user.lastName}
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                         {user.dni}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                         {user.phone}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                           {user.totalAppointments}
                         </span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         {formatDate(user.createdAt)}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                           user.isActive 
                             ? 'bg-green-100 text-green-800' 
                             : 'bg-red-100 text-red-800'
                         }`}>
                           {user.isActive ? 'Activo' : 'Inactivo'}
                         </span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                         {user.isActive && (
                           <button
                             onClick={() => handleDeactivateUser(user.id)}
                             className="text-red-600 hover:text-red-900 transition-colors"
                           >
                             Desactivar
                           </button>
                         )}
                       </td>
                     </tr>
                   ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Usuarios más frecuentes y recientes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Usuarios Más Frecuentes</h3>
              <div className="space-y-3">
                {mostFrequent.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-mv-beige rounded-full flex items-center justify-center text-sm font-medium text-gray-800">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name} {user.lastName}</p>
                        <p className="text-xs text-gray-500">{user.totalAppointments} turnos</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Usuarios Recientes</h3>
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name} {user.lastName}</p>
                        <p className="text-xs text-gray-500">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
