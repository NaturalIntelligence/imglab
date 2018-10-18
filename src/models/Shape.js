export class Shape {
  constructor({
    id,
    points,
    rbox,
    type,
    zoomScale = 1,
    defaultZoomScale = 1,
    label = "unlabelled",
    featurePoints = [],
    attributes = [],
    category = [],
    tags = []
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
