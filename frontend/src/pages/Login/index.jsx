import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../../context/tokenContext";
import { Link, Navigate } from "react-router-dom";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const { setToken, setUserId } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data = { email, password };
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        data
      );
      if (response.status === 200) {
        setOtpModal(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    try {
      const data = { email, password, otp: otpValue };
      const response = await axios.post(
        "http://localhost:5000/api/user/verify-otp",
        data
      );
      if (response.status === 200) {
        setToken(response.data.token);
        setUserId(response.data.user._id);
        setRedirect(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-full h-screen bg-[#1b1b22] flex justify-center items-center ">
      <form
        onSubmit={handleLogin}
        className="w-[400px] h-[324px] flex flex-col gap-6 rounded-xl border border-[#35373b] bg-[#1E1E2F] p-6 text-center text-white shadow-lg"
      >
        <p className="text-3xl font-bold">Blaash Login</p>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-600 bg-[#2A2A40] px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-600 bg-[#2A2A40] px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400"
        >
          {isLoading ? (
            "Loading..."
          ) : (
            "Login"
          )}
        </button>
        <p className="text-sm text-gray-400">
          Not Registered?{" "}
          <Link to="/signUp" className="text-blue-500 hover:underline">
            Click Here
          </Link>
        </p>
      </form>

      {/* OTP Modal */}
      <Dialog
        open={otpModal}
        onClose={() => setOtpModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-80">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-[#1E1E2F] p-6 shadow-lg text-white">
            <Dialog.Title className="text-xl font-bold">
              Verify OTP
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-400">
              Please enter the OTP sent to your email
            </Dialog.Description>
            <form onSubmit={handleOtp} className="mt-4 space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                required
                className="w-full outline-none rounded-lg border border-gray-600 bg-[#2A2A40] px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:outline-none"
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setOtpModal(false)}
                  className="w-full rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400"
                >
                  Verify
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Login;
