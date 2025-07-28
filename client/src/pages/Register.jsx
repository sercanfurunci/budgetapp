import React, { useState } from "react";
import { useFormik } from "formik";
import { registerFormSchemas } from "../schemas/registerFormSchemas";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function RegisterForm() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const submit = async (values, action) => {
    setServerError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setServerError(data.message || "Sunucu hatası");
      } else {
        setSuccess("Kayıt başarılı! Giriş yapabilirsiniz.");
        action.resetForm();
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      setServerError("Sunucuya ulaşılamıyor");
    }
  };

  const { values, errors, handleChange, handleSubmit, touched } = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      term: false,
    },
    validationSchema: registerFormSchemas,
    onSubmit: submit,
  });

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-gray-900 p-6 rounded-lg shadow-lg"
      >
        <div className="inputDiv mb-4">
          <label className="block mb-1 text-white font-semibold">
            Kullanıcı Adı
          </label>
          <input
            type="text"
            id="username"
            placeholder="Kullanıcı adı giriniz"
            value={values.username}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {errors.username && (
            <p className="input-error text-sm mt-1">{errors.username}</p>
          )}
        </div>
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
        <div className="inputDiv mb-4">
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
        <div className="inputDiv mb-4">
          <label className="block mb-1 text-white font-semibold">
            Şifre Tekrar
          </label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Şifrenizi tekrar giriniz"
            value={values.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {errors.confirmPassword && touched.confirmPassword && (
            <p className="input-error text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>
        <div className="inputDiv mb-6 flex items-center">
          <input
            type="checkbox"
            id="term"
            checked={values.term}
            onChange={handleChange}
            className="w-5 h-5 text-amber-400 bg-gray-800 border-gray-700 rounded focus:ring-amber-400"
          />
          <label htmlFor="term" className="ml-3 text-white select-none">
            Kullanıcı sözleşmesini kabul ediyorum
          </label>
        </div>
        {errors.term && touched.term && (
          <p className="input-error text-sm mb-2">{errors.term}</p>
        )}
        {serverError && (
          <p className="input-error text-sm mb-2">{serverError}</p>
        )}
        {success && <p className="text-green-400 font-bold mb-4">{success}</p>}
        <button
          type="submit"
          className="w-full bg-amber-400 text-black font-bold py-3 rounded hover:bg-amber-500 transition"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
