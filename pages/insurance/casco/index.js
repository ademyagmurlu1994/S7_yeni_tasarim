//import "./CascoIndex.css";

import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//Components
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

function CascoIndex() {
  const cities = useSelector((state) => state.usefull.cities);

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [state, setState] = useState({
    isExistPlate: true,
    tcOrTaxIdentityNo: "",
    plateNo: "",
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
      <section className="section">
        <div style={{ marginTop: "100px", marginBottom: "150px" }}>
          <div className="container">
            <div className="row">
              <div className=" col-xs-12 col-sm-12 col-md-6 col-lg-6 insuranceIndexPageInformation">
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
                      <form onSubmit={handleSubmit(getKaskoOffers)}>
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
                            <div className="custom_textfield w-100">
                              <input
                                {...register("tcOrTaxIdentityNo", {
                                  required: "T.C. veya Vergi Kimlik Numarası zorunlu",
                                  validate: isValidTcKimlikOrVergiKimlik,
                                })}
                                value={state.tcOrTaxIdentityNo}
                                onChange={(e) => {
                                  setState({ ...state, tcOrTaxIdentityNo: e.target.value });
                                  clearErrors("tcOrTaxIdentityNo");
                                }}
                                class={`form__input ${errors.tcOrTaxIdentityNo && "invalid"}`}
                                name="tcOrTaxIdentityNo"
                                id="tcOrTaxIdentityNo"
                                placeholder=" "
                                type="number"
                                maxLength={11}
                              />
                              <label for="tcOrTaxIdentityNo" className="form__label">
                                T.C. veya Vergi Kimlik No
                              </label>
                              <label className="legend">T.C. veya Vergi Kimlik No</label>
                            </div>
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
                                <div className="input-with-prefix">
                                  <div className="custom_textfield w-100">
                                    <input
                                      type="text"
                                      class={`form__input plate uppercase ${
                                        errors.tcOrTaxIdentityNo && "invalid"
                                      }`}
                                      {...register("carPlateNo", {
                                        required: "Araç Plaka numarası zorunlu",
                                        pattern: {
                                          value:
                                            /^(0[1-9]|[1-7][0-9]|8[01])((\s?[a-zA-Z]\s?)(\d{4,5})|(\s?[a-zA-Z]{2}\s?)(\d{3,4})|(\s?[a-zA-Z]{3}\s?)(\d{2,3}))$/,
                                          message: "Geçersiz plaka numarası",
                                        },
                                      })}
                                      name="carPlateNo"
                                      id="carPlateNo"
                                      placeholder="34 SGR 777"
                                    />
                                    <label for="carPlateNo" className="form__label">
                                      Araç Plaka No
                                    </label>
                                    <label className="legend">Araç Plaka No</label>
                                  </div>
                                </div>
                              </div>

                              <small className="text-danger">{errors["carPlateNo"]?.message}</small>
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
                  "DASK (Doğal Afetler Sigortalar Kurumu) Zorunlu Deprem Sigortası; depremin ve deprem sonucu meydana gelen yangın, patlama, tsunami ile yer kaymasının doğrudan neden olacağı maddi zararları, sigorta poliçesinde belirtilen limitler kapsamında karşılayan bir sigorta türüdür.",
                  "Zorunlu Deprem Sigortası yaptırdığınız zaman binanız tamamen ya da kısmen zarar gördüğünde teminat altına alınır. DASK yaptırmadığınız durumlarda ise bu yardımdan yararlanamazsınız.",
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
