import { red } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

export const inputStyle = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    "&.MuiInputLabel": {
      root: {
        color: "black",
        fontSize: 13,
      },
    },
    "&:hover fieldset": {
      borderColor: "var(--main-color)",
      borderWidth: "1px",
      //backgroundColor: "var(--main-color-light)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--main-color)",
      borderWidth: "1px",
    },
    "&.Mui-focused MuiInputLabel-shrink": {
      color: "red",
      backgroundColor: "green",
    },
  },

  // } .MuiFormLabel-root, .MuiInputLabel-outlined": {
  //   color: "red", // or black
  // },
};

export const MainButtonLarge = styled(Button)(({ theme }) => ({
  color: "white",
  backgroundColor: "var(--main-color)",
  padding: "12px 26px",
  fontWeight: 600,
  fontSize: "12pt",
  "&:hover": {
    filter: "brightness(0.90)",
    color: "white",
    backgroundColor: "var(--main-color)",
  },
}));
