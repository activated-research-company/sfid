function round() {
  return (value, decimalPlaces) => +parseFloat(value).toFixed(decimalPlaces);
}

module.exports = (container) => {
  container.service('round', round);
};
