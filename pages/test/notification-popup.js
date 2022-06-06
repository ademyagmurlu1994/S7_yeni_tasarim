import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";

export default function TravelHealthInsurance() {
  /**Gidiş Dönüş Tarihi için Dönüşüm Yapmak için Kullanıldı */
  const current = new Date();
  const currentDay =
    parseInt(`${current.getDate()}`) < 9 ? `0${current.getDate()}` : `${current.getDate()}`;
  const currentMonth =
    parseInt(`${current.getMonth() + 1}`) < 9
      ? `0${current.getMonth() + 1}`
      : `${current.getMonth() + 1}`;
  const currentDate = `${current.getFullYear()}-${currentMonth}-${currentDay}`;

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
        tc_kimlik_numarasi: null,
        yakinlik_derecesi: -1,
      },
    ], //Sağlık siğortası alınacak kişi listesi
    name: "",
  });

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
    if (JSON.parse(localStorage.getItem("state"))) {
      const travel_health_index_data = JSON.parse(localStorage.getItem("travel_health_index"));
      let { userListForHealthInsurance } = state;
      userListForHealthInsurance[0].tc_kimlik_numarasi =
        travel_health_index_data.tc_kimlik_numarasi;
      userListForHealthInsurance[0].yakinlik_derecesi = 0;

      setState({
        ...state,
        userListForHealthInsurance: userListForHealthInsurance,
      });
      //React hook formda başlangıçta hata vermemesi için
      setValue("tc_kimlik_numarasi_0", travel_health_index_data.tc_kimlik_numarasi);
      setValue("yakinlik_derecesi_0", 0);
    }
  }, []);

  const router = useRouter();

  const validateStep = (data) => {
    if (errors != {}) {
      const step = state.activeStep + 1;

      //3. adımda notification kontrolü
      if (step == 2) {
        if (state.isShowedNotificationModal == false && state.isCheckedNotification == false) {
          document.querySelector("#notificationButton").click();
          setState({ ...state, isShowedNotificationModal: true });
        } else if (state.isCheckedNotification && state.isConfirmPhoneOrEmail == false) {
          document.querySelector("#verificationSingleCodeButton").click();
          setState({ ...state, isConfirmPhoneOrEmail: true });
        } else {
          setState({ ...state, activeStep: step });
        }
      } else {
        setState({ ...state, activeStep: step });
      }

      //Son Adımda Onaylamadan sonra offers sayfasına yönlendirme yapma
      if (state.activeStep == 3) {
        onVerifySingleUseCode();
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
  const onChangeYakinlikDerecesi = (e) => {
    clearErrors();
    let { userListForHealthInsurance } = state;
    userListForHealthInsurance[userListForHealthInsurance.length - 1].yakinlik_derecesi =
      e.target.value;
    setState({ ...state, userListForHealthInsurance: userListForHealthInsurance });
  };
  const onChangeTcKimlikNumarasi = (e) => {
    clearErrors();

    const lastUserIndex = state.userListForHealthInsurance.length - 1;
    if (isValidTcKimlik(e.target.value)) {
      if (!isExistTcKimlikNoInUserList(e.target.value)) {
        let { userListForHealthInsurance } = state;
        userListForHealthInsurance[userListForHealthInsurance.length - 1].tc_kimlik_numarasi =
          e.target.value;
        setState({ ...state, userListForHealthInsurance: userListForHealthInsurance });
      } else {
        setError("tc_kimlik_numarasi_" + lastUserIndex, {
          type: "manual",
          message: "T.C. Kimlik Numarası Kullanılmış",
        });
      }
    }
  };

  const onAddUserForHealthInsurance = () => {
    let { userListForHealthInsurance } = state;
    const lastUserIndex = userListForHealthInsurance.length - 1;
    const lastUser = userListForHealthInsurance[lastUserIndex];

    if (lastUser.yakinlik_derecesi == -1) {
      setError("yakinlik_derecesi_" + lastUserIndex, {
        type: "manual",
        message: "Yakinlik Derecesi Zorunlu",
      });
    }

    if (lastUser.tc_kimlik_numarasi == null) {
      setError("tc_kimlik_numarasi_" + lastUserIndex, {
        type: "manual",
        message: "Tc Kimlik Numarası Zorunlu",
      });
    } else if (!isValidTcKimlik(lastUser.tc_kimlik_numarasi.toString())) {
      setError("tc_kimlik_numarasi_" + lastUserIndex, {
        type: "manual",
        message: "T.C. Kimlik Numarası Geçersiz",
      });
    } else if (!Object.keys(errors).length) {
      userListForHealthInsurance.push({
        tc_kimlik_numarasi: null,
        yakinlik_derecesi: -1,
      });
      setState({ ...state, userListForHealthInsurance: userListForHealthInsurance });
    }
  };

  const onRemoveUserForHealthInsurance = (index) => {
    let { userListForHealthInsurance } = state;
    userListForHealthInsurance.splice(index, 1);
    setState({ ...state, userListForHealthInsurance: userListForHealthInsurance });
    resetField("tc_kimlik_numarasi_" + index);
    resetField("yakinlik_derecesi_" + index);
    resetField("meslek_" + index);
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
    document.querySelector("#notificationModal").querySelector(".close").click();
    setTimeout(() => {
      if (state.isConfirmPhoneOrEmail == false) {
        document.querySelector("#verificationSingleCodeButton").click();
        setState({ ...state, isConfirmPhoneOrEmail: true });
      }
    }, 500);
  };

  const onVerifySingleUseCode = () => {
    router.push("/insurance/health/travel/offers");
  };

  const isValidTcKimlik = (value) => {
    var tek = 0,
      cift = 0,
      sonuc = 0,
      TCToplam = 0,
      i = 0,
      hatali = [
        11111111110, 22222222220, 33333333330, 44444444440, 55555555550, 66666666660, 7777777770,
        88888888880, 99999999990,
      ];

    if (value.length != 11) return false;
    if (isNaN(value)) return false;
    if (value[0] == 0) return false;

    tek =
      parseInt(value[0]) +
      parseInt(value[2]) +
      parseInt(value[4]) +
      parseInt(value[6]) +
      parseInt(value[8]);
    cift = parseInt(value[1]) + parseInt(value[3]) + parseInt(value[5]) + parseInt(value[7]);

    tek = tek * 7;
    sonuc = Math.abs(tek - cift);
    if (sonuc % 10 != value[9]) return false;

    for (var i = 0; i < 10; i++) {
      TCToplam += parseInt(value[i]);
    }

    if (TCToplam % 10 != value[10]) return false;

    if (hatali.toString().indexOf(value) != -1) return false;

    return true;
  };

  return (
    <>
      {/* Pop-up Notificiation Modal*/}
      <button
        type="button"
        className="btn btn-primary bg-transparent"
        data-toggle="modal"
        id="notificationButton"
        data-target="#notificationModal"
        style={{ marginTop: "-100px", border: "none" }}
      >
        Pop-up Notificiation Modal Trigger
      </button>

      <div
        className="modal fade"
        id="notificationModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Modal title
              </h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              Size özel kampanya ve indirimlerden SMS ve E posta ile haberdar olmak ister misiniz?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">
                Hayır
              </button>
              <button type="button" className="btn-main" onClick={() => onAcceptNotification()}>
                Evet
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pop-up verification Single Code  */}
      <button
        type="button"
        className="btn btn-primary bg-transparent"
        data-toggle="modal"
        id="verificationSingleCodeButton"
        data-target="#verificationSingleCode"
        style={{ marginTop: "-100px", border: "none" }}
      >
        Pop-up Verification Single Code Modal Trigger
      </button>

      <div
        className="modal fade"
        id="verificationSingleCode"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Modal title
              </h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="verify-single-use-code">
                <div className="row warning-before-process">
                  <div className="col-12">
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
                      05xx xx xx nolu telefonunuza gönderilen doğrulama kodunu giriniz.
                    </div>
                  </div>
                </div>

                <div className="row single-use-code-input">
                  <div className="col-12">
                    <label htmlFor="singleUseCode">Tek Kullanımlık Kod</label>
                    <input className="col form-control mr-2" id="singleUseCode" type="number" />
                  </div>
                </div>
                <div className="row wrong-code-alert">
                  <div className="col-12 ">
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
                <div className="row verify-single-use-code-button">
                  <div className="col-12 ">
                    <input
                      type="submit"
                      className="btn-custom btn-timeline-forward w-100 mt-3"
                      value="Doğrula"
                    />
                  </div>
                </div>
                <div className="row mt-1 ">
                  <div className="col-12  text-center text-danger">01: 15</div>
                </div>
                <div className="row send-new-code">
                  <div className="col-12 ">
                    <div className="btn-custom-outline btn-timeline-forward w-100 mt-3">
                      Yeni Kod Gönder
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="timeline_container">
        <div className="container">
          Pop-up Test
          <ul className="timeline timeline-travel-health-insurance">
            {/*İletişim bilgileri*/}
            <li>
              <div className="timeline-badge">
                <b className="glyphicon glyphicon-credit-card">2</b>
              </div>
              <div className="timeline-panel">
                <div className="timeline-heading">
                  <h4 className="timeline-title">İletişim Bilgileri</h4>
                </div>
                <div className="timeline-body animate__animated animate__fadeInUp  ">
                  {(() => {
                    if (state.activeStep == 1) {
                      return (
                        <form onSubmit={handleSubmit(validateStep)} id="secondStep">
                          <div className="unregistered-user">
                            <div className="news-notification-confirmation mt-2">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                  onChange={() => onChangeNotificationCheckBox()}
                                />
                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                  İndirimler, Avantajlar, Fiyatlar ve Kampanyalardan haberdar olmak
                                  için tıklayınız.
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
          </ul>
        </div>
      </section>
    </>
  );
}
