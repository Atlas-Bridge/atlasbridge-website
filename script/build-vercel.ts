import { build as esbuild, type Plugin } from "esbuild";
import { build as viteBuild } from "vite";
import { rm } from "fs/promises";

const pathAliasPlugin: Plugin = {
  name: "path-alias",
  setup(build) {
    build.onResolve({ filter: /^@shared/ }, async (args) => {
      return build.resolve(args.path.replace(/^@shared/, "./shared"), {
        kind: args.kind,
        resolveDir: process.cwd(),
      });
    });
    build.onResolve({ filter: /^@\// }, async (args) => {
      return build.resolve(args.path.replace(/^@\//, "./client/src/"), {
        kind: args.kind,
        resolveDir: process.cwd(),
      });
    });
  },
};

async function buildForVercel() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building serverless function...");
  await esbuild({
    entryPoints: ["server/vercel.ts"],
    platform: "node",
    bundle: true,
    format: "esm",
    outfile: "api/index.mjs",
    plugins: [pathAliasPlugin],
    external: ["bcrypt", "sharp", "pg-native"],
    banner: {
      js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
    },
    minify: true,
    logLevel: "info",
  });
}

buildForVercel().catch((err) => {
  console.error(err);
  process.exit(1);
});
