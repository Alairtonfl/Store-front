import React, { useContext } from 'react';
import { AuthContext } from '../Contexts/AuthContext';

interface NavbarProps {
  actionButton?: React.ReactNode;
  onActionClick?: () => void; // função passada de fora
}

export default function Navbar({ actionButton, onActionClick }: NavbarProps) {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {actionButton && (
          <div onClick={onActionClick} className="cursor-pointer">
            {actionButton}
          </div>
        )}

        <div>
          {user && (
            <svg
              onClick={handleLogout}
              className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
              />
            </svg>
          )}
        </div>
      </div>
    </nav>
  );
}
