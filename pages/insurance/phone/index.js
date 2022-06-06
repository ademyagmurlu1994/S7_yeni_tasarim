//import "./PhoneIndex.css";

import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

//Componentler
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import PhoneStepper from "/components/phone/PhoneStepper";

//fonksiyonlar
import {
  isValidTcKimlik,
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
  isValidImeiNumber,
} from "/functions/common";

//Styles
import { inputStyle } from "/styles/custom";

//İmages
import { PhoneIcon } from "/resources/images";

function PhoneIndex() {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [state, setState] = useState({
    imeiNumber: "",
    phoneCompanies: [
      { id: 1, name: "Samsung" },
      { id: 2, name: "Iphone" },
      { id: 3, name: "Huwaei" },
      { id: 4, name: "Xiaomi" },
      { id: 5, name: "General Mobile" },
    ],
    phoneModels: [
      { id: 1, name: "S20+" },
      { id: 2, name: "S21+" },
      { id: 3, name: "S22" },
      { id: 4, name: "S20" },
      { id: 5, name: "E52" },
    ],
  });

  const [selectedCompany, setSelectedCompany] = useState();
  const [selectedPhoneModel, setSelectedPhoneModel] = useState();

  const validateFormData = (data) => {
    router.push("/insurance/phone/owner-information");
  };

  const getKaskoOffers = (data) => {
    //store'daki değeri değiştiriyoruz.
    localStorage.setItem(
      "kaskoIndex",
      JSON.stringify({
        isCat: state.isCat,
        tcKimlikNumarasi: data.tcKimlikNumarasi,
        aracPlakaNo: data.aracPlakaNo,
        dogumTarihi: data.dogumTarihi,
      })
    );
    router.push("/insurance/traffic/inquiry");
  };

  const nullControl = (data) => {
    if (data) {
      return true;
    } else {
      return false;
    }
  };
  // console.log(watch());

  //console.log(errors);

  return (
    <>
      <section className="section">
        <div style={{ marginTop: "20px", marginBottom: "150px" }} className="container">
          <div className="row justify-content-center">
            <div className=" col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
              <h4>Telefonunuzu Sigorta ile güvenceye alın.</h4>
            </div>
            {/* Stepper */}
            <div className="col-12 col-lg-11 mt-2">
              <PhoneStepper activeStep={1}></PhoneStepper>
            </div>
            {/* Content */}
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 mt-2">
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <form onSubmit={handleSubmit(validateFormData)}>
                    {/**Phone Bilgi Girişi */}
                    <>
                      <div className="row mt-2 mb-4">
                        <div className="col-12 mt-4">
                          <Autocomplete
                            value={selectedCompany}
                            onChange={(event, newValue) => {
                              setSelectedCompany(newValue);
                              clearErrors("phone-company");
                            }}
                            options={state.phoneCompanies}
                            getOptionLabel={(option) => option.name}
                            sx={inputStyle}
                            size="small"
                            renderInput={(params) => (
                              <TextField
                                {...register("phone-company", {
                                  required: "Marka alanı zorunlu",
                                })}
                                {...params}
                                label="Marka"
                                required
                                placeholder="Marka Seçiniz"
                                error={Boolean(errors["phone-company"])}
                              />
                            )}
                          />
                          <small className="text-danger">{errors["phone-company"]?.message}</small>
                        </div>

                        <div className="col-12 mt-4">
                          <Autocomplete
                            value={selectedPhoneModel}
                            onChange={(event, newValue) => {
                              setSelectedPhoneModel(newValue);
                              clearErrors("phone-model");
                            }}
                            options={state.phoneModels}
                            getOptionLabel={(option) => option.name}
                            sx={inputStyle}
                            size="small"
                            renderInput={(params) => (
                              <TextField
                                {...register("phone-model", {
                                  required: "Model alanı zorunlu",
                                })}
                                {...params}
                                label="Model"
                                required
                                placeholder="Model Seçiniz"
                                error={Boolean(errors["phone-model"])}
                              />
                            )}
                          />
                          <small className="text-danger">{errors["phone-model"]?.message}</small>
                        </div>

                        <div className="col-12 mt-4">
                          <TextField
                            {...register("imeiNumber", {
                              required: "Imei Number alanı zorunlu",
                              validate: isValidImeiNumber,
                              min: {
                                value: 15,
                                message: "En az iki hane olmak zorunda",
                              },
                            })}
                            type="number"
                            value={state.imeiNumber}
                            onChange={(e) => {
                              setState({
                                ...state,
                                imeiNumber: e.target.value,
                              });
                            }}
                            sx={{ width: "100%" }}
                            size="small"
                            error={Boolean(errors["imeiNumber"])}
                            label="Imei Number"
                            maxLength={15}
                          />
                          <small className="text-danger">
                            {errors["imeiNumber"]?.message}
                            {/**Validate Message */}
                            {errors.imeiNumber &&
                              errors.imeiNumber.type == "validate" &&
                              "Geçersiz Imei Numarası"}
                          </small>
                        </div>

                        <div className="col-12 ">
                          <div className="row justify-content-end">
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6  mt-4 ">
                              <input
                                type="submit"
                                style={{ padding: "12px 26px" }}
                                className="btn-custom w-100 mt-4"
                                value="İLERİ"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  </form>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mobile-mode-display-none">
                  <div className="d-flex justify-content-center">
                    <img src={PhoneIcon} width="auto" style={{ maxHeight: "200px" }} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PhoneIndex;
