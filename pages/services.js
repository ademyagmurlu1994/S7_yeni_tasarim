import { useState } from "react";
import Link from "next/link";
import { Traffic, Health, dask, HomeOwners, CarService, Pet, Family } from "../resources/images";

const Services = () => {
  const [featureList] = useState([
    {
      title: "Trafik",
      img: Traffic,
      url: "/insurance/traffic",
    },
    {
      title: "Tamamlayıcı Sağlık",
      img: Health,
      url: "/insurance/health/complementary",
    },
    {
      title: "DASK",
      img: dask,
      url: "/insurance/dask",
    },
    {
      title: "Konut",
      img: HomeOwners,
      url: "",
    },
    {
      title: "KASKO",
      img: CarService,
      url: "/insurance/casco",
    },
    {
      title: "Evcil Hayvan",
      img: Pet,
      url: "/insurance/pet",
    },
  ]);

  return (
    <>
      {/* Feature section start*/}
      <section className="services_section mt-5" style={{ marginBottom: "300px" }}>
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
      </section>
      {/* Feature section end*/}
    </>
  );
};

export default Services;
