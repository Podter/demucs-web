import { useEffect, useState } from "react";

import { client } from "./lib/api";

export default function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    client.api.hello
      .get({
        query: {
          name: "world",
        },
      })
      .then(({ data }) => setMessage(data?.message ?? "Error"));
  }, []);

  return (
    <main>
      <h1>{message}</h1>
      <button onClick={() => setCount((n) => n + 1)}>Count: {count}</button>
    </main>
  );
}
