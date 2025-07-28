import * as yup from "yup";

export const registerFormSchemas = yup.object().shape({
  username: yup
    .string()
    .required("Kullanıcı adı zorunlu")
    .min(3, "Kullanıcı adı en az 3 karakter olmalı"),
  email: yup
    .string()
    .email("Gecerli bir email giriniz")
    .required("Email adresi zorunlu"),
  password: yup
    .string()
    .required("Sifre alani zorunlu")
    .min(5, "Sifreniz minimum 5 karakter uzunlugunda olmali")
    .matches(/[a-zA-Z]/, "Sifreniz sadece latin harflarindan olusmali"),
  confirmPassword: yup
    .string()
    .required("Sifre tekrari zorunlu")
    .oneOf([yup.ref("password", yup.password)], "Sifreler uyusmuyor"),
  term: yup.boolean().required("Lutfen kutucugu onaylayiniz"),
});
