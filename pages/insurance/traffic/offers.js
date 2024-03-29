import React, { useState, useEffect } from "react";
import axios from "/instances/axios";
import { useRouter } from "next/router";

import VehicleInsurancePaymentOptions from "./VehicleInsurancePaymentOptions";
import VehicleInsurancePolicyCustomization from "./VehicleInsurancePolicyCustomization";
import PreLoader from "/components/PreLoader";
import PageMessage from "/components/PageMessage";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import GetQuotePrint from "/components/common/GetQuotePrint";

import {
  AkSigortaLogo,
  AnadoluLogo,
  AllianzLogo,
  MapfreLogo,
  SompoLogo,
  ZurichLogo,
  HdiLogo,
} from "/resources/images";

//fonksiyonlar
import {
  isValidTcKimlik,
  getTodayDate,
  getNewToken,
  writeResponseError,
  numberToTrNumber,
  sortList,
} from "/functions/common";

const VehicleInsuranceOffers = () => {
  const router = useRouter();
  const [inquiryInformations, setInquiryInformations] = useState();
  const [state, setState] = useState({
    offers: [],
    message: "",
    counter: [],
    verilerGetiriliyor: false,
    token: "",
    teklifFiyatlari: [],
    insuranceCompanies: [100, 110, 120, 150, 160, 180],
  });

  useEffect(async () => {
    if (!state.token) {
      setState({ ...state, token: await getNewToken() });
    }
  }, []);

  useEffect(() => {
    if (state.token) {
      let cascoInquiryInformations = JSON.parse(localStorage.getItem("inquiryInformations"));
      if (cascoInquiryInformations) {
        setInquiryInformations(cascoInquiryInformations);
      }
    }
  }, [state.token]);

  useEffect(() => {
    if (inquiryInformations) {
      if (state.counter.length != state.insuranceCompanies.length) {
        getAllOffers();
      }
    }
  }, [inquiryInformations]);

  const getAllOffers = async () => {
    for (const companyCode of state.insuranceCompanies) {
      getOffersFromCompany(companyCode);
    }
  };

  const getOffersFromCompany = async (companyCode) => {
    const bodyData = inquiryInformations;
    bodyData.companyCode = companyCode;
    console.log(bodyData);

    await axios
      .post("/api/quote/v1/Traffic/gettrafficquote", bodyData, {
        headers: {
          Authorization: state.token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log("Company Code:", companyCode, "\nResponse: ", res);
        if (res.data.success) {
          var data = res.data.data;
          mapOffersByCompanyCode(companyCode, data);

          let { counter } = state;
          counter.push({});
          setState({ ...state, counter: counter });
        }

        console.log(state.offers);
      })
      .catch((error) => {
        console.log("Company Code: ", companyCode);
        let { counter } = state;
        counter.push({});
        setState({ ...state, counter: counter });
        writeResponseError(error);
      });
  };

  const mapOffersByCompanyCode = (companyCode, data) => {
    switch (companyCode) {
      case 100:
        for (let item of data) {
          if (!item.error.statu && item.quote?.primBilgileri[0]?.prim) {
            let brutPrim = Number(item.quote.primBilgileri[0].prim);
            let offerObject = {
              companyCode: 100,
              quoteReference: item.quote.policeNo,
              revisionNumber: 0,
              companyLogo: AkSigortaLogo,
              brutPrim: brutPrim,
              productName: item.plan,
              customerName: "",
            };

            let { offers, teklifFiyatlari } = state;
            offers.push(offerObject);
            teklifFiyatlari.push(brutPrim);
            setState({ ...state, offers: offers, teklifFiyatlari: teklifFiyatlari });
          }
        }

        break;
      case 110:
        for (let item of data) {
          if (!item.error.statu && item.quote?.policySummary?.premiumInfo?.grossPremium) {
            let brutPrim = Number(item.quote.policySummary.premiumInfo.grossPremium);
            let offerObject = {
              companyCode: 110,
              quoteReference: item.quote.policyKey.proposalNumber,
              revisionNumber: item.quote.policyKey.revisionNumber,
              companyLogo: AnadoluLogo,
              brutPrim: brutPrim,
              productName: item.plan,
              customerName: "",
            };
            let { offers, teklifFiyatlari } = state;
            offers.push(offerObject);
            teklifFiyatlari.push(brutPrim);
            setState({ ...state, offers: offers, teklifFiyatlari: teklifFiyatlari });
          }
        }

        break;
      case 120:
        for (let item of data) {
          if (!item.error?.statu && item.quote?.totalPremium) {
            let brutPrim = Number(item.quote.totalPremium);
            let offerObject = {
              companyCode: 120,
              quoteReference: item.quoteReference.toString().split("/")[0],
              revisionNumber: item.quoteReference.toString().split("/")[1],
              companyLogo: AllianzLogo,
              brutPrim: brutPrim,
              productName: item.plan,
              customerName: "",
            };
            let { offers, teklifFiyatlari } = state;
            offers.push(offerObject);
            teklifFiyatlari.push(brutPrim);
            setState({ ...state, offers: offers, teklifFiyatlari: teklifFiyatlari });
          }
        }

        break;
      case 150:
        for (let item of data) {
          if (!item.error?.statu && item.quote?.BrutPrimTRF) {
            let brutPrim = Number(item.quote.BrutPrimTRF);
            let offerObject = {
              companyCode: 150,
              quoteReference: item.quote.ReferansNo,
              revisionNumber: item.quote.OncekiPoliceYenilemeNo,
              companyLogo: HdiLogo,
              brutPrim: brutPrim,
              productName: item.plan,
              customerName: "",
            };
            let { offers, teklifFiyatlari } = state;
            offers.push(offerObject);
            teklifFiyatlari.push(brutPrim);
            setState({ ...state, offers: offers, teklifFiyatlari: teklifFiyatlari });
          }
        }

        break;
      case 160:
        for (let item of data) {
          if (!item.error?.statu && item.quote?.primBilgileriWS?.burutPrim) {
            let brutPrim = Number(item.quote.primBilgileriWS.burutPrim);
            let offerObject = {
              companyCode: 160,
              quoteReference: item.quote.polPoliceNo,
              revisionNumber: 0,
              companyLogo: MapfreLogo,
              brutPrim: brutPrim,
              productName: item.plan,
              customerName: "",
            };
            let { offers, teklifFiyatlari } = state;
            offers.push(offerObject);
            teklifFiyatlari.push(brutPrim);
            setState({ ...state, offers: offers, teklifFiyatlari: teklifFiyatlari });
          }
        }
        break;
      case 180:
        for (let item of data) {
          if (!item.error?.statu && item.quote?.payment?.grosS_PREMIUM) {
            let brutPrim = Number(item.quote.payment.grosS_PREMIUM);
            let offerObject = {
              companyCode: 180,
              quoteReference: item.quote.proposaL_NO,
              revisionNumber: 0,
              companyLogo: SompoLogo,
              brutPrim: brutPrim,
              productName: item.plan,
              customerName: "",
            };
            let { offers, teklifFiyatlari } = state;
            offers.push(offerObject);
            teklifFiyatlari.push(brutPrim);
            setState({ ...state, offers: offers, teklifFiyatlari: teklifFiyatlari });
          }
        }

        break;
      // code block
    }
  };

  const gotoQuotePolicy = (index) => {
    //teklif poliçeleştirme sayfasına gitmeden önce teklif bilgilerini kaydediyoruz.
    let quote = state.offers[index];
    quote.service = "traffic";
    quote.companyLogo = "";

    localStorage.setItem("quotePolicy", JSON.stringify(quote));

    window.open("/policy-steps?quoteReference=" + quote.quoteReference, "_blank");
  };

  return (
    <>
      <section className="section vehicle_insurrance_container mt-4">
        <div className="container" style={{ marginTop: "-1px" }}>
          <button id="getOffers" onClick={() => getAllOffers()} style={{ visibility: "hidden" }}>
            Get Offers
          </button>
        </div>
        {/**Offer Loader Animation*/}
        {state.counter.length != state.insuranceCompanies.length && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ display: "block", textAlign: "center" }}>
              <h2 style={{ textAlign: "center" }}>
                Teklifler Getiriliyor (%
                {((state.counter.length / state.insuranceCompanies.length) * 100).toFixed(0)})
              </h2>
              <div className="preloader" style={{ display: "flex", justifyContent: "center" }}>
                <PreLoader></PreLoader>
              </div>
            </div>
          </div>
        )}
        {/* <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12">{JSON.stringify(inquiryInformations)}</div>
          </div>
        </div> */}
        {/* Teklif Gelmediği durumlarda ekran uyarı mesajı veriyoruz. */}
        {state.counter.length == state.insuranceCompanies.length && state.offers.length == 0 && (
          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-12 col-md-8 col-lg-6 ">
                <Alert severity="warning">
                  <AlertTitle>
                    <strong>Teklif Getirilemedi!</strong>
                  </AlertTitle>
                  <strong>
                    Lütfen bilgilerinizin doğruluğunu kontrol ettikten sonra tekrar deneyiniz.
                  </strong>
                </Alert>
                <div className="clear-fix"></div>
              </div>
            </div>
          </div>
        )}

        {(() => {
          if (state.offers.length > 0) {
            return (
              <div className="container offers mt-6">
                <div className="row">{state.message}</div>
                <div
                  className="row offer-header mt-6"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div className="col-12 col-md-5 col-lg-5 offer-header-information">
                    Aracınızı %20 `ye varan avantajlarla hemen güvence altına alın.
                  </div>
                  <div
                    className="col-12 col-md-7 col-lg-7"
                    style={{ display: "flex", textAlign: "center", padding: "1px" }}
                  >
                    <div className="offer-card">
                      <div className="offer-card-content">{state.offers.length}</div>
                      <label className="offer-card-content-label">Teklif Sayısı</label>
                    </div>
                    <div className="offer-card ml-2">
                      <div className="offer-card-content">
                        {numberToTrNumber(Math.min(...state.teklifFiyatlari))} TL
                      </div>
                      <label className="offer-card-content-label">En Düşük</label>
                    </div>
                    <div className="offer-card ml-2">
                      <div className="offer-card-content">%20</div>
                      <label className="offer-card-content-label">Fiyat Avantajı</label>
                    </div>
                  </div>
                </div>

                {sortList(state.offers, "brutPrim", "desc").map((offer, index) => (
                  <div className="row mt-5 insurance-offers-card " key={index}>
                    <div
                      className="col-12 col-md-9 col-lg-9 px-3 py-3 bg-white rounded shadow "
                      style={{ padding: "20px !important" }}
                    >
                      {/* Card Header */}
                      <div
                        className="row offer-compare-checkbox mt-2 p-3"
                        style={{ justifyContent: "space-between" }}
                      >
                        <div className="button-compare">
                          <label className="checkbox-toggle">
                            <input type="checkbox" />
                            <span className="slider round"></span>
                            <label className="font-weight-bold ml-2" style={{ fontSize: "15pt" }}>
                              Karşılaştır
                            </label>
                          </label>
                        </div>

                        {(() => {
                          if (offer.productName) {
                            return <div className="offer-product-name">{offer.productName}</div>;
                          }
                        })()}
                        <div>
                          <img
                            style={{ height: "40px" }}
                            src={offer.companyLogo}
                            alt=""
                            className="img-fluid"
                          />
                        </div>
                      </div>

                      {/*Card Third Row (Product Details)  */}
                      <div className="row">
                        <div className="col">
                          {/* <!-- Rounded tabs -->*/}
                          <ul
                            id="myTab"
                            role="tablist"
                            className="nav nav-tabs nav-pills flex-column flex-sm-row text-center bg-light border-0 rounded-nav"
                          >
                            <li className="nav-item flex-sm-fill">
                              <a
                                id="policy-detail-tab"
                                data-toggle="tab"
                                href={"#policy-detail" + index}
                                role="tab"
                                aria-controls="policy-detail"
                                aria-selected="true"
                                className="nav-link border-0  font-weight-bold active"
                              >
                                Poliçe Detayı
                              </a>
                            </li>
                            <li className="nav-item flex-sm-fill">
                              <a
                                id="installment-options-tab"
                                data-toggle="tab"
                                href={"#installment-options" + index}
                                role="tab"
                                aria-controls="installment-options"
                                aria-selected="false"
                                className="nav-link border-0  font-weight-bold"
                              >
                                Taksit Seçenekleri
                              </a>
                            </li>
                            <li className="nav-item flex-sm-fill">
                              <a
                                id="customize-policy-tab"
                                data-toggle="tab"
                                href={"#customize-policy" + index}
                                role="tab"
                                aria-controls="customize-policy"
                                aria-selected="false"
                                className="nav-link border-0  font-weight-bold"
                              >
                                Poliçemi Özelleştir
                              </a>
                            </li>
                          </ul>
                          <div id="myTabContent" className="tab-content">
                            <div
                              id={"policy-detail" + index}
                              role="tabpanel"
                              aria-labelledby="policy-detail-tab"
                              className="tab-pane fade px-2 py-5 show active"
                            >
                              <h5 className="font-weight-bold">Öne Çıkan Teminatlar</h5>
                              <div className="row">
                                <div className="col-6 col-xs-6 col-sm-6 col-md-3 col-lg-3 mt-2">
                                  Ana Teminatlar{" "}
                                  <i
                                    className="far fa-question-circle"
                                    style={{ color: "var(--color-one)" }}
                                  ></i>
                                </div>
                                <div className="col-6 col-xs-6 col-sm-6 col-md-3 col-lg-3 mt-2">
                                  Mini Onarım{" "}
                                  <i
                                    className="far fa-question-circle"
                                    style={{ color: "var(--color-one)" }}
                                  ></i>
                                </div>
                                <div className="col-6 col-xs-6 col-sm-6 col-md-3 col-lg-3 mt-2">
                                  İkame/ Yedek Araç{" "}
                                  <i
                                    className="far fa-question-circle"
                                    style={{ color: "var(--color-one)" }}
                                  ></i>
                                </div>
                                <div className="col-6 col-xs-6 col-sm-6 col-md-3 col-lg-3 mt-2">
                                  Yol Yardım (Asistans){" "}
                                  <i
                                    className="far fa-question-circle"
                                    style={{ color: "var(--color-one)" }}
                                  ></i>
                                </div>
                                <div className="col-6 col-xs-6 col-sm-6 col-md-3 col-lg-3 mt-2">
                                  İhtiyari Mali Mesuliyet (IMM){" "}
                                  <i
                                    className="far fa-question-circle"
                                    style={{ color: "var(--color-one)" }}
                                  ></i>
                                </div>
                                <div className="col col-xs-6 col-sm-6 col-md-3 col-lg-3 mt-2">
                                  Dolu ve Sel/Su Baskını{" "}
                                  <i
                                    className="far fa-question-circle"
                                    style={{ color: "var(--color-one)" }}
                                  ></i>
                                </div>
                              </div>
                              <div className="row mt-3">
                                <div className="col-12" style={{ color: "var(--color-one)" }}>
                                  <i className="fas fa-file-alt"></i> Tüm Teminatlar
                                </div>
                              </div>
                            </div>
                            <div
                              id={"installment-options" + index}
                              role="tabpanel"
                              aria-labelledby="installment-options-tab"
                              className="tab-pane fade px-2 py-5"
                            >
                              <h5 className="font-weight-bold">Taksit Seçenekleri</h5>
                              <div className="row">
                                <div className="col-12  d-flex justify-content-between">
                                  <div>İlk Taksit (Peşinat):</div>
                                  <div>226,34</div>
                                </div>
                                <div className="col-12  d-flex justify-content-between">
                                  <div>Kalan Taksitler:</div>
                                  <div>8 ay x 219,00</div>
                                </div>
                                <div className="col-12">
                                  <hr />
                                </div>
                                <div className="col-12  d-flex justify-content-between font-weight-bold">
                                  <div>Toplam Fiyat:</div>
                                  <div>1.978,34</div>
                                </div>
                              </div>
                              <div className="row mt-3">
                                <div className="col-12">
                                  <div className="alert alert-info" role="alert">
                                    <strong>Not: </strong>
                                    Kredi kartı ve taksit alternatiflerini ödeme sırasında
                                    seçebileceksiniz. Size özel internet indirim tutarınız Sigorta7
                                    tarafından kredi kartınıza poliçenizin düzenlediği ayın son iş
                                    günü ayrıca iade edilecektir. Aşağdaki tabloda yer almayan
                                    kredikartları ile sadece tek çekim işlem yapılabilir.
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-12">
                                  <VehicleInsurancePaymentOptions />
                                </div>
                              </div>
                            </div>
                            <div
                              id={"customize-policy" + index}
                              role="tabpanel"
                              aria-labelledby="customize-policy-tab"
                              className="tab-pane fade px-2 py-5"
                            >
                              <VehicleInsurancePolicyCustomization />
                            </div>
                          </div>
                          {/*<!-- End rounded tabs -->*/}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-3 col-lg-3 p-0 pl-md-2 pr-0 m-0">
                      <div className="card buy-card" style={{ width: "100% !important" }}>
                        <div className="card-body">
                          <h5 className="card-title">İNDİRİM KAMPANYA</h5>
                          <p className="card-text insurance-price">
                            {numberToTrNumber(offer.brutPrim)} TL{" "}
                            <span style={{ fontSize: "12pt", fontWeight: "500" }}>
                              ({/*offer.installment*/} taksit)
                            </span>
                          </p>
                          <p className="card-text advance-discount  w-100">
                            %{/*offer.advanceDiscountRatio*/} peşin indirimi
                            <button className="btn btn-apply-discount ">Uygula</button>
                          </p>
                          <button onClick={() => gotoQuotePolicy(index)} className="btn-main w-100">
                            HEMEN SATIN AL
                          </button>
                          <GetQuotePrint
                            token={state.token}
                            service="traffic"
                            companyCode={offer.companyCode}
                            quoteReference={offer.quoteReference}
                            revisionNumber={offer.revisionNumber}
                          />
                          <div className="card-text mt-3 mb-2 text-center w-100">
                            <div className="call-now">
                              HEMEN ARA <br />
                              {/*offer.phoneNumber*/}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          }
        })()}

        <div className="clear-fix"></div>
      </section>
    </>
  );
};

export default VehicleInsuranceOffers;
