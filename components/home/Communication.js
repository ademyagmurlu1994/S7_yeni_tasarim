import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

/**/
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "/components/form/Button";

import { CommunicationImage } from "/resources/images";

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

const ClientFeedbacks = () => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    control,
    watch,
    formState: { errors },
  } = useForm();
  const [state, setState] = useState({
    nameSurname: "",
    email: undefined,
    phoneNumber: "",
    message: "",
  });

  const [formVisibleCounter, setFormVisibleCounter] = useState(1);

  const topics = ["Konu başlığı 1", "Konu başlığı 2", "Konu başlığı 3", "Konu başlığı 4"];
  const [selectedTopic, setSelectedTopic] = useState("");

  const handleBlur = (value) => {
    if (watch()[Object.keys(watch()).slice(-1)[0]] != "") {
      setFormVisibleCounter((prev) => prev + 1);
    }
  };

  const validateData = (data) => {
    console.log(data);
  };

  return (
    <>
      <section className="communication-section  home-page-section">
        <div className="container container-large">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-7">
              <img src={CommunicationImage} alt="" style={{ width: "80%" }} />
            </div>
            <div className="col-xs-12 col-sm-12 col-md-5">
              <form onSubmit={handleSubmit(validateData)}>
                <h2 className="section-title text-left">İletişim Formu</h2>

                {/**Ad Soyad */}
                <div>
                  <TextField
                    {...register("nameSurname", {
                      required: "Ad Soyad Zorunlu",
                    })}
                    value={state.nameSurname}
                    onChange={(e) => {
                      setState({
                        ...state,
                        nameSurname: e.target.value,
                      });
                      setValue("nameSurname", e.target.value);
                      clearErrors("nameSurname");
                    }}
                    onBlur={() => handleBlur()}
                    sx={inputStyle}
                    error={errors && Boolean(errors["nameSurname"])}
                    label="Ad Soyad *"
                  />
                  <small className="text-danger">{errors && errors["nameSurname"]?.message}</small>
                </div>
                {/**E Posta */}
                {formVisibleCounter >= 2 && (
                  <div className="mt-4">
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
                      onBlur={() => handleBlur()}
                      type="email"
                      sx={inputStyle}
                      error={errors && Boolean(errors["emailAddress"])}
                      label="E-posta adresi *"
                    />
                    <small className="text-danger">
                      {errors && errors["emailAddress"]?.message}
                    </small>
                  </div>
                )}

                {/**Cep Telefonu */}
                {formVisibleCounter >= 3 && (
                  <div className="mt-4">
                    <TextField
                      {...register("cepTelefonNo", {
                        required: "Cep Telefonu Numarası Zorunlu",
                        validate: isValidPhoneNumber,
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
                      onBlur={() => handleBlur()}
                      placeholder="(5xx) xxx xx xx"
                      type="tel"
                      InputProps={{
                        inputProps: {
                          className: "phoneNumber",
                        },
                      }}
                      id="phone"
                      sx={inputStyle}
                      error={errors && Boolean(errors["cepTelefonNo"])}
                      label="Cep Telefonu *"
                    />
                    <small className="text-danger">
                      {errors && errors["cepTelefonNo"]?.message}
                      {errors["cepTelefonNo"] &&
                        errors["cepTelefonNo"].type == "validate" &&
                        "Geçersiz Cep Telefon Numarası"}
                    </small>
                  </div>
                )}

                {/**Konu Başlığı */}
                {formVisibleCounter >= 4 && (
                  <div className="mt-4">
                    <Autocomplete
                      value={selectedTopic}
                      onChange={(event, newValue) => {
                        setSelectedTopic(newValue);
                        handleBlur();
                      }}
                      options={topics}
                      sx={inputStyle}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Konu Başlığı"
                          placeholder="Konu Başlığı Seçiniz"
                          required={true}
                        />
                      )}
                    />
                  </div>
                )}

                {/**Mesajınız */}
                {formVisibleCounter >= 5 && (
                  <div className="mt-4">
                    <TextField
                      {...register("userMessage", {
                        required: "Mesaj Alanı Zorunlu",
                      })}
                      value={state.message}
                      onChange={(e) => {
                        setState({ ...state, message: e.target.value });
                        setValue("userMessage", e.target.value);
                        clearErrors("userMessage");
                      }}
                      onBlur={() => handleBlur("message")}
                      sx={inputStyle}
                      multiline
                      rows={4}
                      maxRows={4}
                      maxLength="250"
                      error={errors && Boolean(errors["userMessage"])}
                      label="Mesajınız *"
                    />
                    <small className="text-danger">
                      {errors && errors["userMessage"]?.message}
                    </small>
                  </div>
                )}

                {/**Hukum ve Kosul */}
                <div className="news-notification-confirmation mt-4">
                  <div className="form-chec" style={{ display: "flex", alignItems: "flex-start" }}>
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
                      Devam ederek{" "}
                      <a href="#">
                        {" "}
                        <u>Hüküm ve Koşulları</u>{" "}
                      </a>{" "}
                      kabul ediyorum. Verilerinizin gizliliği hakkında daha fazla bilgi için{" "}
                      <a href="#">
                        <u>Gizlilik Politikamıza</u>
                      </a>{" "}
                      bakabilirsiniz.
                    </label>
                  </div>
                </div>
                <Button type="submit" className="w-50 mt-4" disabled={!state.message}>
                  Formu Gönder
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ClientFeedbacks;
