import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const baseUrl = process.env.MOBILE_AUDIT_URL || 'http://127.0.0.1:4173';
const outputDir = 'tmp/mobile-audit';
const executablePath = process.env.MOBILE_AUDIT_BROWSER_PATH;

const viewports = [
  { name: '320', width: 320, height: 568 },
  { name: '360', width: 360, height: 740 },
  { name: '390', width: 390, height: 844 },
  { name: '430', width: 430, height: 932 },
  { name: '768', width: 768, height: 1024 },
];

const failures = [];

function recordFailure(viewport, project, message) {
  failures.push(`[${viewport}${project ? `/${project}` : ''}] ${message}`);
}

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath,
});

for (const viewport of viewports) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.width < 768,
    hasTouch: viewport.width < 768,
  });

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.locator('.heroNav').getByRole('link', { name: '쇼케이스' }).click();
  await page.waitForTimeout(250);

  const projects = await page.locator('[data-project-id]').evaluateAll((elements) => (
    elements.map((element) => element.getAttribute('data-project-id')).filter(Boolean)
  ));

  for (const project of projects) {
    await page.locator(`[data-project-id="${project}"]`).first().click();
    await page.waitForTimeout(250);

    const audit = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const showcase = document.querySelector('[data-mobile-showcase]');
      const liveFrame = document.querySelector('.liveFramePanel');
      const buttons = [...document.querySelectorAll('button, a')].map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          text: element.textContent.trim().slice(0, 40),
          width: rect.width,
          height: rect.height,
          visible: rect.width > 0 && rect.height > 0,
        };
      });

      const overflow = Math.max(body.scrollWidth, doc.scrollWidth) - window.innerWidth;
      const liveFrameVisible = liveFrame
        ? getComputedStyle(liveFrame).display !== 'none' && liveFrame.getBoundingClientRect().height > 0
        : false;

      let showcaseOverflow = 0;
      if (showcase) {
        const showcaseRect = showcase.getBoundingClientRect();
        const children = [...showcase.querySelectorAll('*')];
        for (const child of children) {
          const rect = child.getBoundingClientRect();
          showcaseOverflow = Math.max(
            showcaseOverflow,
            rect.right - showcaseRect.right,
            showcaseRect.left - rect.left,
          );
        }
      }

      return { overflow, liveFrameVisible, showcaseOverflow, buttons };
    });

    if (audit.overflow > 1) {
      recordFailure(viewport.name, project, `horizontal overflow ${Math.round(audit.overflow)}px`);
    }

    if (viewport.width < 768 && audit.liveFrameVisible) {
      recordFailure(viewport.name, project, 'live iframe panel is visible on mobile');
    }

    if (audit.showcaseOverflow > 1) {
      recordFailure(viewport.name, project, `mobile showcase child overflow ${Math.round(audit.showcaseOverflow)}px`);
    }

    const smallTargets = audit.buttons.filter((button) => (
      button.visible && (button.width < 44 || button.height < 44)
    ));

    if (smallTargets.length > 0) {
      recordFailure(
        viewport.name,
        project,
        `small touch targets: ${smallTargets.map((button) => `${button.text || 'button'} ${Math.round(button.width)}x${Math.round(button.height)}`).join(', ')}`,
      );
    }

    await page.screenshot({
      fullPage: true,
      path: `${outputDir}/${viewport.name}-${project}.png`,
    });
  }

  await page.close();
}

await browser.close();

if (failures.length > 0) {
  console.error('Mobile audit failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Mobile audit passed. Screenshots saved to ${outputDir}`);
