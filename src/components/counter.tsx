import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((n) => n + 1)}>Count: {count}</button>;
}
