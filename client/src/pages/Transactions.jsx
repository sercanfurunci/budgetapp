import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
// import DatePicker from 'react-datepicker'; // Eğer kullanacaksan
// import 'react-datepicker/dist/react-datepicker.css';

const Transactions = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Filtreler
  const [filterType, setFilterType] = useState("");
  const [filterDesc, setFilterDesc] = useState("");
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");

  // Edit modal state
  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editType, setEditType] = useState("income");
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  // Özet hesaplamaları
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Backend API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Transaction listesini çek
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions(data);
      } else {
        setError(data.message || "Liste çekme hatası");
      }
    } catch (err) {
      setError("Sunucuya ulaşılamıyor");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Yeni transaction ekle
  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!amount || isNaN(amount)) {
      setError("Tutar geçerli bir sayı olmalı");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          amount: Number(amount),
          description,
          date: date || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Ekleme hatası");
      } else {
        setSuccess("Harcama başarıyla eklendi!");
        setType("income");
        setAmount("");
        setDescription("");
        setDate("");
        fetchTransactions();
      }
    } catch (err) {
      setError("Sunucuya ulaşılamıyor");
    }
  };

  // Transaction sil
  const handleDelete = async (id) => {
    if (!window.confirm("Silmek istediğine emin misin?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchTransactions();
      else {
        const data = await res.json();
        setError(data.message || "Silme hatası");
      }
    } catch (err) {
      setError("Sunucuya ulaşılamıyor");
    }
  };

  // Edit modalını aç
  const openEditModal = (t) => {
    setEditId(t._id);
    setEditType(t.type);
    setEditAmount(t.amount);
    setEditDescription(t.description);
    setEditDate(t.date ? t.date.slice(0, 10) : "");
    setEditError("");
    setEditSuccess("");
    setEditModal(true);
  };

  // Transaction güncelle
  const handleEdit = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditSuccess("");
    if (!editAmount || isNaN(editAmount)) {
      setEditError("Tutar geçerli bir sayı olmalı");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/transactions/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: editType,
          amount: Number(editAmount),
          description: editDescription,
          date: editDate || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.message || "Güncelleme hatası");
      } else {
        setEditSuccess("Harcama güncellendi!");
        setEditModal(false);
        fetchTransactions();
      }
    } catch (err) {
      setEditError("Sunucuya ulaşılamıyor");
    }
  };

  // Filtreleme
  const filtered = transactions.filter((t) => {
    if (filterType && t.type !== filterType) return false;
    if (
      filterDesc &&
      !t.description.toLowerCase().includes(filterDesc.toLowerCase())
    )
      return false;
    if (filterStart && new Date(t.date) < new Date(filterStart)) return false;
    if (filterEnd && new Date(t.date) > new Date(filterEnd)) return false;
    return true;
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
      {/* Ekleme Formu */}
      <div className="bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-xl mb-8">
        <h2 className="text-2xl font-bold mb-6 text-amber-300 text-center">
          Harcama Ekle
        </h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block mb-1">Tür</label>
            <select
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="income">Gelir</option>
              <option value="expense">Gider</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Tutar</label>
            <input
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1">Açıklama</label>
            <input
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1">Tarih</label>
            <input
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          {error && <p className="text-red-400">{error}</p>}
          {success && <p className="text-green-400">{success}</p>}
          <button
            type="submit"
            className="w-full bg-amber-400 text-black font-bold py-2 rounded hover:bg-amber-500 transition"
          >
            Ekle
          </button>
        </form>
      </div>

      {/* Filtreleme */}
      <div className="bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-xl mb-8">
        <h3 className="text-xl font-bold mb-4 text-amber-200">Filtrele</h3>
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
          >
            <option value="">Tümü</option>
            <option value="income">Gelir</option>
            <option value="expense">Gider</option>
          </select>
          <input
            type="text"
            placeholder="Açıklama ara"
            value={filterDesc}
            onChange={(e) => setFilterDesc(e.target.value)}
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
          />
          <input
            type="date"
            value={filterStart}
            onChange={(e) => setFilterStart(e.target.value)}
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
          />
          <input
            type="date"
            value={filterEnd}
            onChange={(e) => setFilterEnd(e.target.value)}
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
          />
        </div>
      </div>

      {/* Özet */}
      <div className="bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-xl mb-8">
        <h3 className="text-xl font-bold mb-4 text-amber-200">Özet</h3>
        <div className="flex justify-between mb-2">
          <span>Toplam Gelir:</span>
          <span className="text-green-400 font-bold">{totalIncome}₺</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Toplam Gider:</span>
          <span className="text-red-400 font-bold">{totalExpense}₺</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Bakiye:</span>
          <span className="text-amber-300 font-bold">{balance}₺</span>
        </div>
        <div className="mt-4">
          {/* Grafik yer tutucu */}
          <div className="bg-gray-800 rounded h-32 flex items-center justify-center text-gray-400">
            Grafik burada olacak
          </div>
        </div>
      </div>

      {/* Harcama Listesi */}
      <div className="bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-xl">
        <h3 className="text-xl font-bold mb-4 text-amber-200">Harcamalarım</h3>
        {loading ? (
          <p>Yükleniyor...</p>
        ) : filtered.length === 0 ? (
          <p>Sonuç bulunamadı.</p>
        ) : (
          <ul className="divide-y divide-gray-700">
            {filtered.map((t) => (
              <li
                key={t._id}
                className="py-3 flex items-center justify-between"
              >
                <div>
                  <span
                    className={`font-bold ${
                      t.type === "income" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {t.amount}₺
                  </span>
                  <span className="ml-2 text-gray-300">{t.description}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    {t.date ? new Date(t.date).toLocaleDateString() : ""}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-red-400 hover:underline"
                  >
                    Sil
                  </button>
                  <button
                    onClick={() => openEditModal(t)}
                    className="text-amber-400 hover:underline"
                  >
                    Düzenle
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={() => setEditModal(false)}
              className="absolute top-2 right-4 text-2xl text-amber-400"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-amber-200">
              Harcama Düzenle
            </h3>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block mb-1">Tür</label>
                <select
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                >
                  <option value="income">Gelir</option>
                  <option value="expense">Gider</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Tutar</label>
                <input
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">Açıklama</label>
                <input
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">Tarih</label>
                <input
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>
              {editError && <p className="text-red-400">{editError}</p>}
              {editSuccess && <p className="text-green-400">{editSuccess}</p>}
              <button
                type="submit"
                className="w-full bg-amber-400 text-black font-bold py-2 rounded hover:bg-amber-500 transition"
              >
                Kaydet
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
