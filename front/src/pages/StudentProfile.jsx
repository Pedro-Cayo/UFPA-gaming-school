import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, LogOut, Save, Camera, AlertCircle } from 'lucide-react';
import { authService } from '../services/api';
import GameCard from '../components/GameCard';
import GameHeader from '../components/GameHeader';
import GameButton from '../components/GameButton';

export default function StudentProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [photoPreview, setPhotoPreview] = useState(user?.photoUrl || null);
  const [uploading, setUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  if (!user || user.userType !== 'aluno') {
    navigate('/login');
    return null;
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          const maxWidth = 300;
          const maxHeight = 300;
          let width = img.width;
          let height = img.height;
          
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
          
          const resizedImage = canvas.toDataURL('image/jpeg', 0.7);
          setPhotoPreview(resizedImage);
          setHasChanges(true);
        };
        
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
      setSaveMessage('✓ Foto atualizada com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar foto:', error);
      setSaveMessage('✗ Erro ao salvar foto');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      {/* Header Gamificado */}
      <GameHeader 
        title="Meu Perfil"
        subtitle={`Gerenciar dados de ${user.name}`}
        showLogo={true}
        showBack={true}
        backTo="/aluno"
        icon={<User size={32} />}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Photo Section */}
        <GameCard glass className="p-8 mb-8">
          <div className="text-center">
            {/* Avatar */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="w-40 h-40 bg-gradient-to-br from-ufpa-600 to-ufpa-800 rounded-full flex items-center justify-center text-white shadow-lg">
                  {photoPreview ? (
                    <img 
                      src={photoPreview} 
                      alt="Perfil" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={80} />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-gamify-gold text-white p-3 rounded-full cursor-pointer hover:shadow-lg transition transform hover:scale-110">
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Photo Actions */}
            <div className="flex gap-3 justify-center mb-4">
              <label className="btn-game btn-game-secondary text-sm cursor-pointer">
                {uploading ? '⏳ Enviando...' : '📸 Alterar Foto'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              {hasChanges && (
                <GameButton
                  onClick={handleSavePhoto}
                  disabled={uploading}
                  variant="success"
                  size="sm"
                  icon={<Save size={16} />}
                >
                  {uploading ? 'Salvando...' : 'Salvar Foto'}
                </GameButton>
              )}
            </div>

            {/* Save Message */}
            {saveMessage && (
              <div className={`text-sm font-medium ${
                saveMessage.includes('✓') ? 'text-green-600' : 'text-red-600'
              }`}>
                {saveMessage}
              </div>
            )}
          </div>
        </GameCard>

        {/* User Info Section */}
        <GameCard glass className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User size={28} className="text-ufpa-600" />
            Informações Pessoais
          </h2>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                👤 Nome Completo
              </label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                <span className="text-gray-700 font-medium">{user.name}</span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                📧 Email
              </label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                <Mail size={18} className="text-ufpa-600 flex-shrink-0" />
                <span className="text-gray-700 break-all">{user.email}</span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                📱 Telefone
              </label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                <Phone size={18} className="text-ufpa-600 flex-shrink-0" />
                <span className="text-gray-700">{user.phone || '—'}</span>
              </div>
            </div>

            {/* Matricula */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                🎫 Matrícula
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                <span className="text-gray-700 font-mono">{user.matricula || '—'}</span>
              </div>
            </div>

            {/* User Type */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                👨‍🎓 Tipo de Usuário
              </label>
              <div className="px-4 py-3 bg-ufpa-50 rounded-lg border-2 border-ufpa-300">
                <span className="badge-achievement text-sm">
                  🎓 Aluno
                </span>
              </div>
            </div>
          </div>
        </GameCard>

        {/* Security Section */}
        <GameCard glass className="p-8 border-l-4 border-red-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle size={28} className="text-red-600" />
            Segurança
          </h2>
          
          <p className="text-gray-600 text-sm mb-6">
            Clique em "Sair" para fazer logout da sua conta. Você será redirecionado para a página de login.
          </p>

          <button
            onClick={handleLogout}
            className="btn-game btn-game-primary w-full flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            Sair da Conta
          </button>
        </GameCard>

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-600 mt-8">
          <p>🔒 Seus dados são protegidos e seguros</p>
        </div>
      </main>
    </div>
  );
}
