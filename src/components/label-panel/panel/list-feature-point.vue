<template lang="html">
  <div
    v-if="selectedShape"
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
              v-for="(featurePoint, index) in featurePoints"
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
import draggable from "vuedraggable";
import { removeFeaturePoint } from "../../../utils/actions";
import { _ } from "../../../utils/app";

export default {
  components: {
    draggable
  },
  computed: {
    ...mapGetters("action-config", {
      selectedShape: "getSelectedShape",
      selectedFeaturePoints: "getSelectedFeaturePoints"
    }),

    ...mapGetters("image-store", {
      getFeaturePointByID: "getFeaturePointByID",
      getShapeFeaturePointIDs: "getShapeFeaturePointIDs",
      getShapeFeaturePoints: "getShapeFeaturePoints",
      getFeaturePointByID: "getFeaturePointByID"
    }),

    /**
     * Computed getter and setter
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
      removeFeaturePoint: "detachFeaturePoint",
      updateFeaturePoint: "updateFeaturePoint",
      updateFeaturePoints: "updateFeaturePoints"
    }),

    ...mapMutations("action-config", {
      addSelectedElement: "addSelectedElement",
      setSelectedElements: "setSelectedElements"
    }),

    /**
     * Removes feature point from canvas and store
     * @see removeFeaturePoint @ actions.js for more details
     */
    deleteFeaturePoint(featurePointID) {
      let shapeID = this.selectedShape;
      removeFeaturePoint({
        shapeID,
        featurePointID,
        SVG: this.$svg,
        store: this.$store,
      });
    },

    /**
     * Deselect shape on canvas, does not remove shape from store
     */
    deselectShape() {
      let svgShape = this.$svg.get(this.selectedShape);
      svgShape.selectize(false);
    },

    /**
     * Deselect and remove all feature points in selected shape
     */
    deselectShapeFeaturePoints() {
      this.selectedFeaturePoints.forEach(featurePointID => {
        let svgFP = this.$svg.get(featurePointID);
        svgFP.selectize(false);
      })

      // Remove feature points from store
      this.setSelectedElements({ shapes: this.selectedShape });
    },

    /**
     * Set selected element on click
     * @param {Event} event - click event
     * @param {FeaturePoint} featurePoint - featurePoint clicked
     */
    onClick(event, featurePoint) {
      if (!event.ctrlKey) this.deselectShapeFeaturePoints();
      this.deselectShape();
      this.addSelectedElement({ featurePointID: featurePoint.id });
    },

    /**
     * Sets the feature point label after a delay
     */
    setFeaturePointLabel(event, featurePoint) {
      // Stop if feature point label hasn't changed
      if (event.target.value === featurePoint.label) return;

      this.updateFeaturePoint({
        pointID: featurePoint.id,
        newLabel: event.target.value
      })
    }
  },
  mounted() {
    _.on(document, "click", this.deselectShapeFeaturePoints);
  },
  destroyed() {
    _.off(document, "click", this.deselectShapeFeaturePoints);
  }
}
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
    overflow-x: hidden;
  }

  .focusInput {
    box-shadow: 0 0 5px rgba(81, 203, 238, 1);
  }
</style>
