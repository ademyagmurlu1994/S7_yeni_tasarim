import React, { Component } from "react";
import {
  AnadoluSigortaLogo,
  AllianzSigortaLogo,
  HdiSigortaLogo,
} from "../../../../resources/images";
import PaymentOptions from "../../../../components/health/complementary/PaymentOptions";

class VehicleInsuranceOffers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      insuranceOffers: [
        {
          companyName: "RAYSİGORTA",
          companyLogo: AnadoluSigortaLogo,
          price: "200,54",
          installment: "6", //taksit
          advanceDiscountRatio: "10", //pesin indirim oranı
          phoneNumber: "0535 *** ** **",
        },
        {
          companyName: "ALLIANZ",
          companyLogo: AllianzSigortaLogo,
          price: "210,30",
          installment: "7", //taksit
          advanceDiscountRatio: "6", //pesin indirim oranı
          phoneNumber: "0542 *** ** **",
        },
        {
          companyName: "HDI",
          companyLogo: HdiSigortaLogo,
          price: "216,9",
          installment: "9", //taksit
          advanceDiscountRatio: "10", //pesin indirim oranı
          phoneNumber: "0555 *** ** **",
        },
      ],
    };
  }

  render() {
    return (
      <>
        <section className="section vehicle_insurrance_container mt-4">
          <div className="container offers mt-6">
            <div
              className="row offer-header mt-6"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div className="col-12 col-md-5 col-lg-5 offer-header-information">
                Seyahatiniz boyunca sağlığınızı %17 `ye varan avantajlarla hemen güvenceye alın
              </div>
              <div
                className="col-12 col-md-7 col-lg-7"
                style={{ display: "flex", textAlign: "center", padding: "1px" }}
              >
                <div className="offer-card">
                  <div className="offer-card-content">7</div>
                  <label className="offer-card-content-label">Teklif Sayısı</label>
                </div>
                <div className="offer-card ml-2">
                  <div className="offer-card-content">200,54 TL</div>
                  <label className="offer-card-content-label">En Düşük Fiyat</label>
                </div>
                <div className="offer-card ml-2">
                  <div className="offer-card-content">%17</div>
                  <label className="offer-card-content-label">Fiyat Avantajı</label>
                </div>
              </div>
            </div>

            {this.state.insuranceOffers.map((offer, index) => (
              <div className="row mt-5 insurance-offers-card " key={index}>
                <div
                  className="col-12 col-md-9 col-lg-9 px-3 py-3 bg-white rounded shadow "
                  style={{ padding: "20px !important" }}
                >
                  <div className="row offer-compare-checkbox mt-2">
                    <div className="col">
                      <label className="checkbox-toggle">
                        <input type="checkbox" />
                        <span className="slider round"></span>
                        <label className="font-weight-bold ml-2" style={{ fontSize: "15pt" }}>
                          Karşılaştır
                        </label>
                      </label>
                    </div>
                  </div>
                  <div className="row mb-1">
                    <div className="col" style={{ display: "flex", alignItems: "center" }}>
                      <img
                        style={{ height: "40px" }}
                        src={offer.companyLogo}
                        alt=""
                        className="img-fluid"
                      />
                      <div className="ml-3">Seyahat Sağlık Sigortası</div>
                    </div>
                  </div>

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
                            id="assurance-detail-tab"
                            data-toggle="tab"
                            href="#assurance-detail"
                            role="tab"
                            aria-controls="assurance-detail"
                            aria-selected="false"
                            className="nav-link border-0  font-weight-bold"
                          >
                            Teminat Detayları
                          </a>
                        </li>
                        <li className="nav-item flex-sm-fill">
                          <a
                            id="installment-options-tab"
                            data-toggle="tab"
                            href="#installment-options"
                            role="tab"
                            aria-controls="installment-options"
                            aria-selected="false"
                            className="nav-link border-0  font-weight-bold"
                          >
                            Taksit Seçenekleri
                          </a>
                        </li>
                      </ul>
                      <div id="myTabContent" className="tab-content">
                        {/**Teminat detayları tab content */}
                        <div
                          id="assurance-detail"
                          role="tabpanel"
                          aria-labelledby="assurance-detail-tab"
                          className="tab-pane fade px-2 py-5"
                        >
                          <div className="row">
                            <div className="col-6 col-xs-6 col-sm-6 col-md-3 col-lg-3 mt-2">
                              Tüm dünya paketi{" "}
                              <i
                                className="far fa-question-circle"
                                style={{ color: "var(--main-color)" }}
                              ></i>
                            </div>
                            <div className="col-6 col-xs-6 col-sm-6 col-md-3 col-lg-3 mt-2">
                              Teminat 1{" "}
                              <i
                                className="far fa-question-circle"
                                style={{ color: "var(--main-color)" }}
                              ></i>
                            </div>
                            <div className="col-6 col-xs-6 col-sm-6 col-md-3 col-lg-3 mt-2">
                              Teminat 2{" "}
                              <i
                                className="far fa-question-circle"
                                style={{ color: "var(--main-color)" }}
                              ></i>
                            </div>
                            <div className="col-6 col-xs-6 col-sm-6 col-md-3 col-lg-3 mt-2">
                              Teminat 3{" "}
                              <i
                                className="far fa-question-circle"
                                style={{ color: "var(--main-color)" }}
                              ></i>
                            </div>
                            <div className="col-6 col-xs-6 col-sm-6 col-md-3 col-lg-3 mt-2">
                              Teminat 4{" "}
                              <i
                                className="far fa-question-circle"
                                style={{ color: "var(--main-color)" }}
                              ></i>
                            </div>
                            <div className="col col-xs-6 col-sm-6 col-md-3 col-lg-3 mt-2">
                              Teminat 5{" "}
                              <i
                                className="far fa-question-circle"
                                style={{ color: "var(--main-color)" }}
                              ></i>
                            </div>
                          </div>
                        </div>
                        {/**Taksit seçenekleri tab content */}
                        <div
                          id="installment-options"
                          role="tabpanel"
                          aria-labelledby="installment-options-tab"
                          className="tab-pane fade px-2 py-5"
                        >
                          <h5 className="font-weight-bold">Taksit Seçenekleri</h5>
                          <div className="row">
                            <div className="col-12  d-flex justify-content-between">
                              <div>İlk Taksit (Peşinat):</div>
                              <div>240,34</div>
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
                                tarafından kredi kartınıza poliçenizin düzenlediği ayın son iş günü
                                ayrıca iade edilecektir. Aşağdaki tabloda yer almayan kredikartları
                                ile sadece tek çekim işlem yapılabilir.
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
                      {/*<!-- End rounded tabs -->*/}
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-3 col-lg-3 p-0 pl-md-2 pr-0 m-0">
                  <div className="card buy-card" style={{ width: "100% !important" }}>
                    <div className="card-body">
                      <h5 className="card-title">İNDİRİM KAMPANYA</h5>
                      <p className="card-text insurance-price">
                        {offer.price} TL{" "}
                        <span style={{ fontSize: "12pt", fontWeight: "500" }}>
                          ({offer.installment} taksit)
                        </span>
                      </p>
                      <p className="card-text advance-discount  w-100">
                        %{offer.advanceDiscountRatio} peşin indirimi
                        <button className="btn btn-apply-discount ">Uygula</button>
                      </p>
                      <a href="#" className="btn btn-primary btn-buy-now">
                        HEMEN SATIN AL
                      </a>
                      <div className="card-text mt-3 mb-2 text-center w-100">
                        <div className="call-now">
                          HEMEN ARA <br />
                          {offer.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }
}

export default VehicleInsuranceOffers;
