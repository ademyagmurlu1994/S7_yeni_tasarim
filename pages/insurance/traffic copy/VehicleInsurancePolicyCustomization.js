import React, { Component } from "react";

export default class VehicleInsurancePolicyCustomization extends Component {
  render() {
    return (
      <div className="px-2 py-3 bg-white rounded mb-5">
        {/*<!-- Bordered tabs-->*/}
        <ul
          id="myTab1"
          role="tablist"
          className="nav nav-tabs nav-pills with-arrow flex-column flex-sm-row text-center"
        >
          <li className="nav-item flex-sm-fill">
            <a
              id="job-discount1-tab"
              data-toggle="tab"
              href="#job-discount1"
              role="tab"
              aria-controls="job-discount1"
              aria-selected="true"
              className="nav-link  font-weight-bold mr-sm-3 rounded-0 border active"
            >
              Meslek İndirimi
            </a>
          </li>
          <li className="nav-item flex-sm-fill">
            <a
              id="iim-limit1-tab"
              data-toggle="tab"
              href="#iim-limit1"
              role="tab"
              aria-controls="iim-limit1"
              aria-selected="false"
              className="nav-link  font-weight-bold mr-sm-3 rounded-0 border"
            >
              IMM Limiti
            </a>
          </li>
          <li className="nav-item flex-sm-fill">
            <a
              id="revision-options1-tab"
              data-toggle="tab"
              href="#revision-options1"
              role="tab"
              aria-controls="revision-options1"
              aria-selected="false"
              className="nav-link  font-weight-bold rounded-0 border"
            >
              Poliçe var olan Diğer Revizyon Seçenekleri
            </a>
          </li>
        </ul>
        <div id="myTab1Content" className="tab-content mt-4">
          <div
            id="job-discount1"
            role="tabpanel"
            aria-labelledby="job-discount-tab"
            className="tab-pane fade  py-2 show active"
          >
            <div className="row">
              <div className="col-12 col-md-4 col-lg-4">
                <div className="select-job-discount">
                  <select className="form-control" id="jobDiscount" defaultValue={0}>
                    <option value="0">Meslek İndirimini Seçiniz</option>
                    <option value="1">Avukat</option>
                    <option value="2">Akademisyen</option>
                    <option value="3">Memur</option>
                    <option value="4">İşçi</option>
                  </select>
                </div>
              </div>
              <div className="col-12 col-md-3 col-lg-3">
                <div className="actions">
                  <button className="btn-custom btn-timeline-forward w-100">Uygula</button>
                </div>
              </div>
            </div>
          </div>
          <div
            id="iim-limit1"
            role="tabpanel"
            aria-labelledby="iim-limit-tab"
            className="tab-pane fade py-2"
          >
            <div className="row">
              <div className="col-12 col-md-4 col-lg-4">
                <div className="select-imm-limit mb-3">
                  <select className="form-control" id="immLimit" defaultValue={0}>
                    <option value="1">IMM Limiti seçiniz</option>
                    <option value="1">10.000</option>
                    <option value="2">100.000</option>
                    <option value="3">1.000.000</option>
                  </select>
                </div>
              </div>
              <div className="col-12 col-md-3 col-lg-3">
                <div className="actions">
                  <button className="btn-custom btn-timeline-forward w-100">Uygula</button>
                </div>
              </div>
            </div>
          </div>
          <div
            id="revision-options1"
            role="tabpanel"
            aria-labelledby="revision-options-tab"
            className="tab-pane fade  py-1"
          >
            Poliçe var olan Diğer Revizyon Seçenekleri Buraya gelecek
          </div>
        </div>
        {/*<!-- End bordered tabs -->*/}
      </div>
    );
  }
}
