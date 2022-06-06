import Link from "next/link";
import { logo } from "/resources/images";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

//fonksiyonlar
import {
  isValidTcKimlik,
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
} from "/functions/common";

const InputNewPassword = () => {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [state, setState] = useState({
    isIndividual: true,
    phoneNumber: "",
    email: "",
  });

  const onInputNewPassword = (data) => {
    console.log(data);
  };

  console.log(errors);
  return (
    <>
      <section className="align-items-center d-flex">
        <div className="overlay_account" />
        <div className="container animate__animated animate__backInUp">
          <div className="row mt-5">
            <div className="col-lg-12"></div>
          </div>
          <div className="row mt-3">
            <div className="col-lg-12">
              <div className="account_box mt-3 mx-auto">
                <div className="acc_head text-center">
                  <Link href="/">
                    <img src={logo} style={{ width: "140px" }} alt="" />
                  </Link>
                </div>
                <h3 className="mt-4 text-center text-secondary">
                  <b>Parolamı Unuttum</b>
                </h3>

                <form className="" onSubmit={handleSubmit(onInputNewPassword)}>
                  {/* Parola */}
                  <div className="col-lg-12 mt-3">
                    <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                      <div className="bg-main text-white input-form-prefix">
                        <i className="fas fa-lock"></i>
                      </div>
                      <div className="input-with-prefix">
                        <input
                          type="password"
                          id="password1"
                          name="password"
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
                        />
                      </div>
                    </div>

                    <small className="text-danger">{errors["password"]?.message}</small>
                  </div>
                  {/* Parola Tekrar*/}
                  <div className="col-lg-12 mt-3">
                    <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                      <div className="bg-main text-white input-form-prefix">
                        <i className="fas fa-lock"></i>
                      </div>
                      <div className="input-with-prefix">
                        <input
                          type="password"
                          id="password1"
                          name="password"
                          placeholder="Şifre Tekrar"
                          className={`form-control ${errors.passwordRepeat && "invalid"}`}
                          {...register("passwordRepeat", {
                            required: "Şifre Tekrar alanı zorunludur",
                            pattern: {
                              value:
                                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                              message:
                                "Şifreniz en az 8 karakterden oluşmalıdır. (En az 1 büyük karakter, 1 küçük karakter, 1 sayı ve 1 özel karakter içermelidir.)",
                            },
                          })}
                        />
                      </div>
                    </div>

                    <small className="text-danger">{errors["passwordRepeat"]?.message}</small>
                  </div>

                  <input
                    type="submit"
                    className="btn-custom btn-timeline-forward w-100 mt-3"
                    style={{ padding: "20px 26px" }}
                    value="Onayla"
                  />
                </form>
              </div>
            </div>
          </div>

          <div className="clear-fix"></div>
        </div>
      </section>
    </>
  );
};

export default InputNewPassword;
