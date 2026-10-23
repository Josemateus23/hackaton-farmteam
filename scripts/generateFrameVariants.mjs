import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const srcDir = path.join(rootDir, 'public', 'frames', 'landinghero', 'frames');
const mobileDir = path.join(rootDir, 'public', 'frames', 'landinghero', 'mobile');

if (!fs.existsSync(mobileDir)) {
  fs.mkdirSync(mobileDir, { recursive: true });
}

async function run() {
  console.log('--- Generating Mobile 960x540 Frame Variants ---');
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.webp')).sort();
  console.log(`Found ${files.length} source frames.`);

  let processed = 0;
  let totalOrigBytes = 0;
  let totalMobileBytes = 0;

  // Process in chunks of 8 concurrent sharp tasks
  const chunkSize = 8;
  for (let i = 0; i < files.length; i += chunkSize) {
    const chunk = files.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async file => {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(mobileDir, file);
        const origSize = fs.statSync(srcPath).size;
        totalOrigBytes += origSize;

        await sharp(srcPath)
          .resize({ width: 960, height: 540, fit: 'fill' })
          .webp({ quality: 76, effort: 4 })
          .toFile(destPath);

        const newSize = fs.statSync(destPath).size;
        totalMobileBytes += newSize;
        processed++;
      })
    );
    if (processed % 40 === 0 || processed === files.length) {
      console.log(`Processed ${processed}/${files.length} frames...`);
    }
  }

  const origMB = (totalOrigBytes / (1024 * 1024)).toFixed(2);
  const mobileMB = (totalMobileBytes / (1024 * 1024)).toFixed(2);
  const reduction = (((totalOrigBytes - totalMobileBytes) / totalOrigBytes) * 100).toFixed(1);

  console.log(`Done!`);
  console.log(`Original total: ${origMB} MB`);
  console.log(`Mobile variant total: ${mobileMB} MB (${reduction}% reduction)`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
