//import "./CascoIndex.css";

import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

//Components
import CascoFAQ from "/components/faq/CascoFAQ";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import CustomTextField from "/components/CustomTextField";

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
    tcOrTaxIdentityNo: null,
    plateNo: "",
    identityShrink: undefined,
    plateShrink: undefined,
  });

  //AutoComplete Selected Variables
  const [selectedCity, setSelectedCity] = useState(null);

  const { identityRef, ...identityInputProps } = register("tcOrTaxIdentityNo", {
    required: "T.C. veya Vergi Kimlik Numarası zorunlu",
    validate: isValidTcKimlikOrVergiKimlik,
  });

  const { plateRef, ...plateInputProps } = register("carPlateNo", {
    required: "Araç Plaka numarası zorunlu",
    pattern: {
      value:
        /^(0[1-9]|[1-7][0-9]|8[01])((\s?[a-zA-Z]\s?)(\d{4,5})|(\s?[a-zA-Z]{2}\s?)(\d{3,4})|(\s?[a-zA-Z]{3}\s?)(\d{2,3}))$/,
      message: "Geçersiz plaka numarası",
    },
  });

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
        <div style={{ marginTop: "100px", marginBottom: "150px" }} className="container">
          <div className="row">
            <div className=" col-xs-12 col-sm-12 col-md-6 col-lg-6 insuranceIndexPageInformation">
              <h3>Kasko Fiyatlarını Sorgulayın,</h3>
              <h3>Bütçenize Uygun Seçeneği Kolayca Bulun!</h3>
              <div className="insuranceIndexPageInformationDetails">
                <li>En iyi sigorta şirketlerinin tekliflerini karşılaştırın</li>
                <li>İnternete özel ek indirimlerle online kaskonuzu satın alın</li>
                <li>7/24 hasar desteğinden yararlanın</li>
              </div>
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
                          <TextField
                            placeholder="T.C. veya Vergi Kimlik No"
                            variant="outlined"
                            margin="none"
                            label="T.C. veya Vergi Kimlik No"
                            error={!!errors.tcOrTaxIdentityNo}
                            inputRef={identityRef}
                            inputProps={{
                              maxLength: "11",
                              type: "number",
                            }}
                            {...identityInputProps}
                            InputLabelProps={{
                              shrink: state.identityShrink,
                            }}
                            sx={inputStyle}
                            value={state.tcOrTaxIdentityNo}
                            onPaste={() => {
                              setState({ ...state, identityShrink: true });
                              clearErrors("tcOrTaxIdentityNo");
                            }}
                            onChange={(e) => {
                              setState({ ...state, tcOrTaxIdentityNo: e.target.value });
                              clearErrors("tcOrTaxIdentityNo");
                            }}
                          />

                          <small className="text-danger">
                            {errors["tcOrTaxIdentityNo"]?.message}
                            {/**Validate Message */}
                            {errors.tcOrTaxIdentityNo && errors.tcOrTaxIdentityNo.type == "validate"
                              ? state.tcOrTaxIdentityNo.toString().length == 10
                                ? "Geçersiz Vergi Kimlik Numarası"
                                : "Geçersiz T.C. Kimlik Numarası"
                              : ""}
                          </small>
                        </div>
                        {/**Araç Plaka */}
                        {state.isExistPlate ? (
                          <div className="col-12 w-100 mt-4">
                            <div
                              className="input-form-with-prefix w-100 "
                              style={{ display: "flex" }}
                            >
                              <div className="bg-main text-white input-form-prefix">TR</div>
                              <TextField
                                type="text"
                                placeholder="34 SGR 777"
                                variant="outlined"
                                margin="none"
                                label="Araç Plaka No"
                                error={!!errors.carPlateNo}
                                inputRef={plateRef}
                                inputProps={{ className: "plate uppercase" }}
                                {...plateInputProps}
                                onPaste={() => {
                                  clearErrors("carPlateNo");
                                  setState({ ...state, plateShrink: true });
                                }}
                                onChange={(e) => {
                                  clearErrors("carPlateNo");
                                  !e.target.value && setState({ ...state, plateShrink: undefined });
                                }}
                                InputLabelProps={{
                                  shrink: state.plateShrink,
                                }}
                                sx={inputStyle}
                              />
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

          <div className="row mt-5">
            <div className="col-12">
              <h3 className="text-center">
                <b>KASKO SİGORTASI HAKKINDA SIK SORULAN SORULAR</b>{" "}
              </h3>
              <CascoFAQ></CascoFAQ>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CascoIndex;
