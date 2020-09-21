// TODO: pick a name that makes sense but doesn't collide with other variables
function someNameWithChartInIt(m, eventEmitter, chartFactory, button, chartOptions) {
  function component() {
    const CHART_EVENT = 'chart';
    const CHART_DATA_EVENT = 'chartdata';

    let options = {
      default: true,
      title: 'Tap the chart button to plot.',
      units: 'UNITS',
      sampleRate: 1000,
    };

    let chartCanvas;
    let chart;
    const chartData = [];
    const setpointData = [];

    function pushEmptyData() {
      chartData.splice(0, chartData.length);
      setpointData.splice(0, setpointData.length);
      for (let i = 0; i <= (1000 / options.sampleRate) * 60; i += 1) {
        chartData.push(null);
        setpointData.push(null);
      }
    }

    function chartNewData(newOptions) {
      options = newOptions;
      if (!options.sampleRate) { options.sampleRate = 500; }
      chart.destroy();
      pushEmptyData();
      chart = chartFactory.getNewLineChart(chartCanvas, setpointData, chartData, options);
    }

    function pushNewDataPoint(dataPoint) {
      if (options.default) {
        chartNewData(dataPoint);
        options = dataPoint;
      }
      chartData.splice(0, 1);
      chartData.push(dataPoint.actual);
      options.setpoint = dataPoint.setpoint;
      setpointData.splice(0, 1);
      setpointData.push(dataPoint.setpoint);
      chart.update();
    }

    function resetZoom() {
      chart.destroy();
      chart = chartFactory.getNewLineChart(chartCanvas, setpointData, chartData, options);
    }

    let zoomCanvas;
    let zoomContext;
    const zoomArea = {
      h: 0,
      w: 0,
    };
    let zoomDragging = false;

    function startDrawingZoomArea(x, y) {
      zoomArea.x = x;
      zoomArea.y = y;
      zoomDragging = true;
    }

    function touchStart(e) {
      const rect = e.target.getBoundingClientRect();
      startDrawingZoomArea(e.targetTouches[0].pageX - rect.left, e.targetTouches[0].pageY - rect.top);
    }

    function mouseDown(e) {
      startDrawingZoomArea(e.layerX, e.layerY);
    }

    function zoom() {
      if (!zoomDragging) { return; }
      zoomDragging = false;
      if (zoomArea.h < 0) {
        zoomArea.h = Math.abs(zoomArea.h);
        zoomArea.y -= zoomArea.h;
      }
      zoomContext.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
      if (Math.abs(zoomArea.h) >= 5) {
        chart.zoom(
          chart.getYMin() + (chart.getYSize() * ((zoomCanvas.height - (zoomArea.y + zoomArea.h)) / zoomCanvas.height)),
          chart.getYMax() - (chart.getYSize() * (zoomArea.y / zoomCanvas.height)),
        );
      }

      zoomArea.h = 0;
      zoomArea.w = 0;
      m.redraw();
    }

    function updateZoomArea(x, y) {
      if (zoomDragging) {
        zoomArea.h = y - zoomArea.y;
        zoomArea.w = x - zoomArea.x;
        zoomContext.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
        zoomContext.strokeRect(zoomArea.x, zoomArea.y, zoomArea.w, zoomArea.h);
        m.redraw();
      }
    }

    function mouseMove(e) {
      updateZoomArea(e.layerX, e.layerY);
    }

    function touchMove(e) {
      const rect = e.target.getBoundingClientRect();
      if (
        e.targetTouches[0].pageX < rect.left
        || e.targetTouches[0].pageX > rect.left + rect.width
        || e.targetTouches[0].pageY < rect.top
        || e.targetTouches[0].pageY > rect.top + rect.height) {
        zoom();
      } else {
        updateZoomArea(e.targetTouches[0].pageX - rect.left, e.targetTouches[0].pageY - rect.top);
      }
    }

    return {
      oninit: () => {
        eventEmitter.on(CHART_EVENT, chartNewData);
        eventEmitter.on(CHART_DATA_EVENT, pushNewDataPoint);
      },
      onremove: () => {
        chart.destroy();
        eventEmitter.off(CHART_EVENT, chartNewData);
        eventEmitter.off(CHART_DATA_EVENT, pushNewDataPoint);
      },
      oncreate: () => {
        // eslint-disable-next-line no-undef
        chartCanvas = document.getElementById('chart');
        chart = chartFactory.getNewLineChart(chartCanvas, setpointData, chartData, options);
        pushEmptyData();
        // eslint-disable-next-line no-undef
        zoomCanvas = document.getElementById('zoom');
        zoomCanvas.width = zoomCanvas.offsetWidth;
        zoomCanvas.height = zoomCanvas.offsetHeight;
        zoomContext = zoomCanvas.getContext('2d');
        zoomContext.setLineDash([6]);
        zoomCanvas.addEventListener('mousedown', mouseDown);
        zoomCanvas.addEventListener('mousemove', mouseMove);
        zoomCanvas.addEventListener('mouseup', zoom);
        zoomCanvas.addEventListener('mouseout', zoom);
        zoomCanvas.addEventListener('touchstart', touchStart);
        zoomCanvas.addEventListener('touchmove', touchMove);
        zoomCanvas.addEventListener('touchend', zoom);
        zoomCanvas.addEventListener('touchcancel', zoom);
      },
      view: () => m('div.relative.h-100', [
        m('div.absolute.h-100.w-100', m('canvas', { id: 'chart' })),
        m('div.absolute.top-0.right-55.w-55px.pr2', m(button, {
          icon: 'show-chart',
          onclick: () => { eventEmitter.emit('showchartoptions'); },
        })),
        m('div.absolute.top-0.right-0.w-55px.pr2', m(button, {
          icon: 'zoom-out',
          onclick: resetZoom,
        })),
        m('canvas.absolute', { id: 'zoom' }),
        m(chartOptions),
      ]),
    };
  }

  return component;
}

module.exports = (container) => {
  container.service('chart', someNameWithChartInIt, 'm', 'eventEmitter', 'chartFactory', 'button', 'chartOptions');
};
