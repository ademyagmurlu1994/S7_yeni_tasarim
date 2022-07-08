import Link from "next/link";
import { logo } from "/resources/images";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";
import { Router } from "react-router-dom";

//Components
import Button from "/components/form/Button";

//images
import {
  AkSigortaLogo,
  AnadoluLogo,
  AllianzLogo,
  AveonGlobalLogo,
  AxaLogo,
  EurekoLogo,
  GroupamaLogo,
  HdiLogo,
  KoruLogo,
  MapfreLogo,
  NeovaLogo,
  PriveLogo,
  QuickLogo,
  SompoLogo,
  TurkiyeSigortaLogo,
  TurkNipponLogo,
  ZurichLogo,
} from "/resources/images";
import { width } from "@mui/system";

const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    resetField,
    control,
    formState: { errors },
  } = useForm();

  const anlasmaliSirketler = [
    AkSigortaLogo,
    AnadoluLogo,
    AllianzLogo,
    AveonGlobalLogo,
    AxaLogo,
    EurekoLogo,
    GroupamaLogo,
    HdiLogo,
    KoruLogo,
    MapfreLogo,
    NeovaLogo,
    PriveLogo,
    QuickLogo,
    SompoLogo,
    TurkiyeSigortaLogo,
    TurkNipponLogo,
    ZurichLogo,
  ];

  return (
    <>
      <section className="section">
        <div className="container">
          <h3 className="mt-4 text-center text-secondary">
            <b>Anlaşmalı Şirketler</b>
          </h3>

          <div className="anlasmalı-sirketler-wrapper">
            <div className="row">
              {anlasmaliSirketler.map((sirket, index) => {
                return (
                  <div className="col col-4 col-md-3 col-lg-2">
                    <div className="anlasmali-sirket d-flex align-items-center">
                      <img src={sirket} alt="" />
                      {/* <Button size="small" variant="outlined" sx={{ width: "100%", mt: "20px" }}>
                        Siteye Git
                      </Button> */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="clear-fix"></div>
        </div>
      </section>
    </>
  );
};

export default Login;
