import Link from "next/link";
import { logo } from "/resources/images";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";

const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [state, setState] = useState({
    phoneNumber: "",
    email: "",
    password: "",
    isShowVerifyCode: false,
  });

  const [isAcceptNotification, setIsAcceptNotification] = useState();

  const onLogin = (data) => {
    console.log(data);
    setState({ ...state, isShowVerifyCode: true });
  };

  const notificationCallback = useCallback((isAcceptNotification) => {
    setIsAcceptNotification(isAcceptNotification);
    console.log(isAcceptNotification);
  }, []);

  const singleCodeVerificationCallback = useCallback((isVerifyCode) => {
    //setIsAcceptNotification(isAcceptNotification);
    console.log(isVerifyCode);
    if (isVerifyCode) {
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  }, []);

  return <></>;
};

export default Login;
