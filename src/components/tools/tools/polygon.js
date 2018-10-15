import { POLYGON } from "../../../utils/tool-names";

export const polygon = {
  type: POLYGON,
  title: POLYGON,
  description: "Draw a polygon",
  drawable: true,
  actionable: false,
  icon: {
    isSVG: true,
    name: "polygon.svg"
  },
  create: function({ canvas }) {
    let polygon = canvas
      .nested()
      .polygon()
      .addClass("labelpolygon shape")
      .resize();
    return polygon;
  },
  validate: function() {
    return true;
  }
};
