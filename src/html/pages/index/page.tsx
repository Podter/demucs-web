import { useState } from "react";

interface IndexProps {
  message: string;
}

export default function Index({ message }: IndexProps) {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>{message}</h1>
      <button onClick={() => setCount((n) => n + 1)}>{count}</button>
    </>
  );
}
