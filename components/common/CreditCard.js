import React from "react";
import Link from "next/link";
import { logo } from "../../resources/images";
import { useForm } from "react-hook-form";
import axios from "/instances/axios";
import { useRouter } from "next/router";

//Componentler
import InstallmentOptions from "/components/common/InstallmentOptions";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";

//functionlar
import {
  isValidRegex,
  isValidCreditCard,
  turkishToUpper,
  getClientIpAdress,
  getCreditCardType,
  writeResponseError,
  getNewToken,
} from "/functions/common";
import { useState, useEffect } from "react";

const CreditCard = ({ params, onChange, value }) => {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const { quoteReference, revisionNumber, companyCode, service, CustomerName, brutPrim } =
    router.query;

  const [state, setState] = useState({
    userName: "",
    creditCardNumber: "",
    expirationdate: "",
    securityCode: "",
    ip: "",
    token: "",
    phoneNumber: "",
    email: "",
    fetchingResult: false,
    response: "",
    request: "",
    responseError: "",
    threeDSecureChecked: false,
  });

  const [userInformation, setUserInformation] = useState();

  useEffect(() => {
    //Authorization için token çekiyoruz.
    if (state.token.length == 0) {
      getToken();
    }

    if (JSON.parse(localStorage.getItem("inquiryInformations"))) {
      const inquiryInformationData = JSON.parse(localStorage.getItem("inquiryInformations"));
      setUserInformation(inquiryInformationData.insured);
    }
  }, []);

  useEffect(() => {
    if (state.threeDSecureChecked) {
      getTreeDMobileExpressPaymentLink();
    }
  }, [state.threeDSecureChecked]);

  const getTreeDMobileExpressPaymentLink = () => {};

  const onCompletePayment = async (data) => {
    //Buton basıldığında button loading'i aktifleştiriyoruz.
    /*console.log(data);*/

    onChange(data);

    //   setTimeout(() => {
    //     setState({ ...state, fetchingResult: true, responseError: "" });
    //   }, 1);

    //   console.log("User bilgileri", userInformation);
    //   const bodyData = {
    //     companyCode: Number(params.companyCode),
    //     card: {
    //       type: getCreditCardType(state.creditCardNumber.toString().replaceAll(" ", "")),
    //       owner: state.userName,
    //       number: state.creditCardNumber.toString().replaceAll(" ", ""),
    //       cvv: state.securityCode.toString(),
    //       expiryMonth: Number(state.expirationdate.substring(0, 2)),
    //       expiryYear: Number("20" + state.expirationdate.substring(3, 5)),
    //     },
    //     policy: {
    //       quoteReference: params.quoteReference,
    //       revisionNumber: params.revisionNumber,
    //     },
    //     contact: {
    //       phone: userInformation.contact.mobilePhone,
    //       email: userInformation.contact.email,
    //     },
    //     payment3DInfo: {
    //       isPay3dPost: false,
    //       orderNo: "string",
    //     },
    //     installment: 1,
    //   };

    //   console.log("Gönderilen Request: ", bodyData);

    //   setState({ ...state, request: bodyData });

    //   let service = params.service;
    //   let postUrl = "";
    //   if (service == "casco") {
    //     postUrl = "/api/policy/v1/Casco/getcascopolicy";
    //   } else if (service == "traffic") {
    //     postUrl = "/api/policy/v1/Traffic/gettrafficpolicy";
    //   } else if (service == "health") {
    //     postUrl = "/api/policy/v1/Health/gethealthpolicy";
    //   }

    //   await axios
    //     .post(postUrl, bodyData, {
    //       headers: {
    //         Authorization: state.token,
    //         "Content-Type": "application/json",
    //         Accept: "application/json",
    //       },
    //     })
    //     .then((res) => {
    //       setState({ ...state, fetchingResult: false });

    //       console.log("Payment Response: ", res);
    //       let resultSuccess = undefined;

    //       if (res.data.success) {
    //         resultSuccess = true;
    //       } else {
    //         resultSuccess = false;
    //       }
    //       console.log("status=", resultSuccess);

    //       router.push(
    //         "/policy-steps/result?status=" +
    //           resultSuccess +
    //           "&quoteReference=" +
    //           quoteReference +
    //           "&revisionNumber=" +
    //           revisionNumber +
    //           "&companyCode=" +
    //           companyCode +
    //           "&service=" +
    //           service
    //       );
    //     })
    //     .catch((error) => {
    //       setState({ ...state, fetchingResult: false });
    //       writeResponseError(error);
    //       setState({
    //         ...state,
    //         responseError: "Üzgünüz bir hata oluştu. Daha sonra tekrar deneyiniz.",
    //       });
    //       //router.push("/policy-steps/result?status=false");
    //     });
  };

  const getToken = async () => {
    const response = await getNewToken();
    setState({ ...state, token: response });
  };

  const onlyText = (e) => {
    //console.log(e);
    let str = e.target.value.toString();

    if (isValidRegex(str[str.length - 1], "^[a-zA-ZğüşıöçĞÜŞİÖÇ ]+$")) {
      setState({ ...state, userName: turkishToUpper(str) });
    } else if (state.userName.length == 1) {
      setState({ ...state, userName: "" });
    } else {
      //console.log(e.target.value);
      document.getElementById("name").value = "asdasdasd";
      console.log(document.getElementById("name").value);
      console.log("geçersiz");
    }
  };

  const onChangeCreditCardNumber = (e) => {
    setState({ ...state, creditCardNumber: e.target.value });
  };

  const onPasteCreditCardNumber = (e) => {
    //State'in değişmesi için SetTimeout'un içine alıyoruz.
    setTimeout(() => {
      setState({ ...state, creditCardNumber: e.target.value });
    }, 100);
  };

  const ColorButton = styled(LoadingButton)(({ theme }) => ({
    color: "white",
    backgroundColor: "var(--main-color)",
    fontSize: "12pt",
    fontWeight: "500",
    border: "2px solid var(--main-color)",
    "&:hover": {
      color: "var(--main-color)",
      backgroundColor: "white",
    },
  }));

  return (
    <>
      <div
        className="payment-creditcard"
        //</> value={value}
      >
        <div className="row">
          <div className="col-12 col-md-6 col-lg-6 d-none d-md-block">
            <div className="container preload">
              <div className="creditcard">
                <div className="front">
                  <div id="ccsingle"></div>
                  <svg
                    version="1.1"
                    id="cardfront"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 750 471"
                    style={{ enableBackground: "new 0 0 750 471" }}
                    xmlSpace="preserve"
                  >
                    <g id="Front">
                      <g id="CardBackground">
                        <g id="Page-1_1_">
                          <g id="amex_1_">
                            <path
                              id="Rectangle-1_1_"
                              className="lightcolor grey"
                              d="M40,0h670c22.1,0,40,17.9,40,40v391c0,22.1-17.9,40-40,40H40c-22.1,0-40-17.9-40-40V40
                    C0,17.9,17.9,0,40,0z"
                            />
                          </g>
                        </g>
                        <path
                          className="darkcolor greydark"
                          d="M750,431V193.2c-217.6-57.5-556.4-13.5-750,24.9V431c0,22.1,17.9,40,40,40h670C732.1,471,750,453.1,750,431z"
                        />
                      </g>
                      <text
                        transform="matrix(1 0 0 1 60.106 295.0121)"
                        id="svgnumber"
                        className="st2 st3 st4"
                      >
                        0123 4567 8910 1112
                      </text>
                      <text
                        transform="matrix(1 0 0 1 54.1064 428.1723)"
                        id="svgname"
                        className="st2 st5 st6"
                      >
                        AD VE SOYAD
                      </text>
                      <text transform="matrix(1 0 0 1 54.1074 389.8793)" className="st7 st5 st8">
                        Kart üzerindeki Ad ve SOYAD
                      </text>
                      <text transform="matrix(1 0 0 1 479.7754 388.8793)" className="st7 st5 st8">
                        Son Kullanma
                      </text>
                      <text transform="matrix(1 0 0 1 65.1054 241.5)" className="st7 st5 st8">
                        Kart Numarası
                      </text>
                      <g>
                        <text
                          transform="matrix(1 0 0 1 574.4219 433.8095)"
                          id="svgexpire"
                          className="st2 st5 st9"
                        >
                          01/23
                        </text>
                        <text
                          transform="matrix(1 0 0 1 479.3848 417.0097)"
                          className="st2 st10 st11"
                        >
                          VALID
                        </text>
                        <text
                          transform="matrix(1 0 0 1 479.3848 435.6762)"
                          className="st2 st10 st11"
                        >
                          THRU
                        </text>
                        <polygon className="st2" points="554.5,421 540.4,414.2 540.4,427.9 		" />
                      </g>
                      <g id="cchip">
                        <g>
                          <path
                            className="st2"
                            d="M168.1,143.6H82.9c-10.2,0-18.5-8.3-18.5-18.5V74.9c0-10.2,8.3-18.5,18.5-18.5h85.3
                c10.2,0,18.5,8.3,18.5,18.5v50.2C186.6,135.3,178.3,143.6,168.1,143.6z"
                          />
                        </g>
                        <g>
                          <g>
                            <rect x="82" y="70" className="st12" width="1.5" height="60" />
                          </g>
                          <g>
                            <rect x="167.4" y="70" className="st12" width="1.5" height="60" />
                          </g>
                          <g>
                            <path
                              className="st12"
                              d="M125.5,130.8c-10.2,0-18.5-8.3-18.5-18.5c0-4.6,1.7-8.9,4.7-12.3c-3-3.4-4.7-7.7-4.7-12.3
                    c0-10.2,8.3-18.5,18.5-18.5s18.5,8.3,18.5,18.5c0,4.6-1.7,8.9-4.7,12.3c3,3.4,4.7,7.7,4.7,12.3
                    C143.9,122.5,135.7,130.8,125.5,130.8z M125.5,70.8c-9.3,0-16.9,7.6-16.9,16.9c0,4.4,1.7,8.6,4.8,11.8l0.5,0.5l-0.5,0.5
                    c-3.1,3.2-4.8,7.4-4.8,11.8c0,9.3,7.6,16.9,16.9,16.9s16.9-7.6,16.9-16.9c0-4.4-1.7-8.6-4.8-11.8l-0.5-0.5l0.5-0.5
                    c3.1-3.2,4.8-7.4,4.8-11.8C142.4,78.4,134.8,70.8,125.5,70.8z"
                            />
                          </g>
                          <g>
                            <rect x="82.8" y="82.1" className="st12" width="25.8" height="1.5" />
                          </g>
                          <g>
                            <rect x="82.8" y="117.9" className="st12" width="26.1" height="1.5" />
                          </g>
                          <g>
                            <rect x="142.4" y="82.1" className="st12" width="25.8" height="1.5" />
                          </g>
                          <g>
                            <rect x="142" y="117.9" className="st12" width="26.2" height="1.5" />
                          </g>
                        </g>
                      </g>
                    </g>
                    <g id="Back"></g>
                  </svg>
                </div>
                <div className="back">
                  <svg
                    version="1.1"
                    id="cardback"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 750 471"
                    style={{ enableBackground: "new 0 0 750 471" }}
                    xmlSpace="preserve"
                  >
                    <g id="Front">
                      <line className="st0" x1="35.3" y1="10.4" x2="36.7" y2="11" />
                    </g>
                    <g id="Back">
                      <g id="Page-1_2_">
                        <g id="amex_2_">
                          <path
                            id="Rectangle-1_2_"
                            className="darkcolor greydark"
                            d="M40,0h670c22.1,0,40,17.9,40,40v391c0,22.1-17.9,40-40,40H40c-22.1,0-40-17.9-40-40V40
                C0,17.9,17.9,0,40,0z"
                          />
                        </g>
                      </g>
                      <rect y="61.6" className="st2" width="750" height="78" />
                      <g>
                        <path
                          className="st3"
                          d="M701.1,249.1H48.9c-3.3,0-6-2.7-6-6v-52.5c0-3.3,2.7-6,6-6h652.1c3.3,0,6,2.7,6,6v52.5
            C707.1,246.4,704.4,249.1,701.1,249.1z"
                        />
                        <rect x="42.9" y="198.6" className="st4" width="664.1" height="10.5" />
                        <rect x="42.9" y="224.5" className="st4" width="664.1" height="10.5" />
                        <path
                          className="st5"
                          d="M701.1,184.6H618h-8h-10v64.5h10h8h83.1c3.3,0,6-2.7,6-6v-52.5C707.1,187.3,704.4,184.6,701.1,184.6z"
                        />
                      </g>
                      <text
                        transform="matrix(1 0 0 1 621.999 227.2734)"
                        id="svgsecurity"
                        className="st6 st7"
                      >
                        985
                      </text>
                      <g className="st8">
                        <text transform="matrix(1 0 0 1 518.083 280.0879)" className="st9 st6 st10">
                          Güvenlik Kodu
                        </text>
                      </g>
                      <rect x="58.1" y="378.6" className="st11" width="375.5" height="13.5" />
                      <rect x="58.1" y="405.6" className="st11" width="421.7" height="13.5" />
                      <text
                        transform="matrix(1 0 0 1 59.5073 228.6099)"
                        id="svgnameback"
                        className="st12 st13"
                      >
                        AD SOYAD
                      </text>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-6">
            <form onSubmit={handleSubmit(onCompletePayment)}>
              <div className="form-container">
                {state.responseError && (
                  <div className="row mb-4">
                    <div className="col-12">
                      <Alert severity="error" className="" style={{ fontSize: "11pt" }}>
                        {state.responseError}
                      </Alert>
                    </div>
                  </div>
                )}

                <div className="row">
                  <div className="col-12">
                    <div className="field-container">
                      <label htmlFor="name">Ad ve SOYAD</label>
                      <input
                        id="name"
                        maxLength="20"
                        type="text"
                        className={`form-control large-input ${errors.userName && "invalid"}`}
                        {...register("userName", {
                          required: "Ad ve Soyad alanı zorunlu",
                        })}
                        value={state.userName}
                        onChange={(e) => {
                          //onlyText(e);
                          setState({ ...state, userName: e.target.value });
                          clearErrors("userName");
                        }}
                      />

                      <small className="text-danger">{errors["userName"]?.message}</small>
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="field-container">
                      <label htmlFor="cardnumber">Kart Numarası</label>
                      <span id="generatecard" style={{ display: "none" }}>
                        {/*generate random*/}
                      </span>
                      <input
                        id="cardnumber"
                        type="text"
                        inputMode="numeric"
                        className={`form-control large-input ${
                          errors.creditCardNumber && "invalid"
                        }`}
                        {...register("creditCardNumber", {
                          required: "Kredi Kart Numarası alanı zorunlu",
                          validate: isValidCreditCard,
                        })}
                        value={state.creditCardNumber}
                        onChange={(e) => {
                          onChangeCreditCardNumber(e);
                          clearErrors("creditCardNumber");
                        }}
                        onPaste={(e) => onPasteCreditCardNumber(e)}
                      />

                      <small className="text-danger">
                        {errors["creditCardNumber"]?.message}
                        {/**Validate Message */}
                        {errors.creditCardNumber
                          ? errors.creditCardNumber.type == "validate"
                            ? "Geçersiz Kredi Kart Numarası"
                            : ""
                          : ""}
                      </small>

                      <svg
                        id="ccicon"
                        className="ccicon"
                        width="750"
                        height="471"
                        viewBox="0 0 750 471"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                      ></svg>
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-6">
                    <div className="field-container">
                      <label htmlFor="expirationdate">Son Kullanma Tarihi (mm/yy)</label>
                      <input
                        id="expirationdate"
                        type="text"
                        inputMode="numeric"
                        className={`form-control large-input ${errors.expirationdate && "invalid"}`}
                        {...register("expirationdate", {
                          required: "Son Kullanma Tarihi alanı zorunlu",
                          minLength: {
                            value: 5,
                            message: "Geçersiz Son Kullanma Tarihi",
                          },
                        })}
                        value={state.expirationdate}
                        onChange={(e) => {
                          setState({ ...state, expirationdate: e.target.value });
                          clearErrors("expirationdate");
                        }}
                      />

                      <small className="text-danger">{errors["expirationdate"]?.message}</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="field-container">
                      <label htmlFor="securitycode">Güvenlik Kodu</label>
                      <input
                        id="securitycode"
                        type="text"
                        inputMode="numeric"
                        className={`form-control large-input ${errors.securityCode && "invalid"}`}
                        {...register("securityCode", {
                          required: "Güvenlik Kodu alanı zorunlu",
                          minLength: {
                            value: 3,
                            message: "Geçersiz Güvenlik Kodu",
                          },
                        })}
                        value={state.securityCode}
                        onChange={(e) => {
                          setState({ ...state, securityCode: e.target.value });
                          clearErrors("securityCode");
                        }}
                      />

                      <small className="text-danger">{errors["securityCode"]?.message}</small>
                    </div>
                  </div>
                </div>

                <ColorButton
                  type="submit"
                  //loading={state.fetchingResult}
                  //loadingPosition="end"
                  variant="contained"
                  className="btn-large mt-4 w-100"
                >
                  ÖDEMEYİ ONAYLA
                </ColorButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreditCard;
