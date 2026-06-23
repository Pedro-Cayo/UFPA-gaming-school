import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, Mail, Phone, LogOut, Save } from 'lucide-react';
import { authService } from '../services/api';

export default function StudentProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [photoPreview, setPhotoPreview] = useState(user?.photoUrl || null);
  const [uploading, setUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  if (!user || user.userType !== 'aluno') {
    navigate('/login');
    return null;
  }

const handlePhotoChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      // Redimensionar imagem
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Definir tamanho máximo
        const maxWidth = 300;
        const maxHeight = 300;
        let width = img.width;
        let height = img.height;
        
        // Calcular novo tamanho mantendo proporção
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Converter para base64 com qualidade reduzida
        const resizedImage = canvas.toDataURL('image/jpeg', 0.7);
        setPhotoPreview(resizedImage);
        setHasChanges(true);
      };
      
      // Ler arquivo como Data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    }
  }
};

const handleSavePhoto = async () => {
  if (!photoPreview || !hasChanges) return;
  
  setUploading(true);
  try {
    await authService.updateProfilePhoto(photoPreview);
    setHasChanges(false);
    alert('Foto atualizada com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar foto:', error);
    alert('Erro ao salvar foto');
  } finally {
    setUploading(false);
  }
};

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ufpa-50 to-ufpa-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-ufpa-600 to-ufpa-800 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link to="/aluno" className="flex items-center gap-2 hover:opacity-80 mb-4">
            <ArrowLeft size={20} />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Photo Section */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-ufpa-600 to-ufpa-800 rounded-full flex items-center justify-center text-white">
                {photoPreview ? (
                  <img src={photoPreview} alt="Perfil" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User size={64} />
                )}
              </div>
            </div>

            <label className="bg-gradient-to-r from-ufpa-600 to-ufpa-700 text-white px-6 py-2 rounded-lg hover:from-ufpa-700 hover:to-ufpa-800 transition font-semibold cursor-pointer inline-block mb-4">
              {uploading ? 'Enviando...' : 'Alterar Foto'}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {hasChanges && (
              <button
                onClick={handleSavePhoto}
                disabled={uploading}
                className="ml-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition font-semibold flex items-center gap-2 inline-flex"
              >
                <Save size={20} />
                {uploading ? 'Salvando...' : 'Salvar Foto'}
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Nome Completo</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-300">
                <User size={20} className="text-ufpa-600" />
                <span className="text-gray-700">{user.name}</span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-300">
                <Mail size={20} className="text-ufpa-600" />
                <span className="text-gray-700">{user.email}</span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Telefone</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-300">
                <Phone size={20} className="text-ufpa-600" />
                <span className="text-gray-700">{user.phone || 'Não informado'}</span>
              </div>
            </div>

            {/* Matricula */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Matrícula</label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-300">
                <span className="text-gray-700">{user.matricula || 'Não informado'}</span>
              </div>
            </div>

            {/* User Type */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Tipo de Usuário</label>
              <div className="px-4 py-3 bg-ufpa-50 rounded-lg border border-ufpa-300">
                <span className="text-ufpa-700 font-semibold">Aluno</span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition justify-center"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
