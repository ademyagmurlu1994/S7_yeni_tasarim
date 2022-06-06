import Link from "next/link";
import { logo } from "/resources/images";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";
import { Router } from "react-router-dom";

//components
import NotificationConfirmation from "/components/pop-up/NotificationConfirmation";
import SingleCodeVerification from "/components/pop-up/SingleCodeVerification";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
/**==================*/
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

//Styles
import { radioButtonSx } from "/styles/inputStyle";

//fonksiyonlar
import {
  isValidTcKimlik,
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
} from "/functions/common";

const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [state, setState] = useState({
    phoneNumber: "",
    email: "",
    identityNo: "",
    password: "",
    isShowVerifyCode: false,
  });
  const [checkedLoginFormat, setCheckedLoginFormat] = useState("radioEmail");

  const [isAcceptNotification, setIsAcceptNotification] = useState();

  const onLogin = (data) => {
    console.log(data);
    setState({ ...state, isShowVerifyCode: true });
  };

  const notificationCallback = useCallback((isAcceptNotification) => {
    setIsAcceptNotification(isAcceptNotification);
    console.log(isAcceptNotification);
  }, []);

  const singleCodeVerificationCallback = useCallback((isVerifyCode) => {
    //setIsAcceptNotification(isAcceptNotification);
    console.log(isVerifyCode);
    if (isVerifyCode) {
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  }, []);

  //============================
  const [value, setValue] = React.useState(2);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //======================================

  return (
    <>
      <NotificationConfirmation notificationCallback={notificationCallback} isShow={false} />

      {state.isShowVerifyCode == true && (
        <SingleCodeVerification
          isShowUpdateButton={false}
          phoneNumber={state.phoneNumber}
          singleCodeVerificationCallback={singleCodeVerificationCallback}
        />
      )}

      <section className="align-items-center d-flex" style={{ marginTop: "70px" }}>
        <div className="container animate__animated animate__backInUp">
          <div className="row mt-3">
            <div className="col-lg-12">
              <div className="account_box mt-3 mx-auto">
                <h3 className="mt-4 text-center text-secondary">
                  <b>Kullanıcı Girişi</b>
                </h3>
                {/* <Tabs value={value} onChange={handleChange} aria-label="disabled tabs example">
                  <Tab label="E-mail" />
                  <Tab label="T.C. Kimlik Numarası" />
                  <Tab label="Cep Telefonu" />
                </Tabs> */}
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  style={{ display: "flex", justifyContent: "space-between" }}
                  value={checkedLoginFormat}
                  onChange={(e, value) => {
                    setCheckedLoginFormat(value);
                    clearErrors();
                  }}
                >
                  <FormControlLabel
                    value="radioEmail"
                    control={<Radio sx={radioButtonSx} />}
                    label="E-mail"
                  />
                  <FormControlLabel
                    value="radioTcIdentity"
                    //value={true}
                    control={<Radio sx={radioButtonSx} />}
                    label="T.C. Kimlik Numarası"
                  />
                  <FormControlLabel
                    value="radioPhone"
                    control={<Radio sx={radioButtonSx} />}
                    label="Cep Telefonu"
                  />
                </RadioGroup>

                <form className="" onSubmit={handleSubmit(onLogin)}>
                  {/* E-posta adresi */}
                  <div
                    className={`col-lg-12 mt-3 ${checkedLoginFormat != "radioEmail" && "d-none"}`}
                  >
                    <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                      <div className="bg-main text-white input-form-prefix">
                        <i className="far fa-envelope"></i>
                      </div>
                      <input
                        type="email"
                        id="email"
                        placeholder="E-Posta Adresi"
                        className={`form-control ${errors.email && "invalid"}`}
                        {...register("email", {
                          required: "E-Posta Adresi zorunlu",
                          pattern: {
                            value:
                              /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                            message: "Geçersiz email adresi",
                          },
                        })}
                        value={state.email}
                        onChange={(e) => {
                          setState({ ...state, email: e.target.value });
                          clearErrors("email");
                        }}
                      />
                    </div>
                    <small className="text-danger">{errors["email"]?.message}</small>
                  </div>
                  {/**TC kimlik Numarası */}
                  <div
                    className={`col-lg-12 mt-3 ${
                      checkedLoginFormat != "radioTcIdentity" && "d-none"
                    }`}
                  >
                    <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                      <div className="bg-main text-white input-form-prefix">
                        <b>TC</b>
                      </div>
                      <div className="input-with-prefix">
                        <input
                          type="number"
                          placeholder="T.C. Kimlik Numarası"
                          maxLength="11"
                          className={`form-control ${errors.identityNo && "invalid"}`}
                          {...register("identityNo", {
                            required: "T.C. Kimlik Numarası zorunlu",
                            validate: isValidTcKimlik,
                          })}
                          value={state.identityNo}
                          onChange={(e) => {
                            setState({ ...state, identityNo: e.target.value });
                            clearErrors("identityNo");
                          }}
                        />
                      </div>
                    </div>

                    <small className="text-danger">
                      {errors["identityNo"]?.message}
                      {/**Validate Message */}
                      {errors.identityNo
                        ? errors.identityNo.type == "validate"
                          ? "Geçersiz T.C. Kimlik Numarası"
                          : ""
                        : ""}
                    </small>
                  </div>
                  {/**Phone Number */}
                  <div
                    className={`col-lg-12 mt-3 phone-number  ${
                      checkedLoginFormat != "radioPhone" && "d-none"
                    }`}
                  >
                    <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                      <div className="bg-main text-white input-form-prefix px-2">+90</div>
                      <div className="input-with-prefix">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className={`form-control ${errors.phoneNumber && "invalid"}`}
                          {...register("phoneNumber", {
                            required: "Cep telefonu numarası zorunlu",
                            pattern: {
                              value:
                                /^(([\+]90?)|([0]?))([ ]?)((\([0-9]{3}\))|([0-9]{3}))([ ]?)([0-9]{3})(\s*[\-]?)([0-9]{2})(\s*[\-]?)([0-9]{2})$/,
                              message: "Geçersiz cep telefon numarası",
                            },
                          })}
                          value={state.phoneNumber}
                          onChange={(e) => {
                            setState({ ...state, phoneNumber: e.target.value });
                            clearErrors("phoneNumber");
                          }}
                          placeholder="(5xx) xxx xx xx"
                        />
                      </div>
                    </div>
                    <small className="text-danger">{errors["phoneNumber"]?.message}</small>
                  </div>

                  {/* Parola */}
                  <div className="col-lg-12 mt-3">
                    <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                      <div className="bg-main text-white input-form-prefix">
                        <i className="fas fa-lock"></i>
                      </div>
                      <div className="input-with-prefix">
                        <input
                          type="password"
                          placeholder="Şifre"
                          className={`form-control ${errors.password && "invalid"}`}
                          {...register("password", {
                            required: "Şifre alanı zorunludur",
                            pattern: {
                              value:
                                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                              message:
                                "Şifreniz en az 8 karakterden oluşmalıdır. (En az 1 büyük karakter, 1 küçük karakter, 1 sayı ve 1 özel karakter içermelidir.)",
                            },
                          })}
                          value={state.password}
                          onChange={(e) => {
                            setState({ ...state, password: e.target.value });
                            clearErrors("password");
                          }}
                        />
                      </div>
                    </div>

                    <small className="text-danger">{errors["password"]?.message}</small>
                  </div>
                  <div className="col-lg-12">
                    <input
                      type="submit"
                      className="btn-custom btn-timeline-forward w-100 mt-3"
                      style={{ padding: "20px 26px" }}
                      value="Giriş Yap"
                    />
                  </div>
                  <div className="d-flex justify-content-between mt-3">
                    <p className="mb-0 text-center ">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          id="customCheck1"
                          className="form-control custom-control-input"
                        />
                        <label className="custom-control-label text-dark" htmlFor="customCheck1">
                          Beni Hatırla
                        </label>
                      </div>
                    </p>
                    <p className="mb-0 text-center ">
                      <Link href="/forget-password">
                        <a className="text-dark">Şifremi unuttum</a>
                      </Link>
                    </p>
                  </div>
                </form>
                <hr />
                <div className="col-lg-12 mt-3">
                  <div className="d-flex justify-content-center">
                    <div className="mr-2">Kayıtlı değil misiniz?</div>
                    <Link href="/register">
                      <a className="font-weight-bold color-main">Kayıt Ol</a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="clear-fix"></div>
        </div>
      </section>
    </>
  );
};

export default Login;
