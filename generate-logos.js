import fs from "fs";
import sharp from "sharp";

const dirs = ["brand", "brand/svg", "brand/png", "brand/favicons", "brand/social"];

dirs.forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const colors = {
  navy: "#0B2A3C",
  darkBg: "#071D2B",
  slate: "#6E7A86",
  white: "#FFFFFF",
  black: "#000000",
};

const iconPath =
  "M 20 60 H 380 V 100 H 360 V 340 H 280 V 220 A 80 80 0 0 0 120 220 V 340 H 40 V 100 H 20 Z";

const defs = `
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&amp;display=swap');
      .text-atlas { font-family: 'Montserrat', system-ui, -apple-system, sans-serif; font-weight: 700; letter-spacing: -2px; }
      .text-bridge { font-family: 'Montserrat', system-ui, -apple-system, sans-serif; font-weight: 500; letter-spacing: -1px; }
    </style>
  </defs>
`;

const primaryWidth = 1600;
const primaryHeight = 400;

const svgs = {
  "logo-primary-light": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${primaryWidth} ${primaryHeight}" width="${primaryWidth}" height="${primaryHeight}">
    ${defs}
    <g transform="translate(0, 0)">
      <path d="${iconPath}" fill="${colors.navy}" />
      <text x="420" y="255" font-size="160" fill="${colors.navy}" class="text-atlas">Atlas<tspan fill="${colors.slate}" class="text-bridge">Bridge</tspan></text>
    </g>
  </svg>`,

  "logo-primary-dark": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${primaryWidth} ${primaryHeight}" width="${primaryWidth}" height="${primaryHeight}">
    ${defs}
    <g transform="translate(0, 0)">
      <path d="${iconPath}" fill="${colors.white}" />
      <text x="420" y="255" font-size="160" fill="${colors.white}" class="text-atlas">Atlas<tspan fill="${colors.slate}" class="text-bridge">Bridge</tspan></text>
    </g>
  </svg>`,

  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <path d="${iconPath}" fill="${colors.navy}" />
  </svg>`,

  "logo-mono-black": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${primaryWidth} ${primaryHeight}" width="${primaryWidth}" height="${primaryHeight}">
    ${defs}
    <g transform="translate(0, 0)">
      <path d="${iconPath}" fill="${colors.black}" />
      <text x="420" y="255" font-size="160" fill="${colors.black}" class="text-atlas">Atlas<tspan fill="${colors.black}" class="text-bridge">Bridge</tspan></text>
    </g>
  </svg>`,

  "logo-mono-white": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${primaryWidth} ${primaryHeight}" width="${primaryWidth}" height="${primaryHeight}">
    ${defs}
    <g transform="translate(0, 0)">
      <path d="${iconPath}" fill="${colors.white}" />
      <text x="420" y="255" font-size="160" fill="${colors.white}" class="text-atlas">Atlas<tspan fill="${colors.white}" class="text-bridge">Bridge</tspan></text>
    </g>
  </svg>`,

  "icon-mono-black": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <path d="${iconPath}" fill="${colors.black}" />
  </svg>`,

  "icon-mono-white": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <path d="${iconPath}" fill="${colors.white}" />
  </svg>`,
};

for (const [name, content] of Object.entries(svgs)) {
  fs.writeFileSync("brand/svg/" + name + ".svg", content);
}

console.log("SVGs created.");

async function generatePngs() {
  const resizeOptions = { width: 4096 };

  await sharp(Buffer.from(svgs["logo-primary-light"]))
    .resize(resizeOptions)
    .toFile("brand/png/logo-primary-light.png");
  await sharp(Buffer.from(svgs["logo-primary-dark"]))
    .resize(resizeOptions)
    .toFile("brand/png/logo-primary-dark.png");
  await sharp(Buffer.from(svgs["logo-mono-black"]))
    .resize(resizeOptions)
    .toFile("brand/png/logo-mono-black.png");
  await sharp(Buffer.from(svgs["logo-mono-white"]))
    .resize(resizeOptions)
    .toFile("brand/png/logo-mono-white.png");

  await sharp(Buffer.from(svgs["icon"]))
    .resize({ width: 1024, height: 1024 })
    .toFile("brand/png/icon-1024.png");
  await sharp(Buffer.from(svgs["icon"]))
    .resize({ width: 512, height: 512 })
    .toFile("brand/png/icon-512.png");
  await sharp(Buffer.from(svgs["icon"]))
    .resize({ width: 256, height: 256 })
    .toFile("brand/png/icon-256.png");

  for (const size of [16, 32, 48, 64]) {
    await sharp(Buffer.from(svgs["icon"]))
      .resize({ width: size, height: size })
      .toFile("brand/favicons/favicon-" + size + ".png");
  }

  await sharp(Buffer.from(svgs["icon"]))
    .resize({ width: 180, height: 180 })
    .toFile("brand/favicons/apple-touch-icon.png");
  await sharp(Buffer.from(svgs["icon"]))
    .resize({ width: 192, height: 192 })
    .toFile("brand/favicons/android-chrome-192.png");
  await sharp(Buffer.from(svgs["icon"]))
    .resize({ width: 512, height: 512 })
    .toFile("brand/favicons/android-chrome-512.png");

  fs.copyFileSync("brand/favicons/favicon-32.png", "brand/favicons/favicon.ico");

  await sharp(Buffer.from(svgs["icon-mono-white"]))
    .resize({ width: 400, height: 400, fit: "contain", background: colors.navy })
    .flatten({ background: colors.navy })
    .toFile("brand/social/avatar-400.png");

  await sharp(Buffer.from(svgs["icon-mono-white"]))
    .resize({ width: 800, height: 800, fit: "contain", background: colors.navy })
    .flatten({ background: colors.navy })
    .toFile("brand/social/avatar-800.png");

  await sharp(Buffer.from(svgs["icon-mono-white"]))
    .resize({ width: 1024, height: 1024, fit: "contain", background: colors.navy })
    .flatten({ background: colors.navy })
    .toFile("brand/social/avatar-1024.png");

  const bannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1584 396" width="1584" height="396">
    ${defs}
    <rect width="1584" height="396" fill="${colors.darkBg}" />
    <!-- Logo -->
    <g transform="translate(100, 110) scale(0.6)">
      <path d="${iconPath}" fill="${colors.white}" />
      <text x="420" y="255" font-size="160" fill="${colors.white}" class="text-atlas">Atlas<tspan fill="${colors.slate}" class="text-bridge">Bridge</tspan></text>
    </g>
    <!-- Tagline -->
    <text x="100" y="340" font-size="28" fill="${colors.slate}" class="text-bridge">Controlled autonomy for AI agents.</text>
  </svg>`;

  await sharp(Buffer.from(bannerSvg)).toFile("brand/social/linkedin-banner.png");

  console.log("PNGs created.");
}

generatePngs().catch(console.error);
