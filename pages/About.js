import { Insurance2 } from "/resources/images";
import {
  YanginIcon,
  ErosionIcon,
  FamilyIcon,
  HomeIcon,
  KeysIcon,
  TelesecreterIcon,
  CarCrashIcon,
  logo,
} from "/resources/images";

const About = () => {
  return (
    <>
      {/* about section start*/}
      <section className="mt-5" style={{ fontFamily: '"Nunito", sans-serif' }}>
        <div style={{ padding: "50px 0px", marginBottom: "100px", marginTop: "1%" }}>
          <div className="container">
            <div className="row about justify-content-between align-items-center">
              {/* Insurance İcons */}
              <div className="col-lg-6 col-md-6">
                {/* First Row */}
                <div className="row">
                  <div
                    className="col-6 about-left-icon"
                    style={{ display: "flex", justifyContent: "right" }}
                  >
                    <img style={{ width: "110px" }} src={YanginIcon} alt="" className="img-fluid" />
                  </div>
                  <div className="col-6 about-left-icon">
                    <img
                      style={{ width: "110px" }}
                      src={ErosionIcon}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                </div>
                {/* Second Row */}
                <div
                  className="row mt-2 px-5"
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <div className="about-left-icon" width="33.3%">
                    <img style={{ width: "110px" }} src={FamilyIcon} alt="" className="img-fluid" />
                  </div>
                  <div className="about-left-icon" width="33.3%">
                    <img style={{ width: "110px" }} src={HomeIcon} alt="" className="img-fluid" />
                  </div>
                  <div className="about-left-icon" width="33.3%">
                    <img style={{ width: "110px" }} src={KeysIcon} alt="" className="img-fluid" />
                  </div>
                </div>
                {/* Third Row */}
                <div className="row mt-2">
                  <div
                    className="col-6 about-left-icon"
                    style={{ display: "flex", justifyContent: "right" }}
                  >
                    <img
                      style={{ width: "110px" }}
                      src={TelesecreterIcon}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-6 about-left-icon ">
                    <img
                      style={{ width: "110px" }}
                      src={CarCrashIcon}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="ag_about_text_box">
                  <h2 className="title mb-5">
                    <div style={{}} className="home_four_content header-tween mx-auto text-center">
                      <h3 className="">
                        <span className="small_title_bor" />{" "}
                        <img src={logo} alt="" style={{ width: "150px" }} /> Hakkında
                        <span className="small_title_bor" />{" "}
                      </h3>
                    </div>
                  </h2>
                  <p style={{ textAlign: "justify" }} className="description">
                    Çözüm odaklı, kaliteli, dürüst ve samimi bir hizmet anlayışı birleştiren
                    Sigorta7, eğitimli kadrosu ile müşterileri için hep daha iyisini
                    hedeflemektedir.
                    <br />
                    Kaza, yangın, hırsızlık ve deprem gibi birçok alanda karşılaşabileceğiniz maddi
                    kayıp ve zararlar teminat altına alınır ve risk yükünüz hafifletilir.
                    <br />
                    Sigorta7 sahip olduğu bilgi birikimini, güvenilir hizmet anlayışı ile
                    birleştirerek müşterileri için en uygun çözüm önerilerini sunar.
                  </p>
                  <a
                    style={{ float: "right" }}
                    href="/"
                    className="btn btn-sm btn-custom navbar-btn btn-rounded btn-nav-teklif-al"
                  >
                    Daha Fazla
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* about section end */}
    </>
  );
};

export default About;
