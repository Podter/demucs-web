import type { ComponentProps, FC } from "react";
import { renderToReadableStream } from "react-dom/server";

import Layout from "~/components/layout";
import { ThemeScript } from "~/components/theme-script";
import { getClientAsset } from "~/lib/manifest";

interface RenderReactOptions {
  title: string;
  description: string;
  clientScript: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function renderReact<T extends FC<any>>(
  Component: T,
  props: ComponentProps<T>,
  { title, description, clientScript }: RenderReactOptions,
) {
  const cssFile = await getClientAsset("src/html/styles.css");

  const stream = await renderToReadableStream(
    <html lang="en">
      <head>
        {/* Metadata */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={description} />
        <meta name="robots" content="noindex, nofollow" />
        {/* Styles */}
        <link href={cssFile} rel="stylesheet" />
        {/* Scripts */}
        <ThemeScript />
        <script src={clientScript} type="module" />
      </head>
      <body>
        <div id="app-root" data-props={JSON.stringify(props ?? {})}>
          <Layout>
            <Component {...props} />
          </Layout>
        </div>
      </body>
    </html>,
  );

  const response = new Response(stream, {
    headers: {
      "Content-Type": "text/html",
    },
  });

  return response;
}
