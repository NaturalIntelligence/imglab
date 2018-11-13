import { POLYGON, SHAPE } from "../../../utils/tool-names";
import { generateShapeID } from "../../../utils/app";

export const polygon = {
  type: SHAPE,
  title: POLYGON,
  description: "Draw a polygon",
  drawable: true,
  actionable: false,
  icon: {
    isSVG: true,
    name: "polygon.svg"
  },
  create: function({ canvas }) {
    let id = generateShapeID({ type: POLYGON });
    let polygon = canvas
      .nested()
      .polygon()
      .id(id)
      .addClass("labelpolygon shape")
      .resize();
    return polygon;
  },
  validate: function() {
    return true;
  }
};
