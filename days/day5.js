const compose = require('../compose');
const split = require('../utils/split');
const map = require('../utils/map');
const fetchData = require('../fetchData');

/*
  Start by considering the whole range, rows 0 through 127.
  F means to take the lower half, keeping rows 0 through 63.
  B means to take the upper half, keeping rows 32 through 63.
  F means to take the lower half, keeping rows 32 through 47.
  B means to take the upper half, keeping rows 40 through 47.
  B keeps rows 44 through 47.
  F keeps rows 44 through 45.
  The final F keeps the lower of the two, row 44.
*/
(async () => {
  const data = await fetchData(5);

  const startRow = [0, 127];
  const startColumn = [0, 7];

  const halfOfRange = ([min, max]) => min + ((max - min) / 2)
  const takeTopHalf = ([min, max]) => [min, Math.floor(halfOfRange([min, max]))]
  const takeBottomHalf = ([min, max]) => [Math.ceil(halfOfRange([min, max])), max];

  const directionMap = {
    F: takeTopHalf,
    B: takeBottomHalf,
    R: takeBottomHalf,
    L: takeTopHalf,
  }

  const getSeatPosition = (positions) => positions.reduce((result, key) => ({
    row: /F|B/.test(key) ? directionMap[key](result.row) : result.row,
    column: /R|L/.test(key) ? directionMap[key](result.column) : result.column,
  }), {
    row: startRow,
    column: startColumn,
  });

  const getSeatId = ({ row, column }) => (row * 8) + column
  const cleanSeatPostion = ({ row, column }) => ({ row: row[0], column: column[0] })

  const findSeat = compose(
    split(''),
    getSeatPosition,
    cleanSeatPostion
  );

  const findSeatId = compose(
    findSeat,
    getSeatId,
  );

  const getHighestId = (arr) => arr.reduce((highest, id) => id > highest ? id : highest, 0);

  const part1 = compose(
    split(/\n/),
    map(findSeatId),
    getHighestId
  )

  console.log('(Part 1) highest seat ID: ', part1(data));

  const sortPlane = (seats) => seats.reduce((rows, {row, column}) => ({
    ...rows,
    [row]: rows[row] ? [...rows[row], column] : [column],
  }), {});

  const findMissingSeats = (obj) =>
    Object.entries(obj).filter(([_, column]) => column.length < (startColumn[1] + 1) )

  const filterBackAndFrontSeats = (arr) =>
    arr.find(([rowNo]) => !/(0|3|105)/.test(rowNo));

  const getPostionOfMissingSeat = ([rowNo, columns]) => ({
    row: rowNo,
    column: columns.find(column => !columns.includes(column + 1)) + 1,
  });

  const part2 = compose(
    split(/\n/),
    map(findSeat),
    sortPlane,
    findMissingSeats,
    filterBackAndFrontSeats,
    getPostionOfMissingSeat,
    getSeatId,
  );

  console.log('(Part 2) my seat ID is: ', part2(data));
})();
