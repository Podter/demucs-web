import { useState } from "react";

import { Button } from "~/components/ui/button";

interface IndexProps {
  message: string;
}

export default function Index({ message }: IndexProps) {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>{message}</h1>
      <Button onClick={() => setCount((n) => n + 1)}>{count}</Button>
    </>
  );
}
