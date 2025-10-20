#!/usr/bin/env -S bun --watch
import { workspace } from "@runy-dev/core";

const ws = workspace(import.meta);

ws.service("astro", (s) => {
  s.autorun();
  s.run(async (ctx) => {
    await ctx.process({
      alias: "astro",
      cmd: "pnpm",
      args: ["run", "dev"],
    });
  });
});
