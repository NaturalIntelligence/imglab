import { CIRCLE } from "../../../utils/tool-names";
import store from "../../../store/store";

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
  create: function({ canvas }) {
    let index = store.getters["image-store/nextShapeHash"]();
    let id = CIRCLE + "#" + index;
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
