// Validates every packages/experiments/<id>/v<n>.json against experiment.schema.json.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const schema = JSON.parse(readFileSync(join(root, 'experiment.schema.json'), 'utf8'));
const validate = new Ajv2020({ allErrors: true, strict: false }).compile(schema);
let failed = 0, count = 0;
for (const dir of readdirSync(root)) {
  if (!dir.includes('.') || !statSync(join(root, dir)).isDirectory()) continue;
  for (const f of readdirSync(join(root, dir)).filter((n) => /^v\d+\.json$/.test(n))) {
    count++;
    const cfg = JSON.parse(readFileSync(join(root, dir, f), 'utf8'));
    if (!validate(cfg)) { failed++; console.error(`✗ ${dir}/${f}`); for (const e of validate.errors) console.error(`   ${e.instancePath || '/'} ${e.message}`); }
    else if (cfg.id !== dir) { failed++; console.error(`✗ ${dir}/${f}: id "${cfg.id}" must match folder`); }
    else console.log(`✓ ${dir}/${f}`);
  }
}
if (count === 0) { console.error('no experiment configs found'); process.exit(1); }
process.exit(failed ? 1 : 0);
