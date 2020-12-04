const fetchData = require('../fetchData');

(async () => {
  const data = await fetchData(4);
  const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

  const validation = {
    byr: (value) => Number(value) >= 1920 && Number(value) <= 2002,
    iyr: (value) => Number(value) >= 2010 && Number(value) <= 2020,
    eyr: (value) => Number(value) >= 2020 && Number(value) <= 2030,
    hgt: (value) => {
      if (!value || !/cm|in/.test(value)) return false
      const { groups: { inch, cm, } } = value.match(/^((?<inch>\d+)in)|((?<cm>\d+)cm)/);
      if (cm) {
      return Number(cm) >= 150 && Number(cm) <= 193;
      }
      if (inch) {
        return Number(inch) >= 59 && Number(inch) <= 76;
      }
      return false;
    },
    hcl: (value) => /^#[0-9a-f]{6}$/.test(value),
    ecl: (value) => /(amb|blu|brn|gry|grn|hzl|oth)/.test(value),
    pid: (value) => /^\d{9}$/.test(value),
  };

  const strictValidation = (passportObj, keyValuePair) => {
      if (!keyValuePair) return passportObj;
      const { groups: { key, value }} = /^(?<key>[^:]+):(?<value>.+)/.exec(keyValuePair);
      return (validation[key] && validation[key](value)) ?
      {
        ...passportObj,
        [key]: value,
      } : passportObj;
    };

  const noValidation = (passportObj, keyValuePair) => {
      if (!keyValuePair) return passportObj;
      const { groups: { key, value }} = /^(?<key>[^:]+):(?<value>.+)/.exec(keyValuePair);
      return {
        ...passportObj,
        [key]: value,
      }
    };


  const findValidPassports = (validationFn) => data.split(/\n\n/)
    .map((passport) => passport.split(/(\n|\s)/).filter(x => !/(\n|\s)/.test(x)))
    .map(passportData => passportData.reduce(validationFn, {}))
    .map(x => requiredFields.reduce((arr, key) => Object.keys(x).includes(key) ? arr : [...arr, key], []))
    .reduce((validCount, missingKeys) => missingKeys.length === 0 ? validCount + 1 : validCount, 0)

  const part1 = findValidPassports(noValidation);
  const part2 = findValidPassports(strictValidation);

    console.log('(Part 1) number of validPassports: ', part1);

    console.log('(Part 2) number of validPassports: ', part2);
})();

