import { readFileSync } from 'node:fs';

const { pull_request: pr } = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const template = readFileSync('.github/pull_request_template.md', 'utf8');
const marker = '- [ ] Privacy review complete.';
const declaration = template.split(/\r?\n/).find(line => line.startsWith(marker));
const checked = declaration?.replace('- [ ] ', '- [x] ');
const normalize = line => line.trim().replace(/^- \[X\] /, '- [x] ');
if (!checked || !(pr?.body ?? '').split(/\r?\n/).some(line => normalize(line) === checked)) {
  console.error('Complete the public documentation privacy review in the PR template before merging.');
  process.exitCode = 1;
}
