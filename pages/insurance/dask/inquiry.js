import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/router";
import { get } from "jquery";
import axios from "/instances/axios";

//Componentler
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import PreLoader from "/components/PreLoader";
import PreFormLoader from "/components/PreFormLoader";
import NotificationConfirmation from "/components/pop-up/NotificationConfirmation";
import SingleCodeVerification from "/components/pop-up/SingleCodeVerification";

//fonksiyonlar
import {
  isValidTcKimlik,
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
  getNewToken,
} from "/functions/common";

const Inquiry = () => {
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [state, setState] = useState({
    activeStep: 1,
    isExistPolicy: false,
    identityNo: "",
    birthDate: "",
    daskPolicyNo: "",
    uavtNumber: "",
    address: "",
    email: "",
    phoneNumber: "",
    isKnowUavtNumber: true,
    isRegisteredUser: false,
    isCheckedNotification: false,
    buildingSquareMeter: "",
    daskPolicyInfo: "",
    errorMessage: {
      uavtNumber: "",
      policyInfoResponse: "",
    },
    isUpdateUserInformationClicked: false,
    isExistMortgage: false,
    isMortgageBank: true,
    token: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    building: "",
    apartment: "",
    policyInfoResponse: "",
  });
  //Notification and Verification Variables
  const [isShowNotifyConfirmPopup, setIsShowNotifyConfirmPopup] = useState(false);
  const [notificationConfirmation, setNotificationConfirmation] = useState(undefined);
  const [isVerifySmsSingleCode, setIsVerifySmsSingleCode] = useState(undefined);
  const [isShowVerifySingleCodePopup, setIsShowVerifySingleCodePopup] = useState(false);

  //AutoComplete Selected Variables
  const [selectedBuildingCity, setSelectedBuildingCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null); //İlçe
  const [selectedTown, setSelectedTown] = useState(null); //Belde
  const [selectedQuarter, setSelectedQuarter] = useState(null); //Mahalle
  const [selectedStreet, setSelectedStreet] = useState(null); //Cadde/Sokak/Bulvar
  const [selectedBuilding, setSelectedBuilding] = useState(null); //Bina Numarası
  const [selectedApartment, setSelectedApartment] = useState(null); //İç kapı Numarası(Daire)
  //######### 3.step #############################
  const [selectedBuildingConstructionType, setSelectedBuildingConstructionType] = useState(null); //Bina Yapı Tarzı
  const [selectedBuildingConstructionYear, setSelectedBuildingConstructionYear] = useState(null); //Bina Yılı
  const [selectedBuildingFloorCount, setSelectedBuildingFloorCount] = useState(null); //Kat Sayısı
  const [selectedBuildingUsageType, setSelectedBuildingUsageType] = useState(null); //Bina Kullanım Biçimi
  const [selectedBuildingDamageStatusType, setSelectedBuildingDamageStatusType] = useState(null); //Bina Hasar Durumu
  const [selectedWhoMakesInsurance, setSelectedWhoMakesInsurance] = useState(null); //Sigorta yaptıranın Ünvanı
  /** Banka Selected Variable'ları */
  const [selectedBank, setSelectedBank] = useState(null); //Bankalar
  const [selectedBankBranch, setSelectedBankBranch] = useState(null); //Banka Şubeleri
  const [selectedFinancialCompany, setSelectedFinancialCompany] = useState(null); //Banka Şubeleri

  //AutoComplete List Variables
  const [buildingCities, setBuildingCities] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [townList, setTownList] = useState([]);
  const [quarterList, setQuarterList] = useState([]);
  const [streetList, setStreetList] = useState([]);
  const [buildingList, setBuildingList] = useState([]);
  const [apartmentList, setApartmentList] = useState([]);
  //######### 3.step #############################
  const [buildingConstructionTypeList, setBuildingConstructionTypeList] = useState([]);
  const [buildingConstructionYearList, setBuildingConstructionYearList] = useState([]);
  const [buildingFloorCountList, setBuildingFloorCountList] = useState([]);
  const [buildingUsageTypeList, setBuildingUsageTypeList] = useState([]);
  const [buildingDamageStatusTypeList, setBuildingDamageStatusTypeList] = useState([]);
  const [whoMakesInsuranceList, setWhoMakesInsuranceList] = useState([]);
  /**Banka  Variable'ları*/
  const [bankList, setBankList] = useState([]);
  const [bankBranchList, setBankBranchList] = useState([]);
  const [financialCompanyList, setFinancialCompanyList] = useState([]);

  useEffect(async () => {
    //Authorization için token çekiyoruz.
    if (!state.token) {
      setState({ ...state, token: await getNewToken() });
    }
  }, []);

  useEffect(() => {
    //Token Bilgisi Geldikten Sonra kasko index ve araba markalarını getiriyoruz.
    if (state.token) {
      getDaskIndexData();
    }
  }, [state.token]);

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
      setState({ ...state, activeStep: 3 });
    }
  }, [isVerifySmsSingleCode]);

  //############### AutoComplete Watcherları ################

  // Uavt Kodunu Bilmiyorum tıklandıktan sonra illeri getiriyoruz.
  useEffect(() => {
    if (state.token != "" && state.isKnowUavtNumber == false) {
      getBuidingCities();
    }
  }, [state.isKnowUavtNumber]);

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
    setState({ ...state, address: "", uavtNumber: "" });
    if (selectedApartment) {
      getAddress();
    }
  }, [selectedApartment]);

  //############# 3.step Watch methodları #################
  //Aktif step 3 olduktan sonra  getiriyoruz.
  useEffect(() => {
    if (state.activeStep == 3) {
      getWhoMakesInsuranceList();
      if (state.isExistPolicy) {
        getDaskPolicyInfo();
      } else {
        getBuildingConstructionTypeList();
        getBuildingConstructionYearList();
        getBuildingFloorCountList();
        getBuildingUsageTypeList();
        getBuildingDamageStatusTypeList();
      }
    }
  }, [state.activeStep]);

  //Daini Mürtehin Banka Seçildiğinde Bankaları getiriyor.
  useEffect(() => {
    if (state.isExistMortgage && bankList.length == 0) {
      getBankList();
    }
  }, [state.isExistMortgage]);

  //Banka şeçildikten sonra şubeleri getiryoruz.
  useEffect(() => {
    setTimeout(() => {
      setSelectedBankBranch(null);
    }, 200);

    if (selectedBank) {
      getBankBranchList();
    }
  }, [selectedBank]);

  //Daini Finans Kuruluşu Seçildiğinde Kuruluşları getiriyor.
  useEffect(() => {
    if (!state.isMortgageBank && financialCompanyList.length == 0) {
      getFinancialCompanyList();
    }
  }, [state.isMortgageBank]);

  //http requestler
  const getBuidingCities = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
    try {
      await axios
        .get("/api/quote/v1/Dask/getdaskprovincelist", {
          headers: {
            Authorization: state.token,
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
            Authorization: state.token,
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
              Authorization: state.token,
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
        .get(
          "/api/quote/v1/Dask/getdaskquarterlist",

          {
            headers: {
              Authorization: state.token,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            params: {
              townCode: selectedTown.kod,
            },
          }
        )
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
              Authorization: state.token,
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
            Authorization: state.token,
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
            Authorization: state.token,
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
            Authorization: state.token,
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

  //########## 3.step http requests ###########

  const getBuildingConstructionTypeList = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
    try {
      await axios
        .get("/api/quote/v1/Dask/getdaskconstructiontypelist", {
          headers: {
            Authorization: state.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            setBuildingConstructionTypeList(res.data.data);
            //setState({ ...state, address: res.data.data[0].aciklama });
          }
        });
    } catch (error) {
      writeResponseError(error);
    }
  };
  const getBuildingConstructionYearList = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
    try {
      await axios
        .get("/api/quote/v1/Dask/getdaskconsturctionyearlist", {
          headers: {
            Authorization: state.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            setBuildingConstructionYearList(res.data.data);
          }
        });
    } catch (error) {
      writeResponseError(error);
    }
  };
  const getBuildingFloorCountList = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
    try {
      await axios
        .get("/api/quote/v1/Dask/getdaskfloorcountlist", {
          headers: {
            Authorization: state.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            setBuildingFloorCountList(res.data.data);
          }
        });
    } catch (error) {
      writeResponseError(error);
    }
  };
  const getBuildingUsageTypeList = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
    try {
      await axios
        .get("/api/quote/v1/Dask/getdaskbuildingusagetype", {
          headers: {
            Authorization: state.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            setBuildingUsageTypeList(res.data.data);
          }
        });
    } catch (error) {
      writeResponseError(error);
    }
  };
  const getBuildingDamageStatusTypeList = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
    try {
      await axios
        .get("/api/quote/v1/Dask/getdaskbuildingdamagestatuslist", {
          headers: {
            Authorization: state.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            setBuildingDamageStatusTypeList(res.data.data);
          }
        });
    } catch (error) {
      writeResponseError(error);
    }
  };
  const getWhoMakesInsuranceList = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
    try {
      await axios
        .get("/api/quote/v1/Dask/getdaskwhomakesinsurancelist", {
          headers: {
            Authorization: state.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            setWhoMakesInsuranceList(res.data.data);
          }
        });
    } catch (error) {
      writeResponseError(error);
    }
  };

  const getDaskPolicyInfo = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
    try {
      await axios
        .get("/api/quote/v1/Dask/getdaskpolicybypolicyno", {
          headers: {
            Authorization: state.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: {
            DaskPolicyNo: state.daskPolicyNo,
          },
        })
        .then((res) => {
          if (res.data.success) {
            let data = res.data.data.PoliceBilgileri.BinaBilgileri;
            let info = {
              constructionType: data.BinaYapiTarziAciklama,
              constructionUsageType: data.DaireKullanimSekliAciklama,
              consturctionYear: data.BinaInsaatYiliAciklama,
              floorCount: data.ToplamKatSayisiAciklama,
              squareMeter: data.DaireYuzOlcumu,
            };
            let uavtNumber = Number(res.data.data.PoliceBilgileri.RizikoBilgileri.UAVTKodu);

            console.log("Dask Policy Info:", info);
            setState({
              ...state,
              uavtNumber: uavtNumber,
              daskPolicyInfo: info,
            });
          } else {
            setErrorMessage({
              ...errorMessage,
              policyInfoResponse:
                "Dask Poliçe bilgileri getirilirken bir hata oluştu. Lütfen UAVT Kodunu girerek devam ediniz.",
            });
          }
        });
    } catch (error) {
      writeResponseError(error);
      setErrorMessage({
        ...errorMessage,
        policyInfoResponse:
          "Dask Poliçe bilgileri getirilirken bir hata oluştu. Lütfen UAVT Kodunu girerek devam ediniz.",
      });
    }
  };

  //Banka requestleri
  const getBankList = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
    try {
      await axios
        .get("/api/quote/v1/Dask/getdaskbanklist", {
          headers: {
            Authorization: state.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            setBankList(res.data.data);
            //setState({ ...state, address: res.data.data[0].aciklama });
          }
        });
    } catch (error) {
      writeResponseError(error);
    }
  };
  const getBankBranchList = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
    try {
      await axios
        .get("/api/quote/v1/Dask/getdaskbankbranchlist", {
          headers: {
            Authorization: state.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: {
            BankCode: selectedBank.id,
          },
        })
        .then((res) => {
          if (res.data.success) {
            setBankBranchList(res.data.data);
          }
        });
    } catch (error) {
      writeResponseError(error);
    }
  };

  const getFinancialCompanyList = async () => {
    //Seçim yapıldıktan sonra model dizisini sıfırlıyoruz
    //{ params: { answer: 42 } },
    try {
      await axios
        .get("/api/quote/v1/Dask/getdaskfinancialcompanylist", {
          headers: {
            Authorization: state.token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            setFinancialCompanyList(res.data.data);
            //setState({ ...state, address: res.data.data[0].aciklama });
          }
        });
    } catch (error) {
      writeResponseError(error);
    }
  };

  //##########  Normal fonksiyonlar ###########
  const validateStep = (data) => {
    const forwardStep = state.activeStep + 1;
    switch (forwardStep) {
      case 2:
        setState({ ...state, activeStep: forwardStep });
        break;
      case 3:
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
      case 4:
        setState({ ...state, activeStep: forwardStep });
        break;
      //Son adımda bilgileri kaydedip teklif sayfasına yönlendirme yapıyoruz.
      case 5:
        saveInquiryInformations();
        break;
      default:
        //Kod gönderme componentini 3. adım hariç tüm adımlarda kapalı tutuyoruz.(sürekli sms gönderilmemesi için)
        setIsShowVerifySingleCodePopup(false);
    }
  };

  const getDaskIndexData = () => {
    const daskIndexData = JSON.parse(localStorage.getItem("daskIndex"));
    if (daskIndexData) {
      //Kasko indexten gelen veriler ile güncelleme yapıyoruz.
      setState({
        ...state,
        isExistPolicy: daskIndexData.isExistPolicy,
        identityNo: daskIndexData.identityNo,
        daskPolicyNo: daskIndexData.daskPolicyNo,
        birthDate: daskIndexData.birthDate,
        activeStep: daskIndexData.isExistPolicy ? 2 : 1, //Mevcut poliçe varsa otomatik olarak 2. adıma geçiyoruz.
      });

      //React hook formda başlangıçta hata vermemesi için
      /*setValue("tcKimlikNumarasi", kaskoIndexData.tcKimlikNumarasi);
      setValue("aracPlakaNo", kaskoIndexData.aracPlakaNo);*/
    } else {
      //Kasko index bilgileri yoksa anasayfaya yönledirme yapıyoruz.
      router.push("/insurance/dask/");
    }
  };

  const saveInquiryInformations = () => {
    console.log("selectedWhoMakesInsurance", selectedWhoMakesInsurance);
    console.log("selectedBuildingFloorCount", selectedBuildingFloorCount);
    console.log("selectedBuildingConstructionType", selectedBuildingConstructionType);
    console.log("selectedBuildingConstructionYear", selectedBuildingConstructionYear);
    console.log("selectedBuildingUsageType", selectedBuildingUsageType);
    console.log("selectedBuildingDamageStatusType", selectedBuildingDamageStatusType);
    console.log("state.buildingSquareMeter", state.buildingSquareMeter);

    let inquiryInformations = {
      companyCode: 0,
      insured: {
        type: "TCKN",
        identityNo: state.identityNo.toString(),
        birthDate: state.birthDate + "T16:26:49.319Z",
        contact: {
          email: state.email, //####
          mobilePhone: state.phoneNumber
            .toString()
            .replaceAll(" ", "")
            .replaceAll("(", "")
            .replaceAll(")", ""), // #####
        },
      },
      building: {
        whoMakesInsurance: Number(selectedWhoMakesInsurance.id),
        floorCount: state.isExistPolicy ? 0 : Number(selectedBuildingFloorCount.id),
        constructionType: state.isExistPolicy ? 0 : Number(selectedBuildingConstructionType.id),
        consturctionYear: state.isExistPolicy ? 0 : Number(selectedBuildingConstructionYear.id),
        usageType: state.isExistPolicy ? 0 : Number(selectedBuildingUsageType.id),
        damageStatus: state.isExistPolicy ? 0 : Number(selectedBuildingDamageStatusType.id),
        squareMeter: state.isExistPolicy ? 0 : Number(state.buildingSquareMeter),
      },
      mortgage: {
        isMortgage: state.isExistMortgage,
        bank: {
          code: state.isExistMortgage && state.isMortgageBank ? Number(selectedBank.id) : null,
          branchCode:
            state.isExistMortgage && state.isMortgageBank ? Number(selectedBankBranch.id) : null,
        },
        financialCompanyCode:
          state.isExistMortgage && !state.isMortgageBank
            ? Number(selectedFinancialCompany.id)
            : null,
      },
      policy: {
        daskPolicyNo: Number(state.daskPolicyNo),
        isRenewal: true,
      },
      uavtCode: state.uavtNumber,
    };

    //Mevcut Poliçesi yoksa
    if (!state.isExistPolicy) {
      inquiryInformations.uavtCode = Number(state.uavtNumber);
      inquiryInformations.policy.isRenewal = false;
      inquiryInformations.policy.daskPolicyNo = 0;
    }

    //console.log(inquiryInformations);
    localStorage.setItem("daskInquiryInformations", JSON.stringify(inquiryInformations));
    router.push("/insurance/dask/offers");
  };

  const notificationConfirmationCallback = useCallback((isConfirmNotify) => {
    setNotificationConfirmation(isConfirmNotify);
  }, []);

  const singleCodeVerificationCallback = useCallback((isVerify) => {
    setIsVerifySmsSingleCode(isVerify);
  });
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

      <section className="timeline_container mt-4">
        {!state.token ? (
          //Token Bilgisi gelene kadar loader Çalışıyor
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "500px" }}>
            <div style={{ display: "block" }}>
              <PreLoader></PreLoader>
            </div>
          </div>
        ) : (
          <div className="container">
            <ul className="timeline">
              {/*Ulusal Adres Veri Tabanı (UAVT)*/}
              {state.activeStep >= 1 && !state.isExistPolicy && (
                <li
                  className={"timeline-inverted " + (state.activeStep > 1 ? "timeline-passed" : "")}
                >
                  <div className="timeline-badge success"></div>
                  <div className="timeline-panel">
                    <div className="timeline-heading">
                      <h4 className="timeline-title">Ulusal Adres Veritabanı (UAVT)</h4>
                    </div>
                    <div className="timeline-body animate__animated animate__fadeInUp  ">
                      {
                        <form onSubmit={handleSubmit(validateStep)}>
                          {state.isKnowUavtNumber ? (
                            <div className="uavt-no mt-2">
                              <label className="form-check-label" htmlFor="uavtNo">
                                UAVT
                              </label>
                              <i className="tip" data-tip-content="Name of your business">
                                <div
                                  className="tip-content right"
                                  style={{ width: "400px", zIndex: "555500" }}
                                >
                                  Ulusal Adres Veri Tabanı (UAVT) Kodu ülke sınırları içindeki tüm
                                  konutlara ait ayırt edici 10 haneli özel bir numaradır. Poliçe
                                  yaptırmak istediğiniz konuta ait UAVT kodunu öğrendikten sonra
                                  lütfen bu kutuya girişini yapın.
                                </div>
                              </i>

                              <input
                                type="number"
                                id="uavtNo"
                                maxLength={10}
                                placeholder="Ulusal Adres Veritabanı (UAVT)"
                                className={`form-control ${
                                  errors.ulusal_adres_veritabani && "invalid"
                                }`}
                                {...register("ulusal_adres_veritabani", {
                                  required: "Ulusal Adres Veritabani Zorunlu",
                                  max: {
                                    value: 9999999999,
                                    message: "Uavt kodu 10 hane olmak zorunda",
                                  },
                                  min: {
                                    value: 1000000000,
                                    message: "Uavt kodu 10 hane olmak zorunda",
                                  },
                                })}
                                onChange={(e) => {
                                  setState({ ...state, uavtNumber: e.target.value });
                                }}
                                value={state.uavtNumber}
                              />
                              <small className="text-danger">
                                {errors["ulusal_adres_veritabani"]?.message}
                              </small>
                              <div className="dont-know-uavt mt-3 w-100">
                                <div
                                  className="btn-sm btn-custom-outline w-100"
                                  onClick={() =>
                                    setState({
                                      ...state,
                                      isKnowUavtNumber: false,
                                      uavtNumber: null,
                                    })
                                  }
                                >
                                  <i className="fas fa-exclamation-circle mr-2"></i> UAVT Kodumu
                                  Bilmiyorum
                                </div>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div
                                className="geri-button  color-main"
                                onClick={() => setState({ ...state, isKnowUavtNumber: true })}
                                style={{ fontWeight: "600", cursor: "pointer" }}
                              >
                                Geri
                              </div>
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
                                    getOptionLabel={(option) =>
                                      option.aciklama + " - " + option.diger
                                    }
                                    sx={{ width: "100%" }}
                                    size="small"
                                    loading={streetList.length > 0 ? false : true}
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
                                    <Alert
                                      severity="error"
                                      className="mt-4"
                                      style={{ fontSize: "11pt" }}
                                    >
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
                                    <Alert
                                      severity="error"
                                      className="mt-4"
                                      style={{ fontSize: "11pt" }}
                                    >
                                      {errorMessage.apartment}
                                    </Alert>
                                  ) : (
                                    <Autocomplete
                                      value={selectedApartment}
                                      onChange={(event, newValue) => {
                                        setSelectedApartment(newValue);
                                        setState({
                                          ...state,
                                          uavtNumber: newValue ? newValue.diger : null,
                                        });
                                      }}
                                      options={apartmentList}
                                      getOptionLabel={(option) => option.aciklama}
                                      sx={{ width: "100%" }}
                                      size="small"
                                      loading={
                                        errorMessage.apartment && apartmentList.length > 0
                                          ? false
                                          : true
                                      }
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
                                <Alert
                                  severity="info"
                                  className="mt-4"
                                  style={{ fontSize: "11pt" }}
                                >
                                  <b>Adres Bilgisi: </b>
                                  {state.address}
                                </Alert>
                              )}

                              {state.uavtNumber && (
                                <div className="uavt-kodu mt-3 p-3 bg-main-light text-center color-main">
                                  <b>UAVT Kodunuz: </b>
                                  {state.uavtNumber}
                                </div>
                              )}
                            </>
                          )}

                          <input
                            type="submit"
                            className={`btn-custom btn-timeline-forward w-100 mt-4 text-center ${
                              !state.uavtNumber && "passive"
                            }`}
                            value="Onayla"
                          />

                          {state.isConfirmLicence && (
                            <div>
                              <div
                                className="uavt-home-address mt-3"
                                style={{
                                  padding: "10px",
                                  backgroundColor: "var(--main-color-light)",
                                }}
                              >
                                <b>Görünen Adres</b> <br />
                                ***** MAH ***** SK No: 7 Daire: 2 Ada: 6920 / Pafta: / Parsel: 11
                                S******** İSTANBUL
                              </div>
                              <input
                                type="submit"
                                className="btn-custom btn-timeline-forward w-100 mt-3"
                                value=" İleri"
                              />
                            </div>
                          )}
                        </form>
                      }
                    </div>
                  </div>
                </li>
              )}

              {/**Kimlik Bilgiler */}
              {state.activeStep >= 2 && (
                <li
                  className={
                    "timeline-inverted " +
                    (state.activeStep < 2 ? "timeline-passive" : "") +
                    (state.activeStep > 2 ? "timeline-passed" : "")
                  }
                >
                  <div className="timeline-badge">
                    <b></b>
                  </div>
                  <div className="timeline-panel">
                    <div className="timeline-heading">
                      <h4 className="timeline-title">Kullanıcı Bilgileri</h4>
                    </div>
                    <div className="timeline-body animate__animated animate__fadeInUp  ">
                      <form onSubmit={handleSubmit(validateStep)} id="secondStep">
                        <div className="radio-is-registered-user mb-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="radioIsRegisteredUser"
                              id="radioRegisteredUser"
                              value={true}
                              checked={state.isRegisteredUser}
                              onChange={() => setState({ ...state, isRegisteredUser: true })}
                            />
                            <label className="form-check-label" htmlFor="radioRegisteredUser">
                              Kayıtlı Kullanıcı
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="radioIsRegisteredUser"
                              id="radioNotRegisteredUser"
                              value={false}
                              checked={!state.isRegisteredUser}
                              onChange={() => setState({ ...state, isRegisteredUser: false })}
                            />
                            <label className="form-check-label" htmlFor="radioNotRegisteredUser">
                              Yeni Kullanıcı
                            </label>
                          </div>
                        </div>

                        {(() => {
                          if (state.isRegisteredUser) {
                            return (
                              <div className="registered-user">
                                <div className="phone-number">
                                  <strong>Cep Telefonu: </strong>
                                  0532 123 ** **
                                </div>
                                <div className="email">
                                  <strong>E-posta adresi: </strong>
                                  ab***@hotmail.com
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
                                      İndirimler, Avantajlar, Fiyatlar ve Kampanyalardan haberdar
                                      olmak için tıklayınız.
                                    </label>
                                  </div>
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <div className="unregistered-user">
                                <div className="phone-number">
                                  Cep Telefonu
                                  <div
                                    className="input-form-with-prefix w-100"
                                    style={{ display: "flex" }}
                                  >
                                    <div className="bg-main text-white input-form-prefix px-2">
                                      +90
                                    </div>
                                    <div className="input-with-prefix">
                                      <input
                                        type="tel"
                                        id="phone"
                                        className={`form-control ${
                                          errors.cepTelefonNo && "invalid"
                                        }`}
                                        {...register("cepTelefonNo", {
                                          required: "Cep telefonu numarası zorunlu",
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
                                      />
                                    </div>
                                  </div>
                                  <small className="text-danger">
                                    {errors["cepTelefonNo"]?.message}
                                  </small>
                                </div>
                                <div className="email mt-2">
                                  E-posta adresi
                                  <div
                                    className="input-form-with-prefix w-100"
                                    style={{ display: "flex" }}
                                  >
                                    <div className="bg-main text-white input-form-prefix">
                                      <i className="far fa-envelope"></i>
                                    </div>
                                    <div className="input-with-prefix">
                                      <input
                                        type="email"
                                        id="emailAddress"
                                        className={`form-control ${
                                          errors.emailAddress && "invalid"
                                        }`}
                                        {...register("emailAddress", {
                                          required: "E-mail adresi zorunlu",
                                          pattern: {
                                            value:
                                              /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                                            message: "Geçersiz email adresi",
                                          },
                                        })}
                                        value={state.email}
                                        onChange={(e) => {
                                          setState({ ...state, email: e.target.value });
                                          clearErrors("emailAddress");
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <small className="text-danger">
                                    {errors["emailAddress"]?.message}
                                  </small>
                                </div>
                                <div className="news-notification-confirmation mt-2">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="check-notification-confirmation"
                                      {...register("notification-confirmation", {})}
                                      value={state.isCheckedNotification}
                                      onChange={(e) =>
                                        setState({
                                          ...state,
                                          isCheckedNotification: e.target.checked,
                                        })
                                      }
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="check-notification-confirmation"
                                    >
                                      İndirimler, Avantajlar, Fiyatlar ve Kampanyalardan haberdar
                                      olmak için tıklayınız.
                                    </label>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        })()}
                        <button className="btn-custom btn-timeline-forward w-100 mt-3">
                          İleri
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              )}

              {/**Bina Bilgileri */}
              {state.activeStep >= 3 && (
                <li
                  className={
                    "timeline-inverted " +
                    (state.activeStep < 3 ? "timeline-passive" : "") +
                    (state.activeStep > 3 ? "timeline-passed" : "")
                  }
                >
                  <div className="timeline-badge">
                    <b className="glyphicon glyphicon-credit-card"></b>
                  </div>
                  <div className="timeline-panel">
                    <div className="timeline-heading">
                      <h4 className="timeline-title">Konut Bilgisi </h4>
                    </div>
                    <div className="timeline-body animate__animated animate__fadeInUp  ">
                      <form onSubmit={handleSubmit(validateStep)}>
                        <>
                          {state.isExistPolicy ? (
                            <>
                              {state.daskPolicyInfo && (
                                <table className="table mt-3">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <strong>Bina Yapı Tarzı</strong>
                                      </td>
                                      <td>: {state.daskPolicyInfo.constructionType}</td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <strong>Kullanım Tarzı</strong>
                                      </td>
                                      <td>: {state.daskPolicyInfo.constructionUsageType} </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <strong>Bina Yılı</strong>
                                      </td>
                                      <td>: {state.daskPolicyInfo.consturctionYear} </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <strong>Toplam Kat Sayısı</strong>
                                      </td>
                                      <td>: {state.daskPolicyInfo.floorCount} </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <strong>Daire Yüz Ölçümü</strong>
                                      </td>
                                      <td>: {state.daskPolicyInfo.squareMeter} </td>
                                    </tr>
                                  </tbody>
                                </table>
                              )}

                              {!state.daskPolicyInfo && !errorMessage.policyInfoResponse && (
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                  <div style={{ display: "block" }}>
                                    <PreFormLoader />
                                  </div>
                                </div>
                              )}

                              {!state.daskPolicyInfo && errorMessage.policyInfoResponse && (
                                <>
                                  <Alert
                                    severity="error"
                                    className="mt-4"
                                    style={{ fontSize: "11pt" }}
                                  >
                                    {errorMessage.policyInfoResponse &&
                                      errorMessage.policyInfoResponse}
                                  </Alert>
                                  <div className="uavt-no mt-2">
                                    <label className="form-check-label" htmlFor="uavtNo">
                                      UAVT
                                    </label>
                                    <i className="tip" data-tip-content="Name of your business">
                                      <div
                                        className="tip-content right"
                                        style={{ width: "400px", zIndex: "555500" }}
                                      >
                                        Ulusal Adres Veri Tabanı (UAVT) Kodu ülke sınırları içindeki
                                        tüm konutlara ait ayırt edici 10 haneli özel bir numaradır.
                                        Poliçe yaptırmak istediğiniz konuta ait UAVT kodunu
                                        öğrendikten sonra lütfen bu kutuya girişini yapın.
                                      </div>
                                    </i>

                                    <input
                                      type="number"
                                      id="uavtNo"
                                      maxLength={10}
                                      placeholder="Ulusal Adres Veritabanı (UAVT)"
                                      className={`form-control ${
                                        errors.ulusal_adres_veritabani && "invalid"
                                      }`}
                                      {...register("ulusal_adres_veritabani", {
                                        required: "Ulusal Adres Veritabani Zorunlu",
                                        max: {
                                          value: 9999999999,
                                          message: "Uavt kodu 10 hane olmak zorunda",
                                        },
                                        min: {
                                          value: 1000000000,
                                          message: "Uavt kodu 10 hane olmak zorunda",
                                        },
                                      })}
                                      onChange={(e) => {
                                        setState({ ...state, uavtNumber: e.target.value });
                                      }}
                                      value={state.uavtNumber}
                                    />
                                    <small className="text-danger">
                                      {errors["ulusal_adres_veritabani"]?.message}
                                    </small>
                                  </div>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="bina-yuz-olcumu mt-4">
                                <TextField
                                  {...register("daire_metre_kare", {
                                    required: "Daire metre kare alanı zorunlu",
                                    min: {
                                      value: 10,
                                      message: "En az iki hane olmak zorunda",
                                    },
                                  })}
                                  type="number"
                                  value={state.buildingSquareMeter}
                                  onChange={(e) => {
                                    setState({
                                      ...state,
                                      buildingSquareMeter: e.target.value,
                                    });
                                  }}
                                  sx={{ width: "100%" }}
                                  size="small"
                                  error={Boolean(errors["daire_metre_kare"])}
                                  label="Daire Metre Kare"
                                  maxLength={4}
                                  name="daire_metre_kare"
                                />
                                <small className="text-danger">
                                  {errors["daire_metre_kare"]?.message}
                                </small>
                              </div>
                              <div className="bina-yapi-tarzi mt-4  ">
                                <Autocomplete
                                  value={selectedBuildingConstructionType}
                                  onChange={(event, newValue) => {
                                    setSelectedBuildingConstructionType(newValue);
                                  }}
                                  options={buildingConstructionTypeList}
                                  getOptionLabel={(option) => option.name}
                                  sx={{ width: "100%" }}
                                  size="small"
                                  loading={buildingConstructionTypeList.length > 0 ? false : true}
                                  renderInput={(params) => (
                                    <TextField
                                      error={errors.bina_yapi_tarzi}
                                      {...params}
                                      label="Bina Yapı"
                                      placeholder="Bina Yapı Seçiniz"
                                      required={true}
                                      InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                          <React.Fragment>
                                            {buildingConstructionTypeList.length == 0 ? (
                                              <CircularProgress color="inherit" size={20} />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                          </React.Fragment>
                                        ),
                                      }}
                                      {...register("bina_yapi_tarzi", {
                                        required: "Bina Yapı Tarzı alanı zorunlu",
                                      })}
                                    />
                                  )}
                                />
                                <small className="text-danger">
                                  {errors["bina_yapi_tarzi"]?.message}
                                </small>
                              </div>
                              <div className="bina-insaat-yili mt-4  ">
                                <Autocomplete
                                  value={selectedBuildingConstructionYear}
                                  onChange={(event, newValue) => {
                                    setSelectedBuildingConstructionYear(newValue);
                                  }}
                                  options={buildingConstructionYearList}
                                  getOptionLabel={(option) => option.name}
                                  sx={{ width: "100%" }}
                                  size="small"
                                  loading={buildingConstructionYearList.length > 0 ? false : true}
                                  renderInput={(params) => (
                                    <TextField
                                      error={errors.bina_insaat_yili}
                                      {...params}
                                      label="Bina İnşaat Yılı"
                                      placeholder="Bina İnşaat Yılı Seçiniz"
                                      required={true}
                                      InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                          <React.Fragment>
                                            {buildingConstructionYearList.length == 0 ? (
                                              <CircularProgress color="inherit" size={20} />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                          </React.Fragment>
                                        ),
                                      }}
                                      {...register("bina_insaat_yili", {
                                        required: "Bina İnşaat Yılı alanı zorunlu",
                                      })}
                                    />
                                  )}
                                />
                                <small className="text-danger">
                                  {errors["bina_insaat_yili"]?.message}
                                </small>
                              </div>
                              <div className="bina-kat-sayisi mt-4  ">
                                <Autocomplete
                                  value={selectedBuildingFloorCount}
                                  onChange={(event, newValue) => {
                                    setSelectedBuildingFloorCount(newValue);
                                  }}
                                  options={buildingFloorCountList}
                                  getOptionLabel={(option) => option.name}
                                  sx={{ width: "100%" }}
                                  size="small"
                                  loading={buildingFloorCountList.length > 0 ? false : true}
                                  renderInput={(params) => (
                                    <TextField
                                      error={errors.bina_kat_sayisi}
                                      {...params}
                                      label="Bina Kat Sayısı"
                                      placeholder="Bina Kat Sayısı Seçiniz"
                                      required={true}
                                      InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                          <React.Fragment>
                                            {buildingFloorCountList.length == 0 ? (
                                              <CircularProgress color="inherit" size={20} />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                          </React.Fragment>
                                        ),
                                      }}
                                      {...register("bina_kat_sayisi", {
                                        required: "Bina Kat Sayısı alanı zorunlu",
                                      })}
                                    />
                                  )}
                                />
                                <small className="text-danger">
                                  {errors["bina_kat_sayisi"]?.message}
                                </small>
                              </div>
                              <div className="bina-kullanim-tarzi mt-4  ">
                                <Autocomplete
                                  value={selectedBuildingUsageType}
                                  onChange={(event, newValue) => {
                                    setSelectedBuildingUsageType(newValue);
                                  }}
                                  options={buildingUsageTypeList}
                                  getOptionLabel={(option) => option.name}
                                  sx={{ width: "100%" }}
                                  size="small"
                                  loading={buildingUsageTypeList.length > 0 ? false : true}
                                  renderInput={(params) => (
                                    <TextField
                                      error={errors.bina_kullanim_tarzi}
                                      {...params}
                                      label="Bina Kullanım Tarzı"
                                      placeholder="Bina Kullanım Tarzı Seçiniz"
                                      required={true}
                                      InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                          <React.Fragment>
                                            {buildingUsageTypeList.length == 0 ? (
                                              <CircularProgress color="inherit" size={20} />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                          </React.Fragment>
                                        ),
                                      }}
                                      {...register("bina_kullanim_tarzi", {
                                        required: "Bina Kullanım Tarzı alanı zorunlu",
                                      })}
                                    />
                                  )}
                                />
                                <small className="text-danger">
                                  {errors["bina_kullanim_tarzi"]?.message}
                                </small>
                              </div>
                              <div className="bina-hasar-durumu mt-4  ">
                                <Autocomplete
                                  value={selectedBuildingDamageStatusType}
                                  onChange={(event, newValue) => {
                                    setSelectedBuildingDamageStatusType(newValue);
                                  }}
                                  options={buildingDamageStatusTypeList}
                                  getOptionLabel={(option) => option.name}
                                  sx={{ width: "100%" }}
                                  size="small"
                                  loading={buildingDamageStatusTypeList.length > 0 ? false : true}
                                  renderInput={(params) => (
                                    <TextField
                                      error={errors.bina_hasar_durumu}
                                      {...params}
                                      label="Bina Hasar Durumu"
                                      placeholder="Bina Hasar Durumu Seçiniz"
                                      required={true}
                                      InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                          <React.Fragment>
                                            {buildingDamageStatusTypeList.length == 0 ? (
                                              <CircularProgress color="inherit" size={20} />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                          </React.Fragment>
                                        ),
                                      }}
                                      {...register("bina_hasar_durumu", {
                                        required: "Bina Durumu alanı zorunlu",
                                      })}
                                    />
                                  )}
                                />
                                <small className="text-danger">
                                  {errors["bina_hasar_durumu"]?.message}
                                </small>
                              </div>
                            </>
                          )}

                          <div className="sigorta-yaptiranin-unvani mt-4">
                            <Autocomplete
                              value={selectedWhoMakesInsurance}
                              onChange={(event, newValue) => {
                                setSelectedWhoMakesInsurance(newValue);
                              }}
                              options={whoMakesInsuranceList}
                              getOptionLabel={(option) => option.name}
                              sx={{ width: "100%" }}
                              size="small"
                              loading={whoMakesInsuranceList.length > 0 ? false : true}
                              renderInput={(params) => (
                                <TextField
                                  error={errors.sigorta_yaptiranin_unvani}
                                  {...params}
                                  label="Sigorta Yaptıranın Ünvanı"
                                  placeholder="Sigorta Yaptıranın Ünvanını Seçiniz"
                                  required={true}
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <React.Fragment>
                                        {whoMakesInsuranceList.length == 0 ? (
                                          <CircularProgress color="inherit" size={20} />
                                        ) : null}
                                        {params.InputProps.endAdornment}
                                      </React.Fragment>
                                    ),
                                  }}
                                  {...register("sigorta_yaptiranin_unvani", {
                                    required: "Sigorta Yaptıranın Ünvani alanı zorunlu",
                                  })}
                                />
                              )}
                            />
                            <small className="text-danger">
                              {errors["sigorta_yaptiranin_unvani"]?.message}
                            </small>
                          </div>
                        </>

                        <input
                          type="submit"
                          className="btn-custom btn-timeline-forward w-100 mt-3"
                          value=" İleri"
                        />
                      </form>
                    </div>
                  </div>
                </li>
              )}
              {/**Daini Mürtehin */}
              {state.activeStep >= 4 && (
                <li
                  className={
                    "timeline-inverted " +
                    (state.activeStep < 4 ? "timeline-passive" : "") +
                    (state.activeStep > 4 ? "timeline-passed" : "")
                  }
                >
                  <div className="timeline-badge">
                    <b className="glyphicon glyphicon-credit-card"></b>
                  </div>
                  <div className="timeline-panel">
                    <div className="timeline-heading">
                      <h4 className="timeline-title">Rehin Alacaklı Bilgisi </h4>
                    </div>
                    <div className="timeline-body animate__animated animate__fadeInUp  ">
                      <div className="radio-is-exist-rehin-alacakli mb-3">
                        <div className="d-flex mb-3">
                          <div className="w-50">
                            <div className="custom-radio-button">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault1"
                                checked={!state.isExistMortgage}
                                value={false}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    isExistMortgage: false,
                                  })
                                }
                              />
                              <label className="form-check-label" htmlFor="flexRadioDefault1">
                                Rehin Alacaklı Yok
                              </label>
                            </div>
                          </div>
                          <div className="w-50">
                            <div className="custom-radio-button">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault2"
                                checked={state.isExistMortgage}
                                value={true}
                                onChange={(e) =>
                                  setState({
                                    ...state,
                                    isExistMortgage: true,
                                  })
                                }
                              />

                              <label className="form-check-label" htmlFor="flexRadioDefault2">
                                Rehin Alacaklı Var
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit(validateStep)}>
                        {state.isExistMortgage && (
                          <>
                            <div className="rehin-alacakli-radio">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="radioIsDainiMurtehin"
                                  id="radioDainiMurtehinBank"
                                  checked={state.isMortgageBank}
                                  value={true}
                                  onChange={(e) =>
                                    setState({
                                      ...state,
                                      isMortgageBank: true,
                                    })
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="radioDainiMurtehinBank"
                                >
                                  Rehin Alacaklı Banka
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="radioIsDainiMurtehin"
                                  id="radioDainiMurtehinFinans"
                                  checked={!state.isMortgageBank}
                                  value={false}
                                  onChange={(e) =>
                                    setState({
                                      ...state,
                                      isMortgageBank: false,
                                    })
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="radioDainiMurtehinFinans"
                                >
                                  Rehin Alacaklı Finans Kuruluşu
                                </label>
                              </div>
                            </div>
                            {state.isMortgageBank ? (
                              <>
                                <div className="banka-adi mt-4  ">
                                  <Autocomplete
                                    value={selectedBank}
                                    onChange={(event, newValue) => {
                                      setSelectedBank(newValue);
                                    }}
                                    options={bankList}
                                    getOptionLabel={(option) => option.name}
                                    sx={{ width: "100%" }}
                                    size="small"
                                    loading={bankList.length > 0 ? false : true}
                                    renderInput={(params) => (
                                      <TextField
                                        error={errors.banka_adi}
                                        {...params}
                                        label="Banka Adı"
                                        placeholder="Banka Adı Seçiniz"
                                        required={true}
                                        InputProps={{
                                          ...params.InputProps,
                                          endAdornment: (
                                            <React.Fragment>
                                              {bankList.length == 0 ? (
                                                <CircularProgress color="inherit" size={20} />
                                              ) : null}
                                              {params.InputProps.endAdornment}
                                            </React.Fragment>
                                          ),
                                        }}
                                        {...register("banka_adi", {
                                          required: "Banka Adı alanı zorunlu",
                                        })}
                                      />
                                    )}
                                  />
                                  <small className="text-danger">
                                    {errors["banka_adi"]?.message}
                                  </small>
                                </div>
                                {selectedBank && (
                                  <div className="banka-sube mt-4  ">
                                    <Autocomplete
                                      value={selectedBankBranch}
                                      onChange={(event, newValue) => {
                                        setSelectedBankBranch(newValue);
                                      }}
                                      options={bankBranchList}
                                      getOptionLabel={(option) => option.name}
                                      sx={{ width: "100%" }}
                                      size="small"
                                      loading={bankBranchList.length > 0 ? false : true}
                                      renderInput={(params) => (
                                        <TextField
                                          error={errors.banka_sube}
                                          {...params}
                                          label="Banka Şubesi"
                                          placeholder="Banka Şubesi Seçiniz"
                                          required={true}
                                          InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                              <React.Fragment>
                                                {bankBranchList.length == 0 ? (
                                                  <CircularProgress color="inherit" size={20} />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                              </React.Fragment>
                                            ),
                                          }}
                                          {...register("banka_sube", {
                                            required: "Banka Şube alanı zorunlu",
                                          })}
                                        />
                                      )}
                                    />
                                    <small className="text-danger">
                                      {errors["banka_sube"]?.message}
                                    </small>
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <div className="kurum-adi mt-4  ">
                                  <Autocomplete
                                    value={selectedFinancialCompany}
                                    onChange={(event, newValue) => {
                                      setSelectedFinancialCompany(newValue);
                                    }}
                                    options={financialCompanyList}
                                    getOptionLabel={(option) => option.name}
                                    sx={{ width: "100%" }}
                                    size="small"
                                    loading={financialCompanyList.length > 0 ? false : true}
                                    renderInput={(params) => (
                                      <TextField
                                        error={errors.finansal_kurum_adi}
                                        {...params}
                                        label="Finansal Kurum Adı"
                                        placeholder="Finansal Kurum Adı Seçiniz"
                                        required={true}
                                        InputProps={{
                                          ...params.InputProps,
                                          endAdornment: (
                                            <React.Fragment>
                                              {financialCompanyList.length == 0 ? (
                                                <CircularProgress color="inherit" size={20} />
                                              ) : null}
                                              {params.InputProps.endAdornment}
                                            </React.Fragment>
                                          ),
                                        }}
                                        {...register("finansal_kurum_adi", {
                                          required: "Finansal Kurum Adı alanı zorunlu",
                                        })}
                                      />
                                    )}
                                  />

                                  <small className="text-danger">
                                    {errors["finansal_kurum_adi"]?.message}
                                  </small>
                                </div>
                              </>
                            )}
                          </>
                        )}

                        <input
                          type="submit"
                          className="btn-custom btn-timeline-forward w-100 mt-3"
                          value="Dask Tekliflerini Getir"
                        />
                      </form>
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="clear-fix"></div>
      </section>
    </>
  );
};

export default Inquiry;
