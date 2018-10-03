export const point = {
  type: "point",
  title: "Point",
  description: "Draw a point",
  icon: "point.svg",
  drawable: true,
  /**
   * Create a point
   * @param {SVG.Container} canvas
   * @param {Event} event - mouse click event
   * @param {SVG.Shape} shape - SVG shape
   * @param {Number} featurePointRadius - radius of feature point
   */
  create: function({ canvas, event, shape, featurePointRadius }) {
    let canvasOffset = canvas.node.getBoundingClientRect();
    let point = drawPoint(event, shape, canvasOffset);
    point.radius(featurePointRadius);
    return point;
  },
  validate: function() {
    return true;
  }
};

/**
 * Helper function to draw a featurePoint on canvas,
 * Important: radius, and style must be set externally
 * @param {Event} position - click position
 * @param {SVG.Shape} shape - shape that should hold the featurePoint
 * @param {DOMReact | Object} canvasOffset - offset of canvas
 * @returns {SVG.Circle} - featurePoint SVG
 */
export function drawPoint(position, shape, canvasOffset) {
  // Get the parent svg element that surrounds the container
  var parentSvg = shape.parent();
  var containerOffset = {
    x: parseInt(parentSvg.attr("x"), 10) || 0,
    y: parseInt(parentSvg.attr("y"), 10) || 0
  };

  var point = shape
    .parent()
    .circle()
    .radius(1)
    .attr({
      cx: position.x - canvasOffset.x - containerOffset.x,
      cy: position.y - canvasOffset.y - containerOffset.y
    });
  point.draggable();
  return point;
}
