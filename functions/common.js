import axios from "/instances/axios";
import defaultAxios from "axios";
import { Base64 } from "js-base64";

export const isValidTcKimlik = (value) => {
  if (value) {
    var tek = 0,
      cift = 0,
      sonuc = 0,
      TCToplam = 0,
      i = 0,
      hatali = [
        11111111110, 22222222220, 33333333330, 44444444440, 55555555550, 66666666660, 7777777770,
        88888888880, 99999999990,
      ];

    if (value.length != 11) return false;
    if (isNaN(value)) return false;
    if (value[0] == 0) return false;

    tek =
      parseInt(value[0]) +
      parseInt(value[2]) +
      parseInt(value[4]) +
      parseInt(value[6]) +
      parseInt(value[8]);
    cift = parseInt(value[1]) + parseInt(value[3]) + parseInt(value[5]) + parseInt(value[7]);

    tek = tek * 7;
    sonuc = Math.abs(tek - cift);
    if (sonuc % 10 != value[9]) return false;

    for (var i = 0; i < 10; i++) {
      TCToplam += parseInt(value[i]);
    }

    if (TCToplam % 10 != value[10]) return false;

    if (hatali.toString().indexOf(value) != -1) return false;

    return true;
  }
};

export const isValidVergiKimlik = (kno) => {
  if (kno.length === 10) {
    let v = [];
    let lastDigit = Number(kno.charAt(9));
    for (let i = 0; i < 9; i++) {
      let tmp = (Number(kno.charAt(i)) + (9 - i)) % 10;
      v[i] = (tmp * 2 ** (9 - i)) % 9;
      if (tmp !== 0 && v[i] === 0) v[i] = 9;
    }
    let sum = v.reduce((a, b) => a + b, 0) % 10;
    return (10 - (sum % 10)) % 10 === lastDigit;
  }
  return false;
};

export const isValidTcKimlikOrVergiKimlik = (value) => {
  if (value.toString().length == 10) {
    return isValidVergiKimlik(value);
  } else if (value.toString().length == 11) {
    return isValidTcKimlik(value);
  } else {
    return false;
  }
};

export const isValidImeiNumber = (value) => {
  var etal = /^[0-9]{15}$/;
  if (!etal.test(value)) return false;
  var sum = 0;
  var mul = 2;
  var l = 14;
  for (var i = 0; i < l; i++) {
    var digit = value.substring(l - i - 1, l - i);
    var tp = parseInt(digit, 10) * mul;
    if (tp >= 10) sum += (tp % 10) + 1;
    else sum += tp;
    if (mul == 1) mul++;
    else mul--;
  }
  var chk = (10 - (sum % 10)) % 10;
  if (chk != parseInt(value.substring(14, 15), 10)) return false;
  return true;
};

export const isValidMaskedDate = (value) => {
  return value.trim().replaceAll("_", "").replaceAll(".", "").length == 8;
};

