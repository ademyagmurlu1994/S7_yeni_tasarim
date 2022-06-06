import React, { useState, useEffect, useCallback } from "react";

const NotificationConfirmation = ({ notificationCallback, isShow }) => {
  const [state, setState] = useState({});

  useEffect(() => {
    if (isShow) {
      $("#adBlockModal").modal("show");
    } else {
      $("#adBlockModal").modal("hide");
    }
  }, [isShow]);

  return (
    <>
      {/* Pop-up Notificiation Modal*/}
      <div
        className="modal fade"
        id="adBlockModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-keyboard="false"
        data-backdrop="static"
      >
        <div className="modal-dialog">
          <div
            className="modal-content animate__animated animate__fadeInDown"
            style={{ borderRadius: "20px", boxShadow: "rgba(255, 255, 255, 0.5) 0px 8px 24px" }}
          >
            <div
              className="modal-body"
              style={{
                fontSize: "14pt",
                fontWeight: "500",
                padding: "30px 5px 30px 12px",
              }}
            >
              Lütfen Add Blocker Eklentisini Kapatınız.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationConfirmation;
