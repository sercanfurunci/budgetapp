import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, token, login } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileError("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileError(data.message || "Güncelleme hatası");
      } else {
        setProfileMsg("Profil başarıyla güncellendi!");
        login(token, { username: data.username, email: data.email });
      }
    } catch (err) {
      setProfileError("Sunucuya ulaşılamıyor");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordError("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.message || "Şifre değiştirme hatası");
      } else {
        setPasswordMsg("Şifre başarıyla değiştirildi!");
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (err) {
      setPasswordError("Sunucuya ulaşılamıyor");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
      <div className="bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-amber-300 text-center">
          Profilim
        </h2>
        <form onSubmit={handleProfileUpdate} className="mb-8">
          <div className="mb-4">
            <label className="block mb-1 text-amber-200">Kullanıcı Adı</label>
            <input
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-amber-200">Email</label>
            <input
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {profileError && <p className="text-red-400 mb-2">{profileError}</p>}
          {profileMsg && <p className="text-green-400 mb-2">{profileMsg}</p>}
          <button
            type="submit"
            className="w-full bg-amber-400 text-black font-bold py-2 rounded hover:bg-amber-500 transition"
          >
            Bilgilerimi Güncelle
          </button>
        </form>
        <form onSubmit={handlePasswordChange}>
          <h3 className="text-lg font-semibold mb-2 text-amber-200">
            Şifre Değiştir
          </h3>
          <div className="mb-3">
            <label className="block mb-1">Mevcut Şifre</label>
            <input
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Yeni Şifre</label>
            <input
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          {passwordError && (
            <p className="text-red-400 mb-2">{passwordError}</p>
          )}
          {passwordMsg && <p className="text-green-400 mb-2">{passwordMsg}</p>}
          <button
            type="submit"
            className="w-full bg-amber-400 text-black font-bold py-2 rounded hover:bg-amber-500 transition"
          >
            Şifreyi Değiştir
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
