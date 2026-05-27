import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import net from 'node:net';
import { chromium } from '@playwright/test';

const host = '127.0.0.1';
const preferredPort = Number(process.env.PORTFOLIO_QA_PORT || 4173);
const outputDir = 'test-results/portfolio';
const screenshotDir = `${outputDir}/screenshots`;

const viewports = [
  { name: 'mobile-390x844', width: 390, height: 844 },
  { name: 'tablet-768x1024', width: 768, height: 1024 },
  { name: 'desktop-1440x900', width: 1440, height: 900 },
];

const failures = [];
const summary = [];
const expectedProjects = [
  {
    id: 'caredoc',
    label: 'CareDoc',
    demoPath: '/clones/caredoc/index.html?portfolio=1&v=20260525-0025',
    screenshotBase: '/project-shots/caredoc/',
  },
  {
    id: 'fixchecker',
    label: 'Subtitle Fix Checker',
    demoPath: '/clones/subtitle-fix-checker/',
    screenshotBase: '/project-shots/fixchecker/',
  },
  {
    id: 'lucid',
    label: 'Lucid',
    demoPath: '/clones/lucid/',
    screenshotBase: '/project-shots/lucid/',
  },
  {
    id: 'reallife',
    label: 'RealLife',
    demoPath: '/clones/reallife/',
    screenshotBase: '/project-shots/reallife/',
  },
];
const requiredSections = ['home', 'about', 'experience', 'projects', 'books', 'contact'];
const expectedContactLinks = [
  { label: 'GitHub', href: 'https://github.com/HYEOKJUNCHOI' },
  { label: 'Email', href: 'mailto:gurwns369@naver.com' },
  { label: 'Brunch', href: 'https://brunch.co.kr/@solbin369' },
];
const forbiddenBookRequestPatterns = [
  /openlibrary/i,
  /googleapis\.com\/books/i,
  /yes24/i,
  /naver/i,
  /isbn/i,
  /book/i,
];

function recordFailure(viewport, message) {
  failures.push(`[${viewport}] ${message}`);
}

async function waitForServer(url, timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url, { method: 'GET' });
      if (response.ok) {
        return;
      }
    } catch {
      // Keep polling until timeout.
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`Timed out waiting for server at ${url}`);
}

function startPreviewServer(port) {
  if (process.platform === 'win32') {
    const comspec = process.env.ComSpec || 'cmd.exe';
    const command = `npm run preview -- --host ${host} --port ${port} --strictPort`;
    return spawn(comspec, ['/d', '/s', '/c', command], {
      stdio: 'inherit',
      env: process.env,
    });
  }

  return spawn('npm', ['run', 'preview', '--', '--host', host, '--port', String(port), '--strictPort'], {
    stdio: 'inherit',
    env: process.env,
  });
}

function stopServerProcess(serverProcess) {
  return new Promise((resolve) => {
    if (!serverProcess || serverProcess.killed) {
      resolve();
      return;
    }

    if (process.platform === 'win32') {
      const killer = spawn('taskkill', ['/PID', String(serverProcess.pid), '/T', '/F'], {
        stdio: 'ignore',
      });
      killer.once('exit', () => resolve());
      killer.once('error', () => resolve());
      return;
    }

    serverProcess.kill('SIGTERM');
    serverProcess.once('exit', () => resolve());
    serverProcess.once('error', () => resolve());
  });
}

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, host);
  });
}

async function findAvailablePort(startPort) {
  for (let candidate = startPort; candidate <= startPort + 20; candidate += 1) {
    if (await isPortAvailable(candidate)) {
      return candidate;
    }
  }
  throw new Error(`No available port found in range ${startPort}-${startPort + 20}`);
}

await mkdir(screenshotDir, { recursive: true });

const runtimePort = process.env.PORTFOLIO_QA_URL ? null : await findAvailablePort(preferredPort);
const baseUrl = process.env.PORTFOLIO_QA_URL || `http://${host}:${runtimePort}`;
const serverProcess = process.env.PORTFOLIO_QA_URL ? null : startPreviewServer(runtimePort);

