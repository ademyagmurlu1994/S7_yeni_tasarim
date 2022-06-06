//import "./CarPriceOffer.css";

import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

//Componentler
import TrafficFAQ from "/components/faq/TrafficFAQ";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import PetStepper from "/components/pet/PetStepper";

//import AdapterDateFns from "@mui/lab/AdapterDateFns";
//import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import Alert from "@mui/material/Alert";
import PreLoader from "/components/PreLoader";
import PreFormLoader from "/components/PreFormLoader";

//fonksiyonlar
import {
  isValidTcKimlik,
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
} from "/functions/common";

//Styles

import { inputStyle } from "/styles/custom";

function CarPriceOffer() {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [state, setState] = useState({
    isCat: true,
    identityNo: "",
    birthDate: "",
    phoneNumber: "",
    activeStep: 1,
    genders: [
      { id: 1, name: "Erkek" },
      { id: 2, name: "Dişi" },
    ],
    ages: [
      { id: 1, name: "0 - 6 aylık" },
      { id: 2, name: "1 yaşında" },
      { id: 3, name: "2 yaşında" },
      { id: 4, name: "3 yaşında" },
      { id: 5, name: "4 yaşında" },
      { id: 6, name: "5 yaşında" },
      { id: 7, name: "6 yaşında" },
    ],
    catBreed: [
      { id: 1, name: "Maine Coon" },
      { id: 2, name: "British Shorthair" },
      { id: 3, name: "Bengal" },
      { id: 4, name: "Siyam" },
      { id: 5, name: "Sfenks" },
      { id: 6, name: "Munchkin" },
    ],
    dogBreed: [
      { id: 1, name: "Kaniş" },
      { id: 2, name: "Buldog" },
      { id: 3, name: "Alman" },
      { id: 4, name: "Pug" },
      { id: 5, name: "Chihuahua" },
      { id: 6, name: "Golden Retriever" },
    ],
  });

  const [selectedBreed, setSelectedBreed] = useState();
  const [selectedGender, setSelectedGender] = useState();
  const [selectedAge, setSelectedAge] = useState();

  const validateFormData = (data) => {
    router.push("/insurance/pet/owner-information");
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
              <h4>Can dostlarınızı Patim Güvende Sigortası ile güvenceye alın.</h4>
            </div>
            {/* Stepper */}

            <div className="col-12 col-lg-11 mt-2">
              <PetStepper activeStep={1}></PetStepper>
            </div>
            {/* Content */}
            <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8 mt-2">
              <div className="row">
                <div className="col-lg-12">
                  <div className="">
                    <form onSubmit={handleSubmit(validateFormData)}>
                      {/**Pet Bilgi Girişi */}
                      <>
                        {/* Kedimi Köpekmi Kontrolü */}
                        <div className="d-flex mb-3 mt-4">
                          <div className="w-50">
                            <div className="custom-radio-button custom-radio-button-with-image">
                              <input
                                type="radio"
                                name="plakavarmi"
                                id="plakaVar"
                                value={true}
                                checked={state.isCat}
                                onChange={() => setState({ ...state, isCat: true })}
                              />
                              <label htmlFor="plakaVar">
                                <img src="/static/img/icons/cat-icon.png" />
                                <h3 className="" style={{ fontWeight: "600" }}>
                                  Kedi
                                </h3>
                              </label>
                            </div>
                          </div>
                          <div className="w-50">
                            <div className="custom-radio-button custom-radio-button-with-image">
                              <input
                                type="radio"
                                name="plakavarmi"
                                id="plakaYok"
                                value={false}
                                checked={!state.isCat}
                                onChange={() => setState({ ...state, isCat: false })}
                              />
                              <label htmlFor="plakaYok">
                                <h3 className="" style={{ fontWeight: "600" }}>
                                  Köpek
                                </h3>
                                <img src="/static/img/icons/dog-icon.png" alt="" />
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="row mt-2 mb-4">
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mt-4">
                            <TextField
                              {...register("pet-name", {
                                required: "Ad alanı zorunlu",
                              })}
                              type="text"
                              sx={inputStyle}
                              size="small"
                              error={Boolean(errors["pet-name"])}
                              label="Adı *"
                            />
                            <small className="text-danger">{errors["pet-name"]?.message}</small>
                          </div>

                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6  mt-4">
                            <Autocomplete
                              value={selectedBreed}
                              onChange={(event, newValue) => {
                                setSelectedBreed(newValue);
                                clearErrors("pet-cins");
                              }}
                              options={state.isCat ? state.catBreed : state.dogBreed}
                              getOptionLabel={(option) => option.name}
                              sx={inputStyle}
                              size="small"
                              renderInput={(params) => (
                                <TextField
                                  {...register("pet-cins", {
                                    required: "Cins alanı zorunlu",
                                  })}
                                  {...params}
                                  label="Cinsi"
                                  required
                                  placeholder="Cins Seçiniz"
                                  error={Boolean(errors["pet-cins"])}
                                />
                              )}
                            />
                            <small className="text-danger">{errors["pet-cins"]?.message}</small>
                          </div>

                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mt-4">
                            <Autocomplete
                              className="readonly"
                              value={selectedGender}
                              onChange={(event, newValue) => {
                                setSelectedGender(newValue);
                                clearErrors("pet-cinsiyet");
                              }}
                              options={state.genders}
                              getOptionLabel={(option) => option.name}
                              sx={inputStyle}
                              size="small"
                              renderInput={(params) => (
                                <TextField
                                  {...register("pet-cinsiyet", {
                                    required: "Cinsiyet alanı zorunlu",
                                  })}
                                  {...params}
                                  label="Cinsiyeti"
                                  required
                                  placeholder="Cinsiyeti Seçiniz"
                                  error={Boolean(errors["pet-cinsiyet"])}
                                />
                              )}
                            />
                            <small className="text-danger">{errors["pet-cinsiyet"]?.message}</small>
                          </div>

                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6  mt-4">
                            <Autocomplete
                              className="readonly"
                              value={selectedAge}
                              onChange={(event, newValue) => {
                                setSelectedAge(newValue);
                                clearErrors("pet-yas");
                              }}
                              options={state.ages}
                              getOptionLabel={(option) => option.name}
                              sx={inputStyle}
                              size="small"
                              renderInput={(params) => (
                                <TextField
                                  {...register("pet-yas", {
                                    required: "Yaş alanı zorunlu",
                                  })}
                                  {...params}
                                  label="Yaş"
                                  required
                                  placeholder="Yaş Seçiniz"
                                  error={Boolean(errors["pet-yas"])}
                                />
                              )}
                            />
                            <small className="text-danger">{errors["pet-yas"]?.message}</small>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CarPriceOffer;
