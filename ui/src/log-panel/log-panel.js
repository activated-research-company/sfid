require('./log-panel.css');

function logPanel(m, env, fs, moment, labelledCard, button, logger) {
  function getComponent() {
    let appFileList = [];
    let apiFileList = [];
    let selectedFile = '';
    let selectedLevel = '';
    let currentLevel = '';
    let logs;
    let logArray = [];

    function getFilePath(path, file) {
      return `${env.persistentDataPath}/log/${path}${file ? `/${file}` : ''}`;
    }

    function getFiles(path) {
      return new Promise((resolve) => {
        fs.readdir(getFilePath(path), (err, items) => {
          resolve(items ? items.map((item) => getFilePath(path, item)) : items);
        });
      });
    }

    function filterFiles(files) {
      if (files) { return files.filter((file) => file.split('.').pop() === 'log'); }
      return [];
    }

    function populateFileLists() {
      getFiles('app').then((fileList) => {
        appFileList = filterFiles(fileList);
      });
      getFiles('api').then((fileList) => {
        apiFileList = filterFiles(fileList);
      });
    }

    function populateLogContents(file) {
      fs.readFile(file, (err, data) => {
        if (err) {
          logger.error(`could not read log file [${err}]`);
        } else {
          logArray = [];
          logs = data
            .toString()
            .split('\n')
            .map((line) => {
              try {
                return JSON.parse(line);
              } catch (e) {
                return null;
              }
            })
            .filter((log) => log);
        }
      });
    }

    function getLogFileButton(file, padLeft, padRight) {
      if (!file) { return null; }
      const fileParts = file.split('/');
      const fileName = fileParts[fileParts.length - 1];
      const label = fileName.substring(0, fileName.length - 4);
      return m(`.pb2.pl${padLeft}.pr${padRight}`, m(button, {
        label,
        toggled: file === selectedFile,
        onclick: () => {
          selectedLevel = '';
          selectedFile = file;
          populateLogContents(file);
        },
      }));
    }

    function getLogFileButtons(fileList) {
      if (!fileList) { return null; }
      const fileLogButtons = [];
      for (let i = 0; i < Math.ceil(fileList.length / 4); i += 1) {
        fileLogButtons.push(m('.flex', [
          getLogFileButton(fileList[(i * 4)], 0, 1),
          getLogFileButton(fileList[(i * 4) + 1], 1, 1),
          getLogFileButton(fileList[(i * 4) + 2], 1, 1),
          getLogFileButton(fileList[(i * 4) + 3], 1, 0),
        ]));
      }
      return fileLogButtons;
    }

    function getLevelButton(level, width, padLeft, padRight) {
      return m(`.w-${width}.pl${padLeft}.pr${padRight}`, m(button, {
        label: `${level.substring(0, 1).toUpperCase()}${level.substring(1)}`,
        toggled: selectedLevel === level,
        onclick: () => {
          if (selectedLevel !== level) {
            selectedLevel = level;
          } else {
            selectedLevel = '';
          }
        },
      }));
    }

    function getLevelButtons() {
      return [
        getLevelButton('error', 15, 0, 1),
        getLevelButton('warn', 15, 1, 1),
        getLevelButton('info', 15, 1, 1),
        // 'http'
        getLevelButton('verbose', 20, 1, 1),
        getLevelButton('debug', 20, 1, 1),
        getLevelButton('silly', 15, 1, 0),
      ];
    }

    function getLogContents() {
      if (!logs) { return 'Select a log to view contents here.'; }
      if (logs && (!logArray.length || selectedLevel !== currentLevel)) {
        logArray = [];
        currentLevel = selectedLevel;
        logs.forEach((log) => {
          if (!selectedLevel || log.level === selectedLevel) {
            logArray.push(
              m('.flex', [
                m(`.pr2.${log.level}`, `[${moment(log.timestamp).format('HH:mm:ss:SSS')}]`),
                m('.', log.message),
              ]),
            );
          }
        });
        if (!logArray.length && selectedLevel) { logArray.push('There are no logs at this level.'); }
        if (!logArray.length) { logArray.push('There are no logs for this day.'); }
      }
      return logArray;
    }

    return {
      oninit: () => {
        populateFileLists();
      },
      view: () => m('.', [
        m('.bb.bt', m(labelledCard, { label: 'Front End' }, m('.overflow-scroll', { id: 'app-log-files' }, getLogFileButtons(appFileList)))),
        m('.bb', m(labelledCard, { label: 'Back End' }, m('.overflow-scroll', { id: 'api-log-files' }, getLogFileButtons(apiFileList)))),
        m('.', m(labelledCard, { label: 'Log ' }, [
          m('.flex.pb2', getLevelButtons()),
          m('.pre.f7', { id: 'log-contents' }, getLogContents()),
        ])),
      ]),
    };
  }

  return getComponent;
}

module.exports = (container) => {
  container.service(
    'logPanel',
    logPanel,
    'm',
    'env',
    'fs',
    'moment',
    'labelledCard',
    'button',
    'logger',
  );
};
