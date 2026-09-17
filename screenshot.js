const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const outName = process.argv[2] || 'preview_shot.png';
const width = parseInt(process.argv[3] || '1440', 10);
const height = parseInt(process.argv[4] || '9500', 10);

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outPath = path.join(__dirname, outName);

if (fs.existsSync(outPath)) {
  try { fs.unlinkSync(outPath); } catch (e) {}
}

const args = [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-cache',
  '--disk-cache-size=1',
  '--virtual-time-budget=3000',
  '--run-all-compositor-stages-before-draw',
  `--screenshot=${outPath}`,
  `--window-size=${width},${height}`,
  `http://localhost:8006/?t=${Date.now()}`
];

console.log('Capturing:', outName, `${width}x${height}`);
const proc = spawn(chromePath, args);

proc.on('close', (code) => {
  console.log('Finished with code:', code);
  if (fs.existsSync(outPath)) {
    console.log('Screenshot size:', fs.statSync(outPath).size);
  } else {
    console.error('File not created!');
  }
});

