import React from "react";

import { InternalServerError } from "/resources/images";

function ServerErrorAlert() {
  return (
    <div className="server-error-alert-wrapper">
      <div className="server-error-alert container">
        <img src={InternalServerError} />

        <h1>
          <span>500</span> <br />
          Sunucu Hatası
        </h1>
        <p>Şuanda sorunu düzeltmeye çalışıyoruz. Lütfen daha sonra tekrar deneyiniz.</p>
      </div>
    </div>
  );
}

export default ServerErrorAlert;
