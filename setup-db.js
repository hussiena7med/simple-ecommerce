#!/usr/bin/env node

/**
 * Complete Database Setup Script
 * This will set up the database, run migrations, and seed data
 */

const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

async function runCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log(`✅ ${description} completed successfully!`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    throw error;
  }
}

async function setupComplete() {
  console.log("🚀 Starting complete database setup...\n");

  try {
    // Create database
    await runCommand("npm run db:create", "Creating database");

    // Run migrations
    await runCommand("npm run db:migrate", "Running migrations");

    // Run seeders
    await runCommand("npm run db:seed", "Seeding data");

    console.log("\n🎉 Database setup completed successfully!");
    console.log("\n📊 Your database now contains:");
    console.log("   ✅ 10 Categories");
    console.log("   ✅ 25+ Products");
    console.log("   ✅ 5 Sample Orders");
    console.log("\n🚀 You can now start the server with: npm run dev");
  } catch (error) {
    console.error("\n❌ Setup failed:", error.message);
    console.log("\n🔧 Try running commands manually:");
    console.log("   1. npm run db:create");
    console.log("   2. npm run db:migrate");
    console.log("   3. npm run db:seed");
    process.exit(1);
  }
}

setupComplete();
