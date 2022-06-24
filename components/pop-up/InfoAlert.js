import React, { useState, useEffect, useCallback } from "react";
import { uuid } from "uuidv4";

const InfoAlert = ({ show, children, onClose }) => {
  const [popUpId, setPopUpId] = useState("deneme");
  const [showPopup, setShowPopup] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setPopUpId(uuid());
  }, []);

  useEffect(() => {
    setShowPopup(show);
  }, [show]);

  useEffect(() => {
    setPopUpId(uuid());
    if (showPopup) {
      $(`#${popUpId}`).modal("show");
    } else if (showPopup == false) {
      if (counter >= 1 && onClose) {
        onClose(true);
      }
      setCounter(counter + 1);
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
        <div className="modal-dialog" style={{ maxWidth: "600px" }}>
          <div className="modal-content animate__animated animate__fadeInDown">
            <div className="modal-header">
              <h5 className="modal-title d-flex justify-content-center" id={`modal-${popUpId}`}>
                <i className="fas fa-info-circle"></i>
              </h5>
              <button type="button" className="close" onClick={() => setShowPopup(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body modal-info">{children}</div>
            <div className="modal-footer">
              <button
                className="btn-main-outline"
                type="button"
                onClick={() => setShowPopup(false)}
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoAlert;
