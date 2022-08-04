import { Translate } from "@mui/icons-material";
import React, { useState, useEffect, useCallback } from "react";
import { uuid } from "uuidv4";

const QuoteErrorList = ({ show, quoteErrors, onClose }) => {
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

      <button
        className="btn btn-danger"
        type="button"
        onClick={() => setShowPopup(true)}
        style={{ position: "fixed", top: "85px", right: "0", zIndex: "99" }}
      >
        <b>
          <i className="fas fa-times-circle mr-2"></i> Hatalar
        </b>
      </button>

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
            maxWidth: "1800px",
          }}
        >
          <div className="modal-content animate__animated animate__fadeInDown">
            <div className="modal-header">
              <h5 className="modal-title d-flex justify-content-center" id={`modal-${popUpId}`}>
                Hatalar
              </h5>
              <button type="button" className="close" onClick={() => setShowPopup(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" style={{ borderTop: "none" }}>
                      #
                    </th>
                    <th scope="col" style={{ borderTop: "none" }}>
                      Şirket
                    </th>
                    <th scope="col" style={{ borderTop: "none" }}>
                      Hata Mesajı
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quoteErrors.map((quoteError, index) => {
                    return (
                      <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{quoteError.companyName}</td>
                        <td>{quoteError.errorMessage}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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

export default QuoteErrorList;
