import { Options } from 'highcharts';
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
import setValue from 'set-value';
import getValue from 'get-value';
import serialize from 'serialize-javascript';

const modulePath = path.dirname(require.resolve('highcharts'));
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

export interface HighchartsRenderOptions extends ChartOptions {
  config: Options;
}

export interface HighchartsInitOptions extends InitOptions {
  highstock?: boolean;
}

// TODO: solve mangle issue more elegantly
export async function init(page: Page, init: HighchartsInitOptions) {
  await page.addScriptTag({
    path: init.highstock === true
    ? modulePath + '/highstock.js'
    : modulePath + '/highcharts.js'
  });
  // create main element
  if ('containerSelector' in init === false) {
    await page.setContent(`<div id="container"></div>`);
  }

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

export async function render(page: Page, options: HighchartsRenderOptions, init: HighchartsInitOptions) {
  const containerSelector = init.containerSelector || '#container';
  const screenshotSelector = init.screenshotSelector || containerSelector;

  await page.evaluate(new AsyncFunction('serializedConfig', 'containerSelector', `
    function deserialize(v) {
      return eval('(' + v + ')');
    }

    const renderTo = document.querySelector(containerSelector);
    const config = deserialize(serializedConfig);
    Highcharts.chart(renderTo, config);
  `) as EvaluateFn, serialize(options.config), containerSelector);

  const containerElem = await page.$(screenshotSelector);

  if (containerElem === null) {
    throw new Error('No screenshot element exists');
  }

  return await containerElem.screenshot({ 
    omitBackground: true,
    ...options.file,
  });
}

export default {
  render,
  init,
};
