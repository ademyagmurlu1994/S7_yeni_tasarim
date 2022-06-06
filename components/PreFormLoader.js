import React from "react";
import ReactLoading from "react-loading";

function PreFormLoader() {
  return (
    <div>
      <ReactLoading type={"spinningBubbles"} color={"var(--main-color)"} height={300} width={100} />
    </div>
  );
}

export default PreFormLoader;
