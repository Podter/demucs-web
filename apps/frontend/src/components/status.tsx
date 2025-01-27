import { useEffect, useState } from "react";

import { client } from "~/lib/api";

interface StatusProps {
  data: NonNullable<
    Awaited<ReturnType<(typeof client)["api"]["separate"]["post"]>>["data"]
  >;
}

export default function Status({ data }: StatusProps) {
  const [status, setStatus] = useState<
    | Awaited<
        ReturnType<ReturnType<(typeof client)["api"]["status"]>["get"]>
      >["data"]
    | null
  >(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const status = await client.api
        .status({
          id: data.id,
        })
        .get({
          headers: {
            authorization: `Bearer ${data.hash}`,
          },
        });
      if (status.data) {
        setStatus(status.data);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [data]);

  return <pre>{JSON.stringify(status, null, 2)}</pre>;
}
