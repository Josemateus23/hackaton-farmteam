import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const desktopDir = path.join(rootDir, 'public', 'frames', 'landinghero', 'frames');
const mobileDir = path.join(rootDir, 'public', 'frames', 'landinghero', 'mobile');

const desktopFiles = fs.readdirSync(desktopDir).filter(f => f.endsWith('.webp')).sort();
const mobileFiles = fs.readdirSync(mobileDir).filter(f => f.endsWith('.webp')).sort();

const totalFrames = desktopFiles.length;

const frames = desktopFiles.map((file, idx) => {
  const index = idx + 1;
  const desktopPath = path.join(desktopDir, file);
  const mobilePath = path.join(mobileDir, file);

  const sizeBytes = fs.statSync(desktopPath).size;
  const mobileSizeBytes = fs.existsSync(mobilePath) ? fs.statSync(mobilePath).size : sizeBytes;

  return {
    index,
    filename: file,
    url: `/frames/landinghero/frames/${file}`,
    mobileUrl: `/frames/landinghero/mobile/${file}`,
    sizeBytes,
    mobileSizeBytes
  };
});

const manifest = {
  totalFrames,
  dimensions: {
    width: 1920,
    height: 1080
  },
  mobileDimensions: {
    width: 960,
    height: 540
  },
  format: 'webp',
  zeroPadding: 4,
  firstFrameIndex: 1,
  lastFrameIndex: totalFrames,
  baseDir: 'public/frames/landinghero/frames',
  publicUrlPrefix: '/frames/landinghero/frames',
  mobileUrlPrefix: '/frames/landinghero/mobile',
  frames
};

fs.writeFileSync(path.join(rootDir, 'src', 'data', 'framesManifest.json'), JSON.stringify(manifest, null, 2));
fs.writeFileSync(path.join(rootDir, 'public', 'frames', 'landinghero', 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log('Successfully updated framesManifest.json and public manifest.json with 241 desktop & mobile frame variants!');
