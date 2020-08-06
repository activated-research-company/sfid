/* eslint-disable arrow-parens */
const o = require('ospec');
const delay = require('../delay');

const delayTolerance = 50;

function testDelay(ms, done) {
  const startTime = new Date();
  const minimumMs = ms - delayTolerance;
  const maximumMs = ms + delayTolerance;
  delay(ms).then(() => {
    const endTime = new Date();
    o(Math.max(endTime - startTime, maximumMs)).equals(maximumMs);
    o(Math.min(endTime - startTime, minimumMs)).equals(minimumMs);
    done();
  });
}

o.spec(`delay (${delayTolerance}ms tolerance)`, () => {
  o.specTimeout(1000 + delayTolerance);
  o(`should delay between null and ${delayTolerance}ms`, done => {
    testDelay(null, done);
  });
  o(`should delay between 0 and ${delayTolerance}ms`, done => {
    testDelay(0, done);
  });
  o(`should delay between 1000 and ${1000 + delayTolerance}ms`, done => {
    testDelay(1000, done);
  });
});
