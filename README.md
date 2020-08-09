# Charts Rendering

Module for charts rendering on server-side using front-end libraries(e.g. highcharts, chart.js).
It uses Puppeteer, modular and written in TypeScript.

### Supported charts libraries

Right now it supports *Highcharts* and *Chart.js* out-of-box.

## Installation

`npm install charts-rendering`

## Usage

```javascript
const { render, exporters } = require('charts-rendering');

render(exporters.highcharts, {
  init: {
    // viewport of Puppeteer instance, it's better to be bigger than supposed chart size
    width: 500,
    height: 500,
    // charts-rendering supports injecting javascript code
    // in the form of script tags into rendering environment
    // that could be other libraries for formatting, styles, dates etc
    jsInject: [{
      path: 'path/to/js/file',
    }],
  },
  // You can specify more than one chart config for bunch rendering
  // (with single Puppeteer instance)
  charts: [{
    file: {
      // where to save chart
      path: './output.png',
    },
    // this is simply highcharts creation config
    config: {
      chart: {
        width: 300,
        height: 100,
      },
      title: {
        text: 'My Chart'
      },
      yAxis: {
        labels: {
          // call injected code
          formatter: ({ value }) => { return injectedCode(value) },
        },
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
    }
  }]
});
```

## Adding support for other chart libraries

You can check *src/exporters/highcharts.ts* for example.
TBD
