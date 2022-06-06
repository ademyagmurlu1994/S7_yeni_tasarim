/*Form date input max min tarihleri bugününü tarihi olarak ayarlanmasını sağlamak için yapıldı*/
function loopFunction(delay, callback) {
  var loop = function () {
    callback();
    setTimeout(loop, delay);
  };
  loop();
}

loopFunction(1000, function () {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  today = yyyy + "-" + mm + "-" + dd;

  var maxTodayDateInputs = document.getElementsByClassName("max-date-today");
  for (var i = 0; i < maxTodayDateInputs.length; i++) {
    maxTodayDateInputs[i].setAttribute("max", today);
  }

  var minTodayDateInputs = document.getElementsByClassName(".min-date-today");
  for (var i = 0; i < minTodayDateInputs.length; i++) {
    minTodayDateInputs[i].setAttribute("min", today);
  }
});

//Mobil görünümde herhangi bir linke tıklandığında navbarı kapatma
if (!window.matchMedia("(min-width: 992px)").matches) {
  // const navbarToggle = document.getElementsByClassName("navbar-toggler")[0];
  // const navLinks = document.querySelectorAll(".nav-item");
  // navLinks.push(document.querySelectorAll(".dropdown-item"));
  // navLinks.forEach((l) => {
  //   l.addEventListener("click", () => {
  //     navbarToggle.click();
  //   });
  // });

  const links = document.getElementsByTagName("a");
  const navbarNav = document.getElementById("navbarNav");

  for (const link of links) {
    link.addEventListener("click", () => {
      navbarNav.classList.remove("show");
    });
  }
}

//Sonsuz Döngü
setInterval(function () {
  //İnput Text UpperCase Kontrolü yapma////
  var upperTextInputs = document.getElementsByClassName("uppercase");
  for (var i = 0; i < upperTextInputs.length; i++) {
    upperTextInputs[i].addEventListener("keyup", function (event) {
      //Türkçe Karakter Sorununu Çözme
      var string = this.value;
      var letters = { i: "İ", ş: "Ş", ğ: "Ğ", ü: "Ü", ö: "Ö", ç: "Ç", ı: "I" };
      string = string.replace(/(([iışğüçö]))/g, function (letter) {
        return letters[letter];
      });
      //İmleci Kaldığı yere getirme
      var start = this.selectionStart;
      var end = this.selectionEnd;
      //Yazıları Büyütme
      this.value = string.toUpperCase();
      this.setSelectionRange(start, end);
      return false;
    });
  }

  //Auto Complete veya içerisinde herhangi bir input bulunan öğenin inputunu readonly yapma
  var readonlyElements = document.getElementsByClassName("readonly");
  for (const element of readonlyElements) {
    let input = element.querySelector("input");
    input.setAttribute("readonly", true);
  }

  //input only text kontrolü
}, 1000);
