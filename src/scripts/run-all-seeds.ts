import 'dotenv/config';
import path from 'path';
import { sync as globSync } from 'glob';
import fs from 'fs';

const seedersPath = path.resolve(__dirname, '../seeders');
const seederPattern = path.resolve(seedersPath, '*.ts').replace(/\\/g, '/');

console.log('[Seeder] Seeders path:', seedersPath);
console.log('[Seeder] Seeder glob pattern:', seederPattern);

// Get all seeder files
const seederFiles = globSync(seederPattern);
console.log('[Seeder] Found seeder files:', seederFiles);

if (seederFiles.length === 0) {
  console.log('[Seeder] No seeder files found');
  process.exit(0);
}

async function runSeeder(seederPath: string): Promise<void> {
  const seederName = path.basename(seederPath);
  console.log(`[Seeder] Running seeder: ${seederName}`);
  
  try {
    // Import and run the seeder
    const seeder = require(seederPath);
    
    // Check if the seeder has a default export (function) or is a module with a seed function
    if (typeof seeder === 'function') {
      await seeder();
    } else if (seeder.default && typeof seeder.default === 'function') {
      await seeder.default();
    } else if (seeder.seed && typeof seeder.seed === 'function') {
      await seeder.seed();
    } else {
      console.log(`[Seeder] Skipping ${seederName} - no valid seed function found`);
      return;
    }
    
    console.log(`[Seeder] ✅ Successfully ran: ${seederName}`);
  } catch (error) {
    console.error(`[Seeder] ❌ Error running ${seederName}:`, error);
    throw error;
  }
}

async function runAllSeeds(): Promise<void> {
  try {
    console.log('[Seeder] Starting to run all seeders...');
    
    // Sort seeders by filename to ensure consistent order
    const sortedSeeders = seederFiles.sort();
    
    for (const seederFile of sortedSeeders) {
      await runSeeder(seederFile);
    }
    
    console.log('[Seeder] ✅ All seeders completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder] ❌ Error running seeders:', error);
    process.exit(1);
  }
}

runAllSeeds(); 