import { useEffect } from "react";
import { useState } from "react";

import Button from "/components/form/Button";

//images
import {
  AkSigortaLogo,
  AnadoluLogo,
  AllianzLogo,
  AveonGlobalLogo,
  AxaLogo,
  EurekoLogo,
  GroupamaLogo,
  HdiLogo,
  KoruLogo,
  MapfreLogo,
  NeovaLogo,
  PriveLogo,
  QuickLogo,
  SompoLogo,
  TurkiyeSigortaLogo,
  TurkNipponLogo,
  ZurichLogo,
} from "/resources/images";

const anlasmaliSirketler = [
  AkSigortaLogo,
  AnadoluLogo,
  AllianzLogo,
  AveonGlobalLogo,
  AxaLogo,
  EurekoLogo,
  GroupamaLogo,
  HdiLogo,
  KoruLogo,
  MapfreLogo,
  NeovaLogo,
  PriveLogo,
  QuickLogo,
  SompoLogo,
  TurkiyeSigortaLogo,
  TurkNipponLogo,
  ZurichLogo,
];

const Partners = () => {
  const [showAll, setShowAll] = useState(false);
  const [showArray, setShowArray] = useState([]);

  useEffect(() => {
    if (showAll) {
      setShowArray(anlasmaliSirketler);
    } else {
      let list = [];
      anlasmaliSirketler.map((item, index) => {
        if (index > 6) return;
        list.push(item);
      });
      setShowArray(list);
    }
  }, [showAll]);

  const handleShow = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <>
      <section className="client-feedback-section home-page-section">
        <div className="container">
          <h2 className="section-title">Çözüm Ortaklarımız</h2>
          <div className="w-100">
            <div className="anlasmali-sirketler-wrapper">
              <div className="row row-seven-column">
                {showArray.map((sirket, index) => {
                  return (
                    <>
                      <div className="col-3 col-sm-3 col-md-3 col-seven-1">
                        <div className="anlasmali-sirket d-flex align-items-center">
                          <img src={sirket} alt="" />
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="w-100 d-block text-center">
            <Button variant="outlined" onClick={() => handleShow()}>
              {showAll ? "- Daha Az Göster" : "+ Tümünü Göster"}{" "}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Partners;
