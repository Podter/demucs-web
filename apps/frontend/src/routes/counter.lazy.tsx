import { useState } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";

export const Route = createLazyFileRoute("/counter")({
  component: Counter,
});

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>Counter</h1>
      <Button onClick={() => setCount((n) => n + 1)}>Count: {count}</Button>
    </main>
  );
}
