//import "./CascoIndex.css";

import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//Components
import PopupAlert from "/components/pop-up/PopupAlert";
import InsuranceIndexPageInformation from "/components/common/InsuranceIndexPageInformation";
import CascoFAQ from "/components/faq/CascoFAQ";
import WhatIsTheXInsurance from "/components/common/WhatIsTheXInsurance";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

//fonksiyonlar
import {
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
  isValidTcKimlikOrVergiKimlik,
  separateLetterAndNumber,
} from "/functions/common";

//Styles
import { inputStyle } from "/styles/custom";

//Images
import { CascoInsuranceInformationPhoto, WhatIsTheCascoInsurance } from "/resources/images";
import { fontSize } from "@mui/system";

function CascoIndex() {
  const cities = useSelector((state) => state.usefull.cities);

  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [state, setState] = useState({
    isExistPlate: true,
    tcOrTaxIdentityNo: "",
    plateNo: "",
    plateShrink: undefined,
  });

  //AutoComplete Selected Variables
  const [selectedCity, setSelectedCity] = useState(null);

  const getKaskoOffers = (data) => {
    //store'daki değeri değiştiriyoruz.
    localStorage.setItem(
      "kaskoIndex",
      JSON.stringify({
        plakaVarmi: state.isExistPlate,
        tcOrTaxIdentityNo: state.tcOrTaxIdentityNo,
        carPlateNo: data.carPlateNo,
        plateCity: selectedCity && selectedCity.value,
      })
    );
    router.push("/insurance/casco/inquiry");
  };

  return (
    <>
      <PopupAlert show={true}>
        <p style={{ fontWeight: "normal", textAlign: "justify" }}>
          Avantajlı tekliflerimizi görebilmek için <b>araç ruhsat bilgilerinizi </b>
          yanınızda bulundurunuz.
        </p>
      </PopupAlert>

      <section className="section">
        <div style={{ marginBottom: "150px" }}>
          <div className="container">
            <div className="row">
              <div className=" col-xs-12 col-sm-12 col-md-6 col-lg-6 d-none d-md-block insuranceIndexPageInformation">
                <InsuranceIndexPageInformation
                  title="Kasko Fiyatlarını Sorgulayın, Bütçenize Uygun Seçeneği Kolayca Bulun!"
                  photo={CascoInsuranceInformationPhoto}
                  detailParagraphs={[
                    "En iyi sigorta şirketlerinin tekliflerini karşılaştırın",
                    "İnternete özel ek indirimlerle online kaskonuzu satın alın",
                    "7/24 hasar desteğinden yararlanın",
                  ]}
                />
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 containerCarPrice">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="contact_thir_form mx-auto">
                      <form autoComplete="off" onSubmit={handleSubmit(getKaskoOffers)}>
                        {/* Plaka Var, Yok Kontrolü */}
                        <div className="d-flex mb-3">
                          <div className="w-50">
                            <div className="custom-radio-button">
                              <input
                                type="radio"
                                name="plakavarmi"
                                id="plakaVar"
                                value={true}
                                checked={state.isExistPlate}
                                onChange={() => setState({ ...state, isExistPlate: true })}
                              />
                              <label htmlFor="plakaVar">Plakam Var</label>
                            </div>
                          </div>
                          <div className="w-50">
                            <div className="custom-radio-button">
                              <input
                                type="radio"
                                name="plakavarmi"
                                id="plakaYok"
                                value={false}
                                checked={!state.isExistPlate}
                                onChange={() => setState({ ...state, isExistPlate: false })}
                              />
                              <label htmlFor="plakaYok">Plakam Yok</label>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          {/**TC kimlik Numarası */}
                          <div className="col-12 mt-4">
                            <TextField
                              {...register("tcOrTaxIdentityNo", {
                                required: "T.C. veya Vergi Kimlik Numarası zorunlu",
                                validate: isValidTcKimlikOrVergiKimlik,
                              })}
                              value={state.tcOrTaxIdentityNo || ""}
                              onChange={(e) => {
                                setState({ ...state, tcOrTaxIdentityNo: e.target.value });
                                setValue("tcOrTaxIdentityNo", e.target.value);
                                clearErrors("tcOrTaxIdentityNo");
                              }}
                              onPaste={(event) => {
                                setState({
                                  ...state,
                                  tcOrTaxIdentityNo: event.clipboardData
                                    .getData("text/plain")
                                    .trim()
                                    .substring(0, 11),
                                });
                                setValue(
                                  "tcOrTaxIdentityNo",
                                  event.clipboardData.getData("text/plain").trim().substring(0, 11)
                                );
                                document.getElementsByName("tcOrTaxIdentityNo")[0].blur();
                                clearErrors("tcOrTaxIdentityNo");
                              }}
                              InputProps={{
                                inputProps: {
                                  type: "number",
                                  maxLength: "11",
                                },
                              }}
                              sx={{
                                ...inputStyle,
                                input: {
                                  fontSize: "15pt !important",
                                  paddingTop: "13px",
                                  paddingBottom: "13px",
                                },
                              }}
                              size="large"
                              error={errors && Boolean(errors["tcOrTaxIdentityNo"])}
                              label=" T.C. veya Vergi Kimlik No *"
                              autoComplete="off"
                            />

                            <small className="text-danger">
                              {errors["tcOrTaxIdentityNo"]?.message}
                              {/**Validate Message */}
                              {errors.tcOrTaxIdentityNo &&
                              errors.tcOrTaxIdentityNo.type == "validate"
                                ? state.tcOrTaxIdentityNo.toString().length == 10
                                  ? "Geçersiz Vergi Kimlik Numarası"
                                  : "Geçersiz T.C. Kimlik Numarası"
                                : ""}
                            </small>
                          </div>
                          {/**Araç Plaka */}
                          {state.isExistPlate ? (
                            <div className="col-12 w-100 mt-4">
                              {state.plateNo}
                              <div
                                className="input-form-with-prefix w-100 "
                                style={{ display: "flex" }}
                              >
                                <div className="bg-main text-white input-form-prefix">TR</div>
                                <TextField
                                  {...register("carPlateNo", {
                                    required: "Araç Plaka Numarası Zorunlu",
                                    pattern: {
                                      value:
                                        /^(0[1-9]|[1-7][0-9]|8[01])((\s?[a-zA-Z]\s?)(\d{4,5})|(\s?[a-zA-Z]{2}\s?)(\d{3,4})|(\s?[a-zA-Z]{3}\s?)(\d{2,3}))$/,
                                      message: "Geçersiz Plaka Numarası",
                                    },
                                  })}
                                  type="text"
                                  placeholder="34 SGR 777"
                                  variant="outlined"
                                  margin="none"
                                  label="Araç Plaka No"
                                  error={!!errors.carPlateNo}
                                  inputProps={{ className: "plate uppercase" }}
                                  onPaste={() => {
                                    clearErrors("carPlateNo");

                                    setState({ ...state, plateShrink: true });
                                  }}
                                  onChange={(e) => {
                                    clearErrors("carPlateNo");
                                    setValue("carPlateNo", e.target.value);
                                    !e.target.value &&
                                      setState({ ...state, plateShrink: undefined });
                                  }}
                                  InputLabelProps={{
                                    shrink: state.plateShrink,
                                  }}
                                  sx={{
                                    ...inputStyle,
                                    input: {
                                      fontSize: "15pt !important",
                                      paddingTop: "13px",
                                      paddingBottom: "13px",
                                    },
                                  }}
                                />
                              </div>

                              <small className="text-danger">
                                {errors && errors["carPlateNo"]?.message}
                              </small>
                            </div>
                          ) : (
                            <div className="col-12 mt-4">
                              <Autocomplete
                                value={selectedCity}
                                onChange={(event, newValue) => {
                                  setSelectedCity(newValue);
                                }}
                                options={cities}
                                getOptionLabel={(option) => option.label}
                                sx={inputStyle}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Araç Plaka İli"
                                    placeholder="İl Seçiniz"
                                    required={true}
                                  />
                                )}
                              />
                            </div>
                          )}
                        </div>

                        <input
                          type="submit"
                          style={{ padding: "12px 26px" }}
                          className="btn-custom w-100 mt-4"
                          value="KASKO TEKLİFİ AL"
                        />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <WhatIsTheXInsurance
                photo={WhatIsTheCascoInsurance}
                title="KASKO NEDİR? NE İŞE YARAR?"
                topTitle="KAZALARA KARŞI ÖNLEMİNİZİ ALIN"
                descriptionParagraphs={[
                  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error illum reprehenderit iste dolorem optio id ipsa eligendi similique animi voluptatem laborum, tempora perferendis labore consequuntur facere aperiam quas consequatur officiis!",
                  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error illum reprehenderit iste dolorem optio id ipsa eligendi similique animi voluptatem laborum, tempora perferendis labore consequuntur facere aperiam quas consequatur officiis!",
                  ,
                ]}
              />
            </div>
          </div>

          <div className="container mt-5">
            <CascoFAQ topic="KASKO SİGORTASI" />
          </div>
        </div>
      </section>
    </>
  );
}

export default CascoIndex;
