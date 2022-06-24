import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import BaseSelect, { useStateManager } from "react-select";
import { useRouter } from "next/router";
import axios from "/instances/axios";

//Componentler
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import PreLoader from "/components/PreLoader";
import PreFormLoader from "/components/PreFormLoader";
import PageMessage from "/components/PageMessage";
import RequiredSelect from "/components/RequiredSelect";
import NotificationConfirmation from "/components/pop-up/NotificationConfirmation";
import SingleCodeVerification from "/components/pop-up/SingleCodeVerification";

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
import { RestoreTwoTone } from "@mui/icons-material";

//Step Components
import StepLabelIcon from "/components/step/StepLabelIcon";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";

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

  const {
    register: register3,
    handleSubmit: handleSubmit3,
    setValue: setValue3,
    setError: setError3,
    clearErrors: clearErrors3,
    control: control3,
    formState: { errors: errors3 },
  } = useForm();

  const dispatch = useDispatch();
  const router = useRouter();

  const FuelTypes = ["BENZİNLİ - LPG", "DİZEL", "BENZİNLİ"];
  const UsageManners = [
    { title: "Otomobil", code: 1 },
    { title: "Kamyonet", code: 2 },
  ];

  const [activeStep, setActiveStep] = React.useState(0);
  const [state, setState] = useState({
    isExistPlate: true,
    isIdentityTcNo: true,
    isRegisteredUser: false,
    isCheckedNotification: false,
    isAcceptNotification: false,
    isConfirmPhoneOrEmail: false,
    isShowedNotificationModal: false,
    isConfirmLicence: false,
    isLoadingVehicleInfo: false,
    vehicleInfoError: false,
    isActiveSetCarInformation: false,
    isLoadingCarCompanies: false,
    isLoadingCarModels: false,
    email: undefined,
    phoneNumber: "",
    activeStep: 1,
    tcOrTaxIdentityNo: 0,
    carPlateNo: "",
    plateCity: "",
    birthDate: "",
    carCompanyCode: "",
    carCompanyModelTypeCode: "",
    carModelYear: null,
    fuelType: "BENZİNLİ",
    carUsageManner: "01",
    documentSerialNumber: "",
    documentNumber: "",
    error: "",
    token: "",
  });

  const [isActiveSetCarInformation, setIsActiveSetCarInformation] = useState(false);
  const [carCompanies, setCarCompanies] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [carModelYears, setCarModelYears] = useState([]);
  const [cities, setCities] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [isVerifySmsSingleCode, setIsVerifySmsSingleCode] = useState(undefined);
  const [isShowVerifySingleCodePopup, setIsShowVerifySingleCodePopup] = useState(false);
  ///New
  const [isShowNotifyConfirmPopup, setIsShowNotifyConfirmPopup] = useState(false);
  const [notificationConfirmation, setNotificationConfirmation] = useState(undefined);
  //AutoComplete Selected Variables
  const [selectedCity, setSelectedCity] = useState(); //VKN ile giriş yapıldığında seçilecek İl
  const [selectedDistrict, setSelectedDistrict] = useState(null); //VKN ile giriş yapıldığında seçilecek İlçe
  const [selectedPlateCity, setSelectedPlateCity] = useState(null); //Plakanın olmadığı durumlarda seçilecek il
  const [selectedCarCompany, setSelectedCarCompany] = useState(null);
  const [selectedCarCompanyModel, setSelectedCarCompanyModel] = useState(null);
  const [selectedCarModelYear, setSelectedCarModelYear] = useState(null);
  const [selectedFuelType, setSelectedFuelType] = useState(null);
  const [selectedUsageManner, setSelectedUsageManner] = useState(null);
  //
  const [carInformation, setCarInformation] = useState();
  const [registrationDate, setRegistrationDate] = useState();

  //kasko store değişkeni
  const isExistPlate = useSelector((state) => state.kasko.isExistPlate);

  useEffect(() => {
    //Plakanın olmadığı durumda markaları getiriyoruz ve ,
    //Model yılı seçimi son iki yıl olacak şekilde diziye atama yapıyoruz.

    if (isExistPlate) {
      let years = [];
      for (var i = 2022; i >= 1975; i--) {
        years.push(i.toString());
      }
      setCarModelYears(years);
    } else if (isExistPlate == false) {
      setCarModelYears(["2022", "2021"]);
    }
  }, [isExistPlate]);

  useEffect(() => {
    if (activeStep == 2 && !isExistPlate) {
      setSelectedCarCompany(null);
      getVehicleCompany();
    }
  }, [activeStep]);

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

  useEffect(() => {
    //Authorization için token çekiyoruz.
    async function fetchdata() {
      if (state.token == "") {
        const response = await getNewToken();
        setState({ ...state, token: response });
      }
    }
    fetchdata();
  }, []);

  useEffect(() => {
    //Token Bilgisi Geldikten Sonra kasko index ve araba markalarını getiriyoruz.
    if (state.token != "") {
      getKaskoIndexData();
      //getVehicleCompany();
    }
  }, [state.token]);

  //Identity No VKN ise il ilçe bilgisini getiriyoruz.
  useEffect(() => {
    if (state.isIdentityTcNo == false) {
      getCities();
    }
  }, [state.isIdentityTcNo]);

  // İl seçildikten sonra ilçeleri getiriyoruz.
  useEffect(() => {
    setTimeout(() => {
      setSelectedDistrict(null);
    }, 100);

    if (selectedCity) {
      getDistrictList();
    }
  }, [selectedCity]);

  // carInformation bilgisinde eksik bilgi varsa markaları getiriyoruz.
  useEffect(() => {
    if (carInformation && !carInformation.aracMarkaKodu) {
      getVehicleCompany();
      setSelectedCarCompany(null);
    }
  }, [carInformation]);

  //Düzenleye tıkandıktan sonra seçili markayı getiriyoruz.
  useEffect(() => {
    async function fetchdata() {
      if (carCompanies.length >= 1 && carInformation && carInformation.aracMarkaKodu) {
        setTimeout(() => {
          setSelectedCarCompany(
            carCompanies.find(
              (item) => Number(item.markaKod) === Number(carInformation.aracMarkaKodu)
            )
          );
          setSelectedCarModelYear(carInformation.modelYili.toString());
        }, 100);
      }
    }
    fetchdata();
  }, [carCompanies]);

  //Marka seçildikten sonra modelleri getiriyoruz.
  useEffect(() => {
    async function fetchdata() {
      setTimeout(() => {
        setSelectedCarCompanyModel(null);
      }, 100);

      //araç bilgileri gelmiş ise düzenleme aşamasındadır demektir.
      if (selectedCarCompany && selectedCarCompany.markaKod) {
        setCarModels(await getVehicleModel());
      }
    }
    fetchdata();
  }, [selectedCarCompany]);

  //Modeller geldikten sonra selectedModel'i güncelliyoruz.
  useEffect(() => {
    //araç bilgileri gelmiş ise düzenleme aşamasındadır demektir.
    if (carModels.length >= 1 && carInformation && carInformation.aracTipKodu) {
      setSelectedCarCompanyModel(
        carModels.find((item) => Number(item.tipKod) === Number(carInformation.aracTipKodu))
      );
      console.log(selectedCarCompany, selectedCarCompanyModel);
    }
  }, [carModels]);

  //http requestler
  const getCities = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
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
            //
          }
        });
    } catch (error) {
      writeResponseError(error);
    }
  };

  const getDistrictList = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
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
          }
        });
    } catch (error) {
      writeResponseError(error);
    }
  };

  const getVehicleCompany = async () => {
    setState({ ...state, isLoadingCarCompanies: true });
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    setSelectedCarCompany();
    setCarCompanies([]);

    try {
      let bodyData = {};
      await axios
        .post("/api/quote/v1/casco/getmakecodes", bodyData, {
          headers: {
            Authorization: state.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            let CarCompanies = [];
            res.data.data.map((company, index) => {
              company.index = index;
              CarCompanies.push(company);
            });
            setCarCompanies(CarCompanies);
            setState({ ...state, isLoadingCarCompanies: false });
          }
        });
    } catch (error) {
      writeResponseError(error);
    }
  };

  const getVehicleModel = async () => {
    setState({ ...state, isLoadingCarModels: true });

    //Marka seçildikten sonra model seçimini sıfırlıyoruz.
    setSelectedCarCompanyModel();

    if (selectedCarCompany && selectedCarCompany.markaKod) {
      let bodyData = { makeCode: selectedCarCompany.markaKod };
      try {
        let res = await axios.post("/api/quote/v1/casco/getmodelsbymakecode", bodyData, {
          headers: {
            Authorization: state.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        setState({ ...state, isLoadingCarModels: false });
        return res.data.data;
      } catch (error) {
        writeResponseError(error);
      }
    }
  };

  const getVehicleInfo = async () => {
    //Onayla butonuna basıldıktan sonra loader'ı tetiklemek için,
    setState({ ...state, isConfirmLicence: false, isLoadingVehicleInfo: true });

    let carPlateNo = state.carPlateNo.toString().replaceAll(" ", "");
    let bodyData = {
      identityType: state.isIdentityTcNo ? "TCKN" : "VKN", //Vergi vs
      identityNo: state.tcOrTaxIdentityNo.toString(),
      plateState: carPlateNo.substring(0, 2), //plakanın ilk iki hanesi
      plateNo: carPlateNo.substring(2, carPlateNo.length), //plakanın ilk ikiden sonrası
      registrationSerialCode: state.documentSerialNumber,
      registrationSerialNo: state.documentNumber.toString(),
    };

    try {
      await axios
        .post("/api/quote/v1/casco/getcarinfo", bodyData, {
          headers: {
            Authorization: state.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            //Veriler Getirildikten sonra loader'ı durduruyoruz.
            setState({ ...state, isLoadingVehicleInfo: false });
            console.log("Araç Bilgileri: ", res.data.data);
            setCarInformation(res.data.data);
            setState({ ...state, isConfirmLicence: true });
          }
        });
    } catch (error) {
      setState({ ...state, vehicleInfoError: true });
      writeResponseError(error);
    }
  };

  //normal fonksiyonlar
  const getKaskoOffers = () => {
    try {
      saveInquiryInformations();
      router.push("/insurance/casco/offers");
    } catch (error) {
      writeResponseError(error);
    }
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

  const onChangeModelYili = (e) => {
    setState({ ...state, carModelYear: e.target.value });
  };

  const onConfirmLicence = () => {
    if (state.documentNumber.toString().length == 6 && state.documentSerialNumber.length == 2) {
      getVehicleInfo();
    }

    if (state.documentNumber.toString().length != 6) {
      setError3("belgeNo", {
        type: "manual",
        message: "Belge No alanı zorunlu",
      });
    } else {
      clearErrors3("belgeNo");
    }

    if (state.documentSerialNumber.toString().length != 2) {
      setError3("belgeSeriNo", {
        type: "manual",
        message: "Belge Seri No alanı zorunlu",
      });
    } else {
      clearErrors3("belgeSeriNo");
    }
  };

  const onSetCarInformation = async () => {
    await getVehicleCompany();
  };

  const saveInquiryInformations = () => {
    let carPlateNo = state.carPlateNo.replaceAll(" ", "");

    var inquiryInformations = {};

    //Plakalı araç için Sorgu
    if (carInformation) {
      inquiryInformations = {
        companyCode: 180,
        insured: {
          type: state.isIdentityTcNo ? "TCKN" : "VKN",
          identityNo: state.tcOrTaxIdentityNo.toString(),
          birthDate: state.isIdentityTcNo ? changeDateFormat(state.birthDate, "gg-aa-yyyy") : null,
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
          registrationDate:
            carInformation.ruhsatTarihi != "0001-01-01T00:00:00"
              ? carInformation.ruhsatTarihi
              : changeDateFormat(registrationDate, "gg-aa-yyyy"),
          registrationSerialCode: state.documentSerialNumber ? state.documentSerialNumber : null,
          registrationSerialNo: state.documentNumber ? state.documentNumber.toString() : null,
          motorNo: carInformation.motorNo ? carInformation.motorNo : null, //###
          chassisNo: carInformation.sasiNo ? carInformation.sasiNo : null, //###
          modelYear: carInformation.modelYili
            ? carInformation.modelYili.toString()
            : selectedCarModelYear.toString(), //###
          makeCode: carInformation.aracMarkaKodu
            ? carInformation.aracMarkaKodu
            : selectedCarCompany.markaKod, //###
          modelCode: carInformation.aracTipKodu
            ? carInformation.aracTipKodu
            : selectedCarCompanyModel.tipKod, //###
          fuelType: carInformation.yakitTipi ? carInformation.yakitTipi : selectedFuelType, //###
          countOfPassengers: carInformation.koltukSayisi ? carInformation.koltukSayisi : 0, //###
          usageManner: carInformation.kullanimBicim
            ? Number(carInformation.kullanimBicim)
            : Number(selectedUsageManner.code), //###
        },
        prevPolicy: null,
        city: {
          //VKN ile giriş yapıldığında bu alan doldurulacak,
          code: state.isIdentityTcNo ? "34" : selectedCity.kod, //
          districtCode: state.isIdentityTcNo ? null : selectedDistrict.kod,
        },
        addtional: {
          isDisabledVehicle: false,
          isLpgExist: false,
          professionDiscount: 0,
        },
      };

      //Eğer araç düzenleme yapılmışsa
      if (isActiveSetCarInformation) {
        if (selectedCarModelYear) {
          inquiryInformations.car.modelYear = selectedCarModelYear;
        }

        if (selectedCarCompany && selectedCarCompany.markaKod) {
          inquiryInformations.car.makeCode = selectedCarCompany.markaKod;
        }

        if (selectedCarCompanyModel && selectedCarCompanyModel.tipKod) {
          inquiryInformations.car.modelCode = selectedCarCompanyModel.tipKod;
        }
      }
    } else {
      //Plakasız Araç için Sorgu
      inquiryInformations = {
        companyCode: 180,
        insured: {
          type: state.isIdentityTcNo ? "TCKN" : "VKN", //Vergi vs
          identityNo: state.tcOrTaxIdentityNo.toString(),
          birthDate: state.isIdentityTcNo ? changeDateFormat(state.birthDate, "gg-aa-yyyy") : null,
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
          plateState: state.plateCity.toString(), //Plaka İl bilgisi
          plateNo: "",
          registrationDate: changeDateFormat(registrationDate, "gg-aa-yyyy"), //### ruhsat tarihi
          registrationSerialCode: null,
          registrationSerialNo: null,
          motorNo: "", //###
          chassisNo: "", //###
          modelYear: selectedCarModelYear, //###
          makeCode: selectedCarCompany && selectedCarCompany.markaKod, //###
          modelCode: selectedCarCompanyModel && selectedCarCompanyModel.tipKod, //###
          fuelType: state.fuelType, //########
          countOfPassengers: 0, //###
          usageManner: state.carUsageManner, //###
        },
        prevPolicy: null,
        city: {
          //VKN ile giriş yapıldığında bu alan doldurulacak,
          code: state.isIdentityTcNo ? "34" : selectedCity.kod, //
          districtCode: state.isIdentityTcNo ? null : selectedDistrict.kod,
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

  const validateStep = (data) => {
    const forwardStep = activeStep + 1;
    console.log("Active Step:", forwardStep);
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
        className="animate__animated animate__fadeInRight stepContainer"
      >
        {/* <StepArrow top="-10%" left="15px"/> */}
        <div className={"timeline-inverted" + (state.activeStep > 1 ? "timeline-passed" : "")}>
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
              <form onSubmit={handleSubmit(validateStep)} id="firstStep" key="1">
                {/* T.C. Kimlik Numarası ile giriş yapılmış ise Doğum Tarihi istiyoruz. */}
                {state.isIdentityTcNo ? (
                  <div className="birthdate-input w-100 mt-4">
                    <Controller
                      name={"birthDate"}
                      control={control}
                      rules={{
                        required: "Doğum Tarihi zorunlu",
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
                        getOptionLabel={(option) => option.aciklama}
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
                          getOptionLabel={(option) => option.aciklama}
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
                <input
                  type="submit"
                  className="btn-custom btn-timeline-forward w-100 mt-3"
                  value=" İleri"
                />
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
          className="stepContainer"
        >
          <div
            className={
              "timeline-inverted " +
              (state.activeStep < 2 ? "timeline-passive" : "") +
              (state.activeStep > 2 ? "timeline-passed" : "")
            }
          >
            <div className="timeline-badge">
              <b></b>
            </div>
            <div className="timeline-panel">
              <div className="timeline-heading">
                <h4 className="timeline-title">Ruhsat sahibi bilgileri</h4>
              </div>
              <div className="timeline-body ">
                <form onSubmit={handleSubmit2(validateStep)} id="secondStep" key="2">
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
          className="stepContainer"
        >
          <div className="timeline-heading">
            <h4 className="timeline-title ">Araç ve ruhsat bilgileri</h4>
          </div>
          <form onSubmit={handleSubmit3(getKaskoOffers)} id="thirdStep" key="3">
            {isExistPlate && isActiveSetCarInformation == false ? (
              <div className="vehicle-license-with-me">
                <div
                  className="row vehicle-license-with-me-inputs mt-4"
                  style={{ display: "flex" }}
                >
                  <div className="col-6">
                    <TextField
                      {...register3("belgeSeriNo", {
                        required: "Belge Seri No zorunlu",
                      })}
                      value={state.documentSerialNumber}
                      onChange={(e) =>
                        setState({
                          ...state,
                          documentSerialNumber: e.target.value.toUpperCase(),
                        })
                      }
                      inputProps={{ className: "only-letter", maxLength: "2" }}
                      placeholder="Belge Seri No"
                      id="documentSerialNumber"
                      type="text"
                      sx={inputStyle}
                      size="small"
                      error={errors3 && Boolean(errors3["belgeSeriNo"])}
                      label="Belge Seri No"
                    />

                    <small className="text-danger">
                      {errors3 && errors3["belgeSeriNo"]?.message}
                    </small>
                  </div>
                  <div className="col-6">
                    <TextField
                      {...register3("belgeNo", {
                        required: "Belge No zorunlu",
                        minLength: {
                          value: 6,
                          message: "Belge No 6 haneli sayı olmak zorunda",
                        },
                        maxLength: {
                          value: 6,
                          message: "Belge No 6 haneli sayı olmak zorunda",
                        },
                      })}
                      value={state.documentNumber}
                      onChange={(e) =>
                        setState({
                          ...state,
                          documentNumber: e.target.value,
                        })
                      }
                      inputProps={{ maxLength: "6" }}
                      placeholder="Belge No"
                      id="documentNumber"
                      type="number"
                      sx={inputStyle}
                      size="small"
                      error={errors3 && Boolean(errors3["belgeNo"])}
                      label="Belge No"
                    />

                    <small className="text-danger">{errors3 && errors3["belgeNo"]?.message}</small>
                  </div>
                </div>
                <div>
                  <div
                    className="btn-custom btn-timeline-forward w-100 mt-3 text-align-center"
                    onClick={() => onConfirmLicence()}
                  >
                    Onayla
                  </div>
                </div>

                {!state.isConfirmLicence &&
                state.isLoadingVehicleInfo &&
                !state.vehicleInfoError ? (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ display: "block", paddingTop: "80px" }}>
                      <PreFormLoader />
                    </div>
                  </div>
                ) : (
                  <>
                    {state.isConfirmLicence &&
                      carInformation.aracMarkaKodu &&
                      carInformation.aracTipKodu && (
                        <div>
                          <Alert severity="warning" className="mt-4" style={{ fontSize: "11pt" }}>
                            Emniyet Genel Müdürlüğü’nde aracınıza ait kayıtlı bilgiler aşağıdadır.
                            Lütfen kontrol ederek yanlış olduğunu düşündüğünüz bilgileri düzeltiniz.
                          </Alert>

                          <div className="vehicle-register3ed-information">
                            <div
                              className="d-flex justify-content-end w-100"
                              style={{ float: "right" }}
                            >
                              <div className="text-primary">
                                <Button
                                  variant="text"
                                  disableRipple
                                  style={{ textTransform: "none" }}
                                  onClick={() => {
                                    setIsActiveSetCarInformation(true);
                                    onSetCarInformation();
                                  }}
                                >
                                  Düzenle <i className="mdi mdi-lead-pencil"></i>
                                </Button>
                              </div>
                            </div>
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td>
                                    <strong>Kullanım tarzı</strong>
                                  </td>
                                  <td>: {carInformation.kullanimBicimAciklama}</td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Marka</strong>
                                  </td>
                                  <td>
                                    :
                                    {carInformation.aracMarkaKodu +
                                      " - " +
                                      carInformation.aracMarkaKoduAciklama}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Model yılı</strong>
                                  </td>
                                  <td>: {carInformation.modelYili}</td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Model</strong>
                                  </td>
                                  <td>
                                    :
                                    {carInformation.aracTipKodu +
                                      " - " +
                                      carInformation.aracTipKoduAciklama}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <input
                            type="submit"
                            className="btn-custom btn-timeline-forward w-100 mt-3"
                            value="Teklifleri Getir"
                          />
                        </div>
                      )}

                    {carInformation != undefined &&
                      (carInformation.aracMarkaKodu == null ||
                        !carInformation.aracTipKodu ||
                        !carInformation.kullanimBicim ||
                        !carInformation.yakitTipi ||
                        carInformation.ruhsatTarihi == "0001-01-01T00:00:00") && (
                        <>
                          {/* Araç bilgileri(isExistPlaate) getirirken hata oluşursa bilgilendirme yapma */}
                          <Alert className="mt-4" severity="error" style={{ fontSize: "11pt" }}>
                            Araç bilgileri getirilirken bir hata oluştu lütfen aşağıdaki bilgileri
                            girerek devam ediniz.
                          </Alert>

                          {/* {JSON.stringify(registrationDate)}
                        {JSON.stringify(selectedUsageManner)}
                        {JSON.stringify(selectedFuelType)} */}

                          {/*Registarion Date*/}
                          {carInformation.ruhsatTarihi == "0001-01-01T00:00:00" && (
                            <div className="registration-input w-100 mt-4">
                              <TextField
                                {...register3("registrationDate", {
                                  required: "Ruhsat Tarihi zorunlu",
                                  validate: isValidMaskedDate,
                                })}
                                id="registrationDate"
                                InputLabelProps={{
                                  shrink: true,
                                  //required: true,
                                  fontSize: "15pt",
                                }}
                                InputProps={{
                                  inputProps: {
                                    min: "1990-01-01",
                                    max: getTodayDate(),
                                    className: "date-mask",
                                  },
                                }}
                                value={registrationDate}
                                onKeyUp={(e) => {
                                  {
                                    setRegistrationDate(e.target.value);
                                    clearErrors3("registrationDate");
                                    setValue3("registrationDate", e.target.value);
                                    document.getElementById("registrationDate").value =
                                      e.target.value;
                                  }
                                }}
                                sx={inputStyle}
                                size="small"
                                error={errors3 && Boolean(errors3["registrationDate"])}
                                label="Ruhsat Tarihi *"
                                placeholder="gg.aa.yyyy"
                                autoComplete="off"
                              />

                              <small className="text-danger">
                                {errors3 && errors3["registrationDate"]?.message}
                                {/**Validate Message */}
                                {errors3 &&
                                errors3.registrationDate &&
                                errors3.registrationDate.type == "validate"
                                  ? "Geçersiz Ruhsat Tarihi"
                                  : ""}
                              </small>
                            </div>
                          )}

                          {/*Araç Model Yılı*/}
                          {carInformation.modelYili == null && (
                            <div className="vehicle-model-year mt-4">
                              <Autocomplete
                                value={selectedCarModelYear}
                                onChange={(event, newValue) => {
                                  setSelectedCarModelYear(newValue);
                                }}
                                options={carModelYears}
                                sx={{ width: "100%" }}
                                size="small"
                                loading={carModelYears && carModelYears.length > 0 ? false : true}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Aracın Model Yılı"
                                    placeholder="Aracın Model Yılını seçiniz"
                                    required={true}
                                    InputProps={{
                                      ...params.InputProps,
                                      endAdornment: (
                                        <React.Fragment>
                                          {carModelYears.length == 0 ? (
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
                          )}

                          {/*Araç Markaları Combobox*/}
                          <div className="vehicle-company mt-4">
                            <Autocomplete
                              value={selectedCarCompany}
                              onChange={(event, newValue) => {
                                setSelectedCarCompany(newValue);
                              }}
                              options={carCompanies}
                              getOptionLabel={(option) => option.markaKod + " - " + option.marka}
                              sx={{ width: "100%" }}
                              size="small"
                              loading={state.isLoadingCarCompanies}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Araç Markası"
                                  placeholder="Araç Markası seçiniz"
                                  required={true}
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <React.Fragment>
                                        {state.isLoadingCarCompanies ? (
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

                          {/*Araç Marka Modellleri Combobox*/}
                          <div className="vehicle-company mt-4">
                            <Autocomplete
                              value={selectedCarCompanyModel}
                              onChange={(event, newValue) => {
                                setSelectedCarCompanyModel(newValue);
                              }}
                              options={carModels}
                              getOptionLabel={(option) => option.tipKod + " - " + option.tip}
                              sx={{ width: "100%" }}
                              size="small"
                              loading={state.isLoadingCarModels}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Aracın Modeli"
                                  placeholder="Aracın Modeli seçiniz"
                                  required={true}
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <React.Fragment>
                                        {state.isLoadingCarModels ? (
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

                          {/*Yakıt Tipi*/}
                          {!carInformation.yakitTipi && (
                            <div className="fuel-type mt-4">
                              <Autocomplete
                                value={selectedFuelType}
                                onChange={(event, newValue) => {
                                  setSelectedFuelType(newValue);
                                }}
                                options={FuelTypes}
                                sx={{ width: "100%" }}
                                size="small"
                                //loading={carModelYears && carModelYears.length > 0 ? false : true}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Yakıt Tipi"
                                    placeholder="Yakıt Tipi seçiniz"
                                    required={true}
                                    InputProps={{
                                      ...params.InputProps,
                                      endAdornment: (
                                        <React.Fragment>
                                          {carModelYears.length == 0 ? (
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
                          )}

                          {/*Kullanım Tarzı*/}
                          {!carInformation.kullanimBicim && (
                            <div className="usage-manner mt-4">
                              <Autocomplete
                                value={selectedUsageManner}
                                onChange={(event, newValue) => {
                                  setSelectedUsageManner(newValue);
                                }}
                                options={UsageManners}
                                getOptionLabel={(option) => option.title}
                                sx={{ width: "100%" }}
                                size="small"
                                //loading={carModelYears && carModelYears.length > 0 ? false : true}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Kullanım Tarzı"
                                    placeholder="Kullanım Tarzı seçiniz"
                                    required={true}
                                    InputProps={{
                                      ...params.InputProps,
                                      endAdornment: (
                                        <React.Fragment>
                                          {carModelYears.length == 0 ? (
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
                          )}

                          <input
                            type="submit"
                            className="btn-custom btn-timeline-forward w-100 mt-3"
                            value="Teklifleri Getir"
                          />
                        </>
                      )}
                  </>
                )}
              </div>
            ) : (
              <div>
                {/*Aracın Satın Alındığı Tarih*/}
                {/* {JSON.stringify(selectedCarCompany)}
                                  {JSON.stringify(selectedCarCompanyModel)} */}
                {!isExistPlate && (
                  <div className="date-the-vehicle-was-purchased mt-4">
                    <TextField
                      {...register3("purchasedDate", {
                        required: "Aracın Satın Alındığı Tarih zorunlu",
                        validate: isValidMaskedDate,
                      })}
                      InputLabelProps={{
                        //shrink: true,
                        //required: true,
                        fontSize: "15pt",
                      }}
                      InputProps={{
                        inputProps: {
                          min: "1990-01-01",
                          max: getTodayDate(),
                          className: "date-mask",
                        },
                      }}
                      value={registrationDate}
                      onKeyUp={(e) => {
                        {
                          setRegistrationDate(e.target.value);
                          clearErrors3("purchasedDate");
                          setValue3("purchasedDate", e.target.value);
                        }
                      }}
                      sx={inputStyle}
                      size="small"
                      error={errors3 && Boolean(errors3["purchasedDate"])}
                      label="Aracın Satın Alındığı Tarih"
                      placeholder="gg.aa.yyyy"
                      autoComplete="off"
                    />
                    <small className="text-danger">
                      {errors3 && errors3["purchasedDate"]?.message}
                      {/**Validate Message */}
                      {errors3 && errors3.purchasedDate && errors3.purchasedDate.type == "validate"
                        ? "Aracın Satın Alındığı Tarih zorunlu"
                        : ""}
                    </small>
                  </div>
                )}
                {/*Araç Model Yılı*/}
                <div className="vehicle-model-year mt-4">
                  <Autocomplete
                    value={selectedCarModelYear}
                    onChange={(event, newValue) => {
                      setSelectedCarModelYear(newValue);
                    }}
                    options={carModelYears}
                    sx={{ width: "100%" }}
                    size="small"
                    loading={carModelYears && carModelYears.length > 0 ? false : true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Aracın Model Yılı"
                        placeholder="Aracın Model Yılını seçiniz"
                        required={true}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {carModelYears.length == 0 ? (
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
                {/*Araç Markaları Combobox*/}
                <div className="vehicle-company mt-4">
                  <Autocomplete
                    value={selectedCarCompany}
                    onChange={(event, newValue) => {
                      setCarModels([]);
                      setSelectedCarCompany(newValue);
                    }}
                    options={carCompanies}
                    getOptionLabel={(option) => option.marka}
                    sx={{ width: "100%" }}
                    size="small"
                    loading={state.isLoadingCarCompanies}
                    disabled={carModelYears && carModelYears.length == 0}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Araç Markası"
                        placeholder="Araç Markası seçiniz"
                        required={true}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {state.isLoadingCarCompanies ? (
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
                {/*Araç Marka Modellleri Combobox*/}
                <div className="vehicle-model mt-4">
                  <Autocomplete
                    value={selectedCarCompanyModel}
                    onChange={(event, newValue) => {
                      setSelectedCarCompanyModel(newValue);
                    }}
                    options={carModels}
                    getOptionLabel={(option) => option.tip}
                    sx={{ width: "100%" }}
                    size="small"
                    loading={state.isLoadingCarModels}
                    disabled={carModels && carModels.length == 0}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Aracın Modeli"
                        placeholder="Aracın Modeli seçiniz"
                        required={true}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {state.isLoadingCarModels ? (
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
                <input
                  type="submit"
                  className="btn-custom btn-timeline-forward w-100 mt-3"
                  value="Teklifleri Getir"
                />
              </div>
            )}
            {/* Errors: {errors3 && JSON.stringify(errors3)} */}
          </form>
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

export default VehicleInsuranceInquiry;
