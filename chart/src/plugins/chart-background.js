import Chart from 'chart.js';

// Makes the background of the chart only inside the axis lines,
// so that the numbers are outside of the background.
// Source: https://stackoverflow.com/a/38493678

Chart.pluginService.register({
  beforeDraw: chart => {
    if (chart.config.options.chartAreaBackground) {
      const ctx = chart.chart.ctx;
      const chartArea = chart.chartArea;

      ctx.save();
      ctx.fillStyle = chart.config.options.chartAreaBackground;
      ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
      ctx.restore();
    }
  }
});
