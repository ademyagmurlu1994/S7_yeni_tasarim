/*import Link from "next/link";
import React, { useState, useEffect } from "react";
import { logo } from "/resources/images";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

//state çağırma ve değiştirme işlemi
import { increment, decrement, incrementByAmount } from "../stores/kasko";
import { useDispatch } from "react-redux";

const Counter = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    activeStep: 1,
  });

  return (
    <div style={{ marginTop: "100px" }}>
      <b>Sayı: {count}</b>
      <button onClick={() => dispatch(increment())}>Arttır</button>
      <button onClick={() => dispatch(decrement())}>Azalt</button>
      <button onClick={() => dispatch(incrementByAmount(4))}>4 arttır</button>
    </div>
  );
};

export default Counter;*/
