/* eslint-disable import/no-anonymous-default-export */
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import Cookies from "js-cookie";

import axios from "/instances/axios";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

//const secret = publicRuntimeConfig.NEXT_PUBLIC_SECRET;

export const login = (loginData, apiToken) => {
  return new Promise(async (resolve, reject) => {
    const secret = publicRuntimeConfig.NEXT_PUBLIC_SECRET;
    try {
      await axios
        .post("/api/auth/v1/user/login", loginData, {
          headers: {
            Authorization: apiToken,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success === true) {
            resolve({ success: true, user: res.data.data });
          } else {
            reject({ message: "Failed" });
          }
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const setLocalAuth = (user) => {
  const secret = publicRuntimeConfig.NEXT_PUBLIC_SECRET;
  const token = sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
      username: user.email,
    },
    secret
  );

  const nextAuth = {
    loggedIn: true,
    user: user,
  };
  Cookies.set("SigortaJWT", token.toString(), { expires: 7, path: "" }); //7 gün
  localStorage.setItem("nextAuth", JSON.stringify(nextAuth));
};
export const logout = () => {
  try {
    Cookies.remove("SigortaJWT");
    localStorage.removeItem("nextAuth");
  } catch (error) {
    console.log(error);
  }
};

export const getNextAuth = () => {
  let nextAuth = localStorage.getItem("nextAuth");
  if (nextAuth) {
    return JSON.parse(nextAuth);
  } else {
    return false;
  }
};
