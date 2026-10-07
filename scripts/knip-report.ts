import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'reports', 'knip-report.json');

const json = execSync('npx knip --reporter json --no-progress', {
  cwd: root,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'inherit'],
});

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, json);
console.log(`Wrote ${out} (${json.length} bytes)`);
