import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { logoutUser } from "../service/authApi";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useSession();

  const handleLogout = async ()=>{
    try {
        const {data} = await logoutUser();
        logout(data);
        navigate("/login")
    } catch (error) {
        console.log("Error :", error.message)
    }
  }

  return (
    <div className="p-8 bg-slate-900 text-white rounded-2xl shadow-xl max-w-md mt-10">
      <h2 className="text-2xl font-semibold text-teal-400 mb-4">
        Welcome, {user.username}!
      </h2>
      <p className="text-slate-400 text-lg font-light">
        You have successfully logged in and verified your 2FA.
      </p>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg transition duration-300"
      >
        {" "}
        Logout
      </button>
    </div>
  );
};

export default HomePage;
