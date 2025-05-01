import React, { useEffect, useState } from "react";
import { setup2FA } from "../service/authApi";

const TwoFASetup = ({ onSetupComplete }) => {
  const [response, setResponse] = useState({});
  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const { data } = await setup2FA();
        console.log("2FA setup response:", data);

        // Check for both `data.secret` and `data.data.secret`
        const actualSecret = data.secret || (data.data && data.data.secret);
        const qrCode = data.qrCode || (data.data && data.data.qrCode);

        if (!actualSecret) {
          setMessage("Secret not found in API response");
          return;
        }

        setResponse({ qrCode });
        setSecret(actualSecret);
      } catch (error) {
        console.error("Error fetching 2FA setup:", error);
        setMessage("Error fetching 2FA setup");
      } finally {
        setLoading(false);
      }
    };

    fetchQRCode();
  }, []);

  const copyClipBoard = async () => {
    if (secret) {
      await navigator.clipboard.writeText(secret);
      setMessage("Secret copied to Clipboard");
    } else {
      setMessage("No secret to copy");
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-8 border border-slate-700">
      <div className="pt-2">
        <h2 className="text-3xl text-center font-bold text-teal-400 mb-4">
          Turn On 2FA Verification
        </h2>
      </div>
      <hr className="border-slate-700 mb-6" />
      <p className="text-center text-gray-600 text-lg font-light pr-6 pl-6">
        Scan the QR code below with your Authenticator App.
      </p>
      <div className="p-6">
        {loading ? (
          <p className="text-center text-gray-400">Loading QR Code...</p>
        ) : (
          <>
            <div className="flex justify-center">
              {response.qrCode ? (
                <img
                  src={response.qrCode}
                  alt="2FA QR Code"
                  className="mb-4 border rounded-md"
                />
              ) : (
                <p className="text-red-400">QR code not available</p>
              )}
            </div>
            <div className="flex items-center mt-3 mb-3">
              <div className="text-gray-600 text-sm font-light pr-2 pl-2">
                Or enter the code manually
              </div>
              <div className="border-t border-1 border-gray-200 flex-grow"></div>
            </div>
            <div className="mb-6">
              {message && (
                <p className="text-green-500 text-sm mb-3">{message}</p>
              )}
              <input
                type="text"
                readOnly
                value={secret}
                className="w-full border rounded mt-2 text-xs text-gray-600 p-4 cursor-pointer"
                onClick={copyClipBoard}
              />
            </div>
            <button
              onClick={onSetupComplete}
              className="w-full bg-blue-500 text-white py-2 rounded-md"
            >
              Continue To Verification
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TwoFASetup;
