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
        name: "TRAFİK",
        icon: Traffic,
        url: "/insurance/traffic/",
      },
      {
        name: "KASKO",
        icon: CarService,
        url: "/insurance/casco/",
      },
      {
        name: "SAĞLIK",
        icon: Health,
        url: "/insurance/health/complementary",
      },
      {
        name: "EVCİL HAYVAN",
        icon: Pet,
        url: "/insurance/pet",
      },
      {
        name: "SEYAHAT",
        icon: Travel,
        url: "/insurance/health/travel",
      },
      {
        name: "TELEFON",
        icon: Phone,
        url: "/insurance/phone",
      },
    ],
  });

  return (
    <>
      <section
        className="home-topfold-services"
        style={{ paddingBottom: "0px", marginTop: "85px" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            {state.itemList.map((service, index) => {
              return (
                <div className="col-4 col-md-4 col-seven-1 topfold-services" key={index}>
                  <Link href={service.url}>
                    <div className="service-wrapper text-center">
                      <div className="service-circle-wrapper">
                        <div className="service-circle">
                          <div>
                            <img src={service.icon} alt="" />
                          </div>
                        </div>
                      </div>

                      <div className="service-name">{service.name}</div>
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
