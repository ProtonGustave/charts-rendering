import puppeteer from 'puppeteer';
import {
  RenderOptions,
  Exporter,
} from './interfaces';

export async function render(exporter: Exporter, options: RenderOptions|RenderOptions[]) {
  const browser = await puppeteer.launch({
    // args: [
    //   '--no-sandbox',
    // ],
    // headless: false,
    // devtools: true,
  });
  const page = await browser.newPage();

  const renderIteration = async (options: RenderOptions) => {
    await page.setViewport({
      width: options.width || 1920,
      height: options.height || 1080,
      deviceScaleFactor: 1,
    });

    try {
      await exporter.render(page, options);
    } catch (err) {
      console.error('Error throwed while rendering chart', err);
    }
  };

  if (typeof exporter.init === 'function') {
    await exporter.init(page);
  }

  if (options instanceof Array) {
    for (const optionsItem of options) {
      await renderIteration(optionsItem);
    }
  }
  else {
    await renderIteration(options);
  }

  await browser.close();
}
