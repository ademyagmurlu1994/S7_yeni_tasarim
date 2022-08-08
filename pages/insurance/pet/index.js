//import "./PetInformation.css";

import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";

//Componentler
import WhatIsTheXInsurance from "/components/common/WhatIsTheXInsurance";
import ComplementaryFAQ from "/components/faq/ComplementaryFAQ";
import NotificationConfirmation from "/components/pop-up/NotificationConfirmation";
import SingleCodeVerification from "/components/pop-up/SingleCodeVerification";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";

//Step Components
import StepLabelIcon from "/components/step/StepLabelIcon";

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
} from "/functions/common";

//Styles
import { inputStyle, MainButtonLarge } from "/styles/custom";

//Images
import {
  PetInsurancePackageOne,
  PetInsurancePackageTwo,
  DaskInsuranceInformationPhoto,
  WhatIsTheDaskInsurance,
} from "/resources/images";

function PetInformation() {
  /*Her Adımda ayrı form elemanı olduğu için ayrı ayrı control oluşturmamız gerekiyor,*/
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    control,
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
    isCat: true,
    identityNo: "",
    birthDate: "",
    phoneNumber: "",
    isCheckedNotification: false,
    genders: [
      { id: 1, name: "Erkek" },
      { id: 2, name: "Dişi" },
    ],
    ages: [
      { id: 1, name: "0 - 6 aylık" },
      { id: 2, name: "1 yaşında" },
      { id: 3, name: "2 yaşında" },
      { id: 4, name: "3 yaşında" },
      { id: 5, name: "4 yaşında" },
      { id: 6, name: "5 yaşında" },
      { id: 7, name: "6 yaşında" },
    ],
    catBreed: [
      { id: 1, name: "Maine Coon" },
      { id: 2, name: "British Shorthair" },
      { id: 3, name: "Bengal" },
      { id: 4, name: "Siyam" },
      { id: 5, name: "Sfenks" },
      { id: 6, name: "Munchkin" },
    ],
    dogBreed: [
      { id: 1, name: "Kaniş" },
      { id: 2, name: "Buldog" },
      { id: 3, name: "Alman" },
      { id: 4, name: "Pug" },
      { id: 5, name: "Chihuahua" },
      { id: 6, name: "Golden Retriever" },
    ],
  });

  const [selectedBreed, setSelectedBreed] = useState();
  const [selectedGender, setSelectedGender] = useState();
  const [selectedAge, setSelectedAge] = useState();

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
          <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 mt-2">
            <div className="row">
              <div className="col-lg-12">
                <div className="">
                  <form autoComplete="off" onSubmit={handleSubmit(validateStep)}>
                    {/**Pet Bilgi Girişi */}
                    <>
                      {/* Kedimi Köpekmi Kontrolü */}
                      <div className="d-flex mb-3 mt-4">
                        <div className="w-50">
                          <div className="custom-radio-button custom-radio-button-with-image">
                            <input
                              type="radio"
                              name="plakavarmi"
                              id="plakaVar"
                              value={true}
                              checked={state.isCat}
                              onChange={() => setState({ ...state, isCat: true })}
                            />
                            <label htmlFor="plakaVar">
                              <img src="/static/img/icons/cat-icon.png" />
                              <h3 className="" style={{ fontWeight: "600" }}>
                                Kedi
                              </h3>
                            </label>
                          </div>
                        </div>
                        <div className="w-50">
                          <div className="custom-radio-button custom-radio-button-with-image">
                            <input
                              type="radio"
                              name="plakavarmi"
                              id="plakaYok"
                              value={false}
                              checked={!state.isCat}
                              onChange={() => setState({ ...state, isCat: false })}
                            />
                            <label htmlFor="plakaYok">
                              <h3 className="" style={{ fontWeight: "600" }}>
                                Köpek
                              </h3>
                              <img src="/static/img/icons/dog-icon.png" alt="" />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="row mt-2 mb-4">
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mt-4">
                          <TextField
                            {...register("pet-name", {
                              required: "Ad alanı zorunlu",
                            })}
                            type="text"
                            sx={inputStyle}
                            size="small"
                            error={Boolean(errors["pet-name"])}
                            label="Adı *"
                          />
                          <small className="text-danger">{errors["pet-name"]?.message}</small>
                        </div>

                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6  mt-4">
                          <Autocomplete
                            value={selectedBreed}
                            onChange={(event, newValue) => {
                              setSelectedBreed(newValue);
                              clearErrors("pet-cins");
                            }}
                            options={state.isCat ? state.catBreed : state.dogBreed}
                            getOptionLabel={(option) => option.name}
                            sx={inputStyle}
                            size="small"
                            renderInput={(params) => (
                              <TextField
                                {...register("pet-cins", {
                                  required: "Cins alanı zorunlu",
                                })}
                                {...params}
                                label="Cinsi"
                                required
                                placeholder="Cins Seçiniz"
                                error={Boolean(errors["pet-cins"])}
                              />
                            )}
                          />
                          <small className="text-danger">{errors["pet-cins"]?.message}</small>
                        </div>

                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mt-4">
                          <Autocomplete
                            className="readonly"
                            value={selectedGender}
                            onChange={(event, newValue) => {
                              setSelectedGender(newValue);
                              clearErrors("pet-cinsiyet");
                            }}
                            options={state.genders}
                            getOptionLabel={(option) => option.name}
                            sx={inputStyle}
                            size="small"
                            renderInput={(params) => (
                              <TextField
                                {...register("pet-cinsiyet", {
                                  required: "Cinsiyet alanı zorunlu",
                                })}
                                {...params}
                                label="Cinsiyeti"
                                required
                                placeholder="Cinsiyeti Seçiniz"
                                error={Boolean(errors["pet-cinsiyet"])}
                              />
                            )}
                          />
                          <small className="text-danger">{errors["pet-cinsiyet"]?.message}</small>
                        </div>

                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6  mt-4">
                          <Autocomplete
                            className="readonly"
                            value={selectedAge}
                            onChange={(event, newValue) => {
                              setSelectedAge(newValue);
                              clearErrors("pet-yas");
                            }}
                            options={state.ages}
                            getOptionLabel={(option) => option.name}
                            sx={inputStyle}
                            size="small"
                            renderInput={(params) => (
                              <TextField
                                {...register("pet-yas", {
                                  required: "Yaş alanı zorunlu",
                                })}
                                {...params}
                                label="Yaş"
                                required
                                placeholder="Yaş Seçiniz"
                                error={Boolean(errors["pet-yas"])}
                              />
                            )}
                          />
                          <small className="text-danger">{errors["pet-yas"]?.message}</small>
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
                                    type="tel"
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
                                    color: "var(--color-one)",
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
                                  color: "var(--color-one)",
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
                      <img src={PetInsurancePackageOne} alt="" width="100%" />
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
                      <img src={PetInsurancePackageTwo} alt="" width="100%" />
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
                    router.push("/insurance/pet/offers");
                  }}
                >
                  PET SİGORTASI TEKLİF AL
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
        <div className="container" style={{ marginBottom: "100px" }}>
          <div className=" col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center mt-3 mb-4">
            <h4>Can dostlarınızı Patim Güvende Sigortası ile güvenceye alın.</h4>
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
        {/*Tamamlayıcı Sağlık Sigortası Nedir?*/}
        <div className="row">
          <div className="col-12">
            <WhatIsTheXInsurance
              title="PET SİGORTASI NEDİR? NE İŞE YARAR?"
              topTitle="EVCİL HAYVANINIZI HASTALIKLARA KARŞI ÖNLEM ALIN"
              descriptionParagraphs={[
                "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error illum reprehenderit iste dolorem optio id ipsa eligendi similique animi voluptatem laborum, tempora perferendis labore consequuntur facere aperiam quas consequatur officiis!",
                "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error illum reprehenderit iste dolorem optio id ipsa eligendi similique animi voluptatem laborum, tempora perferendis labore consequuntur facere aperiam quas consequatur officiis!",
                ,
              ]}
            />
          </div>
        </div>

        {/* <div className="container" style={{ marginTop: "100px" }}>
          <ComplementaryFAQ topic="TAMAMLAYICI SAĞLIK" />
        </div> */}
      </section>
    </>
  );
}

export default PetInformation;
