export const createNode = ({
  type,
  value,
  lineNr,
  columnNr,
  children = []
}) => ({
  type,
  value,
  lineNr,
  columnNr,
  children
});

console.log(createNode({ type: 1, value: 2, lineNr: 3, columnNr: 4 }));
