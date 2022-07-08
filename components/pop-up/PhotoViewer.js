import { Translate } from "@mui/icons-material";
import React, { useState, useEffect, useCallback } from "react";
import { uuid } from "uuidv4";

const PhotoViewer = ({ show, photo, onClose }) => {
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
        onBlur={() => setShowPopup(false)}
      >
        <div
          className="modal-dialog"
          style={{
            maxWidth: "500px",
          }}
        >
          <div className="modal-content animate__animated animate__fadeInDown">
            <div className="modal-header">
              <button type="button" className="close" onClick={() => setShowPopup(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <img src={photo} alt="" style={{ maxWidth: "100%", height: "auto", width: "100%" }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PhotoViewer;
