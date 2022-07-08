import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

//mui components
import TextField from "@mui/material/TextField";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InputAdornment from "@mui/material/InputAdornment";

//fonksiyonlar
import { getTodayDate, getDate, isValidMaskedDate, changeDateFormat } from "/functions/common";

//styles
import { inputStyle } from "/styles/custom";

export default function DatePicker(props) {
  const [date, setDate] = useState();
  const [textFieldData, setTextFieldData] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (value) => {
    setTextFieldData(
      changeDateFormat(JSON.stringify(getDate(value)).replaceAll('"', ""), "dd.MM.yyyy")
    );
    setDate(value);
    closeDatePicker();

    props.onChange && props.onChange(getDate(value));
  };

  const closeDatePicker = () => {
    setTimeout(() => {
      setShowDatePicker(false);
    }, 200);
  };
  return (
    <div
      style={{ position: "relative" }}
      // onBlur={() => {
      //   closeDatePicker();
      // }}
    >
      <TextField
        InputLabelProps={{
          shrink: true,
          //required: true,
          fontSize: "15pt",
        }}
        InputProps={{
          inputProps: {
            min: props.minDate,
            max: props.maxDate,
            className: "date-mask w-100",
            readOnly: true,
          },
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{
                "&:hover": {
                  cursor: "pointer",
                  color: "var(--main-color)",
                },
              }}
              onClick={() => {
                setShowDatePicker(!showDatePicker);
              }}
            >
              <i className="far fa-calendar-alt"></i>
            </InputAdornment>
          ),
        }}
        //defaultValue=""
        value={textFieldData || ""}
        onKeyUp={(e) => {
          {
            setTextFieldData(e.target.value);
          }
        }}
        onFocus={() => setShowDatePicker(true)}
        size="small"
        sx={inputStyle}
        label="Gidiş Tarihi *"
        placeholder="gg.aa.yyyy"
        autoComplete="off"
        {...props.textFieldProps}
      />
      {showDatePicker && (
        <div
          tabIndex={0}
          // onBlur={() => {
          //   closeDatePicker();
          // }}
          style={{ position: "absolute", zIndex: "5" }}
        >
          <Calendar
            onChange={(value) => {
              handleChange(value);
            }}
            locale="tr-TR"
            value={date}
            maxDate={new Date(props.maxDate)}
            minDate={new Date(props.minDate)}
          />
        </div>
      )}
    </div>
  );
}
