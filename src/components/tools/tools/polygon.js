import { KEY } from "../../../utils/actions";

export const polygon = {
  type: "polygon",
  title: "Polygon",
  description: "Draw a polygon",
  icon: "polygon.svg",
  drawable: true,
  create: function(canvas) {
    let polygon = canvas
      .nested()
      .polygon()
      .addClass("labelpolygon shape");
    polygon.resize();
    polygon.parent().draggable();
    // Custom event handler by svg.draw.js
    polygon.on("drawstart", function() {
      document.addEventListener("keydown", function(e) {
        // Once user hits enter
        if (e.keyCode == KEY.ENTER) {
          polygon.draw("done");
          polygon.off("drawstart");
        }
      });
      return polygon;
    });
  },
  validate: function() {
    return true;
  }
};
