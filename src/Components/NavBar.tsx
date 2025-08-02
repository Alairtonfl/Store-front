// src/Components/Navbar.tsx
import React, { useContext } from 'react';
import { AuthContext } from '../Contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    // Pode adicionar redirecionamento depois, se quiser
  };

  return (
    <nav className="bg-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">Store</div>
        <ul className="flex space-x-6">
          <li>
            <a href="/" className="hover:text-blue-400 transition">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/clientes" className="hover:text-blue-400 transition">
              Clientes
            </a>
          </li>
          {/* Outros links que desejar */}
        </ul>
        <div>
          {user && (
            <button
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition"
              type="button"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
