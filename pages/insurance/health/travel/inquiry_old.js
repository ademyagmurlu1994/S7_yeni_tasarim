import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";

//Componentler
import PreFormLoader from "/components/PreFormLoader";
import PageMessage from "/components/PageMessage";
import BaseSelect from "react-select";
import RequiredSelect from "/components/RequiredSelect";
import PreLoader from "/components/PreLoader";
import VerifySms from "/components/common/VerifySms";
import NotificationConfirmation from "/components/pop-up/NotificationConfirmation";
import SingleCodeVerification from "/components/pop-up/SingleCodeVerification";

//fonksiyonlar
import { isValidTcKimlik, getTodayDate, writeResponseError } from "/functions/common";

export default function TravelHealthInsurance() {
  const router = useRouter();
  /**Gidiş Dönüş Tarihi için Dönüşüm Yapmak için Kullanıldı */
  const current = new Date();
  const currentDay =
    parseInt(`${current.getDate()}`) < 9 ? `0${current.getDate()}` : `${current.getDate()}`;
  const currentMonth =
    parseInt(`${current.getMonth() + 1}`) < 9
      ? `0${current.getMonth() + 1}`
      : `${current.getMonth() + 1}`;
  const currentDate = `${current.getFullYear()}-${currentMonth}-${currentDay}`;

  const Select = (props) => <RequiredSelect {...props} SelectComponent={BaseSelect} />;

  const [state, setState] = useState({
    activeStep: 1,
    isDestinationEuropeanCountry: true,
    isCheckedNotification: false,
    isAcceptNotification: false,
    isConfirmPhoneOrEmail: false,
    isShowedNotificationModal: false,
    goDate: currentDate,
    returnDate: currentDate,
    userListForHealthInsurance: [
      {
        identityNo: undefined,
        relation: 0,
      },
    ], //Sağlık siğortası alınacak kişi listesi
    relationList: [
      { value: 0, label: "Kendisi" },
      { value: 1, label: "Eşi" },
      { value: 2, label: "Çocuğu" },
      { value: 3, label: "Tesisatçı" },
    ],
    selectedUsersRelation: [{ value: "0", label: "Kendisi" }],
    name: "",
    phoneNumber: "",
    email: "",
  });

  const [isVerifySmsSingleCode, setIsVerifySmsSingleCode] = useState(undefined);
  const [isShowVerifySingleCodePopup, setIsShowVerifySingleCodePopup] = useState(false);
  ///New
  const [isShowNotifyConfirmPopup, setIsShowNotifyConfirmPopup] = useState(false);
  const [notificationConfirmation, setNotificationConfirmation] = useState(undefined);

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    resetField,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("travel_health_index"))) {
      const travel_health_index_data = JSON.parse(localStorage.getItem("travel_health_index"));
      let { userListForHealthInsurance } = state;
      userListForHealthInsurance[0].identityNo = travel_health_index_data.tc_kimlik_numarasi;
      userListForHealthInsurance[0].relation = 0;

      setState({
        ...state,
        userListForHealthInsurance: userListForHealthInsurance,
      });

      //React hook formda başlangıçta hata vermemesi için
      setValue("identityNo0", travel_health_index_data.tc_kimlik_numarasi);
      setValue("relation0", 0);
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
      router.push("/insurance/health/travel/offers");
    }
  }, [isVerifySmsSingleCode]);

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
          //Kod gönderme componentini 3 adım hariç tüm adımlarda kapalı tutuyoruz.(sürekli sms gönderilmemesi için)
          setIsShowVerifySingleCode(false);
      }
    }
  };

  const isExistTcKimlikNoInUserList = (tc_kimlik_numarasi) => {
    for (var i = 0; i < state.userListForHealthInsurance.length; i++) {
      if (state.userListForHealthInsurance[i].tc_kimlik_numarasi == tc_kimlik_numarasi) {
        return true;
      }
    }
    return false;
  };

  const onChangeGidisTarihi = (e) => {
    let { goDate, returnDate } = state;
    goDate = e.target.value;
    const dateGoDate = new Date(goDate);
    const dateReturnDate = new Date(returnDate);

    if (dateGoDate > dateReturnDate) {
      returnDate = goDate;
    }
    setState({ ...state, goDate: goDate, returnDate: returnDate });
  };
  const onChangeDonusTarihi = (e) => {
    let { goDate, returnDate } = state;
    returnDate = e.target.value;
    const dateGoDate = new Date(goDate);
    const dateReturnDate = new Date(returnDate);

    if (dateReturnDate < dateGoDate) {
      goDate = returnDate;
    }
    setState({ ...state, goDate: goDate, returnDate: returnDate });
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

  const onChangeTcKimlikNumarasi = (e, index) => {
    clearErrors();

    let { userListForHealthInsurance } = state;
    userListForHealthInsurance[index].identityNo = e.target.value;
    setState({ ...state, userListForHealthInsurance: userListForHealthInsurance });
  };

  const checkUserFormElements = () => {
    let { userListForHealthInsurance } = state;
    const lastUserIndex = userListForHealthInsurance.length - 1;
    const lastUser = userListForHealthInsurance[lastUserIndex];

    console.log("User List: ", userListForHealthInsurance);
    console.log("Hatalar: ", errors);

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

      <section className="timeline_container mt-5">
        <div className="container">
          <div className="row page-header">
            <div className="col text-center">
              <h3>Kendinizi ve Ailenizi Sağlık Sigortası ile Korumaya Alın.</h3>
            </div>
          </div>
          <ul className="timeline timeline-travel-health-insurance">
            {/*Kimlik, Yakınlık Bilgisi*/}
            <li className={"timeline-inverted " + (state.activeStep > 1 ? "timeline-passed" : "")}>
              <div className="timeline-badge success">
                <b>1</b>
              </div>
              <div className="timeline-panel">
                <div className="timeline-heading">
                  <h4 className="timeline-title"></h4>
                </div>
                <div className="timeline-body animate__animated animate__fadeInUp  ">
                  {
                    <form onSubmit={handleSubmit(validateStep)}>
                      {/**Gidiş Dönüş Tarihi */}
                      <h4>Gidiş Dönüş Tarihi</h4>
                      <div className="row gidis-donus-tarih-secimi">
                        <div className="col-12 col-md-6 col-lg-6 form-group mt-2">
                          <label className="">Gidiş Tarihi</label>
                          <input
                            id="gidisTarihi"
                            type="date"
                            className="form-control"
                            placeholder="gg.aa.yyyy"
                            value={state.goDate}
                            min={currentDate}
                            onChange={(e) => onChangeGidisTarihi(e)}
                            required
                          />
                        </div>
                        <div className="col-12 col-md-6 col-lg-6 form-group mt-2">
                          <label className="">Geliş Tarihi</label>
                          <input
                            id="donusTarihi"
                            type="date"
                            className="form-control"
                            placeholder="gg.aa.yyyy"
                            value={state.returnDate}
                            min={currentDate}
                            onChange={(e) => onChangeDonusTarihi(e)}
                            required
                          />
                        </div>
                      </div>
                      {/**Gidilecek Ülke */}

                      <h4 className="mt-5">Gidilecek Ülke</h4>
                      <div className="radio-gidilecek-ulke">
                        <div className="">
                          <input
                            className=""
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                            checked={state.isDestinationEuropeanCountry}
                            onChange={() =>
                              setState({ ...state, isDestinationEuropeanCountry: true })
                            }
                          />
                          <label className="form-check-label ml-2" htmlFor="flexRadioDefault1">
                            Avrupa Ülkeleri
                          </label>
                        </div>
                        <div className="">
                          <input
                            className=""
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault2"
                            checked={!state.isDestinationEuropeanCountry}
                            onChange={() =>
                              setState({ ...state, isDestinationEuropeanCountry: false })
                            }
                          />

                          <label className="form-check-label ml-2" htmlFor="flexRadioDefault2">
                            Avrupa Dışı Tüm Dünya Ülkeleri
                          </label>
                        </div>
                      </div>

                      {/**Sigorta yaptıracak kişi listesi */}
                      <h4 className="mt-5">Kimler Gidiyor ?</h4>
                      {state.userListForHealthInsurance.map((user, index) => (
                        <div
                          className="user-list-for-health-insurance-wrapper mt-2  py-1"
                          key={index}
                        >
                          <div className="row">
                            <div className="col-12 col-md-6 col-lg-6 mt-2 tc-kimlik-no">
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

                            <div className="col-12 col-md-6 col-lg-6 mt-2 select-yakinlik-derecesi">
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
                                      <i className="far fa-trash-alt" style={{ color: "red" }}></i>{" "}
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
                        <div className="col-12">
                          <input
                            type="submit"
                            className="btn-custom btn-timeline-forward w-100 mt-3"
                            value=" İleri"
                          />
                        </div>
                      </div>
                    </form>
                  }
                </div>
              </div>
            </li>
            {/*İletişim bilgileri*/}
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
                    if (state.activeStep > 1) {
                      return (
                        <form onSubmit={handleSubmit(validateStep)} id="secondStep">
                          <div className="unregistered-user">
                            <div className="phone-number">
                              Cep Telefonu
                              <div
                                className="input-form-with-prefix w-100"
                                style={{ display: "flex" }}
                              >
                                <div className="bg-main text-white input-form-prefix px-2">+90</div>
                                <div className="input-with-prefix">
                                  <input
                                    className="form-control mr-2"
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className={`form-control ${errors.cepTelefonNo && "invalid"}`}
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
                                    className="form-control mr-2"
                                    type="email"
                                    className={`form-control ${errors.email && "invalid"}`}
                                    {...register("email", {
                                      required: "E-mail adresi zorunlu",
                                      pattern: {
                                        value:
                                          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                                        message: "Geçersiz email adresi",
                                      },
                                    })}
                                    value={state.email}
                                    onChange={(e) => setState({ ...state, email: e.target.value })}
                                  />
                                </div>
                              </div>
                              <small className="text-danger">{errors["email"]?.message}</small>
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
                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                  İndirimler, Avantajlar, Fiyatlar ve Kampanyalardan haberdar olmak
                                  için tıklayınız.
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="row forward-button">
                            <div className="col-12">
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
          </ul>
        </div>
      </section>
    </>
  );
}
