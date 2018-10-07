import {
  LABEL_TAG,
  CANVAS_TAG,
  RECTANGLE,
  CIRCLE,
  POLYGON,
  POINT,
  MOVE,
  ZOOM,
  OPACITY
} from "../../../utils/tool-names";
import { rectangle } from "../tools/rectangle";
import { circle } from "../tools/circle";
import { polygon } from "../tools/polygon";
import { point } from "../tools/point";
import { move } from "../tools/move-tool";
import { zoom } from "../tools/zoom";
import { opacity } from "../tools/opacity";

export const tools = {
  [LABEL_TAG]: {
    [POINT]: point,
    [RECTANGLE]: rectangle,
    [CIRCLE]: circle,
    [POLYGON]: polygon
  },
  [CANVAS_TAG]: {
    [MOVE]: move,
    [ZOOM]: zoom,
    [OPACITY]: opacity
  }
};
