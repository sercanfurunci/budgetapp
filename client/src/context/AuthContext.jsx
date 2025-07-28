import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userInfo, setUserInfo] = useState(() => {
    const info = localStorage.getItem("userInfo");
    return info ? JSON.parse(info) : null;
  });

  useEffect(() => {
    if (token && userInfo) {
      setUser({ token, ...userInfo });
    } else {
      setUser(null);
    }
  }, [token, userInfo]);

  const login = (token, info) => {
    setToken(token);
    setUserInfo(info);
    localStorage.setItem("token", token);
    localStorage.setItem("userInfo", JSON.stringify(info));
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setUserInfo(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
