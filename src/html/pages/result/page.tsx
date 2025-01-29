import type { ResultType } from "~/db/schema";
import { useResult } from "~/hooks/use-result";

export default function Result(initialData: ResultType) {
  const result = useResult(initialData);
  return (
    <>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </>
  );
}
