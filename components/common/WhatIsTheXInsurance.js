import Link from "next/link";
import React, { useState, useEffect } from "react";

const WhatIsTheXInsurance = ({ photo, title, topTitle, descriptionParagraphs }) => {
  return (
    <div className="what-is-the-x-insurance">
      <div className="container">
        <h4 className="x-insurance-topTitle">{topTitle}</h4>
        <h3 className="x-insurance-title">{title}</h3>
        <div className="content-wrapper">
          {photo && <img src={photo} alt="" className="d-none d-md-block insurance-photo" />}
          <p className="description">
            <ul>
              {descriptionParagraphs.map((paragraph, index) => {
                return <li>{paragraph}</li>;
              })}
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatIsTheXInsurance;
