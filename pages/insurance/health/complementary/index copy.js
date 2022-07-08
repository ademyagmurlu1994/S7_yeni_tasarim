import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";

//Componentler
import PreLoader from "/components/PreLoader";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ComplementaryFAQ from "/components/faq/ComplementaryFAQ";
import NotificationConfirmation from "/components/pop-up/NotificationConfirmation";
import SingleCodeVerification from "/components/pop-up/SingleCodeVerification";
import PagePreLoader from "/components/common/PagePreLoader";
import InsuranceIndexPageInformation from "/components/common/InsuranceIndexPageInformation";
import WhatIsTheXInsurance from "/components/common/WhatIsTheXInsurance";
import DateField from "/components/input/DateField";
import Button from "@mui/material/Button";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";

//Step Components
import StepLabelIcon from "/components/step/StepLabelIcon";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";

//Fonksiyonlar
import {
  isValidTcKimlik,
  getNewToken,
  getTodayDate,
  isValidMaskedDate,
  writeResponseError,
  addDaysToDate,
} from "/functions/common";

//images
import { DaskInsuranceInformationPhoto, WhatIsTheDaskInsurance } from "/resources/images";

//Styles
//import { reactSelectStyles } from "functions/styles";

const ComplementaryHealthInsurance = (props) => {
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

  const router = useRouter();

  const [activeStep, setActiveStep] = React.useState(0);

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

  // const { birthDateRef, ...birthDateProps } = register({
  //   required: "Doğum Tarihi zorunlu",
  // });

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

  const validateStep = (data) => {
    const forwardStep = activeStep + 1;

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
        //Kod gönderme componentini 3. adım hariç tüm adımlarda kapalı tutuyoruz.(sürekli sms gönderilmemesi için)
        setIsShowVerifySingleCodePopup(false);
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
    localStorage.setItem("inquiryInformations", JSON.stringify(inquiryInformations));
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
    setValue("birthDate" + index, e.target.value.toString());
    console.log(e.target.value);
    clearErrors();
    let { userListForHealthInsurance } = state;
    userListForHealthInsurance[index].birthDate = e.target.value.toString();
    setState({ ...state, userListForHealthInsurance: userListForHealthInsurance });
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

  const notificationConfirmationCallback = useCallback((isConfirmNotify) => {
    setNotificationConfirmation(isConfirmNotify);
  }, []);

  const singleCodeVerificationCallback = useCallback((isVerify) => {
    setIsVerifySmsSingleCode(isVerify);
  });

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
        {/*Kimlik, Dogum Tarihi, Yakınlık ve Meslek Bilgisi*/}
        <div className="timeline-inverted">
          <div className="timeline-panel">
            <div className="timeline-heading">
              <h4 className="timeline-title">Temel Bilgiler</h4>
            </div>
            <div className="timeline-body  ">
              {(() => {
                if (state.activeStep == 1) {
                  return (
                    <form autoComplete="off" onSubmit={handleSubmit(validateStep)} id="firstStep">
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
                                placeholder="gg.aa.yyyy"
                                {...register("birthDate" + index, {
                                  required: "Doğum Tarihi zorunlu",
                                  validate: isValidMaskedDate,
                                })}
                                onKeyUp={(e) => onChangeDogumTarihi(e, index)}
                                value={user.birthDate}
                                max={getTodayDate()}
                                autocomplete="off"
                              />

                              <small className="text-danger">
                                {errors["birthDate" + index]?.message}
                                {/**Validate Message */}
                                {errors["birthDate" + index]
                                  ? errors["birthDate" + index].type == "validate"
                                    ? "Geçersiz Doğum Tarihi"
                                    : ""
                                  : ""}
                              </small>
                            </div>

                            <div className="col-12 col-md-6 col-lg-3 mt-2 select-yakinlik-derecesi">
                              <label className="">Yakınlık Derecesi</label>
                              <Controller
                                name={"relation" + index}
                                control={control}
                                rules={{
                                  required: "Yakınlık Derecesi Zorunlu",
                                }}
                                render={(props) => (
                                  <Autocomplete
                                    value={state.selectedUsersRelation[index]}
                                    onChange={(e) => {
                                      onChangeYakinlikDerecesi(e, index);
                                    }}
                                    options={state.relationList}
                                    sx={{ width: "100%" }}
                                    size="small"
                                    {...props}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="_"
                                        placeholder="Yakınlık Derecesi"
                                        error={Boolean(errors["relation" + index])}
                                        required={true}
                                        InputProps={{
                                          ...params.InputProps,
                                        }}
                                      />
                                    )}
                                  />
                                )}
                              />
                              <small className="text-danger">
                                {errors["relation" + index]?.message}
                              </small>
                            </div>

                            <div className="col-12 col-md-6 col-lg-3 mt-2 select-meslek">
                              <label className="">Meslek</label>
                              <Controller
                                name={"profession" + index}
                                control={control}
                                rules={
                                  {
                                    // required: "Doğum Tarihi zorunlu",
                                    // validate: isValidMaskedDate,
                                  }
                                }
                                render={(props) => (
                                  <Autocomplete
                                    value={state.selectedUsersProfession[index]}
                                    onChange={(e) => {
                                      onChangeMeslek(e, index);
                                    }}
                                    options={state.professionList}
                                    sx={{ width: "100%" }}
                                    size="small"
                                    {...props}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label=" "
                                        placeholder="Meslek Seçiniz"
                                        //error={Boolean(errors["relation" + index])}
                                        InputProps={{
                                          ...params.InputProps,
                                        }}
                                      />
                                    )}
                                  />
                                )}
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
        className="stepContainer animate__animated  animate__fadeInRight"
      >
        <div
          className={
            "timeline-inverted " +
            (state.activeStep < 2 ? "timeline-passive" : "") +
            (state.activeStep > 2 ? "timeline-passed" : "")
          }
        >
          <div className="timeline-panel">
            <div className="timeline-heading">
              <h4 className="timeline-title">İletişim Bilgileri</h4>
            </div>

            <div className="timeline-body">
              <form autoComplete="off" onSubmit={handleSubmit2(validateStep)} id="secondStep">
                <div className="unregistered-user">
                  <div className="row phone-number">
                    <div className="col-12 col-md-6 col-lg-6">
                      Cep Telefonu
                      <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                        <div className="bg-main text-white input-form-prefix px-2">+90</div>
                        <div className="input-with-prefix">
                          <input
                            type="tel"
                            className={`phoneNumber form-control mr-2 ${
                              errors2.cep_telefon_no && "invalid"
                            }`}
                            {...register2("cep_telefon_no", {
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
                      <small className="text-danger">{errors2["cep_telefon_no"]?.message}</small>
                    </div>
                  </div>
                  <div className="row email mt-2">
                    <div className="col-12 col-md-6 col-lg-6">
                      E-posta adresi
                      <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                        <div className="bg-main text-white input-form-prefix">
                          <i className="far fa-envelope"></i>
                        </div>
                        <div className="input-with-prefix">
                          <input
                            type="email"
                            className={`form-control mr-2 ${errors2.email && "invalid"}`}
                            {...register2("email", {
                              required: "E-mail adresi zorunlu",
                              pattern: {
                                value:
                                  /^([\w-]{3,30}(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{1,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
                                message: "Geçersiz email adresi",
                              },
                            })}
                            onChange={(e) => {
                              setState({ ...state, email: e.target.value });
                              setValue2("email", e.target.value);
                            }}
                            value={state.email}
                          />
                        </div>
                      </div>
                      <small className="text-danger">{errors2["email"]?.message}</small>
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
                      <label className="form-check-label" htmlFor="flexCheckDefault">
                        İndirimler, Avantajlar, Fiyatlar ve Kampanyalardan haberdar olmak için
                        tıklayınız.
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
            </div>
          </div>
        </div>
      </Box>
    );
  };
  const steps = [OneStep(), TwoStep()];

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

      {/* */}
      {!Boolean(token) ? (
        <>
          <PagePreLoader />
        </>
      ) : (
        <section className="complementary-health-section timeline_container">
          <div>
            <div className="container" style={{ marginBottom: "400px" }}>
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

            {/*Seyahat Sağlık Sigortası Nedir?*/}
            <div className="row">
              <div className="col-12">
                <WhatIsTheXInsurance
                  title="TAMAMLAYICI SAĞLIK SİGORTASI NEDİR? NE İŞE YARAR?"
                  topTitle="HASTALIKLARA KARŞI ÖNLEMİNİZİ ALIN"
                  descriptionParagraphs={[
                    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error illum reprehenderit iste dolorem optio id ipsa eligendi similique animi voluptatem laborum, tempora perferendis labore consequuntur facere aperiam quas consequatur officiis!",
                    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error illum reprehenderit iste dolorem optio id ipsa eligendi similique animi voluptatem laborum, tempora perferendis labore consequuntur facere aperiam quas consequatur officiis!",
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
