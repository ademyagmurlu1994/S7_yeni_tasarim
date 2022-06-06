import React from "react";
import ReactLoading from "react-loading";

function PagePreLoader() {
  return (
    <div className="page-loader-wrapper">
      <ReactLoading type={"spinningBubbles"} color={"var(--main-color)"} height={200} width={60} />
    </div>
  );
}

export default PagePreLoader;
