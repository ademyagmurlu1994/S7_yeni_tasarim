import React, { Component } from "react";

export default class VehicleInsurancePaymentOptions extends Component {
  render() {
    return (
      <div className=" py-3 bg-white rounded mb-5">
        {/*<!-- Bordered tabs-->*/}
        <ul
          id="myTab1"
          role="tablist"
          className="nav nav-tabs nav-pills with-arrow flex-column flex-sm-row text-center"
        >
          <li className="nav-item flex-sm-fill">
            <a
              id="home1-tab"
              data-toggle="tab"
              href="#home1"
              role="tab"
              aria-controls="home1"
              aria-selected="true"
              className="nav-link  font-weight-bold mr-sm-3 rounded-0 border active"
            >
              <img
                style={{ width: "50%", height: "30px" }}
                src="https://files.sikayetvar.com/lg/cmp/27/27794.png?1522650125"
                alt=""
                className="img-fluid"
              />
            </a>
          </li>
          <li className="nav-item flex-sm-fill">
            <a
              id="profile1-tab"
              data-toggle="tab"
              href="#profile1"
              role="tab"
              aria-controls="profile1"
              aria-selected="false"
              className="nav-link  font-weight-bold mr-sm-3 rounded-0 border"
            >
              <img
                style={{ width: "50%", height: "30px" }}
                src="https://www.finanshaberi.net/wp-content/uploads/2019/01/akbank-axess-.jpg"
                alt=""
                className="img-fluid"
              />
            </a>
          </li>
          <li className="nav-item flex-sm-fill">
            <a
              id="contact1-tab"
              data-toggle="tab"
              href="#contact1"
              role="tab"
              aria-controls="contact1"
              aria-selected="false"
              className="nav-link  font-weight-bold rounded-0 border"
            >
              <img
                style={{ width: "50%", height: "30px" }}
                src="https://upload.wikimedia.org/wikipedia/tr/1/11/Qnb-finansbank.png"
                alt=""
                className="img-fluid"
              />
            </a>
          </li>
          <li className="nav-item flex-sm-fill">
            <a
              id="contact1-tab"
              data-toggle="tab"
              href="#contact1"
              role="tab"
              aria-controls="contact1"
              aria-selected="false"
              className="nav-link  font-weight-bold rounded-0 border"
            >
              <img
                style={{ width: "50%", height: "30px" }}
                src="https://www.besiptal.com/wp-content/uploads/2018/12/denizbank-bonus-harcama.jpg"
                alt=""
                className="img-fluid"
              />
            </a>
          </li>
          <li className="nav-item flex-sm-fill">
            <a
              id="contact1-tab"
              data-toggle="tab"
              href="#contact1"
              role="tab"
              aria-controls="contact1"
              aria-selected="false"
              className="nav-link  font-weight-bold rounded-0 border"
            >
              <img
                style={{ width: "50%", height: "30px" }}
                src="https://www.besiptal.com/wp-content/uploads/2018/12/denizbank-bonus-harcama.jpg"
                alt=""
                className="img-fluid"
              />
            </a>
          </li>
          <li className="nav-item flex-sm-fill">
            <a
              id="contact1-tab"
              data-toggle="tab"
              href="#contact1"
              role="tab"
              aria-controls="contact1"
              aria-selected="false"
              className="nav-link  font-weight-bold rounded-0 border"
            >
              <img
                style={{ width: "50%", height: "30px" }}
                src="https://www.besiptal.com/wp-content/uploads/2018/12/denizbank-bonus-harcama.jpg"
                alt=""
                className="img-fluid"
              />
            </a>
          </li>
        </ul>
        <div id="myTab1Content" className="tab-content">
          <div
            id="home1"
            role="tabpanel"
            aria-labelledby="home-tab"
            className="tab-pane fade  py-2 show active"
          >
            <div className="table-wrapper">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Taksit Sayısı</th>
                      <th scope="col">Peşinat</th>
                      <th scope="col">Taksitli Tutar</th>
                      <th scope="col">Toplam Tutar</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1 Peşin 1 Taksit</td>
                      <td>989,34 TL</td>
                      <td>1x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 2 Taksit</td>
                      <td>989,34 TL</td>
                      <td>2x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 3 Taksit</td>
                      <td>989,34 TL</td>
                      <td>3x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 4 Taksit</td>
                      <td>989,34 TL</td>
                      <td>4x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 5 Taksit</td>
                      <td>989,34 TL</td>
                      <td>5x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 6 Taksit</td>
                      <td>989,34 TL</td>
                      <td>6x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 7 Taksit</td>
                      <td>989,34 TL</td>
                      <td>7x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 8 Taksit</td>
                      <td>989,34 TL</td>
                      <td>8x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div
            id="profile1"
            role="tabpanel"
            aria-labelledby="profile-tab"
            className="tab-pane fade py-2"
          >
            <div className="table-wrapper">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Taksit Sayısı</th>
                      <th scope="col">Peşinat</th>
                      <th scope="col">Taksitli Tutar</th>
                      <th scope="col">Toplam Tutar</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1 Peşin 1 Taksit</td>
                      <td>989,34 TL</td>
                      <td>1x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 2 Taksit</td>
                      <td>989,34 TL</td>
                      <td>2x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 3 Taksit</td>
                      <td>989,34 TL</td>
                      <td>3x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 4 Taksit</td>
                      <td>989,34 TL</td>
                      <td>4x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 5 Taksit</td>
                      <td>989,34 TL</td>
                      <td>5x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 6 Taksit</td>
                      <td>989,34 TL</td>
                      <td>6x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 7 Taksit</td>
                      <td>989,34 TL</td>
                      <td>7x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 8 Taksit</td>
                      <td>989,34 TL</td>
                      <td>8x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div
            id="contact1"
            role="tabpanel"
            aria-labelledby="contact-tab"
            className="tab-pane fade  py-1"
          >
            <div className="table-wrapper">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Taksit Sayısı</th>
                      <th scope="col">Peşinat</th>
                      <th scope="col">Taksitli Tutar</th>
                      <th scope="col">Toplam Tutar</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1 Peşin 1 Taksit</td>
                      <td>989,34 TL</td>
                      <td>1x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 2 Taksit</td>
                      <td>989,34 TL</td>
                      <td>2x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 3 Taksit</td>
                      <td>989,34 TL</td>
                      <td>3x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 4 Taksit</td>
                      <td>989,34 TL</td>
                      <td>4x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 5 Taksit</td>
                      <td>989,34 TL</td>
                      <td>5x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 6 Taksit</td>
                      <td>989,34 TL</td>
                      <td>6x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 7 Taksit</td>
                      <td>989,34 TL</td>
                      <td>7x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                    <tr>
                      <td>1 Peşin 8 Taksit</td>
                      <td>989,34 TL</td>
                      <td>8x989,00 TL</td>
                      <td>1.989,34 TL</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/*<!-- End bordered tabs -->*/}
      </div>
    );
  }
}
