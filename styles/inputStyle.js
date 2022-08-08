export const radioButtonSx = {
  "&.Mui-checked": {
    color: "var(--color-one)",
  },
};

export const datePickerSx = {
  root: {
    "& label.Mui-focused": {
      color: "green",
    },
    "& label.Mui-error": {
      color: "green",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "green",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-error": {
        "& .MuiOutlinedInput-notchedOutline": {
          color: "blue !important",
          borderColor: "blue !important",
        },
      },
      "& fieldset": {
        borderColor: "red",
      },
      "&:hover fieldset": {
        borderColor: "yellow",
      },
      "&.Mui-focused fieldset": {
        borderColor: "green",
      },
    },
  },
};
