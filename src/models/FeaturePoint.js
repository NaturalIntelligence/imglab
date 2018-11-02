export class FeaturePoint {
  constructor({ cx = 0, cy = 0, id = "", label = "" } = {}) {
    this.cx = cx;
    this.cy = cy;
    this.id = id;
    this.label = label;
  }
}
