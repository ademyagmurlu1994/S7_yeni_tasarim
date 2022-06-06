import Link from "next/link";
import React, { useState, useEffect } from "react";

const Stepper = ({ steps, activeStep }) => {
  return (
    <div className="stepper-wrapper">
      {steps.map((stepName, index) => {
        return (
          <div
            className={`stepper-item  ${activeStep > index + 1 && "completed"} ${
              activeStep == index + 1 && "active"
            }`}
            key={index}
          >
            <div className="step-counter">
              <div className="step-count">{index + 1}</div>
            </div>
            <div className="step-name">{stepName}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
