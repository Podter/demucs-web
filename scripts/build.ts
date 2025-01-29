await Bun.build({
  entrypoints: ["./src/main.ts"],
  outdir: "dist",
  target: "bun",
  format: "esm",
  splitting: true,
  sourcemap: "linked",
  minify: true,
  throw: true,
});
