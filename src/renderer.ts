import * as puppeteer from 'puppeteer';
import {
  RenderOptions,
  InitOptions,
  ChartOptions,
  Exporter,
} from './interfaces';

export async function render(exporter: Exporter, options: RenderOptions) {
  const browser = await puppeteer.launch({
    headless: process.env.NODE_ENV === 'chartdev' ? false : true,
    devtools: process.env.NODE_ENV === 'chartdev' ? true : false,
  });
  const page = await browser.newPage();

  // globally init page
  await page.setViewport({
    width: options.init.width,
    height: options.init.height,
    deviceScaleFactor: 1,
  });

  if (options.init.jsInject instanceof Array) {
    for (const scriptOptions of options.init.jsInject) {
      await page.addScriptTag(scriptOptions);
    }
  }

  const renderIteration = async (chartOptions: ChartOptions) => {
    try {
      await exporter.render(page, chartOptions, options.init);
    } catch (err) {
      console.error('Error throwed while rendering chart', err);
    }
  };

  if (typeof exporter.init === 'function') {
    await exporter.init(page, options.init);
  }

  if (options.charts instanceof Array) {
    for (const chartOptions of options.charts) {
      await renderIteration(chartOptions);
    }
  }
  else {
    await renderIteration(options.charts);
  }

  if (process.env.NODE_ENV !== 'chartdev') {
    await browser.close();
  }
}
