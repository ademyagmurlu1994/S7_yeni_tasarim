import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

//components
import Stepper from "/components/common/Stepper";

import {
  isValidTcKimlik,
  getTodayDate,
  writeResponseError,
  addDaysToDate,
} from "/functions/common";

const PaymentSteps = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [state, setState] = useState({
    userInformations: [
      { label: "Ad Soyad", value: "ER*** GE***" },
      { label: "GSM No", value: "0555 555 55 55" },
      { label: "E-posta", value: "eryt@hotmail.com" },
      { label: "Posta Adresi", value: "KM*** Mah Ga CAD No ** ZE*** İS***" },
      { label: "Araç Bilgisi", value: "Fiat 500 C" },
      { label: "Şasi No", value: "ABCTSNF6659" },
      { label: "Motor No", value: "KKLSP321544" },
      { label: "Ruhsat Seri No", value: " AB 002211" },
    ],
    policyStartDate: getTodayDate(),
    isConfirmInformations: false,
    inquiryInformations: null,
  });
  const [inquiryInformations, setInquiryInformations] = useState();
  const [quotePolicy, setQuotePolicy] = useState();

  const router = useRouter();
  const { companyCode, quoteReference, revisionNumberi, brutPrim, service } = router.query;

  const [params, setParams] = useState();
  useEffect(() => {
    setParams(router.asPath.split("?")[1]);

    if (JSON.parse(localStorage.getItem("inquiryInformations"))) {
      const inquiryInformationData = JSON.parse(localStorage.getItem("inquiryInformations"));
      setInquiryInformations(inquiryInformationData);
    }
  }, []);

  useEffect(() => {
    if (inquiryInformations) {
      let quotePolicy = JSON.parse(localStorage.getItem("quotePolicy"));
      if (quotePolicy) {
        setQuotePolicy(quotePolicy);
      }
    }
  }, [inquiryInformations]);

  useEffect(() => {
    //userInformation'ı güncelliyoruz.
    if (inquiryInformations) {
      console.log(inquiryInformations);
      state.userInformations[1].value = "0" + inquiryInformations.insured.contact.mobilePhone;
      state.userInformations[2].value = inquiryInformations.insured.contact.email;
      state.userInformations[7].value =
        inquiryInformations.car.registrationSerialCode +
        " " +
        inquiryInformations.car.registrationSerialNo;
      //console.log(state.inquiryInformations.insured.contact);
      // userInformations[]
    }
  }, [inquiryInformations]);

  const validateFormData = (data) => {
    console.log("Veri", data);
    if (state.isConfirmInformations) {
      window.location.href = "/payment?" + params;
    }

    if (service == "health") {
      window.location.href = "/payment?" + params;
    }
  };

  return (
    <section>
      <div className="container" style={{ marginTop: "100px" }}>
        {/*Stepper Start*/}
        <Stepper
          steps={["Teminat Detayları", "Bilgi Doğrulama", "Ödeme Ekranı"]}
          activeStep={2}
          style={{ marginTop: "100px" }}
        />

        <div className="row offer-details custom-content-body  mb-5">
          <div className="col-12">
            <h3 className="mt-3 font-weight-bold text-center"> BİLGİ DOĞRULAMA</h3>
          </div>

          {/**Specifications */}
          {quotePolicy && (
            <div className="col-12 mt-4">
              <form onSubmit={handleSubmit(validateFormData)}>
                <div className="row offer-detail-specifications justify-content-center">
                  <div className="col-12 col-lg-8 col-md-8">
                    {(quotePolicy.service == "casco" || quotePolicy.service == "traffic") && (
                      <>
                        <table className="table table-borderless">
                          <tbody>
                            {state.userInformations.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td>{item.label}</td>
                                  <td>: {item.value}</td>
                                </tr>
                              );
                            })}

                            <tr className="policy-start-date">
                              <td>Poliçe Başlangıç Tarihi</td>
                              <td>
                                <input
                                  type="date"
                                  className="form-control"
                                  placeholder="gg.aa.yyyy"
                                  min={getTodayDate()}
                                  max={addDaysToDate(4, getTodayDate())}
                                  value={state.policyStartDate}
                                  onChange={(e) =>
                                    setState({
                                      ...state,
                                      policyStartDate: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/** */}
                        <div className="alert alert-warning" role="alert">
                          Yukarıda verdiğim bilgilerin doğru olduğunu, aracımda herhangi bir hasar
                          olmadığını, aracımın ticari taksi, kiralık araç (rent a car), sürücü kursu
                          aracı, hatlı minibüs ya da dolmuş olarak kullanılmadığını beyan ve taahhüt
                          ederim. Bilgilerimin doğruluğunu kabul ediyorum
                        </div>
                        {/** */}
                        <div className="confirm-informations">
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck1"
                              //className={`${errors.ConfirmInformations && "invalid"}`}
                              {...register("ConfirmInformations", {
                                required: "Lütfen Bilgileri Onaylayın",
                              })}
                              value={state.isConfirmInformations}
                              onChange={(e) =>
                                setState({ ...state, isConfirmInformations: e.target.value })
                              }
                            />
                            <label
                              className={`custom-control-label ${
                                errors.ConfirmInformations && "text-danger"
                              }`}
                              htmlFor="customCheck1"
                            >
                              Onaylıyorum
                            </label>
                            <br />
                            <small className="text-danger" style={{ marginLeft: "-20px" }}>
                              {errors["ConfirmInformations"]?.message}
                            </small>
                          </div>
                        </div>
                        {/** */}
                        <div className="alert alert-info mt-5" role="alert">
                          Devam ederek yukarıda gördüğünüz ve süreçte sağladığınız bilgilerin doğru
                          olduğunu taahhüt etmektesiniz. Gerçeğe aykırı ve eksik beyan, sigorta
                          şirketi tarafından sigorta poliçesinin iptaline ve/veya hasarın reddine
                          sebep olabilir.
                        </div>
                      </>
                    )}

                    {/** */}
                    <div className="buy-now mb-5" style={{ marginTop: "50px", textAlign: "end" }}>
                      <input type="submit" value="HEMEN SATIN AL" className="btn-custom p-2 " />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PaymentSteps;
