import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import BaseSelect from "react-select";
import { useRouter } from "next/router";
import axios from "/instances/axios";

//Componentler
import PreLoader from "/components/PreLoader";
import PreFormLoader from "/components/PreFormLoader";
import PageMessage from "/components/PageMessage";
import RequiredSelect from "/components/RequiredSelect";
import VerifySms from "/components/common/VerifySms";
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
  isValidTcKimlikOrVergiKimlik,
} from "/functions/common";

const VehicleInsuranceInquiry = () => {
  const Select = (props) => <RequiredSelect {...props} SelectComponent={BaseSelect} />;
  const cities = useSelector((state) => state.usefull.cities);

  const [state, setState] = useState({
    isExistPlate: true,
    isRegisteredUser: false,
    isCheckedNotification: false,
    isAcceptNotification: false,
    isConfirmPhoneOrEmail: false,
    isShowedNotificationModal: false,
    isVehicleLicenseWithMe: true,
    isExistLicensePolicy: false,
    isExistHandicappedVehicle: false,
    isExistLpgOnVehicle: false,
    isConfirmLicence: false,
    isLoadingVehicleInfo: false,
    vehicleInfoError: false,
    email: null,
    phoneNumber: undefined,
    activeStep: 1,
    tcOrTaxIdentityNo: 0,
    carPlateNo: "",
    birthDate: "",
    carPlateCity: -1,
    carCompanyCode: "",
    carCompanyModelTypeCode: "",
    carModelYear: null,
    carPurchaseDate: "gg-aa-yyyy",
    fuelType: "BENZİNLİ",
    carUsageManner: "01",
    documentSerialNumber: "",
    documentNumber: "",
    carCompaines: [],
    carCompanyModels: [],
    error: "",
    token: "",
  });

  const [data, setData] = useState({ carCompaines: [] });
  const [isVerifySmsSingleCode, setIsVerifySmsSingleCode] = useState(undefined);
  const [isShowVerifySingleCodePopup, setIsShowVerifySingleCodePopup] = useState(false);
  ///New
  const [isShowNotifyConfirmPopup, setIsShowNotifyConfirmPopup] = useState(false);
  const [notificationConfirmation, setNotificationConfirmation] = useState(undefined);
  const [selectedCity, setSelectedCity] = useState();
  const [selectedcarCompaines, setSelectedcarCompaines] = useState();
  const [selectedAracMarkaModeli, setSelectedAracMarkaModeli] = useState();
  const [carInformation, setCarInformation] = useState();

  //kasko store değişkeni
  const isExistPlate = useSelector((state) => state.kasko.isExistPlate);
  const dispatch = useDispatch();

  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

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
      setState({ ...state, activeStep: 3 });
    }
  }, [isVerifySmsSingleCode]);

  useEffect(async () => {
    //Authorization için token çekiyoruz.
    if (state.token == "") {
      const response = await getNewToken();
      setState({ ...state, token: response });
    }
  }, []);

  useEffect(() => {
    //Token Bilgisi Geldikten Sonra kasko index ve araba markalarını getiriyoruz.
    if (state.token != "") {
      getKaskoIndexData();
      getVehicleCompany();
    }
  }, [state.token]);

  const validateStep = (data) => {
    if (errors != {}) {
      const forwardStep = state.activeStep + 1;
      switch (forwardStep) {
        case 2:
          setState({ ...state, activeStep: forwardStep });
          break;
        case 3:
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
        case 4:
          setState({ ...state, activeStep: forwardStep });
          break;
        default:
          //Kod gönderme componentini 3. adım hariç tüm adımlarda kapalı tutuyoruz.(sürekli sms gönderilmemesi için)
          setIsShowVerifySingleCodePopup(false);
      }
    }
  };

  //http requestler
  const getVehicleCompany = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz

    try {
      let bodyData = {};
      await axios
        .post("/api/quote/v1/Traffic/getmakecodes", bodyData, {
          headers: {
            Authorization: state.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            let carCompaines = [];
            res.data.data.map((company, index) => {
              carCompaines.push({ value: company.markaKod, label: company.marka });
            });
            setData({
              ...data,
              carCompaines: carCompaines,
            });
          }
        });
    } catch (error) {
      writeResponseError(error);
    }
  };

  const getVehicleModel = async (value) => {
    //Marka değiştiğinde aracBilgilerini güncelliyoruz.
    setState({ ...state, carCompanyCode: value.value });

    //Seçim yapılan markayı state' kaydediyoruz.
    setSelectedcarCompaines(value);
    //Marka seçildikten sonra model seçimini sıfırlıyoruz.
    setSelectedAracMarkaModeli();

    if (value) {
      let carCompanyCode = value.value;

      let bodyData = { makeCode: carCompanyCode };
      try {
        await axios
          .post("/api/quote/v1/Traffic/getmodelsbymakecode", bodyData, {
            headers: {
              Authorization: state.token,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
          .then((res) => {
            if (res.data.success) {
              let carCompanyModels = [];
              res.data.data.map((model, index) => {
                carCompanyModels.push({
                  value: model.tipKod,
                  label: model.tip,
                  kullanimBicimi: model.tramerAracGrupKod,
                  carCompanyCode: model.markaKod,
                });
              });
              setState({
                ...state,
                carCompanyModels: carCompanyModels,
              });
            }
          });
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
      identityType: state.tcOrTaxIdentityNo.toString().length == 11 ? "TCKN" : "VKN", //Vergi vs
      identityNo: state.tcOrTaxIdentityNo.toString(),
      plateState: carPlateNo.substring(0, 2), //plakanın ilk iki hanesi
      plateNo: carPlateNo.substring(2, carPlateNo.length), //plakanın ilk ikiden sonrası
      registrationSerialCode: state.documentSerialNumber,
      registrationSerialNo: state.documentNumber.toString(),
    };

    try {
      await axios
        .post("/api/quote/v1/Traffic/getcarinfo", bodyData, {
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

  const saveInquiryInformations = () => {
    let carPlateNo = state.carPlateNo.replaceAll(" ", "");

    var inquiryInformations = {};
    //Plakalı araç için Sorgu
    if (carInformation) {
      inquiryInformations = {
        companyCode: 180,
        insured: {
          type: state.tcOrTaxIdentityNo.toString().length == 11 ? "TCKN" : "VKN",
          identityNo: state.tcOrTaxIdentityNo.toString(),
          birthDate:
            state.tcOrTaxIdentityNo.toString().length == 11 ? state.birthDate + "T00:00:00" : null,
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
          plateState: carPlateNo ? carPlateNo.substring(0, 2) : null,
          plateNo: carPlateNo ? carPlateNo.substring(2, carPlateNo.length) : null,
          registrationDate: carInformation.ruhsatTarihi,
          registrationSerialCode: state.documentSerialNumber ? state.documentSerialNumber : null,
          registrationSerialNo: state.documentNumber ? state.documentNumber.toString() : null,
          motorNo: carInformation.motorNo ? carInformation.motorNo : null, //###
          chassisNo: carInformation.sasiNo ? carInformation.sasiNo : null, //###
          modelYear: carInformation.modelYili ? carInformation.modelYili : state.carModelYear, //###
          makeCode: carInformation.aracMarkaKodu
            ? carInformation.aracMarkaKodu
            : state.carCompanyCode, //###
          modelCode: carInformation.aracTipKodu
            ? carInformation.aracTipKodu
            : state.carCompanyModelTypeCode, //###
          fuelType: carInformation.yakitTipi ? carInformation.yakitTipi : null, //###
          countOfPassengers: carInformation.koltukSayisi ? carInformation.koltukSayisi : null, //###
          usageManner: carInformation.kullanimBicim
            ? carInformation.kullanimBicim
            : state.carUsageManner, //###
        },
        prevPolicy: null,
        city: {
          code: selectedCity ? selectedCity.value : 34, //il seçimini yapılırsa gelecek
          districtCode: null,
        },
        addtional: {
          isDisabledVehicle: state.isExistHandicappedVehicle,
          isLpgExist: state.isExistLpgOnVehicle,
          professionDiscount: 0,
        },
        quote: {
          startDate: null,
          endDate: null,
          autoRenewal: true,
          issueDate: null,
          currency: "TL",
        },
      };
    } else {
      //Plakasız Araç için Sorgu
      inquiryInformations = {
        companyCode: 180,
        insured: {
          type: state.tcOrTaxIdentityNo.toString().length == 11 ? "TCKN" : "VKN", //Vergi vs
          identityNo: state.tcOrTaxIdentityNo.toString(),
          birthDate:
            state.tcOrTaxIdentityNo.toString().length == 11 ? state.birthDate + "T00:00:00" : null,
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
          plateState: selectedCity.value,
          plateNo: "",
          registrationDate: state.carPurchaseDate + "T00:00:00", //### ruhsat tarihi
          registrationSerialCode: null,
          registrationSerialNo: null,
          motorNo: "KAL342843", //###
          chassisNo: "WVWYYY6RZHY193560", //###
          modelYear: state.carModelYear, //###
          makeCode: state.carCompanyCode, //###
          modelCode: state.carCompanyModelTypeCode, //###
          fuelType: state.fuelType, //########
          countOfPassengers: 0, //###
          usageManner: state.carUsageManner, //###
        },
        prevPolicy: null,
        city: {
          code: selectedCity.value, //il seçimini yapılırsa gelecek
          districtCode: null,
        },
        addtional: {
          isDisabledVehicle: state.isExistHandicappedVehicle,
          isLpgExist: state.isExistLpgOnVehicle,
          professionDiscount: 0,
        },
        quote: {
          startDate: null,
          endDate: null,
          autoRenewal: true,
          issueDate: null,
          currency: "TL",
        },
      };
    }

    console.log(inquiryInformations);
    localStorage.setItem("inquiryInformations", JSON.stringify(inquiryInformations));
  };

  //normal fonksiyonlar
  const getKaskoOffers = () => {
    try {
      saveInquiryInformations();
      router.push("/insurance/traffic/offers");
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
        birthDate: kaskoIndexData.birthDate,
      });
      dispatch(setIsExistPlate(kaskoIndexData.plakaVarmi));

      //React hook formda başlangıçta hata vermemesi için
      setValue("tcOrTaxIdentityNo", kaskoIndexData.tcOrTaxIdentityNo);
      setValue("carPlateNo", kaskoIndexData.carPlateNo);
    }
  };

  const onChangeAracMarkaModel = (val) => {
    setSelectedAracMarkaModeli(val);

    //Model değiştiğinde araba bilgilerindeki modeli güncelliyoruz.
    setState({
      ...state,
      carCompanyCode: val.carCompanyCode,
      carCompanyModelTypeCode: val.value,
      carUsageManner: val.kullanimBicimi,
    });
  };

  const onChangeModelYili = (e) => {
    setState({ ...state, carModelYear: e.target.value });
  };

  const onConfirmLicence = () => {
    if (state.documentNumber.toString().length == 6 && state.documentSerialNumber.length == 2) {
      getVehicleInfo();
    }

    if (state.documentNumber.toString().length != 6) {
      setError("belgeNo", {
        type: "manual",
        message: "Belge No alanı zorunlu",
      });
    } else {
      clearErrors("belgeNo");
    }

    if (state.documentSerialNumber.toString().length != 2) {
      setError("belgeSeriNo", {
        type: "manual",
        message: "Belge Seri No alanı zorunlu",
      });
    } else {
      clearErrors("belgeSeriNo");
    }
  };

  const notificationConfirmationCallback = useCallback((isConfirmNotify) => {
    setNotificationConfirmation(isConfirmNotify);
  }, []);

  const singleCodeVerificationCallback = useCallback((isVerify) => {
    setIsVerifySmsSingleCode(isVerify);
  });

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

      <section className="timeline_container">
        {(() => {
          //Token Bilgisi gelene kadar loader Çalışıyor
          if (state.token == "" && state.error == "") {
            return (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "500px" }}>
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
              <div className="container" style={{ marginBottom: "400px" }}>
                {/*Marka Kodu: {state.carCompanyCode}, Model Kodu: {state.carCompanyModelTypeCode},
                Kullanım Bicimi: {state.carUsageManner}, Model Yili: {state.carModelYear}, Satın
                Alınma Tarihi: {state.carPurchaseDate}, İl :{" "}
                {selectedCity && selectedCity.value},{state.fuelType}*/}
                <ul className="timeline">
                  {/*Plaka ve Kimlik Bilgisi*/}
                  <li
                    className={
                      "timeline-inverted " + (state.activeStep > 1 ? "timeline-passed" : "")
                    }
                  >
                    <div className="timeline-badge success">
                      <b></b>
                    </div>
                    <div className="timeline-panel">
                      <div className="timeline-heading">
                        <h4 className="timeline-title">Plaka ve Kimlik Bilgisi</h4>
                      </div>
                      <div className="timeline-body animate__animated animate__fadeInUp">
                        {
                          <form onSubmit={handleSubmit(validateStep)} id="firstStep">
                            <div className="radio-plaka d-flex mb-4 mt-3">
                              <div className="w-50">
                                <div className="custom-radio-button">
                                  <input
                                    type="radio"
                                    name="plakavarmi"
                                    id="plakaVar"
                                    value={true}
                                    checked={isExistPlate}
                                    onChange={() => dispatch(setIsExistPlate(true))}
                                  />
                                  <label className="form-check-label" htmlFor="plakaVar">
                                    Aracın plakası var
                                  </label>
                                </div>
                              </div>
                              <div className="w-50">
                                <div className="custom-radio-button">
                                  <input
                                    type="radio"
                                    name="plakavarmi"
                                    id="plakaYok"
                                    value={false}
                                    checked={!isExistPlate}
                                    onChange={() => dispatch(setIsExistPlate(false))}
                                  />
                                  <label className="form-check-label" htmlFor="plakaYok">
                                    Aracın plakası yok
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="tc-kimlik-no mt-2">
                              {/*<label htmlFor="identityNo m-0"></label>*/}
                              T.C. veya Vergi Kimlik No
                              <input
                                type="number"
                                id="identityNo"
                                placeholder=" T.C. veya Vergi Kimlik No"
                                maxLength="11"
                                className={`form-control ${errors.tcOrTaxIdentityNo && "invalid"}`}
                                {...register("tcOrTaxIdentityNo", {
                                  required: "T.C. veya Vergi Kimlik Numarası zorunlu",
                                  validate: isValidTcKimlikOrVergiKimlik,
                                })}
                                value={state.tcOrTaxIdentityNo}
                                onChange={(e) => {
                                  setState({ ...state, tcOrTaxIdentityNo: e.target.value });
                                  clearErrors("tcOrTaxIdentityNo");
                                }}
                              />
                              <small className="text-danger">
                                {errors["tcOrTaxIdentityNo"]?.message}
                                {/**Validate Message */}
                                {errors.tcOrTaxIdentityNo &&
                                errors.tcOrTaxIdentityNo.type == "validate"
                                  ? state.tcOrTaxIdentityNo.toString().length == 10
                                    ? "Geçersiz Vergi Kimlik Numarası"
                                    : "Geçersiz T.C. Kimlik Numarası"
                                  : ""}
                              </small>
                            </div>

                            {(() => {
                              if (isExistPlate) {
                                return (
                                  <div className="plate-no mt-2">
                                    {/*<label htmlFor="inputPlateNo"></label>*/}
                                    Plaka Numarası
                                    <div
                                      className="input-form-with-prefix w-100"
                                      style={{ display: "flex" }}
                                    >
                                      <div className="bg-main text-white input-form-prefix">TR</div>
                                      <div className="input-with-prefix">
                                        <input
                                          name="carPlateNo"
                                          id="inputPlateNo"
                                          type="text"
                                          value={state.carPlateNo}
                                          className={`form-control plate ${
                                            errors.carPlateNo && "invalid"
                                          }`}
                                          {...register("carPlateNo", {
                                            required: "Araç Plaka numarası zorunlu",
                                            pattern: {
                                              value:
                                                /^(0[1-9]|[1-7][0-9]|8[01])((\s?[a-zA-Z]\s?)(\d{4,5})|(\s?[a-zA-Z]{2}\s?)(\d{3,4})|(\s?[a-zA-Z]{3}\s?)(\d{2,3}))$/,
                                              message: "Geçersiz plaka numarası",
                                            },
                                          })}
                                          onChange={(e) =>
                                            setState({
                                              ...state,
                                              carPlateNo: e.target.value.toUpperCase(),
                                            })
                                          }
                                          placeholder="34 SGR 777"
                                        />
                                      </div>
                                    </div>
                                    <small className="text-danger">
                                      {errors["carPlateNo"]?.message}
                                    </small>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="city-of-plate mt-2  animate__animated animate__fadeInUpanimate__bounceOutLeft">
                                    <label htmlFor="cityOfPlate">Aracın Plaka İli</label>

                                    <Select
                                      options={cities}
                                      onChange={setSelectedCity}
                                      value={selectedCity}
                                      isClearable
                                      placeholder="Lütfen il seçiniz..."
                                      required
                                    />
                                    <small className="text-danger">
                                      {errors["carPlateCity"]?.message}
                                    </small>
                                  </div>
                                );
                              }
                            })()}
                            <input
                              type="submit"
                              className="btn-custom btn-timeline-forward w-100 mt-3"
                              value=" İleri"
                            />
                          </form>
                        }
                      </div>
                    </div>
                  </li>

                  {/*Ruhsat sahibi bilgileri*/}
                  {(() => {
                    if (state.activeStep >= 2) {
                      return (
                        <li
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
                            <div className="timeline-body animate__animated animate__fadeInUp  ">
                              <form onSubmit={handleSubmit(validateStep)} id="secondStep">
                                <div className="radio-is-registered-user mb-3">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="radioIsRegisteredUser"
                                      id="radioRegisteredUser"
                                      value={true}
                                      checked={state.isRegisteredUser}
                                      onChange={() =>
                                        setState({ ...state, isRegisteredUser: true })
                                      }
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="radioRegisteredUser"
                                    >
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
                                      onChange={() =>
                                        setState({ ...state, isRegisteredUser: false })
                                      }
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="radioNotRegisteredUser"
                                    >
                                      Yeni Kullanıcı
                                    </label>
                                  </div>
                                </div>

                                {(() => {
                                  if (state.isRegisteredUser) {
                                    return (
                                      <div className="registered-user">
                                        <div className="phone-number">
                                          <strong>Cep Telefonu: </strong>
                                          0532 123 ** **
                                        </div>
                                        <div className="email">
                                          <strong>E-posta adresi: </strong>
                                          ab***@hotmail.com
                                        </div>
                                        <div className="news-notification-confirmation mt-2">
                                          <div className="form-check">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              value={state.isCheckedNotification}
                                              id="flexCheckDefault"
                                              onChange={(e) =>
                                                setState({
                                                  ...state,
                                                  isCheckedNotification: e.target.checked,
                                                })
                                              }
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor="flexCheckDefault"
                                            >
                                              İndirimler, Avantajlar, Fiyatlar ve Kampanyalardan
                                              haberdar olmak için tıklayınız.
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div className="unregistered-user">
                                        <div className="phone-number">
                                          Cep Telefonu
                                          <div
                                            className="input-form-with-prefix w-100"
                                            style={{ display: "flex" }}
                                          >
                                            <div className="bg-main text-white input-form-prefix px-2">
                                              +90
                                            </div>
                                            <div className="input-with-prefix">
                                              <input
                                                type="tel"
                                                id="phone"
                                                className={`form-control ${
                                                  errors.cepTelefonNo && "invalid"
                                                }`}
                                                {...register("cepTelefonNo", {
                                                  required: "Cep telefonu numarası zorunlu",
                                                  pattern: {
                                                    value:
                                                      /^(([\+]90?)|([0]?))([ ]?)((\([0-9]{3}\))|([0-9]{3}))([ ]?)([0-9]{3})(\s*[\-]?)([0-9]{2})(\s*[\-]?)([0-9]{2})$/,
                                                    message: "Geçersiz cep telefon numarası",
                                                  },
                                                })}
                                                value={state.phoneNumber}
                                                onChange={(e) =>
                                                  setState({
                                                    ...state,
                                                    phoneNumber: e.target.value,
                                                  })
                                                }
                                                placeholder="(5xx) xxx xx xx"
                                              />
                                            </div>
                                          </div>
                                          <small className="text-danger">
                                            {errors["cepTelefonNo"]?.message}
                                          </small>
                                        </div>
                                        <div className="email mt-2">
                                          E-posta adresi
                                          <div
                                            className="input-form-with-prefix w-100"
                                            style={{ display: "flex" }}
                                          >
                                            <div className="bg-main text-white input-form-prefix">
                                              <i className="far fa-envelope"></i>
                                            </div>
                                            <div className="input-with-prefix">
                                              <input
                                                type="email"
                                                id="emailAddress"
                                                className={`form-control ${
                                                  errors.emailAddress && "invalid"
                                                }`}
                                                {...register("emailAddress", {
                                                  required: "E-mail adresi zorunlu",
                                                  pattern: {
                                                    value:
                                                      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                                                    message: "Geçersiz email adresi",
                                                  },
                                                })}
                                                value={state.email}
                                                onChange={(e) => {
                                                  setState({ ...state, email: e.target.value });
                                                }}
                                              />
                                            </div>
                                          </div>
                                          <small className="text-danger">
                                            {errors["emailAddress"]?.message}
                                          </small>
                                        </div>
                                        <div className="news-notification-confirmation mt-2">
                                          <div className="form-check">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              id="check-notification-confirmation"
                                              {...register("notification-confirmation", {})}
                                              value={state.isCheckedNotification}
                                              onChange={(e) =>
                                                setState({
                                                  ...state,
                                                  isCheckedNotification: e.target.checked,
                                                })
                                              }
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor="check-notification-confirmation"
                                            >
                                              İndirimler, Avantajlar, Fiyatlar ve Kampanyalardan
                                              haberdar olmak için tıklayınız.
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                })()}
                                <button className="btn-custom btn-timeline-forward w-100 mt-3">
                                  İleri
                                </button>
                              </form>
                            </div>
                          </div>
                        </li>
                      );
                    }
                  })()}

                  {/*Araç ve ruhsat bilgileri*/}
                  {state.activeStep >= 3 && (
                    <li
                      className={
                        "timeline-inverted " +
                        (state.activeStep < 3 ? "timeline-passive" : "") +
                        (state.activeStep > 3 ? "timeline-passed" : "")
                      }
                    >
                      <div className="timeline-badge">
                        <b></b>
                      </div>
                      <div className="timeline-panel">
                        <div className="timeline-heading">
                          <h4 className="timeline-title">Araç ve ruhsat bilgileri</h4>
                        </div>
                        <div className="timeline-body animate__animated animate__fadeInUp">
                          <form onSubmit={handleSubmit(getKaskoOffers)} id="thirdStep">
                            {isExistPlate ? (
                              <div className="vehicle-license-with-me">
                                <div
                                  className="row vehicle-license-with-me-inputs"
                                  style={{ display: "flex" }}
                                >
                                  <div className="col-6">
                                    <label htmlFor="documentSerialNumber">Belge Seri No</label>
                                    <input
                                      id="documentSerialNumber"
                                      type="text"
                                      maxLength="2"
                                      className={`col form-control mr-2 only-letter ${
                                        errors.belgeSeriNo && "invalid"
                                      }`}
                                      {...register("belgeSeriNo", {
                                        required: "Belge Seri No zorunlu",
                                      })}
                                      value={state.documentSerialNumber}
                                      onChange={(e) =>
                                        setState({
                                          ...state,
                                          documentSerialNumber: e.target.value.toUpperCase(),
                                        })
                                      }
                                    />
                                    <small className="text-danger">
                                      {errors["belgeSeriNo"]?.message}
                                    </small>
                                  </div>
                                  <div className="col-6">
                                    <label htmlFor="documentNumber">Belge No</label>
                                    <input
                                      id="documentNumber"
                                      type="number"
                                      maxLength="6"
                                      className={`form-control ${errors.belgeNo && "invalid"}`}
                                      {...register("belgeNo", {
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
                                    />
                                    <small className="text-danger">
                                      {errors["belgeNo"]?.message}
                                    </small>
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
                                    <div style={{ display: "block" }}>
                                      <PreFormLoader />
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    {state.isConfirmLicence &&
                                      carInformation.aracMarkaKodu != null &&
                                      carInformation.aracTipKodu != null && (
                                        <div>
                                          <div
                                            className="alert alert-warning mt-3"
                                            role="alert"
                                            style={{
                                              padding: "1px",
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <p className="ml-2">
                                              Emniyet Genel Müdürlüğü’nde aracınıza ait kayıtlı
                                              bilgiler aşağıdadır. Lütfen kontrol ederek yanlış
                                              olduğunu düşündüğünüz bilgileri düzeltiniz.
                                            </p>
                                          </div>
                                          <div className="vehicle-registered-information">
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
                                                  <td>: {carInformation.aracMarkaKoduAciklama} </td>
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
                                                  <td>: {carInformation.aracTipKoduAciklama} </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                          <input
                                            type="submit"
                                            className="btn-custom btn-timeline-forward w-100 mt-3"
                                            value="Trafik Tekliflerini Getir"
                                          />
                                        </div>
                                      )}

                                    {carInformation != undefined && (
                                      <>
                                        {carInformation.aracMarkaKodu == null && (
                                          <>
                                            {/* Araç bilgileri(isExistPlaate) getirirken hata oluşursa bilgilendirme yapma */}
                                            <div
                                              className="alert alert-danger mt-3"
                                              role="alert"
                                              style={{
                                                padding: "1px",
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <i className="fas fa-exclamation-circle fa-lg mr-2"></i>
                                              Araç bilgileri getirilirken bir hata oluştu lütfen
                                              aşağıdaki bilgileri girerek devam ediniz.
                                            </div>

                                            {/*Araç Model Yılı*/}
                                            {carInformation.modelYili == null && (
                                              <div className="vehicle-model-year mt-2">
                                                <label htmlFor="yearOfVehicleModel">
                                                  Aracın Model Yılı
                                                </label>
                                                <select
                                                  id="yearOfVehicleModel"
                                                  className={`form-control ${
                                                    errors.carModelYear && "invalid"
                                                  }`}
                                                  {...register("carModelYear", {
                                                    required: "Araç Model Yılı alanı zorunlu",
                                                    min: {
                                                      value: "01",
                                                      message: "Araç Model Yılı alanı zorunlu",
                                                    },
                                                  })}
                                                  onChange={(e) => onChangeModelYili(e)}
                                                >
                                                  <option value="-1">
                                                    Araç Model Yılını Seçiniz
                                                  </option>
                                                  {[2021, 2022].map((modelYili, index) => (
                                                    <option value={modelYili} key={index}>
                                                      {modelYili}
                                                    </option>
                                                  ))}
                                                </select>
                                                <small className="text-danger">
                                                  {errors["carModelYear"]?.message}
                                                </small>
                                              </div>
                                            )}

                                            {/*Araç Markaları Combobox*/}
                                            <div className="vehicle-company mt-2">
                                              <label htmlFor="companyOfVehicle">
                                                Aracın Markası
                                              </label>

                                              <Select
                                                options={data.carCompaines}
                                                value={selectedcarCompaines}
                                                onChange={(val) => {
                                                  getVehicleModel(val);
                                                }}
                                                placeholder="Lütfen Araç Markası seçiniz..."
                                                required
                                              />
                                            </div>

                                            {/*Araç Marka Modellleri Combobox*/}
                                            <div className="vehicle-company mt-2">
                                              <label htmlFor="modelOfVehicle">Aracın Modeli</label>
                                              <Select
                                                options={state.carCompanyModels}
                                                value={selectedAracMarkaModeli}
                                                onChange={(val) => onChangeAracMarkaModel(val)}
                                                placeholder="Lütfen Araç Modelini seçiniz..."
                                                required
                                              />
                                            </div>

                                            <input
                                              type="submit"
                                              className="btn-custom btn-timeline-forward w-100 mt-3"
                                              value="Trafik Tekliflerini Getir"
                                            />
                                          </>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            ) : (
                              <div>
                                {/*Aracın Satın Alındığı Tarih*/}
                                <div className="date-the-vehicle-was-purchased">
                                  <div className="form-group mt-2">
                                    <label className="">Aracın satın alındığı tarih</label>
                                    <input
                                      type="date"
                                      className="form-control"
                                      placeholder="gg.aa.yyyy"
                                      min="1990-01-01"
                                      max={getTodayDate()}
                                      value={state.carPurchaseDate}
                                      onChange={(e) =>
                                        setState({
                                          ...state,
                                          carPurchaseDate: e.target.value,
                                        })
                                      }
                                      required
                                    />
                                  </div>
                                </div>

                                {/*Araç Model Yılı*/}
                                <div className="vehicle-model-year mt-2">
                                  <label htmlFor="yearOfVehicleModel">Aracın Model Yılı</label>
                                  <select
                                    id="yearOfVehicleModel"
                                    className={`form-control ${errors.carModelYear && "invalid"}`}
                                    {...register("carModelYear", {
                                      required: "Araç Model Yılı alanı zorunlu",
                                      min: {
                                        value: "01",
                                        message: "Araç Model Yılı alanı zorunlu",
                                      },
                                    })}
                                    value={state.carModelYear}
                                    onChange={(e) =>
                                      setState({
                                        ...state,
                                        carModelYear: e.target.value,
                                      })
                                    }
                                  >
                                    <option value="-1">Araç Model Yılını Seçiniz</option>
                                    {[2021, 2022].map((modelYili, index) => (
                                      <option value={modelYili} key={index}>
                                        {modelYili}
                                      </option>
                                    ))}
                                  </select>
                                  <small className="text-danger">
                                    {errors["carModelYear"]?.message}
                                  </small>
                                </div>

                                {/*Araç Markaları Combobox*/}
                                <div className="vehicle-company mt-2">
                                  <label htmlFor="companyOfVehicle">Aracın Markası</label>

                                  <Select
                                    options={data.carCompaines}
                                    value={selectedcarCompaines}
                                    onChange={(val) => {
                                      getVehicleModel(val);
                                    }}
                                    placeholder="Lütfen Araç Markası seçiniz..."
                                    required
                                  />
                                </div>
                                {/*Araç Marka Modellleri Combobox*/}
                                <div className="vehicle-company mt-2">
                                  <label htmlFor="modelOfVehicle">Aracın Modeli</label>
                                  <Select
                                    options={state.carCompanyModels}
                                    value={selectedAracMarkaModeli}
                                    onChange={(val) => onChangeAracMarkaModel(val)}
                                    placeholder="Lütfen Araç Modelini seçiniz..."
                                    required
                                  />
                                </div>

                                <input
                                  type="submit"
                                  className="btn-custom btn-timeline-forward w-100 mt-3"
                                  value="Trafik Tekliflerini Getir"
                                />
                              </div>
                            )}
                          </form>
                        </div>
                      </div>
                    </li>
                  )}

                  {/*Mevcut ve Geçmiş Poliçe*/}
                  {(() => {
                    if (state.activeStep >= 4 && state.carPlateCity > -1) {
                      return (
                        <li
                          className={
                            "timeline-inverted " +
                            (state.activeStep < 4 ? "timeline-passive" : "") +
                            (state.activeStep > 4 ? "timeline-passed" : "")
                          }
                        >
                          <div className="timeline-badge">
                            <b></b>
                          </div>
                          <div className="timeline-panel ">
                            <div className="timeline-heading">
                              <h4 className="timeline-title">Mevcut ve Geçmiş Poliçe</h4>
                            </div>
                            <div className="timeline-body animate__animated animate__fadeInUp  ">
                              <form onSubmit={handleSubmit(validateStep)} id="fourthStep">
                                <div
                                  className="alert alert-warning mt-3"
                                  role="alert"
                                  style={{
                                    padding: "1px",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <i className="fas fa-exclamation-circle fa-lg mr-2"></i>
                                  Dikkat: Poliçe bilgilerini girmeden devam etmeniz halinde
                                  hasarsızlık indiriminiz varsa bu indirimden yararlanamayacaksınız.
                                </div>
                                <div className="radio-is-exist-licence-policy mb-3">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="radioIsExistLicensePolicy"
                                      id="radioNotExistLicensePolicy"
                                      value={false}
                                      checked={!state.isExistLicensePolicy}
                                      onChange={() =>
                                        setState({ ...state, isExistLicensePolicy: false })
                                      }
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="radioNotExistLicensePolicy"
                                    >
                                      Mevcut ya da yeni kasko poliçem yok / bilgi girmeden devam
                                      edilsin
                                    </label>
                                  </div>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="radioIsExistLicensePolicy"
                                      id="radioExistLicensePolicy"
                                      value={true}
                                      checked={state.isExistLicensePolicy}
                                      onChange={() =>
                                        setState({ ...state, isExistLicensePolicy: true })
                                      }
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="radioExistLicensePolicy"
                                    >
                                      Mevcut ya da yeni kasko poliçem var
                                    </label>
                                  </div>
                                </div>

                                {(() => {
                                  if (state.isExistLicensePolicy) {
                                    return (
                                      <div className="exist-license-policy">
                                        <div className="row">
                                          <div className="col-12 col-md-6 col-lg-6">
                                            <label htmlFor="policyInsuranceCompany">
                                              Poliçe Sigorta Şirketi
                                            </label>
                                            <select
                                              id="policyInsuranceCompany"
                                              className={`form-control ${
                                                errors.policeSigortaSirketi && "invalid"
                                              }`}
                                              {...register("policeSigortaSirketi", {
                                                required: "Poliçe Sigorta Şirketi zorunlu",
                                              })}
                                            >
                                              <option value="1">Zurich</option>
                                              <option value="2">Groupama</option>
                                              <option value="3">AXA</option>
                                              <option value="4">Mapfre</option>
                                            </select>

                                            <small className="text-danger">
                                              {errors["policeSigortaSirketi"]?.message}
                                            </small>
                                          </div>
                                          <div className="col-12 col-md-6 col-lg-6">
                                            <div className="form-group">
                                              <label>Poliçe Bitiş Tarihi</label>
                                              <input
                                                name="email"
                                                id="email"
                                                type="date"
                                                placeholder="gg.aa.yyyy"
                                                min="2022-10-10"
                                                className={`form-control min-date-today ${
                                                  errors.policeBitisTarihi && "invalid"
                                                }`}
                                                {...register("policeBitisTarihi", {
                                                  required: "Poliçe bitiş tarihi zorunlu",
                                                })}
                                              />
                                              <small className="text-danger">
                                                {errors["policeBitisTarihi"]?.message}
                                              </small>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row">
                                          <div className="col-12 col-md-4 col-lg-4">
                                            <label htmlFor="policyNumber">Poliçe No</label>
                                            <input
                                              type="number"
                                              id="policyNumber"
                                              className={`form-control ${
                                                errors.policeNo && "invalid"
                                              }`}
                                              {...register("policeNo", {
                                                required: "Poliçe No zorunlu",
                                              })}
                                            />
                                            <small className="text-danger">
                                              {errors["policeNo"]?.message}
                                            </small>
                                          </div>
                                          <div className="col-12 col-md-4 col-lg-4">
                                            <label htmlFor="policyRefreshNumber">Yenileme No</label>
                                            <input
                                              type="number"
                                              id="policyRefreshNumber"
                                              className={`form-control ${
                                                errors.policeYenilemeNo && "invalid"
                                              }`}
                                              {...register("policeYenilemeNo", {
                                                required: "Poliçe Yenileme No zorunlu",
                                              })}
                                            />
                                            <small className="text-danger">
                                              {errors["policeYenilemeNo"]?.message}
                                            </small>
                                          </div>
                                          <div className="col-12 col-md-4 col-lg-4">
                                            <label htmlFor="acencyPolicyNumber">Acente No</label>
                                            <input
                                              type="number"
                                              id="acencyPolicyNumber"
                                              className={`form-control ${
                                                errors.acenteNo && "invalid"
                                              }`}
                                              {...register("acenteNo", {
                                                required: "Acente No zorunlu",
                                              })}
                                            />
                                            <small className="text-danger">
                                              {errors["acenteNo"]?.message}
                                            </small>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                })()}

                                <div className="alert alert-info mt-3" role="alert" style={{}}>
                                  {/*<i className="fas fa-info-circle  fa-lg mr-2"></i>*/}
                                  <div className="information-policy">
                                    <strong>Mevcut poliçe bilgilerine:</strong>
                                    <ul>
                                      <li>
                                        E-devlet üzerinden
                                        <a
                                          href="https://www.turkiye.gov.tr/sbm-trafik-police-sorgulama"
                                          target="_blank"
                                        >
                                          {" "}
                                          buraya tıklayarak{" "}
                                        </a>
                                        erişebilirsiniz. E-devlet şifrenizi unuttuysanız
                                        <a
                                          href="https://giris.turkiye.gov.tr/Giris/SifremiUnuttum"
                                          target="_blank"
                                        >
                                          {" "}
                                          buraya tıklayarak{" "}
                                        </a>
                                        detaylı bilgi alabilirsiniz.
                                      </li>
                                      <li>
                                        E-devlet şifreniz yoksa bankaların internet şubeleri
                                        aracılığı ile başka bir şifreye ihtiyaç duymadan buraya
                                        tıklayarak e-devlete giriş yapabilirsiniz.
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                <input
                                  type="submit"
                                  className="btn-custom btn-timeline-forward w-100 mt-3"
                                  value=" İleri"
                                />
                              </form>
                            </div>
                          </div>
                        </li>
                      );
                    }
                  })()}
                </ul>
              </div>
            );
          }
        })()}
      </section>
    </>
  );
};

export default VehicleInsuranceInquiry;
