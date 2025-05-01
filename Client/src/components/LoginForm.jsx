import React, { useState } from "react";
import { Link } from "react-router-dom";
import { register, loginUser } from "../service/authApi";

const LoginForm = ({onLoginSuccess}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser(username, password);
      setMessage(data.message);
      setUsername("");
      setPassword("");
      setError("");
      onLoginSuccess(data);
    } catch (error) {
      console.log("the err is :", error.message);
      setUsername("");
      setPassword("");
      setMessage("");
      serError("Invalid Login Credentials");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register(username, password);
      setIsRegister(false);
      setMessage(data.message);
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setError("");
    } catch (error) {
      console.log("the err is :", error.message);
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setMessage("");
      serError("Something went wrong during user registration");
    }
  };

  const handleRegisterToggle = () => {
    setIsRegister(!isRegister);
    setMessage("");
  };

  return (
    <form
      onSubmit={isRegister ? handleRegister : handleLogin}
      className="bg-slate-900 text-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-8 border border-slate-700"
    >
      <div className="pt-2">
        <h2 className="text-3xl text-center font-bold text-teal-400 mb-4">
          {isRegister ? "Create Account" : "Welcome Back!"}
        </h2>
      </div>
      <hr className="border-slate-700 mb-6" />
      <p className="text-center text-slate-400 text-md font-light mb-6">
        {isRegister
          ? "Looks like you're new here!"
          : "We're glad to see you again!"}
      </p>
      <div>
        <div className="mb-5">
          <label className="text-sm font-medium text-slate-300 block">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 mt-2 bg-slate-800 text-white rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter your username..."
            required
          />
        </div>
        <div className="mb-5">
          <label className="text-sm font-medium text-slate-300 block">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mt-2 bg-slate-800 text-white rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter your password..."
            required
          />
        </div>
        {isRegister && (
          <div className="mb-5">
            <label className="text-sm font-medium text-slate-300 block">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 bg-slate-800 text-white rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Confirm password..."
              required
            />
          </div>
        )}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {message && <p className="text-green-400 text-sm mb-3">{message}</p>}
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition duration-300 font-semibold"
        >
          {isRegister ? "Register" : "Login"}
        </button>
        <div>
          <p className="pt-6 text-center text-sm text-slate-400">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <Link
              to=""
              onClick={handleRegisterToggle}
              className="ml-1 font-semibold text-teal-400 hover:underline"
            >
              {isRegister ? "Login" : "Create New"}
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
