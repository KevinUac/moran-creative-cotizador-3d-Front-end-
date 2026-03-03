import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import api from '../api/axios';

export default function Auth({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const { language, setLanguage } = useLanguage();

  const handleEnterFocus = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const form = e.target.form;
    if (!form) return;
    const focusables = Array.from(form.querySelectorAll('input, button'))
      .filter((el) => !el.disabled && el.type !== 'hidden');
    const idx = focusables.indexOf(e.target);
    if (idx > -1 && idx < focusables.length - 1) {
      const next = focusables[idx + 1];
      next.focus();
      if (next.tagName.toLowerCase() === 'button') next.click();
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Blobs decorativos */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute -left-4 top-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Particle background */}
      <div className="particles" aria-hidden>
        <div className="particle p-sm delay-1" style={{ top: '8%', left: '12%' }} />
        <div className="particle p-md delay-2 alt" style={{ top: '22%', left: '70%' }} />
        <div className="particle p-lg delay-3" style={{ top: '40%', left: '28%' }} />
        <div className="particle p-sm delay-4 alt" style={{ top: '62%', left: '54%' }} />
        <div className="particle p-xl delay-5" style={{ top: '78%', left: '16%' }} />
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="rounded-3xl overflow-hidden shadow-2xl h-[26rem] flex relative">

          {/* LADO IZQUIERDO - Panel Blanco */}
          <div className="w-1/2 bg-white flex flex-col items-center justify-center p-8">
            {!isSignUp ? (
              <>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">{t.iniciarSesion}</h3>
                <p className="text-gray-500 text-sm mb-6">{t.iniciarSesionDesc}</p>

                <div className="flex gap-4 mb-6">
                  <button className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors font-bold text-blue-600">f</button>
                  <button className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors font-bold text-blue-600">🔗</button>
                  <button className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors font-bold text-blue-600">G</button>
                  <button className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors font-bold text-blue-600">in</button>
                </div>

                {/* Formulario Sign In */}
                <form
                  className="w-full space-y-3 max-h-56 overflow-y-auto pr-6"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const inputs   = e.target.querySelectorAll('input');
                    const email    = inputs[0].value;
                    const password = inputs[1].value;
                    try {
                      const { data } = await api.post('/auth/login', { email, password });
                      localStorage.setItem('token', data.token);
                      localStorage.setItem('user', JSON.stringify(data.user));
                      if (onLogin) onLogin(data.user);
                    } catch (err) {
                      alert(err.response?.data?.message || 'Credenciales incorrectas.');
                    }
                  }}
                >
                  <input
                    type="email"
                    placeholder={t.email}
                    onKeyDown={handleEnterFocus}
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                  />
                  <input
                    type="password"
                    placeholder={t.contrasena}
                    onKeyDown={handleEnterFocus}
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                  />
                  <div className="flex justify-end">
                    <a href="#" className="text-blue-600 text-sm font-semibold hover:text-cyan-600 transition">
                      {t.olvidasteContrasena}
                    </a>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-8 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-lg transition-all duration-300"
                  >
                    {t.iniciarSesionBtn}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">{t.crearCuenta}</h3>
                <p className="text-gray-500 text-sm mb-6">{t.crearCuentaDesc}</p>

                <div className="flex gap-4 mb-6">
                  <button className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors font-bold text-blue-600">f</button>
                  <button className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors font-bold text-blue-600">🔗</button>
                  <button className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors font-bold text-blue-600">G</button>
                  <button className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors font-bold text-blue-600">in</button>
                </div>

                {/* Formulario Sign Up */}
                <form
                  className="w-full space-y-3 max-h-56 overflow-y-auto pr-6"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const inputs            = e.target.querySelectorAll('input');
                    const name              = inputs[0].value;
                    const email             = inputs[1].value;
                    const password          = inputs[2].value;
                    const password_confirmation = inputs[3].value;
                    try {
                      const { data } = await api.post('/auth/register', { name, email, password, password_confirmation });
                      localStorage.setItem('token', data.token);
                      localStorage.setItem('user', JSON.stringify(data.user));
                      if (onLogin) onLogin(data.user);
                    } catch (err) {
                      const errors = err.response?.data?.errors;
                      alert(errors ? Object.values(errors).flat().join('\n') : 'Error al registrarse.');
                    }
                  }}
                >
                  <input
                    type="text"
                    placeholder={t.nombreCompleto}
                    onKeyDown={handleEnterFocus}
                    className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                  />
                  <input
                    type="email"
                    placeholder={t.email}
                    onKeyDown={handleEnterFocus}
                    className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                  />
                  <input
                    type="password"
                    placeholder={t.contrasena}
                    onKeyDown={handleEnterFocus}
                    className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                  />
                  <input
                    type="password"
                    placeholder={t.confirmarContrasena}
                    onKeyDown={handleEnterFocus}
                    className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
                  />
                  <button
                    type="submit"
                    className="w-full px-8 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-lg transition-all duration-300"
                  >
                    {t.crearCuentaBtn}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* LADO DERECHO - Panel Azul/Cyan */}
          <div className="w-1/2 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 relative flex items-center justify-center overflow-hidden">

            <div
              style={{
                position: 'absolute',
                opacity: isSignUp ? 0 : 1,
                transition: 'opacity 500ms ease-in-out',
                pointerEvents: isSignUp ? 'none' : 'auto',
              }}
              className="flex flex-col items-center justify-center p-8 text-white w-full h-full"
            >
              <h2 className="text-4xl font-bold mb-4 text-center">{t.bienvenido}</h2>
              <p className="text-center text-blue-100 mb-8 text-lg">{t.bienvenidoDesc}</p>
              <button
                onClick={() => setIsSignUp(true)}
                className="px-8 py-2 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                {t.crearCuentaBtn}
              </button>
            </div>

            <div
              style={{
                position: 'absolute',
                opacity: isSignUp ? 1 : 0,
                transition: 'opacity 500ms ease-in-out',
                pointerEvents: isSignUp ? 'auto' : 'none',
              }}
              className="flex flex-col items-center justify-center p-8 text-white w-full h-full"
            >
              <h2 className="text-4xl font-bold mb-4 text-center">{t.bienvenidoVuelta}</h2>
              <p className="text-center text-blue-100 mb-8 text-lg">{t.conCuenta}</p>
              <button
                onClick={() => setIsSignUp(false)}
                className="px-8 py-2 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                {t.iniciarSesionBtn}
              </button>
            </div>
          </div>

          {/* Language selector */}
          <div className="absolute bottom-6 right-6 z-30">
            <label className="sr-only">Idioma / Language</label>
            <select
              aria-label="Select language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white/20 text-white backdrop-blur-sm rounded-md px-4 py-2 text-sm border border-white/30 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all font-semibold cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              <option value="ES" style={{ color: '#000' }}>ES</option>
              <option value="EN" style={{ color: '#000' }}>EN</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}