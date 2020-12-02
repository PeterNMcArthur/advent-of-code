const compose =
  (...fns) =>
    (start) =>
      fns.reduce((result, fn) => fn(result), start);

module.exports = compose;