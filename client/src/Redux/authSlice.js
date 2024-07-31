import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../Helper/axiosInstance";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  data: (() => {
    try {
      return JSON.parse(localStorage.getItem("data")) || {};
    } catch (error) {
      return {};
    }
  })(),
  role: localStorage.getItem("role") || "",
};

// function to handle signup
export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    let res = axiosInstance.post("users/register", data);

    toast.promise(res, {
      loading: "Wait! Creating your account",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to create account",
    });

    // getting response resolved here
    res = await res;
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});

// function to handle login
export const login = createAsyncThunk("auth/login", async (data) => {
  try {
    let res = axiosInstance.post("/users/login", data );
    await toast.promise(res, {
      loading: "Loading...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to log in",
    });

    // getting response resolved here
    res = await res;
    let token =  document.cookie ;
    return res.data;
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
});

// function to handle logout
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    let res = axiosInstance.get("/users/logout");

    await toast.promise(res, {
      loading: "Loading...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to log out",
    });

    // getting response resolved here
    res = await res;
    return res.data;
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
});

// function to fetch user data
export const getUserData = createAsyncThunk("/users/profile", async () => {
  try {
    const res = await axiosInstance.get("/users/profile");
    console.log(res)
    return res?.data;
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
});

// function to change user password
export const changePassword = createAsyncThunk(
  "/auth/changePassword",
  async (userPassword) => {
    try {
      let res = axiosInstance.post("/users/change-password", userPassword);

      await toast.promise(res, {
        loading: "Loading...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to change password",
      });

      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  }
);

// function to handle forget password
export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async (email) => {
    try {
      let res = axiosInstance.post("/users/forgot-password", { email });

      await toast.promise(res, {
        loading: "Loading...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to send verification email",
      });

      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  }
);

// function to update user profile
export const updateProfile = createAsyncThunk(
  "/user/update/profile",
  async (data) => {
    try {
      let res = axiosInstance.put(`/users/update/${data[0]}`, data[1]);

      toast.promise(res, {
        loading: "Updating...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to update profile",
      });
      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  }
);

// function to reset the password
export const resetPassword = createAsyncThunk("/user/reset", async (data) => {
  try {
    let res = axiosInstance.post(`/users/reset/${data.resetToken}`, {
      password: data.password,
    });

    toast.promise(res, {
      loading: "Resetting...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to reset password",
    });
    // getting response resolved here
    res = await res;
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});

// Function to handle payment success
export const handlePaymentSuccess = createAsyncThunk(
  "auth/handlePaymentSuccess",
  async () => {
    try {
      // Clear old user data
      localStorage.removeItem("data");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("role");

      // Fetch new user data
      const res = await axiosInstance.get("/users/profile");
      return res.data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.fulfilled, (state, action) => {
        console.log('Signup Response:', action.payload ); // Debug log
        const user = action?.payload?.data; // Adjusted path
        const role = user?.role;
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", role);
        state.isLoggedIn = true;
        state.data = user;
        state.role = role;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('Login Response:', action.payload); // Debug log
        const user = action?.payload?.data; // Adjusted path
        const role = user?.role;
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", role);
        state.isLoggedIn = true;
        state.data = user;
        state.role = role;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggedIn = false;
        localStorage.setItem("isLoggedIn", false);
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.isLoggedIn = false;
        state.data = {};
        state.role = ""; // Ensure role is cleared on logout
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        console.log('User Data Response:', action.payload); 
        const user = action?.payload?.data; 
        const role = user?.role;
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", role);
        state.isLoggedIn = true;
        state.data = user;
        state.role = role;
      })
      .addCase(handlePaymentSuccess.fulfilled, (state, action) => {
        console.log('Payment Success Response:', action.payload);
        const user = action.payload.data;
        const role = user?.role;
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", role);
        state.isLoggedIn = true;
        state.data = user;
        state.role = role;
      });
  },
});

export const {} = authSlice.actions;
export default authSlice.reducer;
