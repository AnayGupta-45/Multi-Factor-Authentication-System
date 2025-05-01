import React, { useState } from "react";
import { reset2FA, verify2FA } from "../service/authApi";

const TwoFAVerification = ({ onVerifySuccess, onResetSuccess }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleTokenVerification = async (e) => {
    e.preventDefault();
    try {
      const { data } = await verify2FA(otp);
      onVerifySuccess(data);
    } catch (error) {
      setOtp("");
      console.log("the error is :", error.message);
      setError("Invalid OTP");
    }
  };

  const handleReset = async () => {
    try {
      const { data } = await reset2FA();
      onResetSuccess(data);
    } catch (error) {
      console.log("the error is :", error.message);
      setError(error.message);
    }
  };

  // Ensure return is inside the function
  return (
    <form
      onSubmit={handleTokenVerification}
      className="bg-slate-900 text-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-8 border border-slate-700"
    >
      <div className="pt-2">
        <h2 className="text-3xl text-center font-bold text-teal-400 mb-4">
          Validate TOTP.
        </h2>
      </div>
      <hr className="border-slate-700 mb-6" />
      <p className="text-center text-slate-400 text-md font-light mb-6">
        Please Enter Your 6 Digit time Based OTP to verify 2FA Authentication.
      </p>
      <div>
        <div className="mb-5">
          <label className="text-sm font-medium text-slate-300 block">
            TOTP
          </label>
          <input
            label="TOTP"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 mt-2 bg-slate-800 text-white rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter your TOTP..."
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition duration-300 font-semibold mb-3"
        >
          Verify TOTP
        </button>
        <button
          type="button"
          className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-400 transition duration-300 font-semibold"
          onClick={handleReset}
        >
          Reset 2FA
        </button>
      </div>
    </form>
  );
};

export default TwoFAVerification;
