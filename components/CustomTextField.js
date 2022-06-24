// ./components/FormInput.js
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useFormControl } from "@mui/material";
import { RegisterOptions, DeepMap, FieldError, UseFormRegister, Path } from "react-hook-form";

const TextInput = (props, register, error) => {
  const [inputValue, setInputValue] = useState();

  function handleChange(event) {
    setInputValue(event.target.value);
    if (props.onChange) props.onChange(inputValue);
  }
  return (
    <>
      <div className="input-form-with-prefix w-100 " style={{ display: "flex" }}>
        {/* {props.prefix && (
          <div className="bg-main text-white input-form-prefix" style={{ marginTop: "6px" }}>
            <div dangerouslySetInnerHTML={{ __html: props.prefix }}></div>
          </div>
        )}

        <div className="input-with-prefix">
          <label className="pure-material-textfield-outlined" style={{ width: "100%" }}>
            <input
              placeholder=" "
              onChange={handleChange}
              value={inputValue}
              {...props}
              style={{ backgroundColor: props.backgroundColor }}
              ref={register}
            />
            <span>{props.label}</span>
          </label>
          {error && error.message}
        </div> */}
      </div>
    </>
  );
};

// TextInput.protoTypes = {
//   // react-select component class (e.g. Select, Creatable, Async)
//   register: UseFormRegister,
//   rules: RegisterOptions,
// };

export default TextInput;
