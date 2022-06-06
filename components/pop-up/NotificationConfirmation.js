import React, { useState, useEffect, useCallback } from "react";

const NotificationConfirmation = ({ notificationCallback, isShow }) => {
  const [state, setState] = useState({});

  useEffect(() => {
    if (isShow) {
      $("#notificationModal").modal("show");
    } else {
      $("#notificationModal").modal("hide");
    }
  }, [isShow]);

  return (
    <>
      {/* Pop-up Notificiation Modal*/}
      <div
        className="modal fade"
        id="notificationModal"
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
              Size özel kampanya ve indirimlerden SMS ve E posta ile haberdar olmak ister misiniz?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-main-outline btn-large"
                onClick={() => {
                  notificationCallback(false);
                  $("#notificationModal").modal("hide");
                }}
              >
                Hayır
              </button>
              <button
                type="button"
                className="btn-main btn-large"
                onClick={() => {
                  notificationCallback(true);
                  $("#notificationModal").modal("hide");
                }}
              >
                Evet
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationConfirmation;
