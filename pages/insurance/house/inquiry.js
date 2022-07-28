import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "/instances/axios";
import { toast } from "react-toastify";

//Componentler
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "/components/form/Button";
import Alert from "@mui/material/Alert";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import PreLoader from "/components/PreLoader";
import PageMessage from "/components/PageMessage";
import NotificationConfirmation from "/components/pop-up/NotificationConfirmation";
import SingleCodeVerification from "/components/pop-up/SingleCodeVerification";
import HouseAddress from "/components/house/HouseAddress";
import ProductSelection from "/components/house/ProductSelection";

//state çağırma ve değiştirme işlemi
import { setIsExistPlate } from "/stores/kasko";
import { useDispatch, useSelector } from "react-redux";

//fonksiyonlar
import {
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
  getNewToken,
  isValidMaskedDate,
  changeDateFormat,
  isValidTcKimlikOrVergiKimlik,
  isValidPhoneNumber,
} from "/functions/common";

//Styles
import { inputStyle } from "/styles/custom";

//Step Components
import StepLabelIcon from "/components/step/StepLabelIcon";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { House } from "@mui/icons-material";

const HouseInquiry = () => {
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

  const dispatch = useDispatch();
  const router = useRouter();

  const [activeStep, setActiveStep] = React.useState(0);
  const [state, setState] = useState({
    isIdentityTcNo: true,
    isRegisteredUser: false,
    isCheckedNotification: false,
    isAcceptNotification: false,
    isConfirmPhoneOrEmail: false,
    isShowedNotificationModal: false,
    isExistLicensePolicy: false,
    email: undefined,
    phoneNumber: "",
    tcOrTaxIdentityNo: 0,
    birthDate: "",
    error: "",
    token: "",
  });

  const [isVerifySmsSingleCode, setIsVerifySmsSingleCode] = useState(undefined);
  const [isShowVerifySingleCodePopup, setIsShowVerifySingleCodePopup] = useState(false);
  const [houseAddress, setHouseAddress] = useState();
  ///New
  const [isShowNotifyConfirmPopup, setIsShowNotifyConfirmPopup] = useState(false);
  const [notificationConfirmation, setNotificationConfirmation] = useState(undefined);
  //AutoComplete Selected Variables
  const [selectedCity, setSelectedCity] = useState(""); //VKN ile giriş yapıldığında seçilecek İl
  const [selectedDistrict, setSelectedDistrict] = useState(""); //VKN ile giriş yapıldığında seçilecek İlçe

  const [buttonLoader, setButtonLoader] = useState({
    stepOne: false,
    stepTwo: false,
  });

  //kasko store değişkeni
  const isExistPlate = useSelector((state) => state.kasko.isExistPlate);

  useEffect(async () => {
    //Authorization için token çekiyoruz.
    if (state.token == "") {
      await getNewToken().then((res) => setState({ ...state, token: res }));
    }
  }, []);

  useEffect(() => {
    //Token Bilgisi Geldikten Sonra kasko index  getiriyoruz.
    if (state.token != "") {
      getHouseIndexData();
    }
  }, [state.token]);

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
      setActiveStep(activeStep + 1);
    }
  }, [isVerifySmsSingleCode]);

  //http requestler

  //normal fonksiyonlar
  const validateStep = async (data) => {
    const forwardStep = activeStep + 1;
    console.log("Active Step:", forwardStep);
    switch (forwardStep) {
      case 1:
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
      case 2:
        setActiveStep(forwardStep);
        break;
      default:
        //Kod gönderme componentini 3. adım hariç tüm adımlarda kapalı tutuyoruz.(sürekli sms gönderilmemesi için)
        setIsShowVerifySingleCodePopup(false);
    }
  };

  const onChangeHouseAddress = (info) => {
    console.log("info:", info);
    if (info && Object.keys(info).length > 0) {
      setActiveStep(activeStep + 1);
    }
  };

  const onChangeProductionSelection = (info) => {
    console.log("info:", info);
    if (info && Object.keys(info).length > 0) {
      router.push("offers");
    }
  };

  const getHouseIndexData = () => {
    if (JSON.parse(localStorage.getItem("houseIndex"))) {
      const houseIndexData = JSON.parse(localStorage.getItem("houseIndex"));

      //Kasko indexten gelen veriler ile güncelleme yapıyoruz.
      setState({
        ...state,
        tcOrTaxIdentityNo: houseIndexData.tcOrTaxIdentityNo,
        birthDate: houseIndexData.birthDate,
        isIdentityTcNo: houseIndexData.tcOrTaxIdentityNo.toString().length == 11,
      });

      //React hook formda başlangıçta hata vermemesi için
      // setValue("tcOrTaxIdentityNo", houseIndexData.tcOrTaxIdentityNo);
      // setValue("carPlateNo", houseIndexData.carPlateNo);
    }
  };

  const saveInquiryInformations = () => {
    var inquiryInformations = {};

    console.log(inquiryInformations);
    localStorage.setItem("inquiryInformations", JSON.stringify(inquiryInformations));
  };

  const notificationConfirmationCallback = useCallback((isConfirmNotify) => {
    setNotificationConfirmation(isConfirmNotify);
  }, []);

  const singleCodeVerificationCallback = useCallback((isVerify) => {
    setIsVerifySmsSingleCode(isVerify);
  });

  //step components
  const OneStep = () => {
    return (
      <div className="animate__animated  animate__fadeInRight">
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
          className="stepContainer cascoStepContainer"
        >
          <div className={"timeline-inverted "}>
            <div className="timeline-badge">
              <b></b>
            </div>
            <div className="timeline-panel">
              <div className="timeline-heading">
                <h4 className="timeline-title">İletişim Bilgileri</h4>
              </div>
              <div className="timeline-body ">
                <form
                  autoComplete="off"
                  onSubmit={handleSubmit(validateStep)}
                  id="firstStep"
                  key="1"
                >
                  <div className="unregistered-user">
                    <div className="phone-number">
                      <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                        <div className="bg-main text-white input-form-prefix px-2">+90</div>
                        <div className="input-with-prefix">
                          <TextField
                            {...register("cepTelefonNo", {
                              required: "Cep Telefonu Numarası Zorunlu",
                              validate: isValidPhoneNumber,
                              // pattern: {
                              //   value:
                              //     /^(([\+]90?)|([0]?))([ ]?)((\([0-9]{3}\))|([0-9]{3}))([ ]?)([0-9]{3})(\s*[\-]?)([0-9]{2})(\s*[\-]?)([0-9]{2})$/,
                              //   message: "Geçersiz cep telefon numarası",
                              // },
                            })}
                            value={state.phoneNumber}
                            onChange={(e) => {
                              setState({
                                ...state,
                                phoneNumber: e.target.value,
                              });
                              setValue("cepTelefonNo", e.target.value);
                              clearErrors("cepTelefonNo");
                            }}
                            placeholder="(5xx) xxx xx xx"
                            type="tel"
                            InputProps={{
                              inputProps: {
                                className: "phoneNumber",
                              },
                            }}
                            id="phone"
                            sx={inputStyle}
                            size="small"
                            error={errors && Boolean(errors["cepTelefonNo"])}
                            label="Cep Telefonu"
                          />
                        </div>
                      </div>
                      <small className="text-danger">
                        {errors && errors["cepTelefonNo"]?.message}
                        {errors["cepTelefonNo"] &&
                          errors["cepTelefonNo"].type == "validate" &&
                          "Geçersiz Cep Telefon Numarası"}
                      </small>
                    </div>
                    <div className="email mt-4">
                      <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                        <div className="bg-main text-white input-form-prefix">
                          <i className="far fa-envelope"></i>
                        </div>
                        <div className="input-with-prefix">
                          <TextField
                            {...register("emailAddress", {
                              required: "E-mail Adresi Zorunlu",
                              pattern: {
                                value:
                                  /^([\w-]{3,30}(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{1,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
                                message: "Geçersiz Email Adresi",
                              },
                            })}
                            value={state.email}
                            onChange={(e) => {
                              setState({ ...state, email: e.target.value });
                              setValue("emailAddress", e.target.value);
                              clearErrors("emailAddress");
                            }}
                            type="email"
                            id="emailAddress"
                            sx={inputStyle}
                            size="small"
                            error={errors && Boolean(errors["emailAddress"])}
                            label="E-posta adresi"
                          />
                        </div>
                      </div>
                      <small className="text-danger">
                        {errors && errors["emailAddress"]?.message}
                      </small>
                    </div>
                    <div className="news-notification-confirmation mt-2">
                      <div className="form-chec">
                        <Checkbox
                          id="notificationCheckbox"
                          sx={{
                            padding: "0px 8px 0px 0px",
                            "&.Mui-checked": {
                              color: "var(--main-color)",
                            },
                          }}
                          onChange={(e) =>
                            setState({
                              ...state,
                              isCheckedNotification: e.target.checked,
                            })
                          }
                          value={state.isCheckedNotification}
                        />
                        <label htmlFor="notificationCheckbox">
                          İndirimler, Avantajlar, Fiyatlar ve Kampanyalardan haberdar olmak için
                          tıklayınız.
                        </label>
                      </div>
                    </div>
                  </div>

                  <button className="btn-custom btn-timeline-forward w-100 mt-3">İleri</button>
                </form>
              </div>
            </div>
          </div>
        </Box>
      </div>
    );
  };

  const TwoStep = () => {
    return (
      <div className="animate__animated  animate__fadeInRight">
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
          className="stepContainer cascoStepContainer"
        >
          <div className="timeline-heading">
            <h4 className="timeline-title ">Address bilgileri</h4>
          </div>
          <HouseAddress
            identityType={state.isIdentityTcNo ? "TCKN" : "VKN"}
            identityNo={state.tcOrTaxIdentityNo.toString()}
            birthDate={state.birthDate}
            token={state.token}
            onChange={(info) => onChangeHouseAddress(info)}
          />
        </Box>
      </div>
    );
  };

  const ThreeStep = () => {
    return (
      <div className="animate__animated  animate__fadeInRight">
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
          className="stepContainer cascoStepContainer"
        >
          <div className="timeline-panel ">
            <div className="timeline-heading">
              <h4 className="timeline-title">Ürün Seçimi</h4>
            </div>
            <ProductSelection
              identityType={state.isIdentityTcNo ? "TCKN" : "VKN"}
              identityNo={state.tcOrTaxIdentityNo.toString()}
              birthDate={state.birthDate}
              token={state.token}
              onChange={(info) => onChangeProductionSelection(info)}
            />
          </div>
        </Box>
      </div>
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
        {(() => {
          //Token Bilgisi gelene kadar loader Çalışıyor
          if (state.token == "" && state.error == "") {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "300px",
                  marginTop: "20vh",
                }}
              >
                <div style={{ display: "block" }}>
                  <PreLoader></PreLoader>
                </div>
              </div>
            );
          }
          //Token bilgisi gelmedi ise
          else if (state.error != "") {
            return (
              <div
                style={{
                  height: "800px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div style={{ display: "block" }}>
                  <PageMessage
                    message="Üzgünüz Bir Hata Oluştu. Lütfen daha sonra tekrar deneyiniz."
                    messageCode="0"
                  ></PageMessage>
                </div>
              </div>
            );
          } else {
            return (
              <div className="container-md" style={{ marginBottom: "400px" }}>
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
            );
          }
        })()}
      </section>
    </>
  );
};

export default HouseInquiry;
