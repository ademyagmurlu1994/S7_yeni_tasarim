import { configureStore } from "@reduxjs/toolkit";

import kaskoReducer from "./kasko";
import usefullReducer from "./usefull";
export default configureStore({
  reducer: {
    kasko: kaskoReducer,
    usefull: usefullReducer,
  },
});
