import { createSlice } from "@reduxjs/toolkit";

export const kasko = createSlice({
  name: "kasko",
  initialState: {
    value: 2,
    isExistPlate: true,
    tcIdentityNumber: 0,
    plateNo: "",
  },

  reducers: {
    setIsExistPlate: (state, action) => {
      state.isExistPlate = action.payload;
    },

    set: (state, action) => {
      state.isExistPlate = action.payload;
    },

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

export const { increment, decrement, incrementByAmount, setIsExistPlate } = kasko.actions;

export default kasko.reducer;
