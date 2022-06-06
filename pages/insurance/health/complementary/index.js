import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

//Componentler
import PreLoader from "/components/PreLoader";
import BaseSelect from "react-select";
import RequiredSelect from "/components/RequiredSelect";
import VerifySms from "/components/common/VerifySms";
import ComplementaryFAQ from "/components/faq/ComplementaryFAQ";
import NotificationConfirmation from "/components/pop-up/NotificationConfirmation";
import SingleCodeVerification from "/components/pop-up/SingleCodeVerification";
import PagePreLoader from "/components/common/PagePreLoader";
import InsuranceIndexPageInformation from "/components/common/InsuranceIndexPageInformation";
import WhatIsTheXInsurance from "/components/common/WhatIsTheXInsurance";

//Fonksiyonlar
import {
  isValidTcKimlik,
  getNewToken,
  getTodayDate,
  writeResponseError,
  addDaysToDate,
} from "/functions/common";

//images
import { DaskInsuranceInformationPhoto, WhatIsTheDaskInsurance } from "/resources/images";

//Styles
//import { reactSelectStyles } from "functions/styles";

const ComplementaryHealthInsurance = (props) => {
  const [state, setState] = useState({
    activeStep: 1,
    phoneNumber: undefined,
    isCheckedNotification: false,
    isAcceptNotification: false,
    isConfirmPhoneOrEmail: false,
    isShowedNotificationModal: false,
    relationList: [
      { value: 0, label: "Kendisi" },
      { value: 1, label: "Eşi" },
      { value: 2, label: "Çocuğu" },
      { value: 3, label: "Tesisatçı" },
    ],
    selectedUsersRelation: [{ value: "0", label: "Kendisi" }],

    professionList: [
      { value: 0, label: "Memur" },
      { value: 1, label: "Bilgisayar Mühendisi" },
      { value: 2, label: "Yazılım Mühendisi" },
      { value: 3, label: "Tesisatçı" },
    ],
    selectedUsersProfession: [],
    userListForHealthInsurance: [
      {
        identityNo: undefined,
        birthDate: "",
        relation: 0,
        profession: -1,
      },
    ], //Sağlık siğortası alınacak kişi listesi
    name: "",
    token: "",
  });
  const [token, setToken] = useState("");

  const [isVerifySmsSingleCode, setIsVerifySmsSingleCode] = useState(undefined);
  const [isShowVerifySingleCodePopup, setIsShowVerifySingleCodePopup] = useState(false);
  ///New
  const [isShowNotifyConfirmPopup, setIsShowNotifyConfirmPopup] = useState(false);
  const [notificationConfirmation, setNotificationConfirmation] = useState(undefined);

  useEffect(async () => {
    //Authorization için token çekiyoruz.
    if (!Boolean(token)) {
      await getNewToken().then((res) => setToken(res));
    }
  }, []);

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
      saveInquiryInformations();
      router.push("/insurance/health/complementary/offers");
    }
  }, [isVerifySmsSingleCode]);

  const Select = (props) => <RequiredSelect {...props} SelectComponent={BaseSelect} />;

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    resetField,
    formState: { errors },
  } = useForm();

  const router = useRouter();

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
        default:
          //Kod gönderme componentini 3. adım hariç tüm adımlarda kapalı tutuyoruz.(sürekli sms gönderilmemesi için)
          setIsShowVerifySingleCodePopup(false);
      }
    }
  };

  const saveInquiryInformations = () => {
    let ownInfo = {};
    let familyMembersInfo = [];

    for (var i = 0; i < state.userListForHealthInsurance.length; i++) {
      let birthDateParts = state.userListForHealthInsurance[i].birthDate.split(".");
      let birthDate = birthDateParts[2] + "-" + birthDateParts[1] + "-" + birthDateParts[0];
      if (i == 0) {
        ownInfo.identityNo = state.userListForHealthInsurance[i].identityNo.toString();
        ownInfo.birthDate = birthDate + "T11:27:55.042Z";
        ownInfo.relation = 0;
        ownInfo.profession = state.userListForHealthInsurance[i].profession.toString();
      } else {
        let singleMember = {
          identityNo: state.userListForHealthInsurance[i].identityNo.toString(),
          birthDate: birthDate + "T11:27:55.042Z",
          relation: state.userListForHealthInsurance[i].relation,
          profession: state.userListForHealthInsurance[i].profession.toString(),
        };
        familyMembersInfo.push(singleMember);
      }
    }

    let inquiryInformations = {
      companyCode: 0,
      insured: {
        info: ownInfo,
        contact: {
          email: state.email,
          mobilePhone: state.phoneNumber
            .toString()
            .replaceAll(" ", "")
            .replaceAll("(", "")
            .replaceAll(")", ""),
        },
      },
      familyMembers: familyMembersInfo,
    };

    console.log(inquiryInformations);
    localStorage.setItem("complementaryInquiryInformations", JSON.stringify(inquiryInformations));
  };

  const isExistTcKimlikNoInUserList = (identityNo) => {
    for (var i = 0; i < state.userListForHealthInsurance.length; i++) {
      if (state.userListForHealthInsurance[i].identityNo == identityNo) {
        return true;
      }
    }
    return false;
  };

  const onChangeTcKimlikNumarasi = (e, index) => {
    clearErrors();

    let { userListForHealthInsurance } = state;
    userListForHealthInsurance[index].identityNo = e.target.value;
    setState({ ...state, userListForHealthInsurance: userListForHealthInsurance });
  };

  const onChangeDogumTarihi = (e, index) => {
    if (e.target.value.replaceAll("_", "").replaceAll(".", "").length == 8) {
      clearErrors();
      let { userListForHealthInsurance } = state;
      userListForHealthInsurance[index].birthDate = e.target.value;
      setState({ ...state, userListForHealthInsurance: userListForHealthInsurance });
    }
  };

  const onChangeYakinlikDerecesi = (e, index) => {
    clearErrors();

    //Select User Relation
    let { selectedUsersRelation } = state;
    selectedUsersRelation[index] = e;
    setState({ ...state, selectedUsersRelation: selectedUsersRelation });

    //Update UserList
    let { userListForHealthInsurance } = state;
    userListForHealthInsurance[index].relation = e.value;
    setState({ ...state, userListForHealthInsurance: userListForHealthInsurance });
  };

  const onChangeMeslek = (e, index) => {
    console.log(e);
    clearErrors();
    //Select User Proffession
    let { selectedUsersProfession } = state;
    selectedUsersProfession[index] = e;
    setState({ ...state, selectedUsersProfession: selectedUsersProfession });

    //UserList Update
    let { userListForHealthInsurance } = state;
    userListForHealthInsurance[index].profession = e.value;
    setState({ ...state, userListForHealthInsurance: userListForHealthInsurance });
  };

  const checkUserFormElements = () => {
    let { userListForHealthInsurance } = state;
    const lastUserIndex = userListForHealthInsurance.length - 1;
    const lastUser = userListForHealthInsurance[lastUserIndex];

    console.log("User List: ", userListForHealthInsurance);
    console.log("Hatalar: ", errors);

    /*if (isExistTcKimlikNoInUserList(lastUser.identityNo)) {
      setError("identityNo_" + lastUserIndex, {
        type: "manual",
        message: "T.C. Kimlik Numarası Kullanılmış",
      });
    }*/

    if (lastUser.birthDate == "") {
      setError("birthDate" + lastUserIndex, {
        type: "manual",
        message: "Dogum Tarihi Zorunlu",
      });
    }

    if (lastUser.relation == -1) {
      setError("relation" + lastUserIndex, {
        type: "manual",
        message: "Yakınlık Derecesi Zorunlu",
      });
    }

    if (lastUser.identityNo == null) {
      setError("identityNo" + lastUserIndex, {
        type: "manual",
        message: "T.C. Kimlik Numarası Zorunlu",
      });
      return false;
    } else if (!isValidTcKimlik(lastUser.identityNo.toString())) {
      setError("identityNo" + lastUserIndex, {
        type: "manual",
        message: "T.C. Kimlik Numarası Geçersiz",
      });

      return false;
    } else if (!Object.keys(errors).length) {
      return true;
    }
  };

  const onAddUserForHealthInsurance = () => {
    if (checkUserFormElements()) {
      let { userListForHealthInsurance } = state;

      userListForHealthInsurance.push({
        identityNo: undefined,
        relation: -1,
        profession: -1,
        birthDate: "",
      });
      setState({ ...state, userListForHealthInsurance: userListForHealthInsurance });
    }
  };

  const onRemoveUserForHealthInsurance = (index) => {
    let { userListForHealthInsurance } = state;
    userListForHealthInsurance.splice(index, 1);
    setState({ ...state, userListForHealthInsurance: userListForHealthInsurance });
    resetField("identityNo" + index);
    resetField("birthDate" + index);
    resetField("relation" + index);
    resetField("profession" + index);
    clearErrors();
  };

  const onChangeNotificationCheckBox = () => {
    if (state.isCheckedNotification) {
      setState({ ...state, isCheckedNotification: false });
    } else {
      setState({ ...state, isCheckedNotification: true });
    }
  };

  const onAcceptNotification = () => {
    setState({ ...state, isAcceptNotification: true });
    setIsShowVerifySingleCode(true);
    $("#notificationModal").modal("hide");
    setTimeout(() => {
      if (state.isConfirmPhoneOrEmail == false) {
        $("#verificationSingleCode").modal("show");
        setState({ ...state, isConfirmPhoneOrEmail: true });
      }
    }, 500);
  };

  const onVerifySingleCode = () => {
    setIsShowVerifySingleCode(true);
    $("#notificationModal").modal("hide");
    setTimeout(() => {
      if (state.isConfirmPhoneOrEmail == false) {
        $("#verificationSingleCode").modal("show");
        setState({ ...state, isConfirmPhoneOrEmail: true });
      }
    }, 500);
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

      {/* */}
      {!Boolean(token) ? (
        <>
          <PagePreLoader />
        </>
      ) : (
        <section className="timeline_container">
          <div>
            <div className="container">
              <div className="row page-header">
                <div className="col text-center">
                  <h3>Kendinizi ve Ailenizi Sağlık Sigortası ile Korumaya Alın. </h3>
                </div>
              </div>
              <ul className="timeline timeline-complementary-health-insurance">
                {/*Kimlik, Dogum Tarihi, Yakınlık ve Meslek Bilgisi*/}
                <li
                  className={"timeline-inverted " + (state.activeStep > 1 ? "timeline-passed" : "")}
                >
                  <div className="timeline-badge success">
                    <b>1</b>
                  </div>
                  <div className="timeline-panel">
                    <div className="timeline-heading">
                      <h4 className="timeline-title">Temel Bilgiler</h4>
                    </div>
                    <div className="timeline-body animate__animated animate__fadeInUp  ">
                      {(() => {
                        if (state.activeStep == 1) {
                          return (
                            <form onSubmit={handleSubmit(validateStep)} id="firstStep">
                              {state.userListForHealthInsurance.map((user, index) => (
                                <div
                                  className="user-list-for-health-insurance-wrapper mt-2  py-1"
                                  key={index}
                                >
                                  <div className="row">
                                    <div className="col-12 col-md-6 col-lg-3 mt-2 tc-kimlik-no">
                                      <label className="">T.C. Kimlik Numarası</label>
                                      <input
                                        type="number"
                                        id={"tcInput" + index}
                                        maxLength="11"
                                        placeholder="T.C. Kimlik Numarası"
                                        className={`form-control ${
                                          errors["identityNo" + index] && "invalid"
                                        }`}
                                        {...register("identityNo" + index, {
                                          required: "T.C. Kimlik Numarası zorunlu",
                                          validate: isValidTcKimlik,
                                        })}
                                        onChange={(e) => onChangeTcKimlikNumarasi(e, index)}
                                        value={user.identityNo}
                                      />
                                      <small className="text-danger">
                                        {errors["identityNo" + index]?.message}
                                        {/**Validate Message */}
                                        {errors["identityNo" + index]
                                          ? errors["identityNo" + index].type == "validate"
                                            ? "Geçersiz T.C. Kimlik Numarası"
                                            : ""
                                          : ""}
                                      </small>
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-3 mt-2 dogum-tarihi">
                                      <label className="">Doğum Tarihi</label>
                                      <input
                                        type="text"
                                        id="birthDate"
                                        className={`form-control date-mask ${
                                          errors["birthDate" + index] && "invalid"
                                        }`}
                                        placeholder="Doğum Tarihi"
                                        {...register("birthDate" + index, {
                                          required: "Doğum Tarihi zorunlu",
                                        })}
                                        onKeyUp={(e) => onChangeDogumTarihi(e, index)}
                                        value={user.birthDate}
                                        max={getTodayDate()}
                                        required
                                      />

                                      <small className="text-danger">
                                        {errors["birthDate" + index]?.message}
                                      </small>
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-3 mt-2 select-yakinlik-derecesi">
                                      <label className="">Yakınlık Derecesi</label>
                                      <Select
                                        id="yakinlikDerecesi"
                                        className={` ${errors["relation" + index] && "invalid"} ${
                                          index == 0 && "passive"
                                        } `}
                                        options={state.relationList}
                                        value={state.selectedUsersRelation[index]}
                                        onChange={(e) => {
                                          onChangeYakinlikDerecesi(e, index);
                                        }}
                                        placeholder="Yakınlık Derecesi"
                                        required
                                        deneme={` ${errors["relation" + index] && "invalid"} ${
                                          index == 0 && "passive"
                                        } `}
                                      />
                                      <small className="text-danger">
                                        {errors["relation" + index]?.message}
                                      </small>
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-3 mt-2 select-meslek">
                                      <label className="">Meslek</label>
                                      <Select
                                        options={state.professionList}
                                        value={state.selectedUsersProfession[index]}
                                        onChange={(e) => {
                                          onChangeMeslek(e, index);
                                        }}
                                        placeholder="Meslek Seçiniz"
                                      />
                                    </div>
                                  </div>
                                  {(() => {
                                    if (state.userListForHealthInsurance.length > 1 && index != 0) {
                                      return (
                                        <div className="row remove-person mt-2">
                                          <div className="col">
                                            <a
                                              href="#"
                                              onClick={() => onRemoveUserForHealthInsurance(index)}
                                            >
                                              <i
                                                className="far fa-trash-alt"
                                                style={{ color: "red" }}
                                              ></i>{" "}
                                              Kişiyi Çıkar
                                            </a>
                                          </div>
                                        </div>
                                      );
                                    }
                                  })()}
                                  <hr />
                                </div>
                              ))}
                              <div className="row add-new-person mt-2">
                                <div className="col">
                                  <a href="#" onClick={() => onAddUserForHealthInsurance()}>
                                    <i className="fas fa-plus fa-lg"></i> Kişi Ekle
                                  </a>
                                </div>
                              </div>
                              <div className="row forward-button">
                                <div className="col-12 col-md-6 col-lg-6">
                                  <input
                                    type="submit"
                                    className="btn-custom btn-timeline-forward w-100 mt-3"
                                    value="İleri"
                                  />
                                </div>
                              </div>
                            </form>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </li>
                {/*İletişim bilgileri*/}
                {state.activeStep >= 2 && (
                  <li
                    className={
                      "timeline-inverted " +
                      (state.activeStep < 2 ? "timeline-passive" : "") +
                      (state.activeStep > 2 ? "timeline-passed" : "")
                    }
                  >
                    <div className="timeline-badge">
                      <b className="glyphicon glyphicon-credit-card">2</b>
                    </div>
                    <div className="timeline-panel">
                      <div className="timeline-heading">
                        <h4 className="timeline-title">İletişim Bilgileri</h4>
                      </div>

                      <div className="timeline-body animate__animated animate__fadeInUp  ">
                        {(() => {
                          if (state.activeStep == 2) {
                            return (
                              <form onSubmit={handleSubmit(validateStep)} id="secondStep">
                                <div className="unregistered-user">
                                  <div className="row phone-number">
                                    <div className="col-12 col-md-6 col-lg-6">
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
                                            className={`form-control mr-2 ${
                                              errors.cep_telefon_no && "invalid"
                                            }`}
                                            {...register("cep_telefon_no", {
                                              required: "Cep telefonu numarası zorunlu",
                                              pattern: {
                                                value:
                                                  /^(([\+]90?)|([0]?))([ ]?)((\([0-9]{3}\))|([0-9]{3}))([ ]?)([0-9]{3})(\s*[\-]?)([0-9]{2})(\s*[\-]?)([0-9]{2})$/,
                                                message: "Geçersiz cep telefon numarası",
                                              },
                                            })}
                                            onChange={(e) =>
                                              setState({
                                                ...state,
                                                phoneNumber: e.target.value,
                                              })
                                            }
                                            value={state.phoneNumber}
                                            placeholder="(5xx) xxx xx xx"
                                          />
                                        </div>
                                      </div>
                                      <small className="text-danger">
                                        {errors["cep_telefon_no"]?.message}
                                      </small>
                                    </div>
                                  </div>
                                  <div className="row email mt-2">
                                    <div className="col-12 col-md-6 col-lg-6">
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
                                            className={`form-control mr-2 ${
                                              errors.email && "invalid"
                                            }`}
                                            {...register("email", {
                                              required: "E-mail adresi zorunlu",
                                              pattern: {
                                                value:
                                                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                                                message: "Geçersiz email adresi",
                                              },
                                            })}
                                            onChange={(e) =>
                                              setState({ ...state, email: e.target.value })
                                            }
                                            value={state.email}
                                          />
                                        </div>
                                      </div>
                                      <small className="text-danger">
                                        {errors["email"]?.message}
                                      </small>
                                    </div>
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
                                        İndirimler, Avantajlar, Fiyatlar ve Kampanyalardan haberdar
                                        olmak için tıklayınız.
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <div className="row forward-button">
                                  <div className="col-12 col-md-6 col-lg-6">
                                    <input
                                      type="submit"
                                      className="btn-custom btn-timeline-forward w-100 mt-3"
                                      value=" İleri"
                                    />
                                  </div>
                                </div>
                              </form>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  </li>
                )}

                {/*Tek kullanımlık şifre doğrulama*/}
                {state.activeStep >= 3 && (
                  <li
                    className={
                      "timeline-inverted " +
                      (state.activeStep < 3 ? "timeline-passive" : "") +
                      (state.activeStep > 3 ? "timeline-passed" : "")
                    }
                  >
                    <div className="timeline-badge">
                      <b className="glyphicon glyphicon-credit-card">3</b>
                    </div>
                    <div className="timeline-panel">
                      <div className="timeline-heading">
                        <h4 className="timeline-title">Tek Kullanımlık Şifre Doğrulama</h4>
                      </div>
                      <div className="timeline-body animate__animated animate__fadeInUp  ">
                        {(() => {
                          if (state.activeStep == 3) {
                            return (
                              <form onSubmit={handleSubmit(validateStep)}>
                                <div className="verify-single-use-code">
                                  <div className="row warning-before-process">
                                    <div className="col-12 col-md-6 col-lg-6">
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
                                        Telefonunuza gönderilen doğrulama kodunu giriniz.
                                      </div>
                                    </div>
                                  </div>

                                  <div className="row single-use-code-input">
                                    <div className="col-12 col-md-6 col-lg-6">
                                      <label htmlFor="singleUseCode">Tek Kullanımlık Kod</label>
                                      <input
                                        className="col form-control mr-2"
                                        id="singleUseCode"
                                        type="number"
                                        maxLength="6"
                                        className={`form-control ${
                                          errors.tek_kullanimlik_kod && "invalid"
                                        }`}
                                        {...register("tek_kullanimlik_kod", {
                                          required: "Lütfen 6 haneli tek kullanımlık kodu giriniz.",
                                          min: {
                                            value: 100000,
                                            message: "Kod 6 hane olması gerekmektedir",
                                          },
                                          max: {
                                            value: 999999,
                                            message: "Kod 6 hane olması gerekmektedir",
                                          },
                                        })}
                                      />
                                      <small className="text-danger">
                                        {errors["tek_kullanimlik_kod"]?.message}
                                      </small>
                                    </div>
                                  </div>
                                  {/*
                              <div className="row wrong-code-alert">
                              <div className="col-12 col-md-6 col-lg-6">
                                <div
                                  className="alert alert-danger mt-3"
                                  role="alert"
                                  style={{
                                    padding: "1px",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <i className="fas fa-times-circle fa-lg mr-2"></i>
                                  Girilen Kod Hatalıdır. Yeniden giriş yapınız.
                                </div>
                              </div>
                            </div>
                            */}

                                  <div className="row verify-single-use-code-button">
                                    <div className="col-12 col-md-6 col-lg-6">
                                      <input
                                        type="submit"
                                        className="btn-custom btn-timeline-forward w-100 mt-3"
                                        value="Doğrula"
                                      />
                                    </div>
                                  </div>
                                  <div className="row mt-1 ">
                                    <div className="col-12 col-md-6 col-lg-6 text-center text-danger">
                                      01: 15
                                    </div>
                                  </div>
                                  <div className="row update-phone-number">
                                    <div className="col-12 col-md-6 col-lg-6">
                                      <div className="btn-custom-outline btn-timeline-forward w-100 mt-3">
                                        Numarayı Güncelle
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row send-new-code">
                                    <div className="col-12 col-md-6 col-lg-6">
                                      <div className="btn-custom-outline btn-timeline-forward w-100 mt-3">
                                        Yeni Kod Gönder
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/*Seyahat Sağlık Sigortası Nedir?*/}
            <div className="row">
              <div className="col-12">
                <WhatIsTheXInsurance
                  photo={WhatIsTheDaskInsurance}
                  title="TAMAMLAYICI SAĞLIK SİGORTASI NEDİR? NE İŞE YARAR?"
                  topTitle="HASTALIKLARA KARŞI ÖNLEMİNİZİ ALIN"
                  descriptionParagraphs={[
                    "DASK (Doğal Afetler Sigortalar Kurumu) Zorunlu Deprem Sigortası; depremin ve deprem sonucu meydana gelen yangın, patlama, tsunami ile yer kaymasının doğrudan neden olacağı maddi zararları, sigorta poliçesinde belirtilen limitler kapsamında karşılayan bir sigorta türüdür.",
                    "Zorunlu Deprem Sigortası yaptırdığınız zaman binanız tamamen ya da kısmen zarar gördüğünde teminat altına alınır. DASK yaptırmadığınız durumlarda ise bu yardımdan yararlanamazsınız.",
                    ,
                  ]}
                />
              </div>
            </div>

            <div className="container" style={{ marginTop: "100px" }}>
              <ComplementaryFAQ topic="TAMAMLAYICI SAĞLIK" />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ComplementaryHealthInsurance;
