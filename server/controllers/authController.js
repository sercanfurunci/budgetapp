const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// JWT token oluşturma fonksiyonu
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Kayıt ol (Register)
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Tüm alanları doldurun." });
  }

  try {
    // Email veya username daha önce kayıtlı mı kontrol et
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Bu email zaten kayıtlı." });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Bu kullanıcı adı alınmış." });
    }

    // Yeni kullanıcı oluştur
    const user = await User.create({ username, email, password });

    // Başarılıysa token ile birlikte dön
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
  console.error("Register error:", error); // <-- Bunu ekle
  res.status(500).json({ message: "Sunucu hatası" });
}
};

// Giriş yap (Login)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email ve şifre gerekli." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Geçersiz email veya şifre." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Geçersiz email veya şifre." });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Kullanıcı profilini güncelle
const updateProfile = async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    if (username) user.username = username;
    if (email) user.email = email;
    await user.save();
    res.json({ username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Şifre değiştirme
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    const isMatch = await require("bcryptjs").compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mevcut şifre yanlış" });
    user.password = newPassword;
    await user.save();
    res.json({ message: "Şifre başarıyla değiştirildi" });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  changePassword,
};
