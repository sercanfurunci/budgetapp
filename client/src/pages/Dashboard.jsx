import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-white px-4 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Hoş geldin, bütçeni yönetmeye başla!
      </h2>
      <Link to="/transactions" className="w-full max-w-xs sm:max-w-sm">
        <button className="w-full px-6 py-3 bg-amber-400 text-black rounded-lg font-semibold shadow hover:bg-amber-500 transition">
          Harcamalarını Görüntüle
        </button>
      </Link>
    </div>
  );
};

export default Dashboard;
