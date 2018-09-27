export function getCoordinates(event, element) {
  var rect = element.getBoundingClientRect();
  var x = event.pageX - rect.left;
  var y = event.pageY - rect.top;
  return {
    x: x,
    y: y
  };
}
