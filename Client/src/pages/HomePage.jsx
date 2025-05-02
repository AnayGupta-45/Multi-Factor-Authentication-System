import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { logoutUser } from "../service/authApi";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useSession();
  const [sessionTime, setSessionTime] = useState(0);
  const [lastLogin, setLastLogin] = useState("");

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const loginTime = new Date();
    setLastLogin(loginTime.toLocaleString());

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      const { data } = await logoutUser();
      logout(data);
      navigate("/login");
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top Navigation */}
      <header className="bg-slate-900 shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-teal-400">SecureAuth Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition duration-300"
        >
          Logout
        </button>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-grow p-10 flex flex-col items-center justify-center">
        <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl max-w-3xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-teal-400 mb-2">
              Welcome, {user.username}!
            </h2>
            <p className="text-slate-400 text-sm">
              You are logged in and 2FA verified successfully.
            </p>
          </div>

          {/* Profile Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-800 p-6 rounded-xl shadow-inner">
              <h3 className="text-lg font-semibold text-white mb-3">User Profile</h3>
              <ul className="text-slate-300 text-sm space-y-2">
                <li><span className="text-teal-400 font-medium">Username:</span> {user.username}</li>
                <li><span className="text-teal-400 font-medium">Email:</span> {user.email || "user@example.com"}</li>
                <li><span className="text-teal-400 font-medium">Role:</span> User</li>
              </ul>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl shadow-inner">
              <h3 className="text-lg font-semibold text-white mb-3">Session Info</h3>
              <ul className="text-slate-300 text-sm space-y-2">
                <li><span className="text-teal-400 font-medium">2FA Status:</span> ✅ Enabled</li>
                <li><span className="text-teal-400 font-medium">Session Time:</span> {sessionTime} seconds</li>
                <li><span className="text-teal-400 font-medium">Last Login:</span> {lastLogin}</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
