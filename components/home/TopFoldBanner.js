import React, { useState, useEffect } from "react";
import Link from "next/link";

import { HomeImage, FamilyImage, CarImage } from "/resources/images";
import Button from "/components/form/Button";

const HomeFold = () => {
  const { width } = useWindowDimensions();
  const [height, setHeight] = useState("");

  useEffect(() => {
    //Background videoyu otomatik oynatma
    document.getElementById("mobileVideo").play();
    document.getElementById("desktopVideo").play();
  }, []);

  useEffect(() => {
    var offsetHeight;
    console.log(width);
    if (width <= 992) {
      offsetHeight = document.getElementById("mobileVideo").offsetHeight;
    } else {
      offsetHeight = document.getElementById("desktopVideo").offsetHeight;
    }
    setHeight(offsetHeight);
  }, [width]);
  return (
    <>
      <section
        className="home-topfold-banner w-100"
        style={{
          paddingBottom: "0px",
          objectFit: "cover",
          height: height + "px",
          maxHeight: "600px",
          minHeight: "400px",
        }}
      >
        <div className="topfold-content w-100">
          <div className=" topfold-text">
            <h2 className="main-text">Sigortanın Sigortası</h2>
            <h5 className="sub-text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut repellendus voluptatum
              voluptate a omnis at quo magnam, ex veniam quos est quibusdam aliquam et quisquam
              fugiat perspiciatis mollitia
            </h5>
            <Link href="/services">
              <Button
                variant="outlined"
                size="large"
                sx={{ minWidth: "220px" }}
                className="quote-button"
              >
                <b>Teklif Al</b>
              </Button>
            </Link>
          </div>
        </div>
        <div className="w-100 d-none d-md-block">
          <video className="w-100" autoPlay muted loop playsInline id="desktopVideo">
            <source src="/static/video/homefold-background.mp4" type="video/mp4" />
            {/* <source src="/static/video/deneme.mp4" type="video/mp4" /> */}
          </video>
        </div>

        <div className="w-100 d-block d-md-none">
          <video className="w-100" autoPlay muted loop playsInline id="mobileVideo">
            <source src="/static/video/homefold-background-mobile.mp4" type="video/mp4" />
          </video>
        </div>
      </section>
    </>
  );
};

export default HomeFold;

function useWindowDimensions() {
  const hasWindow = typeof window !== "undefined";

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
}
