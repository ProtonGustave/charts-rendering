const fs = require('fs');
const path = require('path');

const highchartsPath = path.dirname(require.resolve('highcharts'));

async function render(page, options) {
  await page.addScriptTag({
    path: highchartsPath + '/highcharts.js',
  });
  await page.setContent(`<div id="container"></div>`);
  await page.evaluate(async () => {
    Highcharts.setOptions({
      plotOptions: {
        series: {
          animation: false
        }
      }
    });
  });

  if (Array.isArray(options) === true) {

    window.chart = Highcharts.chart('container', {
      chart: {
        animation: false,
      },
      title: {
        text: 'My Chart'
      },
      xAxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "Mar", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      },
      series: [
        {
          type: 'line',
          data: [1, 3, 2, 4]
        },
        {
          type: 'line',
          data: [5, 3, 4, 2]
        }
      ]
    });
  });

  const containerElem = await page.$('#container');
  await containerElem.screenshot({ 
    path: 'output.png',
    omitBackground: true,
  });

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 5000);
  });

  await page.evaluate(async () => {
    window.chart = Highcharts.chart('container', {
      chart: {
        animation: false,
      },
      title: {
        text: 'My Chart'
      },
      xAxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "Mar", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      },
      series: [
        {
          type: 'line',
          color: 'red',
          data: [1, 3, 2, 4]
        },
        {
          type: 'line',
          color: 'green',
          data: [5, 3, 4, 2]
        }
      ]
    });
  });

  await containerElem.screenshot({ 
    path: 'output_1.png',
    omitBackground: true,
  });
}

module.exports = {
  render,
};
