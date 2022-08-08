import React from "react";
import ReactLoading from "react-loading";

function PreFormLoader() {
  return (
    <div>
      <ReactLoading type={"spinningBubbles"} color={"var(--color-one)"} height={100} width={100} />
    </div>
  );
}

export default PreFormLoader;
