import Link from "next/link";
import React, { useState, useEffect } from "react";

const InsuranceIndexPageInformation = ({ photo, title, detailParagraphs }) => {
  return (
    <div className="insuranceIndexPageInformation">
      <h3 className="information-title">{title}</h3>
      <div className="insuranceIndexPageInformationDetails">
        <ul>
          {detailParagraphs.map((paragraph, index) => {
            return <li>{paragraph}</li>;
          })}
        </ul>
      </div>
      <div className="insuranceIndexPageInformationPhoto d-none d-md-flex">
        <img src={photo} alt="" />
      </div>
    </div>
  );
};

export default InsuranceIndexPageInformation;
