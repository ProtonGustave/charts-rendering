import { Chart } from 'chart.js';
import path from 'path';
import {
  RenderOptions,
  Exporter,
} from '../interfaces';
import {
  Page,
  ElementHandle,
  JSONObject,
  EvaluateFn
} from 'puppeteer';

const modulePath = path.dirname(require.resolve('chart.js'));

export interface ChartjsRenderOptions extends RenderOptions {
  chart: Chart.ChartConfiguration,
}

const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

// TODO: solve mangle issue more elegantly
async function init(page: Page) {
  await page.addScriptTag({
    path: modulePath + '/Chart.min.js',
  });
  // create main element
  await page.setContent(`<canvas id="container"></canvas>`);
  // disable animations globally
  await page.evaluate(new AsyncFunction(`
    Object.assign(Chart.defaults.global.animation, { duration: 0 });
  `) as EvaluateFn);
}

async function render(page: Page, options: ChartjsRenderOptions) {
  const containerElem = await page.$('#container');

  if (containerElem === null) {
    throw new Error('No container element exists');
  }

  await page.evaluate(new AsyncFunction('chart', `
    const ctx = document.getElementById('container');
    var myChart = new Chart(ctx, chart);
  `) as EvaluateFn, options.chart as JSONObject);

  await containerElem.screenshot({ 
    omitBackground: true,
    ...options.file,
  });
}

export default {
  render,
  init,
};

