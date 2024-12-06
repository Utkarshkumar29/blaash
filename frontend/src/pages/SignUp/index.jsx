import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../../context/tokenContext";
import { Navigate } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const { token, setToken } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const data = {
        username: username,
        password: password,
        email: email,
        image: image,
      };
      const response = await axios.post(
        "https://blaash-ho2n.onrender.com/api/user/signUp",
        data
      );
      if (response.status == 200) {
        console.log(response);
        setToken(response.data.token);
        setRedirect(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="w-full h-screen bg-[#1b1b22] flex justify-center items-center ">
      <form
        onSubmit={handleSignUp}
        className="flex w-[400px] flex-col gap-6 rounded-xl border border-[#35373b] bg-[#1E1E2F] p-8 text-center text-white shadow-lg"
      >
        <p className="text-3xl font-bold">Blaash SignUp</p>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg border border-gray-600 bg-[#2A2A40] px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:outline-none"
        />
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
        <input
          type="file"
          placeholder="Image"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full rounded-lg border border-gray-600 bg-[#2A2A40] px-4 py-2 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-white file:bg-blue-500 file:cursor-pointer"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default SignUp;
