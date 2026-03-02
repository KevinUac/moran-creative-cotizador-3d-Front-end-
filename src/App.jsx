import { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Auth from './pages/Auth';
import MainMenu from './pages/MainMenu';
import Upload from './pages/Upload';
import Designs from './pages/Designs';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('auth');
  const [navigationData, setNavigationData] = useState(null);

  const handleNavigate = (page, data = null) => {
    setNavigationData(data);
    if ((page === 'upload' || page === 'designs') && !isAuthenticated) {
      setCurrentPage('auth');
    } else {
      setCurrentPage(page);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setNavigationData(null);
    setCurrentPage('mainmenu');
  };

  return (
    <LanguageProvider>
      <div className="App">
        {currentPage === 'auth' && <Auth onLogin={handleLogin} />}
        {currentPage === 'mainmenu' && <MainMenu onNavigate={handleNavigate} navigationData={navigationData} setNavigationData={setNavigationData} />}
        {currentPage === 'upload' && isAuthenticated && <Upload onNavigate={handleNavigate} />}
        {currentPage === 'designs' && <Designs onNavigate={handleNavigate} />}
      </div>
    </LanguageProvider>
  );
}

export default App;