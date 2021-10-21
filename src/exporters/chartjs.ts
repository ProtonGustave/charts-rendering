import { ChartConfiguration } from 'chart.js';
import path from 'path';
import {
  RenderOptions,
  ChartOptions,
  InitOptions,
  Exporter,
} from '../interfaces';
import {
  Page,
  ElementHandle,
  JSONObject,
  EvaluateFn
} from 'puppeteer';
import serialize from 'serialize-javascript';

const modulePath = path.dirname(require.resolve('chart.js'));

console.log("HERE WE GO");

console.log(require.resolve('chart.js'));

export interface ChartjsRenderOptions extends ChartOptions {
  config: ChartConfiguration;
  chartWidth?: number;
  chartHeight?: number;
}

const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

// TODO: solve mangle issue more elegantly
async function init(page: Page) {
  await page.addScriptTag({
    path: modulePath + '/Chart.min.js',
  });
  // create main element
  await page.setContent(`<canvas id="container"></canvas>`);
  // disable features needed for interactive usage
  await page.evaluate(new AsyncFunction(`
    Object.assign(Chart.defaults, {
      animation: false,
      responsive: false,
    });
  `) as EvaluateFn);
}

async function render(page: Page, options: ChartjsRenderOptions, init: InitOptions) {
  const containerSelector = init.containerSelector || '#container';
  const screenshotSelector = init.screenshotSelector || '#container';

  await page.evaluate(
    new AsyncFunction(
      'serializedConfig',
      'containerSelector',
      'width',
      'height',
      `
      function deserialize(v) {
        return eval('(' + v + ')');
      }

      const renderTo = document.querySelector(containerSelector);
      const config = deserialize(serializedConfig);

      renderTo.width = width;
      renderTo.height = height;

      window.currentChart = new Chart(renderTo, config);
      `
    ) as EvaluateFn,
    serialize(options.config),
    containerSelector,
    options.chartWidth || init.width,
    options.chartHeight || init.height
  );

  const containerElem = await page.$(screenshotSelector);

  if (containerElem === null) {
    throw new Error('No container element exists');
  }

  let result;

  if (init.pdf === true) {
    result = await page.pdf({
      ...options.file,
    });
  }
  else {
    result = await containerElem.screenshot({ 
      omitBackground: true,
      ...options.file,
    });
  }

  if (process.env.NODE_ENV !== 'chartdev') {
    await page.evaluate(new AsyncFunction(
      `window.currentChart.destroy()`
    ) as EvaluateFn);
  }

  return result;
}

export default {
  render,
  init,
};

