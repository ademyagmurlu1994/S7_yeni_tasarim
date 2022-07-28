import { Translate } from "@mui/icons-material";
import React, { useState, useEffect, useCallback } from "react";
import { uuid } from "uuidv4";
import loadable from "@loadable/component";
const ReactJson = loadable(
  () => new Promise((r, c) => import("react-json-view").then((result) => r(result.default), c))
);

const JsonViewer = ({ show, onClose, jsonData }) => {
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
            width: "95%",
            marginTop: "50px !important",
            maxWidth: "1500px",
          }}
        >
          <div className="modal-content">
            <div className="modal-header">
              {/* <h5 className="modal-title d-flex justify-content-center" id={`modal-${popUpId}`}>
                Hatalar
              </h5> */}
              <button type="button" className="close" onClick={() => setShowPopup(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {jsonData && jsonData.startsWith("{") && jsonData.endsWith("}") ? (
                <ReactJson
                  src={JSON.parse(jsonData)}
                  displayDataTypes={false}
                  displayObjectSize={false}
                  enableClipboard={false}
                  name={false}
                />
              ) : (
                <p>{jsonData}</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn-main-outline"
                type="button"
                onClick={() => setShowPopup(false)}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JsonViewer;
