import React, { useState, useEffect, useCallback } from "react";
import { cloneDeep, cloneDeepWith, clone } from "lodash-es";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";

//Componentler

//import CircularProgress from "@mui/material/CircularProgress";
import NotificationConfirmation from "/components/pop-up/NotificationConfirmation";
import SingleCodeVerification from "/components/pop-up/SingleCodeVerification";
import Button from "/components/form/Button";
import WhatIsTheXInsurance from "/components/common/WhatIsTheXInsurance";
import ComplementaryFAQ from "/components/faq/ComplementaryFAQ";
import PopupAlert from "/components/pop-up/PopupAlert";

//mui components
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";

import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";

//Step Components
import StepLabelIcon from "/components/step/StepLabelIcon";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

//fonksiyonlar
import {
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
  getNewToken,
  isValidMaskedDate,
  changeDateFormat,
  isValidTcKimlikOrVergiKimlik,
  isValidTcKimlik,
  addDaysToDate,
} from "/functions/common";

//styles
import { inputStyle } from "/styles/custom";
import { radioButtonSx } from "/styles/inputStyle";

//images
import { DaskInsuranceInformationPhoto, WhatIsTheDaskInsurance } from "/resources/images";

export default function TssInsurance() {
  /*Her Adımda ayrı form elemanı olduğu için ayrı ayrı control oluşturmamız gerekiyor,*/
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    resetField,
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
    isDestinationEuropeanCountry: true,
    isCheckedNotification: false,
    isAcceptNotification: false,
    isConfirmPhoneOrEmail: false,
    isShowedNotificationModal: false,
    goDate: "",
    returnDate: "",
    name: "",
    phoneNumber: "",
    email: "",
  });

  const [relationList, setRelationList] = useState([
    { value: 0, label: "Kendisi" },
    { value: 1, label: "Eşi" },
    { value: 2, label: "Çocuğu" },
  ]);

  const [professionList, setProfessionList] = useState([
    { value: 0, label: "Memur" },
    { value: 1, label: "Bilgisayar Mühendisi" },
    { value: 2, label: "Yazılım Mühendisi" },
    { value: 3, label: "Tesisatçı" },
  ]);

  const [userList, setUserList] = useState([
    {
      index: 0,
      identityNo: undefined,
      relation: relationList[0],
      profession: "",
    },
  ]);

  const [isVerifySmsSingleCode, setIsVerifySmsSingleCode] = useState(undefined);
  const [isShowVerifySingleCodePopup, setIsShowVerifySingleCodePopup] = useState(false);
  const [isShowNotifyConfirmPopup, setIsShowNotifyConfirmPopup] = useState(false);
  const [notificationConfirmation, setNotificationConfirmation] = useState(undefined);

  const [quoteReceivedSuccess, setQuoteReceivedSuccess] = useState(false);

  useEffect(() => {}, []);

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
      setTimeout(() => {
        setQuoteReceivedSuccess(true);
      }, 500);

      //saveInquiryInformations();
      //router.push("/insurance/health/complementary/offers");
    }
  }, [isVerifySmsSingleCode]);

  const validateStep = (data) => {
    const forwardStep = activeStep + 1;

    switch (forwardStep) {
      case 1:
        if (checkUserFormElements()) {
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
      default:
        //Kod gönderme componentini 3 adım hariç tüm adımlarda kapalı tutuyoruz.(sürekli sms gönderilmemesi için)
        setIsShowVerifySingleCodePopup(false);
    }
  };

  const isExistTcKimlikNoInUserList = (identityNo) => {
    return userList.some((item) => item.identityNo == identityNo);
  };

  const onChangeTcKimlikNumarasi = (e, index) => {
    clearErrors("identityNo" + index);
    setValue("identityNo", e.target.value);
    if (e.target.value.toString().length == 11 && isExistTcKimlikNoInUserList(e.target.value)) {
      setError("identityNo" + index, {
        type: "manual",
        message: "T.C. Kimlik Numarası listede var",
      });
    }

    let userListClone = cloneDeep(userList);
    let userIndex = userListClone.findIndex((value) => value.index == index);
    userListClone[userIndex].identityNo = e.target.value;
    setUserList(userListClone);
  };

  const onChangeYakinlikDerecesi = (value, index) => {
    setValue("relation" + index, value);
    clearErrors("relation" + index);

    let userListClone = cloneDeep(userList);
    let userIndex = userListClone.findIndex((value) => value.index == index);
    userListClone[userIndex].relation = value;
    setUserList(userListClone);
  };

  const onChangeMeslek = (value, index) => {
    setValue("profession" + index, value);
    clearErrors("profession" + index);

    let userListClone = cloneDeep(userList);
    let userIndex = userListClone.findIndex((value) => value.index == index);
    userListClone[userIndex].profession = value;
    setUserList(userListClone);
  };

  const checkUserFormElements = () => {
    const lastUserIndex = userList.length - 1;
    const lastUser = userList[lastUserIndex];

    console.log("User List: ", userList);
    console.log("Hatalar: ", errors);
    console.log("TC: ", lastUser.identityNo);

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
    }

    if (!lastUser.relation || lastUser.relation == "" || lastUser.relation.value == -1) {
      setError("relation" + lastUserIndex, {
        type: "manual",
        message: "Yakınlık Derecesi Zorunlu",
      });
      return false;
    }

    if (!Object.keys(errors).length) {
      return true;
    }
  };

  const onAddUser = () => {
    if (checkUserFormElements()) {
      let userListClone = cloneDeep(userList);
      userListClone.push({
        index: userListClone.slice(-1)[0].index + 1,
        identityNo: "",
        relation: "",
        profession: "",
      });
      setUserList(userListClone);
    }
  };

  const onRemoveUser = (index) => {
    let userListClone = cloneDeep(userList);
    let userIndex = userListClone.findIndex((value) => value.index == index);
    userListClone.splice(userIndex, 1);
    setUserList(userListClone);

    resetField("identityNo" + index);
    clearErrors();
  };

  const saveInquiryInformations = () => {
    let ownInfo = {};
    let familyMembersInfo = [];

    for (var i = 0; i < userList.length; i++) {
      if (i == 0) {
        ownInfo.identityNo = userList[i].identityNo.toString();
        ownInfo.relation = 0;
        ownInfo.profession = userList[i].profession?.value?.toString() || "";
      } else {
        let singleMember = {
          identityNo: userList[i].identityNo.toString(),
          relation: userList[i].relation.value,
          profession: userList[i].profession?.value?.toString() || "",
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

  const quoteReceived = (value) => {
    console.log("close Value:", value);
    if (value) {
      setQuoteReceivedSuccess(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
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
        {/*Kimlik, Yakınlık Bilgisi*/}
        <div className={"timeline-inverted " + (state.activeStep > 1 ? "timeline-passed" : "")}>
          <div className="timeline-badge success">
            <b></b>
          </div>
          <div className="timeline-panel">
            <div className="timeline-heading">
              <h4 className="timeline-title"></h4>
            </div>
            <div className="timeline-body">
              {/* {JSON.stringify(userList)} */}
              <form autoComplete="off" onSubmit={handleSubmit(validateStep)}>
                {userList.map((user, index) => (
                  <div className="user-list-for-health-insurance-wrapper" key={index}>
                    <div className="row">
                      <div className="col-12 col-md-6 col-lg-4 mt-3 mb-2 tc-kimlik-no">
                        <Controller
                          control={control}
                          name={"identityNo" + user.index}
                          rules={{
                            required: "T.C. Kimlik Numarası Zorunlu",
                            validate: isValidTcKimlik,
                          }}
                          defaultValue={user.identityNo} // 👈 set defaultValue to ""
                          render={({
                            field: { onChange, onBlur, value, name, ref },
                            fieldState: { invalid, isTouched, isDirty, error },
                            formState,
                          }) => (
                            <TextField
                              type="number"
                              name={"identityNo" + user.index}
                              onChange={(e) => {
                                onChangeTcKimlikNumarasi(e, user.index);
                                setValue("identityNo" + user.index, e.target.value);
                              }}
                              value={user.identityNo || ""}
                              sx={inputStyle}
                              size="small"
                              error={Boolean(errors["identityNo" + user.index])}
                              label="T.C. Kimlik Numarası *"
                              maxLength={11}
                            />
                          )}
                        />

                        <small className="text-danger">
                          {errors["identityNo" + user.index]?.message}
                          {/**Validate Message */}
                          {errors["identityNo" + user.index] &&
                            errors["identityNo" + user.index].type == "validate" &&
                            "Geçersiz T.C. Kimlik Numarası"}
                        </small>
                      </div>

                      <div className="col-12 col-md-6 col-lg-4 mt-3 select-yakinlik-derecesi">
                        <Controller
                          name={"relation" + user.index}
                          control={control}
                          rules={
                            index != 0 && {
                              required: "Yakınlık Derecesi Zorunlu",
                            }
                          }
                          render={(props) => (
                            <Autocomplete
                              value={
                                userList[userList.findIndex((value) => value.index == user.index)]
                                  .relation || { label: "", value: -1 }
                              }
                              onChange={(_, newValue) => {
                                onChangeYakinlikDerecesi(newValue, user.index);
                              }}
                              options={relationList}
                              getOptionLabel={(option) => option.label}
                              sx={{ width: "100%" }}
                              size="small"
                              disabled={index == 0}
                              {...props}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Yakınlık Derecesi"
                                  placeholder="Yakınlık Derecesi"
                                  error={Boolean(errors["relation" + user.index])}
                                  sx={inputStyle}
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
                          {errors["relation" + user.index]?.message}
                        </small>
                      </div>

                      <div className="col-12 col-md-6 col-lg-4 mt-3 select-meslek">
                        <Controller
                          name={"profession" + user.index}
                          control={control}
                          render={(props) => (
                            <Autocomplete
                              value={
                                userList[userList.findIndex((value) => value.index == user.index)]
                                  .profession || { label: "", value: -1 }
                              }
                              onChange={(_, newValue) => {
                                onChangeMeslek(newValue, user.index);
                              }}
                              options={professionList}
                              getOptionLabel={(option) => option.label}
                              sx={{ width: "100%" }}
                              size="small"
                              {...props}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Meslek"
                                  placeholder="Meslek Seçiniz"
                                  //error={Boolean(errors["profession" + user.index])}
                                  sx={inputStyle}
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
                      if (userList.length > 1 && user.index != 0) {
                        return (
                          <div className="row remove-person mt-2">
                            <div className="col">
                              <a href="#" onClick={() => onRemoveUser(user.index)}>
                                <i className="far fa-trash-alt" style={{ color: "red" }}></i> Kişiyi
                                Çıkar
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
                    <a href="#" onClick={() => onAddUser()}>
                      <i className="fas fa-plus fa-lg"></i> Kişi Ekle
                    </a>
                  </div>
                </div>
                <div className="row forward-button">
                  <div className="col-12">
                    <Button
                      type="submit"
                      className="w-100 mt-3"
                      disabled={Boolean(Object.keys(errors).length)}
                    >
                      İleri
                    </Button>
                  </div>
                </div>
              </form>
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
        className="stepContainer  animate__animated  animate__fadeInRight"
      >
        {/*İletişim bilgileri*/}
        <div
          className={
            "timeline-inverted " +
            (state.activeStep < 2 ? "timeline-passive" : "") +
            (state.activeStep > 2 ? "timeline-passed" : "")
          }
        >
          <div className="timeline-badge">
            <b className="glyphicon glyphicon-credit-card"></b>
          </div>
          <div className="timeline-panel">
            <div className="timeline-heading">
              <h4 className="timeline-title">İletişim Bilgileri</h4>
            </div>
            <div className="timeline-body">
              <form autoComplete="off" onSubmit={handleSubmit2(validateStep)} id="secondStep">
                <div className="unregister2ed-user mt-4">
                  <div className="phone-number">
                    <div className="input-form-with-prefix w-100" style={{ display: "flex" }}>
                      <div className="bg-main text-white input-form-prefix px-2">+90</div>
                      <div className="input-with-prefix">
                        <TextField
                          {...register2("cepTelefonNo", {
                            required: "Cep telefonu numarası Zorunlu",
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
                            required: "E-mail adresi Zorunlu",
                            pattern: {
                              value:
                                /^([\w-]{3,30}(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{1,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
                              message: "Geçersiz email adresi",
                            },
                          })}
                          value={state.email}
                          onChange={(e) => {
                            setState({ ...state, email: e.target.value });
                            setValue2("emailAddress", e.target.value);
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
                            color: "var(--color-one)",
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

      <PopupAlert show={quoteReceivedSuccess} onClose={(value) => quoteReceived(value)}>
        <p style={{ fontWeight: "normal", textAlign: "justify" }}>
          <h4 className="text-center mb-3">
            <i className="fas fa-check-circle fa-lg text-main"></i> <b>Talebiniz Başarılı</b>
          </h4>
          En kısa sürede sizinle iletişime geçerek en avantajlı fiyatlarla sağlık sigortası
          tekliflerimizi ulaştıracağız.
        </p>
      </PopupAlert>

      <section className="section mt-5">
        <div className="container" style={{ marginBottom: "100px", width: "100% !important" }}>
          <div className="w-100 text-center  mb-4">
            <h4>Sigorta 7 ile en uygun ve ihtiyacınıza yönelik Özel Sağlık Sigortası</h4>
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
              title="ÖZEL SAĞLIK SİGORTASI NEDİR? NE İŞE YARAR?"
              topTitle="HASTALIKLARA KARŞI ÖNLEMİNİZİ ALIN"
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
