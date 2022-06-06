import { createSlice } from "@reduxjs/toolkit";

export const inputControls = createSlice({
  name: "inputControls",
  initialState: {
    value: 2,
  },

  reducers: {
    /*changeTcKimlikNumarasi: (state, action) => {
      state.tc_kimlik_numarasi = action.payload;
    },*/
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

//export const { increment, decrement, incrementByAmount } = counter.actions;

export const { increment, decrement, incrementByAmount } = kasko.actions;

export default kasko.reducer;
