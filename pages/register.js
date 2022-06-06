import Link from "next/link";
import { logo } from "/resources/images";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";

//Componentler
import SingleCodeVerification from "/components/pop-up/SingleCodeVerification";

//fonksiyonlar
import {
  isValidTcKimlik,
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
} from "/functions/common";

const Register = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [state, setState] = useState({
    isIndividual: true,
  });

  const [individual, setIndividual] = useState({
    userName: "",
    userSurname: "",
    identityNo: undefined,
    email: "",
    phoneNumber: undefined,
    password: "",
    passwordRepeat: "",
  });
  const [foundation, setFoundation] = useState({
    companyName: "",
    taxNumber: undefined,
    email: "",
    phoneNumber: undefined,
    password: "",
    passwordRepeat: "",
  });

  const [isShowVerifyCode, setIsShowVerifyCode] = useState();

  const onRegister = (data) => {
    setIsShowVerifyCode(true);
    console.log(data);
  };

  const singleCodeVerificationCallback = useCallback((isVerifyCode) => {
    //setIsAcceptNotification(isAcceptNotification);
    console.log(isVerifyCode);
    if (isVerifyCode) {
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  }, []);

  return (
    <>
      {isShowVerifyCode == true && (
        <SingleCodeVerification
          isShowUpdateButton={false}
          phoneNumber={state.isIndividual ? individual.phoneNumber : foundation.phoneNumber}
          singleCodeVerificationCallback={singleCodeVerificationCallback}
        />
      )}
      <section className="align-items-center d-flex">
        <div className="overlay_account" />
        <div className="container animate__animated animate__backInUp">
          <div className="row mt-5">
            <div className="col-lg-12"></div>
          </div>
          <div className="row mt-3">
            <div className="col-lg-12">
              <div className="account_box mt-3 mx-auto">
                <h3 className="mt-4 text-center text-secondary">
                  <b>Yeni Kullanıcı</b>
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

                <form className="" onSubmit={handleSubmit(onRegister)}>
                  {/* Individual form */}
                  <div className={`individual ${state.isIndividual == false && "d-none"}`}>
                    {/*Ad */}
                    <div className="col-lg-12 mt-3">
                      <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                        <div className="bg-main text-white input-form-prefix">
                          <i className="far fa-user"></i>
                        </div>
                        <input
                          type="text"
                          placeholder="Adınız"
                          className={`form-control ${errors.individualUserName && "invalid"}`}
                          {...register("individualUserName", {
                            required: "Ad bilgisi zorunludur",
                          })}
                          value={individual.userName}
                          onChange={(e) =>
                            setIndividual({ ...individual, userName: e.target.value })
                          }
                        />
                      </div>

                      <small className="text-danger">{errors["individualUserName"]?.message}</small>
                    </div>
                    {/*Soyad  */}
                    <div className="col-lg-12 mt-3">
                      <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                        <div className="bg-main text-white input-form-prefix">
                          <i className="far fa-user"></i>
                        </div>
                        <input
                          type="text"
                          placeholder="Soyadınız"
                          className={`form-control ${errors.individualUsername && "invalid"}`}
                          {...register("individualUserSurname", {
                            required: "Soyad bilgisi zorunludur",
                          })}
                          value={individual.userSurname}
                          onChange={(e) =>
                            setIndividual({ ...individual, userSurname: e.target.value })
                          }
                        />
                      </div>

                      <small className="text-danger">
                        {errors["individualUserSurname"]?.message}
                      </small>
                    </div>
                    {/**TC kimlik Numarası */}
                    <div className="col-lg-12 mt-3">
                      <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                        <div className="bg-main text-white input-form-prefix">
                          <b>TC</b>
                        </div>
                        <div className="input-with-prefix">
                          <input
                            type="number"
                            placeholder="T.C. Kimlik Numarası"
                            maxLength="11"
                            className={`form-control ${errors.individualIdentityNo && "invalid"}`}
                            {...register("individualIdentityNo", {
                              required: "T.C. Kimlik Numarası zorunlu",
                              validate: isValidTcKimlik,
                            })}
                            value={individual.identityNo}
                            onChange={(e) => {
                              setIndividual({ ...individual, identityNo: e.target.value });
                              clearErrors("individualIdentityNo");
                            }}
                          />
                        </div>
                      </div>

                      <small className="text-danger">
                        {errors["individualIdentityNo"]?.message}
                        {/**Validate Message */}
                        {errors.individualIdentityNo
                          ? errors.individualIdentityNo.type == "validate"
                            ? "Geçersiz T.C. Kimlik Numarası"
                            : ""
                          : ""}
                      </small>
                    </div>
                    {/* E-posta adresi */}
                    <div className="col-lg-12 mt-3">
                      <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                        <div className="bg-main text-white input-form-prefix">
                          <i className="far fa-envelope"></i>
                        </div>
                        <div className="input-with-prefix">
                          <input
                            type="email"
                            id="individualEmail"
                            placeholder="E-Posta Adresi"
                            className={`form-control ${errors.individualEmail && "invalid"}`}
                            {...register("individualEmail", {
                              required: "E-Posta Adresi zorunlu",
                              pattern: {
                                value:
                                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                                message: "Geçersiz email adresi",
                              },
                            })}
                            value={individual.email}
                            onChange={(e) => {
                              setIndividual({ ...individual, email: e.target.value });
                              clearErrors("individualEmail");
                            }}
                          />
                        </div>
                      </div>
                      <small className="text-danger">{errors["individualEmail"]?.message}</small>
                    </div>{" "}
                    {/**Phone Number */}
                    <div className="col-lg-12 phone-number mt-3">
                      <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                        <div className="bg-main text-white input-form-prefix px-2">+90</div>
                        <div className="input-with-prefix">
                          <input
                            type="tel"
                            id="individualPhone"
                            name="individualPhoneNumber"
                            className={`form-control ${errors.individualPhoneNumber && "invalid"}`}
                            {...register("individualPhoneNumber", {
                              required: "Cep telefonu numarası zorunlu",
                              pattern: {
                                value:
                                  /^(([\+]90?)|([0]?))([ ]?)((\([0-9]{3}\))|([0-9]{3}))([ ]?)([0-9]{3})(\s*[\-]?)([0-9]{2})(\s*[\-]?)([0-9]{2})$/,
                                message: "Geçersiz cep telefon numarası",
                              },
                            })}
                            value={individual.phoneNumber}
                            onChange={(e) => {
                              setIndividual({ ...individual, phoneNumber: e.target.value });
                              clearErrors("individualPhoneNumber");
                            }}
                            placeholder="(5xx) xxx xx xx"
                          />
                        </div>
                      </div>
                      <small className="text-danger">
                        {errors["individualPhoneNumber"]?.message}
                      </small>
                    </div>
                    {/* Parola */}
                    <div className="col-lg-12 mt-3">
                      <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                        <div className="bg-main text-white input-form-prefix">
                          <i className="fas fa-lock"></i>
                        </div>
                        <input
                          id="passwordIndividual"
                          type="password"
                          placeholder="Şifre"
                          className={`form-control ${errors.individualPassword && "invalid"}`}
                          {...register("individualPassword", {
                            required: "Şifre alanı zorunludur",
                            pattern: {
                              value:
                                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                              message:
                                "Şifreniz en az 8 karakterden oluşmalıdır. (En az 1 büyük karakter, 1 küçük karakter, 1 sayı ve 1 özel karakter içermelidir.)",
                            },
                          })}
                          value={individual.password}
                          onChange={(e) => {
                            setIndividual({ ...individual, password: e.target.value });
                            clearErrors("individualPassword");
                          }}
                        />
                      </div>

                      <small className="text-danger">{errors["individualPassword"]?.message}</small>
                    </div>
                    {/* Parola Tekrar*/}
                    <div className="col-lg-12 mt-3">
                      <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                        <div className="bg-main text-white input-form-prefix">
                          <i className="fas fa-lock"></i>
                        </div>
                        <input
                          id="passwordIndividualRepeat"
                          type="password"
                          placeholder="Şifre Tekrar"
                          className={`form-control ${errors.individualPasswordRepeat && "invalid"}`}
                          {...register("individualPasswordRepeat", {
                            required: "Şifre tekrar alanı zorunludur",
                            pattern: {
                              value:
                                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                              message:
                                "Şifreniz en az 8 karakterden oluşmalıdır. (En az 1 büyük karakter, 1 küçük karakter, 1 sayı ve 1 özel karakter içermelidir.)",
                            },
                          })}
                          value={individual.passwordRepeat}
                          onChange={(e) => {
                            setIndividual({ ...individual, passwordRepeat: e.target.value });
                            clearErrors("individualPasswordRepeat");
                          }}
                        />
                      </div>

                      <small className="text-danger">
                        {errors["individualPasswordRepeat"]?.message}
                      </small>
                    </div>
                  </div>
                  {/* Foundation form */}
                  <div className={` foundation ${state.isIndividual == true && "d-none"}`}>
                    {/*Firma Ünvanı */}
                    <div className="col-lg-12 mt-3">
                      <input
                        type="text"
                        placeholder="Firma Ünvanı"
                        aria-label="readonly input example"
                        className={`form-control ${errors.foundationCompanyName && "invalid"}`}
                        {...register("foundationCompanyName", {
                          required: "Firma Ünvanı alanı zorunludur",
                        })}
                        value={foundation.companyName}
                        onChange={(e) => {
                          setFoundation({ ...foundation, companyName: e.target.value });
                          clearErrors("foundationCompanyName");
                        }}
                      />
                      <small className="text-danger">
                        {errors["foundationCompanyName"]?.message}
                      </small>
                    </div>
                    {/*Vergi Numarası */}
                    <div className="col-lg-12 mt-3">
                      <input
                        type="number"
                        placeholder="Vergi No"
                        maxLength="10"
                        className={`form-control ${errors.foundationTaxNumber && "invalid"}`}
                        {...register("foundationTaxNumber", {
                          required: "Vergi Numarası alanı zorunlu",
                          //validate: isValidTcKimlik,
                        })}
                        value={foundation.taxNumber}
                        onChange={(e) => {
                          setFoundation({ ...foundation, taxNumber: e.target.value });
                          clearErrors("foundationTaxNumber");
                        }}
                      />
                      <small className="text-danger">
                        {errors["foundationTaxNumber"]?.message}
                      </small>
                    </div>
                    {/* E-posta adresi */}
                    <div className="col-lg-12 email mt-3">
                      <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                        <div className="bg-main text-white input-form-prefix">
                          <i className="far fa-envelope"></i>
                        </div>
                        <div className="input-with-prefix">
                          <input
                            type="email"
                            id="foundationEmail"
                            placeholder="E-Posta Adresi"
                            className={`form-control ${errors.foundationEmail && "invalid"}`}
                            {...register("foundationEmail", {
                              required: "E-Posta Adresi zorunlu",
                              pattern: {
                                value:
                                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                                message: "Geçersiz email adresi",
                              },
                            })}
                            value={foundation.email}
                            onChange={(e) => {
                              setFoundation({ ...foundation, email: e.target.value });
                              clearErrors("foundationEmail");
                            }}
                          />
                        </div>
                      </div>
                      <small className="text-danger">{errors["foundationEmail"]?.message}</small>
                    </div>
                    {/**Phone Number */}
                    <div className="col-lg-12 phone-number mt-3">
                      <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                        <div className="bg-main text-white input-form-prefix px-2">+90</div>
                        <div className="input-with-prefix">
                          <input
                            type="tel"
                            id="foundationPhone"
                            name="foundationPhoneNumber"
                            className={`form-control ${errors.foundationPhoneNumber && "invalid"}`}
                            {...register("foundationPhoneNumber", {
                              required: "Cep telefonu numarası zorunlu",
                              pattern: {
                                value:
                                  /^(([\+]90?)|([0]?))([ ]?)((\([0-9]{3}\))|([0-9]{3}))([ ]?)([0-9]{3})(\s*[\-]?)([0-9]{2})(\s*[\-]?)([0-9]{2})$/,
                                message: "Geçersiz cep telefon numarası",
                              },
                            })}
                            value={foundation.phoneNumber}
                            onChange={(e) => {
                              setFoundation({ ...foundation, phoneNumber: e.target.value });
                              clearErrors("foundationPhoneNumber");
                            }}
                            placeholder="(5xx) xxx xx xx"
                          />
                        </div>
                      </div>
                      <small className="text-danger">
                        {errors["foundationPhoneNumber"]?.message}
                      </small>
                    </div>
                    {/* Parola */}
                    <div className="col-lg-12 mt-3">
                      <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                        <div className="bg-main text-white input-form-prefix">
                          <i className="fas fa-lock"></i>
                        </div>
                        <input
                          id="passwordFoundation"
                          type="password"
                          placeholder="Şifre"
                          className={`form-control ${errors.foundationPassword && "invalid"}`}
                          {...register("foundationPassword", {
                            required: "Şifre alanı zorunludur",
                            pattern: {
                              value:
                                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                              message:
                                "Şifreniz en az 8 karakterden oluşmalıdır. (En az 1 büyük karakter, 1 küçük karakter, 1 sayı ve 1 özel karakter içermelidir.)",
                            },
                          })}
                          value={foundation.password}
                          onChange={(e) => {
                            setFoundation({ ...foundation, password: e.target.value });
                            clearErrors("foundationPassword");
                          }}
                        />
                      </div>

                      <small className="text-danger">{errors["foundationPassword"]?.message}</small>
                    </div>
                    {/* Parola Tekrar*/}
                    <div className="col-lg-12 mt-3">
                      <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                        <div className="bg-main text-white input-form-prefix">
                          <i className="fas fa-lock"></i>
                        </div>
                        <input
                          id="passwordFoundationRepeat"
                          type="password"
                          placeholder="Şifre Tekrar"
                          className={`form-control ${errors.foundationPasswordRepeat && "invalid"}`}
                          {...register("foundationPasswordRepeat", {
                            required: "Şifre alanı zorunludur",
                            pattern: {
                              value:
                                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                              message:
                                "Şifreniz en az 8 karakterden oluşmalıdır. (En az 1 büyük karakter, 1 küçük karakter, 1 sayı ve 1 özel karakter içermelidir.)",
                            },
                          })}
                          value={foundation.passwordRepeat}
                          onChange={(e) => {
                            setFoundation({ ...foundation, passwordRepeat: e.target.value });
                            clearErrors("foundationPasswordRepeat");
                          }}
                        />
                      </div>

                      <small className="text-danger">
                        {errors["foundationPasswordRepeat"]?.message}
                      </small>
                    </div>
                  </div>

                  <div className="col-lg-12 mt-3">
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        id="customCheck1"
                        className={`form-control custom-control-input ${
                          errors.agreement && "invalid"
                        }`}
                        {...register("agreement", {
                          required: "Devam etmeden önce üyelik sözleşmesini kabul etmelisiniz",
                        })}
                      />
                      <small className="text-danger">{errors["agreement"]?.message}</small>

                      <label className="custom-control-label text-dark" htmlFor="customCheck1">
                        <a href="#" className="text-custom">
                          Üyelik sözleşmesini{" "}
                        </a>
                        kabul ediyorum
                      </label>
                    </div>
                  </div>

                  <input
                    type="submit"
                    className="btn-custom btn-timeline-forward w-100 mt-3"
                    style={{ padding: "20px 26px" }}
                    value="Üye ol"
                  />
                </form>

                <div className="col-lg-12 mt-3">
                  <div className="d-flex justify-content-center">
                    <div className="mr-2">Zaten hesabınız var mı?</div>
                    <Link href="/login">
                      <a className="font-weight-bold color-main">Giriş Yap</a>
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

export default Register;
