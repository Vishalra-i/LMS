import React, { useEffect } from "react";
import Layout from "../../Layout/Layout";
import { BiRupee } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import {
  getRazorPayId,
  purchaseCourseBundle,
  verifyUserPayment,
} from "../../Redux/razorpaySlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { handlePaymentSuccess } from '../../Redux/authSlice';


const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const razorPayKey = useSelector((state) => state.razorpay.key);
  const subscription_id = useSelector(
    (state) => state.razorpay.subscription_id
  );
  const userData = useSelector((state) => state.auth.data);
  const { isPaymentVerified } = useSelector((state) => state.razorpay);

  // for storing the payment details after successful transaction
  const paymentDetails = {
    razorpay_payment_id: "",
    razorpay_subscription_id: "",
    razorpay_signature: "",
  };

  const handleSubscription = async (event) => {
    event.preventDefault();

    // checking for empty payment credential
    if (!razorPayKey || !subscription_id) {
      toast.error("Payment server is down, please try again later.");
      return;
    }

    const options = {
      key: razorPayKey,
      subscription_id: subscription_id,
      name: "Coursify Pvt. Ltd.",
      description: "Monthly Subscription",
      handler: async function (response) {
        paymentDetails.razorpay_payment_id = response.razorpay_payment_id;
        paymentDetails.razorpay_subscription_id =
          response.razorpay_subscription_id;
        paymentDetails.razorpay_signature = response.razorpay_signature;

        // displaying the success message
        toast.success("Payment Successful");

        // verifying the payment
        const res = await dispatch(verifyUserPayment(paymentDetails));
        console.log("2" + res);
        console.log("1" + isPaymentVerified);

        // redirecting the user according to the verification status
        if (isPaymentVerified) {
          dispatch(handlePaymentSuccess());
          toast.success("Payment verified successfully");
          navigate("/checkout/success");
        } else {
          toast.error("Payment verification failed");
          navigate("/checkout/fail");
        }
      },
      prefill: {
        name: userData.fullName,
        email: userData.email,
      },
      theme: {
        color: "#F37254",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  useEffect(() => {
    (async () => {
      await dispatch(getRazorPayId());
      await dispatch(purchaseCourseBundle());
    })();
  }, [dispatch]);

  return (
    <Layout>
      {/* checkout page container */}
      <form
        onSubmit={handleSubscription}
        className="min-h-screen flex items-center justify-center text-gray-800"
      >
        {/* checkout card */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
          <h1 className="bg-yellow-500 text-white text-center py-4 text-2xl font-bold">
            Subscription Bundle
          </h1>

          <div className="p-6 space-y-6 text-center">
            <p className="text-gray-700">
              This purchase will allow you to access all the available courses
              on our platform for{" "}
              <span className="text-yellow-500 font-bold">1 Year Duration</span>
              . <br />
              All the existing and newly launched courses will be available to
              you in this subscription bundle.
            </p>

            <p className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-500">
              <BiRupee /> <span>499</span> only
            </p>

            <div className="text-gray-500">
              <p>100% refund upon cancellation</p>
              <p>* Terms & Conditions Apply</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white transition duration-300 py-4 text-xl font-bold"
          >
            Buy Now
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default Checkout;
