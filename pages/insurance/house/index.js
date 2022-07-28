//import "./CascoIndex.css";

import { useForm, Controller } from "react-hook-form";
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
  isValidMaskedDate,
} from "/functions/common";

//Styles
import { inputStyle } from "/styles/custom";

//Images
import { CascoInsuranceInformationPhoto, WhatIsTheCascoInsurance } from "/resources/images";

function CascoIndex() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    control,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [state, setState] = useState({
    tcOrTaxIdentityNo: "",
    birthDate: "",
  });

  //AutoComplete Selected Variables
  const [selectedCity, setSelectedCity] = useState(null);

  const validateData = (data) => {
    //store'daki değeri değiştiriyoruz.
    localStorage.setItem(
      "houseIndex",
      JSON.stringify({
        tcOrTaxIdentityNo: state.tcOrTaxIdentityNo,
        birthDate: state.birthDate,
      })
    );
    router.push("/insurance/house/inquiry");
  };

  return (
    <>
      <section className="section">
        <div style={{ marginBottom: "150px" }}>
          <div className="container">
            <div className="row">
              <div className=" col-xs-12 col-sm-12 col-md-6 col-lg-6 d-none d-md-block insuranceIndexPageInformation">
                <InsuranceIndexPageInformation
                  title="Konut Sigortası için Fiyat Teklifi Al, Evini Sigortala"
                  //photo={}
                  detailParagraphs={[
                    "Konutun için onlarca fiyatı karşılaştır",
                    "En kapsamlı poliçeyi özel indirimlerle satın al",
                    "Evini ve eşyalarını güvence altına al",
                  ]}
                />
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 containerCarPrice">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="contact_thir_form mx-auto">
                      <form autoComplete="off" onSubmit={handleSubmit(validateData)}>
                        <div className="row">
                          {/**TC kimlik Numarası */}
                          {/**TC kimlik Numarası */}
                          <div className="col-12 mt-4">
                            <TextField
                              {...register("tcOrTaxIdentityNo", {
                                required: "T.C. veya Vergi Kimlik Numarası Zorunlu",
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
                          {/**Doğum Tarihi */}
                          <div className="col-12 w-100 mt-4">
                            <Controller
                              name={"birthDate"}
                              control={control}
                              rules={{
                                required: "Doğum Tarihi Zorunlu",
                                validate: isValidMaskedDate,
                              }}
                              render={(props) => (
                                <TextField
                                  InputLabelProps={{
                                    //shrink: true,
                                    //required: true,
                                    fontSize: "15pt",
                                  }}
                                  InputProps={{
                                    inputProps: {
                                      max: getTodayDate(),
                                      className: "date-mask",
                                    },
                                  }}
                                  value={state.birthDate}
                                  onKeyUp={(e) => {
                                    {
                                      setState({ ...state, birthDate: e.target.value });
                                      clearErrors("birthDate");
                                      setValue("birthDate", e.target.value);
                                    }
                                  }}
                                  name="birthDate"
                                  id="birthDate"
                                  sx={{
                                    ...inputStyle,
                                    input: {
                                      fontSize: "15pt !important",
                                      paddingTop: "13px",
                                      paddingBottom: "13px",
                                    },
                                  }}
                                  size="large"
                                  error={errors && Boolean(errors["birthDate"])}
                                  label="Doğum Tarihi"
                                  placeholder="gg.aa.yyyy"
                                  autoComplete="off"
                                  {...props}
                                />
                              )}
                            />

                            <small className="text-danger">
                              {errors && errors["birthDate"]?.message}
                              {/**Validate Message */}
                              {errors && errors.birthDate && errors.birthDate.type == "validate"
                                ? "Geçersiz Doğum Tarihi"
                                : ""}
                            </small>
                          </div>
                        </div>

                        <input
                          type="submit"
                          style={{ padding: "12px 26px" }}
                          className="btn-custom w-100 mt-4"
                          value="KONUT SİGORTASI TEKLİFİ AL"
                        />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row d-none">
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

          <div className="container mt-5 d-none">
            <CascoFAQ topic="KASKO SİGORTASI" />
          </div>
        </div>
      </section>
    </>
  );
}

export default CascoIndex;
