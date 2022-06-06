import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

//components
import InsuranceIndexPageInformation from "/components/common/InsuranceIndexPageInformation";
import TravelFAQ from "/components/faq/TravelFAQ";
import WhatIsTheXInsurance from "/components/common/WhatIsTheXInsurance";

//fonksiyonlar
import { isValidTcKimlik, getTodayDate, writeResponseError } from "/functions/common";

//images
import { DaskInsuranceInformationPhoto, WhatIsTheDaskInsurance } from "/resources/images";

export default function travelIndex() {
  const [state, setState] = useState({});

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const getTravelHealthOffers = (data) => {
    //store'daki değeri değiştiriyoruz.
    localStorage.setItem(
      "travel_health_index",
      JSON.stringify({
        tc_kimlik_numarasi: data.tc_kimlik_numarasi,
      })
    );
    router.push("/insurance/health/travel/inquiry");
  };

  return (
    <>
      <section className="section">
        <div style={{ marginTop: "100px" }}>
          <div className="container">
            <div className="row mb-5 mt-5">
              <div className=" col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <InsuranceIndexPageInformation
                  title="En uygun Seyahat Sağlık poliçesini , 1 Dakika içinde seçerek alabilirsiniz!"
                  photo={DaskInsuranceInformationPhoto}
                  detailParagraphs={[
                    "En iyi sigorta şirketlerinin tekliflerini karşılaştırın",
                    "İnternete özel ek indirimlerle seyahat sağlık sigortası yaptırın!",
                  ]}
                />
              </div>
              <div
                className="col-xs-12 col-sm-12 col-md-6 col-lg-6"
                style={{ backgroundColor: "var(--main-color-light)", padding: "20px 10px" }}
              >
                <div className="row">
                  <div className="col-lg-12">
                    <div className="contact_thir_form mx-auto">
                      {
                        <form onSubmit={handleSubmit(getTravelHealthOffers)}>
                          <div className="tckn-input-card">
                            <div className="tc-kimlik-no mt-4">
                              <label htmlFor="tcKimlikNo">T.C. Kimlik Numarası</label>
                              <input
                                type="number"
                                id="tcKimlikNo"
                                maxLength={11}
                                placeholder="T.C. Kimlik Numarası"
                                className={`form-control ${
                                  errors["tc_kimlik_numarasi"] && "invalid"
                                }`}
                                {...register("tc_kimlik_numarasi", {
                                  required: "T.C. Kimlik Numarası zorunlu",
                                  validate: isValidTcKimlik,
                                })}
                              />
                              <small className="text-danger">
                                {errors["tc_kimlik_numarasi"]?.message}
                                {/**Validate Message */}
                                {errors["tc_kimlik_numarasi"]
                                  ? errors["tc_kimlik_numarasi"].type == "validate"
                                    ? "Geçersiz T.C. Kimlik Numarası"
                                    : ""
                                  : ""}
                              </small>
                            </div>
                            <div className="information-for-new-policy mt-3">
                              TCKN size özel teklif üretebilmemiz için gerekmektedir.
                            </div>
                          </div>

                          <input
                            type="submit"
                            className="btn-custom btn-timeline-forward w-100 mt-3"
                            value="SEYAHAT SAĞLIK TEKLİFİ AL"
                          />
                        </form>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*Seyahat Sağlık Sigortası Nedir?*/}
          <div className="row">
            <div className="col-12">
              <WhatIsTheXInsurance
                photo={WhatIsTheDaskInsurance}
                title="SEYAHAT SAĞLIK SİGORTASI NEDİR? NE İŞE YARAR?"
                topTitle="HASTALIKLARA KARŞI ÖNLEMİNİZİ ALIN"
                descriptionParagraphs={[
                  "DASK (Doğal Afetler Sigortalar Kurumu) Zorunlu Deprem Sigortası; depremin ve deprem sonucu meydana gelen yangın, patlama, tsunami ile yer kaymasının doğrudan neden olacağı maddi zararları, sigorta poliçesinde belirtilen limitler kapsamında karşılayan bir sigorta türüdür.",
                  "Zorunlu Deprem Sigortası yaptırdığınız zaman binanız tamamen ya da kısmen zarar gördüğünde teminat altına alınır. DASK yaptırmadığınız durumlarda ise bu yardımdan yararlanamazsınız.",
                  ,
                ]}
              />
            </div>
          </div>

          {/*Sıkça Sorulan sorular */}
          <div className="container mt-5">
            <TravelFAQ topic="SEYAHAT SAĞLIK SİGORTASI" />
          </div>
        </div>
      </section>
    </>
  );
}
