import { POLYGON } from "../../../utils/tool-names";
import store from "../../../store/store";

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
    let index = store.getters["image-store/nextShapeHash"]();
    let id = POLYGON + "#" + index;
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
