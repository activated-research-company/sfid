function chartOptions(m, eventEmitter, systemState, modal, chartOption, settings) {
  function getComponent() {
    let hide = true;
    let component;
    const chartables = [
      {
        component: 'FID',
        outputs: [
          systemState.fidAir,
          systemState.fidAirPressure,
          systemState.fidHydrogen,
          systemState.fidHydrogenPressure,
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
        components.push(m('x-menuitem.cursor-none', {
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
          m('x-select.cursor-none.w-60', [
            m('x-menu.cursor-none', outputs),
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
          m('x-select.cursor-none.w-60', [
            m('x-menu.cursor-none', getComponents()),
          ]),
        ]),
        ...getOutputs(),
      ]),
    };
  }

  return getComponent;
}

module.exports = (container) => {
  container.service('chartOptions', chartOptions, 'm', 'eventEmitter', 'systemState', 'modal', 'chartOption', 'settings');
};
