function getErrorMessageFactory(time) {
  function getNewErrorMessage(title, content) {
    return {
      title,
      content,
      occurred: time.now(),
    };
  }

  return {
    getNewErrorMessage,
  };
}

module.exports = (container) => {
  container.service(
    'errorMessageFactory',
    getErrorMessageFactory,
    'time',
  );
};
