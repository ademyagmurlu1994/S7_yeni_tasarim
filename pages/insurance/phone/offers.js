//import "./CarPriceOffer.css";

import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

//Componentler
import TrafficFAQ from "/components/faq/TrafficFAQ";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

//import AdapterDateFns from "@mui/lab/AdapterDateFns";
//import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import Alert from "@mui/material/Alert";
import PreLoader from "/components/PreLoader";
import PreFormLoader from "/components/PreFormLoader";

//fonksiyonlar
import {
  isValidTcKimlik,
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
} from "/functions/common";
//İmages
import { PetInsurancePackageOne, PhoneInsurancePackageTwo } from "/resources/images";

//Styles
import { inputStyle, MainButtonLarge } from "/styles/custom";

function CarPriceOffer() {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [state, setState] = useState({
    isCat: true,
    identityNo: "",
    birthDate: "",
    phoneNumber: "",
    activeStep: 1,
    assurances: ["Teminat 1", "Teminat 2", "Ek hizmet 1", "Ek hizmet 2"],
  });

  const [selectedGender, setSelectedGender] = useState();
  const [selectedAge, setSelectedAge] = useState();

  const validateStep = (data) => {
    setState({ ...state, activeStep: state.activeStep + 1 });
  };

  const getKaskoOffers = (data) => {
    //store'daki değeri değiştiriyoruz.
    localStorage.setItem(
      "kaskoIndex",
      JSON.stringify({
        isCat: state.isCat,
        tcKimlikNumarasi: data.tcKimlikNumarasi,
        aracPlakaNo: data.aracPlakaNo,
        dogumTarihi: data.dogumTarihi,
      })
    );
    router.push("/insurance/traffic/inquiry");
  };

  const [open, setOpen] = React.useState(false);
  const [readOnly, setReadOnly] = React.useState(false);

  // console.log(watch());

  //console.log(errors);

  return (
    <>
      <section className="section">
        <div style={{ marginTop: "20px", marginBottom: "150px" }} className="container">
          <div className="row">
            <div className="col-6">
              <div className="pet-insurance-offer">
                <img src={PhoneInsurancePackageTwo} alt="" width="100%" />
                <h3 className="mt-3">PAKET 2</h3>
                <p>
                  Büyük paket daha fazla teminat olacak Ürüne göre içerik yazıları güncellenecek
                </p>
              </div>
            </div>
            <div className="col-6">
              <h3 className="text-center">Teminatlar</h3>
              <div className="row mt-4">
                {state.assurances.map((assurance, index) => {
                  return (
                    <div className="col-12" key={index}>
                      <div className="pet-assurance d-flex align-items-center">
                        <i
                          className="far fa-question-circle mr-2"
                          style={{ color: "var(--main-color)" }}
                        ></i>
                        <div style={{ fontSize: "13pt" }}> {assurance}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="row mt-3">
                <div className="col-12" style={{ color: "var(--main-color)" }}>
                  <i className="fas fa-file-alt"></i> Tüm Teminatlar
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-end mt-4">
            <div className="col-12 col-lg-6 col-md-6">
              <MainButtonLarge variant="contained" sx={{ width: "100%" }}>
                SATIN AL
              </MainButtonLarge>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CarPriceOffer;
