import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../Layout/Layout";
import { forgetPassword } from "../../Redux/authSlice";
import Modal from "../../Components/Modal.jsx";

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // function to handle submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // checking for the empty field
    if (!email) {
      toast.error("All fields are mandatory");
      return;
    }

    // email validation using regex
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      toast.error("Invalid email id");
      return;
    }

    // calling the api from auth slice
    const res = await dispatch(forgetPassword(email));
    if (res?.payload?.success) {
      setEmailSent(true);
      setIsModalOpen(true);
      toast.success("Verification link has been sent to your email");
    }

    // clearing the input fields
    setEmail("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/login");
  };

  return (
    <Layout>
      {/* forget password container */}
      <div className="flex items-center justify-center min-h-screen ">
        {/* forget password card */}
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col justify-center gap-6 bg-white rounded-lg p-6 shadow-md w-80"
        >
          <h1 className="text-center text-2xl font-bold text-gray-800">
            Forget Password
          </h1>

          <p className="text-gray-600 text-center">
            Enter your registered email, we will send you a verification link on
            your registered email from which you can reset your password.
          </p>

          <div className="flex flex-col gap-2">
            <input
              required
              type="email"
              name="email"
              id="email"
              placeholder="Enter your registered email"
              className="bg-gray-50 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-yellow-500"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={emailSent}
            />
          </div>

          <button
            className="w-full bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 rounded-md py-2 font-semibold text-white text-lg cursor-pointer"
            type="submit"
            disabled={emailSent}
          >
            Get Verification Link
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link to={"/login"} className="text-yellow-600 hover:text-yellow-500">
              Login
            </Link>
          </p>
        </form>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Check Your Email"
          message="A verification link has been sent to your email. Please check your inbox and follow the instructions to reset your password."
        />
      </div>
    </Layout>
  );
};

export default ForgetPassword;
