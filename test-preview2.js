import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:4173');
  await page.evaluate(() => {
    localStorage.setItem('kairaboard.phase2', JSON.stringify({
      state: {
        user: { id: "1", email: "test@test.com", provider: "email", displayName: "Test", isAdmin: false },
        boards: [],
        messages: [],
        plan: "free"
      },
      version: 3
    }));
  });

  await page.goto('http://localhost:4173/app');
  await new Promise(r => setTimeout(r, 3000));
  await browser.close();
})();
