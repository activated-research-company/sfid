const o = require('ospec');
const random = require('../random');

o.spec('random', () => {
  o('should return 1', () => {
    o(random(1, 1)).equals(1);
  });
  o('should return a number between two numbers', () => {
    const minimum = 123;
    const maximum = 456789;
    const randomNumber = random(minimum, maximum);
    o(randomNumber >= minimum && randomNumber <= maximum).equals(true);
  });
});
