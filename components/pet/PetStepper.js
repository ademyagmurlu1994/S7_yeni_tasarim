import React from "react";

function PetStepper({ activeStep }) {
  return (
    <>
      {/* Stepper */}
      <div className="stepper-wrapper">
        <div
          className={`stepper-item  ${activeStep == 1 && "active"} ${
            activeStep > 1 && "completed"
          }`}
        >
          <div className="step-counter">
            <div className="step-count">1</div>
          </div>
          <div className="step-name">KÜÇÜK DOSTUNUZUN BİLGİLERİ</div>
        </div>
        <div
          className={`stepper-item   ${activeStep == 2 && "active"} ${
            activeStep > 2 && "completed"
          }`}
        >
          <div className="step-counter">
            <div className="step-count">2</div>
          </div>
          <div className="step-name">SİZİN BİLGİLERİNİZ</div>
        </div>
        <div
          className={`stepper-item   ${activeStep == 3 && "active"} ${
            activeStep > 3 && "completed"
          }`}
        >
          <div className="step-counter">
            <div className="step-count">3</div>
          </div>
          <div className="step-name">PAKET SEÇENEKLERİ</div>
        </div>
      </div>
    </>
  );
}

export default PetStepper;
