import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../Helper/axiosInstance";

const initialState = {
  lectures: [],
  loading: false,
  error: null,
};

// function to get all the lectures
export const getCourseLecture = createAsyncThunk(
  "course/lecture/get",
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/courses/${courseId}`);
      toast.success("Lectures fetched successfully");
      return res.data.data.lectures; // Ensure the correct data path
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch lectures");
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// function to add new lecture to the course
export const addCourseLecture = createAsyncThunk(
  "course/lecture/add",
  async (data, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("lecture", data.lecture);
    formData.append("title", data.title);
    formData.append("description", data.description);

    try {
      const res = await axiosInstance.post(`/courses/${data.id}`, formData);
      toast.success("Lecture added successfully");
      return res.data.data.course.lectures; // Ensure the correct data path
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add lecture");
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// function to delete the lecture from the course
export const deleteCourseLecture = createAsyncThunk(
  "course/lecture/delete",
  async ({ courseId, lectureId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(
        `/courses/${courseId}/lectures/${lectureId}`
      );
      toast.success("Lecture deleted successfully");
      return res.data.data.course.lectures; // Ensure the correct data path
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete lecture");
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

const lectureSlice = createSlice({
  name: "lecture",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCourseLecture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCourseLecture.fulfilled, (state, action) => {
        state.loading = false;
        state.lectures = action.payload;
      })
      .addCase(getCourseLecture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCourseLecture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCourseLecture.fulfilled, (state, action) => {
        state.loading = false;
        state.lectures = action.payload;
      })
      .addCase(addCourseLecture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCourseLecture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourseLecture.fulfilled, (state, action) => {
        state.loading = false;
        state.lectures = action.payload;
      })
      .addCase(deleteCourseLecture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {} = lectureSlice.actions;
export default lectureSlice.reducer;
