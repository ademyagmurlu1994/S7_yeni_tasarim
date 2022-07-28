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
import LicenceInformation from "/components/casco/LicenceInformation";
import PrevPolicy from "/components/casco/PrevPolicy";

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

const VehicleInsuranceInquiry = () => {
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
    isExistPlate: true,
    isIdentityTcNo: true,
    isRegisteredUser: false,
    isCheckedNotification: false,
    isAcceptNotification: false,
    isConfirmPhoneOrEmail: false,
    isShowedNotificationModal: false,
    isExistLicensePolicy: false,
    email: undefined,
    phoneNumber: "",
    activeStep: 1,
    tcOrTaxIdentityNo: 0,
    carPlateNo: "",
    plateCity: "",
    birthDate: "",
    error: "",
    token: "",
  });

  const [cities, setCities] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [insuredInfo, setInsuredInfo] = useState();
  const [isVerifySmsSingleCode, setIsVerifySmsSingleCode] = useState(undefined);
  const [isShowVerifySingleCodePopup, setIsShowVerifySingleCodePopup] = useState(false);
  const [carInformation, setCarInformation] = useState();
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
      getKaskoIndexData();
    }
  }, [state.token]);

  //Identity No VKN ise getInsuredInfo Methodunu çalıştırıyoruz.
  useEffect(() => {
    if (state.isIdentityTcNo == false) {
      getInsuredInfo();
    }
  }, [state.isIdentityTcNo]);

  //InsuredInfo Bilgisi geldikten sonra getCities Methodunu çalıştırıyoruz.
  useEffect(() => {
    if (state.isIdentityTcNo == false && insuredInfo) {
      getCities();
    }
  }, [insuredInfo]);

  //Cities Bilgisi geldikten sonra setSelectedCity'i güncelliyoruz.
  useEffect(() => {
    if (cities && insuredInfo?.address?.provinceCode) {
      setSelectedCity(
        cities.find((item) => Number(item.kod) === Number(insuredInfo.address.provinceCode)) || ""
      );
    }
  }, [cities]);

  // İl seçildikten sonra ilçeleri getiriyoruz.
  useEffect(() => {
    setTimeout(() => {
      setSelectedDistrict("");
    }, 100);

    if (selectedCity) {
      getDistrictList();
    }
  }, [selectedCity]);

  //District Listesi geldikten sonra setSelectedDistrict'i güncelliyoruz.
  useEffect(() => {
    if (districtList && insuredInfo?.address?.districtCode) {
      setSelectedDistrict(
        districtList.find(
          (item) => Number(item.kod) === Number(insuredInfo.address.districtCode)
        ) || ""
      );
    }
  }, [districtList]);

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

  //http requestler
  const getCities = async () => {
    try {
      await axios
        .get("/api/quote/v1/Dask/getdaskprovincelist", {
          headers: {
            Authorization: state.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            setCities(res.data.data);
          }
        });
    } catch (error) {
      writeResponseError(error);
      toast.error("Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.");
    }
  };

  const getDistrictList = async () => {
    try {
      await axios
        .get("/api/quote/v1/Dask/getdaskdistrictlist", {
          headers: {
            Authorization: state.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: { provinceCode: selectedCity.kod },
        })
        .then((res) => {
          if (res.data.success) {
            setSelectedDistrict(undefined);
            setDistrictList(res.data.data);
            //console.log(res.data.data);
          }
        });
    } catch (error) {
      writeResponseError(error);
      toast.error("Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.");
    }
  };

  const getInsuredInfo = async () => {
    setButtonLoader({ ...buttonLoader, stepOne: true });

    try {
      let bodyData = {
        type: state.isIdentityTcNo ? "TCKN" : "VKN",
        identityNo: state.tcOrTaxIdentityNo?.toString(),
        birthDate: changeDateFormat(state.birthDate, "yyyy-MM-dd") || null,
      };

      let res = await axios.post("/api/quote/v1/casco/getinsuredinfo", bodyData, {
        headers: {
          Authorization: state.token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Insured Info:", res.data.data);

      if (res.data.success) {
        setButtonLoader({ ...buttonLoader, stepOne: false });
        setInsuredInfo(res.data.data);
        return true;
      } else {
        setInsuredInfo({ status: false });
        setButtonLoader({ ...buttonLoader, stepOne: false });
        return false;
      }
    } catch (error) {
      setInsuredInfo({ status: false });
      writeResponseError(error);
      setButtonLoader({ ...buttonLoader, stepOne: false });
      toast.error(
        !error?.response?.data?.message?.content &&
          "Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyiniz."
      );

      setError("birthDate", {
        type: "manual",
        message: error.response?.data?.message?.content,
      });

      //Beklenmedik bir hata oluştuğunda işlemlere devam etmesi için return true dönderiyoruz.
      //if (!error?.response?.data?.message?.content) return true;
    }
  };

  //normal fonksiyonlar
  const onChangeCarInformation = (info) => {
    //console.log("Car Info: ", info);
    setCarInformation(info);
    setActiveStep(3);
  };

  const onChangePrevPolicy = (info) => {
    let carInfo = carInformation;
    carInfo.prevPolicy = info;
    setCarInformation(carInfo);

    saveInquiryInformations();
    router.push("/insurance/casco/offers");
  };

  const getKaskoIndexData = () => {
    if (JSON.parse(localStorage.getItem("kaskoIndex"))) {
      const kaskoIndexData = JSON.parse(localStorage.getItem("kaskoIndex"));

      //Kasko indexten gelen veriler ile güncelleme yapıyoruz.
      setState({
        ...state,
        tcOrTaxIdentityNo: kaskoIndexData.tcOrTaxIdentityNo,
        carPlateNo: kaskoIndexData.carPlateNo,
        plateCity: kaskoIndexData.plateCity,
        isIdentityTcNo: kaskoIndexData.tcOrTaxIdentityNo.toString().length == 11,
      });
      dispatch(setIsExistPlate(kaskoIndexData.plakaVarmi));

      //React hook formda başlangıçta hata vermemesi için
      // setValue("tcOrTaxIdentityNo", kaskoIndexData.tcOrTaxIdentityNo);
      // setValue("carPlateNo", kaskoIndexData.carPlateNo);
    }
  };

  const saveInquiryInformations = () => {
    let carPlateNo = state.carPlateNo.replaceAll(" ", "");

    var inquiryInformations = {};

    //Plakalı araç için Sorgu
    if (isExistPlate) {
      inquiryInformations = {
        companyCode: 180,
        insured: {
          type: state.isIdentityTcNo ? "TCKN" : "VKN",
          identityNo: state.tcOrTaxIdentityNo.toString(),
          birthDate: state.isIdentityTcNo ? changeDateFormat(state.birthDate, "yyyy-MM-dd") : null,
          name: insuredInfo?.insured?.name || null,
          surName: insuredInfo?.insured?.surName || null,
          gender: insuredInfo?.insured?.gender || null,
          contact: {
            email: state.email, //####
            mobilePhone: state.phoneNumber
              .toString()
              .replaceAll(" ", "")
              .replaceAll("(", "")
              .replaceAll(")", ""), // #####
          },
        },
        car: {
          isPlateExist: true,
          plateState: carPlateNo ? Number(carPlateNo.substring(0, 2)) : null,
          plateNo: carPlateNo ? carPlateNo.substring(2, carPlateNo.length) : null,
          registrationDate: carInformation.registrationDate,
          registrationSerialCode: carInformation.registrationSerialCode,
          registrationSerialNo: carInformation.registrationSerialNo,
          motorNo: carInformation.motorNo,
          chassisNo: carInformation.chassisNo, //###
          modelYear: Number(carInformation.modelYear), //###
          makeCode: carInformation.makeCode, //###
          modelCode: carInformation.modelCode, //###
          fuelType: carInformation.fuelType, //########
          countOfPassengers: Number(carInformation.countOfPassengers), //###
          usageManner: Number(carInformation.usageManner),
          usageSubstance: Number(carInformation.usageSubstance), //###
        },
        prevPolicy: carInformation.prevPolicy,
        address: {
          addressDescription: insuredInfo?.address?.addressDescription || null,
          provinceCode: state.isIdentityTcNo
            ? insuredInfo?.address?.provinceCode || null
            : Number(selectedCity.kod),
          provinceDescription: state.isIdentityTcNo
            ? insuredInfo?.address?.provinceDescription || null
            : selectedCity.aciklama,
          districtCode: state.isIdentityTcNo
            ? insuredInfo?.address?.districtCode || null
            : Number(selectedDistrict.kod),
          disrictDescription: state.isIdentityTcNo
            ? insuredInfo?.address?.disrictDescription || null
            : selectedDistrict.aciklama,
        },
        addtional: {
          isDisabledVehicle: false,
          isLpgExist: false,
          professionDiscount: 0,
        },
      };
    } else {
      //Plakasız Araç için Sorgu
      inquiryInformations = {
        companyCode: 180,
        insured: {
          type: state.isIdentityTcNo ? "TCKN" : "VKN", //Vergi vs
          identityNo: state.tcOrTaxIdentityNo.toString(),
          birthDate: state.isIdentityTcNo ? changeDateFormat(state.birthDate, "yyyy-MM-dd") : null,
          name: insuredInfo?.insured?.name || null,
          surName: insuredInfo?.insured?.surName || null,
          gender: insuredInfo?.insured?.gender || null,
          contact: {
            email: state.email, //####
            mobilePhone: state.phoneNumber
              .toString()
              .replaceAll(" ", "")
              .replaceAll("(", "")
              .replaceAll(")", ""), // #####
          },
        },
        car: {
          isPlateExist: false,
          plateState: Number(state.plateCity?.toString()), //Plaka İl bilgisi
          plateNo: "",
          registrationDate: carInformation.registrationDate, //### ruhsat tarihi
          registrationSerialCode: null,
          registrationSerialNo: null,
          motorNo: carInformation.motorNo,
          chassisNo: carInformation.chassisNo,
          modelYear: Number(carInformation.modelYear), //###
          makeCode: carInformation.makeCode, //###
          modelCode: carInformation.modelCode, //###
          fuelType: carInformation.fuelType, //########
          countOfPassengers: Number(carInformation.countOfPassengers), //###
          usageManner: Number(carInformation.usageManner), //###
          usageSubstance: Number(carInformation.usageSubstance), //###
        },
        prevPolicy: carInformation.prevPolicy,
        address: {
          addressDescription: insuredInfo?.address?.addressDescription || null,
          provinceCode: state.isIdentityTcNo
            ? insuredInfo?.address?.provinceCode || null
            : Number(selectedCity.kod),
          provinceDescription: state.isIdentityTcNo
            ? insuredInfo?.address?.provinceDescription || null
            : selectedCity.aciklama,
          districtCode: state.isIdentityTcNo
            ? insuredInfo?.address?.districtCode || null
            : Number(selectedDistrict.kod),
          disrictDescription: state.isIdentityTcNo
            ? insuredInfo?.address?.disrictDescription || null
            : selectedDistrict.aciklama,
        },
        addtional: {
          isDisabledVehicle: false,
          isLpgExist: false,
          professionDiscount: 0,
        },
      };
    }

    console.log(inquiryInformations);
    localStorage.setItem("inquiryInformations", JSON.stringify(inquiryInformations));
  };

  const notificationConfirmationCallback = useCallback((isConfirmNotify) => {
    setNotificationConfirmation(isConfirmNotify);
  }, []);

  const singleCodeVerificationCallback = useCallback((isVerify) => {
    setIsVerifySmsSingleCode(isVerify);
  });

  const validateStep = async (data) => {
    const forwardStep = activeStep + 1;
    console.log("Active Step:", forwardStep);
    switch (forwardStep) {
      case 1:
        if (state.isIdentityTcNo) {
          //doğum tarihi kontrolü yapılacak
          await getInsuredInfo().then((res) => {
            if (res) {
              setActiveStep(forwardStep);
            }
          });
        } else {
          setActiveStep(forwardStep);
        }

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
      case 3:
        setActiveStep(forwardStep);
        break;
      default:
        //Kod gönderme componentini 3. adım hariç tüm adımlarda kapalı tutuyoruz.(sürekli sms gönderilmemesi için)
        setIsShowVerifySingleCodePopup(false);
    }
  };

  //step components

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
        className="animate__animated animate__fadeInRight stepContainer cascoStepContainer"
      >
        {/* <StepArrow top="-10%" left="15px"/> */}
        <div className={"timeline-inverted"}>
          <div className="timeline-badge success">
            <b></b>
          </div>
          <div className="timeline-panel">
            <div className="timeline-heading">
              <h4 className="timeline-title">
                {state.isIdentityTcNo ? "Doğum Tarihi Bilgisi" : "İl ve İlçe Bilgisi"}
              </h4>
            </div>
            <div className="timeline-body">
              <form autoComplete="off" onSubmit={handleSubmit(validateStep)} id="firstStep" key="1">
                {/* T.C. Kimlik Numarası ile giriş yapılmış ise Doğum Tarihi istiyoruz. */}
                {state.isIdentityTcNo ? (
                  <div className="birthdate-input w-100 mt-4">
                    <Controller
                      name={"birthDate"}
                      control={control}
                      rules={{
                        required: "Doğum Tarihi Zorunlu",
                        validate: isValidMaskedDate,
                      }}
                      render={(props) => (
                        <TextField
                          InputLabelProps={{
                            //shrink: true,
                            //required: true,
                            fontSize: "15pt",
                          }}
                          InputProps={{
                            inputProps: {
                              max: getTodayDate(),
                              className: "date-mask",
                            },
                          }}
                          value={state.birthDate}
                          onKeyUp={(e) => {
                            {
                              setState({ ...state, birthDate: e.target.value });
                              clearErrors("birthDate");
                              setValue("birthDate", e.target.value);
                            }
                          }}
                          name="birthDate"
                          id="birthDate"
                          sx={inputStyle}
                          size="small"
                          error={errors && Boolean(errors["birthDate"])}
                          label="Doğum Tarihi"
                          placeholder="gg.aa.yyyy"
                          autoComplete="off"
                          {...props}
                        />
                      )}
                    />

                    <small className="text-danger">
                      {errors && errors["birthDate"]?.message}
                      {/**Validate Message */}
                      {errors && errors.birthDate && errors.birthDate.type == "validate"
                        ? "Doğum Tarihi Alanı Zorunlu"
                        : ""}
                    </small>
                  </div>
                ) : (
                  <>
                    <div className="il-input w-100 mt-4">
                      <Autocomplete
                        value={selectedCity}
                        onChange={(event, newValue) => {
                          setSelectedCity(newValue);
                        }}
                        options={cities}
                        getOptionLabel={(option) => option.aciklama || ""}
                        sx={{ width: "100%" }}
                        size="small"
                        loading={cities.length > 0 ? false : true}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="İl"
                            placeholder="İl Seçiniz"
                            required={true}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {cities.length == 0 ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="ilce-input w-100 mt-4">
                      {selectedCity && (
                        <Autocomplete
                          name="district"
                          value={selectedDistrict}
                          onChange={(event, newValue) => {
                            setSelectedDistrict(newValue);
                          }}
                          options={districtList}
                          getOptionLabel={(option) => option.aciklama || ""}
                          sx={{ width: "100%" }}
                          size="small"
                          loading={districtList.length > 0 ? false : true}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="İlçe"
                              placeholder="İlçe Seçiniz"
                              required={true}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <React.Fragment>
                                    {districtList.length == 0 ? (
                                      <CircularProgress color="inherit" size={20} />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </React.Fragment>
                                ),
                              }}
                            />
                          )}
                        />
                      )}
                    </div>
                  </>
                )}

                <Button
                  className="mt-3"
                  type="submit"
                  disabled={buttonLoader.stepOne}
                  loading={buttonLoader.stepOne}
                  sx={{ width: "100%" }}
                >
                  İleri
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Box>
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
          <div className={"timeline-inverted "}>
            <div className="timeline-badge">
              <b></b>
            </div>
            <div className="timeline-panel">
              <div className="timeline-heading">
                <h4 className="timeline-title">Ruhsat sahibi bilgileri</h4>
              </div>
              <div className="timeline-body ">
                <form
                  autoComplete="off"
                  onSubmit={handleSubmit2(validateStep)}
                  id="secondStep"
                  key="2"
                >
                  <div className="radio-is-register2ed-user mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="radioIsRegisteredUser"
                        id="radioRegisteredUser"
                        value={true}
                        checked={state.isRegisteredUser}
                        onChange={() => setState({ ...state, isRegisteredUser: true })}
                      />
                      <label className="form-check-label" htmlFor="radioRegisteredUser">
                        Kayıtlı Kullanıcı
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="radioIsRegisteredUser"
                        id="radioNotRegisteredUser"
                        value={false}
                        checked={!state.isRegisteredUser}
                        onChange={() => setState({ ...state, isRegisteredUser: false })}
                      />
                      <label className="form-check-label" htmlFor="radioNotRegisteredUser">
                        Yeni Kullanıcı
                      </label>
                    </div>
                  </div>
                  {state.isRegisteredUser ? (
                    <div className="register2ed-user">
                      <div className="phone-number">
                        <strong>Cep Telefonu: </strong>
                        0532 123 ** **
                      </div>
                      <div className="email">
                        <strong>E-posta adresi: </strong>
                        ab***@hotmail.com
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
                  ) : (
                    <div className="unregister2ed-user">
                      <div className="phone-number">
                        <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                          <div className="bg-main text-white input-form-prefix px-2">+90</div>
                          <div className="input-with-prefix">
                            <TextField
                              {...register2("cepTelefonNo", {
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
                                setValue2("cepTelefonNo", e.target.value);
                                clearErrors2("cepTelefonNo");
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
                              error={errors2 && Boolean(errors2["cepTelefonNo"])}
                              label="Cep Telefonu"
                            />
                          </div>
                        </div>
                        <small className="text-danger">
                          {errors2 && errors2["cepTelefonNo"]?.message}
                          {errors2["cepTelefonNo"] &&
                            errors2["cepTelefonNo"].type == "validate" &&
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
                              {...register2("emailAddress", {
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
                                setValue2("emailAddress", e.target.value);
                                clearErrors2("emailAddress");
                              }}
                              type="email"
                              id="emailAddress"
                              sx={inputStyle}
                              size="small"
                              error={errors2 && Boolean(errors2["emailAddress"])}
                              label="E-posta adresi"
                            />
                          </div>
                        </div>
                        <small className="text-danger">
                          {errors2 && errors2["emailAddress"]?.message}
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
                  )}

                  <button className="btn-custom btn-timeline-forward w-100 mt-3">İleri</button>
                </form>
              </div>
            </div>
          </div>
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
          <div className="timeline-heading">
            <h4 className="timeline-title ">Araç ve ruhsat bilgileri</h4>
          </div>
          <LicenceInformation
            insuranceService="casco"
            identityType={state.isIdentityTcNo ? "TCKN" : "VKN"}
            identityNo={state.tcOrTaxIdentityNo.toString()}
            birthDate={state.birthDate}
            email={state.email}
            mobilePhone={state.phoneNumber}
            isExistPlate={isExistPlate}
            plateNo={state.carPlateNo && state.carPlateNo.replaceAll(" ", "")}
            token={state.token}
            onChange={(info) => onChangeCarInformation(info)}
          />
        </Box>
      </div>
    );
  };

  const FourStep = () => {
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
              <h4 className="timeline-title">Mevcut ve Geçmiş Poliçe</h4>
            </div>
            <PrevPolicy
              insuranceService="casco"
              // insurancePrevPolicy={{
              //   policyNo: "0001021038269912",
              //   renewalNo: "0",
              //   agencyNo: "8004",
              //   insCompanyCode: "045",
              //   endDate: "2022-02-18T00:00:00",
              // }}
              // insurancePrevPolicy={{
              //   policyNo: null,
              //   renewalNo: null,
              //   agencyNo: null,
              //   insCompanyCode: null,
              //   endDate: null,
              // }}
              insurancePrevPolicy={carInformation?.prevPolicy || null}
              token={state.token}
              onChange={(info) => onChangePrevPolicy(info)}
            />
          </div>
        </Box>
      </div>
    );
  };

  const steps = [OneStep(), TwoStep(), ThreeStep(), FourStep()];

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

export default VehicleInsuranceInquiry;
