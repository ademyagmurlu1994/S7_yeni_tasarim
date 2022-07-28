import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/router";

//components
import InsuranceIndexPageInformation from "/components/common/InsuranceIndexPageInformation";
import WhatIsTheXInsurance from "/components/common/WhatIsTheXInsurance";
import DaskFAQ from "/components/faq/DaskFAQ";

//images
import {
  DaskInsuranceInformationPhoto,
  WhatIsTheDaskInsurance,
  AnadoluLogo,
  AllianzLogo,
  SompoLogo,
  HdiLogo,
} from "/resources/images";

//fonksiyonlar
import { isValidTcKimlik, getTodayDate, writeResponseError } from "/functions/common";

const Dask = () => {
  const [state, setState] = useState({
    isExistPolicy: false,
    identityNo: null,
    daskPolicyNo: null,
    birthDate: null,
  });

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const getDaskOffers = (data) => {
    console.log(data);
    //store'daki değeri değiştiriyoruz.
    localStorage.setItem(
      "daskIndex",
      JSON.stringify({
        isExistPolicy: state.isExistPolicy,
        identityNo: state.identityNo,
        daskPolicyNo: state.daskPolicyNo,
        birthDate: state.birthDate,
      })
    );
    router.push("/insurance/dask/inquiry");
  };

  return (
    <>
      <section className="section">
        <div style={{}}>
          <div className="container">
            <div className="row mb-5 ">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 d-none d-md-block">
                <InsuranceIndexPageInformation
                  title="Zorunlu Deprem Sigortası Fiyatları İçin Teklif Al!"
                  photo={DaskInsuranceInformationPhoto}
                  detailParagraphs={[
                    "İnternetten bilgilerinizi girerek sadece 2 dakikada DASK teklifi alın",
                    "Evinizin zorunlu deprem sigortasını hemen satın alıp güvencenizi başlatın!",
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
                        <form autoComplete="off" onSubmit={handleSubmit(getDaskOffers)}>
                          <div className="d-flex mb-3">
                            <div className="w-50">
                              <div className="custom-radio-button">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="flexRadioDefault"
                                  id="flexRadioDefault1"
                                  checked={!state.isExistPolicy}
                                  value={false}
                                  onChange={(e) =>
                                    setState({
                                      ...state,
                                      isExistPolicy: false,
                                    })
                                  }
                                />
                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                  Yeni poliçe
                                </label>
                              </div>
                            </div>
                            <div className="w-50">
                              <div className="custom-radio-button">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="flexRadioDefault"
                                  id="flexRadioDefault2"
                                  checked={state.isExistPolicy}
                                  value={true}
                                  onChange={(e) =>
                                    setState({
                                      ...state,
                                      isExistPolicy: true,
                                    })
                                  }
                                />

                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                  Poliçeyi yenile
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Tc Kimlik No */}
                          <div className="is-exist-policy">
                            {/*Değerlerin değimemesi için*/}
                            <input
                              className="form-check-input"
                              type="text"
                              style={{ display: "none" }}
                            />
                            <div className="tc-kimlik-no mt-4">
                              <label htmlFor="tcKimlikNo">T.C. Kimlik Numarası</label>
                              <input
                                type="number"
                                id="tcKimlikNo"
                                maxLength={11}
                                placeholder="T.C. Kimlik Numarası"
                                aria-label="readonly input example"
                                className={`form-control ${errors.tc_kimlik_numarasi && "invalid"}`}
                                {...register("tc_kimlik_numarasi", {
                                  required: "T.C. Kimlik Numarası zorunlu",
                                  validate: isValidTcKimlik,
                                })}
                                value={state.identityNo}
                                onChange={(e) => {
                                  setState({ ...state, identityNo: e.target.value });
                                  clearErrors("tc_kimlik_numarasi");
                                }}
                              />
                              <small className="text-danger">
                                {errors["tc_kimlik_numarasi"]?.message}
                                {/**Validate Message */}
                                {errors.tc_kimlik_numarasi &&
                                  errors.tc_kimlik_numarasi.type == "validate" &&
                                  "Geçersiz T.C. Kimlik Numarası"}
                              </small>
                            </div>
                            <div className="">
                              <div className="form-group mt-2">
                                <label className="">Doğum Tarihi</label>
                                <input
                                  name="dogumTarihi"
                                  id="dogumTarihi"
                                  type="date"
                                  className={`form-control ${errors.dogumTarihi && "invalid"}`}
                                  {...register("dogumTarihi", {
                                    required: "Doğum Tarihi alanı zorunlu",
                                  })}
                                  placeholder="gg.aa.yyyy"
                                  max={getTodayDate()}
                                  value={state.birthDate}
                                  onChange={(e) => {
                                    {
                                      setState({ ...state, birthDate: e.target.value });
                                      clearErrors("dogumTarihi");
                                    }
                                  }}
                                />

                                <small className="text-danger">
                                  {errors["dogumTarihi"]?.message}
                                </small>
                              </div>
                            </div>
                          </div>
                          {state.isExistPolicy && (
                            <div className="is-not-exist-policy">
                              <div className=" mt-4">
                                <label htmlFor="daskPolicyNo">DASK Poliçe No</label>
                                <input
                                  type="number"
                                  id="daskPolicyNo"
                                  maxLength={8}
                                  placeholder="DASK Poliçe No"
                                  className={`form-control ${errors.dask_police_no && "invalid"}`}
                                  {...register("dask_police_no", {
                                    required: "Dask Poliçe alanı zorunlu",
                                    validate: (value) => value.toString().trim().length == 8,
                                  })}
                                  value={state.daskPolicyNo}
                                  onChange={(e) => {
                                    setState({ ...state, daskPolicyNo: e.target.value });
                                    clearErrors("dask_police_no");
                                  }}
                                />
                                <small className="text-danger">
                                  {errors["dask_police_no"]?.message}
                                  {/**Validate Message */}
                                  {errors.dask_police_no &&
                                    errors.dask_police_no.type == "validate" &&
                                    "Geçersiz Dask Poliçe Numarası"}
                                </small>
                              </div>
                              <div className="information-for-refresh-policy mt-3">
                                DASK poliçe numaranızı öğrenmek için{" "}
                                <a href="https://www.dask.gov.tr/e-services/portal/searchPolicy">
                                  tıklayınız
                                </a>{" "}
                                veya <b>125</b> Alo DASK'ı arayarak öğrenebilirsiniz.
                              </div>
                            </div>
                          )}
                          <div className="information-for-new-policy mt-3">
                            TCKN size özel teklif üretebilmemiz için gerekmektedir.
                          </div>
                          <input
                            type="submit"
                            className="btn-custom btn-timeline-forward w-100 mt-3"
                            value="DASK TEKLİFİ AL"
                          />
                        </form>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*Zorunlu Deprem Sigortası Nedir?*/}
          <div className="row">
            <div className="col-12">
              <WhatIsTheXInsurance
                photo={WhatIsTheDaskInsurance}
                title="DASK NEDİR? NE İŞE YARAR?"
                topTitle="DEPREME KARŞI ÖNLEMİNİZİ ALIN"
                descriptionParagraphs={[
                  "DASK (Doğal Afetler Sigortalar Kurumu) Zorunlu Deprem Sigortası; depremin ve deprem sonucu meydana gelen yangın, patlama, tsunami ile yer kaymasının doğrudan neden olacağı maddi zararları, sigorta poliçesinde belirtilen limitler kapsamında karşılayan bir sigorta türüdür.",
                  "Zorunlu Deprem Sigortası yaptırdığınız zaman binanız tamamen ya da kısmen zarar gördüğünde teminat altına alınır. DASK yaptırmadığınız durumlarda ise bu yardımdan yararlanamazsınız.",
                  ,
                ]}
              />
            </div>
          </div>

          {/*Anlaşmalı şirketler*/}
          <div className="container">
            <h4 className="text-center">
              <b>ANLAŞMALI DASK ŞİRKETLERİ</b>
            </h4>
            <div
              className="row contracted-dask-companies"
              style={{ display: "flex", justifyContent: "space-evenly" }}
            >
              <div
                className="col text-center  contracted-dask-company py-3"
                style={{ boxShadow: "rgb(0 0 0 / 16%) 0px 1px 4px" }}
              >
                <img src={AnadoluLogo} alt="" style={{ width: "auto", maxHeight: "55px" }} />
              </div>
              <div
                className="col  text-center contracted-dask-company py-3"
                style={{ boxShadow: "rgb(0 0 0 / 16%) 0px 1px 4px" }}
              >
                <img src={SompoLogo} alt="" style={{ width: "auto", maxHeight: "55px" }} />
              </div>
              <div
                className="col  text-center contracted-dask-company py-3"
                style={{ boxShadow: "rgb(0 0 0 / 16%) 0px 1px 4px" }}
              >
                <img src={HdiLogo} alt="" style={{ width: "auto", maxHeight: "55px" }} />
              </div>
            </div>
          </div>

          {/*Sıkça Sorulan sorular */}
          <div className="container mt-5">
            <DaskFAQ topic="DASK SİGORTASI" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Dask;
