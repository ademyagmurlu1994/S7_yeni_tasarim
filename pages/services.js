import { useState } from "react";
import Link from "next/link";
import {
  Traffic,
  Health,
  dask,
  HomeOwners,
  CarService,
  Pet,
  Travel,
  Phone,
} from "/resources/images";

const Services = () => {
  const [serviceList] = useState([
    {
      title: "TRAFİK",
      img: Traffic,
      url: "/insurance/traffic",
    },
    {
      title: "TAMAMLAYICI SAĞLIK",
      img: Health,
      url: "/insurance/health/complementary",
    },
    {
      title: "DASK",
      img: dask,
      url: "/insurance/dask",
    },
    {
      title: "KONUT",
      img: HomeOwners,
      url: "/insurance/house",
    },
    {
      title: "KASKO",
      img: CarService,
      url: "/insurance/casco",
    },
    {
      title: "EVCİL HAYVAN",
      img: Pet,
      url: "/insurance/pet",
    },
    {
      title: "SEYAHAT",
      img: Travel,
      url: "/insurance/health/travel",
    },
    {
      title: "TELEFON",
      img: Phone,
      url: "/insurance/phone",
    },
    {
      title: "FERDİ KAZA",
      img: Health,
      url: "#",
    },
    {
      title: "ÖZEL SAĞLIK",
      img: Health,
      url: "/insurance/health/private",
    },
    {
      title: "MİNİ KASKO",
      img: CarService,
      url: "#",
    },
    {
      title: "YAŞAM TERAPİ",
      img: Health,
      url: "#",
    },
    {
      title: "YABANCI SAĞLIK",
      img: Health,
      url: "#",
    },
  ]);

  return (
    <>
      {/* Feature section start*/}
      {/*Deneme Commit*/}
      <section
        className="home-topfold-services bg-white"
        style={{ paddingBottom: "0px", marginTop: "85px", marginBottom: "400px" }}
      >
        <div className="container">
          <div className="row justify-content-center row-seven-column">
            {serviceList.map((service, index) => {
              return (
                <div className="col-4 col-md-4 col-seven-1 topfold-services" key={index}>
                  <Link href={service.url}>
                    <div className="service-wrapper text-center">
                      <div className="service-circle-wrapper">
                        <div className="service-circle">
                          <div>
                            <img src={service.img} alt="" />
                          </div>
                        </div>
                      </div>

                      <div className="service-name">{service.title}</div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* <section className="services_section mt-5" style={{ marginBottom: "300px" }}>
        <div className="container" style={{ marginTop: "50px" }}>
          <div className="row text-center">
            <div className="col">
              <div className="ag_section_title mb_55 text-center">
                <h2 className="title">
                  İnanılmaz <span>Hizmetler</span>, inanılmaz fiyatlar ile burada{" "}
                </h2>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            {featureList.map((item, index) => (
              <div className="col-6 col-sm-6 col-md-4 col-lg-2 p-2" key={index}>
                <div
                  className="grid-item home-fold-service-item text-center"
                  style={{ margin: "0px", position: "relative" }}
                >
                  <Link href={`${item.url}`} prefetch={false}>
                    <div>
                      <img
                        style={{ width: "70%", height: "auto", maxHeight: "100%" }}
                        src={item.img}
                        className="home-fold-icon"
                      />
                      <br />
                      <button
                        className="btn btn-rounded btn-service mt-3"
                        style={{ width: "100%" }}
                      >
                        {item.title}
                      </button>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      {/* Feature section end*/}
    </>
  );
};

export default Services;
