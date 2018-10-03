import { RECTANGLE, CIRCLE, POLYGON, POINT } from "../../../utils/tool-names";
import { rectangle } from "../tools/rectangle";
import { circle } from "../tools/circle";
import { polygon } from "../tools/polygon";
import { point } from "../tools/point";

export const tools = {
  [RECTANGLE]: rectangle,
  [CIRCLE]: circle,
  [POLYGON]: polygon,
  [POINT]: point
};
