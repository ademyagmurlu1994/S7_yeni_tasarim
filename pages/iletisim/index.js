import Link from "next/link";
import { logo } from "/resources/images";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";
import { Router } from "react-router-dom";

//components
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import Button from "/components/form/Button";
import PopupAlert from "/components/pop-up/PopupAlert";
import PhotoViewer from "/components/pop-up/PhotoViewer";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
/**==================*/
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

//Styles
import { radioButtonSx } from "/styles/inputStyle";
import { inputStyle } from "/styles/custom";

//fonksiyonlar
import {
  isValidTcKimlik,
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
} from "/functions/common";

const Input = styled("input")({
  display: "none",
});

const Login = () => {
  const router = useRouter();
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

  const formOptions = [
    { label: "Poliçemi iptal etmek istiyorum", value: 0 },
    { label: "Hasar işlemleri için destek istiyorum", value: 1 },
    { label: "Şikayet Yazmak İstiyorum", value: 2 },
    { label: "Öneri Yazmak İstiyorum", value: 3 },
  ];

  const serviceRadioData = [
    { label: "Kasko", value: 0 },
    { label: "Trafik", value: 1 },
    { label: "Kasko + Trafik", value: 2 },
  ];

  const cancelReasons = [
    { label: "Satıştan", value: 0 },
    { label: "Diğer", value: 1 },
  ];

  const [state, setState] = useState({
    identityNo: "",
    phoneNumber: "",
    email: "",
    password: "",
    textareaInfo: "",
    textareaCancel: "",
    textareaPlaceholder: "",
    isShowOrnekDilekce: false,
    isShowVerifyCode: false,
  });

  const [selectedFormOption, setSelectedFormOption] = useState("");
  const [checkedCancelRadio, setCheckedCancelRadio] = useState();
  const [selectedCancelReason, setSelectedCancelReason] = useState("");
  const [showSuccessInfoPopup, setShowSuccessInfoPopup] = useState(false);

  useEffect(() => {
    if (Object.keys(router.query)) {
      let selection = formOptions.find(
        (item) => Number(item.value) === Number(router.query.option)
      );
      setSelectedFormOption(selection);
      onChangeSelectedFormOption(selection);
    }
  }, [router.query]);

  const onChangeSelectedFormOption = (select) => {
    let text = "";
    if (select && select.value) {
      switch (select.value) {
        case 1:
          text = "Destek istediğiniz Hasar işlemi hakkında bilgi verebilir misiniz?";
          break;
        case 2:
          text = "Şikayetinizi belirtebilirsiniz.";
          break;
        case 3:
          text = "Önerinizi belirtebilirsiniz.";
          break;
      }
    }

    setState({ ...state, textareaPlaceholder: text, textareaInfo: "" });
    clearErrors();
  };

  const validateData = (data) => {
    setShowSuccessInfoPopup(true);
  };

  const onCloseInfoPopup = () => {
    setTimeout(() => {
      setShowSuccessInfoPopup(false);
      router.push("/");
    }, 2000);
  };

  return (
    <>
      <PopupAlert show={showSuccessInfoPopup} onClose={() => onCloseInfoPopup()}>
        <p className="text-center">
          <h4>
            <b> Mesajınızı Aldık</b>
          </h4>
          En kısa sürede sizinle iletişime geçeceğiz
        </p>
      </PopupAlert>
      <PhotoViewer
        show={state.isShowOrnekDilekce}
        onClose={() => setState({ ...state, isShowOrnekDilekce: false })}
        photo="https://cdnsnet.mncdn.com/facelift/assets/img/elements/signed-example.jpg"
      ></PhotoViewer>
      <section className="section">
        <div className="container animate__animated animate__backInUp">
          <h3 className="mt-4 text-center text-secondary">
            <b>İletişim Formu</b>
          </h3>
          <div className="iletisim-form-wrapper">
            <div className="iletisim-form">
              <form autoComplete="off" className="w-100" onSubmit={handleSubmit(validateData)}>
                <div className="w-100 mt-3 ">
                  <Controller
                    name={"formOption"}
                    control={control}
                    // rules={
                    // }
                    render={(props) => (
                      <Autocomplete
                        value={selectedFormOption}
                        onChange={(_, newValue) => {
                          onChangeSelectedFormOption(newValue);
                          setSelectedFormOption(newValue);
                        }}
                        options={formOptions}
                        getOptionLabel={(option) => option.label}
                        sx={{ width: "100%" }}
                        size="small"
                        {...props}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Nasıl Yardımcı Olabiliriz?"
                            placeholder="Nasıl Yardımcı Olabiliriz?"
                            //error={Boolean(errors["relation" + user.index])}
                            sx={inputStyle}
                            //required={true}
                            InputProps={{
                              ...params.InputProps,
                            }}
                          />
                        )}
                      />
                    )}
                  />
                  {/* <small className="text-danger">{errors["relation" + user.index]?.message}</small> */}
                </div>
                {selectedFormOption && (
                  <>
                    <div className="row">
                      <div className="col-12 col-md-6 col-lg-6 mt-4 mb-2 tc-kimlik-no">
                        <Controller
                          control={control}
                          name={"identityNo"}
                          rules={{
                            required: "T.C. Kimlik Numarası Zorunlu",
                            validate: isValidTcKimlik,
                          }}
                          render={({ field: { onChange, onBlur, value, name, ref } }) => (
                            <TextField
                              type="number"
                              onChange={(e) => {
                                setState({ ...state, identityNo: e.target.value });
                                setValue("identityNo", e.target.value);
                                clearErrors("identityNo");
                              }}
                              value={state.identityNo || ""}
                              sx={inputStyle}
                              size="small"
                              error={Boolean(errors["identityNo"])}
                              label="T.C. Kimlik Numarası *"
                              maxLength={11}
                            />
                          )}
                        />

                        <small className="text-danger">
                          {errors["identityNo"]?.message}
                          {/**Validate Message */}
                          {errors["identityNo"] &&
                            errors["identityNo"].type == "validate" &&
                            "Geçersiz T.C. Kimlik Numarası"}
                        </small>
                      </div>
                      {/* Radio Buttons */}
                      {selectedFormOption.value == 0 ? (
                        <>
                          <div className="col-12 mt-4 mb-2">
                            <Controller
                              rules={{ required: "Lütfen iptal etmek istediğiniz servisi seçiniz" }}
                              control={control}
                              name="serviceRadio"
                              render={({ field }) => (
                                <RadioGroup
                                  {...field}
                                  onChange={(e) => {
                                    setCheckedCancelRadio(e.target.value);
                                    setValue("serviceRadio", e.target.value);
                                    clearErrors("serviceRadio");
                                  }}
                                >
                                  {serviceRadioData.map((service, index) => {
                                    return (
                                      <>
                                        <FormControlLabel
                                          value={service.value}
                                          control={<Radio sx={radioButtonSx} />}
                                          label={service.label}
                                          sx={{ mb: "-5px" }}
                                        />
                                      </>
                                    );
                                  })}
                                </RadioGroup>
                              )}
                            />
                            <small className="text-danger">
                              {errors && errors["serviceRadio"]?.message}
                            </small>
                          </div>

                          {checkedCancelRadio != 0 ? (
                            <div className="col-12 col-md-12 col-lg-12 mt-4">
                              <label htmlFor="contained-button-file" className="w-100">
                                <Input
                                  accept="image/*"
                                  id="contained-button-file"
                                  multiple
                                  type="file"
                                />
                                <Button
                                  type="button"
                                  sx={{ width: "100%" }}
                                  variant="outlined"
                                  component="span"
                                  startIcon={<i class="fas fa-paperclip mr-2"></i>}
                                  endIcon={<i class="fas fa-upload ml-2"></i>}
                                >
                                  Noter Satış Belgesi Ekle
                                </Button>
                              </label>
                            </div>
                          ) : (
                            <div className="col-12 mt-4 mb-2">
                              <Controller
                                name={"cancelReason"}
                                control={control}
                                rules={{ required: "Lütfen iptal nedeninizi seçiniz." }}
                                render={({ field: { onChange, value } }) => (
                                  <Autocomplete
                                    value={selectedCancelReason}
                                    onChange={(_, newValue) => {
                                      setSelectedCancelReason(newValue);
                                      setValue("cancelReason", newValue);
                                      clearErrors("cancelReason");
                                    }}
                                    options={cancelReasons}
                                    getOptionLabel={(option) => option?.label || ""}
                                    sx={{ width: "100%" }}
                                    size="small"
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="İptal Nedeni"
                                        placeholder="Lütfen İptal Nedeni Seçiniz."
                                        error={Boolean(errors["cancelReason"])}
                                        sx={inputStyle}
                                        //required={true}
                                        InputProps={{
                                          ...params.InputProps,
                                        }}
                                      />
                                    )}
                                  />
                                )}
                              />
                              <small className="text-danger">
                                {errors && errors["cancelReason"]?.message}
                              </small>
                              {selectedCancelReason?.value == 1 && (
                                <div className="w-100 mt-4 mb-2">
                                  <Controller
                                    rules={{ required: "Lütfen iptal nedeninizi yazınız." }}
                                    control={control}
                                    name="textareaCancel"
                                    render={({ field }) => (
                                      <TextareaAutosize
                                        {...field}
                                        maxRows={4}
                                        aria-label="maximum height"
                                        placeholder="Lütfen iptal nedeninizi yazınız."
                                        className={`form-control ${
                                          errors.textareaCancel && "invalid"
                                        }`}
                                        style={{ width: "100%", minHeight: "100px" }}
                                        onChange={(e) => {
                                          setState({
                                            ...state,
                                            textareaCancel: e.target.value,
                                          });
                                          clearErrors("textareaCancel");
                                          setValue("textareaCancel", e.target.value);
                                        }}
                                        value={state.textareaCancel}
                                      />
                                    )}
                                  />
                                  <small className="text-danger">
                                    {errors && errors["textareaCancel"]?.message}
                                  </small>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="col-12 col-md-12 col-lg-12 mt-4">
                            <label htmlFor="contained-button-file" className="w-100">
                              <Input
                                accept="image/*"
                                id="contained-button-file"
                                multiple
                                type="file"
                              />
                              <Button
                                type="button"
                                sx={{ width: "100%" }}
                                variant="outlined"
                                component="span"
                                startIcon={<i class="fas fa-file-alt mr-2"></i>}
                                endIcon={<i class="fas fa-upload ml-2"></i>}
                              >
                                İmzalı Dilekçe Ekle
                              </Button>
                            </label>
                            <Alert severity="info" className="mt-3" style={{ fontSize: "11pt" }}>
                              İstediğimiz dilekçe formatı standarttır. Örneği indirip doldurarak
                              yüklemeni rica ederiz. Dilekçe Örneği:{" "}
                              <a
                                href="#"
                                onClick={() => {
                                  setState({ ...state, isShowOrnekDilekce: true });
                                }}
                              >
                                İmzalı Dilekçe Örneği
                              </a>
                            </Alert>
                          </div>
                        </>
                      ) : (
                        <div className="col-12 mt-4 mb-2">
                          <Controller
                            rules={{ required: "Lütfen mesaj alanını doldurunuz." }}
                            control={control}
                            name="textareaInfo"
                            render={({ field }) => (
                              <TextareaAutosize
                                {...field}
                                maxRows={4}
                                aria-label="maximum height"
                                placeholder={state.textareaPlaceholder}
                                className={`form-control ${errors.textareaInfo && "invalid"}`}
                                style={{ width: "100%", minHeight: "100px" }}
                                onChange={(e) => {
                                  setState({
                                    ...state,
                                    textareaInfo: e.target.value,
                                  });
                                  clearErrors("textareaInfo");
                                  setValue("textareaInfo", e.target.value);
                                }}
                                value={state.textareaInfo}
                              />
                            )}
                          />
                          <small className="text-danger">
                            {errors && errors["textareaInfo"]?.message}
                          </small>
                        </div>
                      )}

                      {selectedFormOption.value == 1 && (
                        <>
                          <div className="col-12 mt-4">
                            Kaza Tespit Tutanağı belgesini görüntülemek için{" "}
                            <a
                              href="https://www.sbm.org.tr/upload/sbm/dokumanlar/kaza_tespit_tutanagi.pdf"
                              target="_blank"
                              className="text-main"
                            >
                              tıklayınız.
                            </a>
                          </div>
                          <div className="col-12 mt-2 mb-2">
                            Mobil Kaza Tutanağı belgesini görüntülemek için{" "}
                            <a href="https://mkt.sbm.org.tr/" target="_blank" className="text-main">
                              tıklayınız.
                            </a>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
                <hr className=" mt-4 mb-4" />
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-6">
                    <Button type="submit" sx={{ width: "100%" }} disabled={!selectedFormOption}>
                      Gönder
                    </Button>
                  </div>
                  <div className="col-12 col-md-6 col-lg-6">
                    <Button
                      type="button"
                      variant="outlined"
                      sx={{ width: "100%" }}
                      disabled={!selectedFormOption}
                    >
                      İptal
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="clear-fix"></div>
          <div className="clear-fix"></div>
        </div>
      </section>
    </>
  );
};

export default Login;
