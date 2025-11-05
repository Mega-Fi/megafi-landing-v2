/**
 * CSV Import Utility for OG Eligible Handles
 * 
 * Usage:
 * 1. Place your CSV file in the project root (e.g., og-handles.csv)
 * 2. Run: npx tsx scripts/import-handles.ts path/to/your-file.csv
 * 
 * CSV Format:
 * - Single column with header "twitter_handle" OR just handles one per line
 * - Handles can have @ prefix or not
 * 
 * Example CSV:
 * twitter_handle
 * @user1
 * user2
 * @user3
 */

import * as fs from 'fs';
import * as path from 'path';

async function importHandles(csvPath: string) {
  try {
    // Read CSV file
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').map(line => line.trim()).filter(line => line);
    
    // Remove header if present (assuming first line might be "twitter_handle" or similar)
    const hasHeader = lines[0].toLowerCase().includes('handle') || lines[0].toLowerCase().includes('username');
    const handles = hasHeader ? lines.slice(1) : lines;
    
    // Normalize handles
    const normalizedHandles = handles
      .map(handle => handle.replace('@', '').toLowerCase().trim())
      .filter(handle => handle.length > 0);
    
    console.log(`📊 Found ${normalizedHandles.length} handles in CSV`);
    console.log(`\n📤 Sending to API endpoint...`);
    
    // Get API URL from environment or use localhost
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // Send to upload endpoint
    const response = await fetch(`${apiUrl}/api/claim/upload-handles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ handles: normalizedHandles }),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ Success! ${result.count} handles uploaded to database`);
    } else {
      console.error(`❌ Error: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Main execution
const csvPath = process.argv[2];

if (!csvPath) {
  console.error('❌ Please provide path to CSV file');
  console.log('\nUsage: npx tsx scripts/import-handles.ts path/to/file.csv');
  process.exit(1);
}

if (!fs.existsSync(csvPath)) {
  console.error(`❌ File not found: ${csvPath}`);
  process.exit(1);
}

console.log(`📁 Reading CSV: ${csvPath}\n`);
importHandles(csvPath);

