/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

require('require-all')({
  dirname: `${__dirname}/..`,
  filter: (fileName) => {
    const parts = fileName.split('.');
    if (parts[1] === 'test' || parts[0] === 'spec' || parts[0] === 'index' || parts[0] === 'container') {
      return false;
    }
    return parts[0];
  },
  recursive: true,
});
