import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

/**/
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";

import { CommunicationImage } from "/resources/images";

const ClientFeedbacks = () => {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();

  return (
    <>
      <section className="communication-section">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-12">
              <h2 className="title">
                <div className="home_four_content header-tween mx-auto text-center">
                  <h3 className="">Formu Doldurun Sizi Arayalım</h3>
                </div>
              </h2>
            </div>
          </div>
          <div className="d-flex justify-content-center w-100">
            <img src={CommunicationImage} alt="" style={{ width: "300px" }} />
          </div>
          <form>
            <div className="row justify-content-center">
              <div className="" style={{ width: "800px", padding: " 5px 30px " }}>
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-6 mt-3">
                    <label className="custom-field black w-100">
                      <input type="text" placeholder="&nbsp;" />
                      <span className="placeholder">Adınız</span>
                    </label>
                  </div>
                  <div className="col-12 col-md-6 col-lg-6 mt-3">
                    <label className="custom-field black w-100">
                      <input type="text" placeholder="&nbsp;" />
                      <span className="placeholder">Soyadınız</span>
                    </label>
                  </div>
                  <div className="col-12 col-md-6 col-lg-6 mt-3">
                    <label className="custom-field black w-100">
                      <input type="tel" placeholder="&nbsp;" />
                      <span className="placeholder">Telefon</span>
                    </label>
                  </div>
                  <div className="col-12 col-md-6 col-lg-6 mt-3">
                    <label className="custom-field black w-100">
                      <input type="email" placeholder="&nbsp;" />
                      <span className="placeholder">Konu Başlığı</span>
                    </label>
                  </div>
                  <div className="col-12 mt-3">
                    <label className="custom-field black w-100">
                      <textarea type="email" placeholder="&nbsp;" />
                      <span className="placeholder">Mesajınız</span>
                    </label>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-12">
                    <button className="btn-main w-100 py-2">FORMU GÖNDER</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default ClientFeedbacks;
