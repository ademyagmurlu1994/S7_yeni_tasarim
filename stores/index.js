import { configureStore } from "@reduxjs/toolkit";

import kaskoReducer from "./kasko";
import usefullReducer from "./usefull";
import toastReducer from "./toast";
import loaderReducer from "./loader";
export default configureStore({
  reducer: {
    kasko: kaskoReducer,
    usefull: usefullReducer,
    toast: toastReducer,
    loader: loaderReducer,
  },
});
