import { RECTANGLE } from "../../../utils/tool-names";

export const rectangle = {
  type: RECTANGLE,
  title: RECTANGLE,
  description: "Draw a rectanglular box",
  drawable: true,
  actionable: false,
  icon: {
    isSVG: true,
    name: "rectangle.svg"
  },
  create: function({ canvas }) {
    let rect = canvas
      .nested()
      .rect()
      .addClass("labelbox shape")
      .resize();
    return rect;
  },
  validate: function(el) {
    return Number.parseInt(el.attr("width")) > 3;
  }
};
