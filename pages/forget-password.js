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

const ForgetPassword = () => {
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

  const onForgetPassword = (data) => {
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
                <h3 className="mt-4 text-center text-secondary">
                  <b>Parolamı Unuttum</b>
                </h3>

                <form className="" onSubmit={handleSubmit(onForgetPassword)}>
                  {/* E-posta adresi */}
                  <div className="col-lg-12 email mt-3">
                    <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                      <div className="bg-main text-white input-form-prefix">
                        <i className="far fa-envelope"></i>
                      </div>
                      <div className="input-with-prefix">
                        <input
                          type="email"
                          placeholder="E-Posta Adresi"
                          className={`form-control mr-2 ${errors.email && "invalid"}`}
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
                    </div>
                    <small className="text-danger">{errors["email"]?.message}</small>
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

export default ForgetPassword;
