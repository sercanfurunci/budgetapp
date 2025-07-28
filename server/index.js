const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const path = require("path");



const app = express();

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Tüm gelen istekleri logla
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());


// Route dosyalarını import et
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");



// DB bağlantısı yap ve sonra serverı aç
connectDB()
  .then(() => {
    console.log("MongoDB connected ✅");

    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/transactions", transactionRoutes);

    app.get("/", (req, res) => {
      res.send("Budget API is running");
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error ❌", err);
    process.exit(1);
  });
