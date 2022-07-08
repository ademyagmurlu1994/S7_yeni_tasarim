import { createSlice } from "@reduxjs/toolkit";

export const toast = createSlice({
  name: "toast",
  initialState: {
    isShow: false,
    toastMessage: "",
    severity: "",
  },

  reducers: {
    show: (state, action) => {
      state.isShow = true;
      state.toastMessage = action.payload;
    },

    close: (state) => {
      state.toastMessage = "";
      state.isShow = false;
    },

    info: (state, action) => {
      state.isShow = true;
      state.severity = "info";
      state.toastMessage = action.payload;
    },

    warning: (state, action) => {
      state.isShow = true;
      state.severity = "warning";
      state.toastMessage = action.payload;
    },
    error: (state, action) => {
      state.isShow = true;
      state.severity = "error";
      state.toastMessage = action.payload;
    },
  },
});

//export const { increment, decrement, incrementByAmount } = counter.actions;

export const { show, close, info, warning, error } = toast.actions;

export default toast.reducer;
