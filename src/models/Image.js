export class Image {
  constructor({
    size,
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
    this.size = {
      width: size.width,
      height: size.height,
      scaledWidth: size.scaledWidth || size.width,
      scaledHeight: size.scaledHeight || size.height,
      imageScale: size.imageScale || 1
    };
    this.shapes = shapes;
    this.shapeIndex = shapeIndex; // Used to generate new ids for copy pasted shapes
    this.pointIndex = pointIndex; // Used to generate new ids for feature points
    this.featurePointSize = featurePointSize; //
  }
}
