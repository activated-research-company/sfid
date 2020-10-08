require('./chart-options.css');

function chartOptions(m, env, eventEmitter, systemState, modal, chartOption) {
  function getComponent() {
    let hide = true;
    let component;
    const chartables = [
      {
        component: 'FID',
        outputs: [
          systemState.air,
          systemState.airPressure,
          systemState.hydrogen,
          systemState.hydrogenPressure,
          systemState.fidTemperature,
          systemState.fid,
        ],
      },
      {
        component: 'Computer',
        outputs: [
          systemState.computerTemperature,
          systemState.computerCpu,
          systemState.computerMemory,
        ],
      },
    ];

    function showChartOptions() { hide = false; }
    function hideChartOptions() { hide = true; }

    function getComponents() {
      const components = [];
      chartables.forEach((chartable) => {
        components.push(m('x-menuitem', {
          onclick: (element) => {
            component = element.target.innerText;
            m.redraw();
          },
        }, m('x-label', chartable.component)));
      });
      return components;
    }

    function getOutputs() {
      const allOutputs = [];
      chartables.forEach((chartable) => {
        const outputs = [];
        chartable.outputs.forEach((output) => {
          outputs.push(m(chartOption, { state: output }));
        });
        allOutputs.push(m(`.w-100.${component === chartable.component ? 'flex' : 'dn'}`, [
          m('x-label.ma-aa.w-30.pr3.tr', 'Output:'),
          m('x-select.w-60', [
            m('x-menu', outputs),
          ]),
        ]));
      });

      return allOutputs;
    }

    return {
      oninit: () => {
        eventEmitter.on('showchartoptions', showChartOptions);
      },
      onremove: () => {
        eventEmitter.off('showchartoptions', showChartOptions);
      },
      view: () => m(modal, { id: 'chart-options-modal', hide, onclickout: hideChartOptions }, [
        m(`.w-100.${component ? '.pb2' : ''}.flex`, [
          m('x-label.ma-aa.w-30.pr3.tr', 'Component:'),
          m('x-select.w-60', [
            m('x-menu', getComponents()),
          ]),
        ]),
        ...getOutputs(),
      ]),
    };
  }

  return getComponent;
}

module.exports = (container) => {
  container.service(
    'chartOptions',
    chartOptions,
    'm',
    'env',
    'eventEmitter',
    'systemState',
    'modal',
    'chartOption',
  );
};
