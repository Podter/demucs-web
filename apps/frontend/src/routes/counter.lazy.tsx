import { useState } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/counter")({
  component: Counter,
});

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>Counter</h1>
      <button onClick={() => setCount((n) => n + 1)}>Count: {count}</button>
    </main>
  );
}
