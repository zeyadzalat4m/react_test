import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLogout, getStoredUser } from '../hooks/useAuth';
import LanguageSwitcher from './LanguageSwitcher';

const navItems = [
  { labelKey: 'dashboard', path: '/dashboard', icon: '📊' },
  { labelKey: 'inventory', path: '/inventory', icon: '📦' },
  { labelKey: 'orders', path: '/orders', icon: '📋' },
  { labelKey: 'suppliers', path: '/suppliers', icon: '🚚' },
];

interface AppShellProps {
  children: React.ReactNode;
}

function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const user = getStoredUser();
  const logout = useLogout();

  const handleLogout = () => {
    logout();
  };

  const isRTL = i18n.language === 'ar';

  return (
    <div className={`flex h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-64 bg-white shadow-lg transform ${
          mobileOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 bg-primary-600">
            <h1 className="text-xl font-bold text-white">{t('warehouseApp')}</h1>
          </div>
          <div className="flex-1 px-4 py-6">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.labelKey}
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-primary-600 transition-colors duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className={`${isRTL ? 'ml-3' : 'mr-3'} text-lg`}>{item.icon}</span>
                  {t(item.labelKey)}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <LanguageSwitcher />
            </div>
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Signed in as</p>
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                title={t('logout')}
              >
                🚪
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={`flex-1 ${isRTL ? 'md:mr-0' : 'md:ml-0'}`}>
        <main className="h-full overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
