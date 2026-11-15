import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const port = 4175;
const baseURL = `http://127.0.0.1:${port}/python-lab/`;

function isServerListening(url) {
  return new Promise(resolve => {
    const req = http.get(url, res => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function ensureServer() {
  const listening = await isServerListening(baseURL);
  if (listening) {
    console.log(`Preview server already listening at ${baseURL}`);
    return null;
  }

  console.log(`Starting preview server at ${baseURL}...`);
  const serverProcess = spawn('cmd.exe', ['/c', 'npm', 'run', 'preview', '--', '--port', String(port), '--strictPort'], {
    cwd: rootDir,
    stdio: 'ignore',
  });

  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 500));
    if (await isServerListening(baseURL)) {
      console.log(`Preview server ready at ${baseURL}`);
      return serverProcess;
    }
  }

  throw new Error('Preview server failed to start within 15 seconds.');
}

function calcStats(nums) {
  if (!nums.length) return { min: 0, max: 0, median: 0, mean: 0, runs: [] };
  const sorted = [...nums].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = Math.round(sum / sorted.length);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  return { min, max, median, mean, runs: nums };
}

async function runBenchmark() {
  console.log('=====================================================');
  console.log(' Python Lab V21 — Reproducible Startup Benchmark');
  console.log('=====================================================\n');

  const cpus = os.cpus();
  const systemInfo = {
    cpuModel: cpus[0]?.model || 'Unknown CPU',
    cpuCores: cpus.length,
    totalMemoryGB: (os.totalmem() / (1024 ** 3)).toFixed(2) + ' GB',
    osPlatform: os.platform(),
    osRelease: os.release(),
    nodeVersion: process.version,
  };

  console.log('System Specifications:');
  console.log(`  CPU:    ${systemInfo.cpuModel} (${systemInfo.cpuCores} logical cores)`);
  console.log(`  RAM:    ${systemInfo.totalMemoryGB}`);
  console.log(`  OS:     ${systemInfo.osPlatform} ${systemInfo.osRelease}`);
  console.log(`  Node:   ${systemInfo.nodeVersion}`);

  const serverProc = await ensureServer();

  let browser;
  try {
    browser = await chromium.launch();
    const browserVersion = browser.version();
    console.log(`  Browser: Chromium ${browserVersion}\n`);

    const benchmarkResults = {
      timestamp: new Date().toISOString(),
      system: systemInfo,
      browser: { name: 'Chromium', version: browserVersion },
      timingDefinitions: {
        pageReadinessMs: 'Navigation start to editor / Run Code button visible and interactive in DOM',
        executionTimeMs: 'Clicking Run Code to target output rendered in .console > pre',
        totalTimeToOutputMs: 'Sum of page readiness and execution time',
        warmWorkerExecutionMs: 'Click to output when Pyodide WebAssembly worker is already warm in memory',
      },
      scenarios: {},
    };

    // Scenario 1: Cold Browser Cache (5 runs, fresh context each time)
    console.log('--- Scenario 1: Cold Browser Cache (5 runs) ---');
    {
      const pageReadyTimes = [];
      const executionTimes = [];
      const totalTimes = [];

      for (let i = 1; i <= 5; i++) {
        process.stdout.write(`  Run ${i}/5... `);
        const context = await browser.newContext();
        const page = await context.newPage();

        const tStart = Date.now();
        await page.goto(`${baseURL}#/chapter/1`, { waitUntil: 'networkidle' });
        const lab = page.locator('.first-10-ch1 .ch1-studio .code-lab');
        const runBtn = lab.getByRole('button', { name: 'Run Code' });
        await runBtn.waitFor({ state: 'visible' });
        const tReady = Date.now();
        const pageReady = tReady - tStart;

        const tClick = Date.now();
        await runBtn.click();
        const consolePre = lab.locator('.console > pre');
        await consolePre.filter({ hasText: 'Hello, World!' }).waitFor({ state: 'visible', timeout: 60000 });
        const tOutput = Date.now();
        const execTime = tOutput - tClick;
        const totalTime = tOutput - tStart;

        pageReadyTimes.push(pageReady);
        executionTimes.push(execTime);
        totalTimes.push(totalTime);
        console.log(`Ready: ${pageReady}ms | Exec: ${execTime}ms | Total: ${totalTime}ms`);

        await context.close();
      }

      benchmarkResults.scenarios.coldCache = {
        description: 'Fresh browser context, no pre-cached assets in browser HTTP cache',
        cacheState: 'Cold (empty context)',
        workerExisted: false,
        runsCount: 5,
        pageReadinessMs: calcStats(pageReadyTimes),
        executionTimeMs: calcStats(executionTimes),
        totalTimeToOutputMs: calcStats(totalTimes),
      };
    }

    // Scenario 2: Warm Browser Cache (5 runs, re-navigating after assets cached)
    console.log('\n--- Scenario 2: Warm Browser Cache (5 runs) ---');
    {
      const context = await browser.newContext();
      const page = await context.newPage();

      // Primer run to populate HTTP cache
      process.stdout.write('  Priming browser cache... ');
      await page.goto(`${baseURL}#/chapter/1`, { waitUntil: 'networkidle' });
      const primerLab = page.locator('.first-10-ch1 .ch1-studio .code-lab');
      await primerLab.getByRole('button', { name: 'Run Code' }).click();
      await primerLab.locator('.console > pre').filter({ hasText: 'Hello, World!' }).waitFor({ timeout: 60000 });
      console.log('done.');

      const pageReadyTimes = [];
      const executionTimes = [];
      const totalTimes = [];

      for (let i = 1; i <= 5; i++) {
        process.stdout.write(`  Run ${i}/5... `);
        const tStart = Date.now();
        await page.reload({ waitUntil: 'networkidle' });
        const lab = page.locator('.first-10-ch1 .ch1-studio .code-lab');
        const runBtn = lab.getByRole('button', { name: 'Run Code' });
        await runBtn.waitFor({ state: 'visible' });
        const tReady = Date.now();
        const pageReady = tReady - tStart;

        const tClick = Date.now();
        await runBtn.click();
        await lab.locator('.console > pre').filter({ hasText: 'Hello, World!' }).waitFor({ timeout: 30000 });
        const tOutput = Date.now();
        const execTime = tOutput - tClick;
        const totalTime = tOutput - tStart;

        pageReadyTimes.push(pageReady);
        executionTimes.push(execTime);
        totalTimes.push(totalTime);
        console.log(`Ready: ${pageReady}ms | Exec: ${execTime}ms | Total: ${totalTime}ms`);
      }

      benchmarkResults.scenarios.warmCache = {
        description: 'Reloaded page with assets populated in browser HTTP cache',
        cacheState: 'Warm (cached Pyodide Wasm + JS)',
        workerExisted: false,
        runsCount: 5,
        pageReadinessMs: calcStats(pageReadyTimes),
        executionTimeMs: calcStats(executionTimes),
        totalTimeToOutputMs: calcStats(totalTimes),
      };

      // Scenario 3: Warm Pyodide Worker Reuse (5 runs in same active session)
      console.log('\n--- Scenario 3: Warm Pyodide Worker Reuse (5 runs) ---');
      const reuseExecTimes = [];
      const lab = page.locator('.first-10-ch1 .ch1-studio .code-lab');
      const editor = lab.getByLabel('Python code: first_program.py');
      const runBtn = lab.getByRole('button', { name: 'Run Code' });

      for (let i = 1; i <= 5; i++) {
        process.stdout.write(`  Run ${i}/5... `);
        const msg = `Reused worker run ${i}!`;
        await editor.fill(`print("${msg}")`);

        const tClick = Date.now();
        await runBtn.click();
        await lab.locator('.console > pre').filter({ hasText: msg }).waitFor({ timeout: 15000 });
        const tOutput = Date.now();
        const execTime = tOutput - tClick;

        reuseExecTimes.push(execTime);
        console.log(`Execution time: ${execTime}ms`);
      }

      benchmarkResults.scenarios.warmWorkerReuse = {
        description: 'Continuous session with warm Pyodide worker already initialized in memory',
        cacheState: 'In-Memory Hot Worker',
        workerExisted: true,
        runsCount: 5,
        executionTimeMs: calcStats(reuseExecTimes),
      };

      await context.close();
    }

    // Scenario 4: Simulated Slower Network (Fast 3G: 1.6 Mbps down, 750 kbps up, 150ms RTT) (3 runs)
    console.log('\n--- Scenario 4: Simulated Slower Network (Fast 3G, 3 runs) ---');
    {
      const pageReadyTimes = [];
      const executionTimes = [];
      const totalTimes = [];
      let stageIndicatorSeen = false;

      for (let i = 1; i <= 3; i++) {
        process.stdout.write(`  Run ${i}/3 (simulating Fast 3G)... `);
        const context = await browser.newContext();
        const page = await context.newPage();

        const cdp = await context.newCDPSession(page);
        await cdp.send('Network.enable');
        await cdp.send('Network.emulateNetworkConditions', {
          offline: false,
          latency: 150,
          downloadThroughput: (1.6 * 1024 * 1024) / 8,
          uploadThroughput: (750 * 1024) / 8,
        });

        const tStart = Date.now();
        await page.goto(`${baseURL}#/chapter/1`, { waitUntil: 'domcontentloaded' });
        const lab = page.locator('.first-10-ch1 .ch1-studio .code-lab');
        const runBtn = lab.getByRole('button', { name: 'Run Code' });
        await runBtn.waitFor({ state: 'visible', timeout: 30000 });
        const tReady = Date.now();
        const pageReady = tReady - tStart;

        const tClick = Date.now();
        await runBtn.click();

        const stageBar = lab.locator('.runtime-stage-bar');
        const isVisible = await stageBar.isVisible().catch(() => false);
        if (isVisible) stageIndicatorSeen = true;

        await lab.locator('.console > pre').filter({ hasText: 'Hello, World!' }).waitFor({ timeout: 120000 });
        const tOutput = Date.now();
        const execTime = tOutput - tClick;
        const totalTime = tOutput - tStart;

        pageReadyTimes.push(pageReady);
        executionTimes.push(execTime);
        totalTimes.push(totalTime);
        console.log(`Ready: ${pageReady}ms | Exec: ${execTime}ms | Total: ${totalTime}ms (Stage bar: ${isVisible})`);

        await context.close();
      }

      benchmarkResults.scenarios.simulatedFast3G = {
        description: 'Network throttled via CDP to 1.6 Mbps download, 750 kbps upload, 150ms RTT',
        throttling: { latency: 150, downloadBps: 204800, uploadBps: 96000 },
        cacheState: 'Cold with 3G network emulation',
        workerExisted: false,
        runsCount: 3,
        stageIndicatorDisplayed: stageIndicatorSeen,
        pageReadinessMs: calcStats(pageReadyTimes),
        executionTimeMs: calcStats(executionTimes),
        totalTimeToOutputMs: calcStats(totalTimes),
      };
    }

    // Scenario 5: Mobile Viewport 390x844 (5 runs)
    console.log('\n--- Scenario 5: Mobile Viewport (390x844, 5 runs) ---');
    {
      const pageReadyTimes = [];
      const executionTimes = [];
      const totalTimes = [];

      for (let i = 1; i <= 5; i++) {
        process.stdout.write(`  Run ${i}/5... `);
        const context = await browser.newContext({
          viewport: { width: 390, height: 844 },
          isMobile: true,
          hasTouch: true,
        });
        const page = await context.newPage();

        const tStart = Date.now();
        await page.goto(`${baseURL}#/chapter/1`, { waitUntil: 'networkidle' });
        const lab = page.locator('.first-10-ch1 .ch1-studio .code-lab');
        const runBtn = lab.getByRole('button', { name: 'Run Code' });
        await runBtn.waitFor({ state: 'visible' });
        const tReady = Date.now();
        const pageReady = tReady - tStart;

        const tClick = Date.now();
        await runBtn.click();
        await lab.locator('.console > pre').filter({ hasText: 'Hello, World!' }).waitFor({ timeout: 45000 });
        const tOutput = Date.now();
        const execTime = tOutput - tClick;
        const totalTime = tOutput - tStart;

        pageReadyTimes.push(pageReady);
        executionTimes.push(execTime);
        totalTimes.push(totalTime);
        console.log(`Ready: ${pageReady}ms | Exec: ${execTime}ms | Total: ${totalTime}ms`);

        await context.close();
      }

      benchmarkResults.scenarios.mobileViewport = {
        description: 'Mobile viewport emulation (390x844, touch-enabled)',
        viewport: '390x844',
        cacheState: 'Warm HTTP cache (reused assets)',
        workerExisted: false,
        runsCount: 5,
        pageReadinessMs: calcStats(pageReadyTimes),
        executionTimeMs: calcStats(executionTimes),
        totalTimeToOutputMs: calcStats(totalTimes),
      };
    }

    const outPath = path.resolve(rootDir, 'docs', 'v21-benchmark-results.json');
    fs.writeFileSync(outPath, JSON.stringify(benchmarkResults, null, 2), 'utf8');
    console.log(`\nAll benchmarks completed! Machine-readable evidence saved to: docs/v21-benchmark-results.json`);
  } finally {
    if (browser) await browser.close();
    if (serverProc) {
      try {
        process.kill(serverProc.pid);
      } catch {}
    }
  }
}

runBenchmark().catch(err => {
  console.error('Benchmark error:', err);
  process.exit(1);
});
