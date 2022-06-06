//import "./SelectPackage.css";

import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

//components
import PetStepper from "/components/pet/PetStepper";

//Styles
import { inputStyle, MainButtonLarge } from "/styles/custom";
//İmages
import { PetInsurancePackageOne, PetInsurancePackageTwo } from "/resources/images";

function SelectPackage() {
  const router = useRouter();
  const [state, setState] = useState({
    isPackageOne: true,
    identityNo: "",
    birthDate: "",
    phoneNumber: "",
    activeStep: 1,
  });

  const getKaskoOffers = (data) => {
    //store'daki değeri değiştiriyoruz.
    localStorage.setItem(
      "kaskoIndex",
      JSON.stringify({
        isPackageOne: state.isPackageOne,
        tcKimlikNumarasi: data.tcKimlikNumarasi,
        aracPlakaNo: data.aracPlakaNo,
        dogumTarihi: data.dogumTarihi,
      })
    );
    router.push("/insurance/traffic/inquiry");
  };

  return (
    <>
      <section className="section">
        <div style={{ marginTop: "20px", marginBottom: "150px" }} className="container">
          <div className="row justify-content-center">
            {/* Stepper */}
            <div className="col-12 col-lg-11 mt-2">
              <PetStepper activeStep={3}></PetStepper>
            </div>
            <div className="col-12 col-lg-10 mt-4">
              {/* Paket Seçimi */}
              <div className="row justify-content-between">
                <div className="col-6">
                  <div className="custom-radio-button custom-radio-button-pet-package">
                    <input
                      type="radio"
                      name="plakavarmi"
                      id="plakaVar"
                      value={true}
                      checked={state.isPackageOne}
                      onChange={() => setState({ ...state, isPackageOne: true })}
                    />
                    <label htmlFor="plakaVar">
                      <div className="pet-insurance-package">
                        <img src={PetInsurancePackageOne} alt="" width="100%" />
                        <h3 className="mt-3">PAKET 1</h3>
                        <p>Küçük Paket .bazı teminatları eksik olacak Ürüne göre düzenlenecektir</p>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="custom-radio-button custom-radio-button-pet-package">
                    <input
                      type="radio"
                      name="plakavarmi"
                      id="plakaYok"
                      value={false}
                      checked={!state.isPackageOne}
                      onChange={() => setState({ ...state, isPackageOne: false })}
                    />
                    <label htmlFor="plakaYok">
                      <div className="pet-insurance-package">
                        <img src={PetInsurancePackageTwo} alt="" width="100%" />
                        <h3 className="mt-3">PAKET 2</h3>
                        <p>
                          Büyük paket daha fazla teminat olacak Ürüne göre içerik yazıları
                          güncellenecek
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="mt-2">
                  <label className="checkbox-toggle">
                    <label className="font-weight-bold mr-2" style={{ fontSize: "15pt" }}>
                      Paket 1
                    </label>
                    <input
                      type="checkbox"
                      value={!state.isPackageOne}
                      checked={!state.isPackageOne}
                      onChange={(e) => setState({ ...state, isPackageOne: !e.target.checked })}
                    />
                    <span className="slider round"></span>
                    <label className="font-weight-bold ml-2" style={{ fontSize: "15pt" }}>
                      Paket 2
                    </label>
                  </label>
                </div>
              </div>
              <div className="row justify-content-end mt-4">
                <div className="col-12 col-lg-6 col-md-6">
                  <MainButtonLarge
                    variant="contained"
                    sx={{ width: "100%" }}
                    onClick={() => {
                      router.push("/insurance/pet/offers");
                    }}
                  >
                    PET SİGORTASI TEKLİF AL
                  </MainButtonLarge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SelectPackage;
