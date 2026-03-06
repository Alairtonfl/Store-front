import React, { useContext } from 'react';
import { LogOut } from 'lucide-react';
import { AuthContext } from '../Contexts/AuthContext';

interface NavbarProps {
  actionButton?: React.ReactNode;
  onActionClick?: () => void;
}

export default function Navbar({ actionButton, onActionClick }: NavbarProps) {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-700/50 bg-surface-900/80 backdrop-blur-md shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {actionButton && (
          <div
            onClick={onActionClick}
            className="cursor-pointer p-2 -ml-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onActionClick?.()}
          >
            {actionButton}
          </div>
        )}

        <div className="flex items-center gap-2">
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" strokeWidth={2} />
              <span className="text-sm font-medium hidden sm:inline">Sair</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
