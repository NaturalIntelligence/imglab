export const circle = {
  type: "circle",
  title: "Circle",
  description: "Draw a circle",
  icon: "circle.svg",
  drawable: true,
  create: function(canvas) {
    let circle = canvas
      .nested()
      .circle()
      .radius()
      .addClass("labelcircle shape");
    circle.resize();
    circle.parent().draggable();
    return circle;
  },
  validate: function(el) {
    return Number.parseInt(el.attr("r")) > 3;
  }
};
