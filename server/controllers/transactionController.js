const Transaction = require("../models/Transaction");

// Kullanıcının tüm işlemlerini getir
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Yeni işlem ekle
const addTransaction = async (req, res) => {
  const { type, amount, description, date } = req.body;

  if (!type || !amount) {
    return res.status(400).json({ message: "Type ve amount zorunlu." });
  }

  try {
    const newTransaction = new Transaction({
      user: req.user.id,
      type,
      amount,
      description,
      date,
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// İşlem güncelle
const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { type, amount, description, date } = req.body;

  try {
    let transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "İşlem bulunamadı" });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Yetkiniz yok" });
    }

    transaction.type = type || transaction.type;
    transaction.amount = amount || transaction.amount;
    transaction.description = description || transaction.description;
    transaction.date = date || transaction.date;

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// İşlem sil
const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "İşlem bulunamadı" });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Yetkiniz yok" });
    }

    await transaction.remove();
    res.json({ message: "İşlem silindi" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
};
