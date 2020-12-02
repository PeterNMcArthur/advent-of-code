const fetchData = require('../fetchData');
const compose = require('../compose');

const stringToComponents = (password) =>
  /(?<min>\d+)\-(?<max>\d+) (?<char>\w): (?<possiblePassword>\w+)/g.exec(password);

const componentsToTest = ({
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

  const isPasswordValid = compose(
    stringToComponents,
    componentsToTest,
  )

  const correctPasswordCount = compose(
    x => x.split(/\n/),
    x => x.filter(y => !!y),
    x => x.filter(isPasswordValid),
    x => x.length,
  );

  const data = await fetchData(2);
  console.log('number of correct passwords: ', correctPasswordCount(data));
})();
