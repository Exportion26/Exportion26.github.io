const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        } else {
            console.log('Console:', msg.text());
        }
    });
    page.on('pageerror', err => {
        errors.push(err.message);
    });
    
    try {
        await page.goto('file:///workspace/resume-website/index.html', { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        
        console.log('=== Page loaded successfully! ===');
        console.log('Title:', await page.title());
        
        if (errors.length > 0) {
            console.log('Console Errors:', errors);
        } else {
            console.log('No console errors found!');
        }
        
        // Check key elements
        const profileHeader = await page.$('.profile-header');
        const cards = await page.$$('.card');
        const contactItems = await page.$$('.contact-item');
        const skillTags = await page.$$('.skill-tag');
        
        console.log('Profile Header found:', !!profileHeader);
        console.log('Number of cards:', cards.length);
        console.log('Contact items:', contactItems.length);
        console.log('Skill tags:', skillTags.length);
        
    } catch (err) {
        console.error('Error:', err.message);
    }
    
    await browser.close();
    console.log('=== Test completed ===');
})();
