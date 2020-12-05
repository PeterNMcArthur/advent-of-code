const compose = require('../compose');
const split = require('../utils/split');
const map = require('../utils/map');
const fetchData = require('../fetchData');

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

  const rowIsMissingSeats = column => column.length < (startColumn[1] + 1)
  const rowIsSurrounded = (rows, rowNo) => rows[Number(rowNo) + 1] && rows[Number(rowNo) - 1]

  const findMissingSeats = (obj) =>
    Object.entries(obj)
      .find(([rowNo, column]) => rowIsMissingSeats(column) && rowIsSurrounded(obj, rowNo));

  const getPostionOfMissingSeat = ([row, columns]) => ({
    row,
    column: columns.find(column => !columns.includes(column + 1)) + 1,
  });

  const part2 = compose(
    split(/\n/),
    map(findSeat),
    sortPlane,
    findMissingSeats,
    getPostionOfMissingSeat,
    getSeatId,
  );

  console.log('(Part 2) my seat ID is: ', part2(data));

})();
