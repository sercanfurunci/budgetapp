import React, { useState } from "react";
import { useFormik } from "formik";
import { registerFormSchemas } from "../schemas/registerFormSchemas";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const submit = async (values, action) => {
    setServerError("");
    setSuccess("");
    try {
      const response = await fetch("http://localhost:5050/api/auth/register", {
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
    <div className="bg-black min-h-screen flex flex-col items-center justify-center">
      <form className="w-[500px]" onSubmit={handleSubmit}>
        <div className="inputDiv">
          <label>Kullanıcı Adı</label>
          <input
            type="text"
            id="username"
            placeholder="Kullanıcı adı giriniz"
            value={values.username}
            onChange={handleChange}
          />
          {errors.username && <p className="input-error">{errors.username}</p>}
        </div>
        <div className="inputDiv">
          <label>Email</label>
          <input
            type="text"
            id="email"
            placeholder="Email giriniz"
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && <p className="input-error">{errors.email}</p>}
        </div>
        <div className="inputDiv">
          <label>Şifre</label>
          <input
            type="password"
            id="password"
            placeholder="Şifrenizi giriniz"
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && touched.password && (
            <p className="input-error">{errors.password}</p>
          )}
        </div>
        <div>
          <label>Şifre Tekrar</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Şifrenizi tekrar giriniz"
            value={values.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && touched.confirmPassword && (
            <p className="input-error">{errors.confirmPassword}</p>
          )}
        </div>
        <div className="inputDiv">
          <div className="flex items-start justify-start">
            <input
              type="checkbox"
              id="term"
              checked={values.term}
              onChange={handleChange}
              style={{ width: "20px", height: "12px" }}
            />
            <label className="ml-2">Kullanıcı sözleşmesini kabul ediyorum</label>
          </div>
          {errors.term && touched.term && (
            <p className="input-error">{errors.term}</p>
          )}
        </div>
        {serverError && <p className="input-error">{serverError}</p>}
        {success && <p className="text-green-400 font-bold mb-2">{success}</p>}
        <button type="submit" className="saveButton">
          Kaydet
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
