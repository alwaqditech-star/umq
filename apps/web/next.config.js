import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Load monorepo root `.env` into process.env for Next build/dev. */
function loadRootEnv() {
  const envPath = path.resolve(__dirname, "../../.env");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadRootEnv();

const apiInternal =
  process.env.API_INTERNAL_URL?.replace(/\/$/, "") ??
  `http://127.0.0.1:${process.env.API_PORT ?? "4001"}`;

const apiImagePort = (() => {
  try {
    const port = new URL(apiInternal).port;
    return port || (apiInternal.startsWith("https") ? "443" : "80");
  } catch {
    return process.env.API_PORT ?? "4001";
  }
})();

/** Monorepo: include workspace packages in Vercel serverless traces */
const monorepoRoot = path.join(__dirname, "../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: monorepoRoot,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "127.0.0.1", port: apiImagePort, pathname: "/**" },
      { protocol: "http", hostname: "localhost", port: apiImagePort, pathname: "/**" },
      { protocol: "https", hostname: "**", pathname: "/**" },
    ],
  },
  transpilePackages: ["framer-motion", "@umq/shared"],
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiInternal}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
