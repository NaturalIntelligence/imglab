import { Shape } from "../models/Shape";
import { FeaturePoint } from "../models/FeaturePoint";

/**
 * Scales the shape data based on scale
 * @param {String} id - id of shape
 * @param {String} label - label of shape
 * @param {Object} rbox - rbox of shape
 * @param {points[]} points - points that form the shape, e.g. 4 points of a rect
 * @param {Number} scale - scale used to rescale shape
 * @returns {Shape} scaled shape
 */
export function scaleShape({ id, type, rbox, points, scale }) {
  console.log("scaleShape", id, type, rbox, points, scale);
  return new Shape({
    id,
    type,
    rbox: scaleRbox(rbox, scale) || {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      width: 0,
      height: 0
    },
    points: scaleShapePoints(points, scale, type),
    defaultZoomScale: scale
  });
}

/**
 * Scales the points that make up the shape according to scale and type
 * @param {points[] | Array[points[]]} point
 * @param {number} scale
 * @param {string} type - type of shape
 * @returns {points[] | Array[points[]]} scaled points
 */
export function scaleShapePoints(points, scale) {
  if (!points) return;
  return points.map(point => point * scale);
}

/**
 * Scales the rbox of shape according to scale
 * @param {Object} rbox - rbox of shape
 * @param {Number} scale
 * @returns {Object} scaled rbox
 */
export function scaleRbox(rbox, scale) {
  if (!rbox) return;

  return {
    x: Math.floor(rbox.x * scale),
    y: Math.floor(rbox.y * scale),
    cx: Math.floor((rbox.cx || 0) * scale),
    cy: Math.floor((rbox.cy || 0) * scale),
    w: Math.floor(rbox.w * scale),
    h: Math.floor(rbox.h * scale),
    width: Math.floor(rbox.w * scale),
    height: Math.floor(rbox.h * scale)
  };
}

export function scaleFeaturePoint({ point, scale }) {
  return new FeaturePoint({
    cx: point.cx * scale,
    cy: point.cy * scale,
    label: point.label,
    id: point.id
  });
}
/**
 * Scales the feature points according to scale
 * @param {FeaturePoint[]} featurePoints - array of FeaturePoints
 * @param {Number} scale
 * @returns {FeaturePoint[]} array of scaled FeaturePoints
 */
export function scaleFeaturePoints(featurePoints, scale) {
  if (!featurePoints) return;

  return featurePoints.map(point => {
    return scaleFeaturePoint({ point, scale });
  });
}
