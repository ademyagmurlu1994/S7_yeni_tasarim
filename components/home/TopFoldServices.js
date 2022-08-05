import React, { useState, useEffect } from "react";
import Link from "next/link";

//import { carIcon, healthIcon, dask, phoneIcon, petIcon } from "/resources/images";
import {
  dask,
  CarService,
  Pet,
  Health,
  Traffic,
  Travel,
  Phone,
  logo,
  HomeFoldTopContentBackground,
} from "/resources/images";

//import { homefoldBackgroundVideo } from "../resources/videos";
const HomeFold = () => {
  const [state, setState] = useState({
    selectedHome: 1,
    itemList: [
      {
        name: "DASK",
        icon: dask,
        url: "/insurance/dask",
      },
      {
        name: "Trafik",
        icon: Traffic,
        url: "/insurance/traffic/",
      },
      {
        name: "Kasko",
        icon: CarService,
        url: "/insurance/casco/",
      },
      {
        name: "Tamamlayıcı Sağlık",
        icon: Health,
        url: "/insurance/health/complementary",
      },
      {
        name: "Evcil Hayvan",
        icon: Pet,
        url: "/insurance/pet",
      },
      {
        name: "Seyahat",
        icon: Travel,
        url: "/insurance/health/travel",
      },
      {
        name: "Telefon",
        icon: Phone,
        url: "/insurance/phone",
      },
    ],
  });

  return (
    <>
      <section className="home-topfold-services" style={{ position: "relative" }}>
        <hr
          style={{
            position: "absolute",
            top: "20%",
            borderWidth: "2px",
            borderColor: "var(--main-color)",
          }}
          className="d-none d-md-none d-lg-block w-100"
        />
        <div className="container container-large">
          <div className="row justify-content-center row-seven-column">
            {state.itemList.map((service, index) => {
              return (
                <div
                  className="col-6 col-sm-4 col-md-3 col-seven-1"
                  key={index}
                  style={{ display: "grid" }}
                >
                  <Link href={service.url}>
                    <div className="insurance-service-item">
                      <img src={service.icon} className="service-icon" alt="" />
                      <div className="service-name">{service.name}</div>
                      <a className="service-link">Teklif Al</a>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeFold;
