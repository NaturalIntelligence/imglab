export default {
  name: "app-config",
  type: "map",
  detail: [
    {
      name: "autosave",
      type: "map",
      detail: [
        {
          name: "syncingInterval",
          type: "number"
        },
        {
          name: "enable",
          type: "boolean"
        },
        {
          name: "deleteIfExported",
          type: "boolean"
        }
      ]
    },
    {
      name: "zoomStepSize",
      type: "number"
    },
    {
      name: "opacityStepSize",
      type: "number"
    },
    {
      name: "featurePointColor",
      type: "string"
    }
  ]
};
