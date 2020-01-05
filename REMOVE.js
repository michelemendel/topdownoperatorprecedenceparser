const x = {
  type: "DOCUMENT",
  value: {
    type: "IDENTIFIER",
    value: "#Root",
    lineNr: 0,
    columnNr: 9
  },
  children: [
    {
      type: "ENTITY",
      value: "",
      children: [
        {
          type: "PROPERTY",
          value: "abc",
          children: {
            type: "SUM",
            value: "+",
            children: [
              {
                type: "NUMBER",
                value: 2
              },
              {
                type: "NUMBER",
                value: 3
              }
            ]
          }
        },
        {
          type: "PROPERTY",
          value: "bye",
          children: {
            type: "NAME",
            value: "theend"
          }
        }
      ]
    }
  ]
};
