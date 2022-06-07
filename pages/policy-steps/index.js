import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "/instances/axios";

//Components
import PreLoader from "/components/PreLoader";
import PageMessage from "/components/PageMessage";
import Alert from "@mui/material/Alert";
import Stepper from "/components/common/Stepper";
import PagePreLoader from "/components/common/PagePreLoader";
import GetQuotePrint from "/components/common/GetQuotePrint";

import {
  AkSigortaLogo,
  AnadoluSigortaLogo,
  AllianzSigortaLogo,
  MapfreSigortaLogo,
  SomboSigortaLogo,
  ZurichSigortaLogo,
  HdiSigortaLogo,
} from "/resources/images";

//fonksiyonlar
import {
  saveBlobByteArray,
  getNewToken,
  writeResponseError,
  numberToTrNumber,
} from "/functions/common";

const PolicySteps = () => {
  const router = useRouter();
  const { quoteReference } = router.query;

  const [state, setState] = useState({
    companyLogo: undefined,
    general_assurances: [
      { label: "Çarpma, Çarpışma", value: "Evet" },
      { label: "Çalınma", value: "Evet" },
      { label: "Yanma", value: "Evet" },
      { label: "Grev Lokavt Halk Hareketleri Teminatı ve Terör Teminatı", value: "Evet" },
      { label: "Sel", value: "Evet" },
      { label: "Deprem", value: "Evet" },
      { label: "Kemirgen ve diğer hayvanların vereceği zararlar", value: "Evet" },
      { label: "Oto Cam", value: "Evet" },
      { label: "Anahtarla Çalınma", value: "Evet" },
      { label: "Anahtar Kaybı", value: "Evet" },
      { label: "Yedek Araç Temini ", value: "Evet" },
    ],
    responsibility_assurances: [
      { label: "Artan Mali Mesuliyet (Ayrımlı)", value: "10 - 30 10 Bin TL" },
      { label: "Artan Mali Mesuliyet (Manevi Tazminat)", value: "Yok" },
      { label: "Hukuksal Koruma (Sürücü)", value: "5.000 TL" },
      { label: "Hukuksal Koruma (Araç)", value: "5.000 TL" },
    ],
    exemptions: [
      { label: "Kasko Muafiyeti", value: "Yok", explanation: "", icon: "" },
      { label: "Deprem Muafiyeti", value: "Yok" },
      { label: "Sel Muafiyeti", value: "Yok" },
      { label: "Cam Muafiyeti", value: "Yok" },
    ],
    services: [{ label: "Servis Seçimi", value: "Sigortalı Belirler" }],
    replacementParts: [
      {
        label: "Orjinal Parça",
        value: "",
        explanation: "Aracı Original Parçası",
        icon: "fas fa-check",
      },
      { label: "Eşdeğer Parça", value: "", explanation: "", icon: "fas fa-check" },
    ],
    otherAssurances: [
      {
        label: "Ferdi Kaza (Ölüm/Sürekli Sakatlık)",
        value: "5.000 TL",
        explanation: "",
        icon: "fas fa-pencil-alt",
      },
      {
        label: "Ferdi Kaza (Tedavi Masrafları)",
        value: "Yok",
        explanation: "",
        icon: "fas fa-pencil-alt",
      },
      {
        label: "Yetkili Olmayan Kişilerce Çekilme",
        value: "",
        explanation: "",
        icon: "fas fa-check",
      },
      {
        label: "Sigara vb. madde teması ile meydana gelen yangın dışındaki zararlar",
        value: "",
        explanation: "",
        icon: "fas fa-check",
      },
      {
        label: "Patlayıcı, Parlayıcı ve Yanıcı Madde Taşıma",
        value: "",
        explanation: "",
        icon: "fas fa-check",
      },
    ],
    pdfList: [],
    responseMessage: { status: 0, message: "" },
  });
  const [token, setToken] = useState("");
  const [companyLogo, setCompanyLogo] = useState();
  const [params, setParams] = useState();
  const [quotePolicy, setQuotePolicy] = useState();

  useEffect(() => {
    setParams(router.asPath.split("?")[1]);
  }, []);

  useEffect(async () => {
    //Authorization için token çekiyoruz.
    if (token == "" && quoteReference) {
      await getNewToken().then((res) => setToken(res));
    }
  }, [quoteReference]);

  useEffect(() => {
    if (token != "") {
      let quotePolicy = JSON.parse(localStorage.getItem("quotePolicy"));
      if (quotePolicy) {
        setQuotePolicy(quotePolicy);
      }
    }
  }, [token]);

  useEffect(() => {
    //console.log(typeof companyCode);
    if (quotePolicy) {
      switch (Number(quotePolicy.companyCode)) {
        case 100:
          setCompanyLogo(AkSigortaLogo);
          break;
        case 110:
          setCompanyLogo(AnadoluSigortaLogo);
          break;
        case 120:
          setCompanyLogo(AllianzSigortaLogo);
          break;
        case 150:
          setCompanyLogo(HdiSigortaLogo);
          break;
        case 160:
          setCompanyLogo(MapfreSigortaLogo);
          break;
        case 180:
          setCompanyLogo(SomboSigortaLogo);
          break;
        case 200:
          setCompanyLogo(ZurichSigortaLogo);
          break;
      }

      getQuoteDocuments();
    }
  }, [quotePolicy]);

  //http requestler
  const getQuoteDocuments = async () => {
    let postUrl = "";
    // if (quotePolicy.service == "casco") {
    //   postUrl = "/api/print/v1/Casco/printcascoquote";
    // } else if (quotePolicy.service == "traffic") {
    //   postUrl = "/api/print/v1/traffic/printtrafficquote";
    // } else if (quotePolicy.service == "health") {
    //   postUrl = "/api/print/v1/Health/printhealthquote";
    // }

    try {
      let bodyData = {
        companyCode: Number(quotePolicy.companyCode),
        quoteReference: quotePolicy.quoteReference.toString(),
        revisionNumber: quotePolicy.revisionNumber.toString(),
      };

      console.log(postUrl);
      console.log(bodyData);
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
            //State atama yapıyoruz.
            let { pdfList } = state;
            if (res.data.data.pdfList[0].printLink) {
              let pdfDocument = {
                url: res.data.data.pdfList[0].printLink,
                documentType: "",
              };
              pdfList.push(pdfDocument);
            } else {
              //State atama yapıyoruz.
              let { pdfList } = state;
              responsePdfList.map((document, index) => {
                //Base64 dosyalarını pdf url'ine çeviriyoruz.
                let pdfDocument = {
                  url: saveBlobByteArray(document.binaryData),
                  documentType: document.documentType,
                };
                pdfList.push(pdfDocument);
              });
            }
            setState({ ...state, pdfList: pdfList });

            setState({
              ...state,
              responseMessage: { status: 1, message: "Teklif Basımı Başarılı" },
            });
          }
        });
    } catch (error) {
      writeResponseError(error);
      setState({ ...state, responseMessage: { status: 1, message: "Teklif Basımı Başarısız" } });
    }
  };

  return (
    <section>
      {state.pdfList && state.pdfList.length == 0 && state.responseMessage.message == "" ? (
        <PagePreLoader />
      ) : (
        <div className="container" style={{ marginTop: "100px" }}>
          <>
            {/*Stepper Start*/}
            <Stepper
              steps={["Teminat Detayları", "Bilgi Doğrulama", "Ödeme Ekranı"]}
              activeStep={1}
              style={{ marginTop: "100px" }}
            />

            <div className="row offer-details custom-content-body  mb-5 mt-5">
              {/*Header*/}
              <div className="col-12">
                <div
                  className="offer-detail-header d-flex justify-content-between mt-3"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="header-left-side">
                    <div className="d-flex flex-row" style={{ alignItems: "center" }}>
                      <img
                        style={{ height: "60px" }}
                        src={companyLogo}
                        alt=""
                        className="img-fluid mr-5"
                      />
                      {quotePolicy.productName &&
                        quotePolicy.productName != "undefined" &&
                        quotePolicy.productName != "null" &&
                        quotePolicy.productName != "" && (
                          <div className="offer-product-name">{quotePolicy.productName}</div>
                        )}
                    </div>
                    <div className="d-flex flex-row mt-3">
                      <div className="header-action-icon">
                        <i className="fas fa-book"></i>
                        Sözlük
                      </div>
                      <div className="header-action-icon">
                        <i className="fas fa-search"></i>
                        Gözat
                      </div>
                      <div className="header-action-icon">
                        <i className="far fa-envelope"></i>
                        Email
                      </div>
                      <div className="header-action-icon">
                        <GetQuotePrint
                          token={token}
                          service={quotePolicy.service}
                          companyCode={quotePolicy.companyCode}
                          quoteReference={quotePolicy.quoteReference}
                          revisionNumber={quotePolicy.revisionNumber}
                          view="icon"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="header-right-side">
                    <div className="buy-now">
                      <div className="card-text insurance-price text-center mb-2">
                        {numberToTrNumber(quotePolicy.brutPrim)} TL{" "}
                      </div>
                      <a
                        href={"/policy-steps/verify-information?" + params}
                        className="btn-custom p-2 mt-5"
                      >
                        HEMEN SATIN AL
                      </a>
                    </div>
                  </div>
                </div>
                <hr />
              </div>

              {(quotePolicy.service == "casco" || quotePolicy.service == "traffic") && (
                <>
                  {/**Specifications */}
                  <div className="col-12 mt-4">
                    <div className="row offer-detail-specifications">
                      <div className="col-12 col-md-12 col-lg-6">
                        <div className="general-assurances">
                          <h4 className="font-weight-bold">GENEL TEMİNATLAR</h4>
                          <table className="table table-borderless">
                            <tbody>
                              {state.general_assurances.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{item.label}</td>
                                    <td style={{ textAlign: "end" }}>{item.value}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="responsibility-assurances mt-2">
                          <h4 className="font-weight-bold">SORUMLULUK TEMİNATLAR</h4>

                          <table className="table table-borderless">
                            <tbody>
                              {state.responsibility_assurances.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{item.label}</td>
                                    <td style={{ textAlign: "end" }}>
                                      {item.value} <i className="fas fa-pencil-alt ml-2"></i>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="exemptions mt-2">
                          <h4 className="font-weight-bold">MUAFİYETLER</h4>
                          <table className="table table-borderless">
                            <tbody>
                              {state.exemptions.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    {item.label && <td>{item.label}</td>}
                                    <td style={{ textAlign: "end" }}>
                                      {item.value} <i className="fas fa-pencil-alt ml-2"></i>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="col-12 col-md-12 col-lg-6">
                        <div className="responsibility-assurances">
                          <h4 className="font-weight-bold">SERVİS VE YEDEK PARÇA</h4>
                          <h5 className="ml-2">SERVİS</h5>
                          <table className="table table-borderless">
                            <tbody>
                              {state.services.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{item.label}</td>
                                    <td style={{ textAlign: "end" }}>
                                      {item.value} <i className="fas fa-pencil-alt ml-2"></i>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          {/**/}
                          <h5 className="ml-2">YEDEK PARÇA</h5>
                          <table className="table table-borderless">
                            <tbody>
                              {state.replacementParts.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{item.label}</td>
                                    <td style={{ textAlign: "end" }}>
                                      {item.value} <i className="fas fa-pencil-alt ml-2"></i>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="responsibility-assurances mt-2">
                          <h4 className="font-weight-bold">DİĞER TEMİNATLAR</h4>
                          <table className="table table-borderless">
                            <tbody>
                              {state.otherAssurances.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{item.label}</td>
                                    <td style={{ textAlign: "end", width: "max-content" }}>
                                      <div style={{ width: "100px" }}>
                                        {item.value} <i className={item.icon + " ml-2"}></i>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        </div>
      )}
    </section>
  );
};

export default PolicySteps;
