import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "/instances/axios";

//components
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

export default function App() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();

  const systemServiceLogsDetailsUrls = [
    {
      service: "casco",
      quote: "/api/quote/v1/casco/getcascoinsuredcompanyservicelogsbytransactionid",
      policy: "/api/policy/v1/casco/getcascoinsuredcompanyservicelogsbytransactionid",
    },
    {
      service: "traffic",
      quote: "/api/quote/v1/traffic/gettrafficinsuredcompanyservicelogsbytransactionid",
      policy: "/api/policy/v1/traffic/gettrafficinsuredcompanyservicelogsbytransactionid",
    },
    {
      service: "tss",
      quote: "/api/quote/v1/tss/gettssinsuredcompanyservicelogsbytransactionid",
      policy: "/api/policy/v1/tss/gettssinsuredcompanyservicelogsbytransactionid",
    },
    {
      service: "travel",
      quote: "/api/quote/v1/travel/gettravelinsuredcompanyservicelogsbytransactionid",
      policy: "/api/policy/v1/travel/gettravelinsuredcompanyservicelogsbytransactionid",
    },
    {
      service: "dask",
      quote: "/api/quote/v1/dask/getdaskinsuredcompanyservicelogsbytransactionid",
      policy: "/api/policy/v1/dask/getdaskinsuredcompanyservicelogsbytransactionid",
    },
  ];
  const [params, setParams] = useState();
  const [token, setToken] = useState("");
  const [loader, setLoader] = useState(true);
  const [systemServiceLogsDetails, setSystemServiceLogsDetails] = useState([]);
  const [popupJsonData, setPopupJsonData] = useState();
  const [popupJsonShow, setPopupJsonShow] = useState();

  useEffect(() => {
    if (Object.keys(router.query).length) {
      setParams(router.query);
    }
  }, [router.query]);

  useEffect(async () => {
    //Authorization için token çekiyoruz.
    if (!token && params && Object.keys(params).length) {
      console.log("Params: ", params);
      await getNewToken().then((res) => {
        setToken(res);
      });
      console.log("Params: ", params);
    }
  }, [params]);

  useEffect(async () => {
    if (token) {
      await getSystemServiceLogsDetails();
    }
  }, [token]);

  const getSystemServiceLogsDetails = async () => {
    setLoader(true);
    try {
      let url = systemServiceLogsDetailsUrls.find((item) => item.service === params.service)[
        params.apiservice
      ];
      await axios
        .get(url, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: {
            transactionId: params.transactionId.toString(),
          },
        })
        .then((res) => {
          if (res.data.success) {
            console.log(res.data);
            setSystemServiceLogsDetails(res.data.data);
            setLoader(false);
          }
        });
    } catch (error) {
      writeResponseError(error);
      setLoader(false);
    }
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
          {systemServiceLogsDetails.length > 0 ? (
            <>
              <h4 className="mt-1 mb-3 text-center">
                <b>Log Detayları</b>
              </h4>
              <div className="table-wrapper mt-4">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Şirket</th>
                        <th scope="col">Method</th>
                        <th scope="col">İstek</th>
                        <th scope="col">Cevap</th>
                        <th scope="col">Tarih</th>
                      </tr>
                    </thead>
                    <tbody>
                      {systemServiceLogsDetails.map((log, index) => {
                        return (
                          <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{log.companY_NAME}</td>
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
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="d-flex justify-content-center">
              <Alert
                severity="warning"
                className="mt-4"
                style={{ fontSize: "11pt", maxWidth: "600px", minWidth: "500px" }}
              >
                Üzgünüz servis detayı bulunamadı.
              </Alert>
            </div>
          )}
          <div className="clear-fix"></div>
          <div className="clear-fix"></div>
        </div>
      </section>
    </>
  );
}
