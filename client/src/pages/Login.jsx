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
    <div className="bg-black min-h-screen flex flex-col items-center justify-center">
      <form className="w-[500px]" onSubmit={handleSubmit}>
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
        {serverError && <p className="input-error">{serverError}</p>}
        {success && <p className="text-green-400 font-bold mb-2">{success}</p>}
        <button type="submit" className="saveButton">
          Giriş Yap
        </button>
      </form>
    </div>
  );
}

export default Login;
