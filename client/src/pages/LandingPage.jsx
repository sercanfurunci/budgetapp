import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function LandingPage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-200 to-amber-400 text-black px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center drop-shadow-lg">
        Harcamalarını Kolayca Takip Et!
      </h1>
      <p className="text-lg md:text-xl mb-10 text-center max-w-xl">
        Kişisel bütçeni yönet, gelir ve giderlerini kaydet, finansal hedeflerine
        ulaş. Hemen ücretsiz kaydol ve harcamalarını kontrol altına al!
      </p>
      {!user && (
        <div className="flex gap-4">
          <Link to="/register">
            <button className="px-6 py-2 bg-black text-amber-200 rounded-lg font-semibold shadow hover:bg-amber-900 transition">
              Kayıt Ol
            </button>
          </Link>
          <Link to="/login">
            <button className="px-6 py-2 bg-white text-black border border-black rounded-lg font-semibold shadow hover:bg-amber-100 transition">
              Giriş Yap
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
