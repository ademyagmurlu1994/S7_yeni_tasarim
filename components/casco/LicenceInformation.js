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

const LicenseInformation = ({
  insuranceService,
  identityType,
  identityNo,
  birthDate,
  email,
  mobilePhone,
  isExistPlate,
  plateNo,
  token,
  onChange,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
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

  //http request urls
  const [carInfoReqUrl, setCarInfoReqUrl] = useState("/api/quote/v1/casco/getcarinfo");
  const [carCompanyReqUrl, setCarCompanyReqUrl] = useState("/api/quote/v1/casco/getmakecodes");
  const [carModelReqUrl, setCarModelReqUrl] = useState("/api/quote/v1/casco/getmodelsbymakecode");
  const [updateCarInfoReqUrl, setUpdateCarInfoReqUrl] = useState(
    "/api/quote/v1/casco/updatecarinfo"
  );

  //flags
  const [isConfirmLicence, setIsConfirmLicence] = useState(false);
  const [isExistMissingInfo, setIsExistMissingInfo] = useState(undefined);
  const [isEditCarInformation, setIsEditCarInformation] = useState(false);

  const [carInformation, setCarInformation] = useState({
    registrationSerialCode: "", //AA
    registrationSerialNo: "", //546465
    registrationDate: "",
    modelYear: undefined,
    makeCode: "",
    makeCodeDescription: "",
    modelCode: "",
    modelCodeDescription: "",
    fuelType: "",
    usageManner: undefined,
    usageMannerDescription: "",
    usageSubstance: undefined,
    usageSubstanceDescription: "",
    motorNo: "",
    chassisNo: "",
    countOfPassengers: 0,
    prevPolicy: {},
  });

  const [loader, setLoader] = useState({
    carInfo: false,
    carCompanies: false,
    carModels: false,
  });

  const [errorVal, setErrorVal] = useState({
    carInfo: false,
    quoteIsNotRecieveMsg: "sdf",
  });

  //AutoComplete verileri
  const [carCompanies, setCarCompanies] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [carModelYears, setCarModelYears] = useState([]);
  const FuelTypes = ["BENZİNLİ - LPG", "DİZEL", "BENZİNLİ"];

  //AutoComplete Selected Variables

  const [selectedCarModelYear, setSelectedCarModelYear] = useState("");
  const [selectedCarCompany, setSelectedCarCompany] = useState("");
  const [selectedCarModel, setSelectedCarModel] = useState("");
  const [selectedFuelType, setSelectedFuelType] = useState();
  const [registrationDate, setRegistrationDate] = useState();
  const [motorNo, setMotorNo] = useState();
  const [chassisNo, setChassisNo] = useState();

  useEffect(() => {
    if (insuranceService && insuranceService == "traffic") {
      setCarInfoReqUrl("/api/quote/v1/traffic/getcarinfo");
      setCarCompanyReqUrl("/api/quote/v1/traffic/getmakecodes");
      setCarModelReqUrl("/api/quote/v1/traffic/getmodelsbymakecode");
      setUpdateCarInfoReqUrl("/api/quote/v1/traffic/updatecarinfo");
    }
  }, [insuranceService]);

  //Model yılı ataması
  useEffect(() => {
    if (isExistPlate) {
      let years = [];
      for (var i = 2022; i >= 1975; i--) {
        years.push(i.toString());
      }
      setCarModelYears(years);
    } else if (isExistPlate == false) {
      setCarModelYears(["2022", "2021"]);
      //getCarCompanies();
    }
  }, [isExistPlate]);

  useEffect(() => {
    if (carCompanies.length >= 1 && selectedCarCompany) {
      setSelectedCarModel("");
      setCarModels([]);
      getCarModels();
    }
  }, [carCompanies, selectedCarCompany]);

  useEffect(() => {
    if (isEditCarInformation == true && carModelYears) {
      // alert("Model yılı edit");
      setSelectedCarModelYear(carInformation.modelYear.toString());
    }
  }, [isEditCarInformation]);

  useEffect(() => {
    if (selectedCarModelYear) {
      getCarCompanies();
    }
  }, [selectedCarModelYear]);

  useEffect(() => {
    if (isEditCarInformation == true) {
      if (carCompanies.length >= 1) {
        setSelectedCarCompany(
          carCompanies.find((item) => Number(item.markaKod) === Number(carInformation.makeCode))
        );
        getCarModels();
      }
    }
  }, [carCompanies]);

  useEffect(() => {
    if (isEditCarInformation == true && carModels.length >= 1) {
      setSelectedCarModel(
        carModels.find((item) => Number(item.tipKod) === Number(carInformation.modelCode))
      );
    }
  }, [carModels]);

  //normal fonksiyonlar
  const setCarInfoByMap = (info) => {
    console.log("Araç Bilgileri: ", JSON.stringify(info));

    let carInfo = cloneDeep(carInformation);
    carInfo.makeCode = info.car.makeCode;
    carInfo.makeCodeDescription = info.car.makeCodeDescription;
    carInfo.modelCode = info.car.modelCode;
    carInfo.modelCodeDescription = info.car.modelCodeDescription;
    carInfo.modelYear = info.car.modelYear;
    carInfo.fuelType = info.car.fuelType;
    carInfo.usageManner = info.car.usageManner;
    carInfo.usageMannerDescription = info.car.usageMannerDescription;
    carInfo.usageSubstance = info.car.usageSubstance;
    carInfo.usageSubstanceDescription = info.car.usageSubstanceDescription;
    carInfo.countOfPassengers = info.car.countOfPassengers;
    carInfo.motorNo = info.car.motorNo;
    carInfo.chassisNo = info.car.chassisNo;
    carInfo.registrationDate = info.car.registrationDate;
    carInfo.prevPolicy = info.prevPolicy;

    carInfoControl(carInfo);
    setSelectedCarModelYear(carInfo.modelYear && carInfo.modelYear);

    setCarInformation({ ...carInformation, ...carInfo });
  };

  const carInfoControl = (info) => {
    if (
      info.makeCode == null ||
      info.modelCode == null ||
      info.modelYear == null ||
      info.fuelType == null ||
      info.usageManner == null ||
      info.motorNo == null ||
      info.chassisNo == null
    ) {
      setIsExistMissingInfo(true);
    } else {
      setIsExistMissingInfo(false);
    }
  };

  const validateData = async (data) => {
    if (onChange) {
      let carInfo = cloneDeep(carInformation);

      if (isEditCarInformation || isExistMissingInfo || isExistPlate == false) {
        if (registrationDate)
          carInfo.registrationDate = changeDateFormat(registrationDate, "yyyy-MM-dd");
        if (selectedCarModelYear) carInfo.modelYear = selectedCarModelYear;
        if (selectedCarCompany) {
          carInfo.makeCode = selectedCarCompany.markaKod;
          carInfo.makeCodeDescription = selectedCarCompany.marka;
        }
        if (selectedCarModel) {
          carInfo.modelCode = selectedCarModel.tipKod;
          carInfo.modelCodeDescription = selectedCarModel.tip;
        }
        if (selectedFuelType) carInfo.fuelType = selectedFuelType;
        if (motorNo) carInfo.motorNo = motorNo;
        if (chassisNo) carInfo.chassisNo = chassisNo;
      }

      if (isEditCarInformation || isExistMissingInfo || !isExistPlate) {
        await updateCarInfo({ ...carInformation, ...carInfo });
      }
      onChange({ ...carInformation, ...carInfo });
    }
  };

  const onConfirmLicence = () => {
    if (
      carInformation.registrationSerialCode.toString().length == 2 &&
      carInformation.registrationSerialNo.toString().length == 6
    ) {
      getCarInfo();
    }

    if (carInformation.registrationSerialCode.toString().length != 2) {
      setError("belgeSeriNo", {
        type: "manual",
        message: "Belge Seri No Alanı Zorunlu",
      });
    } else {
      clearErrors("belgeSeriNo");
    }

    if (carInformation.registrationSerialNo.toString().length != 6) {
      setError("belgeNo", {
        type: "manual",
        message: "Belge No Alanı Zorunlu",
      });
    } else {
      clearErrors("belgeNo");
    }
  };

  const setCarModelByAutoComplete = (model) => {
    let carInfo = cloneDeep(carInformation);
    carInfo.usageManner = model?.tramerAracGrupKod || 0;
    carInfo.usageMannerDescription = model?.tramerAracGrupAciklama || null;
    carInfo.usageSubstance = model?.tramerAracKullanimSekliKod || 0;
    carInfo.usageSubstanceDescription = model?.tramerAracKullanimSekliAciklama || null;

    setSelectedCarModel(model);
    setCarInformation({ ...carInformation, ...carInfo });
    console.log("Car Info model: ", carInfo);
  };

  //http requestler
  const getCarInfo = async () => {
    //Onayla butonuna basıldıktan sonra loader'ı tetiklemek için,
    setIsConfirmLicence(false);
    setLoader({ ...loader, carInfo: true });
    setErrorVal({ ...errorVal, carInfo: "" });

    let carPlateNo = plateNo.toString().replaceAll(" ", "");
    let bodyData = {
      insured: {
        type: identityType, //Vergi vs
        identityNo: identityNo.toString(),
        birthDate: changeDateFormat(birthDate, "yyyy-MM-dd")
          ? changeDateFormat(birthDate, "yyyy-MM-dd")
          : null,
        contact: {
          email: email,
          mobilePhone: mobilePhone.replaceAll(" ", "").replaceAll("(", "").replaceAll(")", ""),
        },
      },
      car: {
        plateState: carPlateNo.substring(0, 2), //plakanın ilk iki hanesi
        plateNo: carPlateNo.substring(2, carPlateNo.length), //plakanın ilk ikiden sonrası
        registrationSerialCode: carInformation.registrationSerialCode,
        registrationSerialNo: carInformation.registrationSerialNo.toString(),
      },
    };

    console.log(bodyData);
    try {
      await axios
        .post(carInfoReqUrl, bodyData, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            //Veriler Getirildikten sonra loader'ı durduruyoruz.
            setCarInfoByMap(res.data.data);
            setLoader({ ...loader, carInfo: false });
            setIsConfirmLicence(true);

            //console.log(res.data);
          }
        });
    } catch (error) {
      setErrorVal({
        ...errorVal,
        carInfo: true,
      });

      if (error.response) {
        toast.error(
          (error.response?.data?.message?.content?.errors &&
            error.response.data.message.content.errors[0]?.faultMessage) ||
            "Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.",
          {
            theme: "colored",
          }
        );
      }

      writeResponseError(error);
    }
  };

  const getCarCompanies = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    setSelectedCarModel({});
    setCarCompanies([]);

    try {
      await axios
        .get(carCompanyReqUrl, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: {
            ModelYear: null, // Number(selectedCarModelYear),
            //ModelYear: 2009,
          },
        })
        .then((res) => {
          if (res.data.success) {
            let carCompanies = [];
            res.data.data.map((company, index) => {
              company.index = index;
              carCompanies.push(company);
            });
            setCarCompanies(carCompanies);
          }
        });
    } catch (error) {
      writeResponseError(error);
      toast.error("Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.");
    }
  };

  const getCarModels = async () => {
    setLoader({ ...loader, carModels: true });

    //Marka seçildikten sonra model seçimini sıfırlıyoruz.
    setSelectedCarModel();

    if (selectedCarCompany && selectedCarCompany.markaKod) {
      try {
        let res = await axios.get(carModelReqUrl, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: {
            ModelYear: null, //Number(selectedCarModelYear),
            MakeCode: selectedCarCompany.markaKod,
          },
        });
        setLoader({ ...loader, carModels: false });
        setCarModels(res.data.data);
      } catch (error) {
        setLoader({ ...loader, carModels: false });
        writeResponseError(error);
        toast.error("Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.");
      }
    }
  };

  const updateCarInfo = async (carInfo) => {
    let carPlateNo = plateNo.toString().replaceAll(" ", "");
    let bodyData = {
      insured: {
        type: identityType, //Vergi vs
        identityNo: identityNo.toString(),
        birthDate: changeDateFormat(birthDate, "yyyy-MM-dd")
          ? changeDateFormat(birthDate, "yyyy-MM-dd")
          : null,
        contact: {
          email: email,
          mobilePhone: mobilePhone.replaceAll(" ", "").replaceAll("(", "").replaceAll(")", ""),
        },
      },
      car: {
        plateState: carPlateNo?.substring(0, 2), //plakanın ilk iki hanesi
        plateNo: carPlateNo?.substring(2, carPlateNo.length), //plakanın ilk ikiden sonrası
        registrationSerialCode: carInfo?.registrationSerialCode,
        registrationSerialNo: carInfo?.registrationSerialNo?.toString(),
      },
      carInfo: {
        registrationDate: carInfo?.registrationDate,
        makeCode: carInfo?.makeCode,
        makeCodeDescription: carInfo?.makeCodeDescription,
        modelCode: carInfo?.modelCode,
        modelCodeDescription: carInfo?.modelCodeDescription,
        modelYear: carInfo?.modelYear,
        chassisNo: carInfo?.chassisNo,
        motorNo: carInfo?.motorNo,
        fuelType: carInfo?.fuelType,
        countOfPassengers: carInfo?.countOfPassengers,
        usageManner: carInfo?.usageManner,
        usageMannerDescription: carInfo?.usageMannerDescription,
        usageSubstance: carInfo?.usageSubstance,
        usageSubstanceDescription: carInfo?.usageSubstanceDescription,
      },
    };

    console.log(bodyData);
    try {
      await axios
        .post(updateCarInfoReqUrl, bodyData, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log("Car Info Update Res: ", res);
        });
    } catch (error) {
      writeResponseError(error);
    }
  };

  //Form Componentleri
  const ConfirmLicenceForm = () => {
    return (
      <form onSubmit={handleSubmit(validateData)}>
        <div className="car-license-with-me">
          <div className="row car-license-with-me-inputs mt-4" style={{ display: "flex" }}>
            {/* {JSON.stringify(carInformation)} */}
            <div className="col-6">
              <TextField
                {...register("belgeSeriNo", {
                  required: "Belge Seri No zorunlu",
                })}
                value={carInformation.registrationSerialCode}
                onChange={(e) => {
                  setCarInformation({
                    ...carInformation,
                    registrationSerialCode: e.target.value.toUpperCase(),
                  });
                  clearErrors("belgeSeriNo");
                  setValue("belgeSeriNo", e.target.value);
                }}
                inputProps={{ className: "only-letter", maxLength: "2" }}
                placeholder="Belge Seri No"
                id="documentSerialNumber"
                type="text"
                sx={inputStyle}
                size="small"
                error={errors && Boolean(errors["belgeSeriNo"])}
                label="Belge Seri No"
              />

              <small className="text-danger">{errors && errors["belgeSeriNo"]?.message}</small>
            </div>
            <div className="col-6">
              <TextField
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
                value={carInformation.registrationSerialNo}
                onChange={(e) => {
                  setCarInformation({
                    ...carInformation,
                    registrationSerialNo: e.target.value,
                  });
                  clearErrors("belgeNo");
                  setValue("belgeNo", e.target.value);
                }}
                inputProps={{ maxLength: "6" }}
                placeholder="Belge No"
                id="documentNumber"
                type="number"
                sx={inputStyle}
                size="small"
                error={errors && Boolean(errors["belgeNo"])}
                label="Belge No"
              />

              <small className="text-danger">{errors && errors["belgeNo"]?.message}</small>
            </div>
          </div>
          <div>
            <button
              type="button"
              className="btn-custom btn-timeline-forward w-100 mt-3 text-align-center"
              onClick={() => onConfirmLicence()}
            >
              Onayla
            </button>
          </div>
          {/* isExistMissingInfo: {JSON.stringify(isExistMissingInfo)}
              isConfirmLicence: {JSON.stringify(isConfirmLicence)} */}
          {!isConfirmLicence && loader.carInfo && !errorVal.carInfo ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ display: "block", paddingTop: "80px", paddingBottom: "80px" }}>
                <PreFormLoader />
              </div>
            </div>
          ) : (
            <>
              {isConfirmLicence && isExistMissingInfo == false && (
                <div>
                  <Alert severity="warning" className="mt-4" style={{ fontSize: "11pt" }}>
                    Emniyet Genel Müdürlüğü’nde aracınıza ait kayıtlı bilgiler aşağıdadır. Lütfen
                    kontrol ederek yanlış olduğunu düşündüğünüz bilgileri düzeltiniz.
                  </Alert>

                  <div className="car-register3ed-information">
                    <div className="d-flex justify-content-end w-100" style={{ float: "right" }}>
                      <div className="text-primary">
                        <Button
                          variant="text"
                          disableRipple
                          style={{ textTransform: "none" }}
                          onClick={() => {
                            setIsEditCarInformation(true);
                          }}
                        >
                          Düzenle <i className="mdi mdi-lead-pencil"></i>
                        </Button>
                      </div>
                    </div>
                    <table className="table">
                      <tbody>
                        {carInformation.usageMannerDescription && (
                          <tr>
                            <td>
                              <strong>Kullanım Tarzı</strong>
                            </td>
                            <td>
                              :
                              {" " +
                                carInformation.usageMannerDescription +
                                " - " +
                                carInformation.usageSubstanceDescription}
                            </td>
                          </tr>
                        )}
                        {carInformation.makeCodeDescription && (
                          <tr>
                            <td>
                              <strong>Marka</strong>
                            </td>
                            <td>
                              :
                              {" " +
                                carInformation.makeCode +
                                " - " +
                                carInformation.makeCodeDescription}
                            </td>
                          </tr>
                        )}
                        {carInformation.modelCodeDescription && (
                          <tr>
                            <td>
                              <strong>Model</strong>
                            </td>
                            <td>
                              :
                              {" " +
                                carInformation.modelCode +
                                " - " +
                                carInformation.modelCodeDescription}
                            </td>
                          </tr>
                        )}
                        {carInformation.modelYear && (
                          <tr>
                            <td>
                              <strong>Model yılı</strong>
                            </td>
                            <td>: {carInformation.modelYear}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <input
                    type="submit"
                    className="btn-custom btn-timeline-forward w-100 mt-3"
                    value="İleri"
                  />
                </div>
              )}
            </>
          )}
          {/* Araç Bilgileri Eksik gelirse */}
        </div>
      </form>
    );
  };

  const CompleteMissingCarInformationForm = () => {
    return (
      <form onSubmit={handleSubmit2(validateData)}>
        <Alert className="mt-4" severity="error" style={{ fontSize: "11pt" }}>
          Araç bilgileri getirilirken bir hata oluştu. Lütfen aşağıdaki bilgileri girerek devam
          ediniz.
        </Alert>
        {/* Aracın Satın Alındığı Tarih */}
        {(!carInformation.registrationDate ||
          carInformation.registrationDate == "0001-01-01T00:00:00") && (
          <div className="car-registration-date mt-4">
            <TextField
              {...register2("registrationDate", {
                required: "Ruhsat Tarihi Zorunlu",
                validate: isValidMaskedDate,
              })}
              id="registrationDate"
              InputLabelProps={{
                shrink: true,
                //required: true,
                fontSize: "15pt",
              }}
              InputProps={{
                inputProps: {
                  min: "1990-01-01",
                  max: getTodayDate(),
                  className: "date-mask",
                },
              }}
              value={registrationDate}
              onKeyUp={(e) => {
                {
                  setRegistrationDate(e.target.value);
                  clearErrors2("registrationDate");
                  setValue2("registrationDate", e.target.value);
                }
              }}
              sx={inputStyle}
              size="small"
              error={errors2 && Boolean(errors2["registrationDate"])}
              label="Ruhsat Tarihi *"
              placeholder="gg.aa.yyyy"
              autoComplete="off"
            />

            <small className="text-danger">
              {errors2 && errors2["registrationDate"]?.message}
              {/**Validate Message */}
              {errors2 && errors2.registrationDate && errors2.registrationDate.type == "validate"
                ? "Geçersiz Ruhsat Tarihi"
                : ""}
            </small>
          </div>
        )}

        {/*Model Yılı*/}
        {!carInformation.modelYear && (
          <div className="car-model-year mt-4">
            <Autocomplete
              value={selectedCarModelYear}
              onChange={(event, newValue) => {
                setSelectedCarModelYear(newValue);
                setSelectedCarCompany("");
                setSelectedCarModel("");
              }}
              options={carModelYears}
              sx={{ width: "100%" }}
              size="small"
              loading={carModelYears && carModelYears.length > 0 ? false : true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Aracın Model Yılı"
                  placeholder="Aracın Model Yılını seçiniz"
                  required={true}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {carModelYears.length == 0 ? (
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
        )}

        {/*Markaları*/}
        {!carInformation.makeCode && (
          <div className="car-company mt-4">
            <Autocomplete
              value={selectedCarCompany}
              onChange={(event, newValue) => {
                setSelectedCarCompany(newValue);
                setSelectedCarModel("");
              }}
              options={carCompanies}
              getOptionLabel={(option) =>
                option.markaKod ? option.markaKod + " - " + option.marka : ""
              }
              sx={{ width: "100%" }}
              size="small"
              loading={loader.carCompanies}
              disabled={!selectedCarModelYear}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Araç Markası"
                  placeholder="Araç Markası seçiniz"
                  required={true}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loader.carCompanies ? (
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
        )}

        {/*Modeller*/}
        {!carInformation.modelCode && (
          <div className="car-model mt-4">
            <Autocomplete
              value={selectedCarModel}
              onChange={(event, newValue) => {
                setCarModelByAutoComplete(newValue);
              }}
              options={carModels}
              getOptionLabel={(option) => (option.tipKod ? option.tipKod + " - " + option.tip : "")}
              sx={{ width: "100%" }}
              size="small"
              loading={loader.carModels}
              disabled={!selectedCarCompany}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Aracın Modeli"
                  placeholder="Aracın Modeli seçiniz"
                  required={true}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loader.carModels ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </div>
        )}

        {/*Yakıt Tipi*/}
        {!carInformation.fuelType && (
          <div className="fuel-type mt-4">
            <Autocomplete
              value={selectedFuelType}
              onChange={(event, newValue) => {
                setSelectedFuelType(newValue);
              }}
              options={FuelTypes}
              sx={{ width: "100%" }}
              size="small"
              //loading={carModelYears && carModelYears.length > 0 ? false : true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Yakıt Tipi"
                  placeholder="Yakıt Tipi seçiniz"
                  required={true}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {carModelYears.length == 0 ? (
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
        )}

        {/* Motor No */}
        {!carInformation.motorNo && (
          <div className="motor-no mt-4">
            <TextField
              {...register2("motorNo", {
                required: "Motor No Zorunlu",
                minLength: {
                  value: 5,
                  message: "Motor No en az 5 karakter olmalıdır.",
                },
              })}
              id="motorNo"
              InputProps={{
                inputProps: {
                  type: "text",
                  maxLength: "20",
                },
              }}
              value={motorNo}
              onChange={(e) => {
                {
                  setMotorNo(e.target.value.toUpperCase());
                  clearErrors2("motorNo");
                  setValue2("motorNo", e.target.value);
                }
              }}
              sx={inputStyle}
              size="small"
              error={errors2 && Boolean(errors2["motorNo"])}
              label="Motor No *"
              autoComplete="off"
            />

            <small className="text-danger">{errors2 && errors2["motorNo"]?.message}</small>
          </div>
        )}

        {/* Şasi No */}
        {!carInformation.chassisNo && (
          <div className="chassis-no mt-4">
            <TextField
              {...register2("chassisNo", {
                required: "Şasi No Zorunlu",
                minLength: {
                  value: 17,
                  message: "Şasi No 17 karakter olmalıdır.",
                },
              })}
              id="chassisNo"
              InputProps={{
                inputProps: {
                  type: "text",
                  maxLength: "17",
                },
              }}
              value={chassisNo}
              onChange={(e) => {
                {
                  setChassisNo(e.target.value.toUpperCase());
                  clearErrors2("chassisNo");
                  setValue2("chassisNo", e.target.value);
                }
              }}
              sx={inputStyle}
              size="small"
              error={errors2 && Boolean(errors2["chassisNo"])}
              label="Şasi No *"
              autoComplete="off"
            />

            <small className="text-danger">{errors2 && errors2["chassisNo"]?.message}</small>
          </div>
        )}

        <input type="submit" className="btn-custom btn-timeline-forward w-100 mt-3" value="İleri" />
      </form>
    );
  };

  const EditCarInformationForm = () => {
    return (
      <form onSubmit={handleSubmit2(validateData)}>
        {/*Model Yılı*/}
        <div className="car-model-year mt-4">
          <Autocomplete
            value={selectedCarModelYear}
            onChange={(event, newValue) => {
              setSelectedCarModelYear(newValue);
              setSelectedCarCompany("");
              setSelectedCarModel("");
            }}
            options={carModelYears}
            sx={{ width: "100%" }}
            size="small"
            loading={carModelYears && carModelYears.length > 0 ? false : true}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Aracın Model Yılı"
                placeholder="Aracın Model Yılını seçiniz"
                required={true}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {carModelYears.length == 0 ? (
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
        {/*Markaları*/}
        <div className="car-company mt-4">
          <Autocomplete
            value={selectedCarCompany}
            onChange={(event, newValue) => {
              setSelectedCarCompany(newValue);
              setSelectedCarModel("");
            }}
            options={carCompanies}
            getOptionLabel={(option) =>
              option.markaKod ? option.markaKod + " - " + option.marka : ""
            }
            sx={{ width: "100%" }}
            size="small"
            loading={loader.carCompanies}
            disabled={!selectedCarModelYear}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Araç Markası"
                placeholder="Araç Markası seçiniz"
                required={true}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loader.carCompanies ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </div>
        {/*Modeller*/}
        <div className="car-model mt-4">
          <Autocomplete
            value={selectedCarModel}
            onChange={(event, newValue) => {
              setCarModelByAutoComplete(newValue);
            }}
            options={carModels}
            getOptionLabel={(option) => (option.tipKod ? option.tipKod + " - " + option.tip : "")}
            sx={{ width: "100%" }}
            size="small"
            loading={loader.carModels}
            disabled={!selectedCarCompany}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Aracın Modeli"
                placeholder="Aracın Modeli seçiniz"
                required={true}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loader.carModels ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </div>
        <input type="submit" className="btn-custom btn-timeline-forward w-100 mt-3" value="İleri" />
      </form>
    );
  };

  const NoExistPlateForm = () => {
    return (
      <form onSubmit={handleSubmit2(validateData)}>
        {/* Aracın Satın Alındığı Tarih */}
        <div className="car-registration-date mt-4">
          <TextField
            {...register2("registrationDate", {
              required: "Ruhsat Tarihi Zorunlu",
              validate: isValidMaskedDate,
            })}
            id="registrationDate"
            InputLabelProps={{
              shrink: true,
              //required: true,
              fontSize: "15pt",
            }}
            InputProps={{
              inputProps: {
                min: "1990-01-01",
                max: getTodayDate(),
                className: "date-mask",
              },
            }}
            value={registrationDate}
            onKeyUp={(e) => {
              {
                setRegistrationDate(e.target.value);
                clearErrors2("registrationDate");
                setValue2("registrationDate", e.target.value);
              }
            }}
            sx={inputStyle}
            size="small"
            error={errors2 && Boolean(errors2["registrationDate"])}
            label="Ruhsat Tarihi *"
            placeholder="gg.aa.yyyy"
            autoComplete="off"
          />

          <small className="text-danger">
            {errors2 && errors2["registrationDate"]?.message}
            {/**Validate Message */}
            {errors2 && errors2.registrationDate && errors2.registrationDate.type == "validate"
              ? "Geçersiz Ruhsat Tarihi"
              : ""}
          </small>
        </div>
        {/*Model Yılı*/}
        <div className="car-model-year mt-4">
          <Autocomplete
            value={selectedCarModelYear}
            onChange={(event, newValue) => {
              setSelectedCarModelYear(newValue);
              setSelectedCarCompany("");
              setSelectedCarModel("");
            }}
            options={carModelYears}
            sx={{ width: "100%" }}
            size="small"
            loading={carModelYears && carModelYears.length > 0 ? false : true}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Aracın Model Yılı"
                placeholder="Aracın Model Yılını seçiniz"
                required={true}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {carModelYears.length == 0 ? (
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
        {/*Markaları*/}
        <div className="car-company mt-4">
          <Autocomplete
            value={selectedCarCompany}
            onChange={(event, newValue) => {
              setSelectedCarCompany(newValue);
              setSelectedCarModel("");
            }}
            options={carCompanies}
            getOptionLabel={(option) =>
              option.markaKod ? option.markaKod + " - " + option.marka : ""
            }
            sx={{ width: "100%" }}
            size="small"
            loading={loader.carCompanies}
            disabled={!selectedCarModelYear}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Araç Markası"
                placeholder="Araç Markası seçiniz"
                required={true}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loader.carCompanies ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </div>
        {/*Modeller*/}
        <div className="car-model mt-4">
          <Autocomplete
            value={selectedCarModel}
            onChange={(event, newValue) => {
              setCarModelByAutoComplete(newValue);
            }}
            options={carModels}
            getOptionLabel={(option) => (option.tipKod ? option.tipKod + " - " + option.tip : "")}
            sx={{ width: "100%" }}
            size="small"
            loading={loader.carModels}
            disabled={!selectedCarCompany}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Aracın Modeli"
                placeholder="Aracın Modeli seçiniz"
                required={true}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loader.carModels ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </div>
        {/*Yakıt Tipi*/}
        <div className="fuel-type mt-4">
          <Autocomplete
            value={selectedFuelType}
            onChange={(event, newValue) => {
              setSelectedFuelType(newValue);
            }}
            options={FuelTypes}
            sx={{ width: "100%" }}
            size="small"
            //loading={carModelYears && carModelYears.length > 0 ? false : true}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Yakıt Tipi"
                placeholder="Yakıt Tipi seçiniz"
                required={true}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {carModelYears.length == 0 ? (
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
        {/* Şasi No */}
        <div className="motor-no mt-4">
          <TextField
            {...register2("motorNo", {
              required: "Motor No Zorunlu",
              minLength: {
                value: 5,
                message: "Motor No en az 5 karakter olmalıdır.",
              },
            })}
            id="motorNo"
            InputProps={{
              inputProps: {
                type: "text",
                maxLength: "20",
              },
            }}
            value={motorNo}
            onChange={(e) => {
              {
                setMotorNo(e.target.value.toUpperCase());
                clearErrors2("motorNo");
                setValue2("motorNo", e.target.value);
              }
            }}
            sx={inputStyle}
            size="small"
            error={errors2 && Boolean(errors2["motorNo"])}
            label="Motor No *"
            autoComplete="off"
          />

          <small className="text-danger">{errors2 && errors2["motorNo"]?.message}</small>
        </div>
        {/* Motor No */}
        <div className="chassis-no mt-4">
          <TextField
            {...register2("chassisNo", {
              required: "Şasi No Zorunlu",
              minLength: {
                value: 17,
                message: "Şasi No 17 karakter olmalıdır.",
              },
            })}
            id="chassisNo"
            InputProps={{
              inputProps: {
                type: "text",
                maxLength: "17",
              },
            }}
            value={chassisNo}
            onChange={(e) => {
              {
                setChassisNo(e.target.value.toUpperCase());
                clearErrors2("chassisNo");
                setValue2("chassisNo", e.target.value);
              }
            }}
            sx={inputStyle}
            size="small"
            error={errors2 && Boolean(errors2["chassisNo"])}
            label="Şasi No *"
            autoComplete="off"
          />

          <small className="text-danger">{errors2 && errors2["chassisNo"]?.message}</small>
        </div>
        <input type="submit" className="btn-custom btn-timeline-forward w-100 mt-3" value="İleri" />
      </form>
    );
  };

  return (
    <>
      {/* {JSON.stringify(selectedCarModelYear)} */}
      {isExistPlate ? (
        <>
          {isEditCarInformation ? (
            EditCarInformationForm()
          ) : (
            <>
              {isExistMissingInfo != true
                ? ConfirmLicenceForm()
                : CompleteMissingCarInformationForm()}
            </>
          )}
        </>
      ) : (
        NoExistPlateForm()
      )}
    </>
  );
};

export default LicenseInformation;
