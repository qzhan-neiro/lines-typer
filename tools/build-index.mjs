// 扫描 scripts/ 下的所有 .json，检查格式，生成 scripts/index.json。
// 本地运行：node tools/build-index.mjs   （GitHub Actions 部署时也会自动运行）
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = 'scripts';
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.json$/i.test(name) && name !== 'index.json') files.push(relative(root, p).split(sep).join('/'));
  }
})(root);
files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

let bad = 0;
const hasLines = (d) => Array.isArray(d) ? d.some(hasLines) : d && typeof d === 'object' && (Array.isArray(d.lines) || (Array.isArray(d.episodes) && d.episodes.some(hasLines)));
for (const f of files) {
  try {
    const d = JSON.parse(readFileSync(join(root, f), 'utf8').replace(/^﻿/, ''));
    if (!hasLines(d)) throw new Error('找不到 lines 数组');
  } catch (e) {
    bad++;
    console.error(`✗ ${f}: ${e.message}`);
  }
}
if (bad) { console.error(`\n${bad} 个文件有问题，已中止。`); process.exit(1); }

writeFileSync(join(root, 'index.json'), JSON.stringify({ files }, null, 2) + '\n');
console.log(`已生成 scripts/index.json，共 ${files.length} 个文件。`);
