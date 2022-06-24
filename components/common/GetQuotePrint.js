import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import axios from "/instances/axios";

//fonksiyonlar
import {
  saveBlobByteArray,
  getNewToken,
  writeResponseError,
  numberToTrNumber,
  capitalize,
} from "/functions/common";

const GetQuotePrint = ({ service, companyCode, quoteReference, revisionNumber, token, view }) => {
  const [pdfDocument, setPdfDocument] = useState();
  const [quotes, setQuotes] = useState([]);
  const [buttonMessage, setButtonMessage] = useState({ status: 0, message: "TEKLİFİ İNDİR" });
  const [counter, setCounter] = useState(0);

  //pdf document geldikten sonra indirme işlemi yapıyoruz.
  useEffect(async () => {
    if (pdfDocument && pdfDocument.url) {
      downloadQuoteDocument();
    }
  }, [pdfDocument]);

  //http requestler
  const getQuoteDocuments = async () => {
    setButtonMessage({ status: 1, message: "TEKLİF İNDİRİLİYOR" });

    const result = quotes.find((element) => {
      // 👇️ using AND (&&) operator
      return element.quoteReference.toString() === quoteReference.toString();
    });

    console.log("Result: ", result);
    if (result) {
      setPdfDocument({
        url: result.documentUrl,
        documentType: "",
      });
    } else {
      let postUrl = "";

      switch (service.toString()) {
        case "casco":
          postUrl = "/api/print/v1/casco/printcascoquote";
          break;
        case "traffic":
          postUrl = "/api/print/v1/traffic/printtrafficquote";
          break;
        case "tss":
          postUrl = "/api/print/v1/tss/printtssquote";
          break;
        case "travel":
          postUrl = "/api/print/v1/travel/printtravelquote";
          break;
        case "dask":
          postUrl = "/api/print/v1/dask/printdaskquote";
          break;
        case "personelaccident":
          postUrl = "/api/print/v1/personelaccident/printpersonelaccidentquote";
          break;
      }

      try {
        let bodyData = {
          companyCode: Number(companyCode),
          quoteReference: quoteReference.toString(),
          revisionNumber: revisionNumber.toString(),
        };

        console.log(postUrl);
        console.log(bodyData);
        await axios
          .post(postUrl, bodyData, {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
          .then((res) => {
            if (res.data.success) {
              let responsePdfList = res.data.data.pdfList;
              let pdfDocument = {};

              if (responsePdfList[0].printLink) {
                pdfDocument = {
                  url: responsePdfList[0].printLink,
                  documentType: "",
                };
              } else {
                //Base64 dosyalarını pdf url'ine çeviriyoruz.
                pdfDocument = {
                  url: saveBlobByteArray(responsePdfList[0].binaryData),
                  documentType: responsePdfList[0].documentType,
                };
              }

              //Pdf başarılı bir şekilde geldi ise teklifi ve dokümanı kaydediyoruz.
              console.log("quotes: ", quotes);
              let list = quotes;
              list.push({
                companyCode: Number(companyCode),
                quoteReference: quoteReference.toString(),
                revisionNumber: revisionNumber.toString(),
                documentUrl: pdfDocument.url,
              });

              setQuotes(list);

              setTimeout(() => {
                setPdfDocument(pdfDocument);
              }, 500);
              // setState({
              //   ...state,
              //   responseMessage: { status: 1, message: "Teklif Basımı Başarılı" },
              // });
            }
          });
      } catch (error) {
        writeResponseError(error);
        setButtonMessage({ status: 3, message: "TEKLİF İNDİRİLEMEDİ" });
        //setState({ ...state, responseMessage: { status: 1, message: "Teklif Basımı Başarısız" } });
      }
    }
  };

  const downloadQuoteDocument = async () => {
    // window.open("http://www.example.com?ReportID=1", "_blank");
    // let linkDeneme = document.getElementById("link-deneme");
    // linkDeneme.click();
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.href = pdfDocument.url;
    console.log(pdfDocument.url.toString().substring(0, 4));
    if (pdfDocument.url.toString().substring(0, 4) == "http") {
      if (counter == 0) {
        alert("Teklifi indirmek için lütfen butona bir daha tıklayınız.");
        setButtonMessage({ status: 0, message: "TEKLİFİ İNDİRMEK İÇİN TIKLA" });
      }
      if (counter == 1) {
        window.open(pdfDocument.url, "blank");
        setButtonMessage({ status: 2, message: "TEKLİF İNDİRİLDİ" });
      }
      setCounter(counter + 1);
    } else {
      link.setAttribute("download", service + "-teklif-" + quoteReference.toString() + ".pdf");

      // Append to html link element page
      document.body.appendChild(link);

      console.log("Print Link: ", link);

      setButtonMessage({ status: 2, message: "TEKLİF İNDİRİLDİ" });
      alert("Teklif başarılı bir şekilde indirildi.");

      // Start download
      link.dispatchEvent(new MouseEvent("click"));
    }
  };

  function Open() {
    if (pdfDocument) window.open(pdfDocument.url, "blank");
  }

  return (
    <>
      <div className="get-quote-prin text-center">
        {view == "icon" ? (
          <button
            class={`header-action-icon ${
              (buttonMessage.status == 1 || buttonMessage.status == 2) && " text-main"
            }  ${buttonMessage.status == 3 && " text-danger"}`}
            onClick={() => getQuoteDocuments()}
            disabled={buttonMessage.status == 2}
            style={{
              alignItems: "center",
              border: "none",
              background: "none",
            }}
          >
            {buttonMessage.status == 0 && ( //0
              <i
                className="fas fa-download "
                style={{ marginTop: "-3px", marginBottom: "3px" }}
              ></i>
            )}
            {buttonMessage.status == 1 && ( //1
              <>
                <div
                  className="d-flex justify-content-center"
                  style={{ marginTop: "-7px", marginBottom: "3px" }}
                >
                  <ReactLoading
                    type={"spinningBubbles"}
                    color={"var(--main-color)"}
                    height="auto"
                    width={18}
                  />
                </div>
              </>
            )}
            {buttonMessage.status == 2 && (
              <i
                className="far fa-check-circle"
                style={{ marginTop: "-3px", marginBottom: "3px" }}
              ></i>
            )}
            {buttonMessage.status == 3 && (
              <i
                className="fas fa-times-circle text-danger"
                style={{ marginTop: "-3px", marginBottom: "3px" }}
              ></i>
            )}

            <div className="button-text">
              {capitalize(buttonMessage.message.slice(buttonMessage.message.indexOf(" ") + 1))}
            </div>
          </button>
        ) : (
          <button
            onClick={() => getQuoteDocuments()}
            className="btn-main-outline mt-3 w-100"
            disabled={buttonMessage.status == 2}
            id="btn-get-print-pdf"
          >
            {buttonMessage.status == 0 && (
              <>
                <i className="fas fa-download mr-2"></i>
                {buttonMessage.message}
              </>
            )}
            {buttonMessage.status == 1 && (
              <div className="d-flex justify-content-center">
                <ReactLoading
                  type={"spinningBubbles"}
                  color={"var(--main-color)"}
                  height={7}
                  width={18}
                  className="mr-2"
                />
                {buttonMessage.message}
              </div>
            )}
            {buttonMessage.status == 2 && (
              <>
                <i className="far fa-check-circle  mr-2"></i>
                {buttonMessage.message}
              </>
            )}
            {buttonMessage.status == 3 && (
              <>
                <i className="fas fa-times-circle text-danger mr-2"></i>
                {buttonMessage.message}
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default GetQuotePrint;
