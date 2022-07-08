import React, { useState, useEffect } from "react";
import Link from "next/link";

import { HomeImage, FamilyImage, CarImage } from "/resources/images";

const HomeFold = () => {
  useEffect(() => {
    //Background videoyu otomatik oynatma
    document.getElementById("myVideo").play();
  }, []);
  return (
    <>
      <section
        className="home-topfold-banner"
        style={{
          paddingBottom: "0px",
          objectFit: "cover",
        }}
      >
        <div className="container-fluid">
          {/* <div className="row topfold-text ">
            <div className="col-10 col-lg-12 text-center">
              <h2>Hayatınıza Dair Her Şeyi Garantiye Alın!</h2>
              <h5 className="d-none d-lg-block">Tüm kampanyalarımız için sizi bilgilendirelim.</h5>
              <Link href="/services">
                <button className="btn-home-fold-banner">HEMEN BAŞVURUN</button>
              </Link>
            </div>
          </div> */}
          <div className="row">
            <div className="col-12 d-none d-md-block">
              <video autoPlay muted loop playsInline id="myVideo" style={{ width: "100%" }}>
                <source src="/static/video/homefold-background.mp4" type="video/mp4" />{" "}
              </video>
            </div>

            <div className="col-12 d-block d-md-none">
              <video autoPlay muted loop playsInline id="myVideo" style={{ width: "100%" }}>
                <source src="/static/video/homefold-background-mobile.mp4" type="video/mp4" />{" "}
              </video>
            </div>
            {/* <div className="col-4">
              <img src={HomeImage} className="home-image" alt="" />
            </div>
            <div className="col-4 family-image-column">
              <img src={FamilyImage} className="family-image" alt="" />
            </div>
            <div className="col-4  car-image-column">
              <img src={CarImage} className="car-image" alt="" />
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeFold;
