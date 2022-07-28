import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import axios from "/instances/axios";
import { cloneDeep, cloneDeepWith, clone } from "lodash-es";
import { toast } from "react-toastify";

//Componentler
import PopupAlert from "/components/pop-up/PopupAlert";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import PreFormLoader from "/components/PreFormLoader";
import Button from "/components/form/Button";

//fonksiyonlar
import {
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
  getNewToken,
  isValidMaskedDate,
  changeDateFormat,
  isValidTcKimlikOrVergiKimlik,
} from "/functions/common";

//Styles
import { inputStyle } from "/styles/custom";
import { radioButtonSx } from "/styles/inputStyle";

const PrevPolicy = ({ insuranceService, insurancePrevPolicy, token, onChange }) => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  //http request urls
  const [insuranceCompanyReqUrl, setInsuranceCompanyReqUrl] = useState("");

  //flags
  const [isExistPrevPolicy, setIsExistPrevPolicy] = useState("false");
  const [isExistMissingInfo, setIsExistMissingInfo] = useState(undefined);
  const [isEditPrevPolicy, setIsEditPrevPolicy] = useState(false);
  const [isSetInitialInputData, setIsSetInitialInputData] = useState(false);

  const [loader, setLoader] = useState({
    insuranceCompanies: false,
  });

  //AutoComplete verileri
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);

  //Input Variables
  const [selectedInsuranceCompany, setSelectedInsuranceCompany] = useState("");
  const [endDate, setEndDate] = useState("");
  const [policyNo, setPolicyNo] = useState("");
  const [renewalNo, setRenewalNo] = useState("");
  const [agencyNo, setAgencyNo] = useState("");

  useEffect(() => {
    if (insuranceService && insuranceService == "traffic") {
      setInsuranceCompanyReqUrl("/api/quote/v1/traffic/getinsurancecompanies");
    } else {
      setInsuranceCompanyReqUrl("/api/quote/v1/casco/getinsurancecompanies");
    }
  }, [insuranceService]);

  useEffect(() => {
    if (insuranceCompanyReqUrl && insuranceCompanies.length == 0) {
      getInsuranceCompanies();
    }
  }, [insuranceCompanyReqUrl]);

  useEffect(() => {
    prevPolicyMissingInfoControl();
    if (insurancePrevPolicy && Object.keys(insurancePrevPolicy).length > 0) {
      console.log("PrevPolicy", insurancePrevPolicy);
      setIsSetInitialInputData(true);
    }
  }, [insurancePrevPolicy]);

  //PrevPolicy varsa inputlara atama yapılıyor
  useEffect(() => {
    if (
      insuranceCompanies &&
      insuranceCompanies.length > 0 &&
      insurancePrevPolicy &&
      Object.keys(insurancePrevPolicy).length > 0
    ) {
      prevPolicyMissingInfoControl();
      setInitialInputData();
      setIsSetInitialInputData(false);
    }
  }, [insuranceCompanies, insurancePrevPolicy]);

  //date-mask sıfırlandığı için kullanıldı
  useEffect(() => {
    if (
      insurancePrevPolicy &&
      Object.keys(insurancePrevPolicy).length > 0 &&
      endDate &&
      isExistPrevPolicy &&
      document.getElementsByName("endDate") &&
      document.getElementsByName("endDate")[0] &&
      document.getElementsByName("endDate")[0].value
    ) {
      console.log("PrevPolicy b:", insurancePrevPolicy);
      setIsSetInitialInputData(true);
      setInitialInputData();
      setIsSetInitialInputData(false);
    }
  }, [isExistPrevPolicy]);

  //normal fonksiyonlar
  const validateData = async (data) => {
    if (onChange) {
      const prevPolicy = null;
      if (isExistPrevPolicy === true || isExistPrevPolicy === "true") {
        prevPolicy = {
          PolicyNo: policyNo || null,
          RenewalNo: renewalNo || null,
          AgencyNo: agencyNo || null,
          InsCompanyCode: selectedInsuranceCompany?.companyCode?.toString() || null,
          EndDate: endDate ? changeDateFormat(endDate, "yyyy-MM-dd") : null,
        };
      }

      onChange(prevPolicy);
    }
  };

  //prevpolicy eksik bilgi kontrolü
  const prevPolicyMissingInfoControl = () => {
    if (
      insurancePrevPolicy == null ||
      insurancePrevPolicy.policyNo == null ||
      insurancePrevPolicy.policyNo == undefined ||
      insurancePrevPolicy.renewalNo == null ||
      insurancePrevPolicy.renewalNo == undefined ||
      insurancePrevPolicy.agencyNo == null ||
      insurancePrevPolicy.agencyNo == undefined ||
      insurancePrevPolicy.insCompanyCode == null ||
      insurancePrevPolicy.insCompanyCode == undefined ||
      insurancePrevPolicy.endDate == null ||
      insurancePrevPolicy.endDate == undefined
    ) {
      setIsExistMissingInfo(true);
      setIsEditPrevPolicy(true);

      setIsSetInitialInputData(false);
      setIsExistPrevPolicy("false");
    } else {
      setIsExistMissingInfo(false);
      setIsEditPrevPolicy(false);
      setIsExistPrevPolicy("true");
    }
  };

  const setInitialInputData = () => {
    setPolicyNo(insurancePrevPolicy.policyNo || "");
    setValue("policyNo", insurancePrevPolicy.policyNo);
    setRenewalNo(insurancePrevPolicy.renewalNo || "");
    setValue("renewalNo", insurancePrevPolicy.renewalNo);
    setAgencyNo(insurancePrevPolicy.agencyNo || "");
    setValue("agencyNo", insurancePrevPolicy.agencyNo);
    let foundCompany =
      insurancePrevPolicy.insCompanyCode &&
      insuranceCompanies.find(
        (item) => Number(item.companyCode) == Number(insurancePrevPolicy.insCompanyCode)
      );
    setSelectedInsuranceCompany(foundCompany || "");

    setTimeout(() => {
      setEndDate(changeDateFormat(insurancePrevPolicy.endDate, "dd.MM.yyyy") || "");
      setValue("endDate", changeDateFormat(insurancePrevPolicy.endDate, "dd.MM.yyyy") || "");
    }, 500);
  };

  //http requestler

  const getInsuranceCompanies = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    setInsuranceCompanies([]);
    setLoader({ ...loader, insuranceCompanies: true });

    try {
      await axios
        .get(insuranceCompanyReqUrl, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            console.log(res.data);
            setInsuranceCompanies(res.data.data);
            setLoader({ ...loader, insuranceCompanies: false });
          }
        });
    } catch (error) {
      setLoader({ ...loader, insuranceCompanies: false });
      writeResponseError(error);
      //toast.error("Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(validateData)} id="fourthStep">
        <Alert severity="warning" className="mt-2 mb-2">
          Dikkat: Poliçe bilgilerini girmeden devam etmeniz halinde hasarsızlık indiriminiz varsa bu
          indirimden yararlanamayacaksınız.
        </Alert>

        <RadioGroup
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          className="mb-2"
          style={{ display: "flex", justifyContent: "space-between" }}
          value={isExistPrevPolicy}
          onChange={(e, value) => {
            setIsExistPrevPolicy(value);
          }}
        >
          <FormControlLabel
            value={false}
            control={<Radio sx={radioButtonSx} />}
            label={`Mevcut ya da yeni ${
              insuranceService == "casco" ? "kasko" : "trafik"
            } poliçem yok`}
            sx={{ marginBottom: "-12px" }}
          />
          <FormControlLabel
            value={true}
            control={<Radio sx={radioButtonSx} />}
            label={`Mevcut ya da yeni ${
              insuranceService == "casco" ? "kasko" : "trafik"
            } poliçem var`}
            sx={{ marginBottom: "-12px" }}
          />
        </RadioGroup>

        {(isExistPrevPolicy == true || isExistPrevPolicy == "true") && (
          <div className="exist-license-policy">
            {!isEditPrevPolicy && (
              <div className="d-flex justify-content-end">
                <Button
                  variant="text"
                  disableRipple
                  style={{ textTransform: "none" }}
                  onClick={() => {
                    setIsEditPrevPolicy(true);
                  }}
                  sx={{ marginBottom: "-10px" }}
                >
                  Düzenle <i className="mdi mdi-lead-pencil"></i>
                </Button>
              </div>
            )}
            {isSetInitialInputData ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ display: "block", padding: "0px" }}>
                  <PreFormLoader />
                </div>
              </div>
            ) : (
              <>
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-6 mt-4">
                    <Autocomplete
                      value={selectedInsuranceCompany || ""}
                      onChange={(event, newValue) => {
                        setSelectedInsuranceCompany(newValue);
                      }}
                      options={insuranceCompanies}
                      getOptionLabel={(option) => (option.companyCode ? option.company : "")}
                      sx={{ width: "100%" }}
                      size="small"
                      disabled={loader.insuranceCompanies || !isEditPrevPolicy}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Poliçe Sigorta Şirketi"
                          placeholder="Poliçe Sigorta Şirketi seçiniz"
                          required={true}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loader.insuranceCompanies ? (
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
                  <div className="col-12 col-md-6 col-lg-6 mt-4">
                    <TextField
                      {...register("endDate", {
                        required: "Poliçe Bitiş Tarihi Zorunlu",
                        validate: isValidMaskedDate,
                      })}
                      InputLabelProps={{
                        shrink: true,
                        //required: true,
                        fontSize: "15pt",
                      }}
                      InputProps={{
                        inputProps: {
                          className: "date-mask",
                        },
                      }}
                      value={endDate || ""}
                      onKeyUp={(e) => {
                        {
                          setEndDate(e.target.value);
                          clearErrors("endDate");
                          setValue("endDate", e.target.value);
                        }
                      }}
                      sx={inputStyle}
                      disabled={!isEditPrevPolicy}
                      size="small"
                      error={errors && Boolean(errors["endDate"])}
                      label="Poliçe Bitiş Tarihi *"
                      placeholder="gg.aa.yyyy"
                      autoComplete="off"
                    />

                    <small className="text-danger">
                      {errors && errors["endDate"]?.message}
                      {/**Validate Message */}
                      {errors && errors.endDate && errors.endDate.type == "validate"
                        ? "Geçersiz Poliçe Bitiş Tarihi"
                        : ""}
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-4 mt-4">
                    <TextField
                      {...register("policyNo", {
                        required: "Poliçe No Zorunlu",
                      })}
                      InputProps={{
                        inputProps: {
                          type: "number",
                          maxLength: "16",
                        },
                      }}
                      value={policyNo || ""}
                      onChange={(e) => {
                        {
                          setPolicyNo(e.target.value.toUpperCase());
                          clearErrors("policyNo");
                          setValue("policyNo", e.target.value);
                        }
                      }}
                      sx={inputStyle}
                      disabled={!isEditPrevPolicy}
                      size="small"
                      error={errors && Boolean(errors["policyNo"])}
                      label="Poliçe No *"
                      autoComplete="off"
                    />

                    <small className="text-danger">{errors && errors["policyNo"]?.message}</small>
                  </div>
                  <div className="col-12 col-md-6 col-lg-4 mt-4">
                    <TextField
                      {...register("renewalNo", {
                        required: "Yenileme No Zorunlu",
                      })}
                      InputProps={{
                        inputProps: {
                          type: "number",
                          maxLength: "3",
                        },
                      }}
                      value={renewalNo || ""}
                      onChange={(e) => {
                        {
                          setRenewalNo(e.target.value.toUpperCase());
                          clearErrors("renewalNo");
                          setValue("renewalNo", e.target.value);
                        }
                      }}
                      sx={inputStyle}
                      disabled={!isEditPrevPolicy}
                      size="small"
                      error={errors && Boolean(errors["renewalNo"])}
                      label="Yenileme No *"
                      autoComplete="off"
                    />

                    <small className="text-danger">{errors && errors["renewalNo"]?.message}</small>
                  </div>
                  <div className="col-12 col-md-6 col-lg-4 mt-4">
                    <TextField
                      {...register("agencyNo", {
                        required: "Acente No Zorunlu",
                      })}
                      InputProps={{
                        inputProps: {
                          type: "text",
                        },
                      }}
                      value={agencyNo || ""}
                      onChange={(e) => {
                        {
                          setAgencyNo(e.target.value.toUpperCase());
                          clearErrors("agencyNo");
                          setValue("agencyNo", e.target.value);
                        }
                      }}
                      sx={inputStyle}
                      disabled={!isEditPrevPolicy}
                      size="small"
                      error={errors && Boolean(errors["agencyNo"])}
                      label="Acente No *"
                      autoComplete="off"
                    />

                    <small className="text-danger">{errors && errors["agencyNo"]?.message}</small>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <Alert severity="info" className="mt-4 mb-3">
          <div className="information-policy">
            <strong>Mevcut poliçe bilgilerine:</strong>
            <ul>
              <li>
                E-devlet üzerinden
                <a href="https://www.turkiye.gov.tr/sbm-trafik-police-sorgulama" target="_blank">
                  {" "}
                  buraya tıklayarak{" "}
                </a>
                erişebilirsiniz. E-devlet şifrenizi unuttuysanız
                <a href="https://giris.turkiye.gov.tr/Giris/SifremiUnuttum" target="_blank">
                  {" "}
                  buraya tıklayarak{" "}
                </a>
                detaylı bilgi alabilirsiniz.
              </li>
              <li>
                E-devlet şifreniz yoksa bankaların internet şubeleri aracılığı ile başka bir şifreye
                ihtiyaç duymadan buraya tıklayarak e-devlete giriş yapabilirsiniz.
              </li>
            </ul>
          </div>
        </Alert>

        <Button
          disabled={isSetInitialInputData && isExistPrevPolicy == "true"}
          type="submit"
          className="w-100 mt-3"
        >
          Teklifleri Getir
        </Button>
      </form>
    </>
  );
};

export default PrevPolicy;
