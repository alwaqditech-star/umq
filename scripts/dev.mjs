/**
 * Start web (3000) + API (API_PORT) together — one process tree, clean shutdown on Windows.
 */
import { execSync, spawn } from "node:child_process";
import path from "node:path";
import { getApiPort, rootDir } from "./read-env.mjs";

const apiPort = getApiPort();

console.log("\n  UMQ dev — web + API in one terminal");
console.log(`  • Web:  http://localhost:3000/ar`);
console.log(`  • API:  http://127.0.0.1:${apiPort}/api/v1/health`);
console.log("  • Two terminals instead: pnpm dev:api  +  pnpm dev:web");
console.log("  • Stop: Ctrl+C here\n");

execSync("node scripts/free-dev-ports.mjs", { cwd: rootDir, stdio: "inherit" });
execSync("pnpm --filter @umq/shared build", { cwd: rootDir, stdio: "inherit" });

const isWin = process.platform === "win32";
const child = spawn(
  "pnpm",
  ["exec", "turbo", "run", "dev", "--filter=@umq/web", "--filter=@umq/api"],
  { cwd: rootDir, stdio: "inherit", shell: isWin },
);

let stopping = false;

function stopAll() {
  if (stopping) return;
  stopping = true;
  if (child.pid && isWin) {
    try {
      execSync(`taskkill /PID ${child.pid} /T /F`, { stdio: "ignore" });
    } catch {
      // already stopped
    }
  } else if (child.pid) {
    child.kill("SIGTERM");
  }
  try {
    execSync("node scripts/free-dev-ports.mjs", {
      cwd: rootDir,
      stdio: "ignore",
    });
  } catch {
    // ignore
  }
}

process.on("SIGINT", () => {
  stopAll();
  process.exit(0);
});
process.on("SIGTERM", () => {
  stopAll();
  process.exit(0);
});

child.on("exit", (code, signal) => {
  if (stopping) return;
  if (signal) process.exit(1);
  process.exit(code ?? 0);
});
