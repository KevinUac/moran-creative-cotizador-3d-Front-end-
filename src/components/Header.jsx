import { FiArrowRight } from 'react-icons/fi';
import moranLogo from '../assets/Moran Creative Logo.png';
import UserProfileAvatar from './UserProfileAvatar';
import OrderHistory from './OrderHistory';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function Header({ onNavigate, currentPage }) {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <img src={moranLogo} alt="Moran Creative" className="h-12 w-auto" />
        <nav className="flex items-center gap-6">
          <button
            className={`text-sm font-medium transition ${currentPage === 'mainmenu'
              ? 'text-blue-600'
              : 'text-gray-700 hover:text-gray-900'
              }`}
            onClick={() => onNavigate?.('mainmenu')}
          >
            {t.inicio}
          </button>
          <button
            className={`text-sm font-medium transition ${currentPage === 'upload'
              ? 'text-blue-600'
              : 'text-gray-700 hover:text-gray-900'
              }`}
            onClick={() => onNavigate?.('upload')}
          >
            {t.subirDiseno}
          </button>
          <button
            className={`text-sm font-medium transition ${currentPage === 'designs'
                ? 'text-blue-600'
                : 'text-gray-700 hover:text-gray-900'
              }`}
            onClick={() => onNavigate?.('designs')}
          >
            {t.disenos}
          </button>
          <div className="h-6 w-px bg-gray-200"></div>
          <OrderHistory />

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm font-medium bg-white border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:border-blue-500 transition-colors text-gray-700"
          >
            <option value="ES">ES</option>
            <option value="EN">EN</option>
          </select>

          <UserProfileAvatar />
        </nav>
      </div>
    </header>
  );
}
