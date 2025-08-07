// scripts/extractTexts.ts
import * as fs from 'fs';
import * as path from 'path';

const PAGES_DIR = path.resolve(__dirname, '../../../front-end');
const OUTPUT_FILE = path.resolve(__dirname, '../../siteContent.txt');

function extractTextFromFile(content: string): string[] {
  const regex = />\s*([^<>]+?)\s*</g;
  let matches;
  const texts: string[] = [];

  while ((matches = regex.exec(content)) !== null) {
    const text = matches[1].trim();
    if (text && !text.match(/^\s*$/)) {
      texts.push(text);
    }
  }

  return texts;
}

function extractTextsFromDir(dir: string): string[] {
  let allTexts: string[] = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      allTexts = allTexts.concat(extractTextsFromDir(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const texts = extractTextFromFile(content);
      allTexts = allTexts.concat(texts);
    }
  }

  return allTexts;
}

function main() {
  console.log('Extraindo textos das páginas...');

  const allTexts = extractTextsFromDir(PAGES_DIR);

  const uniqueTexts = Array.from(new Set(allTexts));
  const output = uniqueTexts.join('\n\n');

  fs.writeFileSync(OUTPUT_FILE, output);

  console.log(`Arquivo gerado em ${OUTPUT_FILE}`);
}

main();
