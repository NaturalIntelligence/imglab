import imageStore from "../store/modules/image-store";

export class Shape {
  constructor({ id, type, bbox, points } = {}) {
    this.id = id;
    this.label = "unlabelled";
    this.type = type;
    this.points = points;
    this.bbox = bbox;
    this.attributes = [];
    this.tags = [];
    this.featurePoints = [];
    this.zoomScale = 1;

    let parentImage = imageStore.getters.getImageSelected();
    let imageScale = parentImage.size.imageScale;
    this.defaultZoomScale = 1 / imageScale;
  }
}
