import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
      <h2 className="text-3xl font-bold mb-4">Hoş geldin, bütçeni yönetmeye başla!</h2>
      <Link to="/transactions">
        <button className="px-6 py-2 bg-amber-400 text-black rounded-lg font-semibold shadow hover:bg-amber-500 transition">Harcamalarını Görüntüle</button>
      </Link>
    </div>
  );
};

export default Dashboard;
