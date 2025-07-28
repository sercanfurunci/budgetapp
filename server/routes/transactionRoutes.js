const express = require("express");
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

// Tüm işlemleri getir (GET) — sadece login olan kullanıcı görebilir
router.get("/", protect, getTransactions);

// Yeni işlem ekle (POST)
router.post("/", protect, addTransaction);

// İşlem güncelle (PUT)
router.put("/:id", protect, updateTransaction);

// İşlem sil (DELETE)
router.delete("/:id", protect, deleteTransaction);

module.exports = router;
