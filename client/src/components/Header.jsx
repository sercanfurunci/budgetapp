import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header className="w-full bg-black text-amber-200 shadow-md py-4 px-6 flex items-center justify-between relative z-50">
      <Link
        to="/"
        className="text-2xl font-bold tracking-tight hover:text-amber-400 transition"
        onClick={() => setMenuOpen(false)}
      >
        BudgetApp
      </Link>

      {/* Hamburger butonu (mobil için) */}
      <button
        className="sm:hidden text-amber-400 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menüyü Aç"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {menuOpen ? (
            <path d="M6 18L18 6M6 6l12 12" /> // Çarpı ikonu
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" /> // Hamburger ikonu
          )}
        </svg>
      </button>

      {/* Menü - sm ve üstü için flex, mobil için aşağı açılır panel */}
      <nav
        className={`sm:flex sm:flex-row sm:items-center sm:static absolute top-full left-0 w-full bg-black sm:bg-transparent border-t border-gray-700 sm:border-none transition-transform duration-300 ease-in-out
          ${
            menuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        style={{ zIndex: 100 }}
      >
        {user ? (
          <>
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 hover:text-amber-400 transition border-b border-gray-700 sm:border-none sm:inline-block"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 hover:text-amber-400 transition border-b border-gray-700 sm:border-none sm:inline-block"
            >
              Profilim
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-6 py-3 text-red-400 hover:text-red-500 transition border-b border-gray-700 sm:border-none sm:inline-block"
            >
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 hover:text-amber-400 transition border-b border-gray-700 sm:border-none sm:inline-block"
            >
              Kayıt Ol
            </Link>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 hover:text-amber-400 transition border-b border-gray-700 sm:border-none sm:inline-block"
            >
              Giriş Yap
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
