import { OPACITY, ZOOM } from "../action-names";
import ActionOpacity from "../actions/opacity";
import ActionZoom from "../actions/zoom";

export const actions = {
  [OPACITY]: ActionOpacity,
  [ZOOM]: ActionZoom
};
