import * as React from 'react';
import { Home, Settings as SettingsIcon, HelpCircle, Lock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/authStore';

export type Page = 'dashboard' | 'reports' | 'settings' | 'help';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const { lock } = useAuthStore();

  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: Home },
    { id: 'settings' as Page, label: 'Settings', icon: SettingsIcon },
    { id: 'help' as Page, label: 'Help', icon: HelpCircle },
  ];

  return (
    <>
      {/* Desktop/Tablet Navigation - Top Bar */}
      <nav className="hidden md:block border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-primary">SSA Form-Assist</h1>
              <div className="flex gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                      currentPage === item.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-muted hover:bg-surface hover:text-text'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={lock}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-text-muted hover:bg-surface hover:text-text transition-colors"
            >
              <Lock className="h-4 w-4" />
              Lock
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 safe-area-bottom">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-md transition-colors min-w-[60px]',
                currentPage === item.id
                  ? 'text-primary'
                  : 'text-text-muted'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
          <button
            onClick={lock}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-md text-text-muted transition-colors min-w-[60px]"
          >
            <Lock className="h-6 w-6" />
            <span className="text-xs font-medium">Lock</span>
          </button>
        </div>
      </nav>
    </>
  );
};
