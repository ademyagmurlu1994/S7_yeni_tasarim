// ./components/FormInput.js
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useFormControl } from "@mui/material";
import { RegisterOptions, DeepMap, FieldError, UseFormRegister, Path } from "react-hook-form";

const DateField = (props) => {
  const [inputValue, setInputValue] = useState();

  const handleChange = (event) => {
    // console.log("Date İnput: ", event.target.value);
    setInputValue(event.target.value);
    console.log(event);
    if (props.onKeyUp) {
      props.onKeyUp(event);
    }
  };

  return (
    <>
      <input
        type="text"
        className="date-mask"
        placeholder="gg.aa.yyyy"
        value={inputValue}
        onKeyUp={(e) => handleChange(e)}
        autocomplete="off"
        {...props}
      />
    </>
  );
};

// TextInput.protoTypes = {
//   // react-select component class (e.g. Select, Creatable, Async)
//   register: UseFormRegister,
//   rules: RegisterOptions,
// };

export default DateField;
