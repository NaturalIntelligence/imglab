<template lang="html">
  <div
    v-if="selectedShape"
    @click.stop="forceFocusOut"
  >
    <p class="mb-2">
      <small>
      Feature Points {{ featurePoints.length }}
      </small>
    </p>

    <div
      id="feature-points-list"
    >
      <ul id="fpoints-list">
        <li
          class="li-fpoints grey-border">
          <draggable v-model="featurePoints">
            <div
              v-for="featurePoint in featurePoints"
              class="d-flex align-items-center"
              :key="featurePoint.id"
            >
              <input
                type="text"
                class="form-control"
                placeholder="Label the feature point"
                style="width: 100px;"
                :class="{ focusInput : selectedFeaturePoints.includes(featurePoint.id) }"
                :ref="featurePoint.id"
                :value="featurePoint.label"
                @click.stop="onClick($event, featurePoint)"
                @change="setFeaturePointLabel($event, featurePoint)"
                @keyup.enter="setFeaturePointLabel($event, featurePoint)"
              >
              <font-awesome-icon
                :icon="['far', 'trash-alt']"
                style="font-size: 1.5em"
                @click.stop="deleteFeaturePoint(featurePoint.id)"
              >
              </font-awesome-icon>
            </div>
          </draggable>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { getSVG } from "../../../utils/app";

/**
 * Shows the list of shape feature points. Feature points can be reordered by
 * dragging the list item.
 */
export default {
  computed: {
    ...mapGetters("action-config", {
      selectedShape: "getSelectedShape",
      selectedFeaturePoints: "getSelectedFeaturePoints"
    }),

    ...mapGetters("image-store", {
      getFeaturePointByID: "getFeaturePointByID",
      getShapeFeaturePointIDs: "getShapeFeaturePointIDs",
      getShapeFeaturePoints: "getShapeFeaturePoints"
    }),

    /**
     * Computed getter and setter needed for draggable component
     */
    featurePoints: {
      get() {
        let shapeID = this.selectedShape;
        return shapeID && this.getShapeFeaturePoints(shapeID);
      },
      set(val) {
        let shapeID = this.selectedShape;
        this.updateFeaturePoints({
          shapeID,
          featurePoints: val
        });
      }
    }
  },
  methods: {
    ...mapMutations("image-store", {
      updateFeaturePoint: "updateFeaturePoint",
      updateFeaturePoints: "updateFeaturePoints"
    }),

    ...mapMutations("action-config", {
      addSelectedElement: "addSelectedElement",
      setSelectedElements: "setSelectedElements"
    }),

    /**
     * Removes feature point from canvas and store
     * @param {String} featurePointID - feature point id
     */
    deleteFeaturePoint(featurePointID) {
      let shapeID = this.selectedShape;

      // Deselect feature point and remove from canvas
      let svgFP = getSVG({ svg: this.$svg, id: featurePointID });
      svgFP.selectize(false);
      svgFP.remove();

      // Remove feature point from shape
      this.$store.commit("image-store/detachFeaturePoint", {
        shapeID,
        featurePointID
      });

      // Remove from list of selected feature points
      this.$store.commit("action-config/removeSelectedElement", {
        featurePointID
      });
    },

    /**
     * Deselect shape on canvas, does not remove shape from store
     */
    deselectShape() {
      let svgShape = getSVG({ svg: this.$svg, id: this.selectedShape });
      svgShape.selectize(false);
    },

    /**
     * Deselect and remove all feature points in selected shape
     */
    deselectShapeFeaturePoints() {
      this.selectedFeaturePoints.forEach(featurePointID => {
        let svgFP = getSVG({ svg: this.$svg, id: featurePointID });
        svgFP.selectize(false);
      });

      // Remove feature points from store
      this.setSelectedElements({ shapes: this.selectedShape });
    },

    /**
     * Handles behavior when list loses focus by clicking on the component
     */
    forceFocusOut() {
      this.deselectShapeFeaturePoints();
      let shape = getSVG({ svg: this.$svg, id: this.selectedShape });
      shape.selectize({ rotationPoint: false });
    },

    /**
     * Set selected elements (featurePoints) on click
     * @param {Event} event - click event
     * @param {FeaturePoint} featurePoint - featurePoint
     */
    onClick(event, featurePoint) {
      if (!event.ctrlKey) this.deselectShapeFeaturePoints();
      this.deselectShape();
      this.addSelectedElement({ featurePointID: featurePoint.id });
    },

    /**
     * Sets the feature point label
     * @param {Event} event - change / keyup.enter event
     * @param {FeaturePoint} featurePoint - FeaturePoint
     */
    setFeaturePointLabel(event, featurePoint) {
      // Stop if feature point label hasn't changed
      if (event.target.value === featurePoint.label) return;

      this.updateFeaturePoint({
        pointID: featurePoint.id,
        newLabel: event.target.value
      });
    }
  }
};
</script>

<style lang="css" scoped>
  .li-fpoints {
    margin: 5px 0px;
    border-radius: 6px;
    width: 100%;
    list-style: none;
  }

  #fpoints-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
    margin-bottom: 10px;
  }

  #feature-points-list {
    margin-top: 10px;
    overflow-x: auto;
  }

  .panel-wrapper {
    height: 100%;
  }

  .focusInput {
    box-shadow: 0 0 5px rgba(81, 203, 238, 1);
  }
</style>
