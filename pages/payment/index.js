import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "/instances/axios";
import { useRouter } from "next/router";

//Components
import CreditCard from "/components/common/CreditCard";
import InstallmentOptions from "/components/common/InstallmentOptions";
import DefineMortgage from "/components/pop-up/DefineMortgage";
import Stepper from "/components/common/Stepper";
import PreLoader from "/components/PreLoader";
import PagePreLoader from "/components/common/PagePreLoader";
import Alert from "@mui/material/Alert";

//functions
import { getCreditCardType, getNewToken, writeResponseError } from "/functions/common";

//custom config
import { config } from "/assets/custom-config";
import { RouterRounded } from "@mui/icons-material";

const PaymentSteps = () => {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [creditCardInformation, setCreditCardInformation] = useState(undefined);
  const [inquiryInformations, setInquiryInformations] = useState();
  const [quotePolicy, setQuotePolicy] = useState();
  const [hasSecurityPayment, setHasSecurityPayment] = useState(undefined);
  const [ticket, setTicket] = useState({ success: false });
  const [ticketFlag, setTicketFlag] = useState(false);
  const [loader, setLoader] = useState(true);
  const [alert, setAlert] = useState({ severity: undefined, message: "" });

  const [request, setRequest] = useState();

  //Authorization için token çekiyoruz.
  useEffect(async () => {
    if (token == "") {
      await getNewToken().then((res) => setToken(res));
    }
  }, []);

  //Token Bilgisi geldiğinde user information'ı getiriyoruz.
  useEffect(() => {
    //ödeme için user bilgilerini getiriyoruz.
    if (token && JSON.parse(localStorage.getItem("inquiryInformations"))) {
      const inquiryInformations = JSON.parse(localStorage.getItem("inquiryInformations"));
      setInquiryInformations(inquiryInformations);
    }
  }, [token]);

  //inquiryInformations bilgisi geldiğinde quotePolicy'i getiriyoruz.
  useEffect(() => {
    if (inquiryInformations) {
      let quotePolicy = JSON.parse(localStorage.getItem("quotePolicy"));
      if (quotePolicy) {
        setQuotePolicy(quotePolicy);
      }
    }
  }, [inquiryInformations]);

  //Sigorta şirketinin 3D ödeme sistemi olup olmadığının kontrolü.
  useEffect(async () => {
    if (quotePolicy) {
      await hasSecurityPaymentSystem();
    }
  }, [quotePolicy]);

  //Sigorta şirketinin 3D ödeme sistemi varsa iframe url'i getiriyoruz.
  useEffect(() => {
    if (hasSecurityPayment) {
      securityPaymentControl();
    }
  }, [hasSecurityPayment]);

  //Mobile Express ödeme için ticket geldi ise redirect url'e yönlendirme yapıyoruz.
  useEffect(async () => {
    if (ticket && ticket.redirectURL) {
      console.log("ticket: ", ticket);
      localStorage.setItem("ticket", JSON.stringify(ticket));
      router.push(ticket.redirectURL);

      //setLoader(false);
    }
  }, [ticket]);

  //Ödemeyi Onayla butonuna basılıp ödeme bilgileri geldikten sonra ödeme işlemlerini başlatıyoruz.
  useEffect(() => {
    if (creditCardInformation) {
      //Eğer company 3d ödeme servisi varsa formu onayladıktan sonra öncelikle getPaymentTicket ile doğrulama ekranına yönlendirmemiz gerekiyor
      //Ticket getirme işlemi başarısız olmuşsa ticket'a null değeri atanıyor.
      if (hasSecurityPayment.hasSecurityPayment && ticketFlag != false) {
        getPaymentTicket();
      } else {
        completePayment2D();
      }
    }
  }, [creditCardInformation]);

  //Sigorta şirketinin 3d secure'e sahip olup olmadığının kontrolü
  const hasSecurityPaymentSystem = async () => {
    setLoader(true);

    let postUrl = "";

    switch (quotePolicy.service.toString()) {
      case "casco":
        postUrl = "/api/policy/v1/casco/getcascohassecuritypaymentsystem";
        break;
      case "traffic":
        postUrl = "/api/policy/v1/traffic/gettraffichassecuritypaymentsystem";
        break;
      case "tss":
        postUrl = "/api/policy/v1/tss/gettsshassecuritypaymentsystem";
        break;
      case "travel":
        postUrl = "/api/policy/v1/travel/gettravelhassecuritypaymentsystem";
        break;
      case "dask":
        postUrl = "/api/policy/v1/dask/getdaskhassecuritypaymentsystem";
        break;
      case "personelaccident":
        postUrl = "/api/policy/v1/personelaccident/getpersonelaccidenthassecuritypaymentsystem";
        break;
    }

    const bodyData = {
      companyCode: Number(quotePolicy.companyCode),
    };

    await axios
      .post(postUrl, bodyData, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        //{hasSecurityPayment: true, isInternalPayment: false}
        console.log("has payment secure: ", res.data.data);
        if (!res.data.success) {
          setLoader(false);
        }
        setHasSecurityPayment(res.data.data);
      })
      .catch((error) => {
        writeResponseError(error);
        setHasSecurityPayment(false);
        setLoader(false);
      });
  };

  //hasSecurityPaymentSystem metodunun sonucuna göre yapılıcak aksiyonlar
  const securityPaymentControl = async () => {
    //{hasSecurityPayment: true, isInternalPayment: false}
    if (hasSecurityPayment) {
      if (hasSecurityPayment.hasSecurityPayment) {
        if (!hasSecurityPayment.isInternalPayment) {
          //InternalPayment false ise company'e ait iframe formunu çekmek için getTicket methodunu çalıştırıyoruz.
          await getPaymentTicket();
        } else {
          //InternalPayment true ise kendi yapmış olduğumuz form üzerinden kredi kartı bilgilerini çekiyoruz.
          setLoader(false);
        }
      } else {
        setLoader(false);
      }
    } else {
      //hasSecurityPayment methodunda herhangi bir hata meydana gelmiş ise
      setLoader(false);
    }
  };

  //3D ödeme için gerekli bilgileri getiriyoruz.
  const getPaymentTicket = async () => {
    let postUrl = "";
    switch (quotePolicy.service.toString()) {
      case "casco":
        postUrl = "/api/policy/v1/casco/getcascopaymentticket";
        break;
      case "traffic":
        postUrl = "/api/policy/v1/traffic/gettrafficpaymentticket";
        break;
      case "tss":
        postUrl = "/api/policy/v1/tss/gettsspaymentticket";
        break;
      case "travel":
        postUrl = "/api/policy/v1/travel/gettravelpaymentticket";
        break;
      case "dask":
        postUrl = "/api/policy/v1/dask/getdaskpaymentticket";
        break;
      case "personelaccident":
        postUrl = "/api/policy/v1/personelaccident/getpersonelaccidentpaymentticket";
        break;
    }

    const bodyData = {
      companyCode: Number(quotePolicy.companyCode), //########
      card: {
        type: 0,
        owner: "string",
        number: "string",
        cvv: "string",
        expiryMonth: 0,
        expiryYear: 0,
      },
      quote: {
        quoteReference: quotePolicy.quoteReference ? quotePolicy.quoteReference.toString() : null, //########
        revisionNumber: quotePolicy.revisionNumber ? quotePolicy.revisionNumber.toString() : null, //########
      },
      insured: inquiryInformations.insured,
      installment: 1, //########
      totalAmount: Number(quotePolicy.brutPrim), //
      returnURL:
        window.location.href.substring(0, window.location.href.indexOf("/", 10)) +
        "/payment/result",
    };

    //Internal Payment True ise kendi formumuz üzerinden kredi kartı bilgilerini alıyoruz.
    if (hasSecurityPayment.isInternalPayment) {
      bodyData = {
        companyCode: Number(quotePolicy.companyCode), //########
        card: {
          type: getCreditCardType(
            creditCardInformation.creditCardNumber.toString().replaceAll(" ", "")
          ),
          owner: creditCardInformation.userName,
          number: creditCardInformation.creditCardNumber.toString().replaceAll(" ", ""),
          cvv: creditCardInformation.securityCode.toString(),
          expiryMonth: Number(creditCardInformation.expirationdate.substring(0, 2)),
          expiryYear: Number("20" + creditCardInformation.expirationdate.substring(3, 5)),
        },
        quote: {
          quoteReference: quotePolicy.quoteReference ? quotePolicy.quoteReference.toString() : null, //########
          revisionNumber: quotePolicy.revisionNumber ? quotePolicy.revisionNumber.toString() : null, //########
        },
        insured: inquiryInformations.insured,
        installment: 1,
        totalAmount: Number(quotePolicy.brutPrim),
        returnURL: "string",
      };
    }

    setRequest(bodyData);
    console.log("Gönderilen Request Ticket: ", JSON.stringify(bodyData));

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
          setTicket(res.data.data);
        } else {
          setTicketFlag(false);
          setLoader(false);
        }
      })
      .catch((error) => {
        writeResponseError(error);
        setTicketFlag(false);
        setLoader(false);
      });
  };

  const completePayment2D = async () => {
    setLoader(true);

    let postUrl = "";
    switch (quotePolicy.service.toString()) {
      case "casco":
        postUrl = "/api/policy/v1/casco/getcascopolicy";
        break;
      case "traffic":
        postUrl = "/api/policy/v1/traffic/gettrafficpolicy";
        break;
      case "tss":
        postUrl = "/api/policy/v1/tss/gettsspolicy";
        break;
      case "travel":
        postUrl = "/api/policy/v1/travel/gettravelpolicy";
        break;
      case "dask":
        postUrl = "/api/policy/v1/dask/getdaskpolicy";
        break;
      case "personelaccident":
        postUrl = "/api/policy/v1/personelaccident/getpersonelaccidentpolicy";
        break;
    }

    let inquiryInformationsData = inquiryInformations;
    inquiryInformationsData.companyCode = Number(quotePolicy.companyCode);

    const bodyData = {
      companyCode: Number(quotePolicy.companyCode), //########
      card: {
        type: getCreditCardType(
          creditCardInformation.creditCardNumber.toString().replaceAll(" ", "")
        ),
        owner: creditCardInformation.userName,
        number: creditCardInformation.creditCardNumber.toString().replaceAll(" ", ""),
        cvv: creditCardInformation.securityCode.toString(),
        expiryMonth: Number(creditCardInformation.expirationdate.substring(0, 2)),
        expiryYear: Number("20" + creditCardInformation.expirationdate.substring(3, 5)),
      },
      quote: {
        quoteReference: quotePolicy.quoteReference ? quotePolicy.quoteReference.toString() : null, //########
        revisionNumber: quotePolicy.revisionNumber ? quotePolicy.revisionNumber.toString() : null, //########
      },
      quoteParameters: inquiryInformationsData,
      payment3DInfo: {
        isPay3dPost: false,
        orderNo: "string",
        mobilexpressID: "string",
      },
      installment: 1, //########
    };

    console.log("Gönderilen Request 2D: ", JSON.stringify(bodyData));

    await axios
      .post(postUrl, bodyData, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        setLoader(false);

        if (res.data.success) {
          router.push("/payment/result?paymentTwoCheckStatus=" + true);
        } else {
          setAlert({
            ...alert,
            severity: "error",
            message: "Ödeme işlemlerinde bir hata oluştu lütfen daha sonra tekrar deneyiniz.",
          });
        }

        console.log("Get Casco Policy: ", res);
      })
      .catch((error) => {
        setLoader(false);
        writeResponseError(error);
        setAlert({
          ...alert,
          severity: "error",
          message: "Ödeme işlemlerinde bir hata oluştu lütfen daha sonra tekrar deneyiniz.",
        });
      });
  };

  return (
    <section>
      {/**Daini Mürtehin Ekleme Pop-up*/}
      <DefineMortgage id="mortgageModal" />
      {loader ? (
        <PagePreLoader />
      ) : (
        <div className="container" style={{ marginTop: "100px" }}>
          {/*Stepper Start*/}
          <Stepper
            steps={["Teminat Detayları", "Bilgi Doğrulama", "Ödeme Ekranı"]}
            activeStep={3}
            style={{ marginTop: "100px" }}
          />
          <div className="row offer-details custom-content-body mb-5">
            <div className="col-12">
              <h3 className="mt-3 font-weight-bold text-center"> ÖDEME BİLGİLERİ</h3>
            </div>

            {alert.message && alert.severity && (
              <div className="d-flex justify-content-center w-100">
                <Alert severity={alert.severity} className="" style={{ fontSize: "11pt" }}>
                  {alert.message}
                </Alert>
              </div>
            )}

            {/* {JSON.stringify(request)} */}
            {hasSecurityPayment == false ||
              (hasSecurityPayment && ticketFlag == false && (
                <div className="col-12 mt-5 mb-5">
                  {/* Kredi Kart Bilgi Girişi */}
                  <div className="row">
                    <div className="col-12">
                      <CreditCard
                        params={router.query}
                        onChange={(value) => {
                          setCreditCardInformation(value);
                        }}
                      ></CreditCard>
                    </div>
                  </div>

                  {/* Taksit Seçenekleri */}
                  <div className="row mt-4 justify-content-end">
                    <div className="col-12 col-md-6 col-lg-6 p-0">
                      <div className="accordion faq mx-auto" id="accordionExample">
                        <div className="card">
                          <div className="card-header" id="headingTwo">
                            <h6
                              className="mb-0 faq_head collapsed"
                              data-toggle="collapse"
                              data-target="#collapseTwo"
                              aria-expanded="false"
                              aria-controls="collapseTwo"
                            >
                              Taksit Seçenekleri
                            </h6>
                          </div>
                          <div
                            id="collapseTwo"
                            className="collapse"
                            aria-labelledby="headingTwo"
                            data-parent="#accordionExample"
                          >
                            <div className="card-body">
                              <InstallmentOptions></InstallmentOptions>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rehin Alacaklı */}
                  <div className="row mt-5 d-flex" style={{ justifyContent: "end" }}>
                    <div className="col-12 col-md-6 col-lg-6">
                      <button
                        className="btn-main-outline btn-large w-100"
                        data-toggle="modal"
                        data-target="#mortgageModal"
                      >
                        REHİN ALACAKLI TANIMLA
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            {/* 
                {hasSecurityPayment && ticket && ticket.RedirectURL && (
                  <div className="col-12 mb-5 mt-4">
                    <iframe
                      src={ticket.RedirectURL}
                      title="W3Schools Free Online Web Tutorials"
                      style={{
                        width: "100%",
                        height: "700px",
                        border: "none",
                        boxShadow:
                          "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                      }}
                    ></iframe>
                  </div>
                )} */}
          </div>
        </div>
      )}
    </section>
  );
};

export default PaymentSteps;
