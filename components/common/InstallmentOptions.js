import React from "react";
import Link from "next/link";
import { logo } from "../../resources/images";
import { useForm } from "react-hook-form";
import { useState } from "react";

const InstallmentOptions = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [state, setState] = useState({
    installmentOptions: [{}, {}, {}, {}, {}, {}, {}, {}],
    pesinFiyat: 4343.52,
  });

  return (
    <>
      <div className="payment-InstallmentOptions">
        <div className="row">
          <div className="col-12 installment-options">
            <div className="installment-option-item">
              <div>
                <input type="radio" id="pesinFiyat" className="radio-input" name="radio-group" />
                <label htmlFor="pesinFiyat" className="radio-label">
                  <span className="radio-border"></span>Peşin Fiyat
                </label>
              </div>
              <div className="installment-left-side">{state.pesinFiyat}</div>
            </div>
            {state.installmentOptions.map((item, index) => {
              return (
                <div className="installment-option-item" key={index}>
                  <div className="installment-left-side">
                    <input type="radio" id={index} className="radio-input" name="radio-group" />
                    <label htmlFor={index} className="radio-label">
                      <span className="radio-border"></span>
                      {index + 2} Taksit
                    </label>
                  </div>
                  <div className="installment-left-side">{state.pesinFiyat}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default InstallmentOptions;
