import type { client } from "./api";

type Separation = NonNullable<
  Awaited<ReturnType<typeof client.api.separate.post>>["data"]
>;

export function getSeparations(): Separation[] {
  return JSON.parse(localStorage.getItem("separations") ?? "[]");
}

export function setSeparations(separations: Separation[]) {
  localStorage.setItem("separations", JSON.stringify(separations));
}

export function addSeparation(separation: Separation) {
  setSeparations([...getSeparations(), separation]);
}

export function removeSeparation(id: string) {
  setSeparations(getSeparations().filter((s) => s.id !== id));
}

export function removeExpiredSeparations() {
  setSeparations(
    getSeparations().filter((s) => s.expiresAt.getTime() > Date.now()),
  );
}

export function getSeparation(id: string) {
  return getSeparations().find((s) => s.id === id);
}
