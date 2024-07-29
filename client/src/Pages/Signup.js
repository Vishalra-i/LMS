import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import { BsPersonCircle } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createAccount } from "../Redux/authSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [previewImage, setImagePreview] = useState("");

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: "",
  });

  const handleUserInput = (event) => {
    const { name, value } = event.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const getImage = (event) => {
    event.preventDefault();
    const uploadedImage = event.target.files[0];

    if (uploadedImage) {
      setSignupData({ ...signupData, avatar: uploadedImage });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setImagePreview(this.result);
      });
    }
  };

  const createNewAccount = async (event) => {
    event.preventDefault();

    if (!signupData.email || !signupData.fullName || !signupData.password) {
      toast.error("Please fill all the fields");
      return;
    }

    if (!signupData.avatar) {
      toast.error("Please upload your profile picture");
      return;
    }

    if (signupData.fullName.length < 5) {
      toast.error("Name should be at least 5 characters");
      return;
    }

    if (!signupData.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      toast.error("Invalid email id");
      return;
    }

    if (!signupData.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
      toast.error("Password must be 8-20 characters and include uppercase, lowercase, and numbers");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", signupData.fullName);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    formData.append("avatar", signupData.avatar);

    const res = await dispatch(createAccount(formData));

    if (res.payload.success) navigate("/login");

    setSignupData({ fullName: "", email: "", password: "", avatar: "" });
    setImagePreview("");
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen ">
        <form
          onSubmit={createNewAccount}
          className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg space-y-6"
        >
          <h1 className="text-3xl font-semibold text-gray-800 text-center">Create Your Account</h1>

          <div className="flex flex-col items-center relative">
            <label htmlFor="image_uploads" className="relative cursor-pointer">
              {previewImage ? (
                <img
                  className="w-24 h-24 rounded-full object-cover"
                  src={previewImage}
                  alt="profile preview"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center rounded-full border-2 border-gray-300 bg-gray-200">
                  <BsPersonCircle className="w-12 h-12 text-gray-500" />
                  <span className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 hover:hidden transition-opacity duration-300 opacity-0 hover:opacity-100">
                    Click to upload
                  </span>
                </div>
              )}
            </label>
            <input
              type="file"
              id="image_uploads"
              name="avatar"
              className="hidden"
              accept=".jpg, .jpeg, .png"
              onChange={getImage}
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="fullName" className="font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={signupData.fullName}
                onChange={handleUserInput}
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={signupData.email}
                onChange={handleUserInput}
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={signupData.password}
                onChange={handleUserInput}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 rounded-md transition-all duration-300"
          >
            Create Account
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-yellow-600 hover:text-yellow-500">Login</Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Signup;
