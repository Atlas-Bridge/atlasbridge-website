import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";

async function buildAll() {
  console.log("building client...");
  await viteBuild();

  console.log("building api handler...");
  await esbuild({
    entryPoints: ["api/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "api/index.js",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    // Native modules that cannot be bundled by esbuild
    external: ["bcrypt", "pg-native", "sharp"],
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
