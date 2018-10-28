export class Image {
  constructor({
    id,
    name = "",
    src = "",
    shapes = [],
    shapeIndex = 0,
    featurePointSize = 3,
    opacity = 1,
    size = {
      width: 0,
      height: 0,
      scaledWidth: 0,
      scaledHeight: 0,
      imageScale: 1
    }
  }) {
    this.id = id;
    this.name = name;
    this.src = src;
    this.size = size;
    this.shapes = shapes;
    this.shapeIndex = shapeIndex; // Used to generate new ids for copy pasted shapes
    this.featurePointSize = featurePointSize;
    this.opacity = opacity;
  }
}
