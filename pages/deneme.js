import React, { useState, useEffect, useCallback } from "react";
//Componentler
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import PagePreLoader from "/components/common/PagePreLoader";
import ServerErrorAlert from "/components/common/ServerErrorAlert";

import axios from "/instances/axios";
import getConfig from "next/config";
const { publicRuntimeConfig: config } = getConfig();

const Login = () => {
  return (
    <>
      <div className="" style={{ marginTop: "100px" }}>
        <input className="text-input" type="text" />
        <input className="text-input" type="text" />
      </div>
      {/* <ServerErrorAlert /> */}
      {/* USer ID= {publicRuntimeConfig.BACKEND_API_URL} */}
      Config: {JSON.stringify(config)}
      Env: {JSON.stringify(process.env.ENVIROMENT_VAR)}
      Env_next_config: {JSON.stringify(process.env.ENVIROMENT_VAR)}
    </>
  );
};

export default Login;
