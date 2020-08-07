const puppeteer = require('puppeteer');

async function render(exporter, options) {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
    ],
    headless: false,
    devtools: true,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: options.width || 1920,
    height: options.height || 1080,
    deviceScaleFactor: 1,
  });
  await exporter.render(page, options);
}

module.exports = {
  render,
};
