import { useState, useRef } from 'react';
import { LuCamera, LuX } from 'react-icons/lu';

export default function UserProfileAvatar() {
  const [avatar, setAvatar] = useState('https://i.pravatar.cc/32');
  const [showModal, setShowModal] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = e => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        setAvatar(event.target?.result);
        setShowModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (photoUrl.trim()) {
      setAvatar(photoUrl);
      setPhotoUrl('');
      setShowModal(false);
    }
  };

  return (
    <>
      {/* Avatar Clickeable */}
      <button
        onClick={() => setShowModal(true)}
        className="relative w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-red-500 transition-all"
        title="Cambiar foto de perfil"
      >
        <img src={avatar} alt="User avatar" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition-all">
          <LuCamera size={12} className="text-white opacity-0 hover:opacity-100" />
        </div>
      </button>

      {/* Modal de Cambio de Foto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-30">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Cambiar foto de perfil</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <LuX size={20} />
              </button>
            </div>

            {/* Preview de Foto Actual */}
            <div className="mb-4 flex justify-center">
              <img
                src={avatar}
                alt="Current avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
            </div>

            {/* Opción 1: Subir Archivo */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Sube una imagen
              </label>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors text-sm text-gray-600"
              >
                Seleccionar archivo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Opción 2: URL de Imagen */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                O pega una URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://..."
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleUrlSubmit()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
                <button
                  onClick={handleUrlSubmit}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                >
                  Usar
                </button>
              </div>
            </div>

            {/* Botón Cancelar */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
