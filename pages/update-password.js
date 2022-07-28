import Link from "next/link";
import { logo } from "../resources/images";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import axios from "/instances/axios";
import { toast } from "react-toastify";

//components
import PagePreLoader from "/components/common/PagePreLoader";

//fonksiyonlar
import {
  isValidTcKimlik,
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
  getNewToken,
} from "/functions/common";

const UpdatePassword = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm();

  const [state, setState] = useState({
    oldPassword: "",
    password: "",
    passwordRepeat: "",
  });

  const [token, setToken] = useState();
  const [loader, setLoader] = useState(true);

  useEffect(async () => {
    //Authorization için token çekiyoruz.
    if (!token) {
      await getNewToken().then((res) => {
        setToken(res);
        setLoader(false);
      });
    }
  }, []);

  const onUpdatePassword = async (data) => {
    const user = JSON.parse(localStorage.getItem("nextAuth")).user;
    const bodyData = {
      personeL_COMMERCIAL: user.personeL_COMMERCIAL,
      identitY_NUMBER: user.identitY_NUMBER,
      taX_NUMBER: user.taX_NUMBER,
      email: user.email,
      gsM_NUMBER1: user.gsM_NUMBER1,
      password: state.oldPassword,
      neW_PASSWORD: state.password,
    };

    console.log(bodyData);
    try {
      await axios
        .put("/api/auth/v1/user/updatepassword", bodyData, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log("Update Password: ", res);
          if (res.data.success === true) {
            toast.success("Şifre değiştirme işlemi başarılı.");
            setTimeout(() => {
              router.push("/");
            }, 2000);
          }
        });
    } catch (error) {
      writeResponseError(error);
      toast.error("Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.");
    }
  };

  return (
    <>
      {loader && <PagePreLoader />}
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
                  <b>Şifre Değiştirme</b>
                </h3>

                <form autoComplete="off" className="" onSubmit={handleSubmit(onUpdatePassword)}>
                  {/*Yeni Parola */}
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
                          placeholder="Eski Şifre"
                          className={`form-control ${errors.oldPassword && "invalid"}`}
                          {...register("oldPassword", {
                            required: "Eski Şifre alanı zorunludur",
                            pattern: {
                              value:
                                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                              message:
                                "Şifreniz en az 8 karakterden oluşmalıdır. (En az 1 büyük karakter, 1 küçük karakter, 1 sayı ve 1 özel karakter içermelidir.)",
                            },
                          })}
                          value={state.oldPassword}
                          onChange={(e) => {
                            setState({ ...state, oldPassword: e.target.value });
                            clearErrors("oldPassword");
                            setValue("oldPassword", e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <small className="text-danger">{errors["oldPassword"]?.message}</small>
                  </div>

                  {/* Parola */}
                  <div className="col-lg-12 mt-3">
                    <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                      <div className="bg-main text-white input-form-prefix">
                        <i className="fas fa-lock"></i>
                      </div>
                      <input
                        id="password"
                        type="password"
                        placeholder="Şifre"
                        className={`form-control ${errors.password && "invalid"}`}
                        {...register("password", {
                          required: "Şifre alanı zorunludur",
                          pattern: {
                            value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
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

                    <small className="text-danger">{errors["password"]?.message}</small>
                  </div>
                  {/* Parola Tekrar*/}
                  <div className="col-lg-12 mt-3">
                    <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                      <div className="bg-main text-white input-form-prefix">
                        <i className="fas fa-lock"></i>
                      </div>
                      <input
                        id="passwordRepeat"
                        type="password"
                        placeholder="Şifre Tekrar"
                        className={`form-control ${errors.passwordRepeat && "invalid"}`}
                        {...register("passwordRepeat", {
                          required: "Şifre tekrar alanı zorunludur",
                          pattern: {
                            value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                            message:
                              "Şifreniz en az 8 karakterden oluşmalıdır. (En az 1 büyük karakter, 1 küçük karakter, 1 sayı ve 1 özel karakter içermelidir.)",
                          },
                          validate: (val) => {
                            return Boolean(val == state.password);
                          },
                        })}
                        value={state.passwordRepeat}
                        onChange={(e) => {
                          setState({ ...state, passwordRepeat: e.target.value });
                          clearErrors("passwordRepeat");
                          setValue("passwordRepeat", e.target.value);
                        }}
                      />
                    </div>

                    <small className="text-danger">
                      {errors["passwordRepeat"]?.message}
                      {/**Validate Message */}
                      {errors.passwordRepeat
                        ? errors.passwordRepeat.type == "validate"
                          ? "Şifre ile şifre tekrar aynı olmalıdır."
                          : ""
                        : ""}
                    </small>
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

export default UpdatePassword;
