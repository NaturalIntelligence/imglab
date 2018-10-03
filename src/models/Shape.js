export class Shape {
  constructor({ id, type, rbox, points, defaultZoomScale = 1 } = {}) {
    this.id = id;
    this.label = "unlabelled";
    this.type = type;
    this.points = points;
    this.rbox = rbox;
    this.attributes = [];
    this.tags = [];
    this.featurePoints = [];
    this.zoomScale = 1;
    // default scale when image is at 100% zoom
    this.defaultZoomScale = defaultZoomScale;
  }
}
