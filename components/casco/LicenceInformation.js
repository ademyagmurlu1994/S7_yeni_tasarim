import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "/instances/axios";

//Componentler
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import PreFormLoader from "/components/PreFormLoader";

//fonksiyonlar
import { getTodayDate, writeResponseError, getNewToken } from "/functions/common";

//Styles
import { inputStyle } from "/styles/custom";

const LicenseInformation = ({ plateNo, identityNo, identityType, isExistPlate }) => {
  const [state, setState] = useState({
    isConfirmLicence: false,
    documentSerialNumber: "",
    documentNumber: "",
  });

  const [token, setToken] = useState("");
  //const token =
  // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiREVNTyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvZ3JvdXBzaWQiOiIyIiwibmJmIjoxNjUxNDE3NDAxLCJleHAiOjE2NTE1MDM4MDEsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NjIwMDAiLCJhdWQiOiJBZ2dyZWdhdG9yIn0.1cmdiFVCXthbTlUdahEqXkcROeJwpUWh2w0bf6b9MQM";

  const [isActiveSetCarInformation, setIsActiveSetCarInformation] = useState(false);
  const [carCompanies, setCarCompanies] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [carModelYears, setCarModelYears] = useState([]);

  //AutoComplete Selected Variables
  const [selectedCarCompany, setSelectedCarCompany] = useState(null);
  const [selectedCarCompanyModel, setSelectedCarCompanyModel] = useState(null);
  const [selectedCarModelYear, setSelectedCarModelYear] = useState(null);
  //
  const [carInformation, setCarInformation] = useState({
    purchasedDate: undefined,
  });

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    //Plakanın olmadığı durumda markaları getiriyoruz ve ,
    //Model yılı seçimi son iki yıl olacak şekilde diziye atama yapıyoruz.

    if (isExistPlate) {
      let years = [];
      for (var i = 2022; i >= 1975; i--) {
        years.push(i.toString());
      }
      setCarModelYears(years);
    } else if (isExistPlate == false) {
      setCarModelYears(["2022", "2021"]);
    }
  }, [isExistPlate]);

  useEffect(async () => {
    //Authorization için token çekiyoruz.
    if (token == "") {
      await getNewToken().then((res) => {
        setToken(res);
      });
    }
  }, []);

  // useEffect(async () => {
  //   if (carCompanies.length == 0) {
  //     await getVehicleCompany();
  //   }
  // }, [token]);

  // carInformation bilgisinde eksik bilgi varsa markaları getiriyoruz.
  // useEffect(() => {
  //   if (carInformation && !carInformation.aracMarkaKodu) {
  //     getVehicleCompany();
  //     setSelectedCarCompany(null);
  //   }
  // }, [carInformation]);

  //Düzenleye tıkandıktan sonra seçili markayı getiriyoruz.
  //   useEffect(async () => {
  //     setTimeout(() => {
  //       setSelectedCarCompany(null);
  //     }, 100);

  //     if (carCompanies.length >= 1 && carInformation && carInformation.aracMarkaKodu) {
  //       // setTimeout(() => {
  //       //   setSelectedCarCompany({ marka: "VOLKSWAGEN", markaKod: "153", index: 97 });
  //       // }, 150);
  //       //   setTimeout(() => {
  //       //     setSelectedCarModelYear(carInformation.modelYili.toString());
  //       //   }, 150);
  //     }
  //   }, [carCompanies]);

  //Marka seçildikten sonra modelleri getiriyoruz.
  //   useEffect(async () => {
  //     // setTimeout(() => {
  //     //   setSelectedCarCompanyModel(null);
  //     // }, 100);
  //     // //araç bilgileri gelmiş ise düzenleme aşamasındadır demektir.
  //     // if (selectedCarCompany && selectedCarCompany.markaKod) {
  //     //   setCarModels(await getVehicleModel());
  //     // }
  //   }, [selectedCarCompany]);

  //Modeller geldikten sonra selectedModel'i güncelliyoruz.
  //   useEffect(async () => {
  //     //araç bilgileri gelmiş ise düzenleme aşamasındadır demektir.
  //     if (carModels.length >= 1 && carInformation && carInformation.aracTipKodu) {
  //       setSelectedCarCompanyModel(
  //         carModels.find((item) => Number(item.tipKod) === Number(carInformation.aracTipKodu))
  //       );
  //       console.log(selectedCarCompany, selectedCarCompanyModel);
  //     }
  //   }, [carModels]);

  const getVehicleCompany = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    setSelectedCarCompany();
    setCarCompanies([]);

    try {
      let bodyData = {};
      await axios
        .post("/api/quote/v1/Casco/getmakecodes", bodyData, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            Accept: "application/json",
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
    }
  };

  const getVehicleModel = async () => {
    setState({ ...state, isLoadingCarModels: true });

    //Marka seçildikten sonra model seçimini sıfırlıyoruz.
    setSelectedCarCompanyModel();

    if (selectedCarCompany && selectedCarCompany.markaKod) {
      let bodyData = { makeCode: selectedCarCompany.markaKod };
      try {
        let res = await axios.post("/api/quote/v1/Casco/getmodelsbymakecode", bodyData, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        setState({ ...state, isLoadingCarModels: false });
        return res.data.data;
      } catch (error) {
        writeResponseError(error);
      }
    }
  };

  const getVehicleInfo = async () => {
    //Onayla butonuna basıldıktan sonra loader'ı tetiklemek için,
    setState({ ...state, isConfirmLicence: false, isLoadingVehicleInfo: true });

    let carPlateNo = plateNo.toString().replaceAll(" ", "");
    let bodyData = {
      identityType: identityType, //Vergi vs
      identityNo: identityNo.toString(),
      plateState: carPlateNo.substring(0, 2), //plakanın ilk iki hanesi
      plateNo: carPlateNo.substring(2, carPlateNo.length), //plakanın ilk ikiden sonrası
      registrationSerialCode: state.documentSerialNumber,
      registrationSerialNo: state.documentNumber.toString(),
    };

    try {
      await axios
        .post("/api/quote/v1/Casco/getcarinfo", bodyData, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            //Veriler Getirildikten sonra loader'ı durduruyoruz.
            setState({ ...state, isLoadingVehicleInfo: false });
            console.log("Araç Bilgileri: ", res.data.data);
            setCarInformation(res.data.data);
            setState({ ...state, isConfirmLicence: true });
          }
        });
    } catch (error) {
      setState({ ...state, vehicleInfoError: true });
      writeResponseError(error);
    }
  };

  const validateData = () => {};

  const onConfirmLicence = () => {
    if (state.documentNumber.toString().length == 6 && state.documentSerialNumber.length == 2) {
      getVehicleInfo();
    }

    if (state.documentNumber.toString().length != 6) {
      setError("belgeNo", {
        type: "manual",
        message: "Belge No alanı zorunlu",
      });
    } else {
      clearErrors("belgeNo");
    }

    if (state.documentSerialNumber.toString().length != 2) {
      setError("belgeSeriNo", {
        type: "manual",
        message: "Belge Seri No alanı zorunlu",
      });
    } else {
      clearErrors("belgeSeriNo");
    }
  };

  const onSetCarInformation = async () => {
    //await getVehicleCompany();
  };

  const Duzenle = async () => {
    await getVehicleCompany().then(() => {
      setSelectedCarCompany({ marka: "VOLKSWAGEN", markaKod: "153", index: 97 });
    });
  };

  return (
    <>
      {plateNo}
      {identityNo}
      {JSON.stringify(selectedCarCompany)}
      {/* {JSON.stringify(selectedCarCompanyModel)}
      {JSON.stringify(selectedCarModelYear)} */}
      <button onClick={() => Duzenle()}>Düzenle</button>
      <form onSubmit={handleSubmit(validateData)}>
        {/* Aracın Satın Alındığı Tarih */}
        <div className="date-the-vehicle-was-purchased mt-4">
          <TextField
            {...register("purchasedDate", {
              required: "Aracın Satın Alındığı Tarih zorunlu",
            })}
            InputLabelProps={{
              shrink: true,
              required: true,
              fontSize: "15pt",
            }}
            InputProps={{
              inputProps: {
                min: "1990-01-01",
                max: getTodayDate(),
              },
            }}
            value={carInformation.purchasedDate}
            onChange={(e) =>
              setState({
                ...carInformation,
                purchasedDate: e.target.value,
              })
            }
            type="date"
            sx={inputStyle}
            size="small"
            error={Boolean(errors["purchasedDate"])}
            label="Aracın Satın Alındığı Tarih"
          />
        </div>

        {/*Araç Model Yılı*/}
        <div className="vehicle-model-year mt-4">
          <Autocomplete
            value={selectedCarModelYear}
            onChange={(event, newValue) => {
              setSelectedCarModelYear(newValue);
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

        {/*Araç Markaları Combobox*/}
        <div className="vehicle-company mt-4">
          <Autocomplete
            value={selectedCarCompany}
            onChange={(event, newValue) => {
              setSelectedCarCompany(newValue);
            }}
            options={carCompanies}
            getOptionLabel={(option) => option.marka}
            sx={{ width: "100%" }}
            size="small"
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
                      {false ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </div>

        {/*Araç Marka Modellleri Combobox*/}
        <div className="vehicle-model mt-4">
          <Autocomplete
            value={selectedCarCompanyModel}
            onChange={(event, newValue) => {
              setSelectedCarCompanyModel(newValue);
            }}
            options={carModels}
            getOptionLabel={(option) => option.tip}
            sx={{ width: "100%" }}
            size="small"
            loading={state.isLoadingCarModels}
            disabled={carModels && carModels.length == 0}
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
                      {state.isLoadingCarModels ? (
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

        <input
          type="submit"
          className="btn-custom btn-timeline-forward w-100 mt-3"
          value=" Kasko Tekliflerini Getir"
        />
      </form>
    </>
  );
};

export default LicenseInformation;
