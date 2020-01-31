export const code1 = `
@REF.aaa.bbb.ccc
let abc = @hello.world
widget #mySW { // xxxxxxxxINILNIENxxxxxxxxxxxx
  // xxxxxxxxxxxxxxxxxxxx
  table : @substrata.hubby.table_1
}
`;

export const code2 = `
// 2 * 1440 - 909 % 888
( HELLO BYE )
Johnny B
// "hello"
// let qwe = (-2+-7)
// widget arne #jonhson @nr1 {
//  abx: 123 / 999
// }
// let fn = function() {};
//This is a comment
// (2 + 4) * (8 + 9)
`;

export const code3 = `
variable auto #respCount {
  value: x //'IIF(@filter.isResponded, "c", IIF(@filter.isOptOut, "o", IIF(@filter.isPartial, "p", IIF(@filter.isFailedInvite, "f", IIF(@filter.isNotYetSent, "ns", "n")))))'
}
  
`;
