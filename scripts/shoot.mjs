import { spawn } from 'node:child_process';
import fs from 'node:fs';

const port = 9333;
const shots = [
  { name: 'home-desktop', url: 'http://localhost:4321/', width: 1440, height: 1100 },
  { name: 'home-mobile', url: 'http://localhost:4321/', width: 390, height: 844, mobile: true },
  { name: 'article-desktop', url: 'http://localhost:4321/articles/what-is-bitcoin/', width: 1440, height: 1300 },
  { name: 'article-mobile', url: 'http://localhost:4321/articles/what-is-bitcoin/', width: 390, height: 844, mobile: true },
];

fs.rmSync('/tmp/chrome-shoot', { recursive: true, force: true });
const chrome = spawn('google-chrome', [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--hide-scrollbars',
  `--remote-debugging-port=${port}`,
  '--user-data-dir=/tmp/chrome-shoot',
  'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForChrome() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {
      await sleep(150);
    }
  }
  throw new Error('Chrome did not start');
}

function cdp(ws) {
  let next = 1;
  return (method, params = {}) => {
    const id = next++;
    ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`timeout ${method}`)), 20000);
      const onMessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.id !== id) return;
        clearTimeout(timer);
        ws.removeEventListener('message', onMessage);
        if (data.error) reject(new Error(JSON.stringify(data.error)));
        else resolve(data.result);
      };
      ws.addEventListener('message', onMessage);
    });
  };
}

async function shoot(target) {
  const created = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(target.url)}`, { method: 'PUT' });
  const tab = await created.json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  const call = cdp(ws);
  await call('Emulation.setDeviceMetricsOverride', {
    width: target.width,
    height: target.height,
    deviceScaleFactor: 1,
    mobile: Boolean(target.mobile),
  });
  await call('Page.enable');
  await call('Page.navigate', { url: target.url });
  await sleep(900);
  if (target.theme) {
    await call('Runtime.evaluate', {
      expression: `document.documentElement.dataset.theme=${JSON.stringify(target.theme)}`,
    });
    await sleep(150);
  }
  if (target.selector) {
    await call('Runtime.evaluate', {
      expression: `document.querySelector(${JSON.stringify(target.selector)})?.scrollIntoView({block:'center'})`,
    });
    await sleep(250);
  }
  const result = await call('Page.captureScreenshot', { format: 'png', fromSurface: true });
  const file = `/tmp/sats-shots/${target.name}.png`;
  fs.writeFileSync(file, Buffer.from(result.data, 'base64'));
  console.log('wrote', file, fs.statSync(file).size);
  ws.close();
  await fetch(`http://127.0.0.1:${port}/json/close/${tab.id}`);
}

await waitForChrome();
for (const target of shots) {
  try {
    await shoot(target);
  } catch (error) {
    console.error('failed', target.name, error.message);
  }
}
chrome.kill('SIGKILL');
process.exit(0);
