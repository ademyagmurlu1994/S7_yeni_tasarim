/*
https://unmanner.github.io/imaskjs/
*/
//Birden fazla mask yapılmaması için mask yapılan inputları diziye atıp kontrollerini sağlıyoruz.
let inputList = [];
let path = window.location.pathname;

setInterval(() => {
  //path değiştiğinde uygulanan mask kaybolduğundan Input id  dizisini sıfrlamak gerekiyor.
  if (window.location.pathname != path) {
    inputList = [];
    path = window.location.pathname;
  }

  //Phone Number
  const phoneMaskInputs = document.querySelectorAll("input[type=tel]");
  if (phoneMaskInputs) {
    const masksOptions = {
      phone: {
        mask: "(000) 000 00 00",
      },
    };

    for (const item of phoneMaskInputs) {
      if (inputList.indexOf(item) == -1) {
        inputList.push(item);
        new IMask(item, masksOptions.phone);
      }
    }
  }

  //Number MaxLength
  const numberMaskInputs = document.querySelectorAll("input[type=number]");
  if (numberMaskInputs) {
    for (const item of numberMaskInputs) {
      if (inputList.indexOf(item) == -1) {
        inputList.push(item);

        const maxLength = item.getAttribute("maxLength");
        if (maxLength) {
          let pattern = new RegExp("^[0-9]\\d{0," + (maxLength - 1).toString() + "}$");
          new IMask(item, {
            mask: pattern,
          });
        }
      }
    }
  }

  //Mui TextField MaxLength
  const numberMaskTextFieldInputs = document.querySelectorAll("div[maxLength]");

  if (numberMaskTextFieldInputs) {
    for (const item of numberMaskTextFieldInputs) {
      if (inputList.indexOf(item) == -1) {
        inputList.push(item);

        let maxLength = Number(item.getAttribute("maxLength"));
        let inputItem = item.querySelectorAll("input[type=number]")[0];
        if (maxLength && inputItem) {
          let pattern = new RegExp("^[0-9]\\d{0," + (maxLength - 1).toString() + "}$");
          new IMask(inputItem, {
            mask: pattern,
          });
        }
      }
    }
  }

  //Plate
  var plateInputs = document.getElementsByClassName("plate");
  if (plateInputs && plateInputs.length) {
    Array.prototype.forEach.call(plateInputs, function (item) {
      if (inputList.indexOf(item) == -1) {
        inputList.push(item);
        new IMask(item, {
          mask: [
            {
              mask: "00 aaa 000",
            },
            {
              mask: "00 aa 0000",
            },
            {
              mask: "00 a 00000",
            },
          ],
          placeholder: {
            show: "always",
          },
          lazy: true, //out masklenmiş biçimde döndürme
        });
      }
    });
  }

  //Only Letter
  var onlyLetterInputs = document.getElementsByClassName("only-letter");
  Array.prototype.forEach.call(onlyLetterInputs, function (item) {
    if (inputList.indexOf(item) == -1) {
      inputList.push(item);
      new IMask(item, {
        mask: /^[a-zA-ZğüşıöçĞÜŞİÖÇ ]+$/,
      });
    }
  });

  //Date
  const dateMaskInputs = document.querySelectorAll(".date-mask");
  if (dateMaskInputs) {
    for (const item of dateMaskInputs) {
      if (inputList.indexOf(item) == -1) {
        inputList.push(item);

        const minDate = item.getAttribute("min") && item.getAttribute("min").split("-");
        const maxDate = item.getAttribute("max") && item.getAttribute("max").split("-");
        new IMask(item, {
          mask: Date,
          min: minDate
            ? new Date(Number(minDate[0]), Number(minDate[1]) - 1, Number(minDate[2]))
            : new Date(1000, 1, 0),
          max: maxDate
            ? new Date(Number(maxDate[0]), Number(maxDate[1]) - 1, Number(maxDate[2]))
            : new Date(1000, 1, 0),
          lazy: false,
        });
        item.value = "";
      }
    }
  }
}, 2000);
