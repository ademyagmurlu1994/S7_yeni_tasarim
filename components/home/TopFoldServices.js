import React, { useState, useEffect } from "react";
import Link from "next/link";
import EastIcon from "@mui/icons-material/East";
//import { carIcon, healthIcon, dask, PhoneImg, petIcon } from "/resources/images";

import {
  CascoIcon,
  DaskIcon,
  TssIcon,
  TravelIcon,
  PetIcon,
  PhoneIcon,
  TrafficIcon,
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
        icon: DaskIcon,
        url: "/insurance/dask",
      },
      {
        name: "Trafik",
        icon: TrafficIcon,
        url: "/insurance/traffic/",
      },
      {
        name: "Kasko",
        icon: CascoIcon,
        url: "/insurance/casco/",
      },
      {
        name: "Tamamlayıcı Sağlık",
        icon: TssIcon,
        url: "/insurance/health/complementary",
      },
      {
        name: "Evcil Hayvan",
        icon: PetIcon,
        url: "/insurance/pet",
      },
      {
        name: "Seyahat",
        icon: TravelIcon,
        url: "/insurance/health/travel",
      },
      {
        name: "Telefon",
        icon: PhoneIcon,
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
            borderColor: "var(--color-one)",
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
          <div className="d-flex justify-content-center">
            <div className="topfold-service-arrow">
              <EastIcon />
              <i class="fas fa-arrow-down"></i>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeFold;
