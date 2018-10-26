export class Shape {
  constructor({
    attributes = [],
    category = "",
    defaultZoomScale = 1,
    featurePoints = [],
    featurePointIndex = 0,
    id,
    label = "",
    points,
    rbox,
    tags = [],
    type,
    zoomScale = 1
  } = {}) {
    this.id = id;
    this.label = label;
    this.type = type;
    this.category = category;
    this.points = points;
    this.rbox = rbox;
    this.attributes = attributes;
    this.tags = tags;
    this.featurePoints = featurePoints;
    this.featurePointIndex = featurePointIndex;
    this.zoomScale = zoomScale;
    // default scale when image is at 100% zoom
    this.defaultZoomScale = defaultZoomScale;
  }
}
