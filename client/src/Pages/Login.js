import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import { login } from "../Redux/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleUserInput = (event) => {
    const { name, value } = event.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error("Please fill all the fields");
      return;
    }

    const res = await dispatch(login(loginData));

    if (res?.payload?.success) {
      navigate("/");
    } else {
      toast.error("Invalid Credentials");
    }

    setLoginData({
      email: "",
      password: "",
    });
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen ">
        <form
          onSubmit={handleLogin}
          className="flex flex-col bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6"
        >
          <h1 className="text-3xl font-semibold text-gray-800 text-center">
            Login
          </h1>

          <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <label className="text-lg font-medium text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={loginData.email}
                onChange={handleUserInput}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={loginData.password}
                onChange={handleUserInput}
                required
              />
            </div>
          </div>

          <div
            onClick={() =>
              setLoginData({ email: "test@gmail.com", password: "Test@123" })
            }
            className="text-center text-yellow-600 cursor-pointer hover:underline"
          >
            Guest Login
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 rounded-md transition-colors duration-300"
          >
            Login
          </button>

          <Link to="/forgetpassword" className="text-center text-yellow-600 hover:underline">
            Forgot Password?
          </Link>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-yellow-600 hover:underline">
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
