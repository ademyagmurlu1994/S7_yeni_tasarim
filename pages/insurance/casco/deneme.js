import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

//state çağırma ve değiştirme işlemi
//import { isValidTcKimlik } from "/stores/usefull";
import { useDispatch } from "react-redux";

import { isValidTcKimlik } from "/functions/common";

const Counter = () => {
  //const tcG = useSelector((state) => state.usefull.isValidTc);
  const dispatch = useDispatch();

  const [tc, setTc] = useState();

  const tcGecerlimi = () => {
    //let deger = dispatch(isValidTcKimlik(tc));
    console.log(deger);
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <input type="number" onChange={(e) => setTc(e.target.value)} />
      {JSON.stringify(isValidTcKimlik(tc))}
      <button onClick={() => tcGecerlimi()}>TC Geçerli mi?</button>

      <div className="wrapper w-100" style={{ display: "flex" }}>
        <div className="sabit p-2 bg-main">TR</div>
        <div className="flex" style={{ display: "flex", flex: "1", flexDirection: "row" }}>
          <input type="text" name="" id="" style={{ width: "100%" }} />
        </div>
      </div>
    </div>
  );
};

export default Counter;
