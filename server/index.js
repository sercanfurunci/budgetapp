const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Tüm gelen istekleri logla (API request’leri için)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Route dosyalarını import et
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

// DB bağlantısı yap ve sonra serverı aç
connectDB()
  .then(() => {
    console.log("MongoDB connected ✅");

    // Routes (API’ler önce tanımlanmalı)
    app.use("/api/auth", authRoutes);
    app.use("/api/transactions", transactionRoutes);

    // React build klasörünü statik olarak servis et
    app.use(express.static(path.join(__dirname, "../client/build")));

    // React SPA için tüm diğer GET isteklerini index.html’ye yönlendir
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/build/index.html"));
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error ❌", err);
    process.exit(1);
  });
