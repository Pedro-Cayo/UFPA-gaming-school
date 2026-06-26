import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function GameHeader({ 
  title, 
  subtitle = '',
  showLogo = true, 
  showBack = true, 
  backTo = "/aluno",
  showHome = false,
  children,
  icon = null
}) {
  return (
    <header className="header-game sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {showLogo && (
              <img 
                src="/study-ranking-logo.png" 
                alt="Study Ranking Logo" 
                className="h-12 w-12 drop-shadow-lg hover:scale-110 transition transform duration-300"
              />
            )}
            {showBack && (
              <Link 
                to={backTo} 
                className="flex items-center gap-2 hover:bg-white hover:bg-opacity-20 transition p-2 rounded-lg duration-300"
              >
                <ArrowLeft size={20} />
                <span className="text-sm font-semibold hidden sm:inline">Voltar</span>
              </Link>
            )}
            {showHome && (
              <Link 
                to="/" 
                className="flex items-center gap-2 hover:bg-white hover:bg-opacity-20 transition p-2 rounded-lg duration-300"
              >
                <Home size={20} />
                <span className="text-sm font-semibold hidden sm:inline">Início</span>
              </Link>
            )}
          </div>
          {children && <div className="flex gap-2 sm:gap-4">{children}</div>}
        </div>

        {/* Title Section */}
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-3xl animate-bounce-gentle">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-lg">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-base opacity-90 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
