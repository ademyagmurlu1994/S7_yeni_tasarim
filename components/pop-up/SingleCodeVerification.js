import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "/instances/axios";

//fonksiyonlar
import { writeResponseError, getNewToken, getClientIpAdress } from "/functions/common";

const SingleCodeVerification = ({
  singleCodeVerificationCallback,
  phoneNumber,
  isShow,
  isShowUpdateButton = true,
}) => {
  useEffect(() => {
    if (isShow) {
      $("#notificationModal").modal("show");
    } else {
      $("#notificationModal").modal("hide");
    }
  }, [isShow]);

  const verificationTime = {
    minute: 2,
    second: 59,
  };

  const [timer, setTimer] = useState({
    minute: verificationTime.minute,
    second: verificationTime.second,
  });

  const [verifySmsState, setVerifySmsState] = useState({
    token: "",
    validationCode: undefined,
    inputValidationCode: "",
    isVerifiedValidationCode: undefined,
    isActiveUpdatePhoneNumber: false,
    clientIpAddress: "",
    messageId: "",
    isShowPopup: false,
    ipAddress: "",
  });

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    resetField,
    formState: { errors },
  } = useForm();

  useEffect(async () => {
    if (verifySmsState.token == "") {
      setVerifySmsState({ ...verifySmsState, token: await getNewToken() });
    }
  }, []);

  useEffect(async () => {
    if (verifySmsState.token) {
      try {
        await getClientIpAdress().then((res) => {
          setVerifySmsState({
            ...verifySmsState,
            ipAddress: res.toString().trim(),
          });
        });
      } catch (error) {
        console.log("errorasdfasdf");
      }
    }
  }, [verifySmsState.token]);

  useEffect(async () => {
    if (verifySmsState.ipAddress) {
      console.log("İp: ", verifySmsState.ipAddress);
      await sendSms();
    }
  }, [verifySmsState.ipAddress]);

  useEffect(() => {
    $("#verificationSingleCode").modal("show");
  }, []);

  useEffect(() => {
    if (timer.minute == 0 && timer.second == 0) {
      //Zaman doldu ise activasyon kodunu sıfırlıyoruz.
      setTimeout(() => {
        setVerifySmsState({ ...verifySmsState, validationCode: undefined });
      }, 10);
    }
  }, [timer.second]);

  useEffect(() => {
    if (!(timer.minute == 0 && timer.second == 0)) {
      setTimeout(() => {
        //Numara Güncelle aktif ise timer'ı sıfırlıyoruz.
        if (verifySmsState.isActiveUpdatePhoneNumber) {
          setTimer({ ...timer, minute: verificationTime.minute, second: verificationTime.second });
          setVerifySmsState({ ...verifySmsState, isActiveUpdatePhoneNumber: false });
        } else if (timer.second == 0) {
          setTimer({ ...timer, minute: timer.minute - 1, second: 59 });
        } else {
          setTimer({ ...timer, second: timer.second - 1 });
        }
      }, 1000);
    }
  });

  //http requestler
  const sendSms = async () => {
    setTimer({ ...timer, minute: verificationTime.minute, second: verificationTime.second });
    try {
      let bodyData = {
        mobileNo: phoneNumber
          .toString()
          .replaceAll(" ", "")
          .replaceAll("(", "")
          .replaceAll(")", ""),
        ipAddress: verifySmsState.ipAddress ? verifySmsState.ipAddress : "",
      };

      await axios
        .post("/api/quote/v1/Casco/sendsms", bodyData, {
          headers: {
            Authorization: verifySmsState.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            console.log("Sms Gönderildi");
            console.log("SendSMS response: ", res.data);
            setVerifySmsState({
              ...verifySmsState,
              validationCode: res.data.data.validationCode,
              messageId: res.data.data.messageId,
            });
          }
        });
    } catch (error) {
      //alert("sms gönderilemedi" + error);
      writeResponseError(error);
    }
  };

  const onUpdatePhoneNumber = () => {
    $("#verificationSingleCode").modal("hide");
    //setTimeout içerisindeki timer'ı sıfırlamak için kullanıldı
    setVerifySmsState({ ...verifySmsState, isActiveUpdatePhoneNumber: true });
  };

  const onVerifySingleUseCode = async () => {
    try {
      let bodyData = {
        mobileNo: phoneNumber
          .toString()
          .replaceAll(" ", "")
          .replaceAll("(", "")
          .replaceAll(")", ""),
        code: verifySmsState.inputValidationCode.toString(),
        messageId: verifySmsState.messageId.toString(),
        ipAddress: verifySmsState.ipAddress ? verifySmsState.ipAddress : "",
      };

      await axios
        .post("/api/quote/v1/Casco/getsmsbymobileno", bodyData, {
          headers: {
            Authorization: verifySmsState.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log("getsmsbymobileno response: ", res.data);

          let isVerified = false;
          if (res.data.data.isSuccessful) {
            setVerifySmsState({ ...verifySmsState, isVerifiedValidationCode: true });
            isVerified = true;
            $("#verificationSingleCode").modal("hide");
          } else {
            setVerifySmsState({ ...verifySmsState, isVerifiedValidationCode: false });
            isVerified = false;
          }

          //Parent Component'e kodun doğrulanıp doğrulanmadığına dair bilgi gönderiyoruz.
          singleCodeVerificationCallback(isVerified);
        });
    } catch (error) {
      writeResponseError(error);
    }

    // let isVerified = false;
    // if (verifySmsState.inputValidationCode.toString() == "1234") {
    //   isVerified = true;
    //   $("#verificationSingleCode").modal("hide");
    // } else {
    //   setVerifySmsState({ ...verifySmsState, isVerifiedValidationCode: false });
    //   isVerified = false;
    // }
    // //Parent Component'e kodun doğrulanıp doğrulanmadığına dair bilgi gönderiyoruz.
    // singleCodeVerificationCallback(isVerified);
  };

  return (
    <>
      {/* Pop-up verification Single Code  */}
      <div
        className="modal fade"
        id="verificationSingleCode"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-keyboard="false"
        data-backdrop="static"
      >
        <div className="modal-dialog">
          <div
            className="modal-content animate__animated animate__fadeInDown"
            style={{ borderRadius: "20px", boxShadow: "rgba(255, 255, 255, 0.5) 0px 8px 24px" }}
          >
            <div className="modal-body">
              <form onSubmit={handleSubmit(onVerifySingleUseCode)}>
                <div className="verify-single-use-code">
                  <div className="row warning-before-process">
                    <div className="col-12 ">
                      <div
                        className="alert alert-warning mt-3"
                        role="alert"
                        style={{
                          padding: "1px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <i className="fas fa-exclamation-circle fa-lg mr-2 ml-2"></i>
                        +90 {phoneNumber} telefonunuza gönderilen doğrulama kodunu giriniz.
                      </div>
                    </div>
                  </div>

                  <div className="row single-use-code-input">
                    <div className="col-12 ">
                      <label htmlFor="singleUseCode">Tek Kullanımlık Kod</label>
                      <input
                        type="number"
                        maxLength="4"
                        className={`form-control ${errors.singleVerifyCode && "invalid"}`}
                        {...register("singleVerifyCode", {
                          min: {
                            value: 0,
                            message: "Kod 4 hane olması gerekmektedir",
                          },
                          max: {
                            value: 9999,
                            message: "Kod 4 hane olması gerekmektedir",
                          },
                        })}
                        value={verifySmsState.inputValidationCode}
                        onChange={(e) =>
                          setVerifySmsState({
                            ...verifySmsState,
                            inputValidationCode: e.target.value,
                          })
                        }
                      />
                      <small className="text-danger">{errors["singleVerifyCode"]?.message}</small>
                    </div>
                  </div>
                  {/* Girilen doğrulama kodu yanlış ise*/}
                  {verifySmsState.isVerifiedValidationCode == false && (
                    <div className="row wrong-code-alert">
                      <div className="col-12 ">
                        <div
                          className="alert alert-danger mt-3"
                          role="alert"
                          style={{
                            padding: "1px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <i className="fas fa-times-circle fa-lg mr-2"></i>
                          Girilen Kod Hatalıdır. Yeniden giriş yapınız.
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="row verify-single-use-code-button">
                    <div className="col-12 ">
                      <button
                        className="btn-custom btn-timeline-forward  w-100 mt-3"
                        onClick={() => onVerifySingleUseCode()}
                      >
                        Doğrula
                      </button>
                    </div>
                  </div>
                  <div className="row mt-1 ">
                    <div className="col-12  text-center text-danger">
                      0{timer.minute}: {timer.second < 10 && 0}
                      {timer.second}
                    </div>
                  </div>

                  {isShowUpdateButton == true && (
                    <div className="row update-phone-number">
                      <div className="col-12 ">
                        <div
                          className="btn-custom-outline btn-timeline-forward w-100 mt-3"
                          onClick={() => {
                            onUpdatePhoneNumber();
                          }}
                        >
                          Numarayı Güncelle
                        </div>
                      </div>
                    </div>
                  )}

                  {timer.minute == 0 && timer.second == 0 && (
                    <div className="row send-new-code">
                      <div className="col-12 ">
                        <div
                          className="btn-custom-outline btn-timeline-forward w-100 mt-3"
                          onClick={() => sendSms()}
                        >
                          Yeni Kod Gönder
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleCodeVerification;
