import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "/instances/axios";
//state çağırma ve değiştirme işlemi
import { useDispatch } from "react-redux";

//Functions
import { saveBlobByteArray, getNewToken, writeResponseError } from "/functions/common";

//Components
import PagePreLoader from "/components/common/PagePreLoader";
import PreLoader from "/components/PreLoader";
import PageMessage from "/components/PageMessage";
import Alert from "@mui/material/Alert";

//İmages
import { CascoPrintPolicyBanner, CascoPrintPolicyIcon } from "/resources/images.js";

//Temp
import { sampleCascoPolicyPrintResponse } from "/resources/temp.js";

const PaymentResult = () => {
  const router = useRouter();
  const { status, service } = router.query;
  const [state, setState] = React.useState({
    pdfList: [],
    responseError: undefined,
  });

  const [query, setQuery] = useState();
  const [token, setToken] = useState("");
  const [creditCardInformation, setCreditCardInformation] = useState(undefined);
  const [inquiryInformations, setInquiryInformations] = useState();
  const [quotePolicy, setQuotePolicy] = useState();
  const [ticket, setTicket] = useState();
  const [paymentResult, setPaymentResult] = useState();
  const [policyResult, setPolicyResult] = useState(undefined);
  const [loader, setLoader] = useState(true);
  const [policyDocument, setPolicyDocument] = useState([]);
  const [policyDocumentResponseStatus, setPolicyDocumentResponseStatus] = useState(undefined);

  const [request, setRequest] = useState();

  //Query bilgisi geldiğikten sonra Authorization için token çekiyoruz.
  useEffect(async () => {
    if (token == "" && Object.keys(router.query).length > 0) {
      await getNewToken().then((res) => setToken(res));
      setQuery(router.query);
    }
  }, [router.query]);

  //Token Bilgisi geldiğinde user information'ı getiriyoruz.
  useEffect(() => {
    //user bilgilerini getiriyoruz.
    if (token && JSON.parse(localStorage.getItem("inquiryInformations"))) {
      const inquiryInformationData = JSON.parse(localStorage.getItem("inquiryInformations"));
      setInquiryInformations(inquiryInformationData);
    }
  }, [token]);

  //inquiryInformations bilgisi geldiğinde quotePolicy'i getiriyoruz.
  useEffect(() => {
    if (inquiryInformations) {
      let quotePolicyLocal = JSON.parse(localStorage.getItem("quotePolicy"));
      if (quotePolicyLocal) {
        setQuotePolicy(quotePolicyLocal);
      }
    }
  }, [inquiryInformations]);

  //quotePolicy bilgisi geldiğinde 3d ödeme için localden ticket'i getiriyoruz.
  useEffect(() => {
    if (quotePolicy) {
      let ticketLocal = JSON.parse(localStorage.getItem("ticket"));
      if (ticketLocal) {
        setTicket(ticketLocal);
      }
    }
  }, [quotePolicy]);

  //Ticket bilgisi geldikten sonra poliçeleştirme sonucunu getiriyoruz..
  useEffect(() => {
    if (ticket) {
      getPolicyResult();
    }
  }, [ticket]);

  //Poliçe result başarılı ise poliçe dokümanlarını getiriyoruz.
  useEffect(async () => {
    if (policyResult) {
      getPolicyDocuments();
    }
  }, [policyResult]);

  //Ödeme İşlemi Sonucunu Getirme
  const getPolicyResult = async () => {
    if (query.paymentTwoCheckStatus) {
      setPolicyResult(Boolean(query.paymentTwoCheckStatus === "true"));
    } else {
      //Mobile Express Kontrolü
      switch (Number(quotePolicy.companyCode)) {
        case 150:
          if (query.Result.toLowerCase() == "success") {
            await getPolicy().then((res) => {
              setPolicyResult(res);
            });
          } else {
            setPolicyResult(false);
          }
          break;
        case 160:
          if (query.status.toLowerCase() == "success") {
            await getPolicy().then((res) => {
              setPolicyResult(res);
            });
          } else {
            setPolicyResult(false);
          }
          break;
        default:
          setPolicyResult(Boolean(query.paymentTwoCheckStatus === "true"));
      }
    }
  };

  //3D ödeme gerçekleştirdikten sonra backend'e bilgi veriyoruz.
  const getPolicy = async () => {
    let postUrl = "";
    switch (quotePolicy.service.toString()) {
      case "casco":
        postUrl = "/api/policy/v1/casco/getcascopolicy";
        break;
      case "traffic":
        postUrl = "/api/policy/v1/traffic/gettrafficpolicy";
        break;
      case "tss":
        postUrl = "/api/policy/v1/tss/gettsspolicy";
        break;
      case "travel":
        postUrl = "/api/policy/v1/travel/gettravelpolicy";
        break;
      case "dask":
        postUrl = "/api/policy/v1/dask/getdaskpolicy";
        break;
      case "personelaccident":
        postUrl = "/api/policy/v1/personelaccident/getpersonelaccidentpolicy";
        break;
    }

    let inquiryInformationsData = inquiryInformations;
    inquiryInformationsData.companyCode = Number(quotePolicy.companyCode);

    const bodyData = {
      companyCode: Number(quotePolicy.companyCode), //########
      card: {
        type: 0,
        owner: "string",
        number: "string",
        cvv: "string",
        expiryMonth: 0,
        expiryYear: 0,
      },
      quote: {
        quoteReference: quotePolicy.quoteReference ? quotePolicy.quoteReference.toString() : null, //########
        revisionNumber: quotePolicy.revisionNumber ? quotePolicy.revisionNumber.toString() : null, //########
      },
      quoteParameters: inquiryInformationsData,
      payment3DInfo: {
        isPay3dPost: true,
        orderNo: ticket.orderNo.toString(),
        mobilexpressID: ticket.mobilexpressID.toString(),
      },
      installment: 1, //########
    };

    console.log("Gönderilen Request: ", JSON.stringify(bodyData));

    setRequest(bodyData);

    try {
      let res = await axios.post(postUrl, bodyData, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return res.data.success;
    } catch (error) {
      writeResponseError(error);
      return false;
    }
  };

  //Backend olumlu cevap dönerse poliçe dökümanını getiriyoruz.
  const getPolicyDocuments = async () => {
    let postUrl = "";
    switch (quotePolicy.service.toString()) {
      case "casco":
        postUrl = "/api/print/v1/casco/printcascopolicy";
        break;
      case "traffic":
        postUrl = "/api/print/v1/traffic/printtrafficpolicy";
        break;
      case "tss":
        postUrl = "/api/print/v1/tss/printtsspolicy";
        break;
      case "travel":
        postUrl = "/api/print/v1/travel/printtravelpolicy";
        break;
      case "dask":
        postUrl = "/api/print/v1/dask/printdaskpolicy";
        break;
      case "personelaccident":
        postUrl = "/api/print/v1/personelaccident/printpersonelaccidentpolicy";
        break;
    }

    try {
      let bodyData = {
        companyCode: Number(quotePolicy.companyCode),
        quoteReference: quotePolicy.quoteReference.toString(),
        revisionNumber: quotePolicy.revisionNumber.toString(),
      };

      console.log("Print: ", bodyData);
      await axios
        .post(postUrl, bodyData, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            let responsePdfList = res.data.data.pdfList;

            let pdfList = [];
            if (responsePdfList[0].printLink) {
              let pdfDocument = {
                url: responsePdfList[0].printLink,
                documentType: "",
              };
              pdfList.push(pdfDocument);
            } else {
              responsePdfList.map((document, index) => {
                //Base64 dosyalarını pdf url'ine çeviriyoruz.
                let pdfDocument = {
                  url: saveBlobByteArray(document.binaryData),
                  documentType: document.documentType,
                };
                pdfList.push(pdfDocument);
              });
            }
            setPolicyDocument(pdfList);
          } else {
            setPolicyDocumentResponseStatus(false);
          }
        });
    } catch (error) {
      writeResponseError(error);
      setPolicyDocumentResponseStatus(false);
    }
  };

  return (
    <section>
      {policyResult == undefined && <PagePreLoader />}
      <div className="container" style={{ marginTop: "120px", marginBottom: "400px" }}>
        {/* {JSON.stringify(query)} */}
        {/* {JSON.stringify(paymentResult)} */}
        {/* {JSON.stringify(request)} */}

        {policyResult == true && (
          <>
            {/* <PageMessage message="Poliçeleştirme İşlemi Başarılı." messageCode="1"></PageMessage> */}
            <div className="row justify-content-center">
              <div className="col-12 col-md-12 col-lg-10">
                {/* Banner */}
                <div className="banner w-100">
                  <img src={CascoPrintPolicyBanner} style={{ width: "100%" }} alt="" />
                  <h2 className="mt-2"> KASKO POLİÇESİ</h2>
                  <div>Aracınız Güvende</div>
                </div>
                {/* Policy documents and service advert */}
                {policyDocumentResponseStatus == undefined ? (
                  <>
                    {policyDocument.length == 0 ? (
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <div style={{ display: "block", textAlign: "center" }}>
                          <h3 style={{ textAlign: "center" }}>Dokümanlar Yükleniyor</h3>
                          <div
                            className="preloader"
                            style={{ display: "flex", justifyContent: "center" }}
                          >
                            <PreLoader></PreLoader>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <div className="row">
                          <div className="col-12 col-md-4 col-lg-4">
                            <div
                              className="document d-flex justify-content-center"
                              style={{ padding: "25px" }}
                            >
                              <img
                                src={CascoPrintPolicyIcon}
                                style={{
                                  width: "100%",
                                  maxWidth: "200px",
                                  borderRadius: "50%",
                                }}
                                alt=""
                              />
                            </div>
                            <div className="policy-download">
                              <a
                                className="btn-main mx-2 p-2 mt-2"
                                href={policyDocument[0].url}
                                style={{
                                  display: "inline-flex",
                                  boxSizing: "border-box",
                                  alignItems: "center",
                                }}
                                target="_blank"
                              >
                                <i className="far fa-file-alt mr-2 fa-lg"></i>
                                Poliçemi İndir
                              </a>
                            </div>
                          </div>
                          <div className="col-12 col-md-8 col-lg-8">
                            <div className="py-1 bg-main-light color-main">
                              <h3>Aracınız Güvende</h3>
                            </div>
                            <div className="py-1 mt-4" style={{ backgroundColor: "aliceblue" }}>
                              <h3 className="w-100 d-block">
                                Size Özel Fırsatlardan Yararlanmak İster misiniz?
                              </h3>
                              <a className="w-100 d-block" href="/insurance/traffic">
                                TRAFİK SİGORTASI
                              </a>
                              <a className="w-100 d-block" href="/insurance/health/complementary">
                                TAMAMLAYICI SAĞLIK SİGORTASI
                              </a>
                            </div>

                            <div className="d-block text-left mt-4">
                              <div className="news-notification-confirmation mt-2 d-block w-100">
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
                              <div className="w-100 d-block mt-3">
                                <a
                                  className="btn-main py-1 px-4 mt-2"
                                  href="#"
                                  style={{ float: "right" }}
                                >
                                  Onayla
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="d-block text-center mb-3 mt-4">
                    <Alert
                      severity="error"
                      className=""
                      style={{ fontSize: "13pt", display: "inline-flex" }}
                    >
                      Poliçe belgesi getirilirken bir hata oluştu, lütfen daha sonra tekrar
                      deneyiniz.
                    </Alert>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {policyResult == false && (
          <>
            <PageMessage
              message="Üzgünüz Ödeme İşlemlerinde Bir Hata Oluştu. Lütfen daha sonra tekrar deneyiniz."
              messageCode="0"
            ></PageMessage>
          </>
        )}
      </div>
    </section>
  );
};

export default PaymentResult;
