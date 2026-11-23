import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createProcessor } from '@mdx-js/mdx';
import GithubSlugger from 'github-slugger';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
import { parse } from 'yaml';

const tracked = new Set(execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean));
const routes = new Map();
const links = [];
const config = JSON.parse(fs.readFileSync('docs.json', 'utf8'));
const processor = createProcessor();
const errors = [];

for (const file of tracked) {
  if (!file.endsWith('.mdx')) continue;
  const route = file.slice(0, -4);
  const anchors = new Set();
  routes.set(route, anchors);
  try {
    const source = fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n');
    const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(source);
    if (!frontmatter) throw new Error('Missing frontmatter');
    const { title, description } = parse(frontmatter[1]);
    if (!title || !description) throw new Error('Missing title or description');
    const body = source.slice(frontmatter[0].length);
    const tree = processor.parse(body);
    const slugger = new GithubSlugger();
    visit(tree, node => {
      if (node.type === 'heading') anchors.add(slugger.slug(toString(node)));
      if (['link', 'image', 'definition'].includes(node.type)) links.push([route, node.url]);
      if (node.type === 'code' && node.lang === 'json') JSON.parse(node.value);
      for (const attr of node.attributes ?? []) {
        if (typeof attr.value !== 'string') continue;
        if (['href', 'src'].includes(attr.name)) links.push([route, attr.value]);
        if (attr.name === 'id') anchors.add(attr.value);
      }
    });
    await processor.run(tree);
  } catch (error) {
    errors.push(file + ': ' + error.message);
  }
}

const origin = 'https://docs.cedarcopilot.com';
for (const [from, href] of links) {
  try {
    const url = new URL(href, origin + '/' + from);
    if (url.origin !== origin) continue;
    const dest = decodeURIComponent(url.pathname).replace(/^\/|\/$/g, '') || 'index';
    if (!routes.has(dest) && !tracked.has(dest)) throw new Error('Missing destination');
    const anchor = decodeURIComponent(url.hash.slice(1));
    if (anchor && routes.has(dest) && !routes.get(dest).has(anchor)) throw new Error('Missing anchor');
  } catch (error) {
    errors.push(from + ' -> ' + href + ': ' + error.message);
  }
}

function pages(group) {
  return typeof group === 'string' ? [group] : (group.groups ?? group.pages).flatMap(pages);
}
const navigation = config.navigation.tabs.flatMap(pages);
const listed = new Set(navigation);
if (listed.size !== navigation.length) errors.push('Duplicate navigation entries');
for (const route of listed) if (!routes.has(route)) errors.push('Missing page: ' + route);
for (const route of routes.keys()) if (!listed.has(route)) errors.push('Missing from navigation: ' + route);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Validated ' + routes.size + ' pages, ' + links.length + ' links and the documentation navigation.');
}
