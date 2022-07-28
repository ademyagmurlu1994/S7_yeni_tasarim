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

const HouseAddress = ({ identityType, identityNo, birthDate, token, onChange }) => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [state, setState] = useState({
    address: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    building: "",
    apartment: "",
    policyInfoResponse: "",
  });

  //AutoComplete List Variables
  const [buildingCities, setBuildingCities] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [townList, setTownList] = useState([]);
  const [quarterList, setQuarterList] = useState([]);
  const [streetList, setStreetList] = useState([]);
  const [buildingList, setBuildingList] = useState([]);
  const [apartmentList, setApartmentList] = useState([]);

  //AutoComplete Selected Variables
  const [selectedBuildingCity, setSelectedBuildingCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null); //İlçe
  const [selectedTown, setSelectedTown] = useState(null); //Belde
  const [selectedQuarter, setSelectedQuarter] = useState(null); //Mahalle
  const [selectedStreet, setSelectedStreet] = useState(null); //Cadde/Sokak/Bulvar
  const [selectedBuilding, setSelectedBuilding] = useState(null); //Bina Numarası
  const [selectedApartment, setSelectedApartment] = useState(null); //İç kapı Numarası(Daire)

  // İl bilgisini getiriyoruz.
  useEffect(() => {
    getBuidingCities();
  }, []);

  // İl seçildikten sonra ilçeleri getiriyoruz.
  useEffect(() => {
    setTimeout(() => {
      setSelectedDistrict(null);
    }, 100);

    if (selectedBuildingCity) {
      getDistrictList();
    }
  }, [selectedBuildingCity]);

  // İlçe seçildikten sonra beldeleri getiriyoruz.
  useEffect(() => {
    setTimeout(() => {
      setSelectedTown(null);
    }, 100);

    if (selectedDistrict) {
      getTownList();
    }
  }, [selectedDistrict]);

  // Belde seçildikten sonra mahalleleri getiriyoruz.
  useEffect(() => {
    setTimeout(() => {
      setSelectedQuarter(null);
    }, 100);

    if (selectedTown) {
      getQuarterList();
    }
  }, [selectedTown]);

  //Mahalle seçildikten sonra cadde/sokak/bulvarları getiriyoruz.
  useEffect(() => {
    setTimeout(() => {
      setSelectedStreet(null);
    }, 100);

    if (selectedQuarter) {
      getStreetList();
    }
  }, [selectedQuarter]);

  //Sokak/Cadde/Bulvar seçildikten sonra binaları getiriyoruz.
  useEffect(() => {
    setTimeout(() => {
      setSelectedBuilding(null);
    }, 100);

    if (selectedStreet) {
      getBuildingList();
    }
  }, [selectedStreet]);

  //Bina seçildikten sonra daireleri getiriyoruz.
  useEffect(() => {
    setTimeout(() => {
      setSelectedApartment(null);
    }, 100);

    if (selectedBuilding) {
      getApartmentList();
    }
  }, [selectedBuilding]);

  //Daire seçildikten sonra Adres bilgisini getiriyoruz.
  useEffect(() => {
    setState({ ...state, address: "" });
    if (selectedApartment) {
      getAddress();
    }
  }, [selectedApartment]);

  //normal fonksiyonlar
  const validateData = async (data) => {
    if (onChange) {
      let houseAddress = {
        city: "Gaziantep",
      };
      onChange(houseAddress);
    }
  };

  //http requestler
  const getBuidingCities = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
    try {
      await axios
        .get("/api/quote/v1/Dask/getdaskprovincelist", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            setBuildingCities(res.data.data);
            //
          }
        });
    } catch (error) {
      writeResponseError(error);
    }
  };

  const getDistrictList = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
    try {
      await axios
        .get("/api/quote/v1/Dask/getdaskdistrictlist", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: { provinceCode: selectedBuildingCity.kod },
        })
        .then((res) => {
          if (res.data.success) {
            setSelectedDistrict(undefined);

            setDistrictList(res.data.data);
          }
        });
    } catch (error) {
      writeResponseError(error);
    }
  };

  const getTownList = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
    console.log(Number(selectedDistrict.kod));
    try {
      await axios
        .get(
          "/api/quote/v1/Dask/getdasktownlist",

          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            params: {
              provinceCode: selectedBuildingCity.kod,
              districtCode: selectedDistrict.kod,
            },
          }
        )
        .then((res) => {
          if (res.data.success) {
            setTownList(res.data.data);
          }
        });
    } catch (error) {
      writeResponseError(error);
    }
  };

  const getQuarterList = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
    console.log(Number(selectedDistrict.kod));
    try {
      await axios
        .get("/api/quote/v1/Dask/getdaskquarterlist", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: {
            townCode: selectedTown.kod,
          },
        })
        .then((res) => {
          if (res.data.success) {
            setQuarterList(res.data.data);
          }
        });
    } catch (error) {
      writeResponseError(error);
    }
  };

  const getStreetList = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
    try {
      await axios
        .get(
          "/api/quote/v1/Dask/getdaskstreetlist",

          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            params: {
              quarterCode: selectedQuarter.kod,
            },
          }
        )
        .then((res) => {
          if (res.data.success) {
            setStreetList(res.data.data);
          }
        });
    } catch (error) {
      writeResponseError(error);
    }
  };

  const getBuildingList = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
    try {
      await axios
        .get("/api/quote/v1/Dask/getdaskbuildinglist", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: {
            streetCode: selectedStreet.kod,
          },
        })
        .then((res) => {
          if (res.data.success) {
            if (res.data.data) {
              setErrorMessage({ ...errorMessage, building: "" });
              setBuildingList(res.data.data);
            } else {
              setErrorMessage({ ...errorMessage, building: "Bina bilgisi bulunamadı." });
              setBuildingList([]);
            }
          }
        });
    } catch (error) {
      setErrorMessage({ ...errorMessage, building: "Bina bilgisi bulunamadı." });
      setBuildingList([]);
      writeResponseError(error);
    }
  };

  const getApartmentList = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
    try {
      await axios
        .get("/api/quote/v1/Dask/getdaskapartmentlist", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: {
            buildingCode: selectedBuilding.kod,
          },
        })
        .then((res) => {
          if (res.data.success) {
            if (res.data.data) {
              setErrorMessage({ ...errorMessage, apartment: "" });
              setApartmentList(res.data.data);
            } else {
              setErrorMessage({ ...errorMessage, apartment: "Daire bilgisi bulunamadı." });
              setApartmentList([]);
            }
          }
        });
    } catch (error) {
      setErrorMessage({ ...errorMessage, apartment: "Daire bilgisi bulunamadı." });
      setApartmentList([]);
      writeResponseError(error);
    }
  };

  const getAddress = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
    try {
      await axios
        .get("/api/quote/v1/Dask/getdaskaddressinfo", {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: {
            uavtCode: selectedApartment.diger,
          },
        })
        .then((res) => {
          if (res.data.success) {
            setState({ ...state, address: res.data.data[0].aciklama });
          }
        });
    } catch (error) {
      writeResponseError(error);
    }
  };

  return (
    <>
      <form autoComplete="off" onSubmit={handleSubmit(validateData)}>
        <div className="il-of-dask mt-4  ">
          <Autocomplete
            value={selectedBuildingCity}
            onChange={(event, newValue) => {
              setSelectedBuildingCity(newValue);
            }}
            options={buildingCities}
            getOptionLabel={(option) => option.aciklama}
            sx={{ width: "100%" }}
            size="small"
            loading={buildingCities.length > 0 ? false : true}
            renderInput={(params) => (
              <TextField
                {...params}
                label="İl"
                placeholder="İl Seçiniz"
                required={true}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {buildingCities.length == 0 ? (
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
        {selectedBuildingCity && (
          <div className="ilce-of-dask mt-4  ">
            <Autocomplete
              name="district"
              value={selectedDistrict}
              onChange={(event, newValue) => {
                setSelectedDistrict(newValue);
              }}
              options={districtList}
              getOptionLabel={(option) => option.aciklama}
              sx={{ width: "100%" }}
              size="small"
              loading={districtList.length > 0 ? false : true}
              disabled={districtList.length == 0}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="İlçe"
                  placeholder="İlçe Seçiniz"
                  required={true}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {districtList.length == 0 ? (
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

        {selectedDistrict && (
          <div className="belde-of-dask mt-4">
            <Autocomplete
              value={selectedTown}
              onChange={(event, newValue) => {
                setSelectedTown(newValue);
              }}
              options={townList}
              getOptionLabel={(option) => option.aciklama}
              sx={{ width: "100%" }}
              size="small"
              loading={townList.length > 0 ? false : true}
              disabled={townList.length == 0}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Belde"
                  placeholder="Belde Seçiniz"
                  required={true}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {townList.length == 0 ? (
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

        {selectedTown && (
          <div className="mahalle-of-dask mt-4  ">
            <Autocomplete
              value={selectedQuarter}
              onChange={(event, newValue) => {
                setSelectedQuarter(newValue);
              }}
              options={quarterList}
              getOptionLabel={(option) => option.aciklama}
              sx={{ width: "100%" }}
              size="small"
              loading={quarterList.length > 0 ? false : true}
              disabled={quarterList.length == 0}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Mahalle"
                  placeholder="Mahalle Seçiniz"
                  required={true}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {quarterList.length == 0 ? (
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

        {selectedQuarter && (
          <div className="sokak-of-dask mt-4  ">
            <Autocomplete
              value={selectedStreet}
              onChange={(event, newValue) => {
                setSelectedStreet(newValue);
              }}
              options={streetList}
              getOptionLabel={(option) => option.aciklama + " - " + option.diger}
              sx={{ width: "100%" }}
              size="small"
              loading={streetList.length > 0 ? false : true}
              disabled={streetList.length == 0}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sokak/Cadde/Bulvar"
                  placeholder="Sokak/Cadde/Bulvar Seçiniz"
                  required={true}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {streetList.length == 0 ? (
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

        {selectedStreet && (
          <div className="bina-of-dask mt-4  ">
            {errorMessage.building ? (
              <Alert severity="error" className="mt-4" style={{ fontSize: "11pt" }}>
                {errorMessage.building && errorMessage.building}
              </Alert>
            ) : (
              <Autocomplete
                value={selectedBuilding}
                onChange={(event, newValue) => {
                  setSelectedBuilding(newValue);
                }}
                options={buildingList}
                getOptionLabel={(option) => option.diger}
                sx={{ width: "100%" }}
                size="small"
                loading={buildingList.length > 0 ? false : true}
                disabled={buildingList.length == 0}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Bina No"
                    placeholder="Bina No Seçiniz"
                    required={true}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {buildingList.length == 0 ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            )}
          </div>
        )}

        {selectedBuilding && (
          <div className="ic-kapi-no-of-dask mt-4  ">
            {errorMessage.apartment ? (
              <Alert severity="error" className="mt-4" style={{ fontSize: "11pt" }}>
                {errorMessage.apartment}
              </Alert>
            ) : (
              <Autocomplete
                value={selectedApartment}
                onChange={(event, newValue) => {
                  setSelectedApartment(newValue);
                }}
                options={apartmentList}
                getOptionLabel={(option) => option.aciklama}
                sx={{ width: "100%" }}
                size="small"
                loading={errorMessage.apartment && apartmentList.length > 0 ? false : true}
                disabled={errorMessage.apartment && apartmentList.length == 0}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Daire No"
                    placeholder="Daire No Seçiniz"
                    required={true}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {apartmentList.length == 0 ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            )}
          </div>
        )}

        {state.address && (
          <Alert severity="info" className="mt-4" style={{ fontSize: "11pt" }}>
            <b>Adres Bilgisi: </b>
            {state.address}
          </Alert>
        )}

        <Button type="submit" className="w-100 mt-4" disabled={!state.address}>
          Onayla
        </Button>
      </form>
    </>
  );
};

export default HouseAddress;
