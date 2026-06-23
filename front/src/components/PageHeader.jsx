import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PageHeader({ 
  title, 
  showLogo = true, 
  showBack = true, 
  backTo = "/aluno",
  children 
}) {
  return (
    <header className="bg-gradient-to-r from-ufpa-700 via-ufpa-600 to-ufpa-700 text-white shadow-2xl border-b-4 border-ufpa-800">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Logo + Back Button */}
        <div className="flex items-center gap-3 mb-4">
          {showLogo && (
            <img 
              src="/IconeGamificaçãodoEnsino.png" 
              alt="Logo UFPA Gamificação" 
              className="h-12 w-12 drop-shadow-lg hover:scale-110 transition transform"
            />
          )}
          {showBack && (
            <Link 
              to={backTo} 
              className="flex items-center gap-2 hover:opacity-80 transition p-2 rounded-lg hover:bg-ufpa-600"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-semibold">Voltar</span>
            </Link>
          )}
        </div>

        {/* Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-ufpa-100 bg-clip-text text-transparent">
            {title}
          </h1>
          {children && <div className="flex gap-4">{children}</div>}
        </div>
      </div>
    </header>
  );
}