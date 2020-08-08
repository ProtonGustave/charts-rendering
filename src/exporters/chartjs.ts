import { Chart } from 'chart.js';
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

const modulePath = path.dirname(require.resolve('chart.js'));

export interface ChartjsRenderOptions extends ChartOptions {
  config: Chart.ChartConfiguration,
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
    Object.assign(Chart.defaults.global, {
      animation: false,
      responsive: false,
    });
  `) as EvaluateFn);
}

async function render(page: Page, options: ChartjsRenderOptions, initOptions: InitOptions) {
  const containerElem = await page.$('#container');

  if (containerElem === null) {
    throw new Error('No container element exists');
  }

  await page.evaluate(new AsyncFunction('chart', 'width', 'height', `
    console.log(numeral(123400041).format('$0[.]00a').toUpperCase());
    const ctx = document.getElementById('container');
    ctx.width = width;
    ctx.height = height;
    new Chart(ctx, chart);
  `) as EvaluateFn, options.config as JSONObject, initOptions.width, initOptions.height);

  await containerElem.screenshot({ 
    omitBackground: true,
    ...options.file,
  });
}

export default {
  render,
  init,
};

