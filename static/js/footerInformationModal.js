let informationModals = document.getElementsByClassName("information-modal");

console.log(informationModals);
Array.prototype.forEach.call(informationModals, (informationModal) => {
  // Get the modal
  //var modal = document.getElementById("myModal");
  // Get the button that opens the modal
  var btn = document.querySelectorAll('[data-target="#' + informationModal.id + '"]')[0];
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  btn.onclick = function () {
    informationModal.style.display = "block";
  };

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    informationModal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == informationModal) {
      informationModal.style.display = "none";
    }
  };
});
