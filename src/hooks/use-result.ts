import { useEffect, useState } from "react";

import type { ResultType } from "~/db/schema";

export function useResult(initialData: ResultType): ResultType {
  const [result, setResult] = useState<ResultType>(initialData);

  useEffect(() => {
    if (result.status === "processing") {
      const interval = setInterval(async () => {
        const data: ResultType = await fetch(`/api/results/${result.id}`).then(
          (res) => res.json(),
        );
        setResult(data);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [result]);

  return result;
}
