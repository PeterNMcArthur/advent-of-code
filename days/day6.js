const fetchData = require('../fetchData');
const compose = require('../compose');
const map = require('../utils/map');
const split = require('../utils/split');

(async () => {
  const data = await fetchData(6);

  const getUniqueChars = x => x && x.reduce((unique, char) => unique.includes(char) ? unique : [...unique, char], []);

  const countUnique = compose(
    x => x.join('').split(''),
    getUniqueChars,
    x => x.length,
  )

  const countEvery = compose(
    x => x.reduce((every, answers) => every && answers.match(new RegExp(`${every.join('|')}`, 'g')), x[0].split('')),
    x => (x && x.length) || 0,
  )

  const formatData = compose(
    x => x.replace(/(\n|\r|\s)+$/, ''),
    split(/\n\n/),
    x => x.filter(x => x !== ''),
    x => {
      console.log(x)
      return x
    },
    map(split(/\n/)),
  );

  const part1 = compose(
    formatData,
    map(countUnique),
    x => x.reduce((sum, val) => sum + val, 0),
  );

  console.log('(Part 1) sum of unique group answers is: ', part1(data));

  const part2 = compose(
    formatData,
    map(countEvery),
    x => x.reduce((sum, val) => sum + val, 0));
  console.log('(Part 2) sum of same groups answers is: ', part2(data));
})();
