import React, { useState, useEffect, useCallback } from "react";
import { cloneDeep, cloneDeepWith, clone } from "lodash-es";

//Mui components
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";

const Button = (props) => {
  const [buttonStyle, setButtonStyle] = useState();
  let style = {
    fontSize: "12pt",
    fontWeight: "500",
    border: "2px solid var(--color-one) !important",
    color: "white",
    backgroundColor: "var(--color-one) !important",
    textTransform: "none !important",
    "&:hover": {
      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px !important",
    },
    opacity: "100%",
  };

  useEffect(() => {
    setButtonStyleByVariant();
  }, []);

  useEffect(() => {
    if (buttonStyle) {
      setButtonStyleByVariant();
    }
  }, [props.variant]);

  useEffect(() => {
    if (buttonStyle) {
      setButtonSize();
    }
  }, [props.size]);

  useEffect(() => {
    if (props.loading && buttonStyle) {
      //alert("loading");
      let btnStyle = cloneDeep(buttonStyle);
      if (props.variant != "text") {
        btnStyle.color = "var(--color-one) !important";
        btnStyle.backgroundColor = "#e5e5e5 !important";
        btnStyle.borderColor = "#e5e5e5 !important";

        setButtonStyle(btnStyle);
      }
    } else {
      ////alert("girdi false");
      setButtonStyleByVariant();
    }
  }, [props.loading]);

  useEffect(() => {
    if (buttonStyle) {
      let btnStyle = cloneDeep(buttonStyle);
      if (props.disabled) {
        btnStyle.opacity = "50% !important";
      } else {
        btnStyle.opacity = "100% !important";
      }
      setButtonStyle(btnStyle);
    }
  }, [props.disabled]);

  const setButtonStyleByVariant = () => {
    //alert("setStyle");

    let btnStyle = buttonStyle ? cloneDeep(buttonStyle) : style;
    switch (props.variant) {
      case "outlined":
        switch (props.bgColor) {
          case "orange":
            btnStyle.color = "var(--color-two) !important";
            btnStyle.backgroundColor = "white !important";
            btnStyle.borderColor = "var(--color-two) !important";
            break;
          default:
            btnStyle.color = "var(--color-one) !important";
            btnStyle.backgroundColor = "white !important";
            btnStyle.borderColor = "var(--color-one) !important";
            break;
        }

        break;
      case "text":
        btnStyle.color = "var(--color-one) !important";
        btnStyle.backgroundColor = "white !important";
        btnStyle.borderColor = "transparent !important";
        btnStyle.boxShadow = "none !important";
        btnStyle["&:hover"] = {
          backgroundColor: "var(--color-one-light) !important",
        };
        break;
      default:
        switch (props.bgColor) {
          case "orange":
            btnStyle.color = "white !important";
            btnStyle.backgroundColor = "var(--color-two) !important";
            btnStyle.borderColor = "var(--color-two) !important";
            break;
          default:
            btnStyle.color = "white !important";
            btnStyle.backgroundColor = "var(--color-one) !important";
            btnStyle.borderColor = "var(--color-one) !important";
            break;
        }

        break;
    }

    if (props.disabled) {
      btnStyle.opacity = "50% !important";
    } else {
      btnStyle.opacity = "100% !important";
    }

    switch (props.size) {
      case "small":
        btnStyle.fontSize = "10pt !important";
        break;
      case "large":
        btnStyle.fontSize = "14pt !important";
        break;
      default:
        btnStyle.fontSize = "12pt !important";
        break;
    }

    setButtonStyle(btnStyle);
  };

  const setButtonSize = () => {
    if (buttonStyle) {
      let btnStyle = cloneDeep(buttonStyle);
      switch (props.size) {
        case "small":
          btnStyle.fontSize = "5pt !important";
          break;
        case "large":
          btnStyle.fontSize = "14pt !important";
          break;
        default:
          btnStyle.fontSize = "12pt !important";
          break;
      }
      setButtonStyle(btnStyle);
    }
  };

  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
    }
  };

  const CustomLoadingButton = styled(LoadingButton)(({ theme }) => buttonStyle);

  return (
    <>
      <CustomLoadingButton onClick={() => handleClick()} {...props}>
        <div className={`${props.loading && "invisible"}`}>{props.children}</div>
      </CustomLoadingButton>
    </>
  );
};

export default Button;
