import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>Hello, world!</h1>
      <button onClick={() => setCount((n) => n + 1)}>Count: {count}</button>
    </main>
  );
}
