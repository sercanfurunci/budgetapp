import React, { useState } from "react";
import { useFormik } from "formik";
import { loginFormSchemas } from "../schemas/loginFormSchemas";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (values, action) => {
    setServerError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setServerError(data.message || "Sunucu hatası");
      } else {
        setSuccess("Giriş başarılı!");
        login(data.token, { username: data.username, email: data.email });
        action.resetForm();
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (err) {
      setServerError("Sunucuya ulaşılamıyor");
    }
  };

  const { values, errors, handleChange, handleSubmit, touched } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginFormSchemas,
    onSubmit: submit,
  });

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-gray-900 p-6 rounded-lg shadow-lg"
      >
        <div className="inputDiv mb-4">
          <label className="block mb-1 text-white font-semibold">Email</label>
          <input
            type="text"
            id="email"
            placeholder="Email giriniz"
            value={values.email}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {errors.email && (
            <p className="input-error text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div className="inputDiv mb-6">
          <label className="block mb-1 text-white font-semibold">Şifre</label>
          <input
            type="password"
            id="password"
            placeholder="Şifrenizi giriniz"
            value={values.password}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {errors.password && touched.password && (
            <p className="input-error text-sm mt-1">{errors.password}</p>
          )}
        </div>
        {serverError && (
          <p className="input-error text-sm mb-2">{serverError}</p>
        )}
        {success && <p className="text-green-400 font-bold mb-4">{success}</p>}
        <button
          type="submit"
          className="w-full bg-amber-400 text-black font-bold py-3 rounded hover:bg-amber-500 transition"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
}

export default Login;
