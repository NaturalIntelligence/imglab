import { POLYGON } from "../../../utils/tool-names";
import { KEY } from "../../../utils/actions";

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
  create: function(canvas) {
    let polygon = canvas
      .nested()
      .polygon()
      .addClass("labelpolygon shape")
      .resize();
    // Custom event handler by svg.draw.js
    polygon.on("drawstart", function() {
      document.addEventListener("keydown", function(e) {
        // Once user hits enter
        if (e.keyCode == KEY.ENTER) {
          polygon.draw("done");
          polygon.off("drawstart");
          polygon.parent().draggable();
        }
      });
    });
    return polygon;
  },
  validate: function() {
    return true;
  }
};
