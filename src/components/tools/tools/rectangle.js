import { RECTANGLE } from "../../../utils/tool-names";
import store from "../../../store/store";

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
    let index = store.getters["image-store/nextShapeHash"]();
    let id = RECTANGLE + "#" + index;
    let rect = canvas
      .nested()
      .rect()
      .id(id)
      .addClass("labelbox shape")
      .resize();
    return rect;
  },
  validate: function(el) {
    return Number.parseInt(el.attr("width")) > 3;
  }
};
