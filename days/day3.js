
const fetchData = require('../fetchData');

(async () => {
  const data = await fetchData(3);
  const treeLines = data.split(/\n/).filter(x => !!x);
  const patternRepeatsAtIndex = treeLines[0].length;
  const hasHitTree = (xPos, treeLine) =>
    treeLine[xPos % patternRepeatsAtIndex] === '#';

  const calcTreesHitenroute = (xMovement, yMovement) => treeLines.reduce(({ treesHit, x, y }, _) => ({
    y: y + yMovement,
    x: x + xMovement,
    treesHit: treeLines[y + yMovement] && hasHitTree(x + xMovement, treeLines[y + yMovement]) ? treesHit + 1 : treesHit
  }), {
    treesHit: 0,
    x: 0,
    y: 0,
  });

  const part1 = calcTreesHitenroute(3, 1);
  console.log('(Part 1) number of trees hit: ', part1.treesHit);

  const part2 = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ].map(positions => calcTreesHitenroute(...positions))
  .reduce((sum, { treesHit }) => sum * treesHit, 1);

  console.log('(Part 2) number of trees hit: ', part2);
})();
