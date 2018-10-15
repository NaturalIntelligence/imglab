export class Shape {
  constructor({
    category,
    id,
    points,
    rbox,
    type,
    attributes = [],
    defaultZoomScale = 1,
    featurePoints = [],
    label = "unlabelled",
    tags = [],
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
    this.zoomScale = zoomScale;
    // default scale when image is at 100% zoom
    this.defaultZoomScale = defaultZoomScale;
  }
}
