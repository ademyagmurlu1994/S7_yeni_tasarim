import React from "react";
import ReactLoading from "react-loading";

function PreLoader() {
  return (
    <>
      <ReactLoading type={"spinningBubbles"} color={"var(--main-color)"} height={100} />
    </>
  );
}

export default PreLoader;
