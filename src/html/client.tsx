import type { FC } from "react";
import { hydrateRoot } from "react-dom/client";

import Layout from "~/components/layout";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createRoot(Component: FC<any>) {
  const root = document.getElementById("app-root");
  if (root) {
    const props = JSON.parse(root.getAttribute("data-props") ?? "{}");
    hydrateRoot(
      root,
      <Layout>
        <Component {...props} />
      </Layout>,
    );
  }
}
