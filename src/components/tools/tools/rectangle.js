export const rectangle = {
  type: "rect",
  title: "Rectangle",
  description: "Draw a rectanglular box",
  icon: "rectangle.svg",
  drawable: true,
  create: function(canvas) {
    let rect = canvas
      .nested()
      .rect()
      .addClass("labelbox shape");
    rect.resize();
    rect.parent().draggable();
    return rect;
  },
  validate: function(el) {
    return Number.parseInt(el.attr("width")) > 3;
  }
};
