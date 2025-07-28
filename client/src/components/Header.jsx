import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="w-full bg-black text-amber-200 shadow-md py-4 px-6 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold tracking-tight hover:text-amber-400 transition">BudgetApp</Link>
      <nav className="flex gap-4">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-amber-400 transition">Dashboard</Link>
            <Link to="/profile" className="hover:text-amber-400 transition">Profilim</Link>
            <button onClick={handleLogout} className="hover:text-red-400 transition">Çıkış Yap</button>
          </>
        ) : (
          <>
            <Link to="/register" className="hover:text-amber-400 transition">Kayıt Ol</Link>
            <Link to="/login" className="hover:text-amber-400 transition">Giriş Yap</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header; 