import { existsSync, copyFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "node:path";

const rootDir = process.cwd();
const envExamplePath = resolve(rootDir, ".env.example");
const envLocalPath = resolve(rootDir, ".env.local");

function runCommand(command, description, silent = false) {
  try {
    const output = execSync(command, {
      cwd: rootDir,
      stdio: silent ? "pipe" : "inherit",
      encoding: "utf-8",
    });
    return { success: true, output };
  } catch (error) {
    return {
      success: false,
      error: error.message || String(error),
      stderr: error.stderr ? String(error.stderr) : "",
    };
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("\n=======================================================");
  console.log("  🚀 Lazee.dev - Contributor Local Setup");
  console.log("=======================================================\n");

  // Step 1: Check / copy environment variables
  console.log("📦 1. Checking environment configuration...");
  if (!existsSync(envLocalPath)) {
    if (existsSync(envExamplePath)) {
      copyFileSync(envExamplePath, envLocalPath);
      console.log("   ✅ Created .env.local from .env.example");
    } else {
      console.warn("   ⚠️  .env.example not found. Skipping env copy.");
    }
  } else {
    console.log("   ✅ .env.local already exists.");
  }

  // Step 2: Start PostgreSQL with Docker Compose
  console.log("\n🐳 2. Starting local PostgreSQL container...");
  const dockerUp = runCommand("docker compose up -d", "Start Docker Compose");
  if (!dockerUp.success) {
    console.error("\n❌ Could not start Docker container.");
    console.error(
      "   Please ensure Docker Desktop / Docker Engine is installed and running."
    );
    console.error(
      "   You can also point DATABASE_URL in .env.local to any existing PostgreSQL instance."
    );
    process.exit(1);
  }
  console.log("   ✅ Docker container started.");

  // Step 3: Wait for PostgreSQL readiness
  console.log("\n⏳ 3. Waiting for PostgreSQL to be ready...");
  let isReady = false;
  const maxAttempts = 12;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const check = runCommand(
      "docker exec lazee-postgres pg_isready -U postgres -d lazee",
      "Check Postgres Readiness",
      true
    );
    if (check.success) {
      isReady = true;
      break;
    }
    await sleep(1500);
  }

  if (!isReady) {
    console.warn(
      "   ⚠️  PostgreSQL is taking longer than usual to accept connections. Continuing..."
    );
  } else {
    console.log("   ✅ PostgreSQL is ready and accepting connections.");
  }

  // Step 4: Push database schema
  console.log("\n🗄️  4. Synchronizing database schema with Prisma...");
  const dbPush = runCommand("npx prisma db push", "Prisma db push");
  if (!dbPush.success) {
    console.error("\n❌ Failed to push Prisma schema to database.");
    console.error("   Check your DATABASE_URL in .env.local.");
    process.exit(1);
  }
  console.log("   ✅ Database schema synchronized.");

  // Step 5: Seed database
  console.log("\n🌱 5. Seeding initial developer data and jobs...");
  const dbSeed = runCommand("node prisma/seed.mjs", "Seed database");
  if (!dbSeed.success) {
    console.error("\n❌ Failed to seed initial data.");
    process.exit(1);
  }

  // Summary
  console.log("\n=======================================================");
  console.log("  🎉 Setup Complete! You're ready to develop.");
  console.log("=======================================================");
  console.log("\nTo start the development server, run:\n");
  console.log("   npm run dev\n");
  console.log("Then visit http://localhost:3000 in your browser.");
  console.log("Use the ⚡ '1-Click Dev Sign In' to log in as dev@lazee.dev.\n");
}

main().catch((err) => {
  console.error("Setup error:", err);
  process.exit(1);
});
