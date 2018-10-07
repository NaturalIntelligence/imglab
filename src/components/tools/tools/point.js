import { POINT } from "../../../utils/tool-names";

export const point = {
  type: POINT,
  title: POINT,
  description: "Draw a point",
  drawable: false,
  actionable: false,
  icon: {
    isSVG: true,
    name: "point.svg"
  },
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
    // TODO: Specify style
    point.radius(featurePointRadius).addClass("labelpoint");
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
  // Get shape location
  var containerOffset = {
    x: parseInt(shape.parent().attr("x"), 10) || 0,
    y: parseInt(shape.parent().attr("y"), 10) || 0
  };
  // Label shape as parent of point
  var point = shape
    .parent()
    .circle()
    .radius(3)
    .attr({
      for: shape.node.id,
      cx: position.x - canvasOffset.x - containerOffset.x,
      cy: position.y - canvasOffset.y - containerOffset.y
    })
    .draggable()
    .addClass("labelpoint");
  // Assign a new type to point
  point.type = POINT;
  return point;
}
