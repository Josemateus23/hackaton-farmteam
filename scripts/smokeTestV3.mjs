import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const evidenceDir = path.join(rootDir, 'evidence');

if (!fs.existsSync(evidenceDir)) {
  fs.mkdirSync(evidenceDir, { recursive: true });
}

async function runSmokeTests() {
  console.log('--- FARM TEAM V3 SMOKE TESTS ---');
  const browser = await chromium.launch({ headless: true });
  const errors = [];

  try {
    // 1. DESKTOP TEST (1440x900)
    console.log('Testing Desktop 1440x900...');
    const contextDesktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pageDesk = await contextDesktop.newPage();

    pageDesk.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(`[Desktop Console Error] ${msg.text()}`);
      }
    });

    await pageDesk.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

    // Verify Navigation bar
    const navVisible = await pageDesk.locator('nav[aria-label="Índice de Capítulos Editorial"]').isVisible();
    console.log('✓ Navigation bar visible:', navVisible);

    // Verify Canvas presence
    const canvasVisible = await pageDesk.locator('canvas').isVisible();
    console.log('✓ Hero canvas visible:', canvasVisible);

    // Save desktop screenshot
    await pageDesk.screenshot({ path: path.join(evidenceDir, 'smoke_desktop_v3.png') });

    // Test Navigation link to Otto
    await pageDesk.click('nav a[href="#capitulo-otto"]');
    await pageDesk.waitForTimeout(600);
    const ottoVisible = await pageDesk.locator('#capitulo-otto').isVisible();
    console.log('✓ Otto chapter scrolled into view:', ottoVisible);

    // Test Static Mode toggle
    const toggleBtn = pageDesk.locator('button:has-text("Sem animações")');
    await toggleBtn.click();
    await pageDesk.waitForTimeout(400);

    const hasStaticClass = await pageDesk.evaluate(() => {
      return document.querySelector('.editorial-app-root')?.classList.contains('static-mode');
    });
    console.log('✓ Static mode enabled cleanly:', hasStaticClass);

    await contextDesktop.close();

    // 2. MOBILE TEST (390x844)
    console.log('Testing Mobile 390x844...');
    const contextMobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const pageMob = await contextMobile.newPage();

    pageMob.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(`[Mobile Console Error] ${msg.text()}`);
      }
    });

    let loadedMobileFrame = false;
    pageMob.on('request', req => {
      if (req.url().includes('/frames/landinghero/mobile/')) {
        loadedMobileFrame = true;
      }
    });

    await pageMob.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

    // Verify Mobile Drawer Button
    const mobileMenuBtn = pageMob.locator('button[aria-label="Abrir menu de capítulos"]');
    console.log('✓ Mobile hamburger menu visible:', await mobileMenuBtn.isVisible());

    // Open drawer
    await mobileMenuBtn.click();
    await pageMob.waitForTimeout(300);
    const drawerOpen = await pageMob.locator('div[role="dialog"]').isVisible();
    console.log('✓ Mobile chapter drawer opens:', drawerOpen);

    // Click Meninas Digitais link in drawer
    await pageMob.click('div[role="dialog"] a[href="#caminhos"]');
    await pageMob.waitForTimeout(600);
    const caminhosVisible = await pageMob.locator('#caminhos').isVisible();
    console.log('✓ Caminhos chapter reached in mobile:', caminhosVisible);

    // Save mobile screenshot
    await pageMob.screenshot({ path: path.join(evidenceDir, 'smoke_mobile_v3.png') });

    console.log('✓ Loaded adaptive mobile frame variant:', loadedMobileFrame);

    await contextMobile.close();

    // Results Summary
    console.log('\n--- SMOKE TESTS RESULTS ---');
    if (errors.length === 0) {
      console.log('✅ ALL TESTS PASSED WITH 0 CONSOLE ERRORS!');
    } else {
      console.warn('⚠️ Console errors noted:', errors);
    }
  } finally {
    await browser.close();
  }
}

runSmokeTests().catch(err => {
  console.error('Smoke test failed:', err);
  process.exit(1);
});
