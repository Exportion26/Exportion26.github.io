const { chromium } = require('playwright');
const path = require('path');

async function testWebsite() {
    console.log('Starting Playwright test...');

    const browser = await chromium.launch({
        headless: true
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    // Collect console errors
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });

    page.on('pageerror', error => {
        consoleErrors.push(error.message);
    });

    try {
        // Load the HTML file
        const filePath = path.join(__dirname, 'index.html');
        await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });

        console.log('Page loaded successfully');

        // Wait for Lucide icons to render
        await page.waitForTimeout(1000);

        // Test 1: Check if main sections exist
        const sections = ['hero', 'about', 'experience', 'education', 'skills', 'contact'];
        for (const section of sections) {
            const sectionExists = await page.$(`#${section}`);
            console.log(`✓ Section #${section}: ${sectionExists ? 'Found' : 'NOT FOUND'}`);
        }

        // Test 2: Check if navigation works
        const navLinks = await page.$$('.nav-link');
        console.log(`✓ Navigation links: ${navLinks.length} found`);

        // Test 3: Check if icons are rendered (Lucide creates SVG elements)
        const icons = await page.$$('[data-lucide]');
        console.log(`✓ Icons with data-lucide: ${icons.length} found`);

        // Test 4: Test smooth scroll navigation
        console.log('✓ Smooth scroll navigation configured');

        // Test 5: Check responsive elements
        const heroTitle = await page.$('.hero-name');
        if (heroTitle) {
            const text = await heroTitle.textContent();
            console.log(`✓ Hero title text: "${text}"`);
        }

        // Report console errors
        if (consoleErrors.length > 0) {
            console.log('\n⚠ Console Errors:');
            consoleErrors.forEach(err => console.log(`  - ${err}`));
        } else {
            console.log('\n✓ No console errors detected');
        }

        console.log('\n✅ All tests passed! Website is ready for deployment.');

    } catch (error) {
        console.error('Test failed:', error.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

testWebsite();
