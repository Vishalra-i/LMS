import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../Helper/axiosInstance";

const initialState = {
  key: "",
  subscription_id: "",
  isPaymentVerified: false,
  allPayments: {},
  finalMonths: {},
  monthlySalesRecord: [],
};

// function to get the api key
export const getRazorPayId = createAsyncThunk("/razorPayId/get", async () => {
  try {
    const res = await axiosInstance.get("/payments/razorpay-key");
    console.log("API Response:", res);
    return res.data; 
  } catch (error) {
    console.error("Error in getRazorPayId:", error);
    toast.error("Failed to load data");
    throw error; // Ensure to throw error so that it hits the rejected case
  }
});

// function to purchase the course bundle
export const purchaseCourseBundle = createAsyncThunk(
  "/purchaseCourse",
  async () => {
    try {
      const res = await axiosInstance.post("/payments/subscribe");
      console.log("Purchase Course Bundle Response:", res);
      return res.data;
    } catch (error) {
      console.error("Error in purchaseCourseBundle:", error);
      toast.error(error?.response?.data?.message);
      throw error;
    }
  }
);

// function to verify the user payment
export const verifyUserPayment = createAsyncThunk(
  "/verifyPayment",
  async (paymentDetail) => {
    try {
      const res = await axiosInstance.post("/payments/verify", {
        razorpay_payment_id: paymentDetail.razorpay_payment_id,
        razorpay_subscription_id: paymentDetail.razorpay_subscription_id,
        razorpay_signature: paymentDetail.razorpay_signature,
      });
      console.log("Verify User Payment Response:", res);
      return res.data;
    } catch (error) {
      console.error("Error in verifyUserPayment:", error);
      toast.error("Failed to verify payment");
      throw error;
    }
  }
);

// function to get all the payment record
export const getPaymentRecord = createAsyncThunk("paymentrecord", async () => {
  try {
    const res = axiosInstance.get("/payments?count=100");
    toast.promise(res, {
      loading: "Getting the payments record...",
      success: (data) => {
        console.log("Get Payment Record Response:", data);
        return data.data.message;
      },
      error: "Failed to get payment records",
    });

    const response = await res;
    return response.data;
  } catch (error) {
    console.error("Error in getPaymentRecord:", error);
    toast.error("Operation failed");
    throw error;
  }
});

// function to cancel the course bundle subscription
export const cancelCourseBundle = createAsyncThunk(
  "/cancelCourse",
  async () => {
    try {
      const res = await axiosInstance.post("/payments/unsubscribe");
      toast.promise(res, {
        loading: "Unsubscribing the bundle...",
        success: "Bundle unsubscribed successfully",
        error: "Failed to unsubscribe the bundle",
      });
      const response = await res;
      console.log("Cancel Course Bundle Response:", response);
      return response.data;
    } catch (error) {
      console.error("Error in cancelCourseBundle:", error);
      toast.error(error?.response?.data?.message);
      throw error;
    }
  }
);

const razorpaySlice = createSlice({
  name: "razorpay",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRazorPayId.rejected, () => {
        toast.error("Failed to get razor pay id");
      })
      .addCase(getRazorPayId.fulfilled, (state, action) => {
        console.log("Fulfilled Action Payload:", action.payload);
        state.key = action.payload.key;
      })
      .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
        console.log("Purchase Course Bundle Fulfilled Payload:", action.payload);
        state.subscription_id = action.payload.subscription_id;
      })
      .addCase(verifyUserPayment.fulfilled, (state, action) => {
        console.log("Verify User Payment Fulfilled Payload:", action.payload);
        toast.success(action.payload.message);
        state.isPaymentVerified = action.payload.success;
      })
      .addCase(verifyUserPayment.rejected, (state, action) => {
        console.log("Verify User Payment Rejected Payload:", action.payload);
        toast.error(action.payload?.message);
        state.isPaymentVerified = action.payload?.success;
      })
      .addCase(getPaymentRecord.fulfilled, (state, action) => {
        console.log("Get Payment Record Fulfilled Payload:", action.payload);
        state.allPayments = action.payload.allPayments;
        state.finalMonths = action.payload.finalMonths;
        state.monthlySalesRecord = action.payload.monthlySalesRecord;
      });
  },
});

export const {} = razorpaySlice.actions;
export default razorpaySlice.reducer;
