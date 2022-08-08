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
import DatePicker from "/components/form/DatePicker";

//mui components
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FormControl } from "@mui/material";

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

export default function TravelHealthInsurance() {
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

  const [userList, setUserList] = useState([
    {
      index: 0,
      identityNo: undefined,
      birthDate: "",
    },
  ]);

  const [isVerifySmsSingleCode, setIsVerifySmsSingleCode] = useState(undefined);
  const [isShowVerifySingleCodePopup, setIsShowVerifySingleCodePopup] = useState(false);
  const [isShowNotifyConfirmPopup, setIsShowNotifyConfirmPopup] = useState(false);
  const [notificationConfirmation, setNotificationConfirmation] = useState(undefined);
  const [checkedTravelCountry, setCheckedTravelCountry] = useState("");

  useEffect(() => {
    // //Date mask yüklemesi gerçekleştikten sonra tarihlerin default değerlerini atıyoruz.
    // setTimeout(() => {
    //   document.getElementsByName("goDate")[0].defaultValue = changeDateFormat(
    //     getTodayDate(),
    //     "gg.aa.yyyy"
    //   );

    //   // setState({
    //   //   ...state,
    //   //   goDate: changeDateFormat(getTodayDate(), "dd.MM.yyyy"),
    //   //   returnDate: changeDateFormat(getTodayDate(), "dd.MM.yyyy"),
    //   // });
    // }, 2000);
    // setTimeout(() => {
    //   document.getElementsByName("goDate")[0].value = changeDateFormat(
    //     getTodayDate(),
    //     "gg.aa.yyyy"
    //   );
    // }, 3000);

    if (JSON.parse(localStorage.getItem("travelIndex"))) {
      const indexData = JSON.parse(localStorage.getItem("travelIndex"));
      setUserList([
        {
          index: 0,
          identityNo: indexData.identityNo,
          birthDate: "",
        },
      ]);

      //React hook formda başlangıçta hata vermemesi için
      setValue("identityNo0", indexData.identityNo);
      setValue("birthDate0", "");
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
      router.push("/insurance/health/travel/offers");
    }
  }, [isVerifySmsSingleCode]);

  const validateStep = (data) => {
    const forwardStep = activeStep + 1;

    switch (forwardStep) {
      case 1:
        console.log(data);
        setCheckedTravelCountry(data.travelCountry);
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
        setIsShowVerifySingleCodePopup(false);
    }
  };

  const isExistTcKimlikNoInUserList = (identityNo) => {
    return userList.some((item) => item.identityNo == identityNo);
  };

  const onChangeGidisTarihi = (value) => {
    clearErrors("goDate");

    let { goDate, returnDate } = state;
    goDate = value;
    const dateGoDate = new Date(goDate);
    const dateReturnDate = new Date(returnDate);

    if (dateGoDate > dateReturnDate) {
      setError("goDate", {
        type: "manual",
        message: "Gidiş tarihi dönüş tarihinden önce olmalıdır.",
      });
      //returnDate = goDate;
    } else if (new Date(addDaysToDate(2, goDate)) >= dateReturnDate) {
      setError("goDate", {
        type: "manual",
        message: "Seyahat tarih aralığınız minimum 3 gün olmalıdır.",
      });
    } else {
      clearErrors("returnDate");
    }
    setState({
      ...state,
      goDate: goDate,
      returnDate: returnDate,
    });
  };

  const onChangeDonusTarihi = (value) => {
    clearErrors("returnDate");

    let { goDate, returnDate } = state;
    returnDate = value;
    const dateGoDate = new Date(goDate);
    const dateReturnDate = new Date(returnDate);

    if (dateReturnDate < dateGoDate) {
      setError("returnDate", {
        type: "manual",
        message: "Dönüş tarihi gidiş tarihinden sonra olmalıdır.",
      });
      //goDate = returnDate;
    } else if (new Date(addDaysToDate(2, state.goDate)) >= dateReturnDate) {
      setError("returnDate", {
        type: "manual",
        message: "Seyahat tarih aralığınız minimum 3 gün olmalıdır.",
      });
    } else {
      clearErrors("goDate");
    }
    setState({
      ...state,
      goDate: goDate,
      returnDate: returnDate,
    });
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

  const onChangeDogumTarihi = (e, index) => {
    setValue("birthDate" + index, e.target.value.toString());
    clearErrors("birthDate" + index);

    let userListClone = cloneDeep(userList);
    let userIndex = userListClone.findIndex((value) => value.index == index);
    userListClone[userIndex].birthDate = e.target.value.toString();
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

    if (lastUser.birthDate.trim().replaceAll("_", "").replaceAll(".", "").length != 8) {
      setError("birthDate" + lastUserIndex, {
        type: "manual",
        message: "Doğum Tarihi Zorunlu",
      });
      return false;
    }

    if (!Object.keys(errors).length) {
      return true;
    }
  };

  const onAddUserForHealthInsurance = () => {
    if (checkUserFormElements()) {
      let userListClone = cloneDeep(userList);
      userListClone.push({
        identityNo: "",
        birthDate: "",
        index: userListClone.slice(-1)[0].index + 1,
      });
      setUserList(userListClone);
    }
  };

  const onRemoveUserForHealthInsurance = (index) => {
    // let userIndex = userListForHealthInsurance.findIndex((value) => value.index == index);
    // let clearButton = document
    //   .getElementsByClassName("relation" + index)[0]
    //   .getElementsByClassName("MuiAutocomplete-clearIndicator")[0];
    // clearButton && clearButton.click();

    let userListClone = cloneDeep(userList);
    let userIndex = userListClone.findIndex((value) => value.index == index);
    userListClone.splice(userIndex, 1);
    setUserList(userListClone);

    // console.log("userIndex: ", userIndex);
    // userListForHealthInsurance.splice(userIndex, 1);
    // selectedUsersRelation.splice(userIndex, 1);

    // setState({
    //   ...state,
    //   userListForHealthInsurance: userListForHealthInsurance,
    //   selectedUsersRelation: selectedUsersRelation,
    // });

    // let clearButton = document
    //   .getElementsByClassName("relation" + index)[0]
    //   .getElementsByClassName("MuiAutocomplete-clearIndicator")[0];

    // clearButton && clearButton.click();
    // document.getElementsByName("identityNo1")[0].focus();

    resetField("identityNo" + index);
    resetField("birthDate" + index);
    clearErrors();
  };

  const saveInquiryInformations = () => {
    let ownInfo = {};
    let travelMembersInfo = [];

    for (var i = 0; i < userList.length; i++) {
      let birthDateParts = userList[i].birthDate.split(".");
      let birthDate = birthDateParts[2] + "-" + birthDateParts[1] + "-" + birthDateParts[0];
      if (i == 0) {
        ownInfo.identityNo = userList[i].identityNo.toString();
        ownInfo.birthDate = birthDate + "T00:00:00";
      } else {
        let singleMember = {
          identityNo: userList[i].identityNo.toString(),
          birthDate: birthDate + "T00:00:00",
        };
        travelMembersInfo.push(singleMember);
      }
    }

    let inquiryInformations = {
      companyCode: 0,
      insured: {
        ...ownInfo,
        contact: {
          email: state.email,
          mobilePhone: state.phoneNumber
            .toString()
            .replaceAll(" ", "")
            .replaceAll("(", "")
            .replaceAll(")", ""),
        },
      },
      travelMembers: travelMembersInfo,
      travel: {
        isDomestic: true,
        startDate: state.goDate + "T00:00:00",
        endDate: state.returnDate + "T00:00:00",
        location: {
          cityCode: 0,
          place: "string",
        },
      },
    };

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
              {/* {JSON.stringify(userList)}
              GoDate: {JSON.stringify(state.goDate)}
              ReturnDate: {JSON.stringify(state.returnDate)} */}
              <form autoComplete="off" onSubmit={handleSubmit(validateStep)}>
                {/**Gidiş Dönüş Tarihi */}
                <h4 className="mt-2 mb-3">
                  <b>Gidiş Dönüş Tarihi</b>
                </h4>
                <div className="row gidis-donus-tarih-secimi">
                  <div className="col-12 col-md-6 col-lg-6 form-group mt-2">
                    <Controller
                      name="goDate"
                      rules={{ required: "Gidiş Tarihi Zorunlu" }}
                      control={control}
                      defaultValue="" // 👈 set defaultValue to ""
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          onChange={(value) => {
                            clearErrors("goDate");
                            setValue("goDate", value);
                            onChangeGidisTarihi(value);
                          }}
                          minDate={getTodayDate()}
                          textFieldProps={{
                            error: errors && Boolean(errors["goDate"]),
                            label: "Gidiş Tarihi",
                          }}
                        />
                      )}
                    />

                    <small className="text-danger">
                      {errors && errors["goDate"]?.message}
                      {/**Validate Message */}
                      {errors && errors.goDate && errors.goDate.type == "validate"
                        ? "Geçersiz Gidiş Tarihi"
                        : ""}
                    </small>
                  </div>
                  <div className="col-12 col-md-6 col-lg-6 form-group mt-2">
                    <Controller
                      name="returnDate"
                      rules={{ required: "Dönüş Tarihi Zorunlu" }}
                      control={control}
                      defaultValue="" // 👈 set defaultValue to ""
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          onChange={(value) => {
                            clearErrors("returnDate");
                            setValue("returnDate", value);
                            onChangeDonusTarihi(value);
                          }}
                          minDate={getTodayDate()}
                          textFieldProps={{
                            error: errors && Boolean(errors["returnDate"]),
                            label: "Dönüş Tarihi",
                          }}
                        />
                      )}
                    />

                    <small className="text-danger">
                      {errors && errors["returnDate"]?.message}
                      {/**Validate Message */}
                      {errors && errors.returnDate && errors.returnDate.type == "validate"
                        ? "Geçersiz Dönüş Tarihi"
                        : ""}
                    </small>
                  </div>
                </div>
                {/**Gidilecek Ülke */}

                <h4 className="mt-4 mb-2">
                  <b>Gidilecek Ülke</b>
                </h4>
                <div className="radio-gidilecek-ulke">
                  {/* <Controller
                    name="travelCountry"
                    rules={{ required: "Lütfen Seyahat Edeceğiniz Yeri Seçiniz." }}
                    control={control}
                    defaultValue="" // 👈 set defaultValue to ""
                    render={({ field: { onChange, value } }) => (
                      <RadioGroup
                        row={false}
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        style={{ display: "flex", justifyContent: "space-between" }}
                        value={checkedTravelCountry}
                        onChange={(e, value) => {
                          clearErrors("travelCountry");
                          setCheckedTravelCountry(value);
                        }}
                      >
                        <FormControlLabel
                          value="radioEuroCountry"
                          control={<Radio sx={radioButtonSx} />}
                          label="Avrupa Ülkeleri"
                          sx={{ mb: "-5px" }}
                        />
                        <FormControlLabel
                          value="radioOtherCountry"
                          //value={true}
                          control={<Radio sx={radioButtonSx} />}
                          label="Avrupa Dışı Tüm Dünya Ülkeleri"
                          sx={{ mb: "0px" }}
                        />
                      </RadioGroup>
                    )}
                  /> */}
                  <Controller
                    rules={{ required: "Lütfen Seyahat Edeceğiniz Yeri Seçiniz" }}
                    control={control}
                    name="travelCountry"
                    render={({ field }) => (
                      <RadioGroup {...field}>
                        <FormControlLabel
                          value="radioEuroCountry"
                          control={<Radio sx={radioButtonSx} />}
                          label="Avrupa Ülkeleri"
                          sx={{ mb: "-5px" }}
                        />
                        <FormControlLabel
                          value="radioOtherCountry"
                          //value={true}
                          control={<Radio sx={radioButtonSx} />}
                          label="Avrupa Dışı Tüm Dünya Ülkeleri"
                          sx={{ mb: "0px" }}
                        />
                      </RadioGroup>
                    )}
                  />

                  <small className="text-danger">
                    {errors && errors["travelCountry"]?.message}
                  </small>
                </div>

                {/**Sigorta yaptıracak kişi listesi */}
                <h4 className="mt-4 mb-3">
                  <b>Kimler Gidiyor ?</b>
                </h4>
                {userList.map((user, index) => (
                  <div className="user-list-for-health-insurance-wrapper" key={index}>
                    <div className="row">
                      <div className="col-12 col-md-6 col-lg-6 mt-2 mb-2 tc-kimlik-no">
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

                      <div className="col-12 col-md-6 col-lg-6 mt-2 mb-2  select-yakinlik-derecesi">
                        <Controller
                          control={control}
                          name={"birthDate" + user.index}
                          rules={{
                            required: "Doğum Tarihi Zorunlu",
                            validate: isValidMaskedDate,
                          }}
                          defaultValue="" // 👈 set defaultValue to ""
                          render={({
                            field: { onChange, onBlur, value, name, ref },
                            fieldState: { invalid, isTouched, isDirty, error },
                            formState,
                          }) => (
                            <TextField
                              type="text"
                              InputProps={{
                                inputProps: {
                                  max: getTodayDate(),
                                  min: "1900-01-01",
                                  className: "date-mask",
                                },
                              }}
                              onKeyUp={(e) => onChangeDogumTarihi(e, index)}
                              value={user.birthDate}
                              sx={inputStyle}
                              size="small"
                              error={Boolean(errors["birthDate" + user.index])}
                              label="Doğum Tarihi *"
                              placeholder="gg.aa.yyyy"
                            />
                          )}
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
                    </div>
                    {(() => {
                      if (userList.length > 1 && user.index != 0) {
                        return (
                          <div className="row remove-person mt-2">
                            <div className="col">
                              <a
                                href="#"
                                onClick={() => onRemoveUserForHealthInsurance(user.index)}
                              >
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
                    <a href="#" onClick={() => onAddUserForHealthInsurance()}>
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
        className="stepContainer animate__animated  animate__fadeInRight"
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

      <section className="section mt-5">
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
      </section>
    </>
  );
}
