import { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Auth from './pages/Auth';
import MainMenu from './pages/MainMenu';
import Upload from './pages/Upload';
import Designs from './pages/Designs';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('auth');

  const handleNavigate = (page) => {
    if (page === 'upload' && !isAuthenticated) {
      setCurrentPage('auth');
    } else {
      setCurrentPage(page);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('mainmenu');
  };

  return (
    <LanguageProvider>
      <div className="App">
        {currentPage === 'auth' && <Auth onLogin={handleLogin} />}
        {currentPage === 'mainmenu' && <MainMenu onNavigate={handleNavigate} />}
        {currentPage === 'upload' && isAuthenticated && <Upload onNavigate={handleNavigate} />}
        {currentPage === 'designs' && isAuthenticated && <Designs onNavigate={handleNavigate} />}
      </div>
    </LanguageProvider>
  );
}

export default App;