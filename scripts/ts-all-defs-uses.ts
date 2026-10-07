#!/usr/bin/env -S npx tsx
/**
 * ts-morph def/use report for the ts-all-defs-uses platform task.
 */
import fs from 'node:fs';
import path from 'node:path';
import { Project, SyntaxKind } from 'ts-morph';

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'reports', 'ts-all-defs-uses-report.json');

function collectSourceFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(full));
    } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      files.push(full);
    }
  }
  return files;
}

const project = new Project({
  tsConfigFilePath: path.join(ROOT, 'tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
});

for (const filePath of collectSourceFiles(SRC)) {
  project.addSourceFileAtPath(filePath);
}

const definitions: Array<{ name: string; file: string; line: number }> = [];
const uses: Array<{ name: string; file: string; line: number }> = [];

for (const sourceFile of project.getSourceFiles()) {
  const rel = path.relative(ROOT, sourceFile.getFilePath()).replace(/\\/g, '/');

  for (const fn of sourceFile.getFunctions()) {
    const name = fn.getName();
    if (!name) continue;
    definitions.push({ name, file: rel, line: fn.getStartLineNumber() });
    for (const ref of fn.findReferencesAsNodes()) {
      if (ref.getKind() === SyntaxKind.Identifier && ref !== fn.getNameNode()) {
        uses.push({ name, file: rel, line: ref.getStartLineNumber() });
      }
    }
  }

  for (const cls of sourceFile.getClasses()) {
    const name = cls.getName();
    if (!name) continue;
    definitions.push({ name, file: rel, line: cls.getStartLineNumber() });
    for (const ref of cls.findReferencesAsNodes()) {
      if (ref.getKind() === SyntaxKind.Identifier && ref !== cls.getNameNode()) {
        uses.push({ name, file: rel, line: ref.getStartLineNumber() });
      }
    }
  }
}

const uniqueDefs = new Set(definitions.map((d) => `${d.file}:${d.name}`));
const uniqueUses = new Set(uses.map((u) => `${u.file}:${u.name}:${u.line}`));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(
  OUT,
  JSON.stringify(
    {
      tool: 'ts-morph',
      filesAnalysed: project.getSourceFiles().length,
      definitionCount: definitions.length,
      useCount: uses.length,
      uniqueDefinitions: uniqueDefs.size,
      uniqueUses: uniqueUses.size,
      definitions: definitions.slice(0, 200),
      uses: uses.slice(0, 200),
    },
    null,
    2
  )
);

console.log(`Wrote ${OUT} (${definitions.length} defs, ${uses.length} uses)`);
