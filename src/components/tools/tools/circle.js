import { CIRCLE, SHAPE } from "../../../utils/tool-names";
import { generateShapeID } from "../../../utils/app";

export const circle = {
  type: SHAPE,
  title: CIRCLE,
  description: "Draw a circle",
  drawable: true,
  actionable: false,
  icon: {
    isSVG: true,
    name: "circle.svg"
  },
  create: function({ canvas }) {
    let id = generateShapeID({ type: CIRCLE });
    let circle = canvas
      .nested()
      .circle()
      .radius()
      .id(id)
      .addClass("labelcircle shape")
      .resize();
    return circle;
  },
  validate: function(el) {
    return Number.parseInt(el.attr("r")) > 3;
  }
};
