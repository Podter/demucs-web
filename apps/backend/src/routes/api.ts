import { Elysia, t } from "elysia";

export const api = new Elysia({ prefix: "/api" }).get(
  "/hello",
  ({ query }) => {
    return {
      message: `Hello, ${query.name}!`,
    };
  },
  {
    query: t.Object({
      name: t.String(),
    }),
  },
);
