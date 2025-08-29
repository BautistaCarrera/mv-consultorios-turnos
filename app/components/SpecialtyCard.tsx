'use client';

import { Calendar, User, ArrowRight } from 'lucide-react';
import { Specialty } from '../data/specialties';

interface SpecialtyCardProps {
  specialty: Specialty;
  onSelect: (specialty: Specialty) => void;
}

export default function SpecialtyCard({ specialty, onSelect }: SpecialtyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {specialty.name}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <User className="w-4 h-4 mr-2" />
              <span>{specialty.professional}</span>
            </div>
            {specialty.description && (
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {specialty.description}
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={() => onSelect(specialty)}
          className="w-full bg-mv-beige hover:bg-mv-gray text-gray-800 font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center group"
        >
          <Calendar className="w-4 h-4 mr-2" />
          <span>Reservar Turno</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
