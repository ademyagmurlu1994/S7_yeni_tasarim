import Link from "next/link";
import { logo } from "/resources/images";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";

//components
import NotificationConfirmation from "/components/pop-up/NotificationConfirmation";
import SingleCodeVerification from "/components/pop-up/SingleCodeVerification";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import PagePreLoader from "/components/common/PagePreLoader";

//Styles
import { radioButtonSx } from "/styles/inputStyle";

//fonksiyonlar
import {
  isValidTcKimlik,
  getNewToken,
  isValidVergiKimlik,
  writeResponseError,
} from "/functions/common";

import { login, setLocalAuth } from "/functions/auth";
import { toast } from "react-toastify";

const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm();

  const [state, setState] = useState({
    isIndividual: true,
    phoneNumber: "",
    email: "",
    identityNo: "",
    taxNumber: "",
    password: "",
    isShowVerifyCode: false,
  });
  const [checkedLoginFormat, setCheckedLoginFormat] = useState("radioEmail");

  const [isShowVerifySingleCodePopup, setIsShowVerifySingleCodePopup] = useState(false);
  const [isVerifySmsSingleCode, setIsVerifySmsSingleCode] = useState(undefined);
  const [token, setToken] = useState();
  const [loader, setLoader] = useState(true);
  const [user, setUser] = useState();

  useEffect(async () => {
    //Authorization için token çekiyoruz.
    if (!token) {
      await getNewToken().then((res) => {
        setToken(res);
        setLoader(false);
      });
    }
  }, []);

  const onLogin = (data) => {
    console.log(data);
    loginUser();
  };

  const loginUser = async () => {
    let bodyData = {};
    console.log("Checked Login format", checkedLoginFormat);
    bodyData = {
      PERSONEL_COMMERCIAL: state.isIndividual ? "1" : "2",
      IDENTITY_NUMBER:
        (checkedLoginFormat == "radioIdentity" && state.isIndividual && state.identityNo) || null,
      TAX_NUMBER:
        (checkedLoginFormat == "radioIdentity" && !state.isIndividual && state.taxNumber) || null,
      EMAIL: (checkedLoginFormat == "radioEmail" && state.email) || null,
      GSM_NUMBER1:
        (checkedLoginFormat == "radioPhone" &&
          state.phoneNumber
            ?.toString()
            .replaceAll(" ", "")
            .replaceAll("(", "")
            .replaceAll(")", "")) ||
        null,
      PASSWORD: state.password,
    };

    console.log(bodyData);

    try {
      await login(bodyData, token).then((res) => {
        console.log(res);
        setUser(res.user);
        setState({ ...state, phoneNumber: res.user.gsM_NUMBER1 });
        setIsShowVerifySingleCodePopup(true);
      });
    } catch (error) {
      toast.error("Girilen bilgiler eksik veya hatalı. Lütfen tekrar deneyiniz.");
      writeResponseError(error);
    }
  };

  //Kod doğrulama başarılı ise anasayfaya yönlendirme yaptırıyoruz.
  const singleCodeVerificationCallback = useCallback((isVerify) => {
    if (isVerify && user) {
      setLocalAuth(user);
      location.href = "/";
    }
  });

  return (
    <>
      {loader && <PagePreLoader />}

      {/* Pop-up verification Single Code  */}
      {isShowVerifySingleCodePopup == true && state.phoneNumber && (
        <SingleCodeVerification
          singleCodeVerificationCallback={singleCodeVerificationCallback}
          phoneNumber={state.phoneNumber}
          isShow={isShowVerifySingleCodePopup}
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
                {/* Bireysel, Kurumsal Kontrolü */}
                <div className="d-flex mb-3">
                  <div className="w-50">
                    <div className="custom-radio-button">
                      <input
                        type="radio"
                        name="plakavarmi"
                        id="plakaVar"
                        value={true}
                        checked={state.isIndividual}
                        onChange={() => setState({ ...state, isIndividual: true })}
                      />
                      <label htmlFor="plakaVar">Bireysel</label>
                    </div>
                  </div>
                  <div className="w-50">
                    <div className="custom-radio-button">
                      <input
                        type="radio"
                        name="plakavarmi"
                        id="plakaYok"
                        value={false}
                        checked={!state.isIndividual}
                        onChange={() => setState({ ...state, isIndividual: false })}
                      />
                      <label htmlFor="plakaYok">Kurumsal</label>
                    </div>
                  </div>
                </div>
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
                    value="radioIdentity"
                    control={<Radio sx={radioButtonSx} />}
                    label={state.isIndividual ? "T.C. Kimlik Numarası" : "Vergi Kimlik Numarası"}
                  />
                  <FormControlLabel
                    value="radioPhone"
                    control={<Radio sx={radioButtonSx} />}
                    label="Cep Telefonu"
                  />
                </RadioGroup>

                <form autoComplete="off" className="" onSubmit={handleSubmit(onLogin)}>
                  {/* E-posta adresi */}
                  {checkedLoginFormat == "radioEmail" && (
                    <div
                      className={`col-lg-12 mt-3 ${checkedLoginFormat != "radioEmail" && "d-none"}`}
                      key={"email"}
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
                                /^([\w-]{3,30}(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{1,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
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
                  )}

                  {/**TC kimlik Numarası */}
                  {checkedLoginFormat == "radioIdentity" && (
                    <div
                      className={`col-lg-12 mt-3 ${
                        checkedLoginFormat != "radioIdentity" && "d-none"
                      }`}
                      key={"identity"}
                    >
                      {state.isIndividual ? (
                        <>
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
                            {errors.identityNo && errors.identityNo.type == "validate"
                              ? "Geçersiz Vergi Kimlik Numarası"
                              : ""}
                          </small>
                        </>
                      ) : (
                        <>
                          <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                            <div className="input-with-prefix">
                              <input
                                type="number"
                                placeholder="Vergi Kimlik Numarası"
                                maxLength="10"
                                className={`form-control ${errors.taxNumber && "invalid"}`}
                                {...register("taxNumber", {
                                  required: "Vergi Kimlik Numarası zorunlu",
                                  validate: isValidVergiKimlik,
                                })}
                                value={state.taxNumber}
                                onChange={(e) => {
                                  setState({ ...state, taxNumber: e.target.value });
                                  clearErrors("taxNumber");
                                }}
                              />
                            </div>
                          </div>

                          <small className="text-danger">
                            {errors["taxNumber"]?.message}
                            {/**Validate Message */}
                            {errors.taxNumber && errors.taxNumber.type == "validate"
                              ? "Geçersiz Vergi Kimlik Numarası"
                              : ""}
                          </small>
                        </>
                      )}
                    </div>
                  )}

                  {/**Phone Number */}
                  {checkedLoginFormat == "radioPhone" && (
                    <div
                      className={`col-lg-12 mt-3 phone-number  ${
                        checkedLoginFormat != "radioPhone" && "d-none"
                      }`}
                      key={"phoneNumber"}
                    >
                      <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                        <div className="bg-main text-white input-form-prefix px-2">+90</div>
                        <div className="input-with-prefix">
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className={`phoneNumber form-control ${
                              errors.phoneNumber && "invalid"
                            }`}
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
                  )}

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
                            setValue("password", e.target.value);
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
