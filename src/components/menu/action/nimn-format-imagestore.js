export default {
  name: "image-store",
  type: "map",
  detail: [
    {
      name: "images",
      type: "varmap",
      detail: {
        type: "map",
        detail: [
          {
            name: "name",
            type: "string"
          },
          {
            name: "src",
            type: "string"
          },
          {
            name: "size",
            type: "map",
            detail: [
              {
                name: "width",
                type: "number"
              },
              {
                name: "height",
                type: "number"
              },
              {
                name: "scaledWidth",
                type: "number"
              },
              {
                name: "scaledHeight",
                type: "number"
              },
              {
                name: "imageScale",
                type: "number"
              }
            ]
          },
          {
            name: "shapes",
            type: "list",
            detail: {
              type: "string"
            }
          },
          {
            name: "shapeIndex",
            type: "number"
          },
          {
            name: "pointIndex",
            type: "number"
          },
          {
            name: "featurePointSize",
            type: "number"
          },
          {
            name: "opacity",
            type: "number"
          }
        ]
      }
    },
    {
      name: "shapes",
      type: "varmap",
      detail: {
        type: "map",
        detail: [
          {
            name: "id",
            type: "string"
          },
          {
            name: "label",
            type: "string"
          },
          {
            name: "type",
            type: "string"
          },
          {
            name: "category",
            type: "string"
          },
          {
            name: "points",
            type: "list",
            detail: {
              type: "number"
            }
          },
          {
            name: "rbox",
            type: "map",
            detail: [
              {
                type: "number",
                name: "w"
              },
              {
                type: "number",
                name: "h"
              },
              {
                type: "number",
                name: "x2"
              },
              {
                type: "number",
                name: "y2"
              },
              {
                type: "number",
                name: "cx"
              },
              {
                type: "number",
                name: "cy"
              },
              {
                type: "number",
                name: "x"
              },
              {
                type: "number",
                name: "width"
              },
              {
                type: "number",
                name: "y"
              },
              {
                type: "number",
                name: "height"
              }
            ]
          },
          {
            name: "attributes",
            type: "list",
            detail: {
              type: "map",
              detail: [
                {
                  name: "key",
                  type: "string"
                },
                {
                  name: "property",
                  type: "string"
                },
                {
                  name: "value",
                  type: "string"
                }
              ]
            }
          },
          {
            name: "tags",
            type: "list",
            detail: {
              type: "string"
            }
          },
          {
            name: "featurePoints",
            type: "list",
            detail: {
              type: "string"
            }
          },
          {
            name: "zoomScale",
            type: "number"
          },
          {
            name: "defaultZoomScale",
            type: "number"
          }
        ]
      }
    },
    {
      name: "featurePoints",
      type: "varmap",
      detail: {
        type: "map",
        detail: [
          {
            name: "x",
            type: "number"
          },
          {
            name: "y",
            type: "number"
          },
          {
            name: "id",
            type: "string"
          },
          {
            name: "label",
            type: "string"
          }
        ]
      }
    }
  ]
};
