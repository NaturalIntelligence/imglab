import { CIRCLE } from "../../../utils/tool-names";

export const circle = {
  type: CIRCLE,
  title: CIRCLE,
  description: "Draw a circle",
  drawable: true,
  actionable: false,
  icon: {
    isSVG: true,
    name: "circle.svg"
  },
  create: function(canvas) {
    let circle = canvas
      .nested()
      .circle()
      .radius()
      .addClass("labelcircle shape")
      .resize();
    circle.parent().draggable();
    return circle;
  },
  validate: function(el) {
    return Number.parseInt(el.attr("r")) > 3;
  }
};
