import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

//components
import InsuranceIndexPageInformation from "/components/common/InsuranceIndexPageInformation";
import TravelFAQ from "/components/faq/TravelFAQ";
import WhatIsTheXInsurance from "/components/common/WhatIsTheXInsurance";
import Button from "/components/form/Button";

//Mui Componentler
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

//fonksiyonlar
import {
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
  getNewToken,
  isValidMaskedDate,
  changeDateFormat,
  isValidTcKimlikOrVergiKimlik,
  isValidTcKimlik,
} from "/functions/common";

//styles
import { inputStyle } from "/styles/custom";

//images
import { DaskInsuranceInformationPhoto, WhatIsTheDaskInsurance } from "/resources/images";

export default function travelIndex() {
  const [state, setState] = useState({
    identityShrink: undefined,
    identityNo: undefined,
  });

  const {
    register,
    handleSubmit,
    setError,
    watch,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const getTravelHealthOffers = (data) => {
    //store'daki değeri değiştiriyoruz.
    localStorage.setItem(
      "travelIndex",
      JSON.stringify({
        identityNo: state.identityNo,
      })
    );
    router.push("/insurance/health/travel/inquiry");
  };

  return (
    <>
      <section className="section">
        <div style={{}}>
          <div className="container">
            <div className="row mb-5">
              <div className=" col-xs-12 col-sm-12 col-md-6 col-lg-6 d-none d-md-block">
                <InsuranceIndexPageInformation
                  title="En uygun Seyahat Sağlık poliçesini , 1 Dakika içinde seçerek alabilirsiniz!"
                  photo={""}
                  detailParagraphs={[
                    "En iyi sigorta şirketlerinin tekliflerini karşılaştırın",
                    "İnternete özel ek indirimlerle seyahat sağlık sigortası yaptırın!",
                  ]}
                />
              </div>
              <div
                className="col-xs-12 col-sm-12 col-md-6 col-lg-6"
                style={{ backgroundColor: "var(--main-color-light)", padding: "20px 10px" }}
              >
                <div className="row">
                  <div className="col-lg-12">
                    <div className="contact_thir_form mx-auto">
                      {
                        <form autoComplete="off" onSubmit={handleSubmit(getTravelHealthOffers)}>
                          <div className="tckn-input-card">
                            <div className="tc-kimlik-no mt-4">
                              <TextField
                                {...register("identityNo", {
                                  required: "T.C. Kimlik Numarası zorunlu",
                                  validate: isValidTcKimlik,
                                })}
                                onPaste={() => {
                                  setState({ ...state, identityShrink: true });
                                  clearErrors("identityNo");
                                }}
                                onChange={(e) => {
                                  setState({ ...state, identityNo: e.target.value });
                                  clearErrors("identityNo");
                                }}
                                value={state.identityNo}
                                placeholder="T.C. Kimlik Numarası"
                                variant="outlined"
                                margin="none"
                                label="T.C. Kimlik Numarası"
                                error={errors && Boolean(errors["identityNo"])}
                                inputProps={{
                                  maxLength: "11",
                                  type: "number",
                                }}
                                InputLabelProps={{
                                  shrink: state.identityShrink,
                                }}
                                sx={inputStyle}
                              />
                              <small className="text-danger">
                                {errors["identityNo"]?.message}
                                {/**Validate Message */}
                                {errors["identityNo"]
                                  ? errors["identityNo"].type == "validate"
                                    ? "Geçersiz T.C. Kimlik Numarası"
                                    : ""
                                  : ""}
                              </small>
                            </div>
                            <div className="information-for-new-policy mt-3">
                              <Alert
                                severity="info"
                                style={{ fontSize: "11pt" }}
                                sx={{ backgroundColor: "transparent", mx: "0px", px: "0px" }}
                              >
                                TCKN size özel teklif üretebilmemiz için gerekmektedir.
                              </Alert>
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-100 mt-3"
                            disabled={
                              (errors && Object.keys(errors).length) ||
                              !state.identityNo ||
                              (state.identityNo && state.identityNo.toString().length != 11)
                            }
                          >
                            SEYAHAT SAĞLIK TEKLİFİ AL
                          </Button>
                        </form>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*Seyahat Sağlık Sigortası Nedir?*/}
          <div className="row">
            <div className="col-12">
              <WhatIsTheXInsurance
                title="SEYAHAT SAĞLIK SİGORTASI NEDİR? NE İŞE YARAR?"
                topTitle="HASTALIKLARA KARŞI ÖNLEMİNİZİ ALIN"
                descriptionParagraphs={[
                  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error illum reprehenderit iste dolorem optio id ipsa eligendi similique animi voluptatem laborum, tempora perferendis labore consequuntur facere aperiam quas consequatur officiis!",
                  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error illum reprehenderit iste dolorem optio id ipsa eligendi similique animi voluptatem laborum, tempora perferendis labore consequuntur facere aperiam quas consequatur officiis!",
                  ,
                ]}
              />
            </div>
          </div>

          {/*Sıkça Sorulan sorular */}
          <div className="container mt-5">
            <TravelFAQ topic="SEYAHAT SAĞLIK SİGORTASI" />
          </div>
        </div>
      </section>
    </>
  );
}
