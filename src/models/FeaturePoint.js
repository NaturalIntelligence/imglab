export class FeaturePoint {
  constructor({ x = 0, y = 0, id = "", label = "" } = {}) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.label = label;
  }
}
