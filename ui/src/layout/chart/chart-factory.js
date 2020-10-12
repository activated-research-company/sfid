const Chart = require('chart.js');

Chart.defaults.global.legend.display = false;
Chart.defaults.global.tooltips.enabled = false;

function chartFactory() {
  function zoom(yMin, yMax) {
    this.options.scales.yAxes[0].ticks.min = yMin;
    this.options.scales.yAxes[0].ticks.max = yMax;
    this.update();
  }

  function getXAxisLabels(minimum, maximum, scale) {
    const labels = [];
    for (let i = minimum; i <= maximum; i += 1) {
      if (i % scale === 0) {
        labels.push(`${-i / (minimum / 60)}`);
      } else {
        labels.push('');
      }
    }
    return labels;
  }

  function getDatasets(data, setpointData) {
    const datasets = [{
      data,
      borderWidth: 2,
      borderColor: 'rgb(0, 0, 0)',
      fill: true,
      backgroundColor: 'rgba(255, 99, 0, 0.1)',
    }];

    if (setpointData) {
      datasets.push({
        data: setpointData,
        borderWidth: 2,
        borderColor: 'rgb(53, 126, 221)',
        fill: false,
      });
    }

    return datasets;
  }

  function getYTicks() {
    const ticks = {
      min: 0,
      autoSkip: true,
      maxTicksLimit: 6,
    };
    return ticks;
  }

  function getXTicks() {
    const ticks = {
      autoSkip: false,
      maxTicksLimit: 5,
    };
    return ticks;
  }

  function getNewLineChart(canvas, setpointData, data, options) {
    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: getXAxisLabels((1000 / options.sampleRate) * -60, 0, ((1000 / options.sampleRate) * 60) / 6),
        datasets: getDatasets(data, setpointData),
      },
      options: {
        title: {
          display: true,
          text: options.title,
        },
        responvie: false,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: options.units,
              },
              ticks: getYTicks(),
            },
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: '',
              },
              ticks: getXTicks(),
            },
          ],
        },
        elements: {
          point: { radius: 0 },
        },
      },
    });

    chart.getYMin = () => chart.scales['y-axis-0'].min;
    chart.getYMax = () => chart.scales['y-axis-0'].max;
    chart.getYSize = () => chart.getYMax() - chart.getYMin();
    chart.zoom = zoom;

    return chart;
  }

  return {
    getNewLineChart,
  };
}

module.exports = (container) => {
  container.service('chartFactory', chartFactory);
};
