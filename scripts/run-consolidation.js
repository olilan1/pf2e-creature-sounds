/**
 * @fileoverview Run when issuing a production release after one or more beta releases.
 * Updates the changelog to consolidate beta changes into the Unreleased section
 * and remove the beta headers and reference links from the changelog.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import { consolidateChangelog } from './consolidate.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const changelogPath = path.resolve(__dirname, '../CHANGELOG.md');

// Ensure the changelog file exists before attempting to read it
if (!fs.existsSync(changelogPath)) {
  console.error('CHANGELOG.md not found.');
  process.exit(1);
}

// Read the current file content, execute consolidation, and write changes back if updated
const fileContent = fs.readFileSync(changelogPath, 'utf8');
const updated = consolidateChangelog(fileContent);

if (updated !== fileContent) {
  fs.writeFileSync(changelogPath, updated, 'utf8');
  console.log('Changelog consolidated successfully.');
} else {
  console.log('No pre-releases to consolidate.');
}
