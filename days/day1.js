const fetchData = require('../fetchData');
const compose = require('../compose');
const split = require('../utils/split');
const map = require('../utils/map');

(async () => {
  const data = await fetchData(1);

  const part1 = compose(
    split(/\n/),
    map(x => Number(x)),
    (expenses) =>
      expenses.reduce((result, val1) => {
        if (result) return result;
        const val2 = expenses.find(expense => val1 + expense === 2020)
        return val2 ? val1 * val2 : result
      }, null),
  );

  const part2 = compose(
    split(/\n/),
    map(x => Number(x)),
    (expenses) =>
      expenses.reduce((result, val1) =>
        result
          ? result
          : expenses.reduce((result2, val2) => {
          if (result2) return result2;
          const val3 = expenses.find(expense => val1 + val2 + expense === 2020)
          return val2 ? val1 * val2 * val3 : result
        }, null),
    null),
  );

  console.log('(Part 1) sum of two products: ', part1(data));
  console.log('(Part 2) sum of three products: ', part2(data));
})();
