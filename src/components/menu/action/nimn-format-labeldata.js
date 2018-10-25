export default {
  name: "label-data",
  type: "map",
  detail: [
    {
      name: "properties",
      type: "list",
      detail: {
        type: "string"
      }
    },
    {
      name: "propValues",
      type: "varmap",
      detail: {
        type: "list",
        detail: {
          type: "string"
        }
      }
    },
    {
      name: "categories",
      type: "list",
      detail: {
        type: "string"
      }
    },
    {
      name: "tags",
      type: "list",
      detail: {
        type: "string"
      }
    }
  ]
};
