import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "/instances/axios";

//fonksiyonlar
import { writeResponseError, getNewToken } from "/functions/common";

const Counter = ({ parentCallback, phoneNumber }) => {
  const [count, setCount] = useState(0);

  const [timer, setTimer] = useState(59);
  const [state, setState] = useState({
    token: "",
    validationCode: "1234",
    inputValidationCode: "",
    isVerifiedValidationCode: true,
    isActiveUpdatePhoneNumber: false,
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
    if (state.token == "") {
      setState({ ...state, token: await getNewToken() });
    }
  }, []);

  useEffect(() => {
    console.log("deneme", state.token);
    if (state.token > "") {
      //sendSms();
    }
  }, [state.token]);

  useEffect(async () => {
    if (timer != 0) {
      setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    }
  });

  //http requestler
  const sendSms = async () => {
    try {
      let bodyData = {
        mobileNo: phoneNumber.toString(),
        ipAddress: "",
      };
      await axios
        .post("/api/quote/v1/Casco/sendsms", bodyData, {
          headers: {
            Authorization: state.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            setState({ ...state, validationCode: res.data.data.validationCode });
          }
        });
    } catch (error) {
      //
      writeResponseError(error);
    }
  };

  const onVerifySingleUseCode = () => {
    let isVerified = false;
    if (state.validationCode == state.inputValidationCode) {
      setState({ ...state, isVerifiedValidationCode: true });
      isVerified = true;
    } else {
      setState({ ...state, isVerifiedValidationCode: false });
      isVerified = false;
    }

    //Parent Component'e kodun doğrulanıp doğrulanmadığına dair bilgi gönderiyoruz.
    parentCallback(isVerified);
  };

  return (
    <>
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
                <i className="fas fa-exclamation-circle fa-lg mr-2"></i>
                {phoneNumber} telefonunuza gönderilen doğrulama kodunu giriniz.
              </div>
            </div>
          </div>

          {state.isActiveUpdatePhoneNumber && (
            <div className="row">
              <div className="col-12">
                <div className="phone-number">
                  Cep Telefonu
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`form-control ${errors.cepTelefonNo && "invalid"}`}
                    {...register("cepTelefonNo", {
                      required: "Cep telefonu numarası zorunlu",
                      pattern: {
                        value:
                          /^(([\+]90?)|([0]?))([ ]?)((\([0-9]{3}\))|([0-9]{3}))([ ]?)([0-9]{3})(\s*[\-]?)([0-9]{2})(\s*[\-]?)([0-9]{2})$/,
                        message: "Geçersiz cep telefon numarası",
                      },
                    })}
                    //value={state.phoneNumber}
                    /*onChange={(e) =>
                      setState({
                        ...state,
                        phoneNumber: e.target.value,
                      })
                    }*/
                    placeholder="(5xx) xxx xx xx"
                  />
                  <small className="text-danger">{errors["cepTelefonNo"]?.message}</small>
                </div>
              </div>
            </div>
          )}

          <div className="row single-use-code-input">
            <div className="col-12 ">
              <label htmlFor="singleUseCode">Tek Kullanımlık Kod</label>
              <input
                className="col form-control mr-2"
                id="singleUseCode"
                type="number"
                maxLength="4"
                className={`form-control ${errors.tek_kullanimlik_kod && "invalid"}`}
                {...register("tek_kullanimlik_kod", {
                  required: "Lütfen 4 haneli tek kullanımlık kodu giriniz.",
                  min: {
                    value: 0,
                    message: "Kod 4 hane olması gerekmektedir",
                  },
                  max: {
                    value: 9999,
                    message: "Kod 4 hane olması gerekmektedir",
                  },
                })}
                value={state.inputValidationCode}
                onChange={(e) => setState({ ...state, inputValidationCode: e.target.value })}
              />
              <small className="text-danger">{errors["tek_kullanimlik_kod"]?.message}</small>
            </div>
          </div>
          {/* Girilen doğrulama kodu yanlış ise*/}
          {state.isVerifiedValidationCode == false && (
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
              <input
                type="submit"
                className="btn-custom btn-timeline-forward w-100 mt-3"
                value="Doğrula"
              />
            </div>
          </div>
          <div className="row mt-1 ">
            <div className="col-12  text-center text-danger">00: {timer}</div>
          </div>
          <div className="row update-phone-number">
            <div className="col-12 ">
              <div className="btn-custom-outline btn-timeline-forward w-100 mt-3">
                Numarayı Güncelle
              </div>
            </div>
          </div>
          <div className="row send-new-code">
            <div className="col-12 ">
              <div
                className="btn-custom-outline btn-timeline-forward w-100 mt-3"
                onChange={() => sendSms()}
              >
                Yeni Kod Gönder
              </div>
            </div>
          </div>

          {JSON.stringify(state.isVerifiedValidationCode)}
        </div>
        {/*Callback button*/}
        <button
          onClick={() => {
            setCount((count) => count + 1);
            parentCallback(count + 1);
          }}
        >
          increment {phoneNumber}
        </button>
      </form>
    </>
  );
};

export default Counter;
