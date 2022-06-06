//import "./OwnerInformation.css";

import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";

//Componentler
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import PhoneStepper from "/components/phone/PhoneStepper";
import NotificationConfirmation from "/components/pop-up/NotificationConfirmation";
import SingleCodeVerification from "/components/pop-up/SingleCodeVerification";

//fonksiyonlar
import {
  isValidTcKimlik,
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
} from "/functions/common";

//Styles
import { inputStyle } from "/styles/custom";

function OwnerInformation() {
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
    isCheckedNotification: false,
  });

  //Notification and Verification Variables
  const [isShowNotifyConfirmPopup, setIsShowNotifyConfirmPopup] = useState(false);
  const [notificationConfirmation, setNotificationConfirmation] = useState(undefined);
  const [isVerifySmsSingleCode, setIsVerifySmsSingleCode] = useState(undefined);
  const [isShowVerifySingleCodePopup, setIsShowVerifySingleCodePopup] = useState(false);

  //notificationConfirmation datası değiştiğinde verify Single code pop-up tetikliyor.
  useEffect(() => {
    if (notificationConfirmation != undefined) {
      setIsShowVerifySingleCodePopup(true);
    }
  }, [notificationConfirmation]);

  useEffect(() => {
    //Telefon kod doğrulama başarılı ise diğer adıma geçiş yapıyoruz.
    if (isVerifySmsSingleCode) {
      setIsShowVerifySingleCodePopup(false);
      router.push("/insurance/phone/select-insurance-package");
    }
  }, [isVerifySmsSingleCode]);

  const validateFormData = (data) => {
    //Bildirim check box'ı işaretli değilse pop-up gösteriliyor
    if (state.isCheckedNotification == false && notificationConfirmation == undefined) {
      setIsShowNotifyConfirmPopup(true);
    } else {
      setIsShowNotifyConfirmPopup(false);
      /**isShow tetiklenmesi için önce false sonra true yapıyoruz. (Watch işlemi) */
      setIsShowVerifySingleCodePopup(false);
      setIsShowVerifySingleCodePopup(true);
    }
  };

  const notificationConfirmationCallback = useCallback((isConfirmNotify) => {
    setNotificationConfirmation(isConfirmNotify);
  }, []);

  const singleCodeVerificationCallback = useCallback((isVerify) => {
    setIsVerifySmsSingleCode(isVerify);
  });

  return (
    <>
      {/* Pop-up Notificiation Modal*/}
      {isShowNotifyConfirmPopup && (
        <NotificationConfirmation
          isShow={isShowNotifyConfirmPopup}
          notificationCallback={notificationConfirmationCallback}
        />
      )}

      {/* Pop-up verification Single Code  */}
      {isShowVerifySingleCodePopup == true && (
        <SingleCodeVerification
          singleCodeVerificationCallback={singleCodeVerificationCallback}
          phoneNumber={state.phoneNumber}
          isShow={isShowVerifySingleCodePopup}
        />
      )}

      <section className="section">
        <div style={{ marginTop: "20px", marginBottom: "150px" }} className="container">
          <div className="row justify-content-center">
            <div className=" col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
              <h4>Telefonunuzu Sigorta ile güvenceye alın.</h4>
            </div>

            {/* Stepper */}
            <div className="col-12 col-lg-11 mt-2">
              <PhoneStepper activeStep={2}></PhoneStepper>
            </div>
            {/* Content */}
            <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8 mt-2">
              <div className="row">
                <div className="col-lg-12">
                  <div className="">
                    <form onSubmit={handleSubmit(validateFormData)}>
                      {/* Sahip Bilgi Girişi  */}
                      <div className="row mt-2 justify-content-center">
                        <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                          <div className="row ">
                            <div className="col-12  mt-4">
                              <TextField
                                {...register("tc_kimlik_numarasi", {
                                  required: "T.C. Kimlik Numarası zorunlu",
                                  validate: isValidTcKimlik,
                                })}
                                value={state.identityNo}
                                onChange={(e) => {
                                  setState({ ...state, identityNo: e.target.value });
                                  clearErrors("tc_kimlik_numarasi");
                                }}
                                type="number"
                                sx={inputStyle}
                                size="small"
                                error={Boolean(errors["tc_kimlik_numarasi"])}
                                label="T.C. Kimlik Numarası"
                                maxLength={11}
                              />
                              <small className="text-danger">
                                {errors["tc_kimlik_numarasi"]?.message}
                                {/**Validate Message */}
                                {errors.tc_kimlik_numarasi &&
                                  errors.tc_kimlik_numarasi.type == "validate" &&
                                  "Geçersiz T.C. Kimlik Numarası"}
                              </small>
                            </div>

                            <div className="col-12  mt-4">
                              <TextField
                                {...register("dogumTarihi", {
                                  required: "Doğum Tarihi alanı zorunlu",
                                })}
                                placeholder="sdfsdf"
                                InputLabelProps={{ shrink: true, required: true }}
                                defaultValue={getTodayDate()}
                                max={getTodayDate()}
                                value={state.birthDate}
                                onChange={(e) => {
                                  {
                                    setState({ ...state, birthDate: e.target.value });
                                    clearErrors("dogumTarihi");
                                  }
                                }}
                                type="date"
                                sx={inputStyle}
                                size="small"
                                error={Boolean(errors["dogumTarihi"])}
                                label="Doğum Tarihi"
                              />

                              <small className="text-danger">
                                {errors["dogumTarihi"]?.message}
                              </small>
                            </div>

                            <div className="col-12 mt-4">
                              <div className="phone-number">
                                <div
                                  className="input-form-with-prefix w-100"
                                  style={{ display: "flex" }}
                                >
                                  <div className="bg-main text-white input-form-prefix px-2">
                                    +90
                                  </div>
                                  <div className="input-with-prefix">
                                    <TextField
                                      {...register("cepTelefonNo", {
                                        required: "Cep telefonu numarası zorunlu",
                                        pattern: {
                                          value:
                                            /^(([\+]90?)|([0]?))([ ]?)((\([0-9]{3}\))|([0-9]{3}))([ ]?)([0-9]{3})(\s*[\-]?)([0-9]{2})(\s*[\-]?)([0-9]{2})$/,
                                          message: "Geçersiz cep telefon numarası",
                                        },
                                      })}
                                      type="tel"
                                      defaultValue={getTodayDate()}
                                      max={getTodayDate()}
                                      value={state.phoneNumber}
                                      onChange={(e) => {
                                        setState({
                                          ...state,
                                          phoneNumber: e.target.value,
                                        });
                                        clearErrors("cepTelefonNo");
                                      }}
                                      placeholder="(5xx) xxx xx xx"
                                      sx={inputStyle}
                                      size="small"
                                      error={Boolean(errors["cepTelefonNo"])}
                                      label="Cep Telefon Numarası"
                                    />
                                  </div>
                                </div>
                                <small className="text-danger">
                                  {errors["cepTelefonNo"]?.message}
                                </small>
                              </div>
                            </div>
                            <div className="col-12 mt-4">
                              <div
                                className="w-100 m-0 p-0"
                                style={{ display: "flex", alignItems: "flex-start" }}
                              >
                                <Checkbox
                                  id="kvkk"
                                  sx={{
                                    padding: "0px 8px 0px 0px",
                                    "&.Mui-checked": {
                                      color: "var(--main-color)",
                                    },
                                  }}
                                />
                                <label htmlFor="kvkk">
                                  <a href="#">KVKK Aydınlatma metnini </a> okudum
                                </label>
                              </div>
                            </div>
                            <div
                              className="col-12 mt-4"
                              style={{ display: "flex", alignItems: "flex-start" }}
                            >
                              <Checkbox
                                id="bildirim"
                                sx={{
                                  padding: "0px 8px 0px 0px",
                                  "&.Mui-checked": {
                                    color: "var(--main-color)",
                                  },
                                }}
                                checked={state.isCheckedNotification}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    isCheckedNotification: e.target.checked,
                                  })
                                }
                              />
                              <label htmlFor="bildirim">
                                Kampanya ve avantajlar ile ilgili e mail ve SMS gönderimini kabul
                                ediyorum
                              </label>
                            </div>
                            <hr />
                            <div className="col-12 mt-4">
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

export default OwnerInformation;
