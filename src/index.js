const { render } = require('./renderer.js');
const exporters = require('./exporters/index.js');

render(exporters.highcharts);

module.exports = {
  render,
  exporters,
};
