'use client';

import { MessageCircle } from 'lucide-react';
import { contactInfo } from '../data/specialties';

export default function Header() {
  return (
    <header className="bg-mv-beige shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-6">
          {/* Logo */}
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-white rounded-full p-3 mr-4 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-light text-gray-800">MV</div>
                <div className="text-xs font-light text-gray-600 border-t border-gray-300 pt-1">
                  CONSULTORIOS
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-light text-gray-800">MV CONSULTORIOS</h1>
              <p className="text-sm text-gray-600">Consultorios privados</p>
            </div>
          </div>

          {/* WhatsApp Contact */}
          <div className="flex flex-col space-y-2 text-sm">
            <a 
              href={`https://${contactInfo.whatsappLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-green-600 hover:text-green-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              <span>{contactInfo.whatsapp}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
