import { red } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

export const inputStyle = {
  width: "100%",
  "label.Mui-focused": {
    color: "var(--color-one) !important",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    "&.MuiInputLabel": {
      root: {
        color: "black",
        fontSize: 13,
      },
    },
    "&:hover fieldset": {
      borderColor: "var(--color-one)",
      borderWidth: "1px",
    },
    "&.Mui-focused": {
      fieldset: {
        borderColor: "var(--color-one)",
        borderWidth: "1px",
      },
    },
  },

  // } .MuiFormLabel-root, .MuiInputLabel-outlined": {
  //   color: "red", // or black
  // },
};

export const MainButtonLarge = styled(Button)(({ theme }) => ({
  color: "white",
  backgroundColor: "var(--color-one)",
  padding: "12px 26px",
  fontWeight: 600,
  fontSize: "12pt",
  "&:hover": {
    filter: "brightness(0.90)",
    color: "white",
    backgroundColor: "var(--color-one)",
  },
}));