export const getToken = async () => {
  let body_data = {
    username: "DEMO",
    password: "1234",
  };
  let res = await axios
    .post("/token/new", body_data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    .catch((error) => {
      writeResponseError(error);
    });

  if (res) {
    if (res.data.success) {
      let token = "Bearer " + res.data.data.accessToken.toString();
      return token;
    }
  }
};

export const getNewToken = async () => {
  const d = new Date();
  let hour = d.getHours();

  const tokenData = JSON.parse(localStorage.getItem("tokenDataLocal"));
  if (!tokenData) {
    tokenData = {
      token: "",
      hour: "",
      date: "",
    };
  }

  //1 Saatte bir token güncellemesi yapıyoruz.
  if (tokenData.date != getTodayDate() || tokenData.hour != hour) {
    let token = await getToken().catch((error) => {
      console.log(error);
    });
    if (token) {
      let tokenDataLocal = {
        token: token,
        hour: hour,
        date: getTodayDate(),
      };

      localStorage.setItem("tokenDataLocal", JSON.stringify(tokenDataLocal));
      return token;
    }
  } else {
    return tokenData.token;
  }
};

export const refreshToken = async () => {
  const d = new Date();
  let hour = d.getHours();

  let token = await getToken().catch((error) => {
    console.log(error);
  });

  if (token) {
    let tokenDataLocal = {
      token: token,
      hour: hour,
      date: getTodayDate(),
    };

    localStorage.setItem("tokenDataLocal", JSON.stringify(tokenDataLocal));
  }
};

export const writeResponseError = (error) => {
  if (error.response) {
    // Request made and server responded
    console.log("Error Response:", error.response.data);
    console.log("Status Code:", error.response.status);

    //Eğer 401(Unauthorization) hatası gelirse refresh token yapıp sayfayı yeniliyoruz.
    if (error.response.status == 401) {
      refreshToken();
    }
    console.log("Error Request Header: ", error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    console.log("Error Request", error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error", error.message);
  }
};

export const getTodayDate = () => {
  var todayDate = new Date();
  var dd = todayDate.getDate();
  var mm = todayDate.getMonth() + 1; //January is 0!
  var yyyy = todayDate.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  todayDate = yyyy + "-" + mm + "-" + dd;

  return todayDate;
};
export const getDate = (date) => {
  var todayDate = new Date(date);
  var dd = todayDate.getDate();
  var mm = todayDate.getMonth() + 1; //January is 0!
  var yyyy = todayDate.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  todayDate = yyyy + "-" + mm + "-" + dd;

  return todayDate;
};

export const numberToTrNumber = (number) => {
  let strNumber = Number(number).toString();
  let pointIndex = strNumber.indexOf(".");
  if (pointIndex == -1) {
    pointIndex = strNumber.length;
  }

  let partBeforePoint = strNumber.substring(0, pointIndex);
  let partAfterPoint = strNumber.substring(pointIndex + 1, strNumber.length);

  //Eğer Son hane tek ise 0 ekliyoruz.(Kuruş gösterimi için)
  if (partAfterPoint.length == 1) {
    partAfterPoint += 0;
  }

  //let reverseBeforePart = partBeforePoint.reverse();
  let convertedPartBeforePoint = "";

  var index = 0;
  for (var i = partBeforePoint.length - 1; i >= 0; i--) {
    if (i % 3 == 0 && i != 0) {
      convertedPartBeforePoint += partBeforePoint[index] + ".";
    } else {
      convertedPartBeforePoint += partBeforePoint[index];
    }
    index += 1;
  }

  let result = convertedPartBeforePoint + (partAfterPoint && "," + partAfterPoint);
  return result;
};

//Türkçe karakter uppercase çözümü
export const turkishToUpper = (string) => {
  var letters = { i: "İ", ş: "Ş", ğ: "Ğ", ü: "Ü", ö: "Ö", ç: "Ç", ı: "I" };
  string = string.replace(/(([iışğüçö]))/g, function (letter) {
    return letters[letter];
  });
  return string.toUpperCase();
};

export const capitalize = (word) => {
  word = word.trim();
  const firstLetter = turkishToUpper(word.charAt(0));
  const lower = word.slice(1).toLowerCase();

  return firstLetter + lower;
};

//Regex is Valid
export const isValidRegex = (inputText, regexPattern) => {
  if (inputText) {
    let text = inputText;
    let pattern = new RegExp(regexPattern);
    let result = text.match(pattern);
    if (result) {
      return true;
    }
    return false;
  }
};

export const isValidPhoneNumber = (value) => {
  return isValidRegex(
    value.toString(),
    /^(([\+]90?)|([0]?))([ ]?)((\([0-9]{3}\))|([0-9]{3}))([ ]?)([0-9]{3})(\s*[\-]?)([0-9]{2})(\s*[\-]?)([0-9]{2})$/
  );
};

export const isValidCreditCard = (value) => {
  // Accept only digits, dashes or spaces
  if (/[^0-9-\s]+/.test(value)) return false;

  // The Luhn Algorithm. It's so pretty.
  let nCheck = 0,
    bEven = false;
  value = value.replace(/\D/g, "");

  for (var n = value.length - 1; n >= 0; n--) {
    var cDigit = value.charAt(n),
      nDigit = parseInt(cDigit, 10);

    if (bEven && (nDigit *= 2) > 9) nDigit -= 9;

    nCheck += nDigit;
    bEven = !bEven;
  }

  return nCheck % 10 == 0;
};

export const getClientIpAdress = async () => {
  let clientIpAddress = localStorage.getItem("ClientIpAddress");
  if (clientIpAddress && clientIpAddress != "undefined") {
    return clientIpAddress;
  } else {
    try {
      let res = await defaultAxios.get("https://api.ipify.org?format=json");
      if (res) {
        localStorage.setItem("ClientIpAddress", res.data.ip);
      }
      return res.data.ip;
    } catch (error) {
      writeResponseError(error);
    }
  }
};

export const addDaysToDate = (days, dateVar) => {
  const date = new Date(dateVar);
  date.setDate(date.getDate() + days);

  const day = date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate().toString();
  const month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1).toString()
      : (date.getMonth() + 1).toString();
  const year = date.getFullYear().toString();

  return year + "-" + month + "-" + day;
};

export const getCreditCardType = (cc) => {
  let amex = new RegExp("^3[47][0-9]{13}$");
  let visa = new RegExp("^4[0-9]{12}(?:[0-9]{3})?$");
  let cup1 = new RegExp("^62[0-9]{14}[0-9]*$");
  let cup2 = new RegExp("^81[0-9]{14}[0-9]*$");

  let mastercard = new RegExp("^5[1-5][0-9]{14}$");
  let mastercard2 = new RegExp("^2[2-7][0-9]{14}$");

  let disco1 = new RegExp("^6011[0-9]{12}[0-9]*$");
  let disco2 = new RegExp("^62[24568][0-9]{13}[0-9]*$");
  let disco3 = new RegExp("^6[45][0-9]{14}[0-9]*$");

  let diners = new RegExp("^3[0689][0-9]{12}[0-9]*$");
  let jcb = new RegExp("^35[0-9]{14}[0-9]*$");

  if (visa.test(cc)) {
    return 1; //"VISA"
  }
  if (mastercard.test(cc) || mastercard2.test(cc)) {
    return 2; //"MASTERCARD"
  }
  /*if (disco1.test(cc) || disco2.test(cc) || disco3.test(cc)) {
    return "DISCOVER";
  }
  if (diners.test(cc)) {
    return "DINERS";
  }
  if (jcb.test(cc)) {
    return "JCB";
  }
  if (cup1.test(cc) || cup2.test(cc)) {
    return "CHINA_UNION_PAY";
  }*/
  return undefined;
};

export const base64toBlobFile = (dataURI) => {
  // Cut the prefix `data:application/pdf;base64` from the raw base 64
  let prefix = "data:application/pdf;base64,";
  if (dataURI.startsWith(prefix)) {
    dataURI = dataURI.substring(prefix.length);
  }

  const bytes = Base64.atob(dataURI);
  let length = bytes.length;
  let out = new Uint8Array(length);

  while (length--) {
    out[length] = bytes.charCodeAt(length);
  }

  return new Blob([out], { type: "application/pdf" });
};

export const saveBlobByteArray = (byteArray) => {
  const blob = base64toBlobFile(byteArray);
  const url = window.URL.createObjectURL(blob);
  return url;
};

export const separateLetterAndNumber = (value) => {
  let returnValue = "";
  let lastCharacter = "";
  for (var character of value) {
    if (/^[a-zA-ZğüşıöçĞÜŞİÖÇ]+$/.test(character)) {
      if (/^[0-9]+$/.test(lastCharacter)) {
        returnValue += " ";
      }
      lastCharacter = character;
    } else {
      if (/^[a-zA-ZğüşıöçĞÜŞİÖÇ]+$/.test(lastCharacter)) {
        returnValue += " ";
      }
      lastCharacter = character;
    }

    returnValue += character;
  }
  return returnValue;
};

export const changeDateFormat = (value, outputFormat) => {
  if (value) {
    let pureDate = value.substring(0, 10);
    if (outputFormat == "yyyy-MM-dd") {
      let date = pureDate.split(".");
      return date[2] + "-" + date[1] + "-" + date[0] + "T00:00:00";
    } else if (outputFormat == "dd.MM.yyyy") {
      let date = pureDate.split("-");
      return date[2] + "." + date[1] + "." + date[0];
    }
  }
  return value;
};

export const setLoader = (value) => {
  const dispatch = useDispatch();
  dispatch(setLoading(Boolean(value)));
};
