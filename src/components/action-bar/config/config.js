import { OPACITY, ZOOM, POINT } from "../../../utils/tool-names";
import ActionOpacity from "../actions/action-opacity";
import ActionZoom from "../actions/action-zoom";
import ActionFeaturePoint from "../actions/action-feature-point"

export const actions = {
  [OPACITY]: ActionOpacity,
  [ZOOM]: ActionZoom,
  [POINT]: ActionFeaturePoint
};