try {
  await waitForServer(baseUrl);

  const browser = await chromium.launch();

  for (const viewport of viewports) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.width < 768,
      hasTouch: viewport.width < 768,
    });

    const seenBookRequests = [];
    page.on('request', (request) => {
      const url = request.url();
      if (forbiddenBookRequestPatterns.some((pattern) => pattern.test(url))) {
        seenBookRequests.push(url);
      }
    });

    await page.goto(baseUrl, { waitUntil: 'networkidle' });

    for (const sectionId of requiredSections) {
      const section = page.locator(`section#${sectionId}`);
      if (await section.count() !== 1) {
        recordFailure(viewport.name, `Required section #${sectionId} not found exactly once.`);
      }
    }

    const heroHeading = page.getByRole('heading', { level: 1 });
    if (await heroHeading.count() === 0) {
      recordFailure(viewport.name, 'Hero h1 heading not found.');
    } else {
      const heroText = (await heroHeading.first().innerText()).replace(/\s+/g, ' ').trim();
      if (!heroText.includes('최혁준')) {
        recordFailure(viewport.name, `Hero text does not include 최혁준. Found: ${heroText}`);
      }
    }

    const heroIdentity = page.locator('.heroLead .identityLine');
    if (await heroIdentity.count() === 0) {
      recordFailure(viewport.name, 'Hero identity line not found.');
    } else {
      const identityText = (await heroIdentity.first().innerText()).trim();
      if (identityText !== '불편한 반복을 줄이는 개발자') {
        recordFailure(viewport.name, `Hero identity phrase mismatch: ${identityText}`);
      }
    }

    const forbiddenTextRegex = /LinkedIn|\bNotes\b/i;
    const fullText = await page.locator('body').innerText();
    if (forbiddenTextRegex.test(fullText)) {
      recordFailure(viewport.name, 'Forbidden public text found in page body (LinkedIn or Notes).');
    }

    const notesSection = page.locator('section#notes, a[href="#notes"], [id="notes"]');
    if (await notesSection.count() > 0) {
      recordFailure(viewport.name, 'Notes section/link should not exist.');
    }

    const booksSection = page.locator('section#books');
    const booksHeading = page.getByRole('heading', { name: /아직 비어 있지만, 책장을 닮은 준비 공간/ });
    const booksCopy = page.getByText('실제 독서 데이터나 외부 도서 검색은 넣지 않았습니다.', { exact: false });
    const isbnInput = page.locator('#isbn-preview-input');
    const isbnButton = page.getByRole('button', { name: '등록 준비중' });

    if (await booksSection.count() !== 1) {
      recordFailure(viewport.name, 'Books section (#books) not found exactly once.');
    }
    if (await booksHeading.count() === 0) {
      recordFailure(viewport.name, 'Books heading not found.');
    }
    if (await booksCopy.count() === 0) {
      recordFailure(viewport.name, 'Books explanatory copy not found.');
    }
    if (await isbnInput.count() !== 1 || !(await isbnInput.isDisabled())) {
      recordFailure(viewport.name, 'ISBN input should exist and be disabled.');
    }
    if (await isbnButton.count() !== 1 || !(await isbnButton.isDisabled())) {
      recordFailure(viewport.name, 'ISBN action button should exist and be disabled.');
    }

    const contactSection = page.locator('section#contact');
    const contactCards = page.locator('.contactLinkGrid a.contactLinkCard');
    const contactCount = await contactCards.count();
    if (await contactSection.count() !== 1) {
      recordFailure(viewport.name, 'Contact section (#contact) not found exactly once.');
    }
    if (contactCount !== 3) {
      recordFailure(viewport.name, `Expected 3 contact cards/links but found ${contactCount}.`);
    }
    for (const contact of expectedContactLinks) {
      const link = page.locator(`.contactLinkGrid a.contactLinkCard[href="${contact.href}"]`);
      if (await link.count() !== 1) {
        recordFailure(viewport.name, `Contact href missing or duplicated for ${contact.label}: ${contact.href}`);
        continue;
      }
      if (await link.getByText(contact.label, { exact: true }).count() === 0) {
        recordFailure(viewport.name, `Contact label text missing for ${contact.label}.`);
      }
    }
    const linkedInTextInContact = await page.locator('#contact').getByText('LinkedIn', { exact: false }).count();
    if (linkedInTextInContact > 0) {
      recordFailure(viewport.name, 'LinkedIn text found inside Contact section.');
    }

    const projectCards = page.locator('.projectCard');
    const projectCount = await projectCards.count();
    if (projectCount !== expectedProjects.length) {
      recordFailure(viewport.name, `Expected 4 project cards but found ${projectCount}.`);
    }

    for (const project of expectedProjects) {
      const projectCard = page.locator(`.projectCard[data-project-id="${project.id}"]`);
      if (await projectCard.count() !== 1) {
        recordFailure(viewport.name, `${project.label} project card not found.`);
        continue;
      }

      if (await projectCard.getByText(project.label, { exact: true }).count() === 0) {
        recordFailure(viewport.name, `${project.label} visible project name not found.`);
      }

      if (await projectCard.locator('.projectTeaserVisual').count() !== 1) {
        recordFailure(viewport.name, `${project.label} CSS teaser visual not found.`);
      }
    }

    const firstCard = projectCards.first();
    if (await firstCard.count() > 0) {
      await firstCard.focus();
      const firstFocused = await firstCard.evaluate((node) => node === document.activeElement);
      if (!firstFocused) {
        recordFailure(viewport.name, 'Failed to focus first project card via keyboard.');
      }

      await page.keyboard.press('Enter');
      await page.waitForTimeout(150);

      const detailPanel = page.locator('.detailPanel.showcaseStage');
      const detailCount = await detailPanel.count();
      if (detailCount !== 1) {
        recordFailure(viewport.name, `Expected opened detail panel count 1 but found ${detailCount}.`);
      }

      const expanded = await firstCard.getAttribute('aria-expanded');
      if (expanded !== 'true') {
        recordFailure(viewport.name, `Expected first project card aria-expanded=true but found ${expanded}.`);
      }

      const closeButton = page.getByRole('button', { name: '프로젝트 상세 패널 닫기' });
      if (await closeButton.count() === 0) {
        recordFailure(viewport.name, 'Detail panel close button with accessible name not found.');
      }

      const panelFocused = await detailPanel.evaluate((node) => node === document.activeElement);
      if (!panelFocused) {
        recordFailure(viewport.name, 'Detail panel did not receive focus after opening.');
      }

      const activeCount = await page.locator('.projectCard.active').count();
      if (activeCount !== 1) {
        recordFailure(viewport.name, `Expected 1 active project card after click but found ${activeCount}.`);
      }

      await page.keyboard.press('Escape');
      await page.waitForTimeout(120);
      const detailAfterClose = await page.locator('.detailPanel.showcaseStage').count();
      if (detailAfterClose !== 0) {
        recordFailure(viewport.name, `Expected detail panel to close on Escape but found ${detailAfterClose}.`);
      }

      const focusReturned = await firstCard.evaluate((node) => node === document.activeElement);
      if (!focusReturned) {
        recordFailure(viewport.name, 'Focus did not return to opening project card after closing detail panel.');
      }

      const collapsed = await firstCard.getAttribute('aria-expanded');
      if (collapsed !== 'false') {
        recordFailure(viewport.name, `Expected first project card aria-expanded=false after close but found ${collapsed}.`);
      }
    }

    for (const project of expectedProjects) {
      const projectCard = page.locator(`.projectCard[data-project-id="${project.id}"]`);
      await projectCard.click();
      await page.waitForTimeout(150);

      const detailPanel = page.locator('.detailPanel.showcaseStage');
      if (await detailPanel.count() !== 1) {
        recordFailure(viewport.name, `${project.label} detail panel did not open.`);
        continue;
      }

      const detailFocused = await detailPanel.evaluate((node) => node === document.activeElement);
      if (!detailFocused) {
        recordFailure(viewport.name, `${project.label} detail panel did not receive focus.`);
      }

      const demoLink = page.locator(`[data-project-demo="${project.id}"]`);
      const demoHref = await demoLink.getAttribute('href');
      if (demoHref !== project.demoPath) {
        recordFailure(viewport.name, `${project.label} demo href mismatch: ${demoHref}`);
      }

      const screenshotAudit = await detailPanel.evaluate((panel, screenshotBase) => {
        const images = [...panel.querySelectorAll('.screenshotSlot img')];
        const expectedSources = Array.from({ length: 6 }, (_, index) => `${screenshotBase}${String(index + 1).padStart(2, '0')}.jpg`);
        const loadedSources = images.map((img) => img.getAttribute('src'));
        const missingSources = expectedSources.filter((src) => !loadedSources.includes(src));
        const brokenSources = images
          .filter((img) => !img.complete || img.naturalWidth === 0)
          .map((img) => img.getAttribute('src') || '(unknown)');
        return { imageCount: images.length, missingSources, brokenSources };
      }, project.screenshotBase);

      if (screenshotAudit.imageCount !== 6) {
        recordFailure(viewport.name, `${project.label} expected 6 screenshots but found ${screenshotAudit.imageCount}.`);
      }
      if (screenshotAudit.missingSources.length > 0) {
        recordFailure(viewport.name, `${project.label} missing screenshots: ${screenshotAudit.missingSources.join(', ')}`);
      }
      if (screenshotAudit.brokenSources.length > 0) {
        recordFailure(viewport.name, `${project.label} broken screenshots: ${screenshotAudit.brokenSources.join(', ')}`);
      }

      await page.keyboard.press('Escape');
      await page.waitForTimeout(120);
      const closed = await page.locator('.detailPanel.showcaseStage').count();
      if (closed !== 0) {
        recordFailure(viewport.name, `${project.label} detail panel did not close on Escape.`);
      }
      const focusReturnedToProject = await projectCard.evaluate((node) => node === document.activeElement);
      if (!focusReturnedToProject) {
        recordFailure(viewport.name, `${project.label} focus did not return to trigger after Escape.`);
      }
    }

    const imageAudit = await page.evaluate(() => {
      const images = [...document.images];
      const broken = images
        .filter((img) => img.closest('.detailPanel') || img.closest('.profilePhotoFrame'))
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.getAttribute('src') || '(unknown)');
      return { total: images.length, broken };
    });

    if (imageAudit.broken.length > 0) {
      recordFailure(viewport.name, `Broken images detected: ${imageAudit.broken.join(', ')}`);
    }

    const overflowX = await page.evaluate(() => {
      const doc = document.documentElement;
      return Math.max(0, doc.scrollWidth - window.innerWidth);
    });
    if (overflowX > 1) {
      recordFailure(viewport.name, `Horizontal overflow detected: ${Math.round(overflowX)}px.`);
    }

    await page.emulateMedia({ reducedMotion: 'reduce' });
    const reducedMotionOk = await page.locator('.pageShell').count();
    if (reducedMotionOk === 0) {
      recordFailure(viewport.name, 'Reduced motion rendering check failed.');
    }

    if (seenBookRequests.length > 0) {
      recordFailure(viewport.name, `Unexpected book API/network request(s): ${seenBookRequests.join(', ')}`);
    }

    await page.screenshot({
      path: `${screenshotDir}/${viewport.name}.png`,
      fullPage: true,
    });

    summary.push({
      viewport: viewport.name,
      totalImages: imageAudit.total,
      brokenImages: imageAudit.broken.length,
      overflowX,
      projectCount,
      contactCount,
      bookRequestCount: seenBookRequests.length,
    });

    await page.close();
  }

  await browser.close();
} finally {
  await stopServerProcess(serverProcess);
}

const report = {
  timestamp: new Date().toISOString(),
  baseUrl,
  viewports,
  summary,
  failures,
};

await writeFile(`${outputDir}/summary.json`, JSON.stringify(report, null, 2), 'utf8');

if (failures.length > 0) {
  console.error('Portfolio smoke failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  console.error(`Evidence saved to ${outputDir}`);
  process.exit(1);
}

console.log(`Portfolio smoke passed. Evidence saved to ${outputDir}`);
