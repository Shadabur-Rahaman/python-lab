import { chromium } from '@playwright/test';
import fs from 'fs';

const port = 4175;
const baseURL = `http://127.0.0.1:${port}/python-lab/`;

async function benchmark() {
  console.log('Starting Phase 2 Python Startup Benchmark...');
  const browser = await chromium.launch();
  const results = {};

  // 1. Cold Browser Cache (Fresh Context)
  {
    console.log('\n--- Benchmark 1: Cold Browser Cache ---');
    const context = await browser.newContext();
    const page = await context.newPage();

    const tStart = Date.now();
    await page.goto(`${baseURL}#/chapter/1`, { waitUntil: 'networkidle' });
    const tNav = Date.now();

    const lab = page.locator('.first-10-ch1 .ch1-studio .code-lab');
    const runBtn = lab.getByRole('button', { name: 'Run Code' });
    await runBtn.waitFor({ state: 'visible' });
    const tReady = Date.now();

    const timeBeforeRunAction = tReady - tStart;
    console.log(`Time before Run Code available: ${timeBeforeRunAction} ms`);

    const tClick = Date.now();
    await runBtn.click();

    // Wait for output in console pre
    const consolePre = lab.locator('.console > pre');
    await consolePre.filter({ hasText: 'Hello, World!' }).waitFor({ state: 'visible', timeout: 60000 });
    const tOutput = Date.now();

    const executionTime = tOutput - tClick;
    console.log(`Time from clicking Run Code to first output: ${executionTime} ms`);

    results.coldCache = {
      timeBeforeRunActionMs: timeBeforeRunAction,
      executionTimeMs: executionTime,
      totalTimeToFirstOutputMs: tOutput - tStart,
    };
    await context.close();
  }

  // 2. Warm Browser Cache (Same Context, re-navigating after assets cached)
  {
    console.log('\n--- Benchmark 2: Warm Browser Cache ---');
    const context = await browser.newContext();
    const page = await context.newPage();

    // First load to warm cache
    await page.goto(`${baseURL}#/chapter/1`, { waitUntil: 'networkidle' });
    const lab = page.locator('.first-10-ch1 .ch1-studio .code-lab');
    const runBtn = lab.getByRole('button', { name: 'Run Code' });
    await runBtn.click();
    await lab.locator('.console > pre').filter({ hasText: 'Hello, World!' }).waitFor({ timeout: 60000 });

    // Now reload page with warm cache
    const tStart = Date.now();
    await page.reload({ waitUntil: 'networkidle' });
    const tReady = Date.now();

    const warmLab = page.locator('.first-10-ch1 .ch1-studio .code-lab');
    const warmRunBtn = warmLab.getByRole('button', { name: 'Run Code' });
    await warmRunBtn.waitFor({ state: 'visible' });

    const tClick = Date.now();
    await warmRunBtn.click();
    await warmLab.locator('.console > pre').filter({ hasText: 'Hello, World!' }).waitFor({ timeout: 30000 });
    const tOutput = Date.now();

    const executionTime = tOutput - tClick;
    console.log(`Warm cache time before Run Code: ${tReady - tStart} ms`);
    console.log(`Warm cache execution time: ${executionTime} ms`);

    results.warmCache = {
      timeBeforeRunActionMs: tReady - tStart,
      executionTimeMs: executionTime,
      totalTimeToFirstOutputMs: tOutput - tStart,
    };

    // 3. Warm Pyodide Worker Reuse (Worker already running in active session)
    console.log('\n--- Benchmark 3: Warm Worker Reuse ---');
    const editor = warmLab.getByLabel('Python code: first_program.py');
    await editor.fill('print("Reused worker message!")');

    const tReuseClick = Date.now();
    await warmRunBtn.click();
    await warmLab.locator('.console > pre').filter({ hasText: 'Reused worker message!' }).waitFor({ timeout: 15000 });
    const tReuseOutput = Date.now();

    const reuseExecutionTime = tReuseOutput - tReuseClick;
    console.log(`Warm worker reuse execution time: ${reuseExecutionTime} ms`);

    results.warmWorkerReuse = {
      executionTimeMs: reuseExecutionTime,
    };

    await context.close();
  }

  // 4. Simulated Slower Network (Fast 3G: 1.6 Mbps download, 750 kbps upload, 150ms RTT)
  {
    console.log('\n--- Benchmark 4: Simulated Slower Network (Fast 3G) ---');
    const context = await browser.newContext();
    const page = await context.newPage();

    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150, // ms
      downloadThroughput: (1.6 * 1024 * 1024) / 8, // bytes/sec
      uploadThroughput: (750 * 1024) / 8, // bytes/sec
    });

    const tStart = Date.now();
    await page.goto(`${baseURL}#/chapter/1`, { waitUntil: 'domcontentloaded' });

    const lab = page.locator('.first-10-ch1 .ch1-studio .code-lab');
    const runBtn = lab.getByRole('button', { name: 'Run Code' });
    await runBtn.waitFor({ state: 'visible', timeout: 30000 });

    const timeBeforeRunAction = Date.now() - tStart;
    console.log(`Fast 3G time before Run Code: ${timeBeforeRunAction} ms`);

    const tClick = Date.now();
    await runBtn.click();

    // Check that stage indicator appears
    const stageBar = lab.locator('.runtime-stage-bar');
    const stageVisible = await stageBar.isVisible().catch(() => false);
    console.log(`Stage progress indicator displayed: ${stageVisible}`);

    await lab.locator('.console > pre').filter({ hasText: 'Hello, World!' }).waitFor({ timeout: 120000 });
    const tOutput = Date.now();

    const executionTime = tOutput - tClick;
    console.log(`Fast 3G execution time: ${executionTime} ms`);

    results.simulatedFast3G = {
      timeBeforeRunActionMs: timeBeforeRunAction,
      executionTimeMs: executionTime,
      totalTimeToFirstOutputMs: tOutput - tStart,
      stageIndicatorDisplayed: stageVisible,
    };
    await context.close();
  }

  // 5. Representative Mobile Viewport (390x844)
  {
    console.log('\n--- Benchmark 5: Representative Mobile Viewport (390x844) ---');
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

    const timeBeforeRunAction = Date.now() - tStart;
    console.log(`Mobile time before Run Code: ${timeBeforeRunAction} ms`);

    const tClick = Date.now();
    await runBtn.click();
    await lab.locator('.console > pre').filter({ hasText: 'Hello, World!' }).waitFor({ timeout: 45000 });
    const tOutput = Date.now();

    const executionTime = tOutput - tClick;
    console.log(`Mobile execution time: ${executionTime} ms`);

    results.mobileViewport = {
      viewport: '390x844',
      timeBeforeRunActionMs: timeBeforeRunAction,
      executionTimeMs: executionTime,
      totalTimeToFirstOutputMs: tOutput - tStart,
    };
    await context.close();
  }

  await browser.close();
  fs.writeFileSync('docs/v20-benchmark-results.json', JSON.stringify(results, null, 2));
  console.log('\nBenchmark complete! Results saved to docs/v20-benchmark-results.json');
  console.log(JSON.stringify(results, null, 2));
}

benchmark().catch(err => {
  console.error('Benchmark error:', err);
  process.exit(1);
});
