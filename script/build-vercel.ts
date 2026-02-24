import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, mkdir, cp, writeFile, stat } from "fs/promises";

const OUTDIR = ".vercel/output";

async function buildVercel() {
  // Clean previous output
  await rm(OUTDIR, { recursive: true, force: true });

  // 1. Build client with Vite → dist/public/
  console.log("building client…");
  await viteBuild();

  // 2. Create Build Output API v3 directory structure
  const funcDir = `${OUTDIR}/functions/api.func`;
  await mkdir(funcDir, { recursive: true });
  await mkdir(`${OUTDIR}/static`, { recursive: true });

  // 3. Bundle the API serverless function with esbuild
  // All npm dependencies are bundled into a single file.
  // Node.js built-ins are kept external (automatic with platform: "node").
  console.log("building api function…");
  await esbuild({
    entryPoints: ["api/index.ts"],
    platform: "node",
    target: "node22",
    bundle: true,
    format: "esm",
    outfile: `${funcDir}/index.mjs`,
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    logLevel: "info",
    // Banner: polyfill __dirname / __filename for ESM
    // (routes.ts uses __dirname in resolveDocsDir)
    banner: {
      js: [
        'import{fileURLToPath as _fU}from"url";',
        'import{dirname as _dN}from"path";',
        "const __filename=_fU(import.meta.url);",
        "const __dirname=_dN(__filename);",
      ].join(""),
    },
  });

  // 4. Copy docs into the function directory (needed by /api/docs routes)
  console.log("copying docs…");
  await cp("docs", `${funcDir}/docs`, { recursive: true });

  // 5. Write function config
  await writeFile(
    `${funcDir}/.vc-config.json`,
    JSON.stringify(
      {
        runtime: "nodejs22.x",
        handler: "index.mjs",
        launcherType: "Nodejs",
        maxDuration: 30,
      },
      null,
      2,
    ),
  );

  // 6. Copy static assets from Vite build
  console.log("copying static assets…");
  await cp("dist/public", `${OUTDIR}/static`, { recursive: true });

  // 7. Write routing config
  await writeFile(
    `${OUTDIR}/config.json`,
    JSON.stringify(
      {
        version: 3,
        routes: [
          // Cache immutable Vite assets
          {
            src: "/assets/(.*)",
            headers: { "Cache-Control": "public, max-age=31536000, immutable" },
            continue: true,
          },
          // API routes → serverless function
          { src: "/api/(.*)", dest: "/api" },
          // Serve static files
          { handle: "filesystem" },
          // SPA fallback
          { src: "/(.*)", dest: "/index.html" },
        ],
      },
      null,
      2,
    ),
  );

  // Report sizes
  const { size } = await stat(`${funcDir}/index.mjs`);
  console.log(`\n✓ api function: ${(size / 1024).toFixed(1)} KB`);
  console.log("✓ build output ready at .vercel/output/");
}

buildVercel().catch((err) => {
  console.error(err);
  process.exit(1);
});
