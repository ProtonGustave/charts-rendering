import { Options } from 'highcharts';
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
import setValue from 'set-value';
import getValue from 'get-value';

const modulePath = path.dirname(require.resolve('highcharts'));

export interface HighchartsRenderOptions extends RenderOptions {
  chart: Options,
}

const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

// TODO: solve mangle issue more elegantly
async function init(page: Page) {
  await page.addScriptTag({
    path: modulePath + '/highcharts.js',
  });
  // create main element
  await page.setContent(`<div id="container"></div>`);
  // disable features needed for interactive usage
  await page.evaluate(new AsyncFunction(`
    Highcharts.setOptions({
      plotOptions: {
        series: {
          animation: false
        }
      }
    });
  `) as EvaluateFn);
}

async function render(page: Page, options: HighchartsRenderOptions) {
  const containerElem = await page.$('#container');

  if (containerElem === null) {
    throw new Error('No container element exists');
  }

  if (getValue(options.chart, 'chart.width') === undefined) {
    setValue(options.chart, 'chart.width', options.width);
  }

  if (getValue(options.chart, 'chart.height') === undefined) {
    setValue(options.chart, 'chart.height', options.height);
  }

  await page.evaluate(new AsyncFunction('chart', `
    Highcharts.chart('container', chart);
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
