import React, { useState, useEffect } from "react";
import Link from "next/link";

const PageMessage = ({ message, messageCode, messageHeader }) => {
  return (
    <div
      className="text-center w-100 mt-5  d-flex justify-content-center "
      style={{ marginBottom: "100px" }}
    >
      <div className="w-100" style={{ display: "block" }}>
        {(() => {
          switch (messageCode) {
            case "0": {
              // Error
              return (
                <i className="fas fa-times-circle text-danger" style={{ fontSize: "96pt" }}></i>
              );
            }
            case "1": {
              // Success
              return (
                <i className="far fa-check-circle text-success" style={{ fontSize: "96pt" }}></i>
              );
            }

            case "2": {
              //Warning
              return (
                <i
                  className="fas fa-exclamation-circle text-warning"
                  style={{ fontSize: "96pt" }}
                ></i>
              );
            }

            case "3": {
              //İnformation
              return <i className="fas fa-info-circle text-info" style={{ fontSize: "96pt" }}></i>;
            }
          }
        })()}
        <h3 className="mt-5">
          <b>{messageHeader}</b>
        </h3>
        <h4 className="mt-3">
          <b>{message}</b>
        </h4>
      </div>
    </div>
  );
};

export default PageMessage;
