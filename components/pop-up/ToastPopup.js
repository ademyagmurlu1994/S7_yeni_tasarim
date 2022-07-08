//state çağırma ve değiştirme işlemi
import { useDispatch, useSelector } from "react-redux";
import { close, show } from "/stores/toast";

import React, { useState, useEffect, useCallback } from "react";
import { uuid } from "uuidv4";

const ToastPopup = () => {
  const dispatch = useDispatch();
  //pop-up'ı tetiklemek için kullanıldı
  const showPopup = useSelector((state) => state.toast.isShow);
  const toastMessage = useSelector((state) => state.toast.toastMessage);
  const severity = useSelector((state) => state.toast.severity);

  const [popUpId, setPopUpId] = useState("deneme");

  useEffect(() => {
    setPopUpId(uuid());
  }, []);

  useEffect(() => {
    setPopUpId(uuid());
    if (showPopup) {
      $(`#${popUpId}`).modal("show");
    } else if (showPopup == false) {
      $(`#${popUpId}`).modal("hide");
    }
  }, [showPopup]);

  return (
    <>
      {/* Pop-up  Modal*/}
      <div
        className="modal fade"
        id={popUpId}
        tabIndex="-1"
        aria-labelledby={`modal-${popUpId}`}
        aria-hidden="true"
      >
        <div
          className="modal-dialog"
          style={{
            maxWidth: "600px",
            position: "fixed",
            width: "100%",
            height: "200px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "99999999444",
          }}
        >
          <div className="modal-content animate__animated animate__fadeInDown">
            <div className="modal-header">
              <h5 className="modal-title d-flex justify-content-center" id={`modal-${popUpId}`}>
                {(() => {
                  switch (severity) {
                    case "warning":
                      return <i class="fas fa-exclamation-circle text-warning"></i>;
                      break;
                    case "error":
                      return <i class="fas fa-times-circle text-danger"></i>;
                    default:
                      return <i className="fas fa-info-circle text-info"></i>;
                  }
                })()}
              </h5>
              <button type="button" className="close" onClick={() => dispatch(close())}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body modal-info">{toastMessage}</div>
            <div className="modal-footer">
              <button className="btn-main-outline" type="button" onClick={() => dispatch(close())}>
                Tamam
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToastPopup;
