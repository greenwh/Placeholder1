import { useEffect, useState } from 'react';
import { useAuthStore } from './stores/authStore';
import { PassphraseSetup } from './components/Auth/PassphraseSetup';
import { PassphraseUnlock } from './components/Auth/PassphraseUnlock';
import { Navigation, type Page } from './components/Navigation/Navigation';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Settings } from './components/Settings/Settings';
import { Help } from './components/Help/Help';

function App() {
  const {
    isInitialized,
    isUnlocked,
    isFirstTimeSetup,
    isLoading,
    initialize,
    setupPassphrase,
    unlock,
  } = useAuthStore();

  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4" />
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (isFirstTimeSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Welcome to SSA Form-Assist</h1>
            <p className="text-text-muted">Let's get started by setting up your secure passphrase</p>
          </div>
          <PassphraseSetup
            onComplete={async (_salt) => {
              const passphrase = prompt('Re-enter passphrase to continue (temporary):');
              if (passphrase) {
                await setupPassphrase(passphrase);
              }
            }}
          />
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return <PassphraseUnlock onUnlock={unlock} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <Help />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
