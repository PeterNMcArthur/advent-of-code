const fetchData = require('../fetchData');
const compose = require('../compose');

const stringToComponents = (password) =>
  /(?<min>\d+)\-(?<max>\d+) (?<char>\w): (?<possiblePassword>\w+)/g.exec(password);

const hasCorrectPositions = ({
  groups: {
    min,
    max,
    char,
    possiblePassword,
  },
}) =>
  [min, max].filter(x => possiblePassword.charAt(x - 1) === char).length === 1

const hasCorrectNumber = ({
  groups: {
    min,
    max,
    char,
    possiblePassword,
  },
}) => {
  const charCount = (possiblePassword.match(new RegExp(char, 'g')) || []).length;
  return min <= charCount && max >= charCount;
}

(async () => {

  const data = await fetchData(2);

  const part1Validator = compose(
    stringToComponents,
    hasCorrectNumber,
  )
  const part2Validator = compose(
    stringToComponents,
    hasCorrectPositions,
  )

  const testPasswords = validator => compose(
    x => x.split(/\n/),
    x => x.filter(y => !!y),
    x => x.filter(validator),
    x => x.length,
  );


  const part1 = testPasswords(part1Validator);
  console.log('(Part 1) number of correct passwords: ', part1(data));

  const part2 = testPasswords(part2Validator);
  console.log('(Part 2) number of correct passwords: ', part2(data));
})();
