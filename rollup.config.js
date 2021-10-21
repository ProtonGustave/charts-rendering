// rollup.config.js
import typescript from 'rollup-plugin-typescript2';

export default {
  external: [
    'chart.js',
    'highcharts',
  ],
	input: {
    'index': './src/index.ts',
    'exporters/chartjs': './src/exporters/chartjs.ts',
    'exporters/highcharts': './src/exporters/highcharts.ts',
  },
  output: {
    // entryFileNames: 'entry-[name].js'
    dir: 'dist',
    format: 'cjs'
  },

	plugins: [
		typescript()
	]
}
