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
    args: [
      // Required for Docker version of Puppeteer
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      '--disable-dev-shm-usage'
    ],
  });
  const page = await browser.newPage();

  // globally init page
  await page.setViewport({
    width: options.init.width,
    height: options.init.height,
    deviceScaleFactor: 1,
  });

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
    return await renderIteration(options.charts);
  }

  if (process.env.NODE_ENV !== 'chartdev') {
    await browser.close();
  }
}

export async function* iterableRender(exporter: Exporter, options: RenderOptions) {
  const browser = await puppeteer.launch({
    headless: process.env.NODE_ENV === 'chartdev' ? false : true,
    devtools: process.env.NODE_ENV === 'chartdev' ? true : false,
    args: [
      // Required for Docker version of Puppeteer
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      '--disable-dev-shm-usage'
    ],
  });
  const page = await browser.newPage();

  // globally init page
  await page.setViewport({
    width: options.init.width,
    height: options.init.height,
    deviceScaleFactor: 1,
  });

  const renderIteration = async (chartOptions: ChartOptions) => {
    try {
      return await exporter.render(page, chartOptions, options.init);
    } catch (err) {
      console.error('Error throwed while rendering chart', err);
    }
  };

  if (typeof exporter.init === 'function') {
    await exporter.init(page, options.init);
  }

  if (typeof options.init.cb === 'function') {
    await options.init.cb(page);
  }

  if (options.charts instanceof Array) {
    for (const chartOptions of options.charts) {
      yield await renderIteration(chartOptions);
    }
  }
  else {
    yield await renderIteration(options.charts);
  }

  if (process.env.NODE_ENV !== 'chartdev') {
    await browser.close();
  }
}
