import * as yup from "yup";

export const loginFormSchemas = yup.object().shape({
  email: yup
    .string()
    .email("Geçerli bir email giriniz")
    .required("Email adresi zorunlu"),
  password: yup
    .string()
    .required("Şifre alanı zorunlu"),
}); 