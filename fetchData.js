const fetch = require("node-fetch");

const getData = async (day) => {
  const res = await fetch(`https://adventofcode.com/2020/day/${day}/input`, {
    headers: {
      cookie: `session=${process.env.SESSION}`,
    },
  });
 return await res.text()
};

module.exports = getData;
