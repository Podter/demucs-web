# Base
FROM oven/bun:slim AS build
WORKDIR /app
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=bun.lock,target=bun.lock \
    --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile
COPY . .
RUN bun run build

# Final
FROM oven/bun:distroless AS final
WORKDIR /app
ENV NODE_ENV production
ENV STATIC_DIR /app/dist/static
ENV DATA_DIR=/data
VOLUME ${DATA_DIR}
ENV PORT 3000
EXPOSE ${PORT}
COPY --from=build /app/dist /app/dist
CMD ["/app/dist/main.js"]
