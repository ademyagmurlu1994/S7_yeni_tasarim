import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "/instances/axios";
import { cloneDeep, cloneDeepWith, clone } from "lodash-es";

//components
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Button from "/components/form/Button";
import PagePreLoader from "/components/common/PagePreLoader";
import JsonViewer from "/components/pop-up/JsonViewer";

//fonksiyonlar
import {
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
  isValidTcKimlikOrVergiKimlik,
  separateLetterAndNumber,
  getNewToken,
} from "/functions/common";

//Styles
import { inputStyle } from "/styles/custom";
import { WindowSharp } from "@mui/icons-material";

export default function App() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm();

  const serviceLogUrls = [
    {
      insuranceService: "Kasko",
      shortTitle: "casco",
      apiServices: [
        {
          title: "Teklif",
          shortTitle: "quote",
          url: "/api/quote/v1/casco/getcascosystemservicelogs",
        },
        {
          title: "Police",
          shortTitle: "policy",
          url: "/api/policy/v1/casco/getcascosystemservicelogs",
        },
      ],
    },
    {
      insuranceService: "Trafik",
      shortTitle: "traffic",
      apiServices: [
        {
          title: "Teklif",
          shortTitle: "quote",
          url: "/api/quote/v1/traffic/gettrafficsystemservicelogs",
        },
        {
          title: "Police",
          shortTitle: "policy",
          url: "/api/policy/v1/traffic/gettrafficsystemservicelogs",
        },
      ],
    },
    {
      insuranceService: "Tamamlayıcı Sağlık",
      shortTitle: "tss",
      apiServices: [
        {
          title: "Teklif",
          shortTitle: "quote",
          url: "/api/quote/v1/tss/gettsssystemservicelogs",
        },
        {
          title: "Police",
          shortTitle: "policy",
          url: "/api/policy/v1/tss/gettsssystemservicelogs",
        },
      ],
    },
    {
      insuranceService: "Seyahat Sağlık",
      shortTitle: "travel",
      apiServices: [
        {
          title: "Teklif",
          shortTitle: "quote",
          url: "/api/quote/v1/travel/gettravelsystemservicelogs",
        },
        {
          title: "Police",
          shortTitle: "policy",
          url: "/api/policy/v1/travel/gettravelsystemservicelogs",
        },
      ],
    },
    {
      insuranceService: "DASK",
      shortTitle: "dask",
      apiServices: [
        {
          title: "Teklif",
          shortTitle: "quote",
          url: "/api/quote/v1/dask/getdasksystemservicelogs",
        },
        {
          title: "Police",
          shortTitle: "policy",
          url: "/api/policy/v1/dask/getdasksystemservicelogs",
        },
      ],
    },
  ];
  const monthRanges = [
    {
      label: "Son 1 ay",
      value: 1,
    },
    {
      label: "Son 3 ay",
      value: 3,
    },
    {
      label: "Son 6 ay",
      value: 6,
    },
    {
      label: "Son 9 ay",
      value: 9,
    },
    {
      label: "Son 12 ay",
      value: 12,
    },
    {
      label: "Tümü",
      value: "",
    },
  ];

  const [state, setState] = useState({
    tcOrTaxIdentityNo: "",
    service: "",
    apiService: "",
  });

  const [token, setToken] = useState();
  const [loader, setLoader] = useState(true);
  const [systemServiceLogs, setSystemServiceLogs] = useState([]);
  const [popupJsonData, setPopupJsonData] = useState();
  const [popupJsonShow, setPopupJsonShow] = useState();
  const [alertMessage, setAlertMessage] = useState({ severity: "", message: "" });

  //Autocomplete states
  const [selectedInsuranceService, setSelectedInsuranceService] = useState("");
  const [selectedApiService, setSelectedApiService] = useState("");
  const [selectedMonthRange, setSelectedMonthRange] = useState("");

  useEffect(async () => {
    //Authorization için token çekiyoruz.
    if (!token) {
      await getNewToken().then((res) => {
        setToken(res);
        setLoader(false);
      });
    }
  }, []);

  const getSystemServiceLogs = async () => {
    setLoader(true);

    //Autocomplete değiştinde service ve api servisi detail sayfasına giderken hafızada tutmamız gerekiyor.
    setState({
      ...state,
      service: cloneDeep(selectedInsuranceService.shortTitle),
      apiService: cloneDeep(selectedApiService.shortTitle),
    });

    try {
      await axios
        .get(selectedApiService.url, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: {
            idendityNo: state.tcOrTaxIdentityNo.toString(),
            monthRange: Number(selectedMonthRange.value) || null, // Number(selectedCarModelYear),
          },
        })
        .then((res) => {
          if (res.data.success) {
            console.log(res.data);
            setSystemServiceLogs(res.data.data);

            setLoader(false);
            if (res.data.data.length == 0) {
              setAlertMessage({
                severity: "warning",
                message: "Herhangi bir log kaydı bulunamadı.",
              });
            }
          }
        });
    } catch (error) {
      writeResponseError(error);
      setLoader(false);
      setAlertMessage({
        severity: "error",
        message: "Üzgünüz beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.",
      });
      setSystemServiceLogs([]);
    }
  };

  //Normal Donksiyonlar
  const validateData = () => {
    getSystemServiceLogs();
  };

  const getDetails = (transactionId) => {
    window.open(
      "/systemlogs/details?transactionId=" +
        transactionId +
        "&service=" +
        state.service +
        "&apiservice=" +
        state.apiService,
      "_blank"
    );
  };

  return (
    <>
      {loader && <PagePreLoader />}
      <JsonViewer
        show={popupJsonShow}
        jsonData={popupJsonData}
        onClose={() => setPopupJsonShow(false)}
      />
      <section className="section">
        <div
          className="container-fluid"
          style={{
            maxWidth: "1500px",
          }}
        >
          <form autoComplete="off" onSubmit={handleSubmit(validateData)} id="firstStep" key="1">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-3 mt-3">
                <TextField
                  {...register("tcOrTaxIdentityNo", {
                    required: "T.C. veya Vergi Kimlik Numarası zorunlu",
                    validate: isValidTcKimlikOrVergiKimlik,
                  })}
                  value={state.tcOrTaxIdentityNo || ""}
                  onChange={(e) => {
                    console.log("Change value: ", e.target.value);
                    setState({ ...state, tcOrTaxIdentityNo: e.target.value });
                    clearErrors("tcOrTaxIdentityNo");
                  }}
                  onPaste={(event) => {
                    setState({
                      ...state,
                      tcOrTaxIdentityNo: event.clipboardData
                        .getData("text/plain")
                        .trim()
                        .substring(0, 11),
                    });
                    document.getElementsByName("tcOrTaxIdentityNo")[0].blur();
                    setValue(
                      "tcOrTaxIdentityNo",
                      event.clipboardData.getData("text/plain").trim().substring(0, 11)
                    );
                    clearErrors("tcOrTaxIdentityNo");
                  }}
                  InputProps={{
                    inputProps: {
                      type: "number",
                      maxLength: "11",
                    },
                  }}
                  sx={{
                    ...inputStyle,
                  }}
                  size="small"
                  error={errors && Boolean(errors["tcOrTaxIdentityNo"])}
                  label=" T.C. veya Vergi Kimlik No *"
                  autoComplete="off"
                  type="number"
                />

                <small className="text-danger">
                  {errors["tcOrTaxIdentityNo"]?.message}
                  {/**Validate Message */}
                  {errors.tcOrTaxIdentityNo && errors.tcOrTaxIdentityNo.type == "validate"
                    ? state.tcOrTaxIdentityNo.toString().length == 10
                      ? "Geçersiz Vergi Kimlik Numarası"
                      : "Geçersiz T.C. Kimlik Numarası"
                    : ""}
                </small>
              </div>
              <div className="col-12 col-md-6 col-lg-3 mt-3">
                <Autocomplete
                  value={selectedInsuranceService}
                  onChange={(event, newValue) => {
                    setSelectedInsuranceService(newValue);
                    setSelectedApiService("");
                  }}
                  options={serviceLogUrls}
                  getOptionLabel={(option) => option.insuranceService || ""}
                  sx={{ ...inputStyle, width: "100%" }}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      name="sigortaservisi"
                      {...params}
                      label="Sigorta Servisi"
                      placeholder="Sigorta servisi seçiniz"
                      required={true}
                      InputProps={{
                        ...params.InputProps,
                      }}
                    />
                  )}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-3 mt-3">
                <Autocomplete
                  value={selectedApiService}
                  onChange={(event, newValue) => {
                    setSelectedApiService(newValue);
                  }}
                  options={selectedInsuranceService?.apiServices || []}
                  getOptionLabel={(option) => option.title || ""}
                  sx={{ ...inputStyle, width: "100%" }}
                  size="small"
                  disabled={!selectedInsuranceService}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Api Servisi"
                      placeholder="Api servisi seçiniz"
                      required={true}
                      InputProps={{
                        ...params.InputProps,
                      }}
                    />
                  )}
                />
              </div>
              <div className="col-12 col-md-6 col-lg-3 mt-3">
                <Autocomplete
                  value={selectedMonthRange}
                  onChange={(event, newValue) => {
                    setSelectedMonthRange(newValue);
                  }}
                  options={monthRanges}
                  getOptionLabel={(option) => option.label || ""}
                  sx={{ ...inputStyle, width: "100%" }}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Ay Aralığı"
                      placeholder="Ay aralığı seçiniz"
                      required={true}
                      InputProps={{
                        ...params.InputProps,
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div className="row justify-content-end mt-3">
              <div className="col-12 col-md-6 col-lg-3">
                <Button
                  type="submit"
                  //   disabled={buttonLoader.stepOne}
                  //   loading={buttonLoader.stepOne}
                  sx={{ width: "100%" }}
                >
                  Uygula
                </Button>
              </div>
            </div>
          </form>
          {systemServiceLogs.length > 0 ? (
            <div className="table-wrapper mt-4">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Şirket</th>
                      <th scope="col">Transaction ID</th>

                      <th scope="col">Method</th>
                      <th scope="col">İstek</th>
                      <th scope="col">Cevap</th>
                      <th scope="col">Tarih</th>
                      <th scope="col">Detaylar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systemServiceLogs.map((log, index) => {
                      return (
                        <tr>
                          <th scope="row">{index + 1}</th>
                          <td>{log.company}</td>
                          <td>{log.transactioN_ID}</td>
                          <td>{log.method}</td>
                          <td>
                            <Button
                              onClick={() => {
                                setPopupJsonData(log.request);
                                setPopupJsonShow(true);
                              }}
                              size="small"
                              variant="outlined"
                            >
                              Görüntüle
                            </Button>
                          </td>
                          <td>
                            <Button
                              onClick={() => {
                                setPopupJsonData(log.response);
                                setPopupJsonShow(true);
                              }}
                              size="small"
                              variant="outlined"
                            >
                              Görüntüle
                            </Button>
                          </td>

                          <td>{log.createD_DATE}</td>
                          <td>
                            <Button
                              onClick={() => {
                                getDetails(log.transactioN_ID);
                              }}
                              size="small"
                            >
                              Detaylar
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <>
              {alertMessage.message && (
                <div className="d-flex justify-content-center">
                  <Alert
                    severity={alertMessage.severity}
                    className="mt-4"
                    style={{ fontSize: "11pt", maxWidth: "600px", minWidth: "500px" }}
                  >
                    {alertMessage.message}
                  </Alert>
                </div>
              )}
            </>
          )}
          <div className="clear-fix"></div>
        </div>
      </section>
    </>
  );
}
