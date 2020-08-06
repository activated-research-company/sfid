function alicatDeviceFactory() {

  function getNewFlowController(address, event) {
    function set(value, sendCommand) {
      sendCommand(value);
    }

    function get(json) {
      const translatedJson = json;
      translatedJson.actual = json.flow;
      return translatedJson;
    }

    return {
      address,
      event,
      set,
      get,
    };
  }

  return {
    getNewFlowController,
  };
}

module.exports = alicatDeviceFactory;
