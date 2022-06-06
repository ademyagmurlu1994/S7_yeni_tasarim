import Counter from "./child";
import { useCallback, useState } from "react";

export default function App() {
  const [count, setCount] = useState(undefined);

  const callback = useCallback((isVerifiedValidationCode) => {
    setCount(isVerifiedValidationCode);
  }, []);

  return (
    <div className="App" style={{ marginTop: "100px" }}>
      <Counter parentCallback={callback} phoneNumber={5433509664} />
      <h2>count {JSON.stringify(count)}</h2>
    </div>
  );
}
