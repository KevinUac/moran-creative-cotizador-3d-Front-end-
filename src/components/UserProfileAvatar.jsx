import { useState, useRef } from 'react';
import { LuCamera, LuX, LuLogOut, LuUser } from 'react-icons/lu';
import api from '../api/axios';

export default function UserProfileAvatar() {
  const [avatar, setAvatar] = useState('https://i.pravatar.cc/32');
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const fileInputRef = useRef(null);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')) || null; }
    catch { return null; }
  })();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

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

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : '?';

  return (
    <>
      {/* Avatar con dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(prev => !prev)}
          className="relative w-9 h-9 rounded-full overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
          title={user?.name || 'Usuario'}
        >
          {avatar !== 'https://i.pravatar.cc/32' ? (
            <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-xs font-black">{initials}</span>
          )}
        </button>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-100 w-56 z-50 overflow-hidden animate-fadeIn">
            {/* Info del usuario */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-black">{initials}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Usuario'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                </div>
              </div>
            </div>

            {/* Opciones */}
            <button
              onClick={() => { setShowDropdown(false); setShowModal(true); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LuCamera size={16} className="text-gray-400" />
              Cambiar foto
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
            >
              <LuLogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        )}

        {/* Click fuera para cerrar */}
        {showDropdown && (
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
        )}
      </div>

      {/* Modal cambio de foto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Cambiar foto de perfil</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <LuX size={20} />
              </button>
            </div>

            <div className="mb-4 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                {avatar !== 'https://i.pravatar.cc/32'
                  ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                  : <span className="text-white text-2xl font-black">{initials}</span>
                }
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Sube una imagen</label>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-sm text-gray-600"
              >
                Seleccionar archivo
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">O pega una URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://..."
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleUrlSubmit()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button onClick={handleUrlSubmit} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm">
                  Usar
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}