//import "./PhoneIndex.css";

import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";

//Componentler
import NotificationConfirmation from "/components/pop-up/NotificationConfirmation";
import SingleCodeVerification from "/components/pop-up/SingleCodeVerification";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { styled } from "@mui/material/styles";

//Step Components
import StepLabelIcon from "/components/step/StepLabelIcon";

import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";

//fonksiyonlar
import {
  isValidTcKimlik,
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
  isValidImeiNumber,
} from "/functions/common";

//Styles
import { inputStyle, MainButtonLarge } from "/styles/custom";

//Images
import { PhoneIcon, PhoneInsurancePackageOne, PhoneInsurancePackageTwo } from "/resources/images";

function PhoneIndex() {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    setValue: setValue2,
    setError: setError2,
    clearErrors: clearErrors2,
    control: control2,
    formState: { errors: errors2 },
  } = useForm();

  const {
    register: register3,
    handleSubmit: handleSubmit3,
    setValue: setValue3,
    setError: setError3,
    clearErrors: clearErrors3,
    control: control3,
    formState: { errors: errors3 },
  } = useForm();

  const router = useRouter();

  const [activeStep, setActiveStep] = React.useState(0);
  const [state, setState] = useState({
    identityNo: "",
    birthDate: "",
    phoneNumber: "",
    isCheckedNotification: false,
    imeiNumber: "",
    phoneCompanies: [
      { id: 1, name: "Samsung" },
      { id: 2, name: "Iphone" },
      { id: 3, name: "Huwaei" },
      { id: 4, name: "Xiaomi" },
      { id: 5, name: "General Mobile" },
    ],
    phoneModels: [
      { id: 1, name: "S20+" },
      { id: 2, name: "S21+" },
      { id: 3, name: "S22" },
      { id: 4, name: "S20" },
      { id: 5, name: "E52" },
    ],
  });

  const [selectedCompany, setSelectedCompany] = useState();
  const [selectedPhoneModel, setSelectedPhoneModel] = useState();

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
      setActiveStep(2);
    }
  }, [isVerifySmsSingleCode]);

  const validateStep = (data) => {
    const forwardStep = activeStep + 1;
    console.log("Active Step: ", activeStep);

    switch (forwardStep) {
      case 1:
        setActiveStep(forwardStep);
        break;
      case 2:
        //Bildirim check box'ı işaretli değilse pop-up gösteriliyor
        if (state.isCheckedNotification == false && notificationConfirmation == undefined) {
          setIsShowNotifyConfirmPopup(true);
        } else {
          setIsShowNotifyConfirmPopup(false);
          /**isShow tetiklenmesi için önce false sonra true yapıyoruz. (Watch işlemi) */
          setIsShowVerifySingleCodePopup(false);
          setIsShowVerifySingleCodePopup(true);
        }
        break;
      default:
      //Kod gönderme componentini 3 adım hariç tüm adımlarda kapalı tutuyoruz.(sürekli sms gönderilmemesi için)
      //setIsShowVerifySingleCodePopup(false);
    }
  };

  const notificationConfirmationCallback = useCallback((isConfirmNotify) => {
    setNotificationConfirmation(isConfirmNotify);
  }, []);

  const singleCodeVerificationCallback = useCallback((isVerify) => {
    setIsVerifySmsSingleCode(isVerify);
  });

  const OneStep = () => {
    return (
      <Box
        sx={{
          mt: 5,
          mb: 1,
          mr: "auto",
          ml: "auto",
          p: "30px",
          border: "2px solid #eeeeee",
          borderRadius: "5px",
        }}
        className="animate__animated animate__fadeInRight stepContainer"
      >
        <div className="row justify-content-center">
          {/* Content */}
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 mt-2">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <form autoComplete="off" onSubmit={handleSubmit(validateStep)}>
                  {/**Phone Bilgi Girişi */}
                  <>
                    <div className="row mt-2 mb-4">
                      <div className="col-12 mt-4">
                        <Autocomplete
                          value={selectedCompany}
                          onChange={(event, newValue) => {
                            setSelectedCompany(newValue);
                            clearErrors("phone-company");
                          }}
                          options={state.phoneCompanies}
                          getOptionLabel={(option) => option.name}
                          sx={inputStyle}
                          size="small"
                          renderInput={(params) => (
                            <TextField
                              {...register("phone-company", {
                                required: "Marka alanı zorunlu",
                              })}
                              {...params}
                              label="Marka"
                              required
                              placeholder="Marka Seçiniz"
                              error={Boolean(errors["phone-company"])}
                            />
                          )}
                        />
                        <small className="text-danger">{errors["phone-company"]?.message}</small>
                      </div>

                      <div className="col-12 mt-4">
                        <Autocomplete
                          value={selectedPhoneModel}
                          onChange={(event, newValue) => {
                            setSelectedPhoneModel(newValue);
                            clearErrors("phone-model");
                          }}
                          options={state.phoneModels}
                          getOptionLabel={(option) => option.name}
                          sx={inputStyle}
                          size="small"
                          renderInput={(params) => (
                            <TextField
                              {...register("phone-model", {
                                required: "Model alanı zorunlu",
                              })}
                              {...params}
                              label="Model"
                              required
                              placeholder="Model Seçiniz"
                              error={Boolean(errors["phone-model"])}
                            />
                          )}
                        />
                        <small className="text-danger">{errors["phone-model"]?.message}</small>
                      </div>

                      <div className="col-12 mt-4">
                        <TextField
                          {...register("imeiNumber", {
                            required: "Imei Number alanı zorunlu",
                            validate: isValidImeiNumber,
                            min: {
                              value: 15,
                              message: "En az iki hane olmak zorunda",
                            },
                          })}
                          type="number"
                          value={state.imeiNumber}
                          onChange={(e) => {
                            setState({
                              ...state,
                              imeiNumber: e.target.value,
                            });
                          }}
                          sx={{ width: "100%" }}
                          size="small"
                          error={Boolean(errors["imeiNumber"])}
                          label="Imei Number"
                          maxLength={15}
                        />
                        <small className="text-danger">
                          {errors["imeiNumber"]?.message}
                          {/**Validate Message */}
                          {errors.imeiNumber &&
                            errors.imeiNumber.type == "validate" &&
                            "Geçersiz Imei Numarası"}
                        </small>
                      </div>

                      <div className="col-12 ">
                        <div className="row justify-content-end">
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6  mt-4 ">
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
                  </>
                </form>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mobile-mode-display-none">
                <div className="d-flex justify-content-center">
                  <img src={PhoneIcon} width="auto" style={{ maxHeight: "200px" }} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    );
  };

  const TwoStep = () => {
    return (
      <Box
        sx={{
          mt: 5,
          mb: 1,
          mr: "auto",
          ml: "auto",
          p: "30px",
          border: "2px solid #eeeeee",
          borderRadius: "5px",
        }}
        className="animate__animated animate__fadeInRight stepContainer"
      >
        <div className="row justify-content-center">
          {/* Content */}
          <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8 mt-2">
            <div className="row">
              <div className="col-lg-12">
                <div className="">
                  <form autoComplete="off" onSubmit={handleSubmit2(validateStep)}>
                    {/* Sahip Bilgi Girişi  */}
                    <div className="row mt-2 justify-content-center">
                      <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                        <div className="row ">
                          <div className="col-12  mt-4">
                            <TextField
                              {...register2("tc_kimlik_numarasi", {
                                required: "T.C. Kimlik Numarası zorunlu",
                                validate: isValidTcKimlik,
                              })}
                              value={state.identityNo}
                              onChange={(e) => {
                                setState({ ...state, identityNo: e.target.value });
                                clearErrors2("tc_kimlik_numarasi");
                              }}
                              type="number"
                              sx={inputStyle}
                              size="small"
                              error={Boolean(errors2["tc_kimlik_numarasi"])}
                              label="T.C. Kimlik Numarası"
                              maxLength={11}
                            />
                            <small className="text-danger">
                              {errors2["tc_kimlik_numarasi"]?.message}
                              {/**Validate Message */}
                              {errors2.tc_kimlik_numarasi &&
                                errors2.tc_kimlik_numarasi.type == "validate" &&
                                "Geçersiz T.C. Kimlik Numarası"}
                            </small>
                          </div>

                          <div className="col-12  mt-4">
                            <TextField
                              {...register2("dogumTarihi", {
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
                                  clearErrors2("dogumTarihi");
                                }
                              }}
                              type="date"
                              sx={inputStyle}
                              size="small"
                              error={Boolean(errors2["dogumTarihi"])}
                              label="Doğum Tarihi"
                            />

                            <small className="text-danger">{errors2["dogumTarihi"]?.message}</small>
                          </div>

                          <div className="col-12 mt-4">
                            <div className="phone-number">
                              <div
                                className="input-form-with-prefix w-100"
                                style={{ display: "flex" }}
                              >
                                <div className="bg-main text-white input-form-prefix px-2">+90</div>
                                <div className="input-with-prefix">
                                  <TextField
                                    {...register2("cepTelefonNo", {
                                      required: "Cep telefonu numarası zorunlu",
                                      pattern: {
                                        value:
                                          /^(([\+]90?)|([0]?))([ ]?)((\([0-9]{3}\))|([0-9]{3}))([ ]?)([0-9]{3})(\s*[\-]?)([0-9]{2})(\s*[\-]?)([0-9]{2})$/,
                                        message: "Geçersiz cep telefon numarası",
                                      },
                                    })}
                                    InputProps={{
                                      inputProps: {
                                        className: "phoneNumber",
                                      },
                                    }}
                                    value={state.phoneNumber}
                                    onChange={(e) => {
                                      setState({
                                        ...state,
                                        phoneNumber: e.target.value,
                                      });
                                      clearErrors2("cepTelefonNo");
                                    }}
                                    placeholder="(5xx) xxx xx xx"
                                    sx={inputStyle}
                                    size="small"
                                    error={Boolean(errors2["cepTelefonNo"])}
                                    label="Cep Telefon Numarası"
                                  />
                                </div>
                              </div>
                              <small className="text-danger">
                                {errors2["cepTelefonNo"]?.message}
                              </small>
                            </div>
                          </div>
                          <div className="col-12 mt-4">
                            <div
                              className="w-100 m-0 p-0"
                              style={{ display: "flex", alignItems: "flex-start" }}
                            >
                              <Checkbox
                                {...register2("kvkkCheck", {
                                  required:
                                    "Devam etmeden önce KVKK Aydınlatma Metnini kabul etmelisiniz",
                                })}
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
                            <small className="text-danger">{errors2["kvkkCheck"]?.message}</small>
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
      </Box>
    );
  };

  const ThreeStep = () => {
    return (
      <Box
        sx={{
          mt: 5,
          mb: 1,
          mr: "auto",
          ml: "auto",
          p: "30px",
          border: "2px solid #eeeeee",
          borderRadius: "5px",
        }}
        className="animate__animated animate__fadeInRight stepContainer"
      >
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 mt-4">
            {/* Paket Seçimi */}
            <div className="row justify-content-between">
              <div className="col-6">
                <div className="custom-radio-button custom-radio-button-pet-package">
                  <input
                    type="radio"
                    name="plakavarmi"
                    id="plakaVar"
                    value={true}
                    checked={state.isPackageOne}
                    onChange={() => setState({ ...state, isPackageOne: true })}
                  />
                  <label htmlFor="plakaVar">
                    <div className="pet-insurance-package">
                      <img src={PhoneInsurancePackageOne} alt="" width="100%" />
                      <h3 className="mt-3">PAKET 1</h3>
                      <p>Küçük Paket .bazı teminatları eksik olacak Ürüne göre düzenlenecektir</p>
                    </div>
                  </label>
                </div>
              </div>
              <div className="col-6">
                <div className="custom-radio-button custom-radio-button-pet-package">
                  <input
                    type="radio"
                    name="plakavarmi"
                    id="plakaYok"
                    value={false}
                    checked={!state.isPackageOne}
                    onChange={() => setState({ ...state, isPackageOne: false })}
                  />
                  <label htmlFor="plakaYok">
                    <div className="pet-insurance-package">
                      <img src={PhoneInsurancePackageTwo} alt="" width="100%" />
                      <h3 className="mt-3">PAKET 2</h3>
                      <p>
                        Büyük paket daha fazla teminat olacak Ürüne göre içerik yazıları
                        güncellenecek
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="mt-2">
                <label className="checkbox-toggle">
                  <label className="font-weight-bold mr-2" style={{ fontSize: "15pt" }}>
                    Paket 1
                  </label>
                  <input
                    type="checkbox"
                    value={!state.isPackageOne}
                    checked={!state.isPackageOne}
                    onChange={(e) => setState({ ...state, isPackageOne: !e.target.checked })}
                  />
                  <span className="slider round"></span>
                  <label className="font-weight-bold ml-2" style={{ fontSize: "15pt" }}>
                    Paket 2
                  </label>
                </label>
              </div>
            </div>
            <div className="row justify-content-end mt-4">
              <div className="col-12 col-lg-6 col-md-6">
                <MainButtonLarge
                  variant="contained"
                  sx={{ width: "100%" }}
                  onClick={() => {
                    router.push("/insurance/phone/offers");
                  }}
                >
                  CEP TELEFONU SİGORTASI TEKLİF AL
                </MainButtonLarge>
              </div>
            </div>
          </div>
        </div>
      </Box>
    );
  };

  const steps = [OneStep(), TwoStep(), ThreeStep()];

  const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 28,
      right: "calc(50% + 28px)",
      left: "calc(-50% + 28px)",
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderTopWidth: 2,
      borderRadius: 1,
    },
  }));

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
        <div className="container" style={{ marginBottom: "400px" }}>
          <div className=" col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center mt-3 mb-4">
            <h4>Telefonunuzu Sigorta ile güvenceye alın.</h4>
          </div>
          <Box>
            <Stepper activeStep={activeStep} alternativeLabel connector={<QontoConnector />}>
              {steps.map((label, index) => {
                return (
                  <Step key={index}>
                    <StepLabel StepIconComponent={StepLabelIcon}></StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <Box>{steps[activeStep]}</Box>
          </Box>
        </div>
      </section>
    </>
  );
}

export default PhoneIndex;
