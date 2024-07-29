import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Layout from "../../Layout/Layout";
import { getUserData } from "../../Redux/authSlice";
import { cancelCourseBundle } from "../../Redux/razorpaySlice";

const Profile = () => {
  const dispatch = useDispatch();

  const userData = useSelector((state) => state?.auth?.data);

  console.log(userData)

  // function to handle the cancel subscription of course
  const handleCourseCancelSubscription = async () => {
    await dispatch(cancelCourseBundle());
    await dispatch(getUserData());
  };

  useEffect(() => {
    // getting user details
    dispatch(getUserData());
  }, []);
  return (
    <Layout>
      <div className="min-h-screen w-full flex items-center justify-center ">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <img
            className="w-40 h-40 rounded-full border border-gray-300 mx-auto"
            src={userData?.avatar?.secure_url}
            alt="user profile image"
          />

          <h3 className="text-2xl font-semibold text-center text-gray-800 mt-4 capitalize">
            {userData.fullName}
          </h3>

          <div className="grid grid-cols-2 gap-4 mt-4 text-gray-700">
            <p className="font-medium">Email :</p>
            <p>{userData?.email}</p>
            <p className="font-medium">Role :</p>
            <p>{userData?.role}</p>
            <p className="font-medium">Subscription :</p>
            <p>
              {userData?.subscription?.status === "active"
                ? "Active"
                : "Inactive"}
            </p>
          </div>

          {/* button to change the password */}
          <div className="flex items-center justify-between gap-4 mt-6">
            <Link
              to={
                userData?.email === "test@gmail.com"
                  ? "/denied"
                  : "/changepassword"
              }
              className="w-1/2 bg-yellow-600 hover:bg-yellow-700 transition duration-300 rounded-sm py-2 text-center text-white font-semibold"
            >
              Change Password
            </Link>

            <Link
              to={
                userData?.email === "test@gmail.com"
                  ? "/denied"
                  : "/user/editprofile"
              }
              className="w-1/2 border border-yellow-600 hover:border-yellow-500 transition duration-300 rounded-sm py-2 text-center text-yellow-600 font-semibold"
            >
              Edit Profile
            </Link>
          </div>

          {userData?.subscription?.status === "active" && (
            <button
              onClick={handleCourseCancelSubscription}
              className="w-full bg-red-600 hover:bg-red-500 transition duration-300 rounded-sm py-2 mt-4 text-center text-white font-semibold"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
