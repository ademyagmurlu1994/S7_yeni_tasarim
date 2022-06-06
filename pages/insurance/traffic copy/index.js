//import "./CascoIndex.css";

import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

//Componentler
import TrafficFAQ from "/components/faq/TrafficFAQ";

//fonksiyonlar
import {
  isValidTcKimlik,
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
  isValidTcKimlikOrVergiKimlik,
} from "/functions/common";

function CascoIndex() {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [state, setState] = useState({
    isVehicleLicenseWithMe: true,
    tcOrTaxIdentityNo: "",
    birthDate: "",
  });

  const getKaskoOffers = (data) => {
    //store'daki değeri değiştiriyoruz.
    localStorage.setItem(
      "kaskoIndex",
      JSON.stringify({
        plakaVarmi: state.isVehicleLicenseWithMe,
        tcOrTaxIdentityNo: data.tcOrTaxIdentityNo,
        carPlateNo: data.carPlateNo,
        birthDate: state.birthDate,
      })
    );
    router.push("/insurance/traffic/inquiry");
  };

  const birthDateRequirementControl = (value) => {
    if (state.tcOrTaxIdentityNo.toString().length == 10) {
      return true;
    }

    if (state.birthDate.length == 10 && Number(state.birthDate.toString().substring(0, 4)) > 1900) {
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
        <div style={{ marginTop: "100px", marginBottom: "150px" }} className="container">
          <div className="row">
            <div className=" col-xs-12 col-sm-12 col-md-6 col-lg-6 insuranceIndexPageInformation">
              <h3>Trafik Sigortası Fiyatlarını Sorgulayın,</h3>
              <h3>Bütçenize Uygun Seçeneği Kolayca Bulun!</h3>
              <div className="insuranceIndexPageInformationDetails">
                <li>En iyi sigorta şirketlerinin tekliflerini karşılaştırın</li>
                <li>İnternete özel ek indirimlerle online trafik sigortanızı satın alın</li>
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
                              checked={state.isVehicleLicenseWithMe}
                              onChange={() => setState({ ...state, isVehicleLicenseWithMe: true })}
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
                              checked={!state.isVehicleLicenseWithMe}
                              onChange={() => setState({ ...state, isVehicleLicenseWithMe: false })}
                            />
                            <label htmlFor="plakaYok">Plakam Yok</label>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        {/**TC kimlik Numarası */}
                        <div className="col-12">
                          <div className="form-group">
                            <label className="font-weight-bold">T.C. veya Vergi Kimlik No</label>
                            <input
                              type="number"
                              placeholder="T.C. veya Vergi Kimlik No"
                              maxLength="11"
                              className={`form-control ${errors.tcOrTaxIdentityNo && "invalid"}`}
                              {...register("tcOrTaxIdentityNo", {
                                required: "T.C. veya Vergi Kimlik Numarası zorunlu",
                                validate: isValidTcKimlikOrVergiKimlik,
                              })}
                              value={state.tcOrTaxIdentityNo}
                              onChange={(e) => {
                                setState({ ...state, tcOrTaxIdentityNo: e.target.value });
                                clearErrors("tcOrTaxIdentityNo");
                              }}
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
                        </div>

                        {/**Araç Plaka */}
                        {(() => {
                          if (state.isVehicleLicenseWithMe) {
                            return (
                              <div className="col-12">
                                <div className="form-group">
                                  <label className="font-weight-bold">Araç Plaka NO</label>
                                  <div
                                    className="input-form-with-prefix w-100"
                                    style={{ display: "flex" }}
                                  >
                                    <div className="bg-main text-white input-form-prefix">TR</div>
                                    <div className="input-with-prefix">
                                      <input
                                        name="carPlateNo"
                                        id="carPlateNo"
                                        type="text"
                                        //onkeyup={(this.value = this.value.toUpperCase())}
                                        className={`form-control uppercase plate w-100 ${
                                          errors.carPlateNo && "invalid"
                                        }`}
                                        {...register("carPlateNo", {
                                          required: "Araç Plaka numarası zorunlu",
                                          pattern: {
                                            value:
                                              /^(0[1-9]|[1-7][0-9]|8[01])((\s?[a-zA-Z]\s?)(\d{4,5})|(\s?[a-zA-Z]{2}\s?)(\d{3,4})|(\s?[a-zA-Z]{3}\s?)(\d{2,3}))$/,
                                            message: "Geçersiz plaka numarası",
                                          },
                                        })}
                                        placeholder="34 SGR 777"
                                        onChange={() => {
                                          clearErrors("carPlateNo");
                                        }}
                                      />
                                    </div>
                                  </div>

                                  <small className="text-danger">
                                    {errors["carPlateNo"]?.message}
                                  </small>
                                </div>
                              </div>
                            );
                          }
                        })()}

                        <div className="col-lg-12">
                          <div className="form-group mt-2">
                            <label className="font-weight-bold">Doğum Tarihi</label>
                            <input
                              name="birthDate"
                              id="birthDate"
                              type="date"
                              className={`form-control ${errors.birthDate && "invalid"}`}
                              {...register("birthDate", {
                                validate: birthDateRequirementControl,
                              })}
                              placeholder="gg.aa.yyyy"
                              max="2003-01-01"
                              value={state.birthDate}
                              onChange={(e) => {
                                setState({ ...state, birthDate: e.target.value });
                                clearErrors("birthDate");
                              }}
                            />
                            <small className="text-danger">
                              {errors["birthDate"]?.message}
                              {/**Validate Message */}
                              {errors.birthDate && errors.birthDate.type == "validate"
                                ? "Doğum Tarihi Alanı Zorunlu"
                                : ""}
                            </small>
                          </div>
                        </div>
                      </div>

                      <input
                        type="submit"
                        style={{ padding: "12px 26px" }}
                        className="btn-custom w-100 mt-3"
                        value="TRAFİK SİGORTASI TEKLİFİ AL"
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
                <b>TRAFİK SİGORTASI HAKKINDA SIK SORULAN SORULAR</b>{" "}
              </h3>
              <TrafficFAQ></TrafficFAQ>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CascoIndex;
