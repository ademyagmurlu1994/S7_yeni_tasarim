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
    border: "2px solid var(--main-color) !important",
    color: "white",
    backgroundColor: "var(--main-color) !important",
    textTransform: "none !important",
    "&:hover": {
      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px !important",
    },
    opacity: "100%",
  };

  useEffect(() => {
    setButtonStyleByVariant();
    setButtonSize();
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
        btnStyle.color = "var(--main-color) !important";
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
    console.log(props.variant);
    switch (props.variant) {
      case "outlined":
        console.log("a");
        btnStyle.color = "var(--main-color) !important";
        btnStyle.backgroundColor = "white !important";
        btnStyle.borderColor = "var(--main-color) !important";
        break;
      case "text":
        console.log("b");
        btnStyle.color = "var(--main-color) !important";
        btnStyle.backgroundColor = "white !important";
        btnStyle.borderColor = "transparent !important";
        break;
      default:
        console.log("c");
        btnStyle.color = "white !important";
        btnStyle.backgroundColor = "var(--main-color) !important";
        btnStyle.borderColor = "var(--main-color) !important";
        break;
    }

    if (props.disabled) {
      btnStyle.opacity = "50% !important";
    } else {
      btnStyle.opacity = "100% !important";
    }

    setButtonStyle(btnStyle);
  };

  const setButtonSize = () => {
    //alert("setSize");

    if (buttonStyle) {
      let btnStyle = cloneDeep(buttonStyle);
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
