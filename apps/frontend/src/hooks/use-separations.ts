import { useCallback } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

type Separation = {
  id: string;
  hash: string;
  expiresAt: Date;
};

const STORAGE_KEY = "separations";

export function useSeparations() {
  const [separations, setSeparations] = useLocalStorage<Separation[]>(
    STORAGE_KEY,
    [],
  );

  const addSeparation = useCallback(
    (separation: Separation) => {
      setSeparations((prev) => [separation, ...prev]);
    },
    [setSeparations],
  );

  // TODO: removeExpiredSeparations

  return {
    separations,
    addSeparation,
  };
}
