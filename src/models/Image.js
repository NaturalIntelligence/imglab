export class Image {
  constructor({
    size = {
      width: 0,
      height: 0,
      scaledWidth: 0,
      scaledHeight: 0,
      imageScale: 1
    },
    name = "",
    src = "",
    attributes = [],
    tags = [],
    shapes = [],
    shapeIndex = 0,
    pointIndex = 0,
    featurePointSize = 3
  } = {}) {
    this.name = name;
    this.src = src;
    this.attributes = attributes;
    this.tags = tags;
    this.size = size;
    this.shapes = shapes;
    this.shapeIndex = shapeIndex; // Used to generate new ids for copy pasted shapes
    this.pointIndex = pointIndex; // Used to generate new ids for feature points
    this.featurePointSize = featurePointSize; //
  }
}
