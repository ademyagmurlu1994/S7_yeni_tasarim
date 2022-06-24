import React, { useState, useEffect } from "react";
import axios from "/instances/axios";

//Components
import PaymentOptions from "./PaymentOptions";
import PreLoader from "/components/PreLoader";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import GetQuotePrint from "/components/common/GetQuotePrint";

//images
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
  getNewToken,
  isValidTcKimlik,
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
} from "/functions/common";

const DaskOffers = () => {
  const [inquiryInformations, setInquiryInformations] = useState();
  const [state, setState] = useState({
    offers: [],
    message: "",
    counter: [],
    verilerGetiriliyor: false,
    token: "",
    teklifFiyatlari: [],
    insuranceCompanies: [150, 180],
    isActiveInstallmentOptions: false,
    activeInstallmentOptionId: 0,
  });

  useEffect(async () => {
    if (!state.token) {
      setState({ ...state, token: await getNewToken() });
    }
  }, []);

  useEffect(() => {
    if (state.token) {
      let inquiryInformations = JSON.parse(localStorage.getItem("inquiryInformations"));
      if (inquiryInformations) {
        setInquiryInformations(inquiryInformations);
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
      .post("/api/quote/v1/Dask/getdaskquote", bodyData, {
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
        if (data.primBilgileri[0].prim) {
          let brutPrim = Number(data.primBilgileri[0].prim);
          let offerObject = {
            companyCode: 100,
            quoteReference: data.policeNo,
            revisionNumber: 0,
            companyLogo: AkSigortaLogo,
            brutPrim: brutPrim,
          };

          let { offers, teklifFiyatlari } = state;
          offers.push(offerObject);
          teklifFiyatlari.push(brutPrim); // en düşük fiyatı bulabilmek için kullanıldı...
          setState({ ...state, offers: offers, teklifFiyatlari: teklifFiyatlari });
        }
        break;
      case 110:
        if (data.data.asosCreateProposalResponseANDLIVO.policySummary.premiumInfo.grossPremium) {
          let brutPrim = Number(
            data.data.asosCreateProposalResponseANDLIVO.policySummary.premiumInfo.grossPremium
          );
          let offerObject = {
            companyCode: 110,
            quoteReference:
              data.data.asosCreateProposalResponseANDLIVO.referencePolicy.policyNumber,
            revisionNumber:
              data.data.asosCreateProposalResponseANDLIVO.referencePolicy.renewalNumber,
            companyLogo: AnadoluSigortaLogo,
            brutPrim: brutPrim,
          };

          let { offers, teklifFiyatlari } = state;
          offers.push(offerObject);
          teklifFiyatlari.push(brutPrim); // en düşük fiyatı bulabilmek için kullanıldı...
          setState({ ...state, offers: offers, teklifFiyatlari: teklifFiyatlari });
        }
        break;
      case 120:
        for (var i = 0; i < data.risks[0].packageRiskInfoList.length; i++) {
          if (data.risks[0].packageRiskInfoList[i].totalPremium) {
            let brutPrim = Number(data.risks[0].packageRiskInfoList[i].totalPremium);
            let productName = data.risks[0].packageRiskInfoList[i].packageName;
            let offerObject = {
              companyCode: 120,
              quoteReference: data.policyBase.quoteReference.toString().split("/")[0],
              revisionNumber: data.policyBase.quoteReference.toString().split("/")[1],
              companyLogo: AllianzSigortaLogo,
              brutPrim: brutPrim,
              productName: productName,
            };

            let { offers, teklifFiyatlari } = state;
            offers.push(offerObject);
            teklifFiyatlari.push(brutPrim);
            setState({ ...state, offers: offers, teklifFiyatlari: teklifFiyatlari });
          }
        }

        break;
      case 150:
        if (data.PoliceBilgileri.OdenecekPrim) {
          let brutPrim = Number(data.PoliceBilgileri.OdenecekPrim);
          let productName = "";
          let offerObject = {
            companyCode: 150,
            quoteReference: data.PoliceBilgileri.PoliceNo,
            revisionNumber: data.PoliceBilgileri.YenilemeNo,
            companyLogo: HdiSigortaLogo,
            brutPrim: brutPrim,
            productName: productName,
          };

          let { offers, teklifFiyatlari } = state;
          offers.push(offerObject);
          teklifFiyatlari.push(brutPrim);
          setState({ ...state, offers: offers, teklifFiyatlari: teklifFiyatlari });
        }

        break;
      case 160:
        if (data[0].primBilgileriWS.burutPrim) {
          let brutPrim = Number(data[0].primBilgileriWS.burutPrim);
          let offerObject = {
            companyCode: 160,
            quoteReference: data[0].polPoliceNo,
            revisionNumber: 0,
            companyLogo: MapfreSigortaLogo,
            brutPrim: brutPrim,
          };

          let { offers, teklifFiyatlari } = state;
          offers.push(offerObject);
          teklifFiyatlari.push(brutPrim);
          setState({ ...state, offers: offers, teklifFiyatlari: teklifFiyatlari });
        }
        break;
      case 180:
        if (data.payment.grosS_PREMIUM) {
          let brutPrim = Number(data.payment.grosS_PREMIUM);
          let offerObject = {
            companyCode: 180,
            quoteReference: data.proposaL_NO,
            revisionNumber: 0,
            companyLogo: SomboSigortaLogo,
            brutPrim: brutPrim,
          };

          let { offers, teklifFiyatlari } = state;
          offers.push(offerObject);
          teklifFiyatlari.push(brutPrim);
          setState({ ...state, offers: offers, teklifFiyatlari: teklifFiyatlari });
        }

        break;
      case 200:
        if (data[0].brutPrim) {
          let brutPrim = Number(data[0].brutPrim);
          let offerObject = {
            companyCode: 200,
            quoteReference: data[0].teklifNo,
            revisionNumber: data[0].maxRevizeNo,
            companyLogo: ZurichSigortaLogo,
            brutPrim: brutPrim,
          };

          let { offers, teklifFiyatlari } = state;
          offers.push(offerObject);
          teklifFiyatlari.push(brutPrim);
          setState({ ...state, offers: offers, teklifFiyatlari: teklifFiyatlari });
        }
        break;
      default:
      // code block
    }
  };

  const gotoQuotePolicy = (index) => {
    //teklif poliçeleştirme sayfasına gitmeden önce teklif bilgilerini kaydediyoruz.
    let quote = state.offers[index];
    quote.service = "dask";
    quote.companyLogo = "";

    // if (
    //   quote.revisionNumber != undefined &&
    //   quote.revisionNumber.toString() != "" &&
    //   quote.quoteReference != undefined &&
    //   quote.quoteReference.toString() != ""
    // ) {

    // } else {
    //   alert("Üzgünüz. Bu teklif için satın alma işlemi şimdilik kapalı!");
    // }

    localStorage.setItem("quotePolicy", JSON.stringify(quote));
    window.open("/policy-steps?quoteReference=" + quote.quoteReference, "_blank");
  };

  return (
    <>
      <section className="section vehicle_insurrance_container mt-4">
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

        {JSON.stringify(state.counter.length)}

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

        {/**Teklif Deseni Örnek */}
        {/* <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12">{JSON.stringify(inquiryInformations)}</div>
          </div>
        </div> */}

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
                    Eviniz Depreme Karşı %17 `ye varan avantajlarla hemen güvenceye alın
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

                {state.offers.map((offer, index) => (
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
                                id="installment-options-tab"
                                className={`nav-link border-0  font-weight-bold ${
                                  state.isActiveInstallmentOptions &&
                                  state.activeInstallmentOptionId == index &&
                                  "active"
                                }`}
                                onClick={() =>
                                  setState({
                                    ...state,
                                    isActiveInstallmentOptions:
                                      index != state.activeInstallmentOptionId
                                        ? true
                                        : !state.isActiveInstallmentOptions,
                                    activeInstallmentOptionId: index,
                                  })
                                }
                              >
                                Taksit Seçenekleri
                              </a>
                            </li>
                          </ul>
                          {state.isActiveInstallmentOptions &&
                            state.activeInstallmentOptionId == index && (
                              <div id="myTabContent" className="tab-conten">
                                <div className="tab-pane  px-2 py-5">
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
                                        seçebileceksiniz. Size özel internet indirim tutarınız
                                        Sigorta7 tarafından kredi kartınıza poliçenizin düzenlediği
                                        ayın son iş günü ayrıca iade edilecektir. Aşağdaki tabloda
                                        yer almayan kredikartları ile sadece tek çekim işlem
                                        yapılabilir.
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-12">
                                      <PaymentOptions />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

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
                            service="dask"
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

export default DaskOffers;
